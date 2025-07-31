/**
 * ApiService - Handles all network communication with the resolver backend proxy
 * This class abstracts away fetch calls and JSON parsing
 */
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Get a quote for a swap
     * @param {Object} quoteRequest - The quote request object
     * @param {number} quoteRequest.fromChainId - Source chain ID
     * @param {string} quoteRequest.fromTokenAddress - Source token address
     * @param {number} quoteRequest.toChainId - Destination chain ID
     * @param {string} quoteRequest.toTokenAddress - Destination token address
     * @param {string} quoteRequest.amount - Amount to swap
     * @returns {Promise<Object>} Quote response from the server
     */
    async getQuote(quoteRequest) {
        try {
            const response = await fetch(`${this.baseUrl}/quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteRequest),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting quote:', error);
            throw error;
        }
    }

    /**
     * Initiate a swap
     * @param {Object} swapRequest - The swap request object
     * @param {string} swapRequest.quoteId - Quote ID from the quote response
     * @param {string} swapRequest.userBtcRefundPubkey - User's BTC refund public key
     * @param {string} swapRequest.userEvmAddress - User's EVM address
     * @returns {Promise<Object>} Swap response containing swapId and btcDepositAddress
     */
    async initiateSwap(swapRequest) {
        try {
            const response = await fetch(`${this.baseUrl}/swap/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(swapRequest),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error initiating swap:', error);
            throw error;
        }
    }

    /**
     * Get the status of a swap
     * @param {string} swapId - The swap ID to check
     * @returns {Promise<Object>} Swap status response
     */
    async getSwapStatus(swapId) {
        try {
            const response = await fetch(`${this.baseUrl}/swap/status/${swapId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting swap status:', error);
            throw error;
        }
    }
}

export default ApiService; 