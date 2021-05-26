package gof

import (
	"encoding/json"
	"encoding/xml"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"net/url"
	"reflect"
	"strconv"
	"strings"
)

type Binder interface {
	Bind(r *http.Request, i interface{}) error
}

type BindGetterFunc func(interface{}) (interface{}, bool)

type (
	queryBinder   struct{}
	paramBinder   struct{}
	headerBinder  struct{}
	contextBinder struct{}
	bodyBinder    struct{}
	BinderList    struct {
		binders []Binder
	}
)

var (
	QueryBinder           = new(queryBinder)
	ParamBinder           = new(paramBinder)
	HeaderBinder          = new(headerBinder)
	ContextBinder         = new(contextBinder)
	BodyBinder            = new(bodyBinder)
	DefaultChainOfBinders = NewChain(QueryBinder, ParamBinder, HeaderBinder, ContextBinder, BodyBinder)

	ErrBindNoStruct = errors.New("binding element must be a struct")
)

func NewChain(binders ...Binder) *BinderList {
	return new(BinderList).Add(binders...)
}

func (b *BinderList) Add(binders ...Binder) *BinderList {
	b.binders = append(b.binders, binders...)
	n := len(b.binders) - 1

	for i := 0; i < n; i++ {
		if body, ok := b.binders[i].(*bodyBinder); ok {
			b.binders = append(append(b.binders[:i], b.binders[i+1:]...), body)
			break
		}
	}
	return b
}

func (b *BinderList) Bind(r *http.Request, i interface{}) error {
	for _, item := range b.binders {
		if _, ok := item.(*queryBinder); ok && r.Method != http.MethodGet && r.Method != http.MethodDelete {
			continue
		}
		if err := item.Bind(r, i); err != nil {
			return err
		}
	}
	return nil
}

func (*queryBinder) Bind(r *http.Request, i interface{}) error {
	if err := BindData(i, QueryArray(r), "query"); err != nil {
		return ErrBadRequest.SetInternal(err)
	}
	return nil
}

func (*paramBinder) Bind(r *http.Request, i interface{}) error {
	params := make(url.Values)
	for key, value := range mux.Vars(r) {
		params[key] = []string{value}
	}
	if err := BindData(i, params, "param"); err != nil {
		return ErrBadRequest.SetInternal(err)
	}
	return nil
}

func (*headerBinder) Bind(r *http.Request, i interface{}) error {
	if err := BindData(i, r.Header, "header"); err != nil {
		return ErrBadRequest.SetInternal(err)
	}
	return nil
}

func (*contextBinder) Bind(r *http.Request, i interface{}) error {
	if err := BindGetter(i, func(key interface{}) (interface{}, bool) {
		val := r.Context().Value(key)
		return val, val != nil
	}, "context"); err != nil {
		return ErrBadRequest.SetInternal(err)
	}
	return nil
}

// Bind binds request body contents to bindable object
// NB: then binding forms take note that this implementation uses standard library form parsing
// which parses form data from BOTH URL and BODY if content type is not MIMEMultipartForm
// See non-MIMEMultipartForm: https://golang.org/pkg/net/http/#Request.ParseForm
// See MIMEMultipartForm: https://golang.org/pkg/net/http/#Request.ParseMultipartForm
func (*bodyBinder) Bind(r *http.Request, i interface{}) error {
	if r.ContentLength == 0 {
		return nil
	}

	ctype := r.Header.Get(HeaderContentType)
	switch {
	case strings.HasPrefix(ctype, MIMEApplicationJSON):
		if err := json.NewDecoder(r.Body).Decode(i); err != nil {
			if ute, ok := err.(*json.UnmarshalTypeError); ok {
				return ErrBadRequest.Set(fmt.Sprintf("Unmarshal type error: expected=%v, got=%v, field=%v, offset=%v", ute.Type, ute.Value, ute.Field, ute.Offset), err)
			} else if se, ok := err.(*json.SyntaxError); ok {
				return ErrBadRequest.Set(fmt.Sprintf("Syntax error: offset=%v, error=%v", se.Offset, se.Error()), err)
			}
			return ErrBadRequest.SetInternal(err)
		}
	case strings.HasPrefix(ctype, MIMEApplicationXML), strings.HasPrefix(ctype, MIMETextXML):
		if err := xml.NewDecoder(r.Body).Decode(i); err != nil {
			if ute, ok := err.(*xml.UnsupportedTypeError); ok {
				return ErrBadRequest.Set(fmt.Sprintf("Unsupported type error: type=%v, error=%v", ute.Type, ute.Error()), err)
			} else if se, ok := err.(*xml.SyntaxError); ok {
				return ErrBadRequest.Set(fmt.Sprintf("Syntax error: line=%v, error=%v", se.Line, se.Error()), err)
			}
			return ErrBadRequest.SetInternal(err)
		}
	case strings.HasPrefix(ctype, MIMEApplicationForm), strings.HasPrefix(ctype, MIMEMultipartForm):
		if err := BindData(i, PostFormArray(r), "form"); err != nil {
			return ErrBadRequest.SetInternal(err)
		}
	default:
		return ErrUnsupportedMediaType
	}
	return nil
}

