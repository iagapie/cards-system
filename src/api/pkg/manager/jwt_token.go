package manager

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"time"
)

type (
	JWTTokenConfig struct {
		SigningKey string `required:"true" yaml:"signing_key" json:"signing_key"`
		TTL        struct {
			Access  time.Duration `default:"30m"`
			Refresh time.Duration `default:"8760h"` // 365 days
		}
	}

	JWTTokenManager struct {
		cfg JWTTokenConfig
	}
)

func NewJWTTokenManager(cfg JWTTokenConfig) *JWTTokenManager {
	return &JWTTokenManager{cfg: cfg}
}

func (m *JWTTokenManager) New(subject string) (string, error) {
	claims := jwt.StandardClaims{
		IssuedAt:  time.Now().Unix(),
		ExpiresAt: time.Now().Add(m.cfg.TTL.Access).Unix(),
		Subject:   subject,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(m.cfg.SigningKey))
}

func (m *JWTTokenManager) NewRefresh() RefreshToken {
	return RefreshToken{
		Token:     uuid.NewString(),
		ExpiresAt: time.Now().Add(m.cfg.TTL.Refresh),
	}
}
