package rest

import (
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
)

type Response struct {
	Error    error
	response *http.Response
}

func (r *Response) Location() (*url.URL, error) {
	return r.response.Location()
}

func (r *Response) StatusCode() int {
	return r.response.StatusCode
}

func (r *Response) Body() io.ReadCloser {
	return r.response.Body
}

func (r *Response) ReadBody() ([]byte, error) {
	defer r.Body().Close()
	return ioutil.ReadAll(r.Body())
}
