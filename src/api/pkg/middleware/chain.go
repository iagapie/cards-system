package middleware

import (
	"github.com/gorilla/mux"
	"net/http"
)

func Chain(handler ...mux.MiddlewareFunc) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		for i := len(handler) - 1; i >= 0; i-- {
			next = handler[i](next)
		}
		return next
	}
}
