package boards

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/board_service"
	"github.com/iagapie/cards-system/api-service/internal/client/user_service"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"net/http"
)

const (
	boardsURL = "/boards"
	boardURL  = "/boards/{id}"
)

type Handler struct {
	handlers.Handler
	BoardService board_service.BoardService
}

func (h *Handler) Register(router *mux.Router) {
	router.Handle(boardsURL, h.Auth(h.GetBoards, user_service.AuthClaimsDTO{})).Methods(http.MethodGet, http.MethodOptions)
	router.Handle(boardsURL, h.Auth(h.CreateBoard, board_service.CreateBoardDTO{})).Methods(http.MethodPost, http.MethodOptions)
	router.Handle(boardURL, h.Auth(h.GetBoard, board_service.IdDTO{})).Methods(http.MethodGet, http.MethodOptions)
}

func (h *Handler) GetBoards(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("GET BOARDS")

	h.Log.Debug("get auth claims dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(user_service.AuthClaimsDTO)

	list, err := h.BoardService.Many(r.Context(), dto.UUID)
	if err != nil {
		return err
	}

	return gof.OK(w, list)
}

func (h *Handler) GetBoard(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("GET BOARD")

	h.Log.Debug("get id dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(board_service.IdDTO)

	board, err := h.BoardService.One(r.Context(), dto.ID, dto.UserID)
	if err != nil {
		return err
	}

	return gof.OK(w, board)
}

func (h *Handler) CreateBoard(w http.ResponseWriter, r *http.Request) error {
	h.Log.Info("CREATE BOARD")

	h.Log.Debug("get create board dto from context")
	dto := middleware.GetModelsFromContext(r)[0].(board_service.CreateBoardDTO)

	id, err := h.BoardService.Create(r.Context(), dto)
	if err != nil {
		return err
	}

	w.Header().Set(gof.HeaderLocation, fmt.Sprintf("%s/%s", r.URL.RequestURI(), id))
	w.WriteHeader(http.StatusCreated)

	return nil
}