func BindGetter(destination interface{}, getter BindGetterFunc, tag string) error {
	if destination == nil {
		return nil
	}

	typ := reflect.TypeOf(destination).Elem()
	val := reflect.ValueOf(destination).Elem()

	// !struct
	if typ.Kind() != reflect.Struct {
		return ErrBindNoStruct
	}

	for i := 0; i < typ.NumField(); i++ {
		typeField := typ.Field(i)
		structField := val.Field(i)
		if !structField.CanSet() {
			continue
		}
		structFieldKind := structField.Kind()
		fieldName := typeField.Tag.Get(tag)

		if fieldName == "" {
			if structFieldKind == reflect.Struct {
				if err := BindGetter(structField.Addr().Interface(), getter, tag); err != nil {
					return err
				}
			}
			// does not have explicit tag and is not an ordinary struct - so move to next field
			continue
		}

		value, ok := getter(fieldName)

		if !ok {
			continue
		}

		if sliceValue, ok := value.([]string); ok && structFieldKind == reflect.Slice {
			numElems := len(sliceValue)
			slice := reflect.MakeSlice(structField.Type(), numElems, numElems)
			for j := 0; j < numElems; j++ {
				if err := setWithProperType(sliceValue[j], slice.Index(j)); err != nil {
					return err
				}
			}
			val.Field(i).Set(slice)
			continue
		}

		if err := setWithProperType(value.(string), structField); err != nil {
			return err
		}
	}

	return nil
}

func BindData(destination interface{}, data map[string][]string, tag string) error {
	if destination == nil {
		return nil
	}

	typ := reflect.TypeOf(destination).Elem()
	val := reflect.ValueOf(destination).Elem()

	// Map
	if typ.Kind() == reflect.Map {
		for k, v := range data {
			val.SetMapIndex(reflect.ValueOf(k), reflect.ValueOf(v[0]))
		}
		return nil
	}

	// !struct
	if typ.Kind() != reflect.Struct {
		return ErrBindNoStruct
	}

	for i := 0; i < typ.NumField(); i++ {
		typeField := typ.Field(i)
		structField := val.Field(i)
		if !structField.CanSet() {
			continue
		}
		structFieldKind := structField.Kind()
		inputFieldName := typeField.Tag.Get(tag)

		if inputFieldName == "" {
			if structFieldKind == reflect.Struct {
				if err := BindData(structField.Addr().Interface(), data, tag); err != nil {
					return err
				}
			}
			// does not have explicit tag and is not an ordinary struct - so move to next field
			continue
		}

		inputValue, exists := data[inputFieldName]
		if !exists {
			// Go json.Unmarshal supports case insensitive binding.  However the
			// url params are bound case sensitive which is inconsistent.  To
			// fix this we must check all of the map values in a
			// case-insensitive search.
			for k, v := range data {
				if strings.EqualFold(k, inputFieldName) {
					inputValue = v
					exists = true
					break
				}
			}
		}

		if !exists {
			continue
		}

		numElems := len(inputValue)
		if structFieldKind == reflect.Slice && numElems > 0 {
			slice := reflect.MakeSlice(structField.Type(), numElems, numElems)
			for j := 0; j < numElems; j++ {
				if err := setWithProperType(inputValue[j], slice.Index(j)); err != nil {
					return err
				}
			}
			val.Field(i).Set(slice)
		} else if err := setWithProperType(inputValue[0], structField); err != nil {
			return err
		}
	}
	return nil
}

func setWithProperType(val string, field reflect.Value) error {
	switch field.Kind() {
	case reflect.Ptr:
		if field.IsNil() {
			// Initialize the pointer to a nil value
			field.Set(reflect.New(field.Type().Elem()))
		}
		return setWithProperType(val, field.Elem())
	case reflect.Int:
		return setIntField(val, 0, field)
	case reflect.Int8:
		return setIntField(val, 8, field)
	case reflect.Int16:
		return setIntField(val, 16, field)
	case reflect.Int32:
		return setIntField(val, 32, field)
	case reflect.Int64:
		return setIntField(val, 64, field)
	case reflect.Uint:
		return setUintField(val, 0, field)
	case reflect.Uint8:
		return setUintField(val, 8, field)
	case reflect.Uint16:
		return setUintField(val, 16, field)
	case reflect.Uint32:
		return setUintField(val, 32, field)
	case reflect.Uint64:
		return setUintField(val, 64, field)
	case reflect.Bool:
		return setBoolField(val, field)
	case reflect.Float32:
		return setFloatField(val, 32, field)
	case reflect.Float64:
		return setFloatField(val, 64, field)
	case reflect.String:
		field.SetString(val)
	default:
		return errors.New("unknown type")
	}
	return nil
}

func setIntField(value string, bitSize int, field reflect.Value) error {
	if value == "" {
		value = "0"
	}
	intVal, err := strconv.ParseInt(value, 10, bitSize)
	if err == nil {
		field.SetInt(intVal)
	}
	return err
}

func setUintField(value string, bitSize int, field reflect.Value) error {
	if value == "" {
		value = "0"
	}
	uintVal, err := strconv.ParseUint(value, 10, bitSize)
	if err == nil {
		field.SetUint(uintVal)
	}
	return err
}

func setBoolField(value string, field reflect.Value) error {
	if value == "" {
		value = "false"
	}
	boolVal, err := strconv.ParseBool(value)
	if err == nil {
		field.SetBool(boolVal)
	}
	return err
}

func setFloatField(value string, bitSize int, field reflect.Value) error {
	if value == "" {
		value = "0.0"
	}
	floatVal, err := strconv.ParseFloat(value, bitSize)
	if err == nil {
		field.SetFloat(floatVal)
	}
	return err
}
