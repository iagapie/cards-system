package user

import (
	"context"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("user not found")
	ErrRecordConflict = errors.New("user already exists")
)

type Storage interface {
	Count(ctx context.Context, filter map[string]interface{}) (int64, error)
	FindMany(ctx context.Context, filter map[string]interface{}, skip int64, limit int64) ([]User, error)
	FindOne(ctx context.Context, uuid string) (User, error)
	Create(ctx context.Context, model User) error
	Update(ctx context.Context, model User) error
	Delete(ctx context.Context, uuid string) error
}
