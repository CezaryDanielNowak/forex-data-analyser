.PHONY: start-api
start-api:
	node index.js

.PHONY: start
start:
	cd frontend && make start
