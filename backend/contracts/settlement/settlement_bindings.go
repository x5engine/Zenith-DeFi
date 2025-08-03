// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package settlement

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// FusionBtcSettlementEscrow is an auto generated low-level Go binding around an user-defined struct.
type FusionBtcSettlementEscrow struct {
	User     common.Address
	Resolver common.Address
	Token    common.Address
	Amount   *big.Int
	Timelock *big.Int
	Claimed  bool
	Refunded bool
}

// FusionBtcSettlementMetaData contains all meta data concerning the FusionBtcSettlement contract.
var FusionBtcSettlementMetaData = &bind.MetaData{
	ABI: "[{\"type\":\"constructor\",\"inputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"whitelistResolver\",\"inputs\":[{\"name\":\"resolver\",\"type\":\"address\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"createEscrow\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\"},{\"name\":\"user\",\"type\":\"address\"},{\"name\":\"token\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"},{\"name\":\"timelock\",\"type\":\"uint256\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"claimEscrow\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\"},{\"name\":\"secret\",\"type\":\"bytes32\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"refundEscrow\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"getEscrow\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\"}],\"outputs\":[{\"name\":\"user\",\"type\":\"address\"},{\"name\":\"resolver\",\"type\":\"address\"},{\"name\":\"token\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"},{\"name\":\"timelock\",\"type\":\"uint256\"},{\"name\":\"claimed\",\"type\":\"bool\"},{\"name\":\"refunded\",\"type\":\"bool\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"escrows\",\"inputs\":[{\"name\":\"\",\"type\":\"bytes32\"}],\"outputs\":[{\"name\":\"user\",\"type\":\"address\"},{\"name\":\"resolver\",\"type\":\"address\"},{\"name\":\"token\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"},{\"name\":\"timelock\",\"type\":\"uint256\"},{\"name\":\"claimed\",\"type\":\"bool\"},{\"name\":\"refunded\",\"type\":\"bool\"}],\"stateMutability\":\"view\"},{\"type\":\"event\",\"name\":\"SecretRevealed\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\",\"indexed\":true},{\"name\":\"secret\",\"type\":\"bytes32\",\"indexed\":false},{\"name\":\"resolver\",\"type\":\"address\",\"indexed\":true},{\"name\":\"user\",\"type\":\"address\",\"indexed\":true}]},{\"type\":\"event\",\"name\":\"EscrowCreated\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\",\"indexed\":true},{\"name\":\"user\",\"type\":\"address\",\"indexed\":true},{\"name\":\"token\",\"type\":\"address\",\"indexed\":true},{\"name\":\"amount\",\"type\":\"uint256\",\"indexed\":false},{\"name\":\"timelock\",\"type\":\"uint256\",\"indexed\":false}]},{\"type\":\"event\",\"name\":\"EscrowClaimed\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\",\"indexed\":true},{\"name\":\"resolver\",\"type\":\"address\",\"indexed\":true},{\"name\":\"secret\",\"type\":\"bytes32\",\"indexed\":false}]},{\"type\":\"event\",\"name\":\"EscrowRefunded\",\"inputs\":[{\"name\":\"secretHash\",\"type\":\"bytes32\",\"indexed\":true},{\"name\":\"user\",\"type\":\"address\",\"indexed\":true}]}]",
}

// FusionBtcSettlementABI is the input ABI used to generate the binding from.
var FusionBtcSettlementABI = FusionBtcSettlementMetaData.ABI

// FusionBtcSettlement is an auto generated Go binding around an Ethereum contract.
type FusionBtcSettlement struct {
	FusionBtcSettlementCaller     // Read-only binding to the contract
	FusionBtcSettlementTransactor // Write-only binding to the contract
	FusionBtcSettlementFilterer   // Log filterer for contract events
}

