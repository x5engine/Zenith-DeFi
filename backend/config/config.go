/*
================================================================================
File 2: config/config.go - Application Configuration Manager
================================================================================

PURPOSE:
This file defines the configuration structure for the entire resolver backend
and provides the logic to load these settings from environment variables.
Separating configuration from application logic is a fundamental principle of
the "Twelve-Factor App" methodology, making the service more portable, scalable,
and secure.

LIBRARIES USED:
- "github.com/joho/godotenv": A popular library to load environment variables
  from a `.env` file during local development. This file should be included in
  `.gitignore` and never committed to version control.
- "github.com/caarlos0/env/v6": A powerful library that automatically parses
  environment variables into a Go struct, reducing boilerplate code and making
  configuration management clean and type-safe.

HOW TO USE:
1. Create a `.env` file in the root of the project.
2. Add the required key-value pairs (e.g., `BTC_RPC_USER=youruser`).
3. The `Load()` function will be called once at startup from `main.go`.

*/

package config

import (
	"log"

	"github.com/caarlos0/env/v6"
	"github.com/joho/godotenv"
)

// BtcConfig holds all configuration specific to the Bitcoin node connection.
type BtcConfig struct {
	RPCUser         string `env:"BTC_RPC_USER,required"`
	RPCPass         string `env:"BTC_RPC_PASS,required"`
	RPCHost         string `env:"BTC_RPC_HOST" envDefault:"localhost:18443"`                                      // Default for regtest
	ResolverAddress string `env:"BTC_RESOLVER_ADDRESS" envDefault:"bcrt1qwa29ncycnamh4mmy495zpl0vk9tgyfdxwn0ptu"` // Resolver's BTC address for sending
}

// EvmConfig holds all configuration for connecting to an EVM-compatible chain.
type EvmConfig struct {
	RPCURL     string `env:"EVM_RPC_URL,required"`
	PrivateKey string `env:"EVM_PRIVATE_KEY,required"` // The resolver's hot wallet private key
	ChainID    int64  `env:"EVM_CHAIN_ID,required"`
	DemoMode   bool   `env:"DEMO_MODE" envDefault:"false"`
}

// OneInchConfig holds configuration for the 1inch Developer Portal API.
type OneInchConfig struct {
	APIKey string `env:"ONEINCH_API_KEY,required"`
}

// Config is the top-level struct that aggregates all configuration for the application.
type Config struct {
	Bitcoin BtcConfig
	EVM     EvmConfig
	OneInch OneInchConfig
	Port    string `env:"PORT" envDefault:"8080"`
}

// Load reads configuration from environment variables and populates the Config struct.
// It first attempts to load a .env file for local development.
func Load() (*Config, error) {
	// In a production environment, variables are set directly. For local dev,
	// we load them from a .env file. The `godotenv.Load` function will not
	// return an error if the .env file doesn't exist.
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Could not load .env file. Proceeding with environment variables.")
	}

	cfg := &Config{}

	// The `env.Parse` function will automatically map the environment variables
	// to the struct fields based on the `env` tags.
	if err := env.Parse(cfg); err != nil {
		return nil, err
	}

	return cfg, nil
}
