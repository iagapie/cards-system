package middleware

import (
	"context"
	"github.com/gorilla/mux"
	"net"
	"net/http"
)

const ContextIP = "ip"

func IP() mux.MiddlewareFunc {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ra, _, _ := net.SplitHostPort(r.RemoteAddr)
			ctx := context.WithValue(r.Context(), ContextIP, ra)
			h.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
