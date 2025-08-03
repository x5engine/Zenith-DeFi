AI Task: Review and Refactor `evm_service.go`
=============================================

Your task is to review and refactor the provided Go code (`evm_service.go`). The current implementation contains placeholder logic for interacting with the EVM blockchain. You must replace this placeholder code with a functional implementation that correctly interacts with the **1inch Fusion+ cross-chain escrow smart contracts**.

The goal is to make the service capable of depositing funds into the 1inch escrow and monitoring it for the secret-revealing event.

Current Code (Placeholder Implementation)
-----------------------------------------

```
/*
================================================================================
File 5: services/evm_service.go - EVM Chain Interaction Service
================================================================================
*/

package services

import (
    "context"
    "crypto/ecdsa"
    "fmt"
    "log"
    "math/big"

    "github.com/ethereum/go-ethereum/accounts/abi/bind"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/core/types"
    "github.com/ethereum/go-ethereum/crypto"
    "github.com/ethereum/go-ethereum/ethclient"

    "fusion-btc-resolver/config" // Assuming this path for our config package
)

// EvmService manages all EVM chain operations.
type EvmService struct {
    cfg        *config.EvmConfig
    client     *ethclient.Client
    privateKey *ecdsa.PrivateKey
    walletAddr common.Address
}

// NewEvmService creates a new instance of the EVM service.
func NewEvmService(cfg *config.EvmConfig) (*EvmService, error) {
    client, err := ethclient.Dial(cfg.RPCURL)
    if err != nil {
        return nil, fmt.Errorf("failed to connect to EVM RPC client: %v", err)
    }

    privateKey, err := crypto.HexToECDSA(cfg.PrivateKey)
    if err != nil {
        return nil, fmt.Errorf("failed to load EVM private key: %v", err)
    }

    publicKey := privateKey.Public()
    publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
    if !ok {
        return nil, fmt.Errorf("error casting public key to ECDSA")
    }
    walletAddr := crypto.PubkeyToAddress(*publicKeyECDSA)

    return &EvmService{
        cfg:        cfg,
        client:     client,
        privateKey: privateKey,
        walletAddr: walletAddr,
    }, nil
}

// DepositIntoEscrow deposits funds into the 1inch Fusion+ escrow contract.
// NOTE: This is a placeholder function. A real implementation requires the ABI
// of the 1inch escrow contract and would use a generated Go binding to call
// the specific 'deposit' function.
func (s *EvmService) DepositIntoEscrow(userAddress common.Address, amount *big.Int, secretHash [32]byte, lockTime *big.Int) (*types.Transaction, error) {
    log.Printf("[EVM_SERVICE] Preparing to deposit %d wei for user %s", amount, userAddress.Hex())

    // 1. Get nonce and gas price
    nonce, err := s.client.PendingNonceAt(context.Background(), s.walletAddr)
    if err != nil {
        return nil, fmt.Errorf("failed to get nonce: %v", err)
    }

    gasPrice, err := s.client.SuggestGasPrice(context.Background())
    if err != nil {
        return nil, fmt.Errorf("failed to suggest gas price: %v", err)
    }

    // 2. Create the transaction object
    // This would be a contract interaction, not a simple value transfer.
    // We are creating a simple transfer here as a placeholder.
    toAddress := userAddress // Placeholder: should be the 1inch escrow contract address
    tx := types.NewTransaction(nonce, toAddress, amount, 21000, gasPrice, nil) // 21000 gas limit for simple transfer

    // 3. Sign the transaction
    chainID := big.NewInt(s.cfg.ChainID)
    signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), s.privateKey)
    if err != nil {
        return nil, fmt.Errorf("failed to sign EVM transaction: %v", err)
    }

    // 4. Broadcast the transaction
    err = s.client.SendTransaction(context.Background(), signedTx)
    if err != nil {
        return nil, fmt.Errorf("failed to broadcast EVM transaction: %v", err)
    }

    log.Printf("[EVM_SERVICE] Successfully broadcasted deposit transaction: %s", signedTx.Hash().Hex())
    return signedTx, nil
}

// MonitorForClaimEvent watches the escrow contract for a claim event.
// A real implementation would parse contract logs to find the event that
// reveals the secret. This is a placeholder.
func (s *EvmService) MonitorForClaimEvent(escrowAddress common.Address) ([]byte, error) {
    log.Printf("[EVM_SERVICE] Monitoring for claim event on contract %s", escrowAddress.Hex())

    // This is a complex task involving log subscription and parsing.
    // For a hackathon, this might be a manual step or a simplified poller.
    // We will simulate finding the secret.

    // Placeholder: Simulate that after some time, we find the secret.
    // time.Sleep(30 * time.Second)

    secret := []byte("secret-revealed-on-evm-chain")
    log.Printf("[EVM_SERVICE] Secret revealed: %s", string(secret))

    return secret, nil
}

// createAuth creates a new transactor with the loaded private key.
// This is a helper for interacting with generated contract bindings.
func (s *EvmService) createAuth() (*bind.TransactOpts, error) {
    nonce, err := s.client.PendingNonceAt(context.Background(), s.walletAddr)
    if err != nil {
        return nil, err
    }

    gasPrice, err := s.client.SuggestGasPrice(context.Background())
    if err != nil {
        return nil, err
    }

    chainID := big.NewInt(s.cfg.ChainID)
    auth, err := bind.NewKeyedTransactorWithChainID(s.privateKey, chainID)
    if err != nil {
        return nil, err
    }

    auth.Nonce = big.NewInt(int64(nonce))
    auth.Value = big.NewInt(0)      // in wei
    auth.GasLimit = uint64(300000) // in units
    auth.GasPrice = gasPrice

    return auth, nil
}

```

