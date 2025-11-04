OPENING.PHONY: help dev format lint test ci docker-prod docker-dev docker-down docker-ci

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  help        - Show this help message"
	@echo "  dev         - Run the development server"
	@echo "  format      - Format the code"
	@echo "  lint        - Lint the code"
	@echo "  test        - Run the tests"
	@echo "  ci          - Run the CI checks"
	@echo ""
	@echo "Docker Targets:"
	@echo "  docker-prod - Run production container (port 8080)"
	@echo "  docker-dev  - Run development container (port 3000)"
	@echo "  docker-down - Stop all containers"
	@echo "  docker-ci   - Run CI checks in Docker"

dev:
	npm run dev

format:
	npm run format

lint:
	npm run lint

test:
	npm run test

ci:
	python3 ci_check.py

docker-prod:
	docker compose up -d --build prod

docker-dev:
	docker compose up --build dev

docker-down:
	docker compose down

docker-ci:
	docker compose build ci && docker compose run --rm ci
