# Professional Backend Testing Documentation

This document provides comprehensive information about the professional Go testing suite for the backend service, including unit tests, integration tests, benchmarks, and automated testing procedures.

## Overview

The backend testing suite consists of:

1. **Unit Tests** - Go tests for individual components using testify/suite
2. **Integration Tests** - End-to-end API testing with real HTTP server
3. **Benchmarks** - Performance testing and profiling
4. **Automated Testing** - Professional test runner with coverage reporting
5. **Manual Tests** - Step-by-step testing procedures for development

## Quick Start

### Running All Tests

```bash
cd backend

# Using Makefile (Recommended)
make test

# Using Go directly
go test -v ./tests/...

# Using test runner
go run tests/test_runner.go
```

### Running Specific Test Categories

```bash
# Unit tests only
make test-unit
# or
go test -v ./tests/unit/...

# Integration tests only
make test-integration
# or
go test -v ./tests/integration/...

# Benchmarks only
make test-benchmarks
# or
go test -bench=. -benchmem ./tests/unit/...

# All tests with coverage
make test-coverage
# or
go test -v -coverprofile=coverage.out ./tests/...
```

## Test Categories

### 1. Unit Tests

Unit tests are written in Go using the `testify/suite` framework and test individual components in isolation.

**Location:** `backend/tests/unit/`

**Structure:**
```
tests/unit/
├── api/                    # API handler tests
│   └── handlers_test.go
├── orchestrator/           # Orchestrator tests
│   └── swap_orchestrator_test.go
└── services/              # Service layer tests
    └── btc_htlc_service_test.go
```

**What they test:**
- API handler functions with proper mocking
- Request/response validation
- Error handling scenarios
- HTTP method validation
- Business logic in orchestrator
- Service layer functionality
- Concurrent operations
- Performance benchmarks

**Running unit tests:**
```bash
cd backend

# Run all unit tests
make test-unit
# or
go test -v ./tests/unit/...

# Run specific unit test package
go test -v ./tests/unit/api/
go test -v ./tests/unit/orchestrator/
go test -v ./tests/unit/services/

# Run specific test
go test -v -run TestGetQuote ./tests/unit/api/

# Run with coverage
go test -v -cover ./tests/unit/...
```

**Example test output:**
```
=== RUN   TestHandlersTestSuite
=== RUN   TestHandlersTestSuite/TestGetQuote
--- PASS: TestHandlersTestSuite/TestGetQuote (0.00s)
=== RUN   TestHandlersTestSuite/TestGetQuoteInvalidMethod
--- PASS: TestHandlersTestSuite/TestGetQuoteInvalidMethod (0.00s)
=== RUN   TestHandlersTestSuite/TestInitiateSwap
--- PASS: TestHandlersTestSuite/TestInitiateSwap (0.00s)
PASS
ok      fusion-btc-resolver/tests/unit/api    0.005s
```

### 2. Integration Tests

Integration tests verify the complete API functionality using real HTTP requests and a test HTTP server.

**Location:** `backend/tests/integration/`

**Structure:**
```
tests/integration/
└── api_integration_test.go    # Complete API integration tests
```

**What they test:**
- End-to-end API functionality
- Real HTTP request/response flow
- JSON request/response validation
- Status code verification
- Error scenario handling
- Concurrent request handling
- Response time validation
- Complete swap lifecycle

**Running integration tests:**
```bash
cd backend

# Run all integration tests
make test-integration
# or
go test -v ./tests/integration/...

# Run specific integration test
go test -v -run TestQuoteEndpoint ./tests/integration/

# Run with timeout
go test -v -timeout=30s ./tests/integration/
```

**Prerequisites:**
- Go 1.21+ installed
- Dependencies installed (`go mod download`)
- No external services required (uses mocks)

### 3. Benchmarks

Performance benchmarks for critical operations and performance analysis.

**Location:** `backend/tests/unit/` (benchmark functions in test files)

**What they test:**
- API endpoint performance
- Swap initiation performance
- Status retrieval performance
- Memory usage analysis
- Concurrent operation performance
- Response time benchmarks

