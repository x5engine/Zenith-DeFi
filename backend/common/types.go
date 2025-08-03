/*
================================================================================
File 3: common/types.go - Shared Data Structures
================================================================================

PURPOSE:
This file defines the common Go structs used throughout the resolver backend.
Centralizing these type definitions is a best practice that improves code
readability, maintainability, and type safety. It ensures that data passed
between the API layer, the orchestrator, and various services has a
consistent and predictable structure.

CONTENTS:
- API Request Structs: Defines the expected JSON body for incoming requests
  from the frontend (e.g., `QuoteRequest`, `SwapRequest`). `json` tags are
  used for correct serialization/deserialization.
- API Response Structs: Defines the structure of JSON responses sent back to
  the client (e.g., `QuoteResponse`, `SwapResponse`).
- Internal State Structs: Defines structs used for managing the state of a
  swap as it progresses through the lifecycle (e.g., `SwapState`).

*/

package common

import "time"

// QuoteRequest represents the data required from a client to get a swap quote.
type QuoteRequest struct {
	FromChainID           int64  `json:"fromChainId"`
	FromTokenAddress      string `json:"fromTokenAddress"`
	ToChainID             int64  `json:"toChainId"`
	ToTokenAddress        string `json:"toTokenAddress"`
	Amount                string `json:"amount"`                          // Amount in smallest unit as a string to avoid precision loss
	BtcDestinationAddress string `json:"btcDestinationAddress,omitempty"` // User's Bitcoin address where they want to receive BTC (optional for non-BTC swaps)
}

// QuoteResponse represents the data sent back to a client with quote details.
type QuoteResponse struct {
	ToTokenAmount string `json:"toTokenAmount"` // Estimated amount of token the user will receive
	Fee           string `json:"fee"`           // The resolver's fee for the service
	EstimatedTime int    `json:"estimatedTime"` // Estimated time in seconds for the swap to complete
	QuoteID       string `json:"quoteId"`       // A unique identifier for this quote
}

// SwapRequest represents the data required from a client to initiate a swap.
type SwapRequest struct {
	QuoteID               string `json:"quoteId"`                         // The ID from the corresponding QuoteResponse
	UserBtcRefundPubkey   string `json:"userBtcRefundPubkey"`             // User's BTC public key for the refund path
	UserEvmAddress        string `json:"userEvmAddress"`                  // User's destination address on the EVM chain
	BtcDestinationAddress string `json:"btcDestinationAddress,omitempty"` // User's Bitcoin address where they want to receive BTC (optional for non-BTC swaps)
}

// SwapResponse represents the initial response after a swap has been initiated.
type SwapResponse struct {
	SwapID            string    `json:"swapId"`            // A unique identifier for this swap lifecycle
	BtcDepositAddress string    `json:"btcDepositAddress"` // The P2SH address the user must send BTC to
	ExpiresAt         time.Time `json:"expiresAt"`         // The time when this deposit address will expire
}

// SwapStatusResponse represents the data sent to a client asking for an update.
type SwapStatusResponse struct {
	SwapID  string     `json:"swapId"`
	Status  SwapStatus `json:"status"`
	Message string     `json:"message"` // A human-readable message about the current status
}

// SwapStatus is an enumeration for the possible states of a swap.
type SwapStatus string

const (
	StatusPendingDeposit SwapStatus = "PENDING_DEPOSIT" // Waiting for the user to send BTC
	StatusBtcConfirmed   SwapStatus = "BTC_CONFIRMED"   // BTC deposit confirmed, processing EVM leg
	StatusEvmFulfilled   SwapStatus = "EVM_FULFILLED"   // ETH sent to user, waiting for user to claim
	StatusEvmClaimed     SwapStatus = "EVM_CLAIMED"     // User has claimed ETH, revealing the secret
	StatusBtcWithdrawn   SwapStatus = "BTC_WITHDRAWN"   // Resolver has withdrawn BTC
	StatusCompleted      SwapStatus = "COMPLETED"       // Swap successfully completed
	StatusExpired        SwapStatus = "EXPIRED"         // Swap expired before BTC deposit
	StatusRefunded       SwapStatus = "REFUNDED"        // User's BTC has been refunded after timeout
	StatusError          SwapStatus = "ERROR"           // An unrecoverable error occurred
)
