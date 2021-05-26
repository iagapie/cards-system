package config

import (
	"github.com/iagapie/cards-system/api-service/pkg/logging"
	"github.com/iagapie/cards-system/api-service/pkg/runner"
)

type Configuration struct {
	Server runner.Config
	Log    logging.Config
}