Refactoring Instructions
------------------------

### Step 1: Obtain 1inch Escrow Contract ABI

You must first find the ABI for the 1inch cross-chain `EscrowFactory` contract. This contract is responsible for deploying individual escrow contracts for each swap.

-   **Action:** Search for the 1inch Fusion+ (or cross-chain) contract source code or ABI. A good place to look is the 1inch GitHub repository or on a block explorer like Etherscan for a deployed version on an EVM testnet (e.g., Sepolia).

-   **Deliverable:** Save the contract ABI as a JSON file (e.g., `EscrowFactory.json`).

### Step 2: Generate Go Bindings with `abigen`

Use the `go-ethereum`  `abigen` tool to generate a Go package from the ABI file you obtained in Step 1.

-   **Action:** Run the `abigen` command. Place the output file in a new sub-directory, for example, `./contracts/escrow/`.

-   **Example Command:**

    ```
    abigen --abi=./path/to/EscrowFactory.json --pkg=escrow --out=./contracts/escrow/escrow.go

    ```

### Step 3: Refactor `DepositIntoEscrow` Function

Rewrite this function to use the newly generated Go bindings to interact with the real 1inch contract.

-   **Action:**

    1.  Load an instance of the `EscrowFactory` contract using the generated `NewEscrowFactory` function. You will need the contract's address on the target testnet (e.g., Sepolia).

    2.  Use the `createAuth()` helper function to create a valid `bind.TransactOpts` object for signing.

    3.  Call the appropriate function on the contract instance to create the escrow on the destination chain (e.g., `createDstEscrow`). You must pass the correct arguments as defined by the smart contract, which will include the user's address, the token amount, the secret hash, and the lock time.

    4.  The placeholder logic that sends a simple ETH transfer (`types.NewTransaction(...)`) must be completely removed and replaced by this contract call.

    5.  Return the resulting transaction object and any errors.

### Step 4: Refactor `MonitorForClaimEvent` Function

Rewrite this function to actively monitor the blockchain for the event that reveals the secret.

-   **Action:**

    1.  The function should take the address of the *specific escrow contract* for the swap as an argument (not the factory address).

    2.  Use the `go-ethereum` library to filter or subscribe to logs from that contract address. The `ethclient.SubscribeFilterLogs` (for websockets) or `ethclient.FilterLogs` (for polling via HTTP) methods are appropriate.

    3.  You will need to parse the ABI to identify the signature of the secret-revealing event (e.g., `SecretRevealed(bytes32 secret)`).

    4.  Set up a loop to listen for new events. When a matching event is found, unpack the event data using the contract ABI to extract the `secret`.

    5.  Remove the placeholder `time.Sleep` and the hardcoded secret.

    6.  Return the real secret extracted from the event log.