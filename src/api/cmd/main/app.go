package main

import (
	gorilla "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/api-service/internal/client/card_service"
	"github.com/iagapie/cards-system/api-service/internal/client/category_service"
	"github.com/iagapie/cards-system/api-service/internal/client/file_service"
	"github.com/iagapie/cards-system/api-service/internal/client/space_service"
	"github.com/iagapie/cards-system/api-service/internal/client/tag_service"
	"github.com/iagapie/cards-system/api-service/internal/client/user_service"
	"github.com/iagapie/cards-system/api-service/internal/config"
	"github.com/iagapie/cards-system/api-service/internal/handlers"
	"github.com/iagapie/cards-system/api-service/internal/handlers/auth"
	"github.com/iagapie/cards-system/api-service/internal/handlers/cards"
	"github.com/iagapie/cards-system/api-service/internal/handlers/categories"
	"github.com/iagapie/cards-system/api-service/internal/handlers/files"
	"github.com/iagapie/cards-system/api-service/internal/handlers/spaces"
	"github.com/iagapie/cards-system/api-service/internal/handlers/tags"
	"github.com/iagapie/cards-system/api-service/internal/handlers/users"
	"github.com/iagapie/cards-system/api-service/pkg/cache/freecache"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/iagapie/cards-system/api-service/pkg/handlers/metric"
	"github.com/iagapie/cards-system/api-service/pkg/logging"
	"github.com/iagapie/cards-system/api-service/pkg/manager"
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
	log.Infoln("config and logger initialized")

	gof.SetMode(c.GetEnvironment())

	log.Infoln("cache initializing")
	refreshTokenCache := freecache.NewCacheRepo(104857600) // 100MB

	log.Infoln("JWT token manager initializing")
	jwtTokenManager := manager.NewJWTTokenManager(cfg.JWTToken, refreshTokenCache, log)

	log.Infoln("router initializing")
	router := mux.NewRouter()

	log.Infoln("create and register handlers")

	api := router.PathPrefix("/api").Subrouter()

	metricHandler := metric.Handler{NoHealth: true}
	metricHandler.Register(api)

	v1 := api.PathPrefix("/v1").Subrouter()

	authMiddleware := middleware.JWTAuth(cfg.JWTAuth, log)
	baseHandler := handlers.Handler{AuthMiddleware: authMiddleware, Log: log}

	userService := user_service.New(cfg.UserService, log)
	authHandler := auth.Handler{Handler: baseHandler, UserService: userService, TokenManager: jwtTokenManager}
	authHandler.Register(v1)
	usersHandler := users.Handler{Handler: baseHandler, UserService: userService}
	usersHandler.Register(v1)

	spaceService := space_service.New(cfg.SpaceService, log)
	spacesHandler := spaces.Handler{Handler: baseHandler, SpaceService: spaceService}
	spacesHandler.Register(v1)

	categoryService := category_service.New(cfg.CategoryService, log)
	categoriesHandler := categories.Handler{Handler: baseHandler, CategoryService: categoryService}
	categoriesHandler.Register(v1)

	tagService := tag_service.New(cfg.TagService, log)
	tagsHandler := tags.Handler{Handler: baseHandler, TagService: tagService}
	tagsHandler.Register(v1)

	cardService := card_service.New(cfg.CardService, log)
	cardsHandler := cards.Handler{Handler: baseHandler, CardService: cardService}
	cardsHandler.Register(v1)

	fileService := file_service.New(cfg.FileService, log)
	filesHandler := files.Handler{Handler: baseHandler, FileService: fileService}
	filesHandler.Register(v1)

	log.Infoln("register middlewares")
	router.Use(
		gorilla.ProxyHeaders,
		middleware.IP,
		middleware.Logger(log),
		middleware.Recover(cfg.Recover, log),
		middleware.Limiter(cfg.Limiter, log),
	)
	router.Use(middleware.CORS(cfg.CORS, router, log))
	v1.Use(middleware.CSRF(cfg.CSRF))

	log.Infoln("start application")
	runner.Run(cfg.Server, log, router)
}
