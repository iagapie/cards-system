package users

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"github.com/sirupsen/logrus"
	"net/http"
)

const (
	api   = "/api"
	v1    = api + "/v1"
	meURL = v1 + "/me"
)

type Handler struct {
	Log    logrus.FieldLogger
	CfgJWT middleware.JWTAuthConfig
}

func (h *Handler) Register(router *mux.Router) {
	router.Handle(meURL, h.middleware(h.me)).Methods(http.MethodGet)
}

func (h *Handler) middleware(hf http.HandlerFunc) http.Handler {
	return middleware.Chain(
		middleware.JWTAuth(h.CfgJWT, h.Log),
	)(hf)
}

func (h *Handler) me(w http.ResponseWriter, r *http.Request) {
}
