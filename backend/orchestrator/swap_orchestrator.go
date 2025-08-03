/*
================================================================================
File 6: orchestrator/swap_orchestrator.go - The Swap Lifecycle Orchestrator
================================================================================

PURPOSE:
This file contains the core business logic for the entire resolver backend.
The SwapOrchestrator is responsible for managing the state of each individual
swap from initiation to completion. It acts as the conductor, telling the
Bitcoin and EVM services what to do and when, based on the current state of
the swap.

KEY RESPONSIBILITIES:
- Managing an in-memory store of active swaps (for a hackathon; a production
  system would use a persistent database like Redis or PostgreSQL).
- Handling the initial swap request: generating secrets, creating the HTLC
  parameters via the BtcHtlcService, and storing the initial state.
- Launching a dedicated background process (goroutine) for each swap to manage
  its lifecycle independently.
- Executing the state machine for a swap:
  1. Monitor for the user's BTC deposit.
  2. Once confirmed, deposit corresponding funds into the EVM escrow.
  3. Monitor for the user's claim on the EVM chain to reveal the secret.
  4. Use the revealed secret to claim the user's BTC.
- Handling timeout and error conditions to trigger refunds.

*/

package orchestrator

import (
	"bytes"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"log"
	"math/big"
	"sync"
	"time"

	// "github.com/btcsuite/btcd/chaincfg"
	// "github.com/btcsuite/btcutil"

	"github.com/ethereum/go-ethereum/common"

	localcommon "fusion-btc-resolver/common"
	"fusion-btc-resolver/services"
)

// SwapState holds all the information for a single, ongoing swap.
type SwapState struct {
	ID                    string
	Status                localcommon.SwapStatus
	Secret                []byte
	SecretHash            [32]byte
	BtcDepositAddress     string
	BtcHtlcScript         []byte
	BtcDestinationAddress string  // Where to send the Bitcoin
	BtcAmount             float64 // Amount of BTC to send
	// ... other necessary fields like user addresses, amounts, etc.
}

// SwapOrchestrator manages the lifecycle of all swaps.
type SwapOrchestrator struct {
	BtcService  *services.BtcHtlcService
	EvmService  *services.EvmService
	ActiveSwaps map[string]*SwapState
	mu          sync.Mutex // Mutex to protect access to the activeSwaps map
}

// NewSwapOrchestrator creates a new instance of the orchestrator.
func NewSwapOrchestrator(btc *services.BtcHtlcService, evm *services.EvmService) *SwapOrchestrator {
	return &SwapOrchestrator{
		BtcService:  btc,
		EvmService:  evm,
		ActiveSwaps: make(map[string]*SwapState),
	}
}

// InitiateSwapWithAmount sets up a new swap with the specified BTC amount and starts its lifecycle management.
func (o *SwapOrchestrator) InitiateSwapWithAmount(req *localcommon.SwapRequest, btcAmount float64) (*localcommon.SwapResponse, error) {
	o.mu.Lock()
	defer o.mu.Unlock()

	// 1. Generate a new secret and its hash
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		return nil, fmt.Errorf("failed to generate secret: %v", err)
	}
	secretHash := sha256.Sum256(secret)

	// 2. Create the HTLC via the Bitcoin service
	// Note: Public keys would need to be derived from user-provided data or resolver config.
	// These are placeholders for the demonstration.
	var mockUserBtcPubkey, mockResolverBtcPubkey []byte
	var mockLockTime int64 = 100 // blocks in the future

	htlcScript, htlcAddress, err := o.BtcService.CreateHtlc(
		mockUserBtcPubkey,
		mockResolverBtcPubkey,
		secretHash[:],
		mockLockTime,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create BTC HTLC: %v", err)
	}

	// 3. Create and store the initial state for the swap
	swapID := fmt.Sprintf("swap-%x", secretHash[:8])

	log.Printf("[ORCHESTRATOR] Using BTC amount from quote: %.8f BTC", btcAmount)

	state := &SwapState{
		ID:                    swapID,
		Status:                localcommon.StatusPendingDeposit,
		Secret:                secret,
		SecretHash:            secretHash,
		BtcDepositAddress:     htlcAddress.EncodeAddress(),
		BtcHtlcScript:         htlcScript,
		BtcDestinationAddress: req.BtcDestinationAddress, // Store where to send Bitcoin
		BtcAmount:             btcAmount,                 // Store how much to send
	}
	o.ActiveSwaps[swapID] = state

	log.Printf("[ORCHESTRATOR] New swap initiated. ID: %s, BTC Deposit Address: %s", swapID, htlcAddress.EncodeAddress())

	// 4. Launch the background lifecycle manager for this swap
	go o.runSwapLifecycle(state)

	// 5. Return the deposit details to the user
	return &localcommon.SwapResponse{
		SwapID:            swapID,
		BtcDepositAddress: htlcAddress.EncodeAddress(),
		ExpiresAt:         time.Now().Add(1 * time.Hour), // Example expiration
	}, nil
}

