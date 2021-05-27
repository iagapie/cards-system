package spaces

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/space_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
)

type Handler struct {
	handlers.Handler
	SpaceService space_service.SpaceService
}

func (h *Handler) Register(router *mux.Router) {
}
