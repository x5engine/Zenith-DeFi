// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FusionBtcSettlement
 * @dev 1inch Fusion+ compatible settlement contract for Bitcoin cross-chain swaps
 * This contract follows 1inch's settlement architecture but enables Bitcoin integration
 */
contract FusionBtcSettlement {
    
    // Events matching 1inch Fusion+ patterns
    event SecretRevealed(
        bytes32 indexed secretHash,
        bytes32 secret,
        address indexed resolver,
        address indexed user
    );
    
    event EscrowCreated(
        bytes32 indexed secretHash,
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timelock
    );
    
    event EscrowClaimed(
        bytes32 indexed secretHash,
        address indexed resolver,
        bytes32 secret
    );
    
    event EscrowRefunded(
        bytes32 indexed secretHash,
        address indexed user
    );
    
    // Escrow structure for cross-chain swaps
    struct Escrow {
        address user;           // User who created the escrow
        address resolver;       // Resolver who will claim
        address token;          // ERC20 token address  
        uint256 amount;         // Amount in escrow
        uint256 timelock;       // Unix timestamp for timeout
        bool claimed;           // Whether escrow was claimed
        bool refunded;          // Whether escrow was refunded
    }
    
    // Mapping from secret hash to escrow details
    mapping(bytes32 => Escrow) public escrows;
    
    // Resolver whitelist (following 1inch pattern)
    mapping(address => bool) public whitelistedResolvers;
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier onlyWhitelistedResolver() {
        require(whitelistedResolvers[msg.sender], "Resolver not whitelisted");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Whitelist a resolver (similar to 1inch resolver registration)
     */
    function whitelistResolver(address resolver) external onlyOwner {
        whitelistedResolvers[resolver] = true;
    }
    
    /**
     * @dev Create escrow for cross-chain swap (called by resolver)
     * This is the EVM side of the atomic swap
     */
    function createEscrow(
        bytes32 secretHash,
        address user,
        address token,
        uint256 amount,
        uint256 timelock
    ) external onlyWhitelistedResolver {
        require(escrows[secretHash].amount == 0, "Escrow already exists");
        require(timelock > block.timestamp, "Invalid timelock");
        
        // Transfer tokens from resolver to contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        escrows[secretHash] = Escrow({
            user: user,
            resolver: msg.sender,
            token: token,
            amount: amount,
            timelock: timelock,
            claimed: false,
            refunded: false
        });
        
        emit EscrowCreated(secretHash, user, token, amount, timelock);
    }
    
    /**
     * @dev Claim escrow with secret (reveals secret for Bitcoin claim)
     * This is called by the user after receiving Bitcoin
     */
    function claimEscrow(bytes32 secretHash, bytes32 secret) external {
        Escrow storage escrow = escrows[secretHash];
        
        require(escrow.amount > 0, "Escrow does not exist");
        require(!escrow.claimed && !escrow.refunded, "Escrow already processed");
        require(msg.sender == escrow.user, "Not authorized to claim");
        require(sha256(abi.encodePacked(secret)) == secretHash, "Invalid secret");
        
        escrow.claimed = true;
        
        // Transfer tokens to user
        IERC20(escrow.token).transfer(escrow.user, escrow.amount);
        
        // Emit event with secret revelation
        emit SecretRevealed(secretHash, secret, escrow.resolver, escrow.user);
        emit EscrowClaimed(secretHash, escrow.resolver, secret);
    }
    
    /**
     * @dev Refund escrow after timeout (if user doesn't claim)
     */
    function refundEscrow(bytes32 secretHash) external {
        Escrow storage escrow = escrows[secretHash];
        
        require(escrow.amount > 0, "Escrow does not exist");
        require(!escrow.claimed && !escrow.refunded, "Escrow already processed");
        require(block.timestamp >= escrow.timelock, "Timelock not expired");
        require(msg.sender == escrow.resolver, "Not authorized to refund");
        
        escrow.refunded = true;
        
        // Refund tokens to resolver
        IERC20(escrow.token).transfer(escrow.resolver, escrow.amount);
        
        emit EscrowRefunded(secretHash, escrow.user);
    }
    
    /**
     * @dev Get escrow details
     */
    function getEscrow(bytes32 secretHash) external view returns (
        address user,
        address resolver,
        address token,
        uint256 amount,
        uint256 timelock,
        bool claimed,
        bool refunded
    ) {
        Escrow memory escrow = escrows[secretHash];
        return (
            escrow.user,
            escrow.resolver,
            escrow.token,
            escrow.amount,
            escrow.timelock,
            escrow.claimed,
            escrow.refunded
        );
    }
}

// Interface for ERC20 tokens
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}