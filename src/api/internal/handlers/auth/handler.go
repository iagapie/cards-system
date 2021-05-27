package auth

import (
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"net/http"
)

const (
	signUpURL  = "/api/v1/sign-up"
	signInURL  = "/api/v1/sign-in"
	refreshURL = "/api/v1/refresh"
)

type Handler struct {
	Log logrus.FieldLogger
}

func (h *Handler) Register(router *mux.Router) {
	router.HandleFunc(signUpURL, h.SignUp).Methods(http.MethodPost)
	router.HandleFunc(signInURL, h.SignIn).Methods(http.MethodPost)
	router.HandleFunc(refreshURL, h.Refresh).Methods(http.MethodPost)
}

func (h *Handler) SignUp(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) SignIn(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
}
