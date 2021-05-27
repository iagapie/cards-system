package metric

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/user-service/pkg/gof"
	"net/http"
)

const (
	HeartbeatURL = "/api/heartbeat"
	PingURL      = "/api/ping"
	HealthURL    = "/api/health"

	StatusGreen  = "green"
	StatusOrange = "orange"
	StatusRed    = "red"
)

type (
	HealthDatabase interface {
		Ping() error
	}

	Handler struct {
		NoHeartbeat bool
		NoPing      bool
		NoHealth    bool
		DB          HealthDatabase
	}

	HealthResponse struct {
		Health   string `json:"health"`
		Database string `json:"database,omitempty"`
	}
)

func (h *Handler) Register(router *mux.Router) {
	if h.NoHeartbeat == false {
		router.HandleFunc(HeartbeatURL, h.Heartbeat).Methods(http.MethodGet)
	}

	if h.NoPing == false {
		router.HandleFunc(PingURL, h.Ping).Methods(http.MethodGet)
	}

	if h.NoHealth == false {
		router.HandleFunc(HealthURL, h.Health).Methods(http.MethodGet)
	}
}

func (h *Handler) Heartbeat(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) Ping(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("pong"))
}

func (h *Handler) Health(w http.ResponseWriter, req *http.Request) {
	status := http.StatusOK
	resp := HealthResponse{
		Health:   StatusGreen,
		Database: StatusGreen,
	}

	if h.DB == nil {
		resp.Database = ""
	} else if err := h.DB.Ping(); err != nil {
		status = http.StatusInternalServerError
		resp.Database = StatusRed
	}

	gof.JSON(w, status, resp)
}
