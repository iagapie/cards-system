package main

import (
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/user-service/internal/config"
	"github.com/iagapie/cards-system/user-service/internal/user"
	"github.com/iagapie/cards-system/user-service/internal/user/db"
	"github.com/iagapie/cards-system/user-service/pkg/gof"
	"github.com/iagapie/cards-system/user-service/pkg/handlers/metric"
	"github.com/iagapie/cards-system/user-service/pkg/logging"
	"github.com/iagapie/cards-system/user-service/pkg/middleware"
	"github.com/iagapie/cards-system/user-service/pkg/password"
	"github.com/iagapie/cards-system/user-service/pkg/postgresdb"
	"github.com/iagapie/cards-system/user-service/pkg/runner"
	"github.com/iagapie/configor"
)

const (
	GlobalConfigFile = "/etc/cards-system/user-service.yml"
	LocalConfigFile  = "configs/config.yml"
)

func main() {
	var cfg config.Configuration

	c := configor.New(nil)
	if err := c.Load(&cfg, GlobalConfigFile, LocalConfigFile); err != nil {
		panic(err)
	}

	log := logging.Create(cfg.Log)
	log.Infoln("config and logger initialized")

	gof.SetMode(c.GetEnvironment())

	log.Infoln("database initializing")
	postgres := postgresdb.New(cfg.DB, log)
	defer postgres.Close()

	log.Infoln("auto migrate")
	if err := postgres.Gorm.AutoMigrate(&user.User{}); err != nil {
		log.Fatal(err)
	}

	log.Infoln("storage initializing")
	storage := db.NewStorage(postgres, log)

	log.Infoln("password encoder initializing")
	encoder := password.NewDefault()

	log.Infoln("user service initializing")
	service := user.NewService(storage, encoder)

	log.Infoln("router initializing")
	router := mux.NewRouter()

	log.Infoln("create and register handlers")

	api := router.PathPrefix("/api").Subrouter()

	metricHandler := metric.Handler{DB: postgres}
	metricHandler.Register(api)

	v1 := api.PathPrefix("/v1").Subrouter()

	userHandler := user.Handler{Service: service, Log: log}
	userHandler.Register(v1)

	log.Infoln("register middlewares")
	router.Use(
		handlers.ProxyHeaders,
		middleware.IP,
		middleware.Logger(log),
		middleware.Recover(cfg.Recover, log),
	)

	log.Infoln("start application")
	runner.Run(cfg.Server, log, router)
}
