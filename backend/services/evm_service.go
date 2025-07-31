/*
================================================================================
File 5: services/evm_service.go - EVM Chain Interaction Service
================================================================================

PURPOSE:
This file provides the service layer for all interactions with EVM-compatible
blockchains. It is responsible for connecting to an EVM RPC endpoint, managing
the resolver's wallet (hot wallet), and executing transactions on the
destination chain, such as depositing funds into the 1inch escrow contract.

LIBRARIES USED:
- "github.com/ethereum/go-ethereum": The official Go implementation of the
  Ethereum protocol, providing all the necessary tools for creating wallets,
  connecting to nodes, and interacting with smart contracts.

KEY RESPONSIBILITIES:
- Establishing a connection to an EVM JSON-RPC endpoint.
- Loading the resolver's private key for signing transactions.
- Crafting and broadcasting transactions to deposit tokens into the 1inch
  Fusion+ escrow contract.
- Monitoring the EVM chain for events, specifically the event that indicates
  the user has claimed their funds and revealed the secret.
- Handling the EVM-side refund logic if the swap times out.

ARCHITECTURE NOTE:
This service abstracts away the complexities of the go-ethereum library. The
orchestrator will call high-level methods like `DepositIntoEscrow` without
needing to know the details of transaction signing or gas estimation. For a
hackathon, the contract interaction logic will be simplified, but the structure
is in place to build upon.

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
	auth.Value = big.NewInt(0)     // in wei
	auth.GasLimit = uint64(300000) // in units
	auth.GasPrice = gasPrice

	return auth, nil
}
