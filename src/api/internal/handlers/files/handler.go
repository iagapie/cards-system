package files

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/file_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
)

type Handler struct {
	handlers.Handler
	FileService file_service.FileService
}

func (h *Handler) Register(router *mux.Router) {
}
