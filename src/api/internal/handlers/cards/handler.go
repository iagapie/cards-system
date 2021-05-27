package cards

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/card_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
)

type Handler struct {
	handlers.Handler
	CardService card_service.CardService
}

func (h *Handler) Register(router *mux.Router) {
}