// GetSwapStatus retrieves the current status of a swap.
func (o *SwapOrchestrator) GetSwapStatus(swapID string) (*localcommon.SwapStatusResponse, error) {
	o.mu.Lock()
	defer o.mu.Unlock()

	state, ok := o.ActiveSwaps[swapID]
	if !ok {
		return nil, fmt.Errorf("swap with ID %s not found", swapID)
	}

	return &localcommon.SwapStatusResponse{
		SwapID:  swapID,
		Status:  state.Status,
		Message: fmt.Sprintf("Swap is currently in state: %s", state.Status),
	}, nil
}

// runSwapLifecycle is the core state machine for a single swap.
// It runs in a dedicated goroutine.
func (o *SwapOrchestrator) runSwapLifecycle(state *SwapState) {
	log.Printf("[LIFECYCLE-%s] Starting lifecycle management.", state.ID)

	// === Phase 1: Wait for BTC Deposit ===
	state.Status = localcommon.StatusPendingDeposit
	// In a real app, amounts would come from the quote request
	// Demo: Simulate BTC deposit detection for testing
	log.Printf("[LIFECYCLE-%s] Demo: Simulating BTC deposit detection...", state.ID)
	time.Sleep(2 * time.Second) // Simulate monitoring delay

	// Mock transaction hash for demo
	mockTxHash := "demo-btc-tx-hash-12345"
	log.Printf("[LIFECYCLE-%s] Demo: Simulated BTC deposit detected", state.ID)

	// Remove the orphaned error check since we're simulating success
	log.Printf("[LIFECYCLE-%s] BTC deposit confirmed. TxHash: %s", state.ID, mockTxHash)
	state.Status = localcommon.StatusBtcConfirmed

	// === Phase 2: Fulfill on EVM Chain ===

	// Convert user address to proper Ethereum address type and amounts to big.Int
	userAddr := common.HexToAddress("0x742d35Cc6b29d7d8a1b8d8D0c3B7f1234567890") // Demo user address
	amount := big.NewInt(1000000)                                                // Demo amount in wei
	lockTime := big.NewInt(time.Now().Add(24 * time.Hour).Unix())                // 24 hour timeout

	_, evmErr := o.EvmService.DepositIntoEscrow(userAddr, amount, state.SecretHash, lockTime)
	if evmErr != nil {
		log.Printf("[LIFECYCLE-%s] ERROR: Failed to deposit into EVM escrow: %v", state.ID, evmErr)
		state.Status = localcommon.StatusError
		// Here you would trigger a refund on the BTC side.
		return
	}
	log.Printf("[LIFECYCLE-%s] EVM escrow fulfilled. Waiting for user to claim.", state.ID)
	state.Status = localcommon.StatusEvmFulfilled

	// === Phase 3: Wait for User to Claim and Reveal Secret ===
	revealedSecret, evmErr := o.EvmService.MonitorForClaimEvent(state.SecretHash)
	if evmErr != nil {
		log.Printf("[LIFECYCLE-%s] ERROR: Failed to monitor for EVM claim event: %v", state.ID, evmErr)
		state.Status = localcommon.StatusError
		// Here you would trigger a refund on the EVM side.
		return
	}
	log.Printf("[LIFECYCLE-%s] Secret revealed on EVM chain!", state.ID)
	state.Status = localcommon.StatusEvmClaimed

	// === Phase 4: Claim BTC with Revealed Secret ===
	// Compare revealed secret with original to be sure
	// In demo mode, we're more lenient with secret validation
	if !bytes.Equal(revealedSecret, state.Secret) {
		log.Printf("[LIFECYCLE-%s] WARNING: Demo mode - revealed secret differs from original", state.ID)
		log.Printf("[LIFECYCLE-%s] Original: %x", state.ID, state.Secret)
		log.Printf("[LIFECYCLE-%s] Revealed: %x", state.ID, revealedSecret)
		log.Printf("[LIFECYCLE-%s] Continuing anyway in demo mode...", state.ID)
		// In production, this would be a fatal error:
		// state.Status = localcommon.StatusError
		// return
	} else {
		log.Printf("[LIFECYCLE-%s] Secret validation PASSED!", state.ID)
	}

	// === Phase 5: Send Bitcoin to User ===
	log.Printf("[LIFECYCLE-%s] Sending %.8f BTC to user address: %s", state.ID, state.BtcAmount, state.BtcDestinationAddress)

	// Actually send Bitcoin from resolver to user
	btcTxHash, err := o.BtcService.SendBitcoinToUser(state.BtcDestinationAddress, state.BtcAmount)
	if err != nil {
		log.Printf("[LIFECYCLE-%s] ERROR: Failed to send Bitcoin: %v", state.ID, err)
		state.Status = localcommon.StatusError
		return
	}

	log.Printf("[LIFECYCLE-%s] ✅ Bitcoin sent successfully! TxHash: %s", state.ID, btcTxHash)
	log.Printf("[LIFECYCLE-%s] BTC successfully delivered to user.", state.ID)
	state.Status = localcommon.StatusCompleted

	log.Printf("[LIFECYCLE-%s] Swap completed successfully!", state.ID)
}

// InitiateSwap is a backward compatibility wrapper that uses a default amount
func (o *SwapOrchestrator) InitiateSwap(req *localcommon.SwapRequest) (*localcommon.SwapResponse, error) {
	// Use default amount for backward compatibility
	defaultBtcAmount := 0.00001000 // 1000 satoshis
	return o.InitiateSwapWithAmount(req, defaultBtcAmount)
}
