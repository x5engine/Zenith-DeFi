# Professional Go Testing Suite

This directory contains a comprehensive, production-grade testing suite for the backend service, following Go best practices and industry standards.

## 🏗️ Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── api/                # API handler tests
│   ├── orchestrator/       # Orchestrator tests
│   └── services/           # Service layer tests
├── integration/            # Integration tests
│   └── api_integration_test.go
├── test_runner.go          # Test runner and orchestration
└── README.md              # This file
```

## 🚀 Quick Start

### Run All Tests
```bash
cd backend
go test ./tests/...
```

### Run Specific Test Categories
```bash
# Unit tests only
go test ./tests/unit/...

# Integration tests only
go test ./tests/integration/...

# Benchmarks
go test -bench=. ./tests/unit/...

# With coverage
go test -cover ./tests/...
```

### Run with Coverage Report
```bash
go test -coverprofile=coverage.out ./tests/...
go tool cover -html=coverage.out -o coverage.html
```

## 📋 Test Categories

### 1. Unit Tests (`tests/unit/`)

Unit tests focus on testing individual components in isolation using mocks and stubs.

**Coverage:**
- ✅ API Handlers (`api/handlers_test.go`)
- ✅ Orchestrator (`orchestrator/swap_orchestrator_test.go`)
- ✅ Services (`services/btc_htlc_service_test.go`)

**Features:**
- Mock services for external dependencies
- Test suites using `testify/suite`
- Comprehensive error handling tests
- Performance benchmarks
- Concurrent operation testing

### 2. Integration Tests (`tests/integration/`)

Integration tests verify the complete API functionality using real HTTP requests.

**Coverage:**
- ✅ End-to-end API testing
- ✅ HTTP request/response validation
- ✅ Error scenario testing
- ✅ Concurrent request handling

**Features:**
- Real HTTP server using `httptest`
- JSON request/response validation
- Status code verification
- Response time testing

### 3. Benchmarks

Performance benchmarks for critical operations.

**Coverage:**
- ✅ API endpoint performance
- ✅ Swap initiation performance
- ✅ Status retrieval performance
- ✅ Memory usage analysis

## 🛠️ Test Configuration

### Environment Variables
```bash
# Test configuration
export TEST_TIMEOUT=30s
export TEST_PARALLEL=4
export TEST_COVERAGE=true
export TEST_VERBOSE=true

# Bitcoin configuration (for integration tests)
export BITCOIN_RPC_HOST=localhost
export BITCOIN_RPC_PORT=18443
export BITCOIN_RPC_USER=testuser
export BITCOIN_RPC_PASS=testpass
```

### Test Runner Configuration
```go
config := TestConfig{
    UnitTests:       true,
    IntegrationTests: true,
    Benchmarks:      true,
    Coverage:        true,
    Verbose:         true,
    Timeout:         5 * time.Minute,
    Parallel:        true,
}
```

## 📊 Test Coverage

### Current Coverage Targets
- **API Handlers:** 100%
- **Orchestrator:** 100%
- **Services:** 95%+
- **Integration:** 100%

### Coverage Report
```bash
# Generate coverage report
go test -coverprofile=coverage.out ./tests/...

# View HTML report
go tool cover -html=coverage.out -o coverage.html

# View coverage summary
go tool cover -func=coverage.out
```

## 🧪 Test Patterns

### 1. Test Suite Pattern
```go
type MyTestSuite struct {
    suite.Suite
    // test dependencies
}

func (suite *MyTestSuite) SetupSuite() {
    // one-time setup
}

func (suite *MyTestSuite) SetupTest() {
    // per-test setup
}

func (suite *MyTestSuite) TestMyFunction() {
    // test implementation
}

func TestMyTestSuite(t *testing.T) {
    suite.Run(t, new(MyTestSuite))
}
```

### 2. Mock Pattern
```go
type MockService struct {
    mock.Mock
}

func (m *MockService) MyMethod() (string, error) {
    args := m.Called()
    return args.String(0), args.Error(1)
}