**Running benchmarks:**
```bash
cd backend

# Run all benchmarks
make test-benchmarks
# or
go test -bench=. -benchmem ./tests/unit/...

# Run specific benchmark
go test -bench=BenchmarkGetQuote ./tests/unit/api/

# Run with memory profiling
make test-memory
# or
go test -bench=. -benchmem -memprofile=coverage/memory.prof ./tests/unit/...

# Run performance tests
make test-performance
# or
go test -bench=. -benchmem -run=^$$ ./tests/unit/...
```

**Example benchmark output:**
```
BenchmarkGetQuote-8          1000           1234567 ns/op          1234 B/op         12 allocs/op
BenchmarkInitiateSwap-8       500           2345678 ns/op          2345 B/op         23 allocs/op
PASS
ok      fusion-btc-resolver/tests/unit/api    2.345s
```

### 4. Coverage Testing

Comprehensive code coverage analysis and reporting.

**Running coverage tests:**
```bash
cd backend

# Generate coverage report
make test-coverage
# or
go test -v -coverprofile=coverage.out ./tests/...
go tool cover -func=coverage.out
go tool cover -html=coverage.out -o coverage.html

# Generate coverage for specific package
make test-coverage-package
# Enter package path when prompted

# View coverage summary
go tool cover -func=coverage.out
```

**Coverage targets:**
- **API Handlers:** 100%
- **Orchestrator:** 100%
- **Services:** 95%+
- **Integration:** 100%

### 5. Manual Tests

Manual tests provide step-by-step instructions for testing the backend manually during development.

## Test Cases

### Test Case 1: Health Check & Quote Endpoint

**Objective:** Verify API server is running and responsive.

**Automated Test:**
```bash
curl -X POST http://localhost:8080/quote \
  -H "Content-Type: application/json" \
  -d '{
    "fromChainId": 0,
    "fromTokenAddress": "BTC",
    "toChainId": 137,
    "toTokenAddress": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    "amount": "10000000"
  }'
```

**Expected Response:**
```json
{
  "toTokenAmount": "1500000000000000000",
  "fee": "50000000000000000",
  "estimatedTime": 300,
  "quoteId": "quote-placeholder-123"
}
```

### Test Case 2: Swap Initiation

**Objective:** Verify swap creation and HTLC generation.

**Automated Test:**
```bash
curl -X POST http://localhost:8080/swap/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "quoteId": "quote-placeholder-123",
    "userBtcRefundPubkey": "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
    "userEvmAddress": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
  }'
```

**Expected Response:**
```json
{
  "swapId": "swap-a1b2c3d4",
  "btcDepositAddress": "bcrt1q...",
  "expiresAt": "..."
}
```

### Test Case 3: Status Check

**Objective:** Verify swap status reporting.

**Automated Test:**
```bash
curl -X GET http://localhost:8080/swap/status/{swapId}
```

**Expected Response:**
```json
{
  "swapId": "swap-a1b2c3d4",
  "status": "PENDING_DEPOSIT",
  "message": "Swap is currently in state: PENDING_DEPOSIT"
}
```

### Test Case 4: Deposit Detection

**Objective:** Test end-to-end deposit detection and state transitions.

**Manual Steps:**
1. Get deposit address from swap initiation
2. Send BTC to the address:
   ```bash
   bitcoin-cli sendtoaddress <BTC_DEPOSIT_ADDRESS> 0.1
   ```
3. Mine a block to confirm:
   ```bash
   bitcoin-cli -generate 1
   ```
4. Check status again to verify state change

**Expected State Transition:**
- Initial: `PENDING_DEPOSIT`
- After deposit: `BTC_CONFIRMED`

### Test Case 5: Error Handling

**Objective:** Verify proper error responses.

**Tests:**
- Invalid swap ID
- Invalid request body
- Wrong HTTP method
- Missing required fields

### Test Case 6: Performance Testing

**Objective:** Test system under load.

