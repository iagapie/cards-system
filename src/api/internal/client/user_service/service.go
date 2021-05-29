package user_service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/rest"
	"github.com/sirupsen/logrus"
	"net/http"
	"net/url"
	"strings"
)

var _ UserService = &client{}

const usersURL = "/api/v1/users"

type UserService interface {
	GetByEmailAndPassword(ctx context.Context, email, password string) (User, error)
	GetByUUID(ctx context.Context, uuid string) (User, error)
	GetBy(ctx context.Context, query url.Values) (UserList, error)
	Create(ctx context.Context, dto CreateUserDTO) (User, error)
}

type client struct {
	request rest.Request
}

func New(cfg rest.Config, log *logrus.Entry) UserService {
	return &client{
		request: rest.Request{
			Cfg:    cfg,
			Log:    log,
			Client: new(http.Client),
		},
	}
}

func (c *client) GetByEmailAndPassword(ctx context.Context, email, password string) (User, error) {
	c.request.Log.Debug("create query for rest context")
	query := make(url.Values)
	query.Set("email", email)
	query.Set("password", password)
	query.Set("limit", "1")

	list, err := c.GetBy(ctx, query)
	if err != nil {
		return User{}, err
	}
	if len(list.Users) != 1 {
		return User{}, gof.ErrNotFound
	}

	return list.Users[0], nil
}

func (c *client) GetByUUID(ctx context.Context, uuid string) (User, error) {
	var user User

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx: ctx,
		URI: fmt.Sprintf("%s/%s", usersURL, uuid),
	}

	resp := c.request.Send(restCtx)
	if resp.Error != nil {
		return user, resp.Error
	}
	if err := json.NewDecoder(resp.Body()).Decode(&user); err != nil {
		return user, fmt.Errorf("failed to decode body response. error: %w", err)
	}
	return user, nil
}

func (c *client) GetBy(ctx context.Context, query url.Values) (UserList, error) {
	var list UserList

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:   ctx,
		URI:   usersURL,
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

func (c *client) Create(ctx context.Context, dto CreateUserDTO) (User, error) {
	c.request.Log.Debug("marshal create user dto to bytes")
	dataBytes, err := json.Marshal(dto)
	if err != nil {
		return User{}, fmt.Errorf("failed to marshal dto. error: %w", err)
	}

	c.request.Log.Debug("create rest context")
	restCtx := rest.Context{
		Ctx:    ctx,
		URI:    usersURL,
		Method: http.MethodPost,
		Body:   bytes.NewReader(dataBytes),
	}

	resp := c.request.Send(restCtx)
	if resp.Error != nil {
		return User{}, resp.Error
	}

	c.request.Log.Debug("parse location header")
	resURL, err := resp.Location()
	if err != nil {
		return User{}, fmt.Errorf("failed to get Location header. error: %w", err)
	}
	c.request.Log.Tracef("Location: %s", resURL.String())

	splitURL := strings.Split(resURL.String(), "/")
	uuid := splitURL[len(splitURL)-1]

	return c.GetByUUID(ctx, uuid)
}
