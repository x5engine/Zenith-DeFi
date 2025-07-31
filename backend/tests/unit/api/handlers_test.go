package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"

	"fusion-btc-resolver/api"
	"fusion-btc-resolver/common"
	"fusion-btc-resolver/orchestrator"
	"fusion-btc-resolver/services"
)

// MockServices provides mock implementations for testing
type MockServices struct {
	mock.Mock
}

// MockBtcService mocks the Bitcoin HTLC service
type MockBtcService struct {
	mock.Mock
}

func (m *MockBtcService) CreateHtlc(senderPubKey, receiverPubKey, secretHash []byte, lockTime int64) ([]byte, string, error) {
	args := m.Called(senderPubKey, receiverPubKey, secretHash, lockTime)
	return args.Get(0).([]byte), args.String(1), args.Error(2)
}

func (m *MockBtcService) MonitorForDeposit(address string, expectedAmount int64) (string, error) {
	args := m.Called(address, expectedAmount)
	return args.String(0), args.Error(1)
}

func (m *MockBtcService) RedeemHtlc(txHash, htlcScript, userPubkey, resolverPubkey, secret []byte, amount int64) (string, error) {
	args := m.Called(txHash, htlcScript, userPubkey, resolverPubkey, secret, amount)
	return args.String(0), args.Error(1)
}

// MockEvmService mocks the EVM service
type MockEvmService struct {
	mock.Mock
}

func (m *MockEvmService) DepositIntoEscrow(userAddress, escrowAddress string, secretHash [32]byte, amount []byte) (string, error) {
	args := m.Called(userAddress, escrowAddress, secretHash, amount)
	return args.String(0), args.Error(1)
}

func (m *MockEvmService) MonitorForClaimEvent(escrowAddress string) ([]byte, error) {
	args := m.Called(escrowAddress)
	return args.Get(0).([]byte), args.Error(1)
}

// HandlersTestSuite provides a test suite for API handlers
type HandlersTestSuite struct {
	suite.Suite
	handlers     *api.Handlers
	mockBtc      *MockBtcService
	mockEvm      *MockEvmService
	mockOrchestrator *orchestrator.SwapOrchestrator
}

// SetupSuite runs once before all tests
func (suite *HandlersTestSuite) SetupSuite() {
	suite.mockBtc = &MockBtcService{}
	suite.mockEvm = &MockEvmService{}
	suite.mockOrchestrator = orchestrator.NewSwapOrchestrator(suite.mockBtc, suite.mockEvm)
	suite.handlers = api.NewHandlers(suite.mockOrchestrator)
}

// SetupTest runs before each test
func (suite *HandlersTestSuite) SetupTest() {
	suite.mockBtc.ExpectedCalls = nil
	suite.mockEvm.ExpectedCalls = nil
}

