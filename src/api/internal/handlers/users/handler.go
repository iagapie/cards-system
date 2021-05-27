package users

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/user_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"net/http"
)

const (
	meURL = "/api/v1/me"
)

type Handler struct {
	handlers.Handler
	UserService user_service.UserService
}

func (h *Handler) Register(router *mux.Router) {
	router.Handle(meURL, h.Auth(h.me, user_service.AuthClaimsDTO{})).Methods(http.MethodGet)
}

func (h *Handler) me(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("ME")

	h.Log.Debug("get auth claims dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(user_service.AuthClaimsDTO)

	user, err := h.UserService.GetByUUID(r.Context(), dto.UUID)
	if err != nil {
		return err
	}

	return gof.OK(w, user)
}
