# Frontend Technical Specification: 1inch Fusion+ Resolver dApp

This document provides a detailed, technical blueprint for building a professional-grade frontend dApp to interact with the 1inch Fusion+ Native Bitcoin Resolver backend. The architecture is designed using Object-Oriented Principles (OOP) for clarity, maintainability, and scalability.

---

## 1. Core Architectural Principles

The frontend will be a Single-Page Application (SPA) built with a clear separation of concerns. All logic will be encapsulated into distinct classes, each with a single responsibility. This avoids monolithic code and allows for easier testing and debugging.

* **`ApiService.js`**: Handles all network communication with our resolver backend proxy.
* **`WalletService.js`**: Manages all direct interactions with the user's Web3 wallet (e.g., MetaMask), including connection, signature requests, and network changes.
* **`SwapService.js`**: The core orchestrator of the frontend. It manages the state of a swap and coordinates between the `ApiService` and `WalletService`.
* **`UIService.js`**: Responsible for all DOM manipulation. It renders data provided by the other services and listens for user input events.

This architecture ensures that blockchain logic, API communication, and UI rendering are completely decoupled.

---

## 2. Class-Based Implementation Details

### a. `ApiService` Class
This class is the sole point of contact with the backend. It abstracts away `fetch` calls and JSON parsing.

* **`constructor(baseUrl)`**: Initializes with the base URL of the resolver backend (e.g., `http://localhost:8080`).
* **`async getQuote(quoteRequest)`**:
    * **Input:** A `quoteRequest` object (`{ fromChainId, fromTokenAddress, toChainId, toTokenAddress, amount }`).
    * **Action:** Sends a `POST` request to the `/quote` endpoint of the backend proxy.
    * **Output:** Returns a `Promise` that resolves to the JSON response from the server (the `QuoteResponse` object).
* **`async initiateSwap(swapRequest)`**:
    * **Input:** A `swapRequest` object (`{ quoteId, userBtcRefundPubkey, userEvmAddress }`).
    * **Action:** Sends a `POST` request to the `/swap/initiate` endpoint.
    * **Output:** Returns a `Promise` that resolves to the `SwapResponse` object, containing the `swapId` and the `btcDepositAddress`.
* **`async getSwapStatus(swapId)`**:
    * **Input:** A `swapId` string.
    * **Action:** Sends a `GET` request to `/swap/status/{swapId}`.
    * **Output:** Returns a `Promise` that resolves to the `SwapStatusResponse` object.

### b. `WalletService` Class
This class encapsulates all `ethers.js` or `web3.js` logic, abstracting wallet interactions away from the rest of the application.

* **`constructor()`**: Initializes the Web3 provider (e.g., `new ethers.providers.Web3Provider(window.ethereum)`).
* **`async connectWallet()`**:
    * **Action:** Requests wallet connection via `eth_requestAccounts`.
    * **Output:** Returns the connected user's EVM address. Stores the `signer` object internally for later use.
* **`async getChainId()`**:
    * **Action:** Retrieves the current network's chain ID from the provider.
    * **Output:** Returns the chain ID as a number.
* **`async signOffChainOrder(order)`**:
    * **Action:** This is a placeholder for the actual 1inch SDK interaction for an EVM-to-EVM swap. For our BTC-to-EVM flow, the primary "signature" is the user performing the on-chain BTC transaction. However, for generating the `userBtcRefundPubkey`, this service would need to derive a public key from the user's connected wallet or ask for a specific signature to generate it.
* **`getConnectedAddress()`**:
    * **Action:** Returns the currently connected wallet address.

### c. `SwapService` Class
The central state machine for the frontend. It orchestrates the entire user flow.

* **`constructor(apiService, walletService, uiService)`**: Injects its dependencies.
* **`state`**: An internal object to hold the current state of the swap (`{ quote, swapId, status, btcDepositAddress, etc. }`).
* **`async handleNewSwap(swapParams)`**:
    1.  Calls `apiService.getQuote(swapParams)` to fetch a quote.
    2.  Stores the quote in its internal state.
    3.  Calls `uiService.displayQuote(quote)` to show the user the terms.
    4.  Waits for user confirmation (via a `uiService` event).
    5.  Upon confirmation, constructs the `swapRequest` object. This includes getting the `userEvmAddress` from `walletService.getConnectedAddress()`. The `userBtcRefundPubkey` would need to be requested from the user or derived.
    6.  Calls `apiService.initiateSwap(swapRequest)`.
    7.  On success, receives the `swapId` and `btcDepositAddress`. Stores them in the state.
    8.  Calls `uiService.displayBtcDepositInstructions(btcDepositAddress, amount)`.
    9.  Initiates status polling by calling `this.startStatusPolling(swapId)`.
