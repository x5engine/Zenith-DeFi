Backend Integration Testing Plan
================================

1\. Objective
-------------

This document provides a comprehensive test plan to manually validate the functionality of the Go resolver backend. The tests will be conducted using `curl` to interact with the API endpoints and `bitcoin-cli` to simulate user actions on the Bitcoin `regtest` network.

The primary goal is to verify the end-to-end orchestration of the Bitcoin side of a swap, from initiation to deposit detection.

2\. Prerequisites
-----------------

Before beginning, ensure the following setup is complete and running:

1.  **Bitcoin Core Node:** The `bitcoind` daemon must be running in `regtest` mode with a funded wallet, as described in `INSTALL.md`.

2.  **Go Backend Service:** The resolver backend must be running locally (`go run main.go`) and connected to the `regtest` node.

3.  **Terminal/Shell:** You will need two separate terminal windows:

    -   **Terminal 1:** To run `curl` commands against the backend API.

    -   **Terminal 2:** To run `bitcoin-cli` commands to interact with your node.

3\. Test Cases
--------------

### Test Case 1: Health Check & Quote Endpoint

-   **Objective:** Verify that the API server is running and responsive.

-   **Action:** In **Terminal 1**, execute the following `curl` command to request a quote.

```
curl -X POST http://localhost:8080/quote\
-H "Content-Type: application/json"\
-d '{
    "fromChainId": 0,
    "fromTokenAddress": "BTC",
    "toChainId": 137,
    "toTokenAddress": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    "amount": "10000000"
}'

```

-   **Expected Outcome:**

    -   A `200 OK` HTTP status code.

    -   A JSON response body matching the `QuoteResponse` structure, similar to this:

        ```
        {
            "toTokenAmount": "1500000000000000000",
            "fee": "50000000000000000",
            "estimatedTime": 300,
            "quoteId": "quote-placeholder-123"
        }

        ```

### Test Case 2: Swap Initiation

-   **Objective:** Verify that the backend can successfully create an HTLC and initiate a swap.

-   **Action:** In **Terminal 1**, execute the following `curl` command. We will use a placeholder `quoteId` and a sample BTC public key for the refund address.

```
curl -X POST http://localhost:8080/swap/initiate\
-H "Content-Type: application/json"\
-d '{
    "quoteId": "quote-placeholder-123",
    "userBtcRefundPubkey": "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
    "userEvmAddress": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
}'

```

-   **Expected Outcome:**

    -   A `200 OK` HTTP status code.

    -   A JSON response body containing a unique `swapId` and a `btcDepositAddress`.

    -   The `btcDepositAddress`  **must** be a valid `regtest` P2SH address, starting with `bcrt1`.

        ```
        {
            "swapId": "swap-a1b2c3d4",
            "btcDepositAddress": "bcrt1q...",
            "expiresAt": "..."
        }

        ```

    -   **Crucially, check the logs of your running Go backend.** You should see a log message from the `Orchestrator` indicating a new swap has been initiated and a P2SH address has been generated.

### Test Case 3: Initial Status Check

-   **Objective:** Verify that the status of the newly created swap is correctly reported as `PENDING_DEPOSIT`.

-   **Action:**

    1.  Copy the `swapId` from the response in Test Case 2.

    2.  In **Terminal 1**, execute the following `curl` command, replacing `{swapId}` with your actual ID.

```
curl -X GET http://localhost:8080/swap/status/{swapId}

```

-   **Expected Outcome:**

    -   A `200` OK HTTP status code.

    -   A JSON response showing the status as `PENDING_DEPOSIT`.

        ```
        {
            "swapId": "swap-a1b2c3d4",
            "status": "PENDING_DEPOSIT",
            "message": "Swap is currently in state: PENDING_DEPOSIT"
        }

        ```

### Test Case 4: End-to-End Deposit Detection

-   **Objective:** This is the full integration test. We will simulate the user sending BTC and verify that the backend's orchestrator detects the deposit and updates the swap's state.

-   **Action:**

    1.  **Get Deposit Details:** Copy the `btcDepositAddress` from the response in Test Case 2.

    2.  **Send BTC:** In **Terminal 2**, use `bitcoin-cli` to send 0.1 BTC (as an example amount) to the HTLC address.

        ```
        # Replace <btcDepositAddress> with the actual address from the API response
        bitcoin-cli sendtoaddress <btcDepositAddress> 0.1

        ```

        This command will return a transaction hash (TXID).

    3.  **Confirm Transaction:** In **Terminal 2**, mine one block to confirm the transaction in the `regtest` chain.

        ```
        bitcoin-cli -generate 1

        ```

    4.  **Observe Backend Logs:** Immediately watch the logs of your running Go application in its terminal. The `runSwapLifecycle` goroutine for your swap should detect the confirmed transaction and log a message similar to `[LIFECYCLE-swap-a1b2c3d4]` BTC deposit` confirmed.`.

    5.  **Verify Final Status:** In **Terminal 1**, re-run the status check command from Test Case 3.

        ```
        curl -X GET http://localhost:8080/swap/status/{swapId}

        ```

-   **Expected Outcome:**

    -   The backend logs must show the deposit detection message.

    -   The final `curl` command must return a `200` OK status.

    -   The JSON response must now show the status has been updated to `BTC_CONFIRMED` or the next state in your orchestrator's logic (e.g., `EVM_FULFILLED`).

        ```
        {
            "swapId": "swap-a1b2c3d4",
            "status": "BTC_CONFIRMED",
            "message": "Swap is currently in state: BTC_CONFIRMED"
        }

        ```

Conclusion
----------

If all test cases pass, especially Test Case 4, you have successfully validated the core functionality of your resolver backend. You have proven that it can create a cryptographically secure Bitcoin HTLC, monitor it for deposits, and correctly update its internal state machine upon confirmation. This forms a solid foundation for the rest of the application's features.