set -e

CGO_CFLAGS=-I/opt/ego/include CGO_LDFLAGS=-L/opt/ego/lib go build ra_client/client.go
./client -s `ego signerid public.pem`
