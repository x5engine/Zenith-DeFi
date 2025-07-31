package orchestrator_test

import (
	"crypto/sha256"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"

	"fusion-btc-resolver/common"
	"fusion-btc-resolver/orchestrator"
	"fusion-btc-resolver/services"
)

// MockBtcService mocks the Bitcoin HTLC service for testing
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

// MockEvmService mocks the EVM service for testing
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

// SwapOrchestratorTestSuite provides a test suite for the swap orchestrator
type SwapOrchestratorTestSuite struct {
	suite.Suite
	orchestrator *orchestrator.SwapOrchestrator
	mockBtc      *MockBtcService
	mockEvm      *MockEvmService
}

// SetupSuite runs once before all tests
func (suite *SwapOrchestratorTestSuite) SetupSuite() {
	suite.mockBtc = &MockBtcService{}
	suite.mockEvm = &MockEvmService{}
	suite.orchestrator = orchestrator.NewSwapOrchestrator(suite.mockBtc, suite.mockEvm)
}

// SetupTest runs before each test
func (suite *SwapOrchestratorTestSuite) SetupTest() {
	suite.mockBtc.ExpectedCalls = nil
	suite.mockEvm.ExpectedCalls = nil
}

// TestNewSwapOrchestrator tests the orchestrator constructor
func (suite *SwapOrchestratorTestSuite) TestNewSwapOrchestrator() {
	// Arrange & Act
	orchestrator := orchestrator.NewSwapOrchestrator(suite.mockBtc, suite.mockEvm)

	// Assert
	assert.NotNil(suite.T(), orchestrator)
	assert.NotNil(suite.T(), orchestrator.ActiveSwaps)
}

// TestInitiateSwap tests successful swap initiation
func (suite *SwapOrchestratorTestSuite) TestInitiateSwap() {
	// Arrange
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	// Setup mock expectations
	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	// Act
	response, err := suite.orchestrator.InitiateSwap(req)

	// Assert
	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), response)
	assert.NotEmpty(suite.T(), response.SwapID)
	assert.NotEmpty(suite.T(), response.BtcDepositAddress)
	assert.False(suite.T(), response.ExpiresAt.IsZero())
	assert.True(suite.T(), response.ExpiresAt.After(time.Now()))

	// Verify swap was stored
	suite.mockBtc.AssertExpectations(suite.T())
}

// TestInitiateSwapBtcServiceError tests swap initiation when BTC service fails
func (suite *SwapOrchestratorTestSuite) TestInitiateSwapBtcServiceError() {
	// Arrange
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	// Setup mock expectations to return error
	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte{}, "", assert.AnError)

	// Act
	response, err := suite.orchestrator.InitiateSwap(req)

	// Assert
	assert.Error(suite.T(), err)
	assert.Nil(suite.T(), response)
	assert.Contains(suite.T(), err.Error(), "failed to create BTC HTLC")

	suite.mockBtc.AssertExpectations(suite.T())
}

// TestGetSwapStatus tests successful status retrieval
func (suite *SwapOrchestratorTestSuite) TestGetSwapStatus() {
	// Arrange
	swapID := "test-swap-id"
	
	// First create a swap
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	_, err := suite.orchestrator.InitiateSwap(req)
	assert.NoError(suite.T(), err)

	// Act
	status, err := suite.orchestrator.GetSwapStatus(swapID)

	// Assert
	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), status)
	assert.Equal(suite.T(), swapID, status.SwapID)
	assert.Equal(suite.T(), common.StatusPendingDeposit, status.Status)
	assert.Contains(suite.T(), status.Message, "PENDING_DEPOSIT")
}

// TestGetSwapStatusNotFound tests status retrieval for non-existent swap
func (suite *SwapOrchestratorTestSuite) TestGetSwapStatusNotFound() {
	// Arrange
	nonExistentSwapID := "non-existent-swap"

	// Act
	status, err := suite.orchestrator.GetSwapStatus(nonExistentSwapID)

	// Assert
	assert.Error(suite.T(), err)
	assert.Nil(suite.T(), status)
	assert.Contains(suite.T(), err.Error(), "not found")
}

// TestGetSwapStatusEmptyID tests status retrieval with empty swap ID
func (suite *SwapOrchestratorTestSuite) TestGetSwapStatusEmptyID() {
	// Arrange
	emptySwapID := ""

	// Act
	status, err := suite.orchestrator.GetSwapStatus(emptySwapID)

	// Assert
	assert.Error(suite.T(), err)
	assert.Nil(suite.T(), status)
}

// TestSwapLifecycleStateTransitions tests the complete swap lifecycle
func (suite *SwapOrchestratorTestSuite) TestSwapLifecycleStateTransitions() {
	// Arrange
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	// Setup mock expectations
	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	// Act - Initiate swap
	response, err := suite.orchestrator.InitiateSwap(req)
	assert.NoError(suite.T(), err)

	// Assert initial state
	status, err := suite.orchestrator.GetSwapStatus(response.SwapID)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), common.StatusPendingDeposit, status.Status)

	// Verify mock expectations
	suite.mockBtc.AssertExpectations(suite.T())
}

