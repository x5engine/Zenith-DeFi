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
	"log"
	"net/http"
	"strings"

	"fusion-btc-resolver/common"
	"fusion-btc-resolver/orchestrator"
)

// Handlers holds dependencies for the API handlers, primarily the orchestrator.
type Handlers struct {
	Orchestrator *orchestrator.SwapOrchestrator
}

// NewHandlers creates a new Handlers struct with its dependencies.
func NewHandlers(o *orchestrator.SwapOrchestrator) *Handlers {
	return &Handlers{
		Orchestrator: o,
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

	// Call the orchestrator to start the swap process
	resp, err := h.Orchestrator.InitiateSwap(&req)
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
	
	// Placeholder response
	resp := &common.QuoteResponse{
		ToTokenAmount: "1500000000000000000", // 1.5 ETH
		Fee:           "50000000000000000",   // 0.05 ETH
		EstimatedTime: 300,                   // 5 minutes
		QuoteID:       "quote-placeholder-123",
	}

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
