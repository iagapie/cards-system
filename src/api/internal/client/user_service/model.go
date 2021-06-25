package user_service

import "time"

type SignInDTO struct {
	Email    string `json:"email,omitempty" validate:"required,email,min=3,max=255"`
	Password string `json:"password,omitempty" validate:"required,min=8,max=64"`
}

type CreateUserDTO struct {
	Name           string `json:"name,omitempty" validate:"required,min=2,max=100"`
	Email          string `json:"email,omitempty" validate:"required,email,min=3,max=255"`
	Password       string `json:"password,omitempty" validate:"required,min=8,max=64"`
	RepeatPassword string `json:"repeat_password,omitempty" validate:"eqfield=Password"`
}

type RefreshTokenDTO struct {
	Token string `json:"token,omitempty" validate:"required,uuid4"`
}

type AuthClaimsDTO struct {
	UUID  string `context:"claim_id" validate:"required,uuid4"`
	Email string `context:"claim_subject" validate:"required,email"`
}

type FilterDTO struct {
	UUID []string `query:"uuid" validate:"omitempty,dive,uuid4"`
}

type User struct {
	UUID      string    `json:"uuid,omitempty"`
	Name      string    `json:"name,omitempty"`
	Email     string    `json:"email,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

type UserList struct {
	Users []User `json:"users,omitempty"`
}