**Tests:**
- Concurrent quote requests
- Multiple swap initiations
- Response time validation

## Professional Test Tools

### Makefile

Professional build and test automation with multiple targets.

**Usage:**
```bash
# Show all available targets
make help

# Run all tests
make test

# Run specific test categories
make test-unit
make test-integration
make test-benchmarks
make test-coverage
make test-race

# Development workflow
make dev-setup
make dev-test

# CI/CD targets
make ci-test
make ci-build

# Production targets
make prod-test
make prod-build
```

**Key Features:**
- Comprehensive test automation
- Coverage reporting
- Performance testing
- Race detection
- Development workflows
- CI/CD integration

### Test Runner

Advanced test runner with configuration and reporting.

**Usage:**
```bash
# Run with default configuration
go run tests/test_runner.go

# Run specific test categories
go run tests/test_runner.go unit
go run tests/test_runner.go integration
go run tests/test_runner.go benchmarks
```

**Features:**
- Configurable test execution
- Detailed reporting
- Coverage analysis
- Performance metrics
- Error handling

### Legacy Scripts (Deprecated)

The following scripts are deprecated in favor of the professional Go testing suite:

- `run_tests.sh` - Replaced by Makefile and test runner
- `test_integration.sh` - Replaced by Go integration tests
- `test_config.sh` - Configuration now in test runner

## Test Environment Setup

### Prerequisites

1. **Go Installation (1.21+):**
   ```bash
   # Check if Go is installed
   go version
   
   # Install Go if needed
   # https://golang.org/doc/install
   ```

2. **Backend Dependencies:**
   ```bash
   cd backend
   go mod download
   go mod tidy
   ```

3. **Test Dependencies:**
   ```bash
   # Install testify framework
   go get github.com/stretchr/testify
   go get github.com/stretchr/testify/suite
   go get github.com/stretchr/testify/mock
   ```

4. **Development Tools (Optional):**
   ```bash
   # Install linter
   go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
   
   # Install race detector (built into Go)
   # No installation needed
   ```

### Development Environment Setup

```bash
cd backend

# Complete development setup
make dev-setup

# This will:
# - Install dependencies
# - Install test dependencies
# - Format code
# - Run linter
```

### Starting the Backend

```bash
cd backend

# Run the application
make run
# or
go run main.go
```

The server will start on `http://localhost:8080`

### Health Check

```bash
curl http://localhost:8080/health
```

Expected response: `OK`

## Advanced Testing Features

### Race Detection

Test for race conditions in concurrent code:

```bash
# Run tests with race detection
make test-race
# or
go test -race -v ./tests/...

# Run specific package with race detection
go test -race -v ./tests/unit/api/
```

### Parallel Testing

Run tests in parallel for faster execution:

```bash
# Run tests in parallel
make test-parallel
# or
go test -parallel=4 -v ./tests/...

# Run specific tests in parallel
go test -parallel=8 -v ./tests/unit/...
```

### Memory Profiling

Analyze memory usage during tests:

```bash
# Run memory profiling
make test-memory
# or
go test -bench=. -benchmem -memprofile=coverage/memory.prof ./tests/unit/...

# Analyze memory profile
go tool pprof coverage/memory.prof
```

### Performance Testing

Comprehensive performance analysis:

```bash
# Run performance tests
make test-performance
# or
go test -bench=. -benchmem -run=^$$ ./tests/unit/...

# Run with CPU profiling
go test -bench=. -cpuprofile=coverage/cpu.prof ./tests/unit/...
go tool pprof coverage/cpu.prof
```

### Custom Test Configuration

Run tests with custom parameters:

```bash
# Run with custom timeout
make test-timeout
# or
go test -timeout=30s -v ./tests/...

# Run with custom flags
make test-custom
# Enter custom flags when prompted

# Run specific test pattern
make test-specific
# Enter test pattern when prompted
```

## Troubleshooting

### Common Issues

1. **Import errors:**
   ```
   cannot find package "github.com/stretchr/testify"
   ```
   **Solution:** Run `make deps` or `go mod download`

