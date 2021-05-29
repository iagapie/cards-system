package auth

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/user_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/manager"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"net/http"
)

const (
	signUpURL  = "/sign-up"
	signInURL  = "/sign-in"
	refreshURL = "/refresh"
)

type Handler struct {
	handlers.Handler
	UserService  user_service.UserService
	TokenManager manager.TokenManager
}

func (h *Handler) Register(router *mux.Router) {
	router.Handle(signUpURL, h.Middleware(h.SignUp, user_service.CreateUserDTO{})).Methods(http.MethodPost, http.MethodOptions)
	router.Handle(signInURL, h.Middleware(h.SignIn, user_service.SignInDTO{})).Methods(http.MethodPost, http.MethodOptions)
	router.Handle(refreshURL, h.Middleware(h.Refresh, user_service.RefreshTokenDTO{})).Methods(http.MethodPost, http.MethodOptions)
}

func (h *Handler) SignUp(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("SIGN UP")

	h.Log.Debug("get create user dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(user_service.CreateUserDTO)

	user, err := h.UserService.Create(r.Context(), dto)
	if err != nil {
		return err
	}
	return h.session(w, user)
}

func (h *Handler) SignIn(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("SIGN IN")

	h.Log.Debug("get login dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(user_service.SignInDTO)

	user, err := h.UserService.GetByEmailAndPassword(r.Context(), dto.Email, dto.Password)
	if err != nil {
		return err
	}
	return h.session(w, user)
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("REFRESH TOKEN")

	h.Log.Debug("get refresh token dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(user_service.RefreshTokenDTO)

	token, err := h.TokenManager.UpdateRefreshToken(dto.Token)
	if err != nil {
		return err
	}

	return gof.OK(w, token)
}

func (h *Handler) session(w http.ResponseWriter, user user_service.User) error {
	token, err := h.TokenManager.GenerateAccessToken(user.UUID, user.Email)
	if err != nil {
		return err
	}

	return gof.OK(w, token)
}
