import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';
import styled from 'styled-components';
import QuickActionsSection from './QuickActionsSection';
import StatusSection from './StatusSection';
import BtcDepositView from './BtcDepositView';
import { useToast } from './ToastProvider';

const SwapContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(139, 92, 246, 0.2);
`;

const Title = styled.h1`
  text-align: center;
  color: #fff;
  margin: 0 0 32px 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const WalletSection = styled.div`
  margin-bottom: 24px;
`;

const WalletInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2a2a2a;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #444;
`;

const WalletAddress = styled.span`
  color: #8b5cf6;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: 500;
`;

const ConnectButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DisconnectButton = styled.button`
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    color: white;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const QuoteDisplay = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  border: 1px solid #444;
  animation: fadeInUp 0.5s ease-out forwards;
`;

const QuoteRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #444;
  
  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    color: #ccc;
    font-weight: 500;
  }

  span:last-child {
    color: #fff;
    font-weight: 600;
  }
`;

const InitiatingModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out forwards;
`;

const ModalContent = styled.div`
  background: #2a2a2a;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  max-width: 400px;
  border: 1px solid #444;
  animation: fadeInUp 0.5s ease-out forwards;
`;

const ModalTitle = styled.h2`
  color: #8b5cf6;
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
`;

const ModalMessage = styled.p`
  color: #ccc;
  margin: 0 0 32px 0;
  font-size: 16px;
  line-height: 1.5;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #444;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CompletionView = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 32px;
  margin-top: 24px;
  border: 1px solid #10b981;
  text-align: center;
  animation: fadeInUp 0.5s ease-out forwards;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 24px auto;
  animation: pulse 2s ease-in-out infinite;
`;

const SuccessTitle = styled.h2`
  color: #10b981;
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 700;
`;

const SuccessMessage = styled.p`
  color: #ccc;
  margin: 0 0 24px 0;
  font-size: 16px;
  line-height: 1.5;
`;

const NewSwapButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
`;

const SwapInterface = observer(() => {
  const { exchangeStore, walletService } = useStores();
  const toast = useToast();
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await walletService.connectWallet();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnectWallet = () => {
    walletService.disconnectWallet();
    exchangeStore.reset();
    toast.info('Wallet disconnected');
  };

  const handleNewSwap = () => {
    exchangeStore.reset();
  };

  // Handle errors with toast notifications
  useEffect(() => {
    if (exchangeStore.swapStatus === 'ERROR') {
      toast.error(exchangeStore.statusMessage || 'An error occurred during the swap process');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeStore.swapStatus, exchangeStore.statusMessage]); // Intentionally excluded toast to prevent infinite loop

  // State-driven rendering based on swapStatus
  const renderContent = () => {
    const { swapStatus } = exchangeStore;

    switch (swapStatus) {
      case 'IDLE':
      case 'QUOTING':
      case 'QUOTED':
        return (
          <div className="page-transition">
            <QuickActionsSection />
            {exchangeStore.hasQuote && (
              <QuoteDisplay>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '15px 20px',
                  borderRadius: '12px 12px 0 0',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  💱 Swap Quote
                </div>
                <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.05)' }}>
                  <QuoteRow style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    marginBottom: '15px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: '#667eea' }}>You Pay:</span>
                    <span>{exchangeStore.quote.fromAmount} {exchangeStore.quote.fromToken}</span>
                  </QuoteRow>
                  <QuoteRow style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    marginBottom: '15px',
                    background: 'rgba(118, 75, 162, 0.1)',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: '#764ba2' }}>You Receive:</span>
                    <span>{exchangeStore.quote.toAmount} {exchangeStore.quote.toToken}</span>
                  </QuoteRow>
                  <QuoteRow>
                    <span>Exchange Rate:</span>
                    <span>1 {exchangeStore.quote.fromToken} = {exchangeStore.quote.rate} {exchangeStore.quote.toToken}</span>
                  </QuoteRow>
                  <QuoteRow>
                    <span>Network Fee:</span>
                    <span>{exchangeStore.quote.fee} {exchangeStore.quote.feeToken}</span>
                  </QuoteRow>
                  <QuoteRow>
                    <span>⏱️ Estimated Time:</span>
                    <span>{exchangeStore.quote.estimatedTime}</span>
                  </QuoteRow>
                </div>
              </QuoteDisplay>
            )}
          </div>
        );

      case 'INITIATING':
        return (
          <InitiatingModal>
            <ModalContent>
              <ModalTitle>Preparing Your Swap</ModalTitle>
              <ModalMessage>
                Contacting resolver to prepare your Bitcoin swap. 
                This will only take a moment...
              </ModalMessage>
              <Spinner />
            </ModalContent>
          </InitiatingModal>
        );

      case 'PENDING_DEPOSIT':
        return (
          <div className="page-transition">
            <BtcDepositView />
            <StatusSection />
          </div>
        );

      case 'BTC_CONFIRMING':
      case 'EVM_FULFILLING':
        return (
          <div className="page-transition">
            <StatusSection />
          </div>
        );

      case 'COMPLETED':
        return (
          <div className="page-transition">
            <CompletionView>
              <SuccessIcon>✅</SuccessIcon>
              <SuccessTitle>Swap Completed!</SuccessTitle>
              <SuccessMessage>
                Your Bitcoin has been successfully swapped. The tokens have been 
                delivered to your wallet.
              </SuccessMessage>
              <StatusSection />
              <NewSwapButton onClick={handleNewSwap}>
                Start New Swap
              </NewSwapButton>
            </CompletionView>
          </div>
        );

      case 'ERROR':
        return (
          <div className="page-transition">
            <div style={{ 
              background: 'linear-gradient(135deg, #dc3545, #c82333)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center', 
              marginBottom: '20px',
              border: '1px solid rgba(220, 53, 69, 0.3)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>⚠️ Swap Failed</h3>
              <p style={{ margin: '0 0 15px 0', opacity: 0.9 }}>
                {exchangeStore.statusMessage || 'An error occurred during the swap process'}
              </p>
              <button
                onClick={handleNewSwap}
                style={{
                  background: 'white',
                  color: '#dc3545',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔄 Start New Swap
              </button>
            </div>
            <QuickActionsSection />
          </div>
        );

      default:
        return (
          <div className="page-transition">
            <QuickActionsSection />
          </div>
        );
    }
  };

  return (
    <div>
      <SwapContainer>
        <Title>1INCH FUSION+ BITCOIN RESOLVER</Title>
        
        {/* Wallet Connection Section */}
        <WalletSection>
          {!walletService.isConnected() ? (
            <ConnectButton onClick={handleConnectWallet}>
              Connect Wallet
            </ConnectButton>
          ) : (
            <WalletInfo className="animate-fadeIn">
              <WalletAddress>
                Connected: {walletService.getConnectedAddress()?.slice(0, 6)}...{walletService.getConnectedAddress()?.slice(-4)}
              </WalletAddress>
              <DisconnectButton onClick={handleDisconnectWallet}>
                Disconnect
              </DisconnectButton>
            </WalletInfo>
          )}
        </WalletSection>

        {/* State-driven content */}
        {walletService.isConnected() && renderContent()}
      </SwapContainer>

      {/* Global loading overlay for processing states */}
      {exchangeStore.isProcessing && exchangeStore.swapStatus !== 'INITIATING' && (
        <LoadingOverlay>
          <div style={{ textAlign: 'center' }}>
            <Spinner style={{ marginBottom: '16px' }} />
            <div>Processing swap...</div>
          </div>
        </LoadingOverlay>
      )}
    </div>
  );
});

export default SwapInterface;