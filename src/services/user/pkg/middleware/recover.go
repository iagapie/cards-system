package middleware

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/user-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"net/http"
	"runtime"
)

type RecoverConfig struct {
	// Size of the stack to be printed.
	// Optional. Default value 4KB.
	StackSize int `default:"4" yaml:"stack_size" json:"stack_size"`

	// DisableStackAll disables formatting stack traces of all other goroutines
	// into buffer after the trace for the current goroutine.
	// Optional. Default value false.
	DisableStackAll bool `default:"false" yaml:"disable_stack_all" json:"disable_stack_all"`

	// DisablePrintStack disables printing stack trace.
	// Optional. Default value as false.
	DisablePrintStack bool `default:"false" yaml:"disable_print_stack" json:"disable_print_stack"`
}

func Recover(cfg RecoverConfig, log logrus.FieldLogger) mux.MiddlewareFunc {
	cfg.StackSize = cfg.StackSize << 10 // KB

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if r := recover(); r != nil {
					err, ok := r.(error)
					if !ok {
						err = fmt.Errorf("%v", r)
					}
					stack := make([]byte, cfg.StackSize)
					length := runtime.Stack(stack, !cfg.DisableStackAll)
					if !cfg.DisablePrintStack {
						msg := fmt.Sprintf("[PANIC RECOVER] %v %s\n", err, stack[:length])
						log.Error(msg)
					}

					if err = gof.ErrInternalServerError.SetInternal(err).Write(w); err != nil {
						log.Error(err)
					}
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}
