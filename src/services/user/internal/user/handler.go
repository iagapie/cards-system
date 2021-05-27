package user

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/user-service/pkg/gof"
	"github.com/iagapie/cards-system/user-service/pkg/middleware"
	"github.com/sirupsen/logrus"
	"net/http"
)

const (
	usersURL = "/api/v1/users"
	userURL  = "/api/v1/users/{uuid}"
	countURL = "/api/v1/users/count"
)

type (
	Handler struct {
		Service Service
		Log     logrus.FieldLogger
	}

	appHandler func(http.ResponseWriter, *http.Request) error
	m          map[string]interface{}
)

func (h *Handler) Register(router *mux.Router) {
	router.Handle(usersURL, h.middleware(h.GetUsers, FilterDTO{}, LimitDTO{})).Methods(http.MethodGet)
	router.Handle(usersURL, h.middleware(h.CreateUser, CreateUserDTO{})).Methods(http.MethodPost)
	router.Handle(countURL, h.middleware(h.CountUsers, FilterDTO{})).Methods(http.MethodGet)
	router.Handle(userURL, h.middleware(h.GetUser, IdDTO{})).Methods(http.MethodGet)
	router.Handle(userURL, h.middleware(h.PartiallyUpdateUser, UpdateUserDTO{})).Methods(http.MethodPatch)
	router.Handle(userURL, h.middleware(h.DeleteUser, IdDTO{})).Methods(http.MethodDelete)
}

func (h *Handler) middleware(ah appHandler, i ...interface{}) http.Handler {
	return middleware.Chain(
		middleware.Bind(gof.DefaultChainOfBinders, h.Log, i...),
		middleware.ValidateFromContext(middleware.ContextBindModels, h.Log),
	)(h.error(ah))
}

func (h *Handler) error(ah appHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := ah(w, r); err != nil {
			var httpError *gof.HTTPError
			switch err {
			case ErrRecordNotFound:
				httpError = gof.ErrNotFound.SetMessage(err.Error())
			case ErrRecordConflict:
				httpError = gof.ErrConflict.SetMessage(err.Error())
			default:
				httpError = gof.ErrTeapot.SetInternal(err)
			}

			if err = httpError.Log(h.Log).Write(w); err != nil {
				h.Log.Error(err)
			}
		}
	}
}

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("GET USERS")

	h.Log.Debug("get filter dto and limit dto from context")
	models := middleware.GetModelsFromContext(r)
	filter, limit := models[0].(FilterDTO), models[1].(LimitDTO)
	if limit.Limit == 0 {
		limit.Limit = 50
	}

	users, err := h.Service.GetMany(r.Context(), filter, limit)
	if err != nil {
		return err
	}

	return gof.OK(w, m{"users": users})
}

func (h *Handler) CountUsers(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("COUNT USERS")

	h.Log.Debug("get filter dto from context")
	filter := middleware.GetModelsFromContext(r)[0].(FilterDTO)

	total, err := h.Service.Count(r.Context(), filter)
	if err != nil {
		return err
	}

	return gof.OK(w, m{"total": total})
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("GET USER")

	h.Log.Debug("(user uuid) get id dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(IdDTO)

	user, err := h.Service.GetOne(r.Context(), dto.UUID)
	if err != nil {
		return err
	}

	return gof.OK(w, user)
}

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("CREATE USER")

	h.Log.Debug("get create user dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(CreateUserDTO)

	uuid, err := h.Service.Create(r.Context(), dto)
	if err != nil {
		return err
	}

	w.Header().Set(gof.HeaderLocation, fmt.Sprintf("%s/%s", usersURL, uuid))
	w.WriteHeader(http.StatusCreated)

	return nil
}

func (h *Handler) PartiallyUpdateUser(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("PARTIALLY UPDATE USER")

	h.Log.Debug("get update user dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(UpdateUserDTO)

	if err := h.Service.Update(r.Context(), dto); err != nil {
		return err
	}

	w.WriteHeader(http.StatusNoContent)

	return nil
}

func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("DELETE USER")

	h.Log.Debug("(user uuid) get id dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(IdDTO)

	if err := h.Service.Delete(r.Context(), dto.UUID); err != nil {
		return err
	}

	w.WriteHeader(http.StatusNoContent)

	return nil
}
