```
# Technical Changes for Live Testnet Demonstration

## 1. Objective

This document outlines the specific code and configuration modifications required to transition the resolver application from a self-contained `regtest` environment to a live demonstration using the public **Bitcoin `testnet`** and the **Polygon `Mumbai` testnet**.

---

## 2. Backend Changes

The backend must be reconfigured to communicate with the public test networks instead of its local `regtest` instance.

### 2.1. Configuration (`backend/.env`)

The `.env` file in the backend directory must be updated to point to the correct testnet RPC endpoints and credentials.

```diff
# --- Bitcoin Core RPC Configuration ---
# No changes needed here if bitcoind is running on the same machine,
# but ensure these credentials match your testnet bitcoin.conf
BTC_RPC_USER=yourrpcuser
BTC_RPC_PASS=yourrpcpassword
- BTC_RPC_HOST=localhost:18443
+ BTC_RPC_HOST=localhost:18332 # Default RPC port for Bitcoin testnet

# --- EVM Chain Configuration ---
- EVM_RPC_URL=http://localhost:8545 # Example local node
+ EVM_RPC_URL=[https://rpc-mumbai.maticvigil.com](https://rpc-mumbai.maticvigil.com) # Or your Alchemy/Infura Mumbai URL
# The private key for the wallet you have funded with Mumbai MATIC/USDC
EVM_PRIVATE_KEY=0xYourFundedMumbaiWalletPrivateKey
- EVM_CHAIN_ID=1337 # Example local chain ID
+ EVM_CHAIN_ID=80001 # Chain ID for Polygon Mumbai

```

### 2.2. Code Adjustments (`backend/services/btc_htlc_service.go`)

The `btcd` library uses network-specific parameters for address generation and other cryptographic functions. We must switch from `RegressionNetParams` to `TestNet3Params`.

```
// In backend/services/btc_htlc_service.go

// ... imports

// NewBtcHtlcService creates a new instance of the Bitcoin HTLC service.
func NewBtcHtlcService(cfg *config.BtcConfig) (*BtcHtlcService, error) {
    // Switch from regtest to testnet parameters. This is a critical change.
-   netParams := &chaincfg.RegressionNetParams
+   netParams := &chaincfg.TestNet3Params

    connCfg := &rpcclient.ConnConfig{
        // ... rest of the function remains the same
    }
    // ...
}

```

3\. Frontend Changes
--------------------

The frontend's primary responsibility is to ensure the user is connected to the correct L2 network and to provide links to public block explorers for transaction verification.

### 3.1. Wallet Interaction (`src/services/WalletService.js` or `src/stores/ExchangeStore.js`)

The application must ensure the user's MetaMask is on the correct network (Polygon Mumbai) before allowing them to proceed with a swap.

**Implementation:** When the user clicks "Confirm Swap" (or a similar action), the application must perform a network check.

```
// In your ExchangeStore or wherever you handle the swap initiation logic

const TARGET_CHAIN_ID = '0x13881'; // Hex for Polygon Mumbai (80001)
const TARGET_CHAIN_NAME = 'Polygon Mumbai Testnet';

async function ensureCorrectNetwork() {
    if (!window.ethereum) throw new Error("No crypto wallet found");

    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

    if (currentChainId === TARGET_CHAIN_ID) {
        console.log("Correct network connected.");
        return true;
    }

    // If not on the correct network, prompt the user to switch.
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: TARGET_CHAIN_ID }],
        });
        return true;
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: TARGET_CHAIN_ID,
                            chainName: TARGET_CHAIN_NAME,
                            rpcUrls: ['[https://rpc-mumbai.maticvigil.com/](https://rpc-mumbai.maticvigil.com/)'],
                            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                            blockExplorerUrls: ['[https://mumbai.polygonscan.com/](https://mumbai.polygonscan.com/)'],
                        },
                    ],
                });
                return true;
            } catch (addError) {
                console.error("Failed to add network:", addError);
                return false;
            }
        }
        console.error("Failed to switch network:", switchError);
        return false;
    }
}

// Before initiating the swap:
// const isNetworkCorrect = await ensureCorrectNetwork();
// if (!isNetworkCorrect) {
//     uiService.showError("Please switch to the Polygon Mumbai network in your wallet.");
//     return;
// }
// ... proceed with swap

```

### 3.2. UI Adjustments (React Components)

To make the demo verifiable for judges, the UI must display transaction hashes as clickable links to public block explorers.

**Implementation:** When the `ExchangeStore` receives a transaction hash from the backend (for either the EVM deposit or the final BTC claim), it should store it. A React component can then render it as a link.

**Example in a Status Component:**

```
// Conceptual component
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';

const StatusLinks = observer(() => {
    const { exchangeStore } = useStores();
    const { evmTxHash, btcTxHash } = exchangeStore; // Assume these are observables in the store

    const btcExplorerUrl = `https://mempool.space/testnet/tx/${btcTxHash}`;
    const evmExplorerUrl = `https://mumbai.polygonscan.com/tx/${evmTxHash}`;

    return (
        <div className="transaction-links">
            {evmTxHash && (
                <a href={evmExplorerUrl} target="_blank" rel="noopener noreferrer">
                    View EVM Transaction on Polygonscan
                </a>
            )}
            {btcTxHash && (
                <a href={btcExplorerUrl} target="_blank" rel="noopener noreferrer">
                    View Bitcoin Transaction on Mempool
                </a>
            )}
        </div>
    );
});

export default StatusLinks;

```