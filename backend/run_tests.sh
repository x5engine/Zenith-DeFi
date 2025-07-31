#!/bin/bash

# =========================================================================
# Backend Test Runner Script
# =========================================================================
# This script runs all tests for the backend including:
# 1. Unit tests (Go tests)
# 2. Integration tests (API tests)
# 3. Manual testing instructions

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_SCRIPT="$BACKEND_DIR/test_integration.sh"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Go is installed
check_go() {
    log_info "Checking Go installation..."
    if command -v go > /dev/null 2>&1; then
        log_success "Go is installed: $(go version)"
        return 0
    else
        log_error "Go is not installed. Please install Go to run tests."
        return 1
    fi
}

# Check if required Go modules are available
check_dependencies() {
    log_info "Checking Go dependencies..."
    cd "$BACKEND_DIR"
    
    if [ -f "go.mod" ]; then
        log_info "Found go.mod file"
        if go mod tidy > /dev/null 2>&1; then
            log_success "Dependencies are up to date"
        else
            log_warning "Some dependencies may need updating"
        fi
    else
        log_warning "No go.mod file found. This may be a new project."
    fi
}

# Run unit tests
run_unit_tests() {
    log_info "=== Running Unit Tests ==="
    cd "$BACKEND_DIR"
    
    # Run tests with verbose output
    if go test -v ./... 2>&1; then
        log_success "Unit tests passed"
        return 0
    else
        log_error "Unit tests failed"
        return 1
    fi
}

# Run integration tests
run_integration_tests() {
    log_info "=== Running Integration Tests ==="
    
    if [ -f "$TEST_SCRIPT" ]; then
        if [ -x "$TEST_SCRIPT" ]; then
            log_info "Running integration test script..."
            if "$TEST_SCRIPT"; then
                log_success "Integration tests completed"
                return 0
            else
                log_error "Integration tests failed"
                return 1
            fi
        else
            log_warning "Integration test script is not executable. Making it executable..."
            chmod +x "$TEST_SCRIPT"
            if "$TEST_SCRIPT"; then
                log_success "Integration tests completed"
                return 0
            else
                log_error "Integration tests failed"
                return 1
            fi
        fi
    else
        log_warning "Integration test script not found: $TEST_SCRIPT"
        return 1
    fi
}

# Run specific test category
run_specific_tests() {
    case "$1" in
        "unit")
            run_unit_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "all")
            run_unit_tests && run_integration_tests
            ;;
        *)
            log_error "Unknown test category: $1"
            log_info "Available categories: unit, integration, all"
            return 1
            ;;
    esac
}

# Show manual testing instructions
show_manual_tests() {
    log_info "=== Manual Testing Instructions ==="
    echo ""
    echo "To test the backend manually, follow these steps:"
    echo ""
    echo "1. Start the backend:"
    echo "   cd $BACKEND_DIR"
    echo "   go run main.go"
    echo ""
    echo "2. In another terminal, test the API endpoints:"
    echo ""
    echo "   # Test quote endpoint"
    echo "   curl -X POST http://localhost:8080/quote \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -d '{\"fromChainId\": 0, \"fromTokenAddress\": \"BTC\", \"toChainId\": 137, \"toTokenAddress\": \"0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6\", \"amount\": \"10000000\"}'"
    echo ""
    echo "   # Test swap initiation"
    echo "   curl -X POST http://localhost:8080/swap/initiate \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -d '{\"quoteId\": \"quote-placeholder-123\", \"userBtcRefundPubkey\": \"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798\", \"userEvmAddress\": \"0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B\"}'"
    echo ""
    echo "   # Test status endpoint (replace SWAP_ID with actual ID)"
    echo "   curl -X GET http://localhost:8080/swap/status/SWAP_ID"
    echo ""
    echo "3. If you have bitcoin-cli available, test deposit detection:"
    echo "   # Send BTC to the deposit address from step 2"
    echo "   bitcoin-cli sendtoaddress <BTC_DEPOSIT_ADDRESS> 0.1"
    echo "   bitcoin-cli -generate 1"
    echo ""
    echo "4. Check the status again to see if deposit was detected"
    echo ""
}

# Show test coverage
show_coverage() {
    log_info "=== Test Coverage ==="
    cd "$BACKEND_DIR"
    
    if go test -cover ./... 2>/dev/null; then
        log_success "Coverage report generated"
    else
        log_warning "Could not generate coverage report"
    fi
}

# Main function
main() {
    log_info "Backend Test Runner"
    log_info "=================="
    
    # Check prerequisites
    check_go || exit 1
    check_dependencies
    
    # Parse command line arguments
    if [ $# -eq 0 ]; then
        # No arguments, run all tests
        log_info "No test category specified. Running all tests..."
        run_specific_tests "all"
    else
        # Run specific test category
        run_specific_tests "$1"
    fi
    
    # Show additional information
    echo ""
    show_manual_tests
    echo ""
    show_coverage
    echo ""
    
    log_info "Test runner completed!"
}

# Show usage if help is requested
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Backend Test Runner"
    echo ""
    echo "Usage: $0 [category]"
    echo ""
    echo "Categories:"
    echo "  unit         Run unit tests only"
    echo "  integration  Run integration tests only"
    echo "  all          Run all tests (default)"
    echo ""
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 unit         # Run unit tests only"
    echo "  $0 integration  # Run integration tests only"
    echo ""
    exit 0
fi

# Run main function
main "$@" 