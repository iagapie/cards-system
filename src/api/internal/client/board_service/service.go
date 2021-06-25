package board_service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/rest"
	"github.com/sirupsen/logrus"
	"net/http"
	"net/url"
	"strings"
)

var _ BoardService = &client{}

const boardsURL = "/api/v1/boards"

var memberNotFound = errors.New("member not found")

type BoardService interface {
	Many(ctx context.Context, userID string) (BoardList, error)
	One(ctx context.Context, id string, userID string) (Board, error)
	Create(ctx context.Context, dto CreateBoardDTO) (string, error)
	Update(ctx context.Context, id string, userID string, dto UpdateBoardDTO) error
	Delete(ctx context.Context, id string, userID string) error
}

type client struct {
	request rest.Request
}

func New(cfg rest.Config, log *logrus.Entry) BoardService {
	return &client{
		request: rest.Request{
			Cfg:    cfg,
			Log:    log,
			Client: new(http.Client),
		},
	}
}

func (c *client) Many(ctx context.Context, userID string) (BoardList, error) {
	return c.getBoards(ctx, userID)
}

func (c *client) getBoards(ctx context.Context, userID string, id ...string) (BoardList, error) {
	var list BoardList

	c.request.Log.Debug("create query for rest context")
	query := make(url.Values)
	query.Set("limit", "100")
	query.Set("column", "created_at")
	query.Set("direction", "asc")

	if userID != "" {
		query.Set("user_id", userID)
	}

	if len(id) > 0 {
		query["board_id"] = id
	}

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:   ctx,
		URI:   boardsURL,
		Query: query,
	}

	resp := c.request.Send(restCtx)
	if resp.Error != nil {
		return list, resp.Error
	}
	if err := json.NewDecoder(resp.Body()).Decode(&list); err != nil {
		return list, fmt.Errorf("failed to decode body response. error: %w", err)
	}

	return list, nil
}

func (c *client) One(ctx context.Context, id string, userID string) (Board, error) {
	var board Board

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx: ctx,
		URI: fmt.Sprintf("%s/%s", boardsURL, id),
	}

	resp := c.request.Send(restCtx)
	if resp.Error != nil {
		return board, resp.Error
	}
	if err := json.NewDecoder(resp.Body()).Decode(&board); err != nil {
		return board, fmt.Errorf("failed to decode body response. error: %w", err)
	}

	c.request.Log.Debug("check board permission")
	for _, v := range board.Members {
		if v.UserID == userID {
			return board, nil
		}
	}

	return board, gof.ErrNotFound.SetMessage("Not Found").SetInternal(memberNotFound)
}

func (c *client) Create(ctx context.Context, dto CreateBoardDTO) (string, error) {
	c.request.Log.Debug("marshal create board dto to bytes")
	dataBytes, err := json.Marshal(dto)
	if err != nil {
		return "", fmt.Errorf("failed to marshal dto. error: %w", err)
	}

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:    ctx,
		URI:    boardsURL,
		Method: http.MethodPost,
		Body:   bytes.NewReader(dataBytes),
	}

	resp := c.request.Send(restCtx)
	if resp.Error != nil {
		return "", resp.Error
	}

	c.request.Log.Debug("parse location header")
	resURL, err := resp.Location()
	if err != nil {
		return "", fmt.Errorf("failed to get Location header. error: %w", err)
	}
	c.request.Log.Tracef("Location: %s", resURL.String())

	splitURL := strings.Split(resURL.String(), "/")

	return splitURL[len(splitURL)-1], nil
}

func (c *client) Update(ctx context.Context, id string, userID string, dto UpdateBoardDTO) error {
	c.request.Log.Debug("check board permission")
	list, err := c.getBoards(ctx, userID, id)
	if err != nil {
		return err
	}
	if len(list.Boards) != 1 {
		return gof.ErrNotFound.SetInternal(memberNotFound)
	}

	c.request.Log.Debug("marshal update board dto to bytes")
	dataBytes, err := json.Marshal(dto)
	if err != nil {
		return fmt.Errorf("failed to marshal dto. error: %w", err)
	}

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:    ctx,
		URI:    fmt.Sprintf("%s/%s", boardsURL, id),
		Method: http.MethodPut,
		Body:   bytes.NewReader(dataBytes),
	}

	resp := c.request.Send(restCtx)

	return resp.Error
}

func (c *client) Delete(ctx context.Context, id string, userID string) error {
	c.request.Log.Debug("check board permission")
	list, err := c.getBoards(ctx, userID, id)
	if err != nil {
		return err
	}
	if len(list.Boards) != 1 {
		return gof.ErrNotFound.SetInternal(memberNotFound)
	}

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:    ctx,
		URI:    fmt.Sprintf("%s/%s", boardsURL, id),
		Method: http.MethodDelete,
	}

	resp := c.request.Send(restCtx)

	return resp.Error
}
