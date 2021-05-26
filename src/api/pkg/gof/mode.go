package gof

const (
	DevMode  = "development"
	ProdMode = "production"
	TestMode = "test"
)

var mode = DevMode

func SetMode(newMode string) {
	mode = newMode
}

func GetMode() string {
	return mode
}

func IsDevMode() bool {
	return GetMode() == DevMode || GetMode() == TestMode
}
