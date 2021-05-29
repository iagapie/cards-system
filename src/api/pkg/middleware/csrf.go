package middleware

import (
	"fmt"
	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"
	"net/http"
	"strings"
	"time"
)

type CSRFConfig struct {
	Key            string        `required:"true"`
	TrustedOrigins []string      `yaml:"trusted_origins" json:"trusted_origins"`
	HeaderName     string        `default:"x-csrf-token" yaml:"header_name" json:"header_name"`
	CookieName     string        `default:"_cards_api_csrf" yaml:"cookie_name" json:"cookie_name"`
	MaxAge         time.Duration `default:"12h" yaml:"max_age" json:"max_age"`
	Domain         string
	Path           string
	HttpOnly       bool `yaml:"http_only" json:"http_only"`
	Secure         bool
	SameSite       string `default:"lax" yaml:"same_site" json:"same_site"`
}

func CSRF(cfg CSRFConfig) mux.MiddlewareFunc {
	var sameSite csrf.SameSiteMode
	switch strings.ToLower(cfg.SameSite) {
	case "lax":
		sameSite = csrf.SameSiteLaxMode
	case "strict":
		sameSite = csrf.SameSiteStrictMode
		break
	default:
		sameSite = csrf.SameSiteNoneMode
	}

	return func(next http.Handler) http.Handler {
		tokenHandler := func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set(cfg.HeaderName, csrf.Token(r))
			next.ServeHTTP(w, r)
		}

		errorHandler := func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set(cfg.HeaderName, csrf.Token(r))
			err := fmt.Sprintf("%s - %s", http.StatusText(http.StatusForbidden), csrf.FailureReason(r))
			http.Error(w, err, http.StatusForbidden)
		}

		return csrf.Protect(
			[]byte(cfg.Key),
			csrf.TrustedOrigins(cfg.TrustedOrigins),
			csrf.RequestHeader(cfg.HeaderName),
			csrf.CookieName(cfg.CookieName),
			csrf.MaxAge(int(cfg.MaxAge.Seconds())),
			csrf.Domain(cfg.Domain),
			csrf.Path(cfg.Path),
			csrf.HttpOnly(cfg.HttpOnly),
			csrf.Secure(cfg.Secure),
			csrf.SameSite(sameSite),
			csrf.ErrorHandler(http.HandlerFunc(errorHandler)),
		)(http.HandlerFunc(tokenHandler))
	}
}
