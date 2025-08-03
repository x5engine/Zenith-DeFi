/*
================================================================================
File 1: main.go - Resolver Backend Service Entry Point
================================================================================

PURPOSE:
This file serves as the main entry point for the 1inch Fusion+ BTC Resolver
backend. Its primary responsibilities are:
1. Initializing the application's configuration.
2. Setting up dependencies and services (like the orchestrator and blockchain clients).
3. Starting an HTTP server to listen for API requests from a frontend client.
4. Defining the API routes (e.g., /quote, /initiate-swap) and attaching them
   to their respective handler functions.

ARCHITECTURE NOTE:
This `main.go` file is intentionally kept lightweight. The complex business logic
is delegated to other packages (`config`, `api`, `services`, `orchestrator`)
to maintain a clean, modular, and testable codebase, which is a hallmark of
a production-grade application.

*/

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"fusion-btc-resolver/api"
	"fusion-btc-resolver/config"
	"fusion-btc-resolver/orchestrator"
	"fusion-btc-resolver/services"
)

func main() {
	log.Println("--- [RESOLVER_BACKEND] Starting 1inch Fusion+ BTC Resolver Service ---")

	// =========================================================================
	// STEP 1: LOAD CONFIGURATION (To be implemented in config/config.go)
	// =========================================================================
	// In the next step, we will create a config package to load all necessary
	// parameters (API keys, RPC URLs, private keys) securely from a .env file.
	// For now, we'll assume a placeholder config object.
	log.Println("[INIT] Loading application configuration...")
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("FATAL: Could not load configuration: %v", err)
	}
	log.Println("[INIT] Configuration loaded successfully.")

	// =========================================================================
	// STEP 2: INITIALIZE SERVICES (To be implemented in services/*.go)
	// =========================================================================
	// Here we will initialize the clients that communicate with the blockchains.
	// The btc_htlc_service will connect to our Bitcoin Core node, and the
	// evm_service will connect to an EVM-compatible RPC endpoint.
	log.Println("[INIT] Initializing blockchain services...")
	btcService, err := services.NewBtcHtlcService(&cfg.Bitcoin)
	if err != nil {
		log.Fatalf("FATAL: Could not initialize Bitcoin HTLC Service: %v", err)
	}
	evmService, err := services.NewEvmService(&cfg.EVM)
	if err != nil {
		log.Fatalf("FATAL: Could not initialize EVM Service: %v", err)
	}
	log.Println("[INIT] Blockchain services initialized.")

	// =========================================================================
	// STEP 3: INITIALIZE SWAP ORCHESTRATOR (To be implemented in orchestrator/swap_orchestrator.go)
	// =========================================================================
	// The orchestrator is the core of our application. It contains the business
	// logic to manage the swap lifecycle, coordinating between the BTC and EVM services.
	log.Println("[INIT] Initializing swap orchestrator...")
	swapOrchestrator := orchestrator.NewSwapOrchestrator(btcService, evmService)
	log.Println("[INIT] Swap orchestrator initialized.")

	// =========================================================================
	// STEP 4: INITIALIZE API HANDLERS (To be implemented in api/handlers.go)
	// =========================================================================
	// The API handlers are the functions that will process incoming HTTP requests.
	// They will parse requests, call the appropriate methods on the orchestrator,
	// and write the HTTP responses.
	log.Println("[INIT] Initializing API handlers...")
	apiHandlers := api.NewHandlers(swapOrchestrator)
	log.Println("[INIT] API handlers initialized.")

	// =========================================================================
	// STEP 5: SETUP AND START HTTP SERVER
	// =========================================================================
	// We define our API routes and link them to the handler functions.
	// A real-world application would also include middleware for logging,
	// authentication, rate limiting, and CORS.

	// Real API handlers using the orchestrator

	// CORS middleware
	corsHandler := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}

	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	// API endpoints using real handlers
	mux.HandleFunc("/quote", apiHandlers.GetQuote)
	mux.HandleFunc("/swap/initiate", apiHandlers.InitiateSwap)
	mux.HandleFunc("/swap/status/", apiHandlers.GetSwapStatus)

	server := &http.Server{
		Addr:         ":8080", // Standard port for backend services
		Handler:      corsHandler(mux),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println("--- [RESOLVER_BACKEND] Server starting on http://localhost:8080 ---")
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("FATAL: Could not start server: %v", err)
	}
}
