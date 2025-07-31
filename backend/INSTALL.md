Installation Guide: 1inch Fusion+ Native Bitcoin Resolver
=========================================================

This guide provides a comprehensive, step-by-step walkthrough to set up and run the native Bitcoin resolver backend on a local machine. Each step includes explanations and verification commands to ensure a smooth installation.

Part 1: System Prerequisites
----------------------------

Before cloning the project, ensure your development environment has the following software installed and configured correctly.

### 1\. Go (Golang)

The backend service is written in Go, a high-performance language well-suited for network services. You will need Go to compile and run the application.

-   **Installation:** Follow the official, detailed instructions for your operating system at [go.dev/doc/install](https://go.dev/doc/install "null").

-   **Verification:** After installation, open a new terminal and run the following command:

    ```
    go version

    ```

    You should see output similar to `go version go1.19 linux/amd64`, confirming Go is installed correctly.

### 2\. Bitcoin Core

The service needs to communicate with a live Bitcoin node. For development, we use Bitcoin Core's `regtest` mode, which provides a private, local blockchain sandbox.

-   **Installation:** Download the latest binary for your OS from [bitcoincore.org/en/download/](https://bitcoincore.org/en/download/ "null").

-   **Verification:** Ensure the command-line tools `bitcoind` (the node daemon) and `bitcoin-cli` (the RPC client) are accessible from your system's PATH. You can test this by running:

    ```
    bitcoind --version
    bitcoin-cli --version

    ```

### 3\. Docker (Optional, but Recommended)

Docker is the industry standard for containerizing applications. While you can run the service directly with Go, the provided `Dockerfile` allows for easy, consistent, and isolated deployment.

-   **Installation:** Follow the official instructions for your system at [docs.docker.com/get-docker/](https://docs.docker.com/get-docker/ "null").

-   **Verification:** Run `docker --version`. You should see output like `Docker` version 20.10.17, build` 100c701`.

Part 2: Bitcoin Node Configuration (Regtest Mode)
-------------------------------------------------

This is the most critical setup step. We will configure and run a local Bitcoin node in `regtest` mode. This gives us a private blockchain where we can instantly mine blocks and generate test BTC without any cost or real-world impact.

### 1\. Create the Configuration File

-   Navigate to the default Bitcoin data directory for your operating system:

    -   **macOS:**  `~/Library/Application Support/Bitcoin/`

    -   **Linux:**  `~/.bitcoin/`

    -   **Windows:**  `%APPDATA%\Bitcoin\`

-   In this directory, create a new file named `bitcoin.conf`.

### 2\. Add Configuration

-   Open `bitcoin.conf` with a text editor and add the following lines. Replace `yourrpcuser` and `yourrpcpassword` with your own secure credentials.

    ```
    # Run in regression test mode, a private chain for development.
    regtest=1

    # Enable the JSON-RPC server so our Go application can send commands to the node.
    server=1

    # Secure the RPC server with a username and password.
    rpcuser=yourrpcuser
    rpcpassword=yourrpcpassword

    # Maintain a full index of all transactions, not just wallet transactions.
    # This is required for our service to look up arbitrary HTLC funding transactions.
    txindex=1

    # Set a default fee for transactions to prevent them from being rejected by the node.
    fallbackfee=0.0001

    ```

### 3\. Start and Fund the Bitcoin Node

-   **Start the Daemon:** Open a terminal and start the Bitcoin Core daemon in the background.

    ```
    bitcoind -daemon

    ```

    You can check that it's running with `bitcoin-cli getblockchaininfo`.

-   **Create a Wallet:** In the same terminal, create a new wallet for your `regtest` node.

    ```
    bitcoin-cli createwallet "mywallet"

    ```

-   **Generate Funds:** Mine blocks to receive block rewards. The first coinbase transaction requires 100 confirmations before it becomes spendable. Therefore, we mine 101 blocks to get our first spendable funds.

    ```
    bitcoin-cli -generate 101

    ```

-   **Verify Your Balance:** Check that your wallet now contains spendable test BTC.

    ```
    bitcoin-cli getbalance

    ```

    The output should be `50.00000000` (or slightly less if you've set a fee).

Your local Bitcoin node is now running, funded, and ready for the resolver service to connect.

Part 3: Project Setup and Execution
-----------------------------------

### 1\. Clone the Repository

-   Get the project code from its repository.

    ```
    git clone <your-repository-url>
    cd fusion-btc-resolver

    ```

### 2\. Configure Environment Variables

-   The application uses a `.env` file to manage sensitive keys and endpoints. Create your own local copy from the example file. **This** file should never **be committed to source control.**

    ```
    cp .env.example .env

    ```

-   Open the `.env` file and fill in the required values:

    -   `BTC_RPC_USER` & `BTC_RPC_PASS`: Must exactly match the credentials you set in `bitcoin.conf`.

    -   `EVM_RPC_URL`: An RPC URL for an EVM chain (e.g., from Infura, Alchemy, or a local node).

    -   `EVM_PRIVATE_KEY`: A private key for a development wallet. **Do not use a personal wallet with real funds.**

    -   `EVM_CHAIN_ID`: The chain ID for your chosen EVM network (e.g., `137` for Polygon, `42161` for Arbitrum).

    -   `ONEINCH_API_KEY`: Your personal API key from the 1inch Developer Portal.

### 3\. Install Dependencies

-   The project's external libraries are managed by Go Modules. The `go mod tidy` command reads the `go.mod` file, downloads the required libraries (like `btcd` and `go-ethereum`), and ensures the project's dependency tree is clean.

    ```
    go mod tidy

    ```

### 4\. Run the Service

-   You can now compile and run the entire resolver backend with a single command:

    ```
    go run main.go

    ```

-   If successful, you will see log messages indicating that the services are initializing and the server has started on port 8080.

    ```
    --- [RESOLVER_BACKEND] Starting 1inch Fusion+ BTC Resolver Service ---
    [INIT] Loading application configuration...
    [INIT] Configuration loaded successfully.
    ...
    --- [RESOLVER_BACKEND] Server starting on http://localhost:8080 ---

    ```

-   You can verify the server is running by sending a request to one of its endpoints from another terminal:

    ```
    curl -X POST http://localhost:8080/quote -d '{}'

    ```

Your resolver backend is now fully operational locally. You can proceed to interact with it via an API client or by building a frontend application.