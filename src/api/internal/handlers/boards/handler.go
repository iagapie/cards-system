package boards

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/board_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
)

type Handler struct {
	handlers.Handler
	BoardService board_service.BoardService
}

func (h *Handler) Register(router *mux.Router) {
}
