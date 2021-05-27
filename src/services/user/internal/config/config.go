package config

import (
	"github.com/iagapie/cards-system/user-service/pkg/logging"
	"github.com/iagapie/cards-system/user-service/pkg/middleware"
	"github.com/iagapie/cards-system/user-service/pkg/postgresdb"
	"github.com/iagapie/cards-system/user-service/pkg/runner"
)

type Configuration struct {
	Server  runner.Config
	Log     logging.Config
	CORS    middleware.CORSConfig
	Limiter middleware.LimiterConfig
	Recover middleware.RecoverConfig
	DB      postgresdb.Config
}
