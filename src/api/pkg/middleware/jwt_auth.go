package middleware

import (
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"net/http"
	"net/url"
	"reflect"
	"strings"
)

type (
	JWTAuthConfig struct {
		// Signing key to validate token. Used as fallback if SigningKeys has length 0.
		// Required. This or SigningKeys.
		SigningKey string `yaml:"signing_key" json:"signing_key"`

		// Map of signing keys to validate token with kid field usage.
		// Required. This or SigningKey.
		SigningKeys map[string]string `yaml:"signing_keys" json:"signing_keys"`

		// Signing method, used to check token signing method.
		// Optional. Default value HS256.
		SigningMethod string `default:"HS256" yaml:"signing_method" json:"signing_method"`

		// Context key to store user information from the token into context.
		// Optional. Default value "user".
		ContextKey string `default:"user" yaml:"context_key" json:"context_key"`

		// Claims are extendable claims data defining token content.
		// Optional. Default value jwt.MapClaims
		Claims jwt.Claims

		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "form:<name>"
		TokenLookup string `default:"header:Authorization" yaml:"token_lookup" json:"token_lookup"`

		// AuthScheme to be used in the Authorization header.
		// Optional. Default value "Bearer".
		AuthScheme string `default:"Bearer" yaml:"auth_scheme" json:"auth_scheme"`

		keyFunc jwt.Keyfunc
	}

	jwtExtractor func(*http.Request) (string, *gof.HTTPError)
)

var (
	ErrJWTMissing = gof.ErrBadRequest.SetMessage("missing or malformed jwt")
	ErrJWTInvalid = gof.ErrUnauthorized.SetMessage("invalid or expired jwt")
)

func JWTAuth(cfg JWTAuthConfig, log logrus.FieldLogger) mux.MiddlewareFunc {
	if cfg.SigningKey == "" && len(cfg.SigningKeys) == 0 {
		log.Panic("jwt middleware requires signing key")
	}

	if cfg.Claims == nil {
		cfg.Claims = jwt.MapClaims{}
	}

	cfg.keyFunc = func(t *jwt.Token) (interface{}, error) {
		// Check the signing method
		if t.Method.Alg() != cfg.SigningMethod {
			return nil, fmt.Errorf("unexpected jwt signing method=%v", t.Header["alg"])
		}
		if len(cfg.SigningKeys) > 0 {
			if kid, ok := t.Header["kid"].(string); ok {
				if key, ok := cfg.SigningKeys[kid]; ok {
					return []byte(key), nil
				}
			}
			return nil, fmt.Errorf("unexpected jwt key id=%v", t.Header["kid"])
		}

		return []byte(cfg.SigningKey), nil
	}

	parts := strings.Split(cfg.TokenLookup, ":")
	extractor := jwtFromHeader(parts[1], cfg.AuthScheme)
	switch parts[0] {
	case "query":
		extractor = jwtFromQuery(parts[1])
	case "cookie":
		extractor = jwtFromCookie(parts[1])
	case "form":
		extractor = jwtFromForm(parts[1])
	}

	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			auth, httpErr := extractor(r)
			if httpErr != nil {
				httpErr.Log(log).Write(w)
				return
			}

			token := new(jwt.Token)
			var err error

			if _, ok := cfg.Claims.(jwt.MapClaims); ok {
				token, err = jwt.Parse(auth, cfg.keyFunc)
			} else {
				t := reflect.ValueOf(cfg.Claims).Type().Elem()
				claims := reflect.New(t).Interface().(jwt.Claims)
				token, err = jwt.ParseWithClaims(auth, claims, cfg.keyFunc)
			}

			if err == nil && token.Valid {
				// Store user information from token into context.
				ctx := context.WithValue(r.Context(), cfg.ContextKey, token)
				h.ServeHTTP(w, r.WithContext(ctx))
				return
			}

			ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
		})
	}
}

// jwtFromHeader returns a `jwtExtractor` that extracts token from the request header.
func jwtFromHeader(header string, authScheme string) jwtExtractor {
	return func(r *http.Request) (string, *gof.HTTPError) {
		auth := r.Header.Get(header)
		l := len(authScheme)
		if len(auth) > l+1 && auth[:l] == authScheme {
			return auth[l+1:], nil
		}
		return "", ErrJWTMissing
	}
}

// jwtFromQuery returns a `jwtExtractor` that extracts token from the query string.
func jwtFromQuery(param string) jwtExtractor {
	return func(r *http.Request) (string, *gof.HTTPError) {
		token := gof.Query(r, param)
		if token == "" {
			return "", ErrJWTMissing
		}
		return token, nil
	}
}

// jwtFromCookie returns a `jwtExtractor` that extracts token from the named cookie.
func jwtFromCookie(name string) jwtExtractor {
	return func(r *http.Request) (string, *gof.HTTPError) {
		cookie, err := r.Cookie(name)
		if err != nil {
			return "", ErrJWTMissing.SetInternal(err)
		}
		val, _ := url.QueryUnescape(cookie.Value)
		return val, nil
	}
}

// jwtFromForm returns a `jwtExtractor` that extracts token from the form field.
func jwtFromForm(name string) jwtExtractor {
	return func(r *http.Request) (string, *gof.HTTPError) {
		field := gof.PostForm(r, name)
		if field == "" {
			return "", ErrJWTMissing
		}
		return field, nil
	}
}
