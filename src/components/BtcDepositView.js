import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';
import styled from 'styled-components';
import QRCode from 'qrcode';

const DepositContainer = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 32px;
  margin-top: 24px;
  border: 1px solid #444;
  text-align: center;
`;

const DepositTitle = styled.h2`
  color: #f59e0b;
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
`;

const InstructionStep = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  border-left: 4px solid #f59e0b;
  text-align: left;
`;

const StepTitle = styled.h3`
  color: #f59e0b;
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
`;

const StepText = styled.p`
  color: #fff;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
`;

const QrCodeContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 24px auto;
  display: inline-block;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const AddressSection = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin: 24px 0;
  border: 1px solid #444;
`;

const AddressLabel = styled.label`
  display: block;
  color: #ccc;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: left;
`;

const AddressDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #000;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 12px;
`;

const AddressText = styled.code`
  flex: 1;
  color: #8b5cf6;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
  text-align: left;
`;

const CopyButton = styled.button`
  background: ${props => props.copied ? '#10b981' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)'};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TimerContainer = styled.div`
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const TimerText = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const TimerValue = styled.span`
  color: #fbbf24;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: 700;
`;

const WarningBox = styled.div`
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  text-align: left;
`;

const WarningTitle = styled.h4`
  color: #dc2626;
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
`;

const WarningList = styled.ul`
  color: #fff;
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
`;

const BtcDepositView = observer(() => {
  const { exchangeStore } = useStores();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  const { btcDepositAddress, quote } = exchangeStore;
  const amount = quote?.fromAmount || '0.001';

  // Generate QR code
  useEffect(() => {
    if (btcDepositAddress) {
      const qrText = `bitcoin:${btcDepositAddress}?amount=${amount}`;
      QRCode.toDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(url => {
        setQrCodeDataUrl(url);
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [btcDepositAddress, amount]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Copy to clipboard functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(btcDepositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = btcDepositAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!btcDepositAddress) {
    return null;
  }

  return (
    <DepositContainer>
      <DepositTitle>📤 Send Bitcoin</DepositTitle>

      {/* Timer */}
      <TimerContainer>
        <span>⏰</span>
        <TimerText>Time remaining:</TimerText>
        <TimerValue>{formatTime(timeLeft)}</TimerValue>
      </TimerContainer>

      {/* Instructions */}
      <InstructionStep>
        <StepTitle>Step 1: Send EXACTLY {amount} BTC</StepTitle>
        <StepText>
          Send precisely <strong>{amount} BTC</strong> to the address below. 
          Sending more or less will cause the swap to fail.
        </StepText>
      </InstructionStep>

      <InstructionStep>
        <StepTitle>Step 2: DO NOT close this window</StepTitle>
        <StepText>
          Keep this page open to monitor your transaction. We'll automatically 
          detect your deposit and proceed with the swap.
        </StepText>
      </InstructionStep>

      {/* QR Code */}
      {qrCodeDataUrl && (
        <QrCodeContainer>
          <img src={qrCodeDataUrl} alt="Bitcoin Address QR Code" />
          <div style={{ marginTop: '12px', color: '#666', fontSize: '12px' }}>
            Scan with your Bitcoin wallet
          </div>
        </QrCodeContainer>
      )}

      {/* Address Display */}
      <AddressSection>
        <AddressLabel>Bitcoin Address (Testnet)</AddressLabel>
        <AddressDisplay>
          <AddressText>{btcDepositAddress}</AddressText>
          <CopyButton onClick={handleCopy} copied={copied}>
            {copied ? (
              <>
                ✓ Copied!
              </>
            ) : (
              <>
                📋 Copy
              </>
            )}
          </CopyButton>
        </AddressDisplay>
      </AddressSection>

      {/* Warning Box */}
      <WarningBox>
        <WarningTitle>⚠️ Important Reminders</WarningTitle>
        <WarningList>
          <li>This address is for <strong>single use only</strong> - do not send funds to it again</li>
          <li>Send from a wallet you control, not from an exchange</li>
          <li>Use Bitcoin <strong>testnet</strong> - this is for testing purposes only</li>
          <li>Transaction may take 10-30 minutes to confirm on the blockchain</li>
          <li>The swap will expire in {formatTime(timeLeft)} if no deposit is received</li>
        </WarningList>
      </WarningBox>

      {timeLeft === 0 && (
        <div style={{
          background: 'rgba(220, 38, 38, 0.2)',
          border: '2px solid #dc2626',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0'
        }}>
          <h3 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>
            ⏰ Time Expired
          </h3>
          <p style={{ color: '#fff', margin: '0' }}>
            This swap has expired. Please start a new swap to continue.
          </p>
        </div>
      )}
    </DepositContainer>
  );
});

export default BtcDepositView;