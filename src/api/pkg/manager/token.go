package manager

type Tokens struct {
	AccessToken  string `json:"access_token,omitempty"`
	RefreshToken string `json:"refresh_token,omitempty"`
}

type TokenManager interface {
	GenerateAccessToken(id, subject string) (Tokens, error)
	UpdateRefreshToken(refreshToken string) (Tokens, error)
}
