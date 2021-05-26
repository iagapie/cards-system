package middleware

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

type CORSConfig struct {
	// AllowOrigin defines a list of origins that may access the resource.
	// Optional. Default value []string{"*"}.
	AllowOrigins []string `yaml:"allow_origins" json:"allow_origins"`

	// AllowOriginFunc is a custom function to validate the origin. It takes the
	// origin as an argument and returns true if allowed or false otherwise. If
	// an error is returned, it is returned by the handler. If this option is
	// set, AllowOrigins is ignored.
	// Optional.
	AllowOriginFunc func(origin string) (bool, error) `yaml:"allow_origin_func" json:"allow_origin_func"`

	// AllowMethods defines a list methods allowed when accessing the resource.
	// This is used in response to a preflight request.
	// Optional. Default value DefaultCORSConfig.AllowMethods.
	AllowMethods []string `yaml:"allow_methods" json:"allow_methods"`

	// AllowHeaders defines a list of request headers that can be used when
	// making the actual request. This is in response to a preflight request.
	// Optional. Default value []string{}.
	AllowHeaders []string `yaml:"allow_headers" json:"allow_headers"`

	// AllowCredentials indicates whether or not the response to the request
	// can be exposed when the credentials flag is true. When used as part of
	// a response to a preflight request, this indicates whether or not the
	// actual request can be made using credentials.
	// Optional. Default value false.
	AllowCredentials bool `default:"false" yaml:"allow_credentials" json:"allow_credentials"`

	// ExposeHeaders defines a whitelist headers that clients are allowed to
	// access.
	// Optional. Default value []string{}.
	ExposeHeaders []string `yaml:"expose_headers" json:"expose_headers"`

	// MaxAge indicates how long (in seconds) the results of a preflight request
	// can be cached.
	// Optional. Default value 0.
	MaxAge int `default:"0" yaml:"max_age" json:"max_age"`
}

var DefaultCORSConfig = CORSConfig{
	AllowOrigins: []string{"*"},
	AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
}

func CORS(cfg CORSConfig, log logrus.FieldLogger) mux.MiddlewareFunc {
	if len(cfg.AllowOrigins) == 0 {
		cfg.AllowOrigins = DefaultCORSConfig.AllowOrigins
	}
	if len(cfg.AllowMethods) == 0 {
		cfg.AllowMethods = DefaultCORSConfig.AllowMethods
	}

	var allowOriginPatterns []string
	for _, origin := range cfg.AllowOrigins {
		pattern := regexp.QuoteMeta(origin)
		pattern = strings.Replace(pattern, "\\*", ".*", -1)
		pattern = strings.Replace(pattern, "\\?", ".", -1)
		pattern = "^" + pattern + "$"
		allowOriginPatterns = append(allowOriginPatterns, pattern)
	}

	allowMethods := strings.Join(cfg.AllowMethods, ",")
	allowHeaders := strings.Join(cfg.AllowHeaders, ",")
	exposeHeaders := strings.Join(cfg.ExposeHeaders, ",")
	maxAge := strconv.Itoa(cfg.MaxAge)

	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get(gof.HeaderOrigin)
			allowOrigin := ""

			preflight := r.Method == http.MethodOptions
			w.Header().Add(gof.HeaderVary, gof.HeaderOrigin)

			// No Origin provided
			if origin == "" {
				if !preflight {
					h.ServeHTTP(w, r)
					return
				}
				w.WriteHeader(http.StatusNoContent)
				return
			}

			if cfg.AllowOriginFunc != nil {
				allowed, err := cfg.AllowOriginFunc(origin)
				if err != nil {
					log.Error(gof.ErrInternalServerError.SetInternal(err).Log(log).Write(w))
					return
				}
				if allowed {
					allowOrigin = origin
				}
			} else {
				// Check allowed origins
				for _, o := range cfg.AllowOrigins {
					if o == "*" && cfg.AllowCredentials {
						allowOrigin = origin
						break
					}
					if o == "*" || o == origin {
						allowOrigin = o
						break
					}
					if matchSubdomain(origin, o) {
						allowOrigin = origin
						break
					}
				}

				// Check allowed origin patterns
				for _, re := range allowOriginPatterns {
					if allowOrigin == "" {
						didx := strings.Index(origin, "://")
						if didx == -1 {
							continue
						}
						domAuth := origin[didx+3:]
						// to avoid regex cost by invalid long domain
						if len(domAuth) > 253 {
							break
						}

						if match, _ := regexp.MatchString(re, origin); match {
							allowOrigin = origin
							break
						}
					}
				}
			}

			// Origin not allowed
			if allowOrigin == "" {
				if !preflight {
					h.ServeHTTP(w, r)
					return
				}
				w.WriteHeader(http.StatusNoContent)
				return
			}

			// Simple request
			if !preflight {
				w.Header().Set(gof.HeaderAccessControlAllowOrigin, allowOrigin)
				if cfg.AllowCredentials {
					w.Header().Set(gof.HeaderAccessControlAllowCredentials, "true")
				}
				if exposeHeaders != "" {
					w.Header().Set(gof.HeaderAccessControlExposeHeaders, exposeHeaders)
				}
				h.ServeHTTP(w, r)
				return
			}

			// Preflight request
			w.Header().Add(gof.HeaderVary, gof.HeaderAccessControlRequestMethod)
			w.Header().Add(gof.HeaderVary, gof.HeaderAccessControlRequestHeaders)
			w.Header().Set(gof.HeaderAccessControlAllowOrigin, allowOrigin)
			w.Header().Set(gof.HeaderAccessControlAllowMethods, allowMethods)
			if cfg.AllowCredentials {
				w.Header().Set(gof.HeaderAccessControlAllowCredentials, "true")
			}
			if allowHeaders != "" {
				w.Header().Set(gof.HeaderAccessControlAllowHeaders, allowHeaders)
			} else {
				h := r.Header.Get(gof.HeaderAccessControlRequestHeaders)
				if h != "" {
					w.Header().Set(gof.HeaderAccessControlAllowHeaders, h)
				}
			}
			if cfg.MaxAge > 0 {
				w.Header().Set(gof.HeaderAccessControlMaxAge, maxAge)
			}

			w.WriteHeader(http.StatusNoContent)
		})
	}
}

func matchScheme(domain, pattern string) bool {
	didx := strings.Index(domain, ":")
	pidx := strings.Index(pattern, ":")
	return didx != -1 && pidx != -1 && domain[:didx] == pattern[:pidx]
}

func matchSubdomain(domain, pattern string) bool {
	if !matchScheme(domain, pattern) {
		return false
	}
	didx := strings.Index(domain, "://")
	pidx := strings.Index(pattern, "://")
	if didx == -1 || pidx == -1 {
		return false
	}
	domAuth := domain[didx+3:]
	// to avoid long loop by invalid long domain
	if len(domAuth) > 253 {
		return false
	}
	patAuth := pattern[pidx+3:]

	domComp := strings.Split(domAuth, ".")
	patComp := strings.Split(patAuth, ".")
	for i := len(domComp)/2 - 1; i >= 0; i-- {
		opp := len(domComp) - 1 - i
		domComp[i], domComp[opp] = domComp[opp], domComp[i]
	}
	for i := len(patComp)/2 - 1; i >= 0; i-- {
		opp := len(patComp) - 1 - i
		patComp[i], patComp[opp] = patComp[opp], patComp[i]
	}

	for i, v := range domComp {
		if len(patComp) <= i {
			return false
		}
		p := patComp[i]
		if p == "*" {
			return true
		}
		if p != v {
			return false
		}
	}
	return false
}
