package tags

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/tag_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
)

type Handler struct {
	handlers.Handler
	TagService tag_service.TagService
}

func (h *Handler) Register(router *mux.Router) {
}
