package middleware

import (
	"github.com/gorilla/mux"
	"net/http"
)

func Chain(handler ...mux.MiddlewareFunc) mux.MiddlewareFunc {
	return func(h http.Handler) http.Handler {
		for i := len(handler) - 1; i >= 0; i-- {
			h = handler[i](h)
		}
		return h
	}
}
