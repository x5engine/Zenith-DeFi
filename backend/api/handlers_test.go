package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/btcsuite/btcd/btcec/v2"
	"github.com/btcsuite/btcd/btcutil"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcd/chaincfg/chainhash"

	"fusion-btc-resolver/common"
	"fusion-btc-resolver/orchestrator"
	"fusion-btc-resolver/services"
)

// Mock services for testing
type mockBtcService struct{}
type mockEvmService struct{}

func (m *mockBtcService) CreateHtlc(senderPubKey, receiverPubKey, secretHash []byte, lockTime int64) ([]byte, btcutil.Address, error) {
	addr, _ := btcutil.DecodeAddress("bcrt1qtest123456789", &chaincfg.RegressionNetParams)
	return []byte("mock-htlc-script"), addr, nil
}

func (m *mockBtcService) MonitorForDeposit(htlcAddress btcutil.Address, expectedAmount btcutil.Amount) (*chainhash.Hash, error) {
	hash, _ := chainhash.NewHashFromStr("0000000000000000000000000000000000000000000000000000000000000001")
	return hash, nil
}

func (m *mockBtcService) RedeemHtlc(fundingTxHash *chainhash.Hash, htlcScript []byte, redeemAddress btcutil.Address, key *btcec.PrivateKey, preimage []byte, lockTime int64) (*chainhash.Hash, error) {
	hash, _ := chainhash.NewHashFromStr("0000000000000000000000000000000000000000000000000000000000000002")
	return hash, nil
}

func (m *mockEvmService) DepositIntoEscrow(userAddress, escrowAddress string, secretHash [32]byte, amount []byte) (string, error) {
	return "mock-evm-txid", nil
}

func (m *mockEvmService) MonitorForClaimEvent(escrowAddress string) ([]byte, error) {
	return []byte("mock-revealed-secret"), nil
}

// TestGetQuote tests the quote endpoint
func TestGetQuote(t *testing.T) {
	// Create mock orchestrator
	mockOrchestrator := orchestrator.NewSwapOrchestrator(&mockBtcService{}, &mockEvmService{})

	handlers := NewHandlers(mockOrchestrator)

	// Test valid quote request
	quoteReq := common.QuoteRequest{
		FromChainID:      0,
		FromTokenAddress:  "BTC",
		ToChainID:        137,
		ToTokenAddress:    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
		Amount:           "10000000",
	}

	reqBody, _ := json.Marshal(quoteReq)
	req := httptest.NewRequest("POST", "/quote", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handlers.GetQuote(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response common.QuoteResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Errorf("Failed to unmarshal response: %v", err)
	}

	if response.QuoteID == "" {
		t.Error("Expected QuoteID to be set")
	}

	if response.ToTokenAmount == "" {
		t.Error("Expected ToTokenAmount to be set")
	}
}

// TestGetQuoteInvalidMethod tests the quote endpoint with wrong HTTP method
func TestGetQuoteInvalidMethod(t *testing.T) {
	handlers := &Handlers{}

	req := httptest.NewRequest("GET", "/quote", nil)
	w := httptest.NewRecorder()

	handlers.GetQuote(w, req)

	if w.Code != http.StatusMethodNotAllowed {
		t.Errorf("Expected status 405, got %d", w.Code)
	}
}

// TestGetQuoteInvalidBody tests the quote endpoint with invalid JSON
func TestGetQuoteInvalidBody(t *testing.T) {
	handlers := &Handlers{}

	req := httptest.NewRequest("POST", "/quote", bytes.NewBufferString("invalid json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handlers.GetQuote(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

// TestInitiateSwap tests the swap initiation endpoint
func TestInitiateSwap(t *testing.T) {
	// Create mock orchestrator
	mockOrchestrator := orchestrator.NewSwapOrchestrator(&mockBtcService{}, &mockEvmService{})

	handlers := NewHandlers(mockOrchestrator)

	// Test valid swap request
	swapReq := common.SwapRequest{
		QuoteID:             "quote-placeholder-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	reqBody, _ := json.Marshal(swapReq)
	req := httptest.NewRequest("POST", "/swap/initiate", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handlers.InitiateSwap(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response common.SwapResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Errorf("Failed to unmarshal response: %v", err)
	}

	if response.SwapID == "" {
		t.Error("Expected SwapID to be set")
	}

	if response.BtcDepositAddress == "" {
		t.Error("Expected BtcDepositAddress to be set")
	}
}

// TestInitiateSwapInvalidMethod tests the swap initiation endpoint with wrong HTTP method
func TestInitiateSwapInvalidMethod(t *testing.T) {
	handlers := &Handlers{}

	req := httptest.NewRequest("GET", "/swap/initiate", nil)
	w := httptest.NewRecorder()

	handlers.InitiateSwap(w, req)

	if w.Code != http.StatusMethodNotAllowed {
		t.Errorf("Expected status 405, got %d", w.Code)
	}
}

// TestGetSwapStatus tests the swap status endpoint
func TestGetSwapStatus(t *testing.T) {
	// Create mock orchestrator
	mockOrchestrator := orchestrator.NewSwapOrchestrator(&mockBtcService{}, &mockEvmService{})

	handlers := NewHandlers(mockOrchestrator)

	// Test valid status request
	req := httptest.NewRequest("GET", "/swap/status/test-swap-id", nil)
	w := httptest.NewRecorder()

	handlers.GetSwapStatus(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response common.SwapStatusResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Errorf("Failed to unmarshal response: %v", err)
	}

	if response.SwapID == "" {
		t.Error("Expected SwapID to be set")
	}
}

// TestGetSwapStatusInvalidMethod tests the swap status endpoint with wrong HTTP method
func TestGetSwapStatusInvalidMethod(t *testing.T) {
	handlers := &Handlers{}

	req := httptest.NewRequest("POST", "/swap/status/test-swap-id", nil)
	w := httptest.NewRecorder()

	handlers.GetSwapStatus(w, req)

	if w.Code != http.StatusMethodNotAllowed {
		t.Errorf("Expected status 405, got %d", w.Code)
	}
}

// TestGetSwapStatusMissingID tests the swap status endpoint without swap ID
func TestGetSwapStatusMissingID(t *testing.T) {
	handlers := &Handlers{}

	req := httptest.NewRequest("GET", "/swap/status/", nil)
	w := httptest.NewRecorder()

	handlers.GetSwapStatus(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
} 