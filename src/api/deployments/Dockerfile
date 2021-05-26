FROM golang:1.16.3-alpine AS builder

LABEL maintainer="igoragapie@gmail.com"

RUN go version

WORKDIR /go/src/github.com/iagapie/cards-system

COPY . .

RUN go mod download
RUN GOOS=linux go build -o ./.bin/app ./cmd/main/app.go

FROM alpine

WORKDIR /root

COPY --from=builder /go/src/github.com/iagapie/cards-system/.bin/app .
COPY --from=builder /go/src/github.com/iagapie/cards-system/configs configs/
COPY --from=builder /go/src/github.com/iagapie/cards-system/api api/

EXPOSE 80 443

CMD ["./app"]