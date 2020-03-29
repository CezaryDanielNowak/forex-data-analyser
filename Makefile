.PHONY: start-api
start-api:
	node index.js

.PHONY: start
start:
	cd frontend && make start

.PHONY: build
start:
	cd frontend && make build
