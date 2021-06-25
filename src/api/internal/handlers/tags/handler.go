package tags

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/tag_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"net/http"
)

const (
	tagsURL = "/tags"
	tagURL  = "/tags/{id}"
)

type Handler struct {
	handlers.Handler
	TagService tag_service.TagService
}

func (h *Handler) Register(router *mux.Router) {
	router.Handle(tagsURL, h.Auth(h.GetTags, tag_service.FilterDTO{})).Methods(http.MethodGet, http.MethodOptions)
}

func (h *Handler) GetTags(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("GET CATEGORIES")

	h.Log.Debug("get filter dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(tag_service.FilterDTO)

	list, err := h.TagService.Many(r.Context(), dto)
	if err != nil {
		return err
	}

	return gof.OK(w, list)
}
