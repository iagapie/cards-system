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
	usersURL = "/users"
	meURL    = "/me"
)

type Handler struct {
	handlers.Handler
	UserService user_service.UserService
}

func (h *Handler) Register(router *mux.Router) {
	router.Handle(usersURL, h.Auth(h.GetUsers, user_service.FilterDTO{})).Methods(http.MethodGet, http.MethodOptions)
	router.Handle(meURL, h.Auth(h.Me, user_service.AuthClaimsDTO{})).Methods(http.MethodGet, http.MethodOptions)
}

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("GET USERS")

	h.Log.Debug("get auth claims dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(user_service.FilterDTO)

	list, err := h.UserService.GetByFilter(r.Context(), dto)
	if err != nil {
		return err
	}

	return gof.OK(w, list)
}

func (h *Handler) Me(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("ME")

	h.Log.Debug("get auth claims dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(user_service.AuthClaimsDTO)

	user, err := h.UserService.GetByUUID(r.Context(), dto.UUID)
	if err != nil {
		return err
	}

	return gof.OK(w, user)
}
