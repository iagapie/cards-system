package manager

import (
	"encoding/json"
	"github.com/cristalhq/jwt/v3"
	"github.com/google/uuid"
	"github.com/iagapie/cards-system/api-service/pkg/cache"
	"github.com/sirupsen/logrus"
	"time"
)

var _ TokenManager = &jwtTokenManager{}

type (
	JWTTokenConfig struct {
		Signing struct {
			// Signing key to validate token. Used as fallback if SigningKeys has length 0.
			// Required. This or SigningKeys.
			Key string `required:"true"`

			// Signing method, used to check token signing method.
			// Optional. Default value HS256.
			Method jwt.Algorithm `default:"HS256"`
		}

		TTL struct {
			Access  time.Duration `default:"30m"`
			Refresh time.Duration `default:"8760h"` // 365 days
		}

		Issuer string `required:"true"`
	}

	jwtTokenManager struct {
		cfg   JWTTokenConfig
		cache cache.Repository
		log   logrus.FieldLogger
	}
)

func NewJWTTokenManager(cfg JWTTokenConfig, cache cache.Repository, log logrus.FieldLogger) TokenManager {
	return &jwtTokenManager{
		cfg:   cfg,
		cache: cache,
		log:   log,
	}
}

func (m *jwtTokenManager) GenerateAccessToken(id, subject string) (Tokens, error) {
	key := []byte(m.cfg.Signing.Key)
	signer, err := jwt.NewSignerHS(m.cfg.Signing.Method, key)
	if err != nil {
		return Tokens{}, err
	}
	builder := jwt.NewBuilder(signer)
	claims := jwt.RegisteredClaims{
		ID:        id,
		Subject:   subject,
		Issuer:    m.cfg.Issuer,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(m.cfg.TTL.Access)),
	}

	token, err := builder.Build(claims)
	if err != nil {
		return Tokens{}, err
	}

	m.log.Info("create refresh token")
	refreshToken := uuid.NewString()
	dataBytes, err := json.Marshal(map[string]string{
		"id":      id,
		"subject": subject,
	})
	if err != nil {
		return Tokens{}, err
	}
	err = m.cache.Set([]byte(refreshToken), dataBytes, int(m.cfg.TTL.Refresh.Seconds()))
	if err != nil {
		m.log.Error(err)
		return Tokens{}, err
	}

	return Tokens{
		AccessToken:  token.String(),
		RefreshToken: refreshToken,
	}, nil
}

func (m *jwtTokenManager) UpdateRefreshToken(refreshToken string) (Tokens, error) {
	defer m.cache.Del([]byte(refreshToken))

	dataBytes, err := m.cache.Get([]byte(refreshToken))
	if err != nil {
		return Tokens{}, err
	}

	var data map[string]string
	err = json.Unmarshal(dataBytes, &data)
	if err != nil {
		return Tokens{}, err
	}

	return m.GenerateAccessToken(data["id"], data["subject"])
}
