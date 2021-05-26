package manager

import "time"

type RefreshToken struct {
	Token     string
	ExpiresAt time.Time
}

type TokenManager interface {
	New(subject string) (string, error)
	NewRefresh() RefreshToken
}
