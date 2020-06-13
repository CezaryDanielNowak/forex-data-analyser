BRAND ?= default
ENV ?= local
GULP := "./node_modules/.bin/gulp" --gulpfile src/sf/gulpfile.js
PLOP := "./node_modules/.bin/plop" --plopfile src/sf/plopfile.js
LINTTASK := lint

EXTRA_PARAMS ?=

.PHONY: install
install:
	# TODO: add system checks like node-version, global dependencies etc
	yarn install --no-lockfile --no-progress ${EXTRA_PARAMS}

.PHONY: reinstall
reinstall:
	rm yarn.lock || true
	rm src/sf/yarn.lock || true
	rm -rf ./node_modules
	yarn install --no-lockfile ${EXTRA_PARAMS}

.PHONY: lint
lint:
	$(GULP) $(LINTTASK)

.PHONY: init-component
init-component:
	$(PLOP) component

.PHONY: init-page
init-page:
	$(PLOP) page

.PHONY: init-model
init-model:
	$(PLOP) model

.PHONY: start
start:
	$(GULP) watch --env=$(ENV) --brand=$(BRAND) --test_runner=$(TEST_RUNNER)

.PHONY: build
build:
	$(GULP) build --env=$(ENV) --brand=$(BRAND) --version=$(VERSION) --test_runner=$(TEST_RUNNER)

.PHONY: server
server:
	$(GULP) server --env=$(ENV) --brand=$(BRAND)

.PHONY: lint-scss
lint-scss:
	$(GULP) lint-scss

