package categories

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/category_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"net/http"
)

const (
	categoriesURL = "/categories"
	categoryURL   = "/categories/{id}"
)

type Handler struct {
	handlers.Handler
	CategoryService category_service.CategoryService
}

func (h *Handler) Register(router *mux.Router) {
	router.Handle(categoriesURL, h.Auth(h.GetCategories, category_service.FilterDTO{})).Methods(http.MethodGet, http.MethodOptions)
	router.Handle(categoriesURL, h.Auth(h.CreateCategory, category_service.CreateCategoryDTO{})).Methods(http.MethodPost, http.MethodOptions)
}

func (h *Handler) GetCategories(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("GET CATEGORIES")

	h.Log.Debug("get filter dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(category_service.FilterDTO)

	list, err := h.CategoryService.Many(r.Context(), dto)
	if err != nil {
		return err
	}

	return gof.OK(w, list)
}

func (h *Handler) CreateCategory(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("CREATE CATEGORY")

	h.Log.Debug("get create category dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(category_service.CreateCategoryDTO)

	id, err := h.CategoryService.Create(r.Context(), dto)
	if err != nil {
		return err
	}

	w.Header().Set(gof.HeaderLocation, fmt.Sprintf("%s/%s", r.URL.RequestURI(), id))
	w.WriteHeader(http.StatusCreated)

	return nil
}
