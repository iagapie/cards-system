package handlers

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"github.com/sirupsen/logrus"
	"net/http"
)

type AppHandler func(http.ResponseWriter, *http.Request) error

type Handler struct {
	AuthMiddleware mux.MiddlewareFunc
	Log            logrus.FieldLogger
}

func (h *Handler) Auth(ah AppHandler, i ...interface{}) http.Handler {
	return h.AuthMiddleware(h.Middleware(ah, i...))
}

func (h *Handler) Middleware(ah AppHandler, i ...interface{}) http.Handler {
	return middleware.Chain(
		middleware.Bind(gof.DefaultChainOfBinders, h.Log, i...),
		middleware.ValidateFromContext(middleware.ContextBindModels, h.Log),
	)(h.Error(ah))
}

func (h *Handler) Error(ah AppHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := ah(w, r); err != nil {
			httpError, ok := err.(*gof.HTTPError)
			if !ok {
				httpError = gof.ErrInternalServerError.SetInternal(err)
			}

			if err = httpError.Log(h.Log).Write(w); err != nil {
				h.Log.Error(err)
			}
		}
	}
}
