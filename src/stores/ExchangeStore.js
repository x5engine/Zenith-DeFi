import { makeAutoObservable, runInAction } from 'mobx';

class ExchangeStore {
    // --- Observables: The reactive state of the application ---
    quote = null;
    swapId = null;
    btcDepositAddress = null;
    swapStatus = 'IDLE'; // e.g., IDLE, QUOTING, PENDING_DEPOSIT, CONFIRMED, etc.
    statusMessage = 'Please select tokens to begin.';
    confirmationCount = 0;

    // --- Dependencies (Injected) ---
    rootStore;
    apiService;
    walletService;

    constructor(rootStore, apiService, walletService) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.apiService = apiService;
        this.walletService = walletService;
        
        // Load persisted state
        this.loadPersistedState();
    }

    // --- Actions: Methods that modify the state ---
    async fetchQuote(params) {
        this.swapStatus = 'QUOTING';
        this.statusMessage = 'Fetching the best rate...';
        try {
            const quoteResult = await this.apiService.getQuote(params);
            runInAction(() => {
                this.quote = quoteResult;
                this.swapStatus = 'QUOTED';
                this.statusMessage = 'Quote received. Please confirm.';
                this.persistState();
            });
        } catch (error) {
            runInAction(() => {
                this.swapStatus = 'ERROR';
                this.statusMessage = 'Failed to fetch quote.';
            });
        }
    }

    async initiateBtcSwap() {
        if (!this.quote) return;

        // ... (Implementation for getting refund key - see Change 3)
        const userEvmAddress = this.walletService.getConnectedAddress();
        const btcRefundPubkey = await this.walletService.getBtcRefundKey();

        const swapRequest = {
            quoteId: this.quote.quoteId,
            userBtcRefundPubkey: btcRefundPubkey,
            userEvmAddress: userEvmAddress,
        };

        this.swapStatus = 'INITIATING';
        this.statusMessage = 'Contacting resolver to initiate swap...';

        try {
            const swapResponse = await this.apiService.initiateSwap(swapRequest);
            runInAction(() => {
                this.swapId = swapResponse.swapId;
                this.btcDepositAddress = swapResponse.btcDepositAddress;
                this.swapStatus = 'PENDING_DEPOSIT';
                this.statusMessage = 'Please send BTC to the provided address.';
                this.persistState();
            });
            this.startStatusPolling();
        } catch (error) {
            runInAction(() => {
                this.swapStatus = 'ERROR';
                this.statusMessage = 'Failed to initiate swap.';
            });
        }
    }

    startStatusPolling() {
        const intervalId = setInterval(async () => {
            if (!this.swapId) {
                clearInterval(intervalId);
                return;
            }
            try {
                const statusResponse = await this.apiService.getSwapStatus(this.swapId);
                runInAction(() => {
                    this.swapStatus = statusResponse.status;
                    this.statusMessage = statusResponse.message;
                    // this.confirmationCount = statusResponse.confirmationCount; // Backend should provide this
                    this.persistState();
                });

                if (['COMPLETED', 'REFUNDED', 'ERROR'].includes(statusResponse.status)) {
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Error polling swap status:', error);
                // Don't stop polling on network errors, just log them
            }
        }, 15000); // Poll every 15 seconds
    }

    // Load persisted state from localStorage
    loadPersistedState() {
        try {
            const persistedState = localStorage.getItem('exchangeStoreState');
            if (persistedState) {
                const state = JSON.parse(persistedState);
                this.quote = state.quote;
                this.swapId = state.swapId;
                this.btcDepositAddress = state.btcDepositAddress;
                this.swapStatus = state.swapStatus || 'IDLE';
                this.statusMessage = state.statusMessage || 'Please select tokens to begin.';
                this.confirmationCount = state.confirmationCount || 0;
                
                // If there's an active swap, restart polling
                if (this.swapId && this.swapStatus !== 'COMPLETED' && this.swapStatus !== 'ERROR') {
                    this.startStatusPolling();
                }
            }
        } catch (error) {
            console.error('Error loading persisted state:', error);
        }
    }

    // Persist state to localStorage
    persistState() {
        try {
            const state = {
                quote: this.quote,
                swapId: this.swapId,
                btcDepositAddress: this.btcDepositAddress,
                swapStatus: this.swapStatus,
                statusMessage: this.statusMessage,
                confirmationCount: this.confirmationCount
            };
            localStorage.setItem('exchangeStoreState', JSON.stringify(state));
        } catch (error) {
            console.error('Error persisting state:', error);
        }
    }

    // Reset the store state
    reset() {
        this.quote = null;
        this.swapId = null;
        this.btcDepositAddress = null;
        this.swapStatus = 'IDLE';
        this.statusMessage = 'Please select tokens to begin.';
        this.confirmationCount = 0;
        
        // Clear persisted state
        localStorage.removeItem('exchangeStoreState');
    }

    // Getters for computed values
    get isProcessing() {
        return ['QUOTING', 'INITIATING', 'PENDING_DEPOSIT', 'CONFIRMED', 'EVM_FULFILLED'].includes(this.swapStatus);
    }

    get hasQuote() {
        return this.quote !== null;
    }

    get canInitiateSwap() {
        return this.hasQuote && this.swapStatus === 'QUOTED';
    }
}

export default ExchangeStore; 