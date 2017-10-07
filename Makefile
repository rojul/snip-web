default: dev

dev:
	npm run dev

docker-build:
	docker build -t snip-web-builder .

.PHONY: default dev docker-build