* **`async startStatusPolling(swapId)`**:
    * **Action:** Sets up a `setInterval` to call `apiService.getSwapStatus(swapId)` every 10-15 seconds.
    * On each response, it updates its internal state and calls `uiService.updateSwapStatus(statusResponse)`.
    * If the status is `COMPLETED`, `REFUNDED`, or `ERROR`, it clears the interval.

### d. `UIService` Class
Manages all direct interaction with the HTML document. It should not contain any business logic.

* **`constructor()`**: Caches references to all necessary DOM elements (buttons, input fields, display areas).
* **`displayQuote(quote)`**: Renders the fetched quote details into the UI.
* **`displayBtcDepositInstructions(address, amount)`**: Shows a clear call-to-action for the user to send their BTC, including the P2SH address and a QR code.
* **`updateSwapStatus(statusResponse)`**: Updates a status text/timeline element in the UI to reflect the current stage of the swap (e.g., "Waiting for BTC deposit...", "BTC Confirmed. Fulfilling on Arbitrum...").
* **`bindEventListeners(swapService)`**: Sets up all event listeners (e.g., on the "Swap" button) and links them to the `swapService` methods.

---

## 3. End-to-End Technical Flow

This flow details the interaction between the classes to execute a swap, inspired by the provided UI screenshot.

1.  **Initialization:**
    * `main.js` instantiates all four classes, injecting dependencies as needed.
    * `uiService.bindEventListeners(swapService)` is called.

2.  **User Connects Wallet:**
    * User clicks "Connect Wallet".
    * `uiService` calls `walletService.connectWallet()`.
    * The connected address and token balances (fetched via another `WalletService` method) are displayed in the "TOKENLIST" panel.

3.  **User Defines Swap:**
    * User selects a "From" token (e.g., BTC) and a "To" token (e.g., ETH on Arbitrum) from the token list.
    * User enters an amount in the main panel.
    * `uiService` captures these inputs.

4.  **Initiate Swap Process:**
    * User clicks the "Get Quote" or "Swap" button.
    * The `uiService` event handler calls `swapService.handleNewSwap(params)`.
    * **`SwapService`** takes over, fetching the quote from the **`ApiService`** and displaying it via the **`UIService`**.

5.  **User Confirmation & BTC Deposit:**
    * The UI now shows the `btcDepositAddress`.
    * The user leaves the dApp and goes to their native Bitcoin wallet to send the funds.
    * Meanwhile, **`SwapService`** has started polling the `/swap/status/{swapId}` endpoint via the **`ApiService`**.

6.  **Monitoring and Completion:**
    * The `setInterval` in **`SwapService`** continues to fetch status updates.
    * **`UIService`** receives new statuses and updates the UI in real-time, moving a progress indicator through stages like: `PENDING_DEPOSIT` -> `BTC_CONFIRMED` -> `EVM_FULFILLED` -> `COMPLETED`.
    * The line charts in the UI (as seen in the screenshot) can be dynamically updated to reflect the progress or value changes during the swap.

---

## 4. Example Implementation (`runSwap.js` Frontend Logic)

This script demonstrates how the classes would be instantiated and used in a main application file.

```javascript
// main.js

// Assume these classes are imported from their respective files.
// import { ApiService } from './ApiService.js';
// import { WalletService } from './WalletService.js';
// import { SwapService } from './SwapService.js';
// import { UIService } from './UIService.js';

class MainApp {
    constructor() {
        // 1. Instantiate all services
        const apiService = new ApiService('http://localhost:8080');
        const walletService = new WalletService();
        const uiService = new UIService();
        
        // The SwapService is the central orchestrator
        this.swapService = new SwapService(apiService, walletService, uiService);

        // 2. Link UI events to the orchestrator
        uiService.bindEventListeners(this.swapService);
        
        console.log("Frontend dApp Initialized.");
    }

    // Example of how a swap would be triggered by a UI event
    initiateExampleSwap() {
        // These params would be gathered from the UI input fields
        const swapParams = {
            fromChainId: 0, // Special identifier for Bitcoin
            fromTokenAddress: 'BTC',
            toChainId: 42161, // Arbitrum
            toTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH
            amount: '10000000' // 0.1 BTC in satoshis
        };
        
        // The UI event listener would call this method on the swapService
        this.swapService.handleNewSwap(swapParams)
            .catch(err => {
                console.error("Swap failed:", err);
                // uiService would display an error message to the user
            });
    }
}

// Entry point for the application
window.onload = () => {
    const app = new MainApp();
    // In a real app, you wouldn't call this directly, but wait for user interaction.
    // app.initiateExampleSwap(); 
};
