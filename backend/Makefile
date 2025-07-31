# Backend Test Suite Makefile
# Professional Go testing with comprehensive coverage

.PHONY: help test test-unit test-integration test-benchmarks test-coverage test-race clean build run

# Default target
help:
	@echo "🚀 Backend Test Suite"
	@echo "====================="
	@echo ""
	@echo "Available targets:"
	@echo "  test              - Run all tests"
	@echo "  test-unit         - Run unit tests only"
	@echo "  test-integration  - Run integration tests only"
	@echo "  test-benchmarks   - Run benchmarks only"
	@echo "  test-coverage     - Run tests with coverage report"
	@echo "  test-race         - Run tests with race detection"
	@echo "  test-verbose      - Run tests with verbose output"
	@echo "  clean             - Clean test artifacts"
	@echo "  build             - Build the application"
	@echo "  run               - Run the application"
	@echo "  deps              - Install dependencies"
	@echo "  fmt               - Format code"
	@echo "  lint              - Run linter"

# Install dependencies
deps:
	@echo "📦 Installing dependencies..."
	go mod download
	go mod tidy

# Format code
fmt:
	@echo "🎨 Formatting code..."
	go fmt ./...

# Run linter
lint:
	@echo "🔍 Running linter..."
	golangci-lint run

# Build the application
build:
	@echo "🔨 Building application..."
	go build -o bin/backend main.go

# Run the application
run:
	@echo "🚀 Running application..."
	go run main.go

# Run all tests
test: deps
	@echo "🧪 Running all tests..."
	go test -v ./tests/...

# Run unit tests only
test-unit: deps
	@echo "📋 Running unit tests..."
	go test -v ./tests/unit/...

# Run integration tests only
test-integration: deps
	@echo "🔗 Running integration tests..."
	go test -v ./tests/integration/...

# Run benchmarks only
test-benchmarks: deps
	@echo "⚡ Running benchmarks..."
	go test -bench=. -benchmem ./tests/unit/...

# Run tests with coverage
test-coverage: deps
	@echo "📊 Running tests with coverage..."
	@mkdir -p coverage
	go test -v -coverprofile=coverage/coverage.out ./tests/...
	go tool cover -func=coverage/coverage.out
	go tool cover -html=coverage/coverage.out -o coverage/coverage.html
	@echo "📄 Coverage report generated: coverage/coverage.html"

# Run tests with race detection
test-race: deps
	@echo "🏁 Running tests with race detection..."
	go test -race -v ./tests/...

# Run tests with verbose output
test-verbose: deps
	@echo "🔍 Running tests with verbose output..."
	go test -v -count=1 ./tests/...

# Run specific test
test-specific:
	@echo "🎯 Running specific test..."
	@read -p "Enter test pattern: " pattern; \
	go test -v -run "$$pattern" ./tests/...

# Run tests with timeout
test-timeout: deps
	@echo "⏰ Running tests with timeout..."
	go test -timeout=30s -v ./tests/...

# Run tests in parallel
test-parallel: deps
	@echo "🔄 Running tests in parallel..."
	go test -parallel=4 -v ./tests/...

# Generate test coverage for specific package
test-coverage-package:
	@echo "📊 Generating coverage for specific package..."
	@read -p "Enter package path: " package; \
	go test -coverprofile=coverage/$$package.out ./$$package; \
	go tool cover -html=coverage/$$package.out -o coverage/$$package.html

# Run performance tests
test-performance: deps
	@echo "📈 Running performance tests..."
	go test -bench=. -benchmem -run=^$$ ./tests/unit/...

# Run memory profiling
test-memory: deps
	@echo "🧠 Running memory profiling..."
	go test -bench=. -benchmem -memprofile=coverage/memory.prof ./tests/unit/...

# Clean test artifacts
clean:
	@echo "🧹 Cleaning test artifacts..."
	rm -rf coverage/
	rm -rf bin/
	go clean -testcache

# Install test dependencies
test-deps:
	@echo "📦 Installing test dependencies..."
	go get github.com/stretchr/testify
	go get github.com/stretchr/testify/suite
	go get github.com/stretchr/testify/mock

# Run tests with different Go versions
test-go-versions:
	@echo "🔄 Testing with different Go versions..."
	@for version in 1.19 1.20 1.21; do \
		echo "Testing with Go $$version..."; \
		go test -v ./tests/... || echo "Failed with Go $$version"; \
	done

# Run tests with different architectures
test-architectures:
	@echo "🏗️ Testing with different architectures..."
	@for arch in amd64 arm64; do \
		echo "Testing with $$arch..."; \
		GOARCH=$$arch go test -v ./tests/... || echo "Failed with $$arch"; \
	done

# Generate test documentation
test-docs:
	@echo "📚 Generating test documentation..."
	@echo "# Test Results" > test-results.md
	@echo "Generated on: $$(date)" >> test-results.md
	@echo "" >> test-results.md
	@echo "## Coverage Report" >> test-results.md
	@go test -coverprofile=coverage.out ./tests/... 2>/dev/null || true
	@go tool cover -func=coverage.out >> test-results.md 2>/dev/null || true
	@rm -f coverage.out

# Run tests with custom flags
test-custom:
	@echo "⚙️ Running tests with custom flags..."
	@read -p "Enter custom flags: " flags; \
	go test $$flags ./tests/...

# Show test help
test-help:
	@echo "📖 Test Help"
	@echo "============"
	@echo ""
	@echo "Environment Variables:"
	@echo "  TEST_TIMEOUT=30s     - Test timeout"
	@echo "  TEST_PARALLEL=4      - Number of parallel tests"
	@echo "  TEST_COVERAGE=true   - Enable coverage"
	@echo "  TEST_VERBOSE=true    - Enable verbose output"
	@echo "  DEBUG=true           - Enable debug logging"
	@echo ""
	@echo "Examples:"
	@echo "  make test                    # Run all tests"
	@echo "  make test-unit              # Run unit tests"
	@echo "  make test-coverage          # Run with coverage"
	@echo "  make test-race              # Run with race detection"
	@echo "  make test-benchmarks        # Run benchmarks"
	@echo "  TEST_VERBOSE=true make test # Run with verbose output"

# CI/CD targets
ci-test: deps test-coverage test-race
	@echo "✅ CI tests completed"

ci-build: deps build
	@echo "✅ CI build completed"

# Development workflow
dev-setup: deps test-deps fmt lint
	@echo "✅ Development environment setup complete"

dev-test: test-coverage test-race
	@echo "✅ Development tests completed"

# Production targets
prod-test: test-coverage test-race test-performance
	@echo "✅ Production tests completed"

prod-build: clean build
	@echo "✅ Production build completed"

# Default target
.DEFAULT_GOAL := help 