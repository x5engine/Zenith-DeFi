import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';
import styled from 'styled-components';

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
  const [inputError, setInputError] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  
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

  // Determine button state and text
  const getButtonState = () => {
    const isConnected = walletService.isConnected();
    const hasAmount = amount && amount.trim() !== '';
    const hasValidAmount = hasAmount && !inputError && !isDebouncing;
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
        amount: (parseFloat(amount) * 1e18).toString() // Convert to wei for ETH
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
            min="0"
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
    </QuickActionsContainer>
  );
});

export default QuickActionsSection;