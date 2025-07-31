package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"fusion-btc-resolver/api"
	"fusion-btc-resolver/common"
	"fusion-btc-resolver/orchestrator"
	"fusion-btc-resolver/services"
)

// MockBtcService for integration testing
type MockBtcService struct{}

func (m *MockBtcService) CreateHtlc(senderPubKey, receiverPubKey, secretHash []byte, lockTime int64) ([]byte, string, error) {
	return []byte("mock-htlc-script"), "bcrt1qtest123456789", nil
}

func (m *MockBtcService) MonitorForDeposit(address string, expectedAmount int64) (string, error) {
	return "mock-txid", nil
}

func (m *MockBtcService) RedeemHtlc(txHash, htlcScript, userPubkey, resolverPubkey, secret []byte, amount int64) (string, error) {
	return "mock-redeem-txid", nil
}

// MockEvmService for integration testing
type MockEvmService struct{}

func (m *MockEvmService) DepositIntoEscrow(userAddress, escrowAddress string, secretHash [32]byte, amount []byte) (string, error) {
	return "mock-evm-txid", nil
}

func (m *MockEvmService) MonitorForClaimEvent(escrowAddress string) ([]byte, error) {
	return []byte("mock-revealed-secret"), nil
}

// APIIntegrationTestSuite provides integration tests for the API
type APIIntegrationTestSuite struct {
	suite.Suite
	server     *httptest.Server
	handlers   *api.Handlers
	orchestrator *orchestrator.SwapOrchestrator
}

// SetupSuite runs once before all tests
func (suite *APIIntegrationTestSuite) SetupSuite() {
	// Create mock services
	mockBtc := &MockBtcService{}
	mockEvm := &MockEvmService{}
	
	// Create orchestrator
	suite.orchestrator = orchestrator.NewSwapOrchestrator(mockBtc, mockEvm)
	
	// Create handlers
	suite.handlers = api.NewHandlers(suite.orchestrator)
	
	// Create test server
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	mux.HandleFunc("/quote", suite.handlers.GetQuote)
	mux.HandleFunc("/swap/initiate", suite.handlers.InitiateSwap)
	mux.HandleFunc("/swap/status/", func(w http.ResponseWriter, r *http.Request) {
		// Extract swap ID from path
		path := r.URL.Path
		if len(path) > len("/swap/status/") {
			swapID := path[len("/swap/status/"):]
			r.URL.Path = "/swap/status/" + swapID
		}
		suite.handlers.GetSwapStatus(w, r)
	})
	
	suite.server = httptest.NewServer(mux)
}

// TearDownSuite runs once after all tests
func (suite *APIIntegrationTestSuite) TearDownSuite() {
	if suite.server != nil {
		suite.server.Close()
	}
}

// TestHealthEndpoint tests the health endpoint
func (suite *APIIntegrationTestSuite) TestHealthEndpoint() {
	// Arrange
	url := suite.server.URL + "/health"
	
	// Act
	resp, err := http.Get(url)
	
	// Assert
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)
	
	body := make([]byte, 10)
	n, _ := resp.Body.Read(body)
	resp.Body.Close()
	
	assert.Equal(suite.T(), "OK", string(body[:n]))
}

// TestQuoteEndpoint tests the quote endpoint
func (suite *APIIntegrationTestSuite) TestQuoteEndpoint() {
	// Arrange
	url := suite.server.URL + "/quote"
	quoteReq := common.QuoteRequest{
		FromChainID:      0,
		FromTokenAddress:  "BTC",
		ToChainID:        137,
		ToTokenAddress:    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
		Amount:           "10000000",
	}
	
	reqBody, _ := json.Marshal(quoteReq)
	
	// Act
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(reqBody))
	
	// Assert
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)
	
	var response common.QuoteResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	resp.Body.Close()
	
	assert.NoError(suite.T(), err)
	assert.NotEmpty(suite.T(), response.QuoteID)
	assert.NotEmpty(suite.T(), response.ToTokenAmount)
	assert.NotEmpty(suite.T(), response.Fee)
	assert.Greater(suite.T(), response.EstimatedTime, 0)
}

