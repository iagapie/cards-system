package board_service

import "time"

type IdDTO struct {
	ID     string `param:"id" validate:"required,uuid4"`
	UserID string `context:"claim_id" validate:"required,uuid4"`
}

type CreateBoardDTO struct {
	OwnerId     string `json:"owner_id,omitempty" context:"claim_id" validate:"required,uuid4"`
	Name        string `json:"name,omitempty" validate:"required,max=150"`
	Color       string `json:"color,omitempty" validate:"required,max=50"`
	Description string `json:"description,omitempty" validate:"max=1000"`
}

type UpdateBoardDTO struct {
	Name        string `json:"name,omitempty" validate:"required,max=150"`
	Color       string `json:"color,omitempty" validate:"required,max=50"`
	Description string `json:"description,omitempty" validate:"max=1000"`
}

type Member struct {
	UserID string `json:"user_id,omitempty"`
	Roles  []int  `json:"roles,omitempty"`
}

type Board struct {
	ID          string    `json:"id,omitempty"`
	OwnerID     string    `json:"owner_id,omitempty"`
	Name        string    `json:"name,omitempty"`
	Color       string    `json:"color,omitempty"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
	Members     []Member  `json:"members,omitempty"`
}

type BoardList struct {
	Boards []Board `json:"boards"`
}

type Role struct {
	ID   int    `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

type RoleList struct {
	Roles []Role `json:"roles,omitempty"`
}
