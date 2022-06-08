set -e

rm -rf server public.pem private.pem

ego-go build
ego sign server
ego run server
