package runner

import (
	"context"
	"crypto/tls"
	"errors"
	"fmt"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/acme/autocert"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

type (
	LetsEncryptConfig struct {
		Enabled   bool   `default:"false"`
		AcceptTOS bool   `default:"false" yaml:"accept_tos" json:"accept_tos"`
		Cache     string `default:"data/certs"`
		Hosts     []string
	}

	SSLConfig struct {
		Enabled         bool              `default:"false"`
		RedirectToHTTPS bool              `default:"true" yaml:"redirect_to_https" json:"redirect_to_https"`
		ListenAddr      string            `default:"" yaml:"listen_addr" json:"listen_addr"`
		Port            int               `default:"443"`
		CertFile        string            `default:"" yaml:"cert_file" json:"cert_file"`
		CertKey         string            `default:"" yaml:"cert_key" json:"cert_key"`
		LetsEncrypt     LetsEncryptConfig `yaml:"lets_encrypt" json:"lets_encrypt"`
	}

	Config struct {
		ListenAddr         string        `default:"" yaml:"listen_addr" json:"listen_addr"`
		Port               int           `default:"80"`
		ReadTimeout        time.Duration `default:"10s" yaml:"read_timeout" json:"read_timeout"`
		WriteTimeout       time.Duration `default:"10s" yaml:"write_timeout" json:"write_timeout"`
		MaxHeaderMegabytes int           `default:"1" yaml:"max_header_megabytes" json:"max_header_megabytes"`
		KeepAlive          time.Duration `yaml:"keep_alive" json:"keep_alive"`
		SSL                SSLConfig
	}
)

const timeout = 5 * time.Second

func Run(cfg Config, log logrus.FieldLogger, router http.Handler) {
	httpHandler := router

	servers := make([]*http.Server, 0, 2)

	if cfg.SSL.Enabled {
		if cfg.SSL.RedirectToHTTPS {
			httpHandler = redirectToHTTPS(strconv.Itoa(cfg.SSL.Port))
		}

		addr := fmt.Sprintf("%s:%d", cfg.SSL.ListenAddr, cfg.SSL.Port)

		s := &http.Server{
			Addr:           addr,
			Handler:        router,
			ReadTimeout:    cfg.ReadTimeout,
			WriteTimeout:   cfg.WriteTimeout,
			MaxHeaderBytes: cfg.MaxHeaderMegabytes << 20,
		}

		if cfg.SSL.LetsEncrypt.Enabled {
			certManager := autocert.Manager{
				Prompt: func(tosURL string) bool {
					return cfg.SSL.LetsEncrypt.AcceptTOS
				},
				HostPolicy: autocert.HostWhitelist(cfg.SSL.LetsEncrypt.Hosts...),
				Cache:      autocert.DirCache(cfg.SSL.LetsEncrypt.Cache),
			}
			httpHandler = certManager.HTTPHandler(httpHandler)
			s.TLSConfig = &tls.Config{GetCertificate: certManager.GetCertificate}
		}

		servers = append(servers, s)

		go func() {
			log.Infof("Started Listening for TLS connection on %s", addr)
			listener := startListening(addr, cfg.KeepAlive, log)
			if err := s.ServeTLS(listener, cfg.SSL.CertFile, cfg.SSL.CertKey); err != nil {
				if errors.Is(err, http.ErrServerClosed) {
					log.Info("TLS runner shutdown")
				} else {
					log.Fatalf("Error occurred while running TLS runner: %v", err)
				}
			}
		}()
	}

	addr := fmt.Sprintf("%s:%d", cfg.ListenAddr, cfg.Port)
	server := &http.Server{
		Addr:           addr,
		Handler:        httpHandler,
		ReadTimeout:    cfg.ReadTimeout,
		WriteTimeout:   cfg.WriteTimeout,
		MaxHeaderBytes: cfg.MaxHeaderMegabytes << 20,
	}

	servers = append(servers, server)

	go func() {
		log.Infof("Started Listening for plain HTTP connection on %s", addr)
		listener := startListening(addr, cfg.KeepAlive, log)
		if err := server.Serve(listener); err != nil {
			if errors.Is(err, http.ErrServerClosed) {
				log.Info("HTTP runner shutdown")
			} else {
				log.Fatalf("Error occurred while running HTTP runner: %v", err)
			}
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGABRT, syscall.SIGQUIT, syscall.SIGHUP, os.Interrupt, syscall.SIGTERM)

	sig := <-quit

	log.Infof("Caught signal %s. Shutting down...", sig)

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	for _, s := range servers {
		if err := s.Shutdown(ctx); err != nil {
			log.Error(err)
		}
	}
}

func startListening(addr string, keepAlive time.Duration, log logrus.FieldLogger) net.Listener {
	lc := net.ListenConfig{KeepAlive: keepAlive}
	conn, err := lc.Listen(context.Background(), "tcp", addr)
	if err != nil {
		log.Fatal("Could not listen on", addr, err)
	}
	return conn
}

func redirectToHTTPS(port string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" && r.Method != "HEAD" {
			http.Error(w, "Use HTTPS", http.StatusBadRequest)
			return
		}

		target := "https://" + changePort(r.Host, port) + r.URL.RequestURI()
		http.Redirect(w, r, target, http.StatusFound)
	}
}

func changePort(hostPort, port string) string {
	host, _, err := net.SplitHostPort(hostPort)
	if err != nil {
		return hostPort
	}
	return net.JoinHostPort(host, port)
}
