package card_service

import (
	"github.com/iagapie/cards-system/api-service/pkg/rest"
	"github.com/sirupsen/logrus"
	"net/http"
)

var _ CardService = &client{}

type CardService interface {
}

type client struct {
	request rest.Request
}

func New(cfg rest.Config, log *logrus.Entry) CardService {
	return &client{
		request: rest.Request{
			Cfg:    cfg,
			Log:    log,
			Client: new(http.Client),
		},
	}
}
