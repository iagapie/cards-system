package postgresdb

import (
	"fmt"
	"github.com/iagapie/cards-system/user-service/pkg/logging"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"time"
)

type (
	Config struct {
		Host     string `default:"localhost"`
		Port     uint   `default:"5432"`
		Name     string `required:"true" yaml:"name" json:"name"`
		User     string `required:"true"`
		Password string `required:"true"`
		SSLMode  string `default:"disable" yaml:"ssl_mode" json:"ssl_mode"`
		TimeZone string `default:"UTC" yaml:"time_zone" json:"time_zone"`
	}

	Database struct {
		Gorm   *gorm.DB
		logger logrus.Ext1FieldLogger
	}
)

func New(cfg Config, log logrus.Ext1FieldLogger) *Database {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port, cfg.SSLMode, cfg.TimeZone,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.New(log, logger.Config{
			SlowThreshold: 200 * time.Millisecond,
			LogLevel:      toGormLogLevel(logging.GetLevel(log)),
			Colorful:      false,
		}),
	})
	if err != nil {
		log.Panic(err)
	}

	return &Database{Gorm: db, logger: log}
}

func (d *Database) Ping() error {
	db, err := d.Gorm.DB()
	if err != nil {
		d.logger.Error(err)
		return err
	}
	return db.Ping()
}

func (d *Database) Close() {
	db, err := d.Gorm.DB()

	if err != nil {
		d.logger.Error(err)
		return
	}

	if err = db.Close(); err != nil {
		d.logger.Error(err)
	}
}

func toGormLogLevel(lvl logrus.Level) logger.LogLevel {
	switch lvl {
	case logrus.FatalLevel, logrus.PanicLevel, logrus.ErrorLevel:
		return logger.Error
	case logrus.WarnLevel:
		return logger.Warn
	}
	return logger.Info
}
