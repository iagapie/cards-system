package middleware

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"math"
	"net/http"
	"os"
	"time"
)

type (
	responseData struct {
		status int
		size   uint64
	}

	loggerResponseWriter struct {
		http.ResponseWriter
		responseData *responseData
	}
)

var timeFormat = "02/Jan/2006:15:04:05 -0700"

func (r *loggerResponseWriter) Write(b []byte) (int, error) {
	size, err := r.ResponseWriter.Write(b)
	r.responseData.size += uint64(size)
	return size, err
}

func (r *loggerResponseWriter) WriteHeader(statusCode int) {
	r.ResponseWriter.WriteHeader(statusCode)
	r.responseData.status = statusCode
}

func Logger(log logrus.FieldLogger, notlogged ...string) mux.MiddlewareFunc {
	var skip map[string]struct{}

	if length := len(notlogged); length > 0 {
		skip = make(map[string]struct{}, length)

		for _, path := range notlogged {
			skip[path] = struct{}{}
		}
	}

	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			path := r.URL.Path
			raw := r.URL.RawQuery

			resp := &responseData{
				status: 0,
				size:   0,
			}
			lw := loggerResponseWriter{
				ResponseWriter: w,
				responseData:   resp,
			}

			start := time.Now()
			next.ServeHTTP(&lw, r)
			stop := time.Since(start)

			if _, ok := skip[path]; ok {
				return
			}

			latency := int(math.Ceil(float64(stop.Nanoseconds()) / 1000000.0))
			method := r.Method
			referer := r.Referer()
			userAgent := r.UserAgent()
			ip := r.Context().Value(ContextIP)

			if raw != "" {
				path = path + "?" + raw
			}

			entry := log.WithFields(logrus.Fields{
				"method":     method,
				"path":       path,
				"statusCode": resp.status,
				"ip":         ip,
				"size":       resp.size,
				"latency":    latency, // time to process
				"referer":    referer,
				"userAgent":  userAgent,
			})

			msg := fmt.Sprintf(
				"%s - %s [%s] \"%s %s\" %d %d \"%s\" \"%s\" (%dms)",
				ip,
				hostname,
				time.Now().Format(timeFormat),
				method,
				path,
				resp.status,
				resp.size,
				referer,
				userAgent,
				latency,
			)

			if resp.status >= http.StatusInternalServerError {
				entry.Error(msg)
			} else if resp.status >= http.StatusBadRequest {
				entry.Warn(msg)
			} else {
				entry.Info(msg)
			}
		})
	}
}
