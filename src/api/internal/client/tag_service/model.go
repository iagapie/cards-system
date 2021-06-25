package tag_service

import "time"

type FilterDTO struct {
	BoardID string `query:"board" validate:"omitempty,uuid4"`
}

type Tag struct {
	ID        string    `json:"id,omitempty"`
	BoardID   string    `json:"board_id,omitempty"`
	Name      string    `json:"name,omitempty"`
	Color     string    `json:"color,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

type TagList struct {
	Tags []Tag `json:"tags"`
}
