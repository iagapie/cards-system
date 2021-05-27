package logging

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

const (
	WriterStderr = "stderr"
	WriterStdout = "stdout"
)

type (
	WriterConfig struct {
		Name   string   `default:"stdout" required:"true"` // path/file.log, stderr, stdout
		Levels []string `yaml:"levels" json:"levels"`
	}

	Config struct {
		Level     string         `default:"info" yaml:"level" json:"level"`
		Formatter string         `default:"text" yaml:"formatter" json:"formatter"`
		Fields    logrus.Fields  `yaml:"fields" json:"fields"`
		Writers   []WriterConfig `yaml:"writers" json:"writers"`
	}

	hook struct {
		Writer    io.Writer
		LogLevels []logrus.Level
	}
)

func Create(cfg Config) *logrus.Entry {
	lr := logrus.New()

	lvl, err := logrus.ParseLevel(cfg.Level)
	if err != nil {
		panic(err)
	}

	lr.SetOutput(ioutil.Discard)
	lr.SetLevel(lvl)

	if strings.ToLower(cfg.Formatter) == "json" {
		lr.SetFormatter(new(logrus.JSONFormatter))
	}

	for _, c := range cfg.Writers {
		lr.AddHook(getHook(c))
	}

	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}

	if cfg.Fields == nil {
		cfg.Fields = make(logrus.Fields)
	}
	cfg.Fields["hostname"] = hostname

	return lr.WithFields(cfg.Fields)
}

func (h *hook) Fire(entry *logrus.Entry) error {
	line, err := entry.Bytes()

	if err != nil {
		return err
	}

	_, err = h.Writer.Write(line)
	return err
}

func (h *hook) Levels() []logrus.Level {
	return h.LogLevels
}

func getHook(cfg WriterConfig) *hook {
	return &hook{
		Writer:    getWriter(cfg.Name),
		LogLevels: parseLevels(cfg.Levels),
	}
}

func getWriter(writer string) *os.File {
	switch writer {
	case WriterStdout:
		return os.Stdout
	case WriterStderr:
		return os.Stderr
	default:
		return getFile(writer)
	}
}

func getFile(writer string) *os.File {
	if writer == "" {
		panic("Writer name is empty")
	}

	if err := os.MkdirAll(filepath.Dir(writer), 0755); err != nil {
		panic("Can't create log dir. no configured logging to files")
	}

	file, err := os.OpenFile(writer, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0660)
	if err != nil {
		panic(fmt.Sprintf("[Error]: %s", err))
	}
	return file
}

func parseLevels(data []string) []logrus.Level {
	if len(data) == 0 {
		return logrus.AllLevels
	}

	levels := make([]logrus.Level, 0, len(data))
	for _, l := range data {
		if lvl, err := logrus.ParseLevel(l); err == nil {
			levels = append(levels, lvl)
		}
	}
	return levels
}
