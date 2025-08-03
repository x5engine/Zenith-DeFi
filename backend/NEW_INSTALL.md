# Installation Guide (Live Testnet Demo)

This guide provides the complete setup instructions for running the resolver application in a live demonstration environment using the public **Bitcoin `testnet`** and **Polygon `Mumbai`** networks.

---

## Part 1: System Prerequisites

This is the same as the local setup. You must have **Go** and **Bitcoin Core** installed on your system. Please refer to the original `INSTALL.md` if you have not completed this step.

---

## Part 2: Bitcoin Node Configuration (`testnet` Mode)

This is the most time-intensive part of the setup. We will configure and sync a full Bitcoin `testnet` node.

### 1. Create the Testnet Configuration File

* Navigate to your Bitcoin data directory (e.g., `~/.bitcoin/`).
* Open your `bitcoin.conf` file and ensure it contains the following, replacing the credentials with your own:

    ```ini
    # Run on the public test network.
    testnet=1

    # Enable the RPC server.
    server=1

    # Secure the RPC server.
    rpcuser=yourrpcuser
    rpcpassword=yourrpcpassword

    # Maintain a full transaction index.
    txindex=1
    ```

### 2. Start the Daemon and Sync the Testnet

* **Start the Daemon:** Open a terminal and start the Bitcoin Core daemon in `testnet` mode.
    ```bash
    bitcoind -testnet -daemon
    ```
* **Begin Syncing (CRITICAL):** The node will now begin downloading and verifying the entire `testnet` blockchain (~80 GB). **This process can take several hours to a full day depending on your internet connection and hardware.** You must start this as early as possible.
* **Monitor Sync Progress:** You can check the progress at any time with the following command:
    ```bash
    bitcoin-cli -testnet getblockchaininfo
    ```
    Compare the `blocks` count to the `headers` count. The sync is complete when they are equal.

### 3. Fund Your Testnet Wallet

Unlike `regtest`, you cannot mine your own funds. You must use a public "faucet."

1.  **Create a Wallet:** If you haven't already, create a wallet for your node.
    ```bash
    bitcoin-cli -testnet createwallet "mytestnetwallet"
    ```
2.  **Get a New Address:**
    ```bash
    bitcoin-cli -testnet getnewaddress
    ```
    e.g: tb1qz5aet6qvn96zuz4q8sth64uzjrycahcd22mnej
3.  **Use a Faucet:** Copy the generated `tb1q...` address. Go to a public Bitcoin Testnet Faucet (e.g., `https://bitcoinfaucet.uo1.net/send.php`, `https://coinfaucet.eu/en/btc-testnet/`) and paste your address to receive free testnet BTC. It may take a few minutes for the transaction to appear.

---

## Part 3: L2 Wallet & Funds Setup (Polygon Mumbai)

Your resolver backend needs its own wallet on the destination L2 to provide the funds for the swap.

1.  **Install MetaMask:** If you don't have it, install the MetaMask browser extension.
2.  **Create a New Account:** Create a new, clean account in MetaMask to use as your resolver's hot wallet. **Do not use a personal account.**
3.  **Export Private Key:** Export the private key for this new account. This is the key you will put in your backend's `.env` file (`EVM_PRIVATE_KEY`).
4.  **Add Mumbai Network:** In MetaMask, add a new network with the following details:
    * **Network Name:** Polygon Mumbai Testnet
    * **New RPC URL:** `https://rpc-mumbai.maticvigil.com/`
    * **Chain ID:** `80001`
    * **Currency Symbol:** `MATIC`
    * **Block Explorer URL:** `https://mumbai.polygonscan.com/`
5.  **Fund with Faucet:** Go to a public Polygon Faucet (e.g., `https://faucet.polygon.technology/`) and get free testnet MATIC sent to your new MetaMask address. This is required to pay for gas fees.

---

## Part 4: Project Setup and Execution

1.  **Clone Repository:** `git clone <your-repository-url>` and `cd` into the project.
2.  **Configure Backend `.env`:** In the `backend` directory, create your `.env` file and populate it with the `testnet` credentials, as detailed in `Changes3.md`.
3.  **Install Dependencies:** In the `backend` directory, run `go mod tidy`. In the project root, run `npm install`.
4.  **Run the Stack:**
    * Ensure your `bitcoind -testnet` daemon is running and fully synced.
    * In one terminal, start the backend: `cd backend && go run main.go`.
    * In another terminal, start the frontend: `npm start`.

Your application is now running locally but is interacting with public test networks, making your demo fully verifiable by the judges.
