#!/bin/bash

# =========================================================================
# Backend Integration Test Script
# =========================================================================
# This script automates the test cases described in TESTING.md
# It tests the complete swap lifecycle from quote to deposit detection

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/test_config.sh"

# Configuration (can be overridden by environment variables)
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
BITCOIN_CLI="${BITCOIN_CLI:-bitcoin-cli}"

# Test state variables
SWAP_ID=""
BTC_DEPOSIT_ADDRESS=""
QUOTE_ID=""

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

# Check if backend is running
check_backend() {
    log_info "Checking if backend is running..."
    if curl -s "$BACKEND_URL/health" > /dev/null 2>&1; then
        log_success "Backend is running"
        return 0
    else
        log_error "Backend is not running. Please start it with: go run main.go"
        return 1
    fi
}

# Check if bitcoin-cli is available
check_bitcoin_cli() {
    log_info "Checking if bitcoin-cli is available..."
    if command -v $BITCOIN_CLI > /dev/null 2>&1; then
        log_success "bitcoin-cli is available"
        return 0
    else
        log_warning "bitcoin-cli not found. Some tests will be skipped."
        return 1
    fi
}

# Test Case 1: Health Check & Quote Endpoint
test_quote_endpoint() {
    log_info "=== Test Case 1: Health Check & Quote Endpoint ==="
    
    local response=$(curl -s $CURL_VERBOSE -X POST "$BACKEND_URL/quote" \
        -H "Content-Type: application/json" \
        -d "$TEST_QUOTE_REQUEST")
    
    if [ $? -eq 0 ]; then
        log_success "Quote endpoint responded successfully"
        echo "Response: $response"
        
        # Extract quote ID for later use
        QUOTE_ID=$(echo "$response" | grep -o '"quoteId":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$QUOTE_ID" ]; then
            log_success "Quote ID extracted: $QUOTE_ID"
        else
            log_warning "Could not extract Quote ID from response"
        fi
    else
        log_error "Quote endpoint failed"
        return 1
    fi
}

# Test Case 2: Swap Initiation
test_swap_initiation() {
    log_info "=== Test Case 2: Swap Initiation ==="
    
    # Use the quote ID from previous test, or fallback to placeholder
    local quote_id=${QUOTE_ID:-"quote-placeholder-123"}
    
    local response=$(curl -s $CURL_VERBOSE -X POST "$BACKEND_URL/swap/initiate" \
        -H "Content-Type: application/json" \
        -d "$TEST_SWAP_REQUEST")
    
    if [ $? -eq 0 ]; then
        log_success "Swap initiation responded successfully"
        echo "Response: $response"
        
        # Extract swap ID and BTC deposit address
        SWAP_ID=$(echo "$response" | grep -o '"swapId":"[^"]*"' | cut -d'"' -f4)
        BTC_DEPOSIT_ADDRESS=$(echo "$response" | grep -o '"btcDepositAddress":"[^"]*"' | cut -d'"' -f4)
        
        if [ -n "$SWAP_ID" ] && [ -n "$BTC_DEPOSIT_ADDRESS" ]; then
            log_success "Swap ID: $SWAP_ID"
            log_success "BTC Deposit Address: $BTC_DEPOSIT_ADDRESS"
            
            # Validate BTC address format (should start with bcrt1 for regtest)
            if [[ "$BTC_DEPOSIT_ADDRESS" == bcrt1* ]]; then
                log_success "BTC address format is valid (regtest)"
            else
                log_warning "BTC address format may be invalid: $BTC_DEPOSIT_ADDRESS"
            fi
        else
            log_error "Could not extract Swap ID or BTC Deposit Address"
            return 1
        fi
    else
        log_error "Swap initiation failed"
        return 1
    fi
}

# Test Case 3: Initial Status Check
test_initial_status() {
    log_info "=== Test Case 3: Initial Status Check ==="
    
    if [ -z "$SWAP_ID" ]; then
        log_error "No Swap ID available for status check"
        return 1
    fi
    
    local response=$(curl -s $CURL_VERBOSE -X GET "$BACKEND_URL/swap/status/$SWAP_ID")
    
    if [ $? -eq 0 ]; then
        log_success "Status check responded successfully"
        echo "Response: $response"
        
        # Check if status is PENDING_DEPOSIT
        if echo "$response" | grep -q "PENDING_DEPOSIT"; then
            log_success "Status is correctly PENDING_DEPOSIT"
        else
            log_warning "Status is not PENDING_DEPOSIT as expected"
            echo "Current status: $(echo "$response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
        fi
    else
        log_error "Status check failed"
        return 1
    fi
}

# Test Case 4: End-to-End Deposit Detection
test_deposit_detection() {
    log_info "=== Test Case 4: End-to-End Deposit Detection ==="
    
    if [ -z "$BTC_DEPOSIT_ADDRESS" ]; then
        log_error "No BTC deposit address available for testing"
        return 1
    fi
    
    if ! command -v $BITCOIN_CLI > /dev/null 2>&1; then
        log_warning "bitcoin-cli not available. Skipping deposit simulation."
        log_info "To test deposit detection manually:"
        log_info "1. Send BTC to: $BTC_DEPOSIT_ADDRESS"
        log_info "2. Mine a block: $BITCOIN_CLI -generate 1"
        log_info "3. Check status: curl -X GET $BACKEND_URL/swap/status/$SWAP_ID"
        return 0
    fi
    
    log_info "Sending 0.1 BTC to deposit address: $BTC_DEPOSIT_ADDRESS"
    
    # Send BTC to the deposit address
    local txid=$($BITCOIN_CLI sendtoaddress "$BTC_DEPOSIT_ADDRESS" $TEST_DEPOSIT_AMOUNT)
    if [ $? -eq 0 ]; then
        log_success "Transaction sent successfully. TXID: $txid"
    else
        log_error "Failed to send BTC transaction"
        return 1
    fi
    
    # Mine a block to confirm the transaction
    log_info "Mining a block to confirm the transaction..."
    local block_hash=$($BITCOIN_CLI -generate 1)
    if [ $? -eq 0 ]; then
        log_success "Block mined successfully. Block hash: $block_hash"
    else
        log_error "Failed to mine block"
        return 1
    fi
    
    # Wait a moment for the backend to process the confirmation
    log_info "Waiting for backend to process the confirmation..."
    sleep $DEPOSIT_WAIT_TIME
    
    # Check the final status
    log_info "Checking final swap status..."
    local final_response=$(curl -s -X GET "$BACKEND_URL/swap/status/$SWAP_ID")
    
    if [ $? -eq 0 ]; then
        log_success "Final status check successful"
        echo "Final Response: $final_response"
        
        # Check if status has been updated from PENDING_DEPOSIT
        local current_status=$(echo "$final_response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        if [ "$current_status" != "PENDING_DEPOSIT" ]; then
            log_success "Status has been updated to: $current_status"
        else
            log_warning "Status is still PENDING_DEPOSIT - deposit may not have been detected"
        fi
    else
        log_error "Final status check failed"
        return 1
    fi
}

# Test Case 5: Error Handling
test_error_handling() {
    log_info "=== Test Case 5: Error Handling ==="
    
    # Test invalid swap ID
    log_info "Testing invalid swap ID..."
    local response=$(curl -s -X GET "$BACKEND_URL/swap/status/invalid-swap-id")
    if [ $? -eq 0 ]; then
        if echo "$response" | grep -q "error\|not found"; then
            log_success "Invalid swap ID handled correctly"
        else
            log_warning "Invalid swap ID response: $response"
        fi
    fi
    
    # Test invalid request body
    log_info "Testing invalid request body..."
    local response=$(curl -s -X POST "$BACKEND_URL/swap/initiate" \
        -H "Content-Type: application/json" \
        -d '{"invalid": "json"}')
    if [ $? -eq 0 ]; then
        if echo "$response" | grep -q "error\|bad request"; then
            log_success "Invalid request body handled correctly"
        else
            log_warning "Invalid request body response: $response"
        fi
    fi
    
    # Test wrong HTTP method
    log_info "Testing wrong HTTP method..."
    local response=$(curl -s -X GET "$BACKEND_URL/swap/initiate")
    if [ $? -eq 0 ]; then
        if echo "$response" | grep -q "method not allowed"; then
            log_success "Wrong HTTP method handled correctly"
        else
            log_warning "Wrong HTTP method response: $response"
        fi
    fi
}

# Test Case 6: Performance and Load Testing
test_performance() {
    log_info "=== Test Case 6: Performance Testing ==="
    
    # Test multiple concurrent quote requests
    log_info "Testing concurrent quote requests..."
    for i in $(seq 1 $TEST_CONCURRENT_REQUESTS); do
        (
            local response=$(curl -s -X POST "$BACKEND_URL/quote" \
                -H "Content-Type: application/json" \
                -d "{
                    \"fromChainId\": 0,
                    \"fromTokenAddress\": \"BTC\",
                    \"toChainId\": 137,
                    \"toTokenAddress\": \"0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6\",
                    \"amount\": \"10000000\"
                }")
            if [ $? -eq 0 ]; then
                echo "Quote request $i successful"
            else
                echo "Quote request $i failed"
            fi
        ) &
    done
    wait
    
    log_success "Concurrent quote requests completed"
}

# Main test execution
main() {
    log_info "Starting Backend Integration Tests"
    log_info "=================================="
    
    # Check prerequisites
    check_backend || exit 1
    check_bitcoin_cli
    
    # Run all test cases
    test_quote_endpoint
    test_swap_initiation
    test_initial_status
    test_deposit_detection
    test_error_handling
    test_performance
    
    log_info "=================================="
    log_success "All tests completed!"
    
    # Summary
    echo ""
    log_info "Test Summary:"
    echo "- Quote endpoint: ${QUOTE_ID:-"N/A"}"
    echo "- Swap ID: ${SWAP_ID:-"N/A"}"
    echo "- BTC Deposit Address: ${BTC_DEPOSIT_ADDRESS:-"N/A"}"
    echo ""
    log_info "To monitor backend logs, check the terminal running 'go run main.go'"
}

# Run main function
main "$@" 