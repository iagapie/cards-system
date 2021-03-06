package middleware

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/user-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"net/http"
	"reflect"
)

const ContextBindModels = "bind_models"

func GetModelsFromContext(r *http.Request) []interface{} {
	return r.Context().Value(ContextBindModels).([]interface{})
}

func Bind(binder gof.Binder, log logrus.FieldLogger, i ...interface{}) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			data := make([]interface{}, 0, len(i))

			for _, m := range i {
				t := reflect.TypeOf(m)
				if t.Kind() == reflect.Ptr {
					t = t.Elem()
				}

				item := reflect.New(t)

				if err := binder.Bind(r, item.Interface()); err != nil {
					httpErr, ok := err.(*gof.HTTPError)
					if !ok {
						httpErr = gof.ErrInternalServerError.SetInternal(err)
					}
					httpErr.Log(log).Write(w)
					return
				}

				data = append(data, item.Elem().Interface())
			}

			ctx := context.WithValue(r.Context(), ContextBindModels, data)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
