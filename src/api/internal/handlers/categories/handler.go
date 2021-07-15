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
	router.Handle(categoriesURL, h.Auth(h.UpdatePosition, category_service.UpdateCategoryListPositionDTO{})).Methods(http.MethodPatch, http.MethodOptions)
	router.Handle(categoryURL, h.Auth(h.UpdateCategory, category_service.IdDTO{}, category_service.UpdateCategoryDTO{})).Methods(http.MethodPut, http.MethodOptions)
	router.Handle(categoryURL, h.Auth(h.DeleteCategory, category_service.IdDTO{})).Methods(http.MethodDelete, http.MethodOptions)
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

func (h *Handler) UpdatePosition(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("UPDATE CATEGORIES POSITION")

	h.Log.Debug("get update category list position dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(category_service.UpdateCategoryListPositionDTO)

	err := h.CategoryService.UpdatePosition(r.Context(), dto)
	if err != nil {
		return err
	}

	w.WriteHeader(http.StatusNoContent)

	return nil
}

func (h *Handler) UpdateCategory(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("UPDATE CATEGORY")

	h.Log.Debug("get id dto from context")
	idDto := middleware.GetModelsFromContext(r)[0].(category_service.IdDTO)

	h.Log.Debug("get update category dto from context")
	dto := middleware.GetModelsFromContext(r)[1].(category_service.UpdateCategoryDTO)

	err := h.CategoryService.Update(r.Context(), idDto.ID, idDto.UserID, dto)
	if err != nil {
		return err
	}

	w.WriteHeader(http.StatusNoContent)

	return nil
}

func (h *Handler) DeleteCategory(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("DELETE CATEGORY")

	h.Log.Debug("get id dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(category_service.IdDTO)

	err := h.CategoryService.Delete(r.Context(), dto.ID, dto.UserID)
	if err != nil {
		return err
	}

	w.WriteHeader(http.StatusNoContent)

	return nil
}
