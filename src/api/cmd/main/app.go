package main

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/config"
	"github.com/iagapie/cards-system/api-service/internal/handlers/auth"
	"github.com/iagapie/cards-system/api-service/pkg/logging"
	"github.com/iagapie/cards-system/api-service/pkg/runner"
	"github.com/iagapie/configor"
)

const (
	GlobalConfigFile = "/etc/feeder/config.yml"
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

	log.Println("router initializing")
	router := mux.NewRouter()

	log.Println("register middlewares")
	// TODO

	log.Println("create and register handlers")

	// TODO add metrics handlers

	authHandler := new(auth.Handler)
	authHandler.Register(router)

	log.Println("start application")
	runner.Run(cfg.Server, log, router)
}
