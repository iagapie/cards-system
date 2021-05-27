package middleware

import (
	"github.com/gorilla/mux"
	"github.com/iagapie/cards-system/user-service/pkg/gof"
	"github.com/sirupsen/logrus"
	"golang.org/x/time/rate"
	"net/http"
	"sync"
	"time"
)

type (
	LimiterConfig struct {
		Rate  int           `default:"10"`
		Burst int           `default:"2"`
		TTL   time.Duration `default:"10m"`
	}

	LimiterMemoryStore struct {
		visitors    map[string]*Visitor
		mutex       sync.Mutex
		rate        rate.Limit
		burst       int
		ttl         time.Duration
		lastCleanup time.Time
	}
	// Visitor signifies a unique user's limiter details
	Visitor struct {
		*rate.Limiter
		lastSeen time.Time
	}

	LimiterStore interface {
		Allow(identifier string) (bool, error)
	}
)

var (
	// ErrLimitExceeded denotes an error raised when rate limit is exceeded
	ErrLimitExceeded   = gof.ErrTooManyRequests.SetMessage("rate limit exceeded")
	ErrIdentifierError = gof.ErrForbidden.SetMessage("error while extracting identifier")
)

func Limiter(cfg LimiterConfig, log logrus.FieldLogger) mux.MiddlewareFunc {
	return LimiterWithStore(NewLimiterMemoryStore(cfg), log)
}

func LimiterWithStore(store LimiterStore, log logrus.FieldLogger) mux.MiddlewareFunc {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			identifier := r.Context().Value(ContextIP).(string)
			if identifier == "" {
				if err := ErrIdentifierError.Log(log).Write(w); err != nil {
					log.Error(err)
				}
				return
			}

			if allow, err := store.Allow(identifier); !allow {
				if err = ErrLimitExceeded.SetInternal(err).Log(log).Write(w); err != nil {
					log.Error(err)
				}
				return
			}

			h.ServeHTTP(w, r)
		})
	}
}

/*
NewLimiterMemoryStore returns an instance of LimiterMemoryStore
with the provided configuration. Rate must be provided. Burst will be set to the value of
the configured rate if not provided or set to 0.
The build-in memory store is usually capable for modest loads. For higher loads other
store implementations should be considered.
Characteristics:
* Concurrency above 100 parallel requests may causes measurable lock contention
* A high number of different IP addresses (above 16000) may be impacted by the internally used Go map
* A high number of requests from a single IP address may cause lock contention
Example:
	limiterStore := middleware.NewLimiterMemoryStore(
		middleware.LimiterConfig{Rate: 50, Burst: 200, TTL: 5 * time.Minutes},
	)
*/
func NewLimiterMemoryStore(cfg LimiterConfig) (store *LimiterMemoryStore) {
	store = &LimiterMemoryStore{}

	store.rate = rate.Limit(cfg.Rate)
	store.burst = cfg.Burst
	store.ttl = cfg.TTL
	if cfg.Burst == 0 {
		store.burst = cfg.Rate
	}
	store.visitors = make(map[string]*Visitor)
	store.lastCleanup = now()
	return
}

// Allow implements LimiterStore.Allow
func (store *LimiterMemoryStore) Allow(identifier string) (bool, error) {
	store.mutex.Lock()
	limiter, exists := store.visitors[identifier]
	if !exists {
		limiter = new(Visitor)
		limiter.Limiter = rate.NewLimiter(store.rate, store.burst)
		store.visitors[identifier] = limiter
	}
	limiter.lastSeen = now()
	if now().Sub(store.lastCleanup) > store.ttl {
		store.cleanupStaleVisitors()
	}
	store.mutex.Unlock()
	return limiter.AllowN(now(), 1), nil
}

/*
cleanupStaleVisitors helps manage the size of the visitors map by removing stale records
of users who haven't visited again after the configured expiry time has elapsed
*/
func (store *LimiterMemoryStore) cleanupStaleVisitors() {
	for id, visitor := range store.visitors {
		if now().Sub(visitor.lastSeen) > store.ttl {
			delete(store.visitors, id)
		}
	}
	store.lastCleanup = now()
}

/*
actual time method which is mocked in test file
*/
var now = time.Now