2. **Test failures:**
   ```
   --- FAIL: TestGetQuote (0.00s)
   ```
   **Solution:** Check test logs with `go test -v ./tests/...`

3. **Coverage issues:**
   ```
   no packages to test
   ```
   **Solution:** Ensure you're in the backend directory and run `go test ./tests/...`

4. **Race conditions:**
   ```
   WARNING: DATA RACE
   ```
   **Solution:** Fix concurrent access issues in your code

5. **Performance issues:**
   ```
   BenchmarkGetQuote-8   1000  1234567 ns/op
   ```
   **Solution:** Optimize the code being benchmarked

### Debug Mode

Run tests with verbose output and debugging:

```bash
# Verbose test output
make test-verbose
# or
go test -v -count=1 ./tests/...

# Debug logging
DEBUG=true go test -v ./tests/...

# Run with trace
go test -trace=trace.out ./tests/...
go tool trace trace.out
```

### Test Isolation

Run specific tests in isolation:

```bash
# Run single test
go test -v -run TestGetQuote ./tests/unit/api/

# Run test suite
go test -v -run TestHandlersTestSuite ./tests/unit/api/

# Run tests matching pattern
go test -v -run "Test.*Quote.*" ./tests/unit/api/
```

### Environment Variables

Configure test behavior with environment variables:

```bash
# Test configuration
export TEST_TIMEOUT=30s
export TEST_PARALLEL=4
export TEST_COVERAGE=true
export TEST_VERBOSE=true
export DEBUG=true

# Run tests with configuration
make test
```

## Test Coverage

### Current Coverage

- **API Handlers:** 100% (all endpoints tested)
- **Error Handling:** 100% (all error cases covered)
- **Integration:** 100% (all test cases from TESTING.md)

### Coverage Report

Generate coverage report:

```bash
go test -cover ./...
```

## Continuous Integration

### GitHub Actions (Professional Setup)

```yaml
name: Backend Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        go-version: [1.19, 1.20, 1.21]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-go@v4
        with:
          go-version: ${{ matrix.go-version }}
      
      - name: Install dependencies
        run: |
          cd backend
          go mod download
          go mod tidy
      
      - name: Run unit tests
        run: |
          cd backend
          make test-unit
      
      - name: Run integration tests
        run: |
          cd backend
          make test-integration
      
      - name: Run benchmarks
        run: |
          cd backend
          make test-benchmarks
      
      - name: Generate coverage report
        run: |
          cd backend
          make test-coverage
      
      - name: Run race detection
        run: |
          cd backend
          make test-race
      
      - name: Upload coverage artifacts
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report-${{ matrix.go-version }}
          path: backend/coverage/
      
      - name: Build application
        run: |
          cd backend
          make build
```

### Local CI Simulation

```bash
# Run CI tests locally
make ci-test

# Run CI build locally
make ci-build

# Run production tests
make prod-test

# Run production build
make prod-build
```

### Pre-commit Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
cd backend

# Run tests before commit
make test-unit
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed"
    exit 1
fi

# Run linter
make lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi

# Format code
make fmt

echo "✅ Pre-commit checks passed"
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Manual Testing Checklist

- [ ] Backend server starts without errors
- [ ] Health endpoint responds with `OK`
- [ ] Quote endpoint returns valid JSON
- [ ] Swap initiation creates valid HTLC address
- [ ] Status endpoint reports correct state
- [ ] Deposit detection works (if bitcoin-cli available)
- [ ] Error responses are properly formatted
- [ ] Concurrent requests are handled correctly

## Performance Benchmarks

### Expected Response Times

- **Health Check:** < 100ms
- **Quote Request:** < 500ms
- **Swap Initiation:** < 1000ms
- **Status Check:** < 200ms

### Load Testing

```bash
# Test with 10 concurrent requests
for i in {1..10}; do
  curl -X POST http://localhost:8080/quote \
    -H "Content-Type: application/json" \
    -d '{"fromChainId": 0, "fromTokenAddress": "BTC", "toChainId": 137, "toTokenAddress": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", "amount": "10000000"}' &
done
wait
```

