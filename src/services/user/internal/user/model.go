package user

import (
	"github.com/google/uuid"
	"time"
)

type User struct {
	UUID      string    `json:"uuid,omitempty" gorm:"primaryKey;size:36"`
	Name      string    `json:"name" gorm:"size:100"`
	Email     string    `json:"email" gorm:"uniqueIndex;size:255"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at" gorm:"index"`
	UpdatedAt time.Time `json:"updated_at" gorm:"index"`
}

func NewUser(dto CreateUserDTO) User {
	return User{
		UUID:      uuid.NewString(),
		Name:      dto.Name,
		Email:     dto.Email,
		Password:  dto.Password,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func (u *User) Update(dto UpdateUserDTO) {
	u.UpdatedAt = time.Now()
	u.Name = dto.Name
	u.Email = dto.Email
}

type FilterDTO struct {
	UUID     []string   `query:"uuid" validate:"omitempty,dive,uuid4"`
	Email    []string   `query:"email" validate:"omitempty,dive,email"`
	Password *string    `query:"password" validate:"omitempty,min=8,max=64"`
	Start    *time.Time `query:"start"`
	End      *time.Time `query:"end"`
}

func (f *FilterDTO) ToMap() map[string]interface{} {
	data := make(map[string]interface{})
	if len(f.UUID) > 0 {
		data["uuid"] = f.UUID
	}
	if len(f.Email) > 0 {
		data["email"] = f.Email
	}
	data["updated_at"] = []*time.Time{f.Start, f.End}
	return data
}

type LimitDTO struct {
	Skip  int64 `query:"skip" validate:"gte=0"`
	Limit int64 `query:"limit" validate:"gte=0,lte=100"`
}

type CreateUserDTO struct {
	Name           string `json:"name,omitempty" validate:"required,min=2,max=100"`
	Email          string `json:"email,omitempty" validate:"required,email,min=3,max=255"`
	Password       string `json:"password,omitempty" validate:"required,min=8,max=64"`
	RepeatPassword string `json:"repeat_password,omitempty" validate:"eqfield=Password"`
}

type UpdateUserDTO struct {
	UUID              string `param:"uuid" validate:"required,uuid4"`
	Name              string `json:"name,omitempty" validate:"max=100"`
	Email             string `json:"email,omitempty" validate:"max=255"`
	OldPassword       string `json:"old_password,omitempty" validate:"max=64"`
	NewPassword       string `json:"new_password,omitempty" validate:"required_with=OldPassword,omitempty,min=8,max=64"`
	RepeatNewPassword string `json:"repeat_new_password,omitempty" validate:"eqfield=NewPassword"`
}

type IdDTO struct {
	UUID string `param:"uuid" validate:"required,uuid4"`
}
