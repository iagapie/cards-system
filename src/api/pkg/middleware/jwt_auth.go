package middleware

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/cristalhq/jwt/v3"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type (
	JWTAuthConfig struct {
		Signing struct {
			// Signing key to validate token. Used as fallback if SigningKeys has length 0.
			// Required. This or SigningKeys.
			Key string `required:"true"`

			// Signing method, used to check token signing method.
			// Optional. Default value HS256.
			Method jwt.Algorithm `default:"HS256"`
		}

		ContextKey struct {
			Token  string `default:"token"`
			Claims string `default:"claims"`
			Claim  struct {
				ID      string `default:"claim_id"`
				Subject string `default:"claim_subject"`
			}
		}

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

		Issuer string `required:"true"`
	}

	jwtExtractor func(*http.Request) (string, *gof.HTTPError)
)

var (
	ErrJWTMissing = gof.ErrBadRequest.SetMessage("missing or malformed jwt")
	ErrJWTInvalid = gof.ErrUnauthorized.SetMessage("invalid or expired jwt")
)

func JWTAuth(cfg JWTAuthConfig, log logrus.FieldLogger) mux.MiddlewareFunc {
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

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			raw, httpErr := extractor(r)
			if httpErr != nil {
				httpErr.Log(log).Write(w)
				return
			}

			log.Debug("create jwt verifier")
			key := []byte(cfg.Signing.Key)
			verifier, err := jwt.NewVerifierHS(cfg.Signing.Method, key)
			if err != nil {
				ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
				return
			}

			log.Debug("parse and verify jwt token")
			token, err := jwt.ParseAndVerifyString(raw, verifier)
			if err != nil {
				ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
				return
			}

			log.Debug("parse and validate jwt claims")
			var claims jwt.RegisteredClaims
			err = json.Unmarshal(token.RawClaims(), &claims)
			if err != nil {
				ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
				return
			}
			if valid := claims.IsValidAt(time.Now()); !valid {
				err = errors.New("token has been expired")
				ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
				return
			}
			if valid := claims.IsIssuer(cfg.Issuer); !valid {
				err = errors.New("token iss is not valid")
				ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
				return
			}
			if claims.ID == "" {
				err = errors.New("token jti is empty")
				ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
				return
			}
			if claims.Subject == "" {
				err = errors.New("token sub is empty")
				ErrJWTInvalid.SetInternal(err).Log(log).Write(w)
				return
			}

			ctx := context.WithValue(r.Context(), cfg.ContextKey.Token, token)
			ctx = context.WithValue(ctx, cfg.ContextKey.Claims, claims)
			ctx = context.WithValue(ctx, cfg.ContextKey.Claim.ID, claims.ID)
			ctx = context.WithValue(ctx, cfg.ContextKey.Claim.Subject, claims.Subject)

			next.ServeHTTP(w, r.WithContext(ctx))
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
