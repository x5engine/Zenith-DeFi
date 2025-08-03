/*
================================================================================
File 7: api/handlers.go - HTTP API Request Handlers
================================================================================

PURPOSE:
This file contains the HTTP handler functions that expose the resolver's
functionality via a RESTful API. These handlers are responsible for:
1. Parsing and validating incoming JSON requests from clients.
2. Calling the appropriate methods on the swap orchestrator to execute the
   requested business logic (e.g., get a quote, initiate a swap).
3. Serializing the results from the orchestrator back into JSON responses.
4. Handling HTTP status codes and error responses gracefully.

ARCHITECTURE NOTE:
This layer is kept "thin," meaning it contains minimal business logic. Its main
job is to handle the HTTP transport layer and act as a clean interface to the
orchestrator, which contains the actual business logic. This separation makes
the application easier to test and maintain.

*/

package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"fusion-btc-resolver/common"
	"fusion-btc-resolver/orchestrator"
)

// Handlers holds dependencies for the API handlers, primarily the orchestrator.
type Handlers struct {
	Orchestrator *orchestrator.SwapOrchestrator
	quotes       map[string]*common.QuoteResponse // Store quotes by ID
}

// NewHandlers creates a new Handlers struct with its dependencies.
func NewHandlers(o *orchestrator.SwapOrchestrator) *Handlers {
	return &Handlers{
		Orchestrator: o,
		quotes:       make(map[string]*common.QuoteResponse),
	}
}

// InitiateSwap is the HTTP handler for starting a new swap.
// POST /swap/initiate
func (h *Handlers) InitiateSwap(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req common.SwapRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		WriteError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Look up the quote to get the actual BTC amount
	quote, exists := h.quotes[req.QuoteID]
	if !exists {
		log.Printf("ERROR: Quote not found: %s", req.QuoteID)
		WriteError(w, http.StatusBadRequest, "Invalid or expired quote ID")
		return
	}

	// Convert satoshis back to BTC for the orchestrator
	satoshis, err := strconv.ParseInt(quote.ToTokenAmount, 10, 64)
	if err != nil {
		log.Printf("ERROR: Failed to parse BTC amount: %v", err)
		WriteError(w, http.StatusInternalServerError, "Invalid quote amount")
		return
	}
	btcAmount := float64(satoshis) / 1e8 // Convert satoshis to BTC

	log.Printf("[INITIATE] Using quote %s: %.8f BTC for swap", req.QuoteID, btcAmount)

	// Call the orchestrator to start the swap process
	resp, err := h.Orchestrator.InitiateSwapWithAmount(&req, btcAmount)
	if err != nil {
		log.Printf("ERROR: Failed to initiate swap: %v", err)
		WriteError(w, http.StatusInternalServerError, "Failed to initiate swap")
		return
	}

	WriteJSON(w, http.StatusOK, resp)
}

// GetSwapStatus is the HTTP handler for checking the status of a swap.
// GET /swap/status/{swapID}
func (h *Handlers) GetSwapStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Extract swapID from URL path, e.g., /swap/status/swap-1234abcd
	swapID := strings.TrimPrefix(r.URL.Path, "/swap/status/")
	if swapID == "" {
		WriteError(w, http.StatusBadRequest, "Swap ID is required")
		return
	}

	resp, err := h.Orchestrator.GetSwapStatus(swapID)
	if err != nil {
		WriteError(w, http.StatusNotFound, "Swap not found")
		return
	}

	WriteJSON(w, http.StatusOK, resp)
}

// GetQuote is the HTTP handler for getting a swap quote.
// POST /quote
func (h *Handlers) GetQuote(w http.ResponseWriter, r *http.Request) {
	// Note: Quoting is a complex process involving calls to the 1inch API
	// and potentially other market data sources. For this hackathon, we are
	// focusing on the swap execution lifecycle. This handler serves as a
	// placeholder for that future functionality.

	if r.Method != http.MethodPost {
		WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req common.QuoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		WriteError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Log the received quote request including BTC destination address
	log.Printf("[QUOTE] Request: %+v", req)
	if req.BtcDestinationAddress != "" {
		log.Printf("[QUOTE] BTC Destination Address: %s", req.BtcDestinationAddress)
	}

	// Calculate proper BTC amount based on ETH input
	// Convert from wei to ETH, then ETH to BTC (demo rate: 1 ETH = 0.375 BTC)
	amountEthWei := req.Amount                 // Amount in wei
	amountEth := parseWeiToFloat(amountEthWei) // Convert to ETH
	btcPerEth := 0.375                         // Demo exchange rate
	amountBtc := amountEth * btcPerEth         // Calculate BTC amount
	amountSatoshis := int64(amountBtc * 1e8)   // Convert to satoshis

	log.Printf("[QUOTE] Converting %.8f ETH to %.8f BTC (%d satoshis)", amountEth, amountBtc, amountSatoshis)

	// Return proper BTC amount in satoshis as string
	resp := &common.QuoteResponse{
		ToTokenAmount: fmt.Sprintf("%d", amountSatoshis), // BTC amount in satoshis
		Fee:           "50000000000000000",               // 0.05 ETH fee
		EstimatedTime: 300,                               // 5 minutes
		QuoteID:       fmt.Sprintf("quote-%d", time.Now().Unix()),
	}

	// Store the quote for later use during swap initiation
	h.quotes[resp.QuoteID] = resp
	log.Printf("[QUOTE] Stored quote %s: %.8f BTC", resp.QuoteID, amountBtc)

	WriteJSON(w, http.StatusOK, resp)
}

// WriteJSON is a helper function for sending JSON responses.
func WriteJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		// If encoding fails, log it but don't try to write another header
		log.Printf("ERROR: Failed to write JSON response: %v", err)
	}
}

// WriteError is a helper function for sending JSON error responses.
func WriteError(w http.ResponseWriter, status int, message string) {
	errorResponse := map[string]string{"error": message}
	WriteJSON(w, status, errorResponse)
}

// parseWeiToFloat converts a wei amount string to ETH float64
func parseWeiToFloat(weiStr string) float64 {
	wei, err := strconv.ParseFloat(weiStr, 64)
	if err != nil {
		log.Printf("ERROR: Failed to parse wei amount: %v", err)
		return 0
	}
	// Convert wei to ETH (1 ETH = 1e18 wei)
	return wei / 1e18
}
