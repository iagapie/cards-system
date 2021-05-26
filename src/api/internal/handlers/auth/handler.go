package auth

import (
	"github.com/gorilla/mux"
	"net/http"
)

const (
	api        = "/api"
	v1         = api + "/v1"
	signUpURL  = v1 + "/sign-up"
	verifyURL  = v1 + "/verify/{code}"
	signInURL  = v1 + "/sign-in"
	refreshURL = v1 + "/refresh"
)

type Handler struct {
}

func (h *Handler) Register(router *mux.Router) {
	router.HandleFunc(signUpURL, h.signUp).Methods(http.MethodPost)
	router.HandleFunc(verifyURL, h.verify).Methods(http.MethodPost)
	router.HandleFunc(signInURL, h.signIn).Methods(http.MethodPost)
	router.HandleFunc(refreshURL, h.refresh).Methods(http.MethodPost)
}

func (h *Handler) signUp(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) verify(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) signIn(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) refresh(w http.ResponseWriter, r *http.Request) {
}
