package middleware

import (
	"context"
	"net"
	"net/http"
)

const ContextIP = "ip"

func IP(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ra, _, _ := net.SplitHostPort(r.RemoteAddr)
		ctx := context.WithValue(r.Context(), ContextIP, ra)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
