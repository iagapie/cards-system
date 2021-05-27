package config

import (
	"github.com/iagapie/cards-system/api-service/pkg/logging"
	"github.com/iagapie/cards-system/api-service/pkg/manager"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"github.com/iagapie/cards-system/api-service/pkg/runner"
)

type Configuration struct {
	Server   runner.Config
	Log      logging.Config
	CORS     middleware.CORSConfig
	Limiter  middleware.LimiterConfig
	Recover  middleware.RecoverConfig
	JWTAuth  middleware.JWTAuthConfig `yaml:"jwt_auth" json:"jwt_auth"`
	JWTToken manager.JWTTokenConfig   `yaml:"jwt_token" json:"jwt_token"`
}
