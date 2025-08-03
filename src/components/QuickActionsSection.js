import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';
import styled from 'styled-components';
import BitcoinWalletGuide from './BitcoinWalletGuide';

const QuickActionsContainer = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  border: 1px solid #444;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

const TokenSelect = styled.div`
  position: relative;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 120px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #8b5cf6;
  }
`;

const TokenDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  margin-top: 4px;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const TokenOption = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #8b5cf6;
    color: white;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const Input = styled.input`
  flex: 1;
  background: #1a1a1a;
  border: 1px solid ${props => props.hasError ? '#dc2626' : '#444'};
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#8b5cf6'};
  }

  &::placeholder {
    color: #888;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  margin-top: 4px;
  margin-left: 16px;
`;

const ActionButton = styled.button`
  background: ${props => {
    if (props.disabled) return '#444';
    if (props.variant === 'confirm') return 'linear-gradient(135deg, #10b981, #059669)';
    return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
  }};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ArrowIcon = styled.div`
  color: #8b5cf6;
  font-size: 20px;
  font-weight: bold;
`;

const QuickActionsSection = observer(() => {
  const { exchangeStore, walletService } = useStores();
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [amount, setAmount] = useState('0.01');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('BTC');
  const [btcDestinationAddress, setBtcDestinationAddress] = useState(exchangeStore.btcDestinationAddress || '');
  const [inputError, setInputError] = useState('');
  const [btcAddressError, setBtcAddressError] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [showWalletGuide, setShowWalletGuide] = useState(false);
  
  const debounceTimer = useRef(null);
  const fromDropdownRef = useRef();
  const toDropdownRef = useRef();

  const tokens = ['BTC', 'ETH', 'USDC', 'USDT', 'DAI'];

  // Token address mapping for Polygon Amoy
  const getTokenAddress = (token) => {
    const tokenAddresses = {
      'ETH': '0x0000000000000000000000000000000000000000', // Native ETH
      'USDC': '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582', // USDC on Polygon Amoy (placeholder)
      'USDT': '0xf04b8c5ffa4f0c56b9b0cb8e28d4c4d4c4e8f2b3', // USDT on Polygon Amoy (placeholder)
      'DAI': '0xa324f42e762ac7b4c22c44de6b30136e6c504e3f',  // DAI on Polygon Amoy (placeholder)
      'BTC': 'BTC' // Bitcoin (non-EVM)
    };
    return tokenAddresses[token] || token;
  };

  // Sync component BTC address state with store state
  useEffect(() => {
    if (exchangeStore.btcDestinationAddress !== btcDestinationAddress) {
      setBtcDestinationAddress(exchangeStore.btcDestinationAddress || '');
    }
  }, [exchangeStore.btcDestinationAddress, btcDestinationAddress]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validation and debouncing logic
  const validateAmount = (value) => {
    if (!value || value.trim() === '') {
      setInputError('');
      return false;
    }

    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue <= 0) {
      setInputError('Please enter a valid amount');
      return false;
    }

    if (numValue < 0.001) {
      setInputError('Minimum amount is 0.001');
      return false;
    }

    if (numValue > 10) {
      setInputError('Maximum amount is 10 for demo purposes');
      return false;
    }

    setInputError('');
    return true;
  };

  // Bitcoin address validation (supports mainnet, testnet, and regtest)
  const validateBtcAddress = (address) => {
    if (!address || address.trim() === '') {
      setBtcAddressError('BTC destination address is required');
      return false;
    }

    // Bitcoin address validation (mainnet, testnet, regtest)
    const btcAddressRegex = /^(bc1|[13]|tb1|[2mn]|bcrt1|[2n])[a-zA-HJ-NP-Z0-9]{25,87}$/;
    
    if (!btcAddressRegex.test(address.trim())) {
      setBtcAddressError('Please enter a valid Bitcoin address');
      return false;
    }

    setBtcAddressError('');
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsDebouncing(true);
    
    // Set new timer for debounced validation
    debounceTimer.current = setTimeout(() => {
      validateAmount(value);
      setIsDebouncing(false);
    }, 300);
  };

  const handleBtcAddressChange = (e) => {
    const value = e.target.value;
    setBtcDestinationAddress(value);
    
    // Also update the store to keep them in sync
    exchangeStore.btcDestinationAddress = value;
    
    // Validate immediately for better UX
    if (value.trim() !== '') {
      validateBtcAddress(value);
    } else {
      setBtcAddressError('');
    }
  };

  // Determine button state and text
  const getButtonState = () => {
    const isConnected = walletService.isConnected();
    const hasAmount = amount && amount.trim() !== '';
    const hasValidAmount = hasAmount && !inputError && !isDebouncing;
    const needsBtcAddress = toToken === 'BTC';
    const hasBtcAddress = needsBtcAddress ? btcDestinationAddress.trim() !== '' : true;
    const hasValidBtcAddress = needsBtcAddress ? !btcAddressError && hasBtcAddress : true;
    const isQuoting = exchangeStore.swapStatus === 'QUOTING';
    const hasQuote = exchangeStore.swapStatus === 'QUOTED';
    const isProcessing = exchangeStore.isProcessing;

    if (!isConnected) {
      return {
        text: 'Connect Wallet First',
        disabled: true,
        variant: 'default'
      };
    }

    if (!hasAmount) {
      return {
        text: 'Enter an amount',
        disabled: true,
        variant: 'default'
      };
    }

    if (!hasValidAmount || isDebouncing) {
      return {
        text: 'Validating...',
        disabled: true,
        variant: 'default'
      };
    }

    if (needsBtcAddress && !hasBtcAddress) {
      return {
        text: 'Enter BTC Address',
        disabled: true,
        variant: 'default'
      };
    }

    if (needsBtcAddress && !hasValidBtcAddress) {
      return {
        text: 'Invalid BTC Address',
        disabled: true,
        variant: 'default'
      };
    }

    if (isQuoting) {
      return {
        text: 'Getting Quote...',
        disabled: true,
        variant: 'default',
        showSpinner: true
      };
    }

    if (hasQuote) {
      return {
        text: 'Confirm Swap',
        disabled: false,
        variant: 'confirm'
      };
    }

    if (isProcessing) {
      return {
        text: 'Processing...',
        disabled: true,
        variant: 'default',
        showSpinner: true
      };
    }

    return {
      text: 'Get Quote',
      disabled: false,
      variant: 'default'
    };
  };

  const handleButtonClick = async () => {
    const buttonState = getButtonState();
    
    if (buttonState.disabled) return;

    if (exchangeStore.swapStatus === 'QUOTED') {
      // Confirm swap
      await exchangeStore.initiateBtcSwap();
    } else {
      // Get quote
      // Format request to match backend QuoteRequest structure  
      const params = {
        fromChainId: 80002, // Polygon Amoy
        fromTokenAddress: getTokenAddress(fromToken), // ETH address
        toChainId: 0, // Bitcoin (non-EVM)
        toTokenAddress: toToken, // "BTC"
        amount: (parseFloat(amount) * 1e18).toString(), // Convert to wei for ETH
        btcDestinationAddress: toToken === 'BTC' ? btcDestinationAddress.trim() : undefined
      };
      
      await exchangeStore.fetchQuote(params);
    }
  };

  const buttonState = getButtonState();

  return (
    <QuickActionsContainer>
      <h3>Swap Tokens</h3>
      
      <FormRow>
        <TokenSelect ref={fromDropdownRef} onClick={() => setShowFromDropdown(!showFromDropdown)}>
          <span>{fromToken}</span>
          <span>▼</span>
          {showFromDropdown && (
            <TokenDropdown>
              {tokens.map(token => (
                <TokenOption 
                  key={token}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFromToken(token);
                    setShowFromDropdown(false);
                  }}
                >
                  {token}
                </TokenOption>
              ))}
            </TokenDropdown>
          )}
        </TokenSelect>
        
        <ArrowIcon>→</ArrowIcon>
        
        <TokenSelect ref={toDropdownRef} onClick={() => setShowToDropdown(!showToDropdown)}>
          <span>{toToken}</span>
          <span>▼</span>
          {showToDropdown && (
            <TokenDropdown>
              {tokens.map(token => (
                <TokenOption 
                  key={token}
                  onClick={(e) => {
                    e.stopPropagation();
                    setToToken(token);
                    setShowToDropdown(false);
                  }}
                >
                  {token}
                </TokenOption>
              ))}
            </TokenDropdown>
          )}
        </TokenSelect>
      </FormRow>

      <FormRow>
        <div style={{ flex: 1 }}>
          <Input 
            type="number" 
            placeholder="0.01" 
            value={amount}
            onChange={handleAmountChange}
            hasError={!!inputError}
            step="0.001"
            min="0.001"
            max="10"
          />
          {inputError && <ErrorMessage>{inputError}</ErrorMessage>}
        </div>
        
        <ActionButton 
          onClick={handleButtonClick}
          disabled={buttonState.disabled}
          variant={buttonState.variant}
        >
          {buttonState.showSpinner && <Spinner />}
          {buttonState.text}
        </ActionButton>
      </FormRow>

      {/* BTC Destination Address Field - Only show when converting to BTC */}
      {toToken === 'BTC' && (
        <FormRow>
          <div style={{ flex: 1 }}>
            <div style={{ 
              marginBottom: '12px', 
              fontSize: '14px', 
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>📱 Where will you receive your Bitcoin?</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const testAddress = 'bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn';
                    setBtcDestinationAddress(testAddress);
                    exchangeStore.btcDestinationAddress = testAddress;
                    // Clear any validation errors
                    setBtcAddressError('');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  title="Use your regtest Bitcoin address for local testing"
                >
                  🧪 Use Test Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowWalletGuide(true)}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  💡 Need Help?
                </button>
              </div>
            </div>
            <Input 
              type="text" 
              placeholder="Paste your Bitcoin address here (bc1/1/3 for mainnet, bcrt1 for regtest)" 
              value={btcDestinationAddress}
              onChange={handleBtcAddressChange}
              hasError={!!btcAddressError}
              style={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            {btcAddressError && <ErrorMessage>{btcAddressError}</ErrorMessage>}
            {!btcAddressError && btcDestinationAddress && (
              <div style={{ 
                fontSize: '12px', 
                color: '#10b981', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ✓ Valid Bitcoin address
              </div>
            )}
            <div style={{ 
              fontSize: '11px', 
              color: '#888', 
              marginTop: '6px',
              lineHeight: '1.4'
            }}>
              {btcDestinationAddress && btcDestinationAddress.startsWith('bcrt1') ? (
                <span>🧪 <strong>Using regtest address</strong> - Perfect for local Bitcoin node testing!</span>
              ) : (
                <span>💡 <strong>Testing locally?</strong> Click "🧪 Use Test Address" or "💡 Need Help?" for wallet options</span>
              )}
            </div>
          </div>
        </FormRow>
      )}
      
      {/* Bitcoin Wallet Guide Modal */}
      <BitcoinWalletGuide 
        isOpen={showWalletGuide} 
        onClose={() => setShowWalletGuide(false)} 
      />
    </QuickActionsContainer>
  );
});

export default QuickActionsSection;