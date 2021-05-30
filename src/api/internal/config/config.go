package config

import (
	"github.com/iagapie/cards-system/api-service/pkg/logging"
	"github.com/iagapie/cards-system/api-service/pkg/manager"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"github.com/iagapie/cards-system/api-service/pkg/rest"
	"github.com/iagapie/cards-system/api-service/pkg/runner"
)

type Configuration struct {
	Server          runner.Config
	Log             logging.Config
	CORS            middleware.CORSConfig
	CSRF            middleware.CSRFConfig
	Limiter         middleware.LimiterConfig
	Recover         middleware.RecoverConfig
	JWTAuth         middleware.JWTAuthConfig `yaml:"jwt_auth" json:"jwt_auth"`
	JWTToken        manager.JWTTokenConfig   `yaml:"jwt_token" json:"jwt_token"`
	UserService     rest.Config              `yaml:"user_service" json:"user_service"`
	BoardService    rest.Config              `yaml:"board_service" json:"board_service"`
	CategoryService rest.Config              `yaml:"category_service" json:"category_service"`
	TagService      rest.Config              `yaml:"tag_service" json:"tag_service"`
	CardService     rest.Config              `yaml:"card_service" json:"card_service"`
	FileService     rest.Config              `yaml:"file_service" json:"file_service"`
}
