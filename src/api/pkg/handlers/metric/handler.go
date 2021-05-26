package metric

import (
	"github.com/gorilla/mux"
	"net/http"
)

const (
	URL = "/api/heartbeat"
)

type Handler struct {
}

func (h *Handler) Register(router *mux.Router) {
	router.HandleFunc(URL, h.Heartbeat).Methods(http.MethodGet)
}

func (h *Handler) Heartbeat(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(204)
}
