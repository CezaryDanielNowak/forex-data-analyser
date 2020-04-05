.PHONY: start-api
start-api:
	node index.js

.PHONY: start
start:
	echo "run make start from frontend directory!"

.PHONY: build
start:
	cd frontend && make build
