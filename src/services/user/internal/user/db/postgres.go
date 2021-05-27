package db

import (
	"context"
	"errors"
	"fmt"
	"github.com/iagapie/cards-system/user-service/internal/user"
	"github.com/iagapie/cards-system/user-service/pkg/postgresdb"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"strings"
	"time"
)

var _ user.Storage = &storage{}

type storage struct {
	db  *postgresdb.Database
	log logrus.Ext1FieldLogger
}

func NewStorage(postgres *postgresdb.Database, log logrus.Ext1FieldLogger) user.Storage {
	return &storage{
		db:  postgres,
		log: log,
	}
}

func toExpr(filter map[string]interface{}) []interface{} {
	exprs := make([]interface{}, 0)

	for key, value := range filter {
		if data, ok := value.([]string); ok {
			values := make([]interface{}, len(data))
			for i, item := range values {
				values[i] = item
			}
			exprs = append(exprs, clause.IN{Column: key, Values: values})
		} else if data, ok := value.([]*time.Time); ok {
			start, end := data[0], data[1]
			if start != nil {
				exprs = append(exprs, clause.Gte{Column: key, Value: value})
			}
			if end != nil {
				exprs = append(exprs, clause.Lte{Column: key, Value: value})
			}
		}
	}

	return exprs
}

func (s *storage) withFilter(filter map[string]interface{}) *gorm.DB {
	if exprs := toExpr(filter); len(exprs) > 0 {
		return s.db.Gorm.Where(exprs[0], exprs[1:]...)
	}
	return s.db.Gorm
}

func (s *storage) Count(ctx context.Context, filter map[string]interface{}) (int64, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var count int64
	if err := s.withFilter(filter).WithContext(ctx).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return 0, nil
}

func (s *storage) FindMany(ctx context.Context, filter map[string]interface{}, skip int64, limit int64) ([]user.User, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var data []user.User
	if err := s.withFilter(filter).WithContext(ctx).Limit(int(limit)).Offset(int(skip)).Order("updated_at DESC").Find(&data).Error; err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (s *storage) FindOne(ctx context.Context, uuid string) (user.User, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var model user.User
	if err := s.db.Gorm.WithContext(ctx).First(&model, "uuid = ?", uuid).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model, user.ErrRecordNotFound
		}
		return model, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return model, nil
}

func (s *storage) Create(ctx context.Context, model user.User) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := s.db.Gorm.WithContext(ctx).Create(&model).Error; err != nil {
		if strings.Contains(err.Error(), "23505") {
			return user.ErrRecordConflict
		}
		return fmt.Errorf("failed to execute query. error: %w", err)
	}

	s.log.Tracef("Created user: %s.\n", model.UUID)

	return nil
}

func (s *storage) Update(ctx context.Context, model user.User) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := s.db.Gorm.WithContext(ctx).Model(&model).Where("uuid = ?", model.UUID).Updates(model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user.ErrRecordNotFound
		}
		if strings.Contains(err.Error(), "23505") {
			return user.ErrRecordConflict
		}
		return fmt.Errorf("failed to execute query. error: %w", err)
	}

	s.log.Tracef("Matched and updated user: %s.\n", model.UUID)

	return nil
}

func (s *storage) Delete(ctx context.Context, uuid string) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := s.db.Gorm.WithContext(ctx).Delete(&user.User{}, "uuid = ?", uuid).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user.ErrRecordNotFound
		}
		return fmt.Errorf("failed to execute query. error: %w", err)
	}

	s.log.Tracef("Delete user: %s.\n", uuid)

	return nil
}
