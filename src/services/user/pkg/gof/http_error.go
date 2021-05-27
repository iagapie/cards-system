package gof

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/sirupsen/logrus"
	"net/http"
	"strings"
)

var (
	ErrBadRequest            = NewHTTPError(http.StatusBadRequest)
	ErrUnauthorized          = NewHTTPError(http.StatusUnauthorized)
	ErrForbidden             = NewHTTPError(http.StatusForbidden)
	ErrNotFound              = NewHTTPError(http.StatusNotFound)
	ErrMethodNotAllowed      = NewHTTPError(http.StatusMethodNotAllowed)
	ErrRequestTimeout        = NewHTTPError(http.StatusRequestTimeout)
	ErrConflict              = NewHTTPError(http.StatusConflict)
	ErrRequestEntityTooLarge = NewHTTPError(http.StatusRequestEntityTooLarge)
	ErrUnsupportedMediaType  = NewHTTPError(http.StatusUnsupportedMediaType)
	ErrTeapot                = NewHTTPError(http.StatusTeapot)
	ErrUnprocessableEntity   = NewHTTPError(http.StatusUnprocessableEntity)
	ErrTooManyRequests       = NewHTTPError(http.StatusTooManyRequests)
	ErrInternalServerError   = NewHTTPError(http.StatusInternalServerError)
	ErrBadGateway            = NewHTTPError(http.StatusBadGateway)
	ErrServiceUnavailable    = NewHTTPError(http.StatusServiceUnavailable)
	ErrInvalidRedirectCode   = errors.New("invalid redirect status code")
)

type HTTPError struct {
	Internal         error         `json:"-"`
	StatusCode       int           `json:"-"`
	Code             string        `json:"code,omitempty"`
	Message          string        `json:"message"`
	DeveloperMessage string        `json:"developer_message,omitempty"`
	Errors           []interface{} `json:"errors,omitempty"`
}

func NewHTTPError(statusCode int, data ...interface{}) *HTTPError {
	e := &HTTPError{StatusCode: statusCode, Message: http.StatusText(statusCode)}
	return e.Set(data...)
}

func (e *HTTPError) Set(data ...interface{}) *HTTPError {
	for _, i := range data {
		if msg, ok := i.(string); ok {
			_ = e.SetMessage(msg)
		} else if err, ok := i.(error); ok {
			_ = e.SetInternal(err)
		} else if errs, ok := i.([]interface{}); ok {
			_ = e.SetErrors(errs)
		}
	}
	return e
}

func (e *HTTPError) SetMessage(message string) *HTTPError {
	e.Message = message
	return e
}

func (e *HTTPError) SetInternal(err error) *HTTPError {
	e.Internal = err
	if IsDevMode() {
		e.DeveloperMessage = e.Error()
	}
	return e
}

func (e *HTTPError) SetErrors(errs []interface{}) *HTTPError {
	e.Errors = errs
	return e
}

func (e *HTTPError) Log(log logrus.FieldLogger) *HTTPError {
	if e.StatusCode >= http.StatusInternalServerError {
		log.Error(e.Error())
	} else if e.StatusCode >= http.StatusBadRequest {
		log.Warn(e.Error())
	} else {
		log.Info(e.Error())
	}
	return e
}

func (e *HTTPError) Error() string {
	data := []string{fmt.Sprintf("status_code=%d", e.StatusCode)}

	if e.Code != "" {
		data = append(data, fmt.Sprintf("code=%s", e.Code))
	}

	data = append(data, fmt.Sprintf("message=%s", e.Message))

	if e.Internal != nil {
		data = append(data, fmt.Sprintf("internal=%v", e.Internal))
	}

	if e.Errors != nil {
		data = append(data, fmt.Sprintf("internal=%v", e.Errors))
	}

	return strings.Join(data, ", ")
}

func (e *HTTPError) Unwrap() error {
	return e.Internal
}

func (e *HTTPError) Marshal() []byte {
	bytes, err := json.Marshal(e)
	if err != nil {
		return nil
	}
	return bytes
}

func (e *HTTPError) Write(w http.ResponseWriter) error {
	return JSON(w, e.StatusCode, e)
}