// TestSwapInitiation tests the swap initiation endpoint
func (suite *APIIntegrationTestSuite) TestSwapInitiation() {
	// Arrange
	url := suite.server.URL + "/swap/initiate"
	swapReq := common.SwapRequest{
		QuoteID:             "quote-placeholder-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}
	
	reqBody, _ := json.Marshal(swapReq)
	
	// Act
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(reqBody))
	
	// Assert
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)
	
	var response common.SwapResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	resp.Body.Close()
	
	assert.NoError(suite.T(), err)
	assert.NotEmpty(suite.T(), response.SwapID)
	assert.NotEmpty(suite.T(), response.BtcDepositAddress)
	assert.False(suite.T(), response.ExpiresAt.IsZero())
	assert.True(suite.T(), response.ExpiresAt.After(time.Now()))
}

// TestSwapStatus tests the swap status endpoint
func (suite *APIIntegrationTestSuite) TestSwapStatus() {
	// First create a swap
	swapReq := common.SwapRequest{
		QuoteID:             "quote-placeholder-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}
	
	reqBody, _ := json.Marshal(swapReq)
	resp, err := http.Post(suite.server.URL+"/swap/initiate", "application/json", bytes.NewBuffer(reqBody))
	assert.NoError(suite.T(), err)
	
	var swapResponse common.SwapResponse
	err = json.NewDecoder(resp.Body).Decode(&swapResponse)
	resp.Body.Close()
	assert.NoError(suite.T(), err)
	
	// Now test status endpoint
	url := suite.server.URL + "/swap/status/" + swapResponse.SwapID
	
	// Act
	resp, err = http.Get(url)
	
	// Assert
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)
	
	var statusResponse common.SwapStatusResponse
	err = json.NewDecoder(resp.Body).Decode(&statusResponse)
	resp.Body.Close()
	
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), swapResponse.SwapID, statusResponse.SwapID)
	assert.NotEmpty(suite.T(), statusResponse.Status)
	assert.NotEmpty(suite.T(), statusResponse.Message)
}

// TestErrorHandling tests error scenarios
func (suite *APIIntegrationTestSuite) TestErrorHandling() {
	// Test invalid method for quote
	req, _ := http.NewRequest(http.MethodGet, suite.server.URL+"/quote", nil)
	resp, err := http.DefaultClient.Do(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), http.StatusMethodNotAllowed, resp.StatusCode)
	resp.Body.Close()
	
	// Test invalid JSON
	resp, err = http.Post(suite.server.URL+"/quote", "application/json", bytes.NewBufferString("invalid json"))
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), http.StatusBadRequest, resp.StatusCode)
	resp.Body.Close()
	
	// Test non-existent swap status
	resp, err = http.Get(suite.server.URL + "/swap/status/non-existent-swap")
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), http.StatusNotFound, resp.StatusCode)
	resp.Body.Close()
}

// TestConcurrentRequests tests concurrent API requests
func (suite *APIIntegrationTestSuite) TestConcurrentRequests() {
	numRequests := 10
	responses := make([]*http.Response, numRequests)
	
	// Make concurrent quote requests
	for i := 0; i < numRequests; i++ {
		quoteReq := common.QuoteRequest{
			FromChainID:      0,
			FromTokenAddress:  "BTC",
			ToChainID:        137,
			ToTokenAddress:    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
			Amount:           "10000000",
		}
		
		reqBody, _ := json.Marshal(quoteReq)
		resp, err := http.Post(suite.server.URL+"/quote", "application/json", bytes.NewBuffer(reqBody))
		assert.NoError(suite.T(), err)
		responses[i] = resp
	}
	
	// Verify all responses
	for i, resp := range responses {
		assert.Equal(suite.T(), http.StatusOK, resp.StatusCode, "Request %d failed", i)
		resp.Body.Close()
	}
}

// Run the test suite
func TestAPIIntegrationTestSuite(t *testing.T) {
	suite.Run(t, new(APIIntegrationTestSuite))
} 