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
	"sync"
	"time"

	"fusion-btc-resolver/common"
	"fusion-btc-resolver/services"
)

// SwapState holds all the information for a single, ongoing swap.
type SwapState struct {
	ID                string
	Status            common.SwapStatus
	Secret            []byte
	SecretHash        [32]byte
	BtcDepositAddress string
	BtcHtlcScript     []byte
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

// InitiateSwap sets up a new swap and starts its lifecycle management.
func (o *SwapOrchestrator) InitiateSwap(req *common.SwapRequest) (*common.SwapResponse, error) {
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
	state := &SwapState{
		ID:                swapID,
		Status:            common.StatusPendingDeposit,
		Secret:            secret,
		SecretHash:        secretHash,
		BtcDepositAddress: htlcAddress.EncodeAddress(),
		BtcHtlcScript:     htlcScript,
	}
	o.ActiveSwaps[swapID] = state

	log.Printf("[ORCHESTRATOR] New swap initiated. ID: %s, BTC Deposit Address: %s", swapID, htlcAddress.EncodeAddress())

	// 4. Launch the background lifecycle manager for this swap
	go o.runSwapLifecycle(state)

	// 5. Return the deposit details to the user
	return &common.SwapResponse{
		SwapID:            swapID,
		BtcDepositAddress: htlcAddress.EncodeAddress(),
		ExpiresAt:         time.Now().Add(1 * time.Hour), // Example expiration
	}, nil
}

// GetSwapStatus retrieves the current status of a swap.
func (o *SwapOrchestrator) GetSwapStatus(swapID string) (*common.SwapStatusResponse, error) {
	o.mu.Lock()
	defer o.mu.Unlock()

	state, ok := o.ActiveSwaps[swapID]
	if !ok {
		return nil, fmt.Errorf("swap with ID %s not found", swapID)
	}

	return &common.SwapStatusResponse{
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
	state.Status = common.StatusPendingDeposit
	// In a real app, amounts would come from the quote request
	var mockExpectedAmount, mockEvmAmount int64 
	
	fundingTxHash, err := o.BtcService.MonitorForDeposit(nil, 0) // Placeholder args
	if err != nil {
		log.Printf("[LIFECYCLE-%s] ERROR: Failed to detect BTC deposit: %v", state.ID, err)
		state.Status = common.StatusExpired
		return
	}
	log.Printf("[LIFECYCLE-%s] BTC deposit confirmed. TxHash: %s", state.ID, fundingTxHash.String())
	state.Status = common.StatusBtcConfirmed

	// === Phase 2: Fulfill on EVM Chain ===
	var mockUserEvmAddr, mockEscrowAddr string
	
	_, err = o.EvmService.DepositIntoEscrow(nil, nil, state.SecretHash, nil) // Placeholder args
	if err != nil {
		log.Printf("[LIFECYCLE-%s] ERROR: Failed to deposit into EVM escrow: %v", state.ID, err)
		state.Status = common.StatusError
		// Here you would trigger a refund on the BTC side.
		return
	}
	log.Printf("[LIFECYCLE-%s] EVM escrow fulfilled. Waiting for user to claim.", state.ID)
	state.Status = common.StatusEvmFulfilled

	// === Phase 3: Wait for User to Claim and Reveal Secret ===
	revealedSecret, err := o.EvmService.MonitorForClaimEvent(nil) // Placeholder arg
	if err != nil {
		log.Printf("[LIFECYCLE-%s] ERROR: Failed to monitor for EVM claim event: %v", state.ID, err)
		state.Status = common.StatusError
		// Here you would trigger a refund on the EVM side.
		return
	}
	log.Printf("[LIFECYCLE-%s] Secret revealed on EVM chain!", state.ID)
	state.Status = common.StatusEvmClaimed

	// === Phase 4: Claim BTC with Revealed Secret ===
	// Compare revealed secret with original to be sure
	if !bytes.Equal(revealedSecret, state.Secret) {
		log.Printf("[LIFECYCLE-%s] FATAL ERROR: Revealed secret does not match original secret!", state.ID)
		state.Status = common.StatusError
		return
	}

	var mockResolverBtcKey, mockResolverBtcAddr string

	_, err = o.BtcService.RedeemHtlc(fundingTxHash, state.BtcHtlcScript, nil, nil, revealedSecret, 0) // Placeholder args
	if err != nil {
		log.Printf("[LIFECYCLE-%s] ERROR: Failed to redeem BTC HTLC with secret: %v", state.ID, err)
		state.Status = common.StatusError
		return
	}
	log.Printf("[LIFECYCLE-%s] BTC successfully claimed by resolver.", state.ID)
	state.Status = common.StatusCompleted

	log.Printf("[LIFECYCLE-%s] Swap completed successfully!", state.ID)
}
