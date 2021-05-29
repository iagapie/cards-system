package middleware

import (
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/user-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"net/http"
)

type ErrorField struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func ValidateFromContext(contextKey string, log logrus.FieldLogger) mux.MiddlewareFunc {
	v := validator.New()
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if data, ok := r.Context().Value(contextKey).([]interface{}); ok {
				for _, item := range data {
					if vErrs, ok := v.Struct(item).(validator.ValidationErrors); ok {
						errs := make([]interface{}, 0, len(vErrs))
						for _, f := range vErrs {
							errs = append(errs, ErrorField{
								Field:   f.Field(),
								Message: f.Error(),
							})
						}
						gof.ErrUnprocessableEntity.SetErrors(errs).Log(log).Write(w)
						return
					}
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
