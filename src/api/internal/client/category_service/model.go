package category_service

import "time"

type FilterDTO struct {
	CategoryIds []string `query:"category"`
	BoardID     string   `query:"board" validate:"omitempty,uuid4"`
}

type CreateCategoryDTO struct {
	BoardID   string `json:"board_id,omitempty" validate:"required,uuid4"`
	Name      string `json:"name,omitempty" validate:"required,max=150"`
	Position  int    `json:"position,omitempty"`
	CreatedBy string `json:"created_by,omitempty" context:"claim_id" validate:"required,uuid4"`
}

type Category struct {
	ID          string    `json:"id,omitempty"`
	ParentID    string    `json:"parent_id,omitempty"`
	BoardID     string    `json:"board_id,omitempty"`
	CreatedBy   string    `json:"created_by,omitempty"`
	Name        string    `json:"name,omitempty"`
	Description string    `json:"description,omitempty"`
	Position    int       `json:"position"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
	Permissions []string  `json:"permissions"`
}

type CategoryList struct {
	Categories []Category `json:"categories"`
}
