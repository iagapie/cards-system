package main

import (
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/config"
	"github.com/iagapie/cards-system/api-service/internal/handlers/auth"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/handlers/metric"
	"github.com/iagapie/cards-system/api-service/pkg/logging"
	"github.com/iagapie/cards-system/api-service/pkg/middleware"
	"github.com/iagapie/cards-system/api-service/pkg/runner"
	"github.com/iagapie/configor"
)

const (
	GlobalConfigFile = "/etc/cards-system/api.yml"
	LocalConfigFile  = "configs/config.yml"
)

func main() {
	var cfg config.Configuration

	c := configor.New(nil)
	if err := c.Load(&cfg, GlobalConfigFile, LocalConfigFile); err != nil {
		panic(err)
	}

	log := logging.Create(cfg.Log)
	log.Println("config and logger initialized")

	cfg.JWTAuth.SigningKey = cfg.JWTToken.SigningKey
	gof.SetMode(c.GetEnvironment())

	log.Println("router initializing")
	router := mux.NewRouter()

	log.Println("register middlewares")
	router.Use(
		handlers.ProxyHeaders,
		middleware.IP(),
		middleware.Logger(log),
		middleware.Recover(cfg.Recover, log),
		middleware.Limiter(cfg.Limiter, log),
		middleware.CORS(cfg.CORS, log),
	)

	log.Println("create and register handlers")

	metricHandler := metric.Handler{NoHealth: true}
	metricHandler.Register(router)

	authHandler := auth.Handler{Log: log}
	authHandler.Register(router)

	log.Println("start application")
	runner.Run(cfg.Server, log, router)
}
