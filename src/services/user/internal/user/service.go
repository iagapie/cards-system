package user

import (
	"context"
	"errors"
	"fmt"
	"github.com/iagapie/cards-system/user-service/pkg/password"
)

var _ Service = &service{}

type service struct {
	storage Storage
	encoder password.Encoder
}

func NewService(storage Storage, encoder password.Encoder) Service {
	return &service{
		storage: storage,
		encoder: encoder,
	}
}

type Service interface {
	Count(ctx context.Context, dto FilterDTO) (int64, error)
	GetMany(ctx context.Context, filterDTO FilterDTO, limitDTO LimitDTO) ([]User, error)
	GetOne(ctx context.Context, uuid string) (User, error)
	Create(ctx context.Context, dto CreateUserDTO) (string, error)
	Update(ctx context.Context, dto UpdateUserDTO) error
	Delete(ctx context.Context, uuid string) error
}

func (s *service) Count(ctx context.Context, dto FilterDTO) (int64, error) {
	count, err := s.storage.Count(ctx, dto.ToMap())
	if err != nil {
		return 0, fmt.Errorf("failed to count users. error: %w", err)
	}
	return count, nil
}

func (s *service) GetMany(ctx context.Context, filterDTO FilterDTO, limitDTO LimitDTO) ([]User, error) {
	data, err := s.storage.FindMany(ctx, filterDTO.ToMap(), limitDTO.Skip, limitDTO.Limit)
	if err != nil {
		return data, fmt.Errorf("failed to get users. error: %w", err)
	}
	if filterDTO.Password == nil {
		return data, nil
	}

	models := make([]User, 0)
	for _, item := range data {
		if s.encoder.IsValid(item.Password, *filterDTO.Password) {
			models = append(models, item)
		}
	}
	return models, nil
}

func (s *service) GetOne(ctx context.Context, uuid string) (User, error) {
	model, err := s.storage.FindOne(ctx, uuid)
	if err != nil {
		if errors.Is(err, ErrRecordNotFound) {
			return model, err
		}
		return model, fmt.Errorf("failed to get user. error: %w", err)
	}
	return model, nil
}

func (s *service) Create(ctx context.Context, dto CreateUserDTO) (string, error) {
	model, err := NewUser(dto, s.encoder)
	if err != nil {
		return "", fmt.Errorf("failed to create user. error: %w", err)
	}
	if err = s.storage.Create(ctx, model); err != nil {
		if errors.Is(err, ErrRecordConflict) {
			return "", err
		}
		return "", fmt.Errorf("failed to create user. error: %w", err)
	}
	return model.UUID, nil
}

func (s *service) Update(ctx context.Context, dto UpdateUserDTO) error {
	model, err := s.storage.FindOne(ctx, dto.UUID)
	if err != nil {
		if errors.Is(err, ErrRecordNotFound) {
			return err
		}
		return fmt.Errorf("failed to update user. error: %w", err)
	}

	if err = model.Update(dto, s.encoder); err != nil {
		return fmt.Errorf("failed to update user. error: %w", err)
	}

	if err = s.storage.Update(ctx, model); err != nil {
		if errors.Is(err, ErrRecordNotFound) || errors.Is(err, ErrRecordConflict) {
			return err
		}
		return fmt.Errorf("failed to update user. error: %w", err)
	}
	return nil
}

func (s *service) Delete(ctx context.Context, uuid string) error {
	if err := s.storage.Delete(ctx, uuid); err != nil {
		if errors.Is(err, ErrRecordNotFound) {
			return err
		}
		return fmt.Errorf("failed to delete user. error: %w", err)
	}

	return nil
}
