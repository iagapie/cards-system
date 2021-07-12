package category_service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/iagapie/cards-system/api-service/pkg/rest"
	"github.com/sirupsen/logrus"
	"net/http"
	"net/url"
	"strings"
)

var _ CategoryService = &client{}

const categoriesURL = "/api/v1/categories"

type CategoryService interface {
	Many(ctx context.Context, filter FilterDTO) (CategoryList, error)
	Create(ctx context.Context, dto CreateCategoryDTO) (string, error)
	Update(ctx context.Context, id string, userID string, boardID string, dto UpdateCategoryDTO) error
	UpdatePosition(ctx context.Context, dto UpdateCategoryListPositionDTO) error
}

type client struct {
	request rest.Request
}

func New(cfg rest.Config, log *logrus.Entry) CategoryService {
	return &client{
		request: rest.Request{
			Cfg:    cfg,
			Log:    log,
			Client: new(http.Client),
		},
	}
}

func (c *client) Many(ctx context.Context, filter FilterDTO) (CategoryList, error) {
	var list CategoryList

	c.request.Log.Debug("create query for rest context")
	query := make(url.Values)
	query.Set("limit", "50")

	if filter.BoardID != "" {
		query.Set("board", filter.BoardID)
	}

	if len(filter.CategoryIds) > 0 {
		query["category[]"] = filter.CategoryIds
	}

	c.request.Log.Debug("create timeout context")
	reqCtx, cancel := context.WithTimeout(ctx, c.request.Cfg.Timeout)
	defer cancel()

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:   reqCtx,
		URI:   categoriesURL,
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

func (c *client) Create(ctx context.Context, dto CreateCategoryDTO) (string, error) {
	c.request.Log.Debug("marshal create category dto to bytes")
	dataBytes, err := json.Marshal(dto)
	if err != nil {
		return "", fmt.Errorf("failed to marshal dto. error: %w", err)
	}

	c.request.Log.Debug("create timeout context")
	reqCtx, cancel := context.WithTimeout(ctx, c.request.Cfg.Timeout)
	defer cancel()

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:    reqCtx,
		URI:    categoriesURL,
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

func (c *client) Update(ctx context.Context, id string, userID string, boardID string, dto UpdateCategoryDTO) error {
	// TODO: check board permissions

	c.request.Log.Debug("marshal update category dto to bytes")
	dataBytes, err := json.Marshal(dto)
	if err != nil {
		return fmt.Errorf("failed to marshal dto. error: %w", err)
	}

	c.request.Log.Debug("create timeout context")
	reqCtx, cancel := context.WithTimeout(ctx, c.request.Cfg.Timeout)
	defer cancel()

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:    reqCtx,
		URI:    fmt.Sprintf("%s/%s", categoriesURL, id),
		Method: http.MethodPut,
		Body:   bytes.NewReader(dataBytes),
	}

	resp := c.request.Send(restCtx)

	return resp.Error
}

func (c *client) UpdatePosition(ctx context.Context, dto UpdateCategoryListPositionDTO) error {
	c.request.Log.Debug("create filter dto")
	data := make(map[string]int)
	ids := make([]string, 0, len(dto.Categories))
	for _, item := range dto.Categories {
		ids = append(ids, item.ID)
		data[item.ID] = item.Position
	}

	c.request.Log.Debug("fetch categories")
	list, err := c.Many(ctx, FilterDTO{CategoryIds: ids, BoardID: dto.BoardID})
	if err != nil {
		return fmt.Errorf("failed to get categories. error: %w", err)
	}
	if len(list.Categories) == 0 {
		return errors.New("categories not found")
	}

	for _, item := range list.Categories {
		c.request.Log.Infof("%d : %s - %s", item.Position, item.ID, item.Name)
	}
	for _, item := range list.Categories {
		err = c.Update(ctx, item.ID, dto.UserID, dto.BoardID, UpdateCategoryDTO{Name: item.Name, Position: data[item.ID]})
		if err != nil {
			return fmt.Errorf("failed to update category position. error: %w", err)
		}
	}

	return nil
}