// FusionBtcSettlementCaller is an auto generated read-only Go binding around an Ethereum contract.
type FusionBtcSettlementCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FusionBtcSettlementTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FusionBtcSettlementTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FusionBtcSettlementFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FusionBtcSettlementFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// NewFusionBtcSettlement creates a new instance of FusionBtcSettlement, bound to a specific deployed contract.
func NewFusionBtcSettlement(address common.Address, backend bind.ContractBackend) (*FusionBtcSettlement, error) {
	contract, err := bindFusionBtcSettlement(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FusionBtcSettlement{FusionBtcSettlementCaller: FusionBtcSettlementCaller{contract: contract}, FusionBtcSettlementTransactor: FusionBtcSettlementTransactor{contract: contract}, FusionBtcSettlementFilterer: FusionBtcSettlementFilterer{contract: contract}}, nil
}

// bindFusionBtcSettlement binds a generic wrapper to an already deployed contract.
func bindFusionBtcSettlement(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(FusionBtcSettlementABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// CreateEscrow is a paid mutator transaction binding the contract method 0x...
func (_FusionBtcSettlement *FusionBtcSettlementTransactor) CreateEscrow(opts *bind.TransactOpts, secretHash [32]byte, user common.Address, token common.Address, amount *big.Int, timelock *big.Int) (*types.Transaction, error) {
	return _FusionBtcSettlement.contract.Transact(opts, "createEscrow", secretHash, user, token, amount, timelock)
}

// ClaimEscrow is a paid mutator transaction binding the contract method 0x...
func (_FusionBtcSettlement *FusionBtcSettlementTransactor) ClaimEscrow(opts *bind.TransactOpts, secretHash [32]byte, secret [32]byte) (*types.Transaction, error) {
	return _FusionBtcSettlement.contract.Transact(opts, "claimEscrow", secretHash, secret)
}

// GetEscrow is a free data retrieval call binding the contract method 0x...
func (_FusionBtcSettlement *FusionBtcSettlementCaller) GetEscrow(opts *bind.CallOpts, secretHash [32]byte) (struct {
	User     common.Address
	Resolver common.Address
	Token    common.Address
	Amount   *big.Int
	Timelock *big.Int
	Claimed  bool
	Refunded bool
}, error) {
	var out []interface{}
	err := _FusionBtcSettlement.contract.Call(opts, &out, "getEscrow", secretHash)

	outstruct := struct {
		User     common.Address
		Resolver common.Address
		Token    common.Address
		Amount   *big.Int
		Timelock *big.Int
		Claimed  bool
		Refunded bool
	}{}

	outstruct.User = *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	outstruct.Resolver = *abi.ConvertType(out[1], new(common.Address)).(*common.Address)
	outstruct.Token = *abi.ConvertType(out[2], new(common.Address)).(*common.Address)
	outstruct.Amount = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.Timelock = *abi.ConvertType(out[4], new(*big.Int)).(**big.Int)
	outstruct.Claimed = *abi.ConvertType(out[5], new(bool)).(*bool)
	outstruct.Refunded = *abi.ConvertType(out[6], new(bool)).(*bool)

	return outstruct, err
}

// FusionBtcSettlementSecretRevealedIterator is returned from FilterSecretRevealed and is used to iterate over the raw logs and unpacked data for SecretRevealed events raised by the FusionBtcSettlement contract.
type FusionBtcSettlementSecretRevealedIterator struct {
	Event *FusionBtcSettlementSecretRevealed // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// FusionBtcSettlementSecretRevealed represents a SecretRevealed event raised by the FusionBtcSettlement contract.
type FusionBtcSettlementSecretRevealed struct {
	SecretHash [32]byte
	Secret     [32]byte
	Resolver   common.Address
	User       common.Address
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterSecretRevealed is a free log retrieval operation binding the contract event 0x...
func (_FusionBtcSettlement *FusionBtcSettlementFilterer) FilterSecretRevealed(opts *bind.FilterOpts, secretHash [][32]byte, resolver []common.Address, user []common.Address) (*FusionBtcSettlementSecretRevealedIterator, error) {

	var secretHashRule []interface{}
	for _, secretHashItem := range secretHash {
		secretHashRule = append(secretHashRule, secretHashItem)
	}
	var resolverRule []interface{}
	for _, resolverItem := range resolver {
		resolverRule = append(resolverRule, resolverItem)
	}
	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _FusionBtcSettlement.contract.FilterLogs(opts, "SecretRevealed", secretHashRule, resolverRule, userRule)
	if err != nil {
		return nil, err
	}
	return &FusionBtcSettlementSecretRevealedIterator{contract: _FusionBtcSettlement.contract, event: "SecretRevealed", logs: logs, sub: sub}, nil
}
