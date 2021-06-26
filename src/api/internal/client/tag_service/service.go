package tag_service

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/iagapie/cards-system/api-service/pkg/rest"
	"github.com/sirupsen/logrus"
	"net/http"
	"net/url"
)

var _ TagService = &client{}

const tagsURL = "/api/v1/tags"

type TagService interface {
	Many(ctx context.Context, filter FilterDTO) (TagList, error)
}

type client struct {
	request rest.Request
}

func New(cfg rest.Config, log *logrus.Entry) TagService {
	return &client{
		request: rest.Request{
			Cfg:    cfg,
			Log:    log,
			Client: new(http.Client),
		},
	}
}

func (c *client) Many(ctx context.Context, filter FilterDTO) (TagList, error) {
	var list TagList

	c.request.Log.Debug("create query for rest context")
	query := make(url.Values)
	query.Set("limit", "50")

	if filter.BoardID != "" {
		query.Set("board", filter.BoardID)
	}

	c.request.Log.Debug("create timeout context")
	reqCtx, cancel := context.WithTimeout(ctx, c.request.Cfg.Timeout)
	defer cancel()

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:   reqCtx,
		URI:   tagsURL,
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
