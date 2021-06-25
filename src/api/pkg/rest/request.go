package rest

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/iagapie/cards-system/api-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"net/http"
	"net/url"
	"path"
	"sync"
	"time"
)

type Config struct {
	URL     string        `required:"true" yaml:"url" json:"url"`
	Timeout time.Duration `default:"10s"`
}

type Request struct {
	Cfg    Config
	Log    *logrus.Entry
	Client *http.Client
	mu     sync.Mutex
}

func (r *Request) Send(ctx Context) Response {
	r.Log.Debug("build url")
	reqURL, err := r.buildURL(ctx)
	if err != nil {
		return Response{Error: fmt.Errorf("failed to build URL. error: %w", err)}
	}
	r.Log.Tracef("url: %s", reqURL)

	r.Log.Debug("create timeout context")
	reqCtx, cancel := context.WithTimeout(ctx.Ctx, r.Cfg.Timeout)
	defer cancel()

	r.Log.Debug("create new request")
	req, err := http.NewRequestWithContext(reqCtx, ctx.Method, reqURL, ctx.Body)
	if err != nil {
		return Response{Error: fmt.Errorf("failed to create new request. error: %w", err)}
	}

	r.Log.Debug("add headers to request")
	req.Header.Set(gof.HeaderAccept, gof.MIMEApplicationJSONCharsetUTF8)
	req.Header.Set(gof.HeaderContentType, gof.MIMEApplicationJSONCharsetUTF8)

	for key, data := range ctx.Headers {
		req.Header.Del(key)
		for _, value := range data {
			req.Header.Add(key, value)
		}
	}

	r.Log.Debug("send request")
	return r.sendReq(req)
}

func (r *Request) sendReq(req *http.Request) Response {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.Client == nil {
		return Response{Error: errors.New("no http client")}
	}

	resp, err := r.Client.Do(req)
	if err != nil {
		return Response{Error: fmt.Errorf("failed to send request. error: %w", err)}
	}

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusBadRequest {
		httpErr := &gof.HTTPError{StatusCode: resp.StatusCode}

		defer resp.Body.Close()
		if err = json.NewDecoder(resp.Body).Decode(httpErr); err != nil {
			httpErr.SetMessage(http.StatusText(resp.StatusCode)).SetInternal(err)
		}

		if httpErr.Message == "" {
			httpErr.SetMessage(http.StatusText(resp.StatusCode))
		}

		return Response{Error: httpErr}
	}

	return Response{response: resp}
}

func (r *Request) buildURL(ctx Context) (string, error) {
	parsedURL, err := url.ParseRequestURI(r.Cfg.URL)
	if err != nil {
		return "", err
	}

	if ctx.URI != "" {
		parsedURL.Path = path.Join(parsedURL.Path, ctx.URI)
	}

	if len(ctx.Query) > 0 {
		parsedURL.RawQuery = ctx.Query.Encode()
	}

	return parsedURL.String(), nil
}