// In test
mockService.On("MyMethod").Return("result", nil)
```

### 3. HTTP Test Pattern
```go
func TestMyEndpoint(t *testing.T) {
    // Arrange
    req := httptest.NewRequest("POST", "/endpoint", bytes.NewBuffer(reqBody))
    w := httptest.NewRecorder()
    
    // Act
    handler(w, req)
    
    // Assert
    assert.Equal(t, http.StatusOK, w.Code)
    // ... more assertions
}
```

## 🔧 Test Utilities

### Mock Services
- `MockBtcService` - Bitcoin HTLC service mock
- `MockEvmService` - EVM service mock
- `MockRPCClient` - Bitcoin RPC client mock

### Test Helpers
- `createTestRequest()` - Create HTTP test requests
- `assertJSONResponse()` - Validate JSON responses
- `waitForCondition()` - Wait for async conditions

### Test Data
- Sample requests and responses
- Valid and invalid test cases
- Performance test data

## 📈 Performance Testing

### Benchmarks
```bash
# Run all benchmarks
go test -bench=. ./tests/unit/...

# Run specific benchmark
go test -bench=BenchmarkGetQuote ./tests/unit/api/

# Run with memory profiling
go test -bench=. -benchmem ./tests/unit/...
```

### Load Testing
```bash
# Run concurrent tests
go test -parallel 4 ./tests/integration/...

# Run with race detection
go test -race ./tests/...
```

## 🐛 Debugging Tests

### Verbose Output
```bash
go test -v ./tests/...
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
go test ./tests/...
```

### Test Isolation
```bash
# Run single test
go test -run TestSpecificFunction ./tests/unit/api/

# Run test suite
go test -run TestSuiteName ./tests/unit/api/
```

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      - run: go mod download
      - run: go test -v -coverprofile=coverage.out ./tests/...
      - run: go tool cover -func=coverage.out
      - run: go tool cover -html=coverage.out -o coverage.html
      - uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage.html
```

### Local Development
```bash
# Run tests before commit
make test

# Run tests with coverage
make test-coverage

# Run specific test category
make test-unit
make test-integration
make test-benchmarks
```

## 📝 Best Practices

### 1. Test Organization
- Group related tests in test suites
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking
- Mock external dependencies
- Use testify/mock for complex mocks
- Verify mock expectations

### 3. Error Testing
- Test both success and failure scenarios
- Test edge cases and invalid inputs
- Verify error messages and codes

### 4. Performance
- Include benchmarks for critical paths
- Test concurrent operations
- Monitor memory usage

### 5. Coverage
- Aim for 90%+ coverage
- Focus on critical business logic
- Test error handling paths

## 🚨 Common Issues

### 1. Import Issues
```bash
# Fix module dependencies
go mod tidy
go mod download
```

### 2. Test Failures
```bash
# Run with verbose output
go test -v ./tests/...

# Check test logs
go test -v ./tests/... 2>&1 | tee test.log
```

### 3. Coverage Issues
```bash
# Generate coverage for specific package
go test -coverprofile=coverage.out ./tests/unit/api/
go tool cover -html=coverage.out
```

## 📚 Additional Resources

- [Go Testing Documentation](https://golang.org/pkg/testing/)
- [Testify Documentation](https://github.com/stretchr/testify)
- [Go Testing Best Practices](https://golang.org/doc/tutorial/add-a-test)
- [HTTP Testing in Go](https://golang.org/pkg/net/http/httptest/)

## 🤝 Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Follow naming convention: `*_test.go`
3. Use test suites for complex components
4. Add benchmarks for performance-critical code
5. Update this documentation

### Test Naming Convention
- Unit tests: `TestFunctionName`
- Integration tests: `TestEndpointName`
- Benchmarks: `BenchmarkFunctionName`
- Test suites: `TestSuiteName`

### Running Tests Before Committing
```bash
# Run all tests
go test ./tests/...

# Run with coverage
go test -cover ./tests/...

# Run benchmarks
go test -bench=. ./tests/unit/...
```

This testing suite provides comprehensive coverage and follows industry best practices for Go testing. 