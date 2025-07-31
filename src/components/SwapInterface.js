import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';
import styled from 'styled-components';
import QRCode from 'qrcode';

const SwapContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 32px;
  margin: 20px auto;
  max-width: 600px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  overflow: hidden;
`;

const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SwapForm = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const TokenSelect = styled.div`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 16px;
  color: white;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: #666;
    background: #333;
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
`;

const TokenOption = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #333;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const TokenText = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const ChevronIcon = styled.span`
  color: #888;
  font-size: 12px;
`;

const ArrowIcon = styled.div`
  color: #666;
  font-size: 20px;
  font-weight: bold;
`;

const Input = styled.input`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 16px;
  color: white;
  flex: 1;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    background: #333;
  }
  
  &::placeholder {
    color: #888;
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? '#007bff' : '#444'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? '#0056b3' : '#555'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #333;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConnectButton = styled(Button)`
  background: #444;
  margin-bottom: 24px;
  
  &:hover {
    background: #555;
  }
`;

const DisconnectButton = styled(Button)`
  background: #444;
  padding: 8px 16px;
  font-size: 14px;
  white-space: nowrap;
  
  &:hover {
    background: #555;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #444;
  flex-wrap: wrap;
  gap: 12px;
`;

const WalletAddress = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #ccc;
  word-break: break-all;
  flex: 1;
  min-width: 0;
`;

const QuoteCard = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid #007bff;
`;

const QuoteRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  padding: 8px 0;
  border-bottom: 1px solid #444;
  
  &:last-child {
    border-bottom: none;
  }
`;

const BtcDepositCard = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid #28a745;
`;

const AddressBox = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #444;
`;

const QrCode = styled.div`
  text-align: center;
  margin: 20px 0;
  
  img {
    max-width: 200px;
    border-radius: 12px;
    border: 2px solid #444;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const Notification = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      default: return '#17a2b8';
    }
  }};
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-size: 18px;
`;

const SwapInterface = observer(() => {
  const { exchangeStore, walletService } = useStores();
  const [notifications, setNotifications] = useState([]);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [swapParams, setSwapParams] = useState({
    fromToken: 'BTC',
    toToken: 'ETH',
    amount: '0.1'
  });
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const tokens = ['BTC', 'ETH', 'USDC'];
  const fromDropdownRef = useRef();
  const toDropdownRef = useRef();

  // Initialize wallet connection on mount
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await walletService.initializeFromStorage();
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
        setIsInitializing(false);
      }
    };

    initializeWallet();
  }, [walletService]);

  // Close dropdowns when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleConnectWallet = async () => {
    try {
      await walletService.connectWallet();
      showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
      showNotification('Failed to connect wallet: ' + error.message, 'error');
    }
  };

  const handleDisconnectWallet = () => {
    walletService.disconnectWallet();
    showNotification('Wallet disconnected successfully!', 'success');
    // Force a small delay to ensure state updates are processed
    setTimeout(() => {
      // This will trigger a re-render if needed
    }, 100);
  };

  const handleGetQuote = async () => {
    try {
      const params = {
        fromChainId: 0, // Bitcoin
        fromTokenAddress: swapParams.fromToken,
        toChainId: 42161, // Arbitrum
        toTokenAddress: swapParams.toToken === 'ETH' ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' : swapParams.toToken,
        amount: swapParams.amount
      };
      
      await exchangeStore.fetchQuote(params);
      showNotification('Quote received!', 'success');
    } catch (error) {
      showNotification('Failed to get quote: ' + error.message, 'error');
    }
  };

  const handleConfirmSwap = async () => {
    try {
      await exchangeStore.initiateBtcSwap();
      
      // Generate QR code for BTC deposit address
      if (exchangeStore.btcDepositAddress) {
        const qrCode = await QRCode.toDataURL(exchangeStore.btcDepositAddress);
        setQrCodeDataUrl(qrCode);
      }
      
      showNotification('Swap initiated! Please send BTC to the provided address.', 'success');
    } catch (error) {
      showNotification('Failed to initiate swap: ' + error.message, 'error');
    }
  };

  const copyAddress = () => {
    if (exchangeStore.btcDepositAddress) {
      navigator.clipboard.writeText(exchangeStore.btcDepositAddress);
      showNotification('Address copied to clipboard!', 'success');
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <SwapContainer>
        <Title>1INCH FUSION+ BITCOIN RESOLVER</Title>
        
        {/* Wallet Connection */}
        {isInitializing ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            Initializing wallet connection...
          </div>
        ) : !walletService.isConnected() ? (
          <ConnectButton onClick={handleConnectWallet}>Connect Wallet</ConnectButton>
        ) : (
          <WalletInfo>
            <WalletAddress>Connected: {walletService.getConnectedAddress()}</WalletAddress>
            <DisconnectButton onClick={handleDisconnectWallet}>Disconnect</DisconnectButton>
          </WalletInfo>
        )}

        {/* Swap Form */}
        <SwapForm>
          <FormRow>
            <TokenSelect ref={fromDropdownRef} onClick={() => setShowFromDropdown(!showFromDropdown)}>
              <TokenText>{swapParams.fromToken}</TokenText>
              <ChevronIcon>▼</ChevronIcon>
              {showFromDropdown && (
                <TokenDropdown>
                  {tokens.map(token => (
                    <TokenOption 
                      key={token}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSwapParams(prev => ({ ...prev, fromToken: token }));
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
              <TokenText>{swapParams.toToken}</TokenText>
              <ChevronIcon>▼</ChevronIcon>
              {showToDropdown && (
                <TokenDropdown>
                  {tokens.map(token => (
                    <TokenOption 
                      key={token}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSwapParams(prev => ({ ...prev, toToken: token }));
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
            <Input 
              type="number" 
              placeholder="Amount" 
              value={swapParams.amount}
              onChange={(e) => setSwapParams(prev => ({ ...prev, amount: e.target.value }))}
            />
            <Button 
              primary 
              onClick={handleGetQuote} 
              disabled={exchangeStore.isProcessing}
            >
              {exchangeStore.isProcessing ? 'Processing...' : 'Get Quote'}
            </Button>
          </FormRow>
        </SwapForm>

        {/* Quote Display */}
        {exchangeStore.hasQuote && (
          <QuoteCard>
            <h3>Swap Quote</h3>
            <QuoteRow>
              <span>From:</span>
              <span>{exchangeStore.quote.fromAmount} {exchangeStore.quote.fromToken}</span>
            </QuoteRow>
            <QuoteRow>
              <span>To:</span>
              <span>{exchangeStore.quote.toAmount} {exchangeStore.quote.toToken}</span>
            </QuoteRow>
            <QuoteRow>
              <span>Rate:</span>
              <span>1 {exchangeStore.quote.fromToken} = {exchangeStore.quote.rate} {exchangeStore.quote.toToken}</span>
            </QuoteRow>
            <QuoteRow>
              <span>Fee:</span>
              <span>{exchangeStore.quote.fee || '0'} {exchangeStore.quote.feeToken || exchangeStore.quote.fromToken}</span>
            </QuoteRow>
            <QuoteRow>
              <span>Estimated Time:</span>
              <span>{exchangeStore.quote.estimatedTime || '~10-15 minutes'}</span>
            </QuoteRow>
            <Button 
              primary 
              onClick={handleConfirmSwap}
              disabled={!exchangeStore.canInitiateSwap}
            >
              Confirm Swap
            </Button>
          </QuoteCard>
        )}

        {/* BTC Deposit Instructions */}
        {exchangeStore.btcDepositAddress && (
          <BtcDepositCard>
            <h3>Send Bitcoin</h3>
            <p>Please send exactly <strong>{swapParams.amount} BTC</strong> to:</p>
            <AddressBox>
              <code style={{ flex: 1, wordBreak: 'break-all' }}>
                {exchangeStore.btcDepositAddress}
              </code>
              <Button onClick={copyAddress}>
                Copy
              </Button>
            </AddressBox>
            <QrCode>
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="BTC Address QR Code" />
              ) : (
                <div style={{ 
                  width: '200px', 
                  height: '200px', 
                  background: '#444', 
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  border: '2px solid #555'
                }}>
                  QR Code
                </div>
              )}
            </QrCode>
            <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', marginTop: '16px', border: '1px solid #444' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>⚠️ Important:</p>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                <li>Send exactly the specified amount</li>
                <li>Use only the provided address</li>
                <li>Transaction may take 10-15 minutes to confirm</li>
              </ul>
            </div>
          </BtcDepositCard>
        )}
      </SwapContainer>

      {/* Loading Overlay */}
      {exchangeStore.isProcessing && (
        <LoadingOverlay>
          <div>Processing swap...</div>
        </LoadingOverlay>
      )}

      {/* Notifications */}
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification key={notification.id} type={notification.type}>
            <span>{notification.message}</span>
            <button onClick={() => removeNotification(notification.id)}>×</button>
          </Notification>
        ))}
      </NotificationContainer>
    </div>
  );
});

export default SwapInterface; 