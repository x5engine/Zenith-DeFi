import { ethers } from 'ethers';
import { makeAutoObservable, runInAction } from 'mobx';

/**
 * WalletService - Manages all direct interactions with the user's Web3 wallet
 * This class encapsulates all ethers.js logic, abstracting wallet interactions
 */
class WalletService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.connectedAddress = null;
        
        makeAutoObservable(this);
        
        // Check for existing connection on initialization
        this.initializeFromStorage();
    }

    /**
     * Initialize from localStorage and check for existing wallet connection
     */
    async initializeFromStorage() {
        try {
            // Check localStorage first
            const wasConnected = localStorage.getItem('walletConnected') === 'true';
            const storedAddress = localStorage.getItem('walletAddress');
            
            console.log('Checking wallet persistence:', { wasConnected, storedAddress });
            
            if (wasConnected && storedAddress && typeof window.ethereum !== 'undefined') {
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                
                // Check if wallet is still connected
                const accounts = await this.provider.listAccounts();
                console.log('Found accounts:', accounts);
                
                if (accounts.length > 0) {
                    runInAction(() => {
                        this.connectedAddress = accounts[0];
                        this.signer = this.provider.getSigner();
                    });
                    console.log('✅ Restored wallet connection from storage:', this.connectedAddress);
                    return true;
                } else {
                    console.log('❌ No accounts found, clearing storage');
                    this.clearStorage();
                }
            } else {
                console.log('❌ No stored connection found or no ethereum provider');
            }
        } catch (error) {
            console.error('Error initializing from storage:', error);
            this.clearStorage();
        }
        return false;
    }

    /**
     * Clear localStorage
     */
    clearStorage() {
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
    }

    /**
     * Initialize the Web3 provider
     * @returns {boolean} True if provider is available, false otherwise
     */
    initializeProvider() {
        if (typeof window.ethereum !== 'undefined') {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            return true;
        } else {
            console.error('No Web3 provider found. Please install MetaMask or another Web3 wallet.');
            return false;
        }
    }

    /**
     * Connect to the user's wallet
     * @returns {Promise<string>} The connected user's EVM address
     */
    async connectWallet() {
        try {
            if (!this.provider) {
                if (!this.initializeProvider()) {
                    throw new Error('No Web3 provider available');
                }
            }

            // Request account access
            const accounts = await this.provider.send('eth_requestAccounts', []);
            
            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            runInAction(() => {
                this.connectedAddress = accounts[0];
                this.signer = this.provider.getSigner();
            });

            // Store connection state in localStorage
            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('walletAddress', this.connectedAddress);

            return this.connectedAddress;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    /**
     * Disconnect wallet
     */
    disconnectWallet() {
        runInAction(() => {
            this.connectedAddress = null;
            this.signer = null;
            this.provider = null;
        });
        
        // Clear localStorage
        this.clearStorage();
    }

    /**
     * Get the current chain ID
     * @returns {Promise<number>} The current network's chain ID
     */
    async getChainId() {
        try {
            if (!this.provider) {
                throw new Error('Provider not initialized');
            }

            const network = await this.provider.getNetwork();
            return network.chainId;
        } catch (error) {
            console.error('Error getting chain ID:', error);
            throw error;
        }
    }

    /**
     * Generate BTC refund public key using EIP-191 signature-based key derivation
     * @returns {Promise<string>} The BTC public key in hex format
     */
    async getBtcRefundKey() {
        if (!this.signer) throw new Error("Wallet not connected.");

        // A static, domain-specific message prevents replay attacks across different dApps.
        const message = "Generate my secure Bitcoin refund key for Zenith DeFi swap.";

        try {
            // 1. User signs the message with their EVM wallet.
            const signature = await this.signer.signMessage(message);

            // 2. Use the signature as a seed. A simple and effective way is to hash it.
            // The signature is 65 bytes (132 hex chars + '0x'). Hashing it produces a 32-byte value,
            // which is a valid private key seed in Bitcoin.
            const seed = ethers.utils.sha256(signature);

            // 3. For now, we'll return a deterministic public key derived from the seed.
            // In a production environment, this would be a proper Bitcoin public key.
            // For the demo, we'll use the seed as a simplified public key representation.
            const publicKey = ethers.utils.keccak256(seed);
            
            // 4. Return the public key in hex format (simplified for demo purposes).
            return publicKey.substring(2); // Remove '0x' prefix

        } catch (error) {
            console.error("BTC Key Generation failed:", error);
            // The user likely rejected the signature request.
            throw new Error("Signature request was rejected.");
        }
    }

    /**
     * Sign an off-chain order (placeholder for 1inch SDK interaction)
     * @param {Object} order - The order to sign
     * @returns {Promise<string>} The signature
     */
    async signOffChainOrder(order) {
        try {
            if (!this.signer) {
                throw new Error('Wallet not connected');
            }

            // This is a placeholder for the actual 1inch SDK interaction
            // For BTC-to-EVM flow, the primary "signature" is the user performing the on-chain BTC transaction
            const message = JSON.stringify(order);
            const signature = await this.signer.signMessage(message);
            
            return signature;
        } catch (error) {
            console.error('Error signing off-chain order:', error);
            throw error;
        }
    }

    /**
     * Get the currently connected wallet address
     * @returns {string|null} The connected address or null if not connected
     */
    getConnectedAddress() {
        return this.connectedAddress;
    }

    /**
     * Check if wallet is connected
     * @returns {boolean} True if wallet is connected
     */
    isConnected() {
        return this.connectedAddress !== null && this.signer !== null;
    }

    /**
     * Get token balance for a specific token
     * @param {string} tokenAddress - The token contract address
     * @param {string} userAddress - The user's address
     * @returns {Promise<string>} The token balance as a string
     */
    async getTokenBalance(tokenAddress, userAddress = null) {
        try {
            if (!this.provider) {
                throw new Error('Provider not initialized');
            }

            const address = userAddress || this.connectedAddress;
            if (!address) {
                throw new Error('No address provided');
            }

            // For ETH (native token)
            if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
                const balance = await this.provider.getBalance(address);
                return ethers.utils.formatEther(balance);
            }

            // For ERC-20 tokens
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ['function balanceOf(address) view returns (uint256)'],
                this.provider
            );

            const balance = await tokenContract.balanceOf(address);
            return ethers.utils.formatUnits(balance, 18); // Assuming 18 decimals
        } catch (error) {
            console.error('Error getting token balance:', error);
            throw error;
        }
    }

    /**
     * Listen for account changes
     * @param {Function} callback - Callback function to execute when account changes
     */
    onAccountChange(callback) {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    runInAction(() => {
                        this.connectedAddress = accounts[0];
                        this.signer = this.provider.getSigner();
                    });
                    localStorage.setItem('walletConnected', 'true');
                    localStorage.setItem('walletAddress', this.connectedAddress);
                } else {
                    this.disconnectWallet();
                }
                callback(accounts);
            });
        }
    }

    /**
     * Force re-initialization (useful for testing)
     */
    async forceReinitialize() {
        runInAction(() => {
            this.connectedAddress = null;
            this.signer = null;
            this.provider = null;
        });
        return await this.initializeFromStorage();
    }

    /**
     * Listen for chain changes
     * @param {Function} callback - Callback function to execute when chain changes
     */
    onChainChange(callback) {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', callback);
        }
    }
}

export default WalletService; 