// TestGetQuote tests the quote endpoint with valid request
func (suite *HandlersTestSuite) TestGetQuote() {
	// Arrange
	quoteReq := common.QuoteRequest{
		FromChainID:      0,
		FromTokenAddress:  "BTC",
		ToChainID:        137,
		ToTokenAddress:    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
		Amount:           "10000000",
	}

	reqBody, _ := json.Marshal(quoteReq)
	req := httptest.NewRequest(http.MethodPost, "/quote", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetQuote(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var response common.QuoteResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(suite.T(), err)
	assert.NotEmpty(suite.T(), response.QuoteID)
	assert.NotEmpty(suite.T(), response.ToTokenAmount)
	assert.NotEmpty(suite.T(), response.Fee)
	assert.Greater(suite.T(), response.EstimatedTime, 0)
}

// TestGetQuoteInvalidMethod tests the quote endpoint with wrong HTTP method
func (suite *HandlersTestSuite) TestGetQuoteInvalidMethod() {
	// Arrange
	req := httptest.NewRequest(http.MethodGet, "/quote", nil)
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetQuote(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusMethodNotAllowed, w.Code)

	var errorResponse map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &errorResponse)
	assert.NoError(suite.T(), err)
	assert.Contains(suite.T(), errorResponse["error"], "Method not allowed")
}

// TestGetQuoteInvalidBody tests the quote endpoint with invalid JSON
func (suite *HandlersTestSuite) TestGetQuoteInvalidBody() {
	// Arrange
	req := httptest.NewRequest(http.MethodPost, "/quote", bytes.NewBufferString("invalid json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetQuote(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)

	var errorResponse map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &errorResponse)
	assert.NoError(suite.T(), err)
	assert.Contains(suite.T(), errorResponse["error"], "Invalid request body")
}

// TestGetQuoteEmptyBody tests the quote endpoint with empty body
func (suite *HandlersTestSuite) TestGetQuoteEmptyBody() {
	// Arrange
	req := httptest.NewRequest(http.MethodPost, "/quote", bytes.NewBuffer([]byte{}))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetQuote(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)
}

// TestInitiateSwap tests the swap initiation endpoint
func (suite *HandlersTestSuite) TestInitiateSwap() {
	// Arrange
	swapReq := common.SwapRequest{
		QuoteID:             "quote-placeholder-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	// Setup mock expectations
	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	reqBody, _ := json.Marshal(swapReq)
	req := httptest.NewRequest(http.MethodPost, "/swap/initiate", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	suite.handlers.InitiateSwap(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var response common.SwapResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(suite.T(), err)
	assert.NotEmpty(suite.T(), response.SwapID)
	assert.NotEmpty(suite.T(), response.BtcDepositAddress)
	assert.False(suite.T(), response.ExpiresAt.IsZero())
	assert.True(suite.T(), response.ExpiresAt.After(time.Now()))
}

// TestInitiateSwapInvalidMethod tests the swap initiation endpoint with wrong HTTP method
func (suite *HandlersTestSuite) TestInitiateSwapInvalidMethod() {
	// Arrange
	req := httptest.NewRequest(http.MethodGet, "/swap/initiate", nil)
	w := httptest.NewRecorder()

	// Act
	suite.handlers.InitiateSwap(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusMethodNotAllowed, w.Code)
}

// TestInitiateSwapInvalidBody tests the swap initiation endpoint with invalid JSON
func (suite *HandlersTestSuite) TestInitiateSwapInvalidBody() {
	// Arrange
	req := httptest.NewRequest(http.MethodPost, "/swap/initiate", bytes.NewBufferString("invalid json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	suite.handlers.InitiateSwap(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)
}

// TestInitiateSwapMissingFields tests the swap initiation endpoint with missing required fields
func (suite *HandlersTestSuite) TestInitiateSwapMissingFields() {
	// Arrange
	invalidReq := map[string]string{
		"quoteId": "test-quote",
		// Missing required fields
	}
	reqBody, _ := json.Marshal(invalidReq)
	req := httptest.NewRequest(http.MethodPost, "/swap/initiate", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	suite.handlers.InitiateSwap(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)
}

// TestGetSwapStatus tests the swap status endpoint
func (suite *HandlersTestSuite) TestGetSwapStatus() {
	// Arrange
	swapID := "test-swap-id"
	req := httptest.NewRequest(http.MethodGet, "/swap/status/"+swapID, nil)
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetSwapStatus(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var response common.SwapStatusResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), swapID, response.SwapID)
	assert.NotEmpty(suite.T(), response.Status)
	assert.NotEmpty(suite.T(), response.Message)
}

// TestGetSwapStatusInvalidMethod tests the swap status endpoint with wrong HTTP method
func (suite *HandlersTestSuite) TestGetSwapStatusInvalidMethod() {
	// Arrange
	req := httptest.NewRequest(http.MethodPost, "/swap/status/test-swap-id", nil)
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetSwapStatus(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusMethodNotAllowed, w.Code)
}

// TestGetSwapStatusMissingID tests the swap status endpoint without swap ID
func (suite *HandlersTestSuite) TestGetSwapStatusMissingID() {
	// Arrange
	req := httptest.NewRequest(http.MethodGet, "/swap/status/", nil)
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetSwapStatus(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)
}

// TestGetSwapStatusEmptyID tests the swap status endpoint with empty swap ID
func (suite *HandlersTestSuite) TestGetSwapStatusEmptyID() {
	// Arrange
	req := httptest.NewRequest(http.MethodGet, "/swap/status/  ", nil) // Whitespace
	w := httptest.NewRecorder()

	// Act
	suite.handlers.GetSwapStatus(w, req)

	// Assert
	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)
}

// TestWriteJSON tests the writeJSON helper function
func (suite *HandlersTestSuite) TestWriteJSON() {
	// Arrange
	w := httptest.NewRecorder()
	testData := map[string]string{"test": "value"}

	// Act
	api.WriteJSON(w, http.StatusOK, testData)

	// Assert
	assert.Equal(suite.T(), http.StatusOK, w.Code)
	assert.Equal(suite.T(), "application/json", w.Header().Get("Content-Type"))

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), "value", response["test"])
}

// TestWriteError tests the writeError helper function
func (suite *HandlersTestSuite) TestWriteError() {
	// Arrange
	w := httptest.NewRecorder()
	errorMessage := "Test error message"

	// Act
	api.WriteError(w, http.StatusBadRequest, errorMessage)

	// Assert
	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)
	assert.Equal(suite.T(), "application/json", w.Header().Get("Content-Type"))

	var errorResponse map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &errorResponse)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), errorMessage, errorResponse["error"])
}

// BenchmarkGetQuote benchmarks the quote endpoint
func (suite *HandlersTestSuite) BenchmarkGetQuote(b *testing.B) {
	quoteReq := common.QuoteRequest{
		FromChainID:      0,
		FromTokenAddress:  "BTC",
		ToChainID:        137,
		ToTokenAddress:    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
		Amount:           "10000000",
	}
	reqBody, _ := json.Marshal(quoteReq)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := httptest.NewRequest(http.MethodPost, "/quote", bytes.NewBuffer(reqBody))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		suite.handlers.GetQuote(w, req)
	}
}

// BenchmarkInitiateSwap benchmarks the swap initiation endpoint
func (suite *HandlersTestSuite) BenchmarkInitiateSwap(b *testing.B) {
	swapReq := common.SwapRequest{
		QuoteID:             "quote-placeholder-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}
	reqBody, _ := json.Marshal(swapReq)

	// Setup mock expectations
	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := httptest.NewRequest(http.MethodPost, "/swap/initiate", bytes.NewBuffer(reqBody))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		suite.handlers.InitiateSwap(w, req)
	}
}

// Run the test suite
func TestHandlersTestSuite(t *testing.T) {
	suite.Run(t, new(HandlersTestSuite))
} 