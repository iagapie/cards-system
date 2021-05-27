package category_service

import (
	"github.com/iagapie/cards-system/api-service/pkg/rest"
	"github.com/sirupsen/logrus"
	"net/http"
)

var _ CategoryService = &client{}

type CategoryService interface {
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