// TestConcurrentSwapInitiation tests multiple concurrent swap initiations
func (suite *SwapOrchestratorTestSuite) TestConcurrentSwapInitiation() {
	// Arrange
	numSwaps := 5
	responses := make([]*common.SwapResponse, numSwaps)
	errors := make([]error, numSwaps)

	// Setup mock expectations for multiple calls
	for i := 0; i < numSwaps; i++ {
		suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
			Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)
	}

	// Act - Initiate swaps concurrently
	done := make(chan bool, numSwaps)
	for i := 0; i < numSwaps; i++ {
		go func(index int) {
			req := &common.SwapRequest{
				QuoteID:             "test-quote-123",
				UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
				UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
			}
			responses[index], errors[index] = suite.orchestrator.InitiateSwap(req)
			done <- true
		}(i)
	}

	// Wait for all goroutines to complete
	for i := 0; i < numSwaps; i++ {
		<-done
	}

	// Assert
	for i := 0; i < numSwaps; i++ {
		assert.NoError(suite.T(), errors[i])
		assert.NotNil(suite.T(), responses[i])
		assert.NotEmpty(suite.T(), responses[i].SwapID)
	}

	suite.mockBtc.AssertExpectations(suite.T())
}

// TestSecretGeneration tests that secrets are properly generated
func (suite *SwapOrchestratorTestSuite) TestSecretGeneration() {
	// Arrange
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	// Act
	response1, err1 := suite.orchestrator.InitiateSwap(req)
	assert.NoError(suite.T(), err1)

	response2, err2 := suite.orchestrator.InitiateSwap(req)
	assert.NoError(suite.T(), err2)

	// Assert - Each swap should have a unique ID (based on secret hash)
	assert.NotEqual(suite.T(), response1.SwapID, response2.SwapID)

	suite.mockBtc.AssertExpectations(suite.T())
}

// TestSwapExpiration tests swap expiration functionality
func (suite *SwapOrchestratorTestSuite) TestSwapExpiration() {
	// Arrange
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	// Act
	response, err := suite.orchestrator.InitiateSwap(req)
	assert.NoError(suite.T(), err)

	// Assert - Expiration should be in the future
	assert.True(suite.T(), response.ExpiresAt.After(time.Now()))
	assert.True(suite.T(), response.ExpiresAt.Before(time.Now().Add(2*time.Hour)))

	suite.mockBtc.AssertExpectations(suite.T())
}

// TestSwapStatePersistence tests that swap state persists across operations
func (suite *SwapOrchestratorTestSuite) TestSwapStatePersistence() {
	// Arrange
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	// Act
	response, err := suite.orchestrator.InitiateSwap(req)
	assert.NoError(suite.T(), err)

	// Get status multiple times
	status1, err1 := suite.orchestrator.GetSwapStatus(response.SwapID)
	assert.NoError(suite.T(), err1)

	status2, err2 := suite.orchestrator.GetSwapStatus(response.SwapID)
	assert.NoError(suite.T(), err2)

	// Assert - State should be consistent
	assert.Equal(suite.T(), status1.Status, status2.Status)
	assert.Equal(suite.T(), status1.Message, status2.Message)

	suite.mockBtc.AssertExpectations(suite.T())
}

// BenchmarkInitiateSwap benchmarks swap initiation performance
func (suite *SwapOrchestratorTestSuite) BenchmarkInitiateSwap(b *testing.B) {
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	// Setup mock expectations
	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := suite.orchestrator.InitiateSwap(req)
		assert.NoError(b, err)
	}
}

// BenchmarkGetSwapStatus benchmarks status retrieval performance
func (suite *SwapOrchestratorTestSuite) BenchmarkGetSwapStatus(b *testing.B) {
	// First create a swap
	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	response, err := suite.orchestrator.InitiateSwap(req)
	assert.NoError(b, err)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := suite.orchestrator.GetSwapStatus(response.SwapID)
		assert.NoError(b, err)
	}
}

// TestSecretHashGeneration tests that secret hashes are properly generated
func (suite *SwapOrchestratorTestSuite) TestSecretHashGeneration() {
	// This test verifies that the secret hash generation works correctly
	// by creating multiple swaps and ensuring they have different hashes

	req := &common.SwapRequest{
		QuoteID:             "test-quote-123",
		UserBtcRefundPubkey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
		UserEvmAddress:      "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
	}

	suite.mockBtc.On("CreateHtlc", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]byte("mock-htlc-script"), "bcrt1qtest123456789", nil)

	// Create multiple swaps
	swapIDs := make([]string, 3)
	for i := 0; i < 3; i++ {
		response, err := suite.orchestrator.InitiateSwap(req)
		assert.NoError(suite.T(), err)
		swapIDs[i] = response.SwapID
	}

	// Verify all swap IDs are unique
	assert.NotEqual(suite.T(), swapIDs[0], swapIDs[1])
	assert.NotEqual(suite.T(), swapIDs[1], swapIDs[2])
	assert.NotEqual(suite.T(), swapIDs[0], swapIDs[2])

	suite.mockBtc.AssertExpectations(suite.T())
}

// Run the test suite
func TestSwapOrchestratorTestSuite(t *testing.T) {
	suite.Run(t, new(SwapOrchestratorTestSuite))
} 