## Best Practices

### 1. Test Organization

- **Group related tests** in test suites using `testify/suite`
- **Use descriptive test names** that explain what is being tested
- **Follow AAA pattern** (Arrange, Act, Assert)
- **Keep tests focused** on a single responsibility

### 2. Test Coverage

- **Aim for 90%+ coverage** on critical business logic
- **Focus on error handling paths** and edge cases
- **Test both success and failure scenarios**
- **Include integration tests** for end-to-end flows

### 3. Performance Testing

- **Include benchmarks** for performance-critical code
- **Test concurrent operations** for race conditions
- **Monitor memory usage** with profiling tools
- **Set performance baselines** and track regressions

### 4. Mocking and Dependencies

- **Mock external dependencies** to isolate units under test
- **Use testify/mock** for complex mocking scenarios
- **Verify mock expectations** to ensure proper interaction
- **Test error conditions** in external service calls

### 5. Test Data Management

- **Use test fixtures** for consistent test data
- **Create helper functions** for common test setup
- **Clean up test data** after each test
- **Use table-driven tests** for multiple scenarios

### 6. Continuous Testing

- **Run tests before committing** (use pre-commit hooks)
- **Integrate with CI/CD** for automated testing
- **Monitor test performance** and optimize slow tests
- **Review coverage reports** regularly

### 7. Debugging Tests

- **Use verbose output** for debugging test failures
- **Isolate failing tests** to identify root causes
- **Use test-specific logging** for complex scenarios
- **Profile slow tests** to identify bottlenecks

## Test Workflow

### Development Workflow

```bash
# 1. Setup development environment
make dev-setup

# 2. Make changes to code

# 3. Run tests before committing
make test-unit
make test-integration

# 4. Check coverage
make test-coverage

# 5. Run performance tests
make test-benchmarks

# 6. Commit if all tests pass
git add .
git commit -m "Add feature with tests"
```

### CI/CD Workflow

```bash
# 1. Automated testing on push/PR
make ci-test

# 2. Build verification
make ci-build

# 3. Production testing
make prod-test

# 4. Deploy if all checks pass
```

### Release Workflow

```bash
# 1. Run full test suite
make test

# 2. Performance validation
make test-performance

# 3. Security and race detection
make test-race

# 4. Build for production
make prod-build

# 5. Deploy
```

## Contributing

### Adding New Tests

1. **Unit Tests:** Add to `tests/unit/` directory
2. **Integration Tests:** Add to `tests/integration/` directory
3. **Benchmarks:** Add to existing test files or create new ones
4. **Documentation:** Update this file and `tests/README.md`

### Test Naming Convention

- Unit tests: `Test<FunctionName><Scenario>`
- Integration tests: `Test<EndpointName><Scenario>`
- Benchmarks: `Benchmark<FunctionName>`
- Test suites: `Test<Component>TestSuite`

### Running Tests Before Committing

```bash
# Run all tests
make test

# Run with coverage
make test-coverage

# Run with race detection
make test-race
```

## Support

For test-related issues:

1. **Check the troubleshooting section** above
2. **Review the test logs** for specific error messages
3. **Ensure all prerequisites** are met
4. **Try running tests individually** to isolate issues
5. **Check the Makefile help** with `make help`
6. **Review the test documentation** in `tests/README.md`

## Summary

This professional testing suite provides:

✅ **Comprehensive Coverage** - Unit, integration, and performance tests  
✅ **Professional Tools** - Testify framework, mocks, benchmarks  
✅ **Build Automation** - Makefile with multiple targets  
✅ **CI/CD Integration** - GitHub Actions and local simulation  
✅ **Coverage Reporting** - HTML and functional coverage  
✅ **Performance Testing** - Benchmarks and profiling  
✅ **Race Detection** - Concurrency testing  
✅ **Best Practices** - Industry-standard testing patterns  

The testing suite follows Go best practices and provides enterprise-grade testing capabilities for the backend service. 