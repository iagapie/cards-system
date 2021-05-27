package rest

import (
	"context"
	"io"
	"net/http"
	"net/url"
)

type Context struct {
	Ctx     context.Context
	Headers http.Header
	Method  string
	URI     string
	Query   url.Values
	Body    io.Reader
}
