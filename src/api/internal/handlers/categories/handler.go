package categories

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/category_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
)

type Handler struct {
	handlers.Handler
	CategoryService category_service.CategoryService
}

func (h *Handler) Register(router *mux.Router) {
}
