#!/bin/bash

# =========================================================================
# Test Configuration
# =========================================================================
# This file contains configuration variables for the test scripts.
# Modify these values to customize test behavior.

# Backend Configuration
export BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
export BACKEND_PORT="${BACKEND_PORT:-8080}"
export BACKEND_HOST="${BACKEND_HOST:-localhost}"

# Bitcoin Configuration
export BITCOIN_CLI="${BITCOIN_CLI:-bitcoin-cli}"
export BITCOIN_RPC_HOST="${BITCOIN_RPC_HOST:-localhost}"
export BITCOIN_RPC_PORT="${BITCOIN_RPC_PORT:-18443}"
export BITCOIN_RPC_USER="${BITCOIN_RPC_USER:-}"
export BITCOIN_RPC_PASS="${BITCOIN_RPC_PASS:-}"

# Test Configuration
export TEST_TIMEOUT="${TEST_TIMEOUT:-30}"
export TEST_RETRIES="${TEST_RETRIES:-3}"
export TEST_DEPOSIT_AMOUNT="${TEST_DEPOSIT_AMOUNT:-0.1}"
export TEST_CONCURRENT_REQUESTS="${TEST_CONCURRENT_REQUESTS:-5}"

# Logging Configuration
export LOG_LEVEL="${LOG_LEVEL:-INFO}"
export LOG_COLORS="${LOG_COLORS:-true}"
export DEBUG="${DEBUG:-false}"

# Test Data
export TEST_QUOTE_REQUEST='{
    "fromChainId": 0,
    "fromTokenAddress": "BTC",
    "toChainId": 137,
    "toTokenAddress": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    "amount": "10000000"
}'

export TEST_SWAP_REQUEST='{
    "quoteId": "quote-placeholder-123",
    "userBtcRefundPubkey": "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
    "userEvmAddress": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
}'

# Expected Response Patterns
export EXPECTED_QUOTE_FIELDS="toTokenAmount,fee,estimatedTime,quoteId"
export EXPECTED_SWAP_FIELDS="swapId,btcDepositAddress,expiresAt"
export EXPECTED_STATUS_FIELDS="swapId,status,message"

# Performance Thresholds (in milliseconds)
export MAX_HEALTH_RESPONSE_TIME=100
export MAX_QUOTE_RESPONSE_TIME=500
export MAX_SWAP_RESPONSE_TIME=1000
export MAX_STATUS_RESPONSE_TIME=200

# Error Messages
export ERROR_BACKEND_NOT_RUNNING="Backend is not running. Please start it with: go run main.go"
export ERROR_BITCOIN_CLI_NOT_FOUND="bitcoin-cli not found. Some tests will be skipped."
export ERROR_INVALID_RESPONSE="Invalid response format"
export ERROR_TIMEOUT="Request timed out"

# Success Messages
export SUCCESS_BACKEND_RUNNING="Backend is running"
export SUCCESS_BITCOIN_CLI_AVAILABLE="bitcoin-cli is available"
export SUCCESS_DEPOSIT_DETECTED="Deposit detected successfully"

# Test Categories
export TEST_CATEGORIES="unit,integration,all"

# Default test category
export DEFAULT_TEST_CATEGORY="all"

# Test file locations
export UNIT_TEST_DIR="."
export INTEGRATION_TEST_SCRIPT="test_integration.sh"
export COVERAGE_OUTPUT_DIR="coverage"

# Validation patterns
export BTC_ADDRESS_PATTERN="^bcrt1[a-zA-Z0-9]{25,39}$"
export SWAP_ID_PATTERN="^swap-[a-f0-9]{8}$"
export QUOTE_ID_PATTERN="^quote-[a-zA-Z0-9-]+$"

# Timeout values (in seconds)
export CURL_TIMEOUT=10
export DEPOSIT_WAIT_TIME=5
export BLOCK_CONFIRMATION_WAIT=3

# Colors for output (if LOG_COLORS is true)
if [ "$LOG_COLORS" = "true" ]; then
    export RED='\033[0;31m'
    export GREEN='\033[0;32m'
    export YELLOW='\033[1;33m'
    export BLUE='\033[0;34m'
    export NC='\033[0m'
else
    export RED=''
    export GREEN=''
    export YELLOW=''
    export BLUE=''
    export NC=''
fi

# Debug mode
if [ "$DEBUG" = "true" ]; then
    export CURL_VERBOSE="-v"
    export LOG_LEVEL="DEBUG"
else
    export CURL_VERBOSE=""
fi

# Export all variables for use in other scripts
export -p 