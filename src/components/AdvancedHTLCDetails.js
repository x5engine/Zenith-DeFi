import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const AdvancedContainer = styled.div`
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
`;

const AdvancedTitle = styled.h4`
  color: #8b5cf6;
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HTLCStep = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: ${props => props.active ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.active ? '#8b5cf6' : '#333'};
  border-radius: 8px;
  ${props => props.completed && `
    background: rgba(16, 185, 129, 0.1);
    border-color: #10b981;
  `}
  ${props => props.error && `
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
  `}
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 8px;
`;

const StepTitle = styled.span`
  color: ${props => props.completed ? '#10b981' : props.active ? '#8b5cf6' : '#666'};
  font-weight: 600;
  flex: 1;
`;

const StepStatus = styled.span`
  color: ${props => props.completed ? '#10b981' : props.active ? '#8b5cf6' : '#666'};
  font-size: 11px;
`;

const TechnicalDetail = styled.div`
  color: #999;
  margin: 4px 0;
`;

const CodeBlock = styled.div`
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px;
  margin: 4px 0;
  overflow-x: auto;
  font-size: 11px;
`;

const AdvancedHTLCDetails = observer(({ exchangeStore }) => {
  const getStepStatus = (step) => {
    const status = exchangeStore.swapStatus;
    
    switch (step) {
      case 'secret':
        return status !== 'IDLE' ? 'completed' : 'pending';
      case 'btc_htlc':
        return ['QUOTED', 'INITIATED', 'BTC_CONFIRMED', 'EVM_ESCROWED', 'COMPLETED'].includes(status) ? 'completed' : 
               status === 'QUOTING' ? 'active' : 'pending';
      case 'btc_deposit':
        return ['BTC_CONFIRMED', 'EVM_ESCROWED', 'COMPLETED'].includes(status) ? 'completed' : 
               status === 'INITIATED' ? 'active' : 'pending';
      case 'evm_escrow':
        return ['EVM_ESCROWED', 'COMPLETED'].includes(status) ? 'completed' : 
               status === 'BTC_CONFIRMED' ? 'active' : 'pending';
      case 'secret_reveal':
        return status === 'COMPLETED' ? 'completed' : 
               status === 'EVM_ESCROWED' ? 'active' : 'pending';
      case 'btc_claim':
        return status === 'COMPLETED' ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const formatHash = (hash) => {
    if (!hash) return 'Not generated';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const formatAddress = (address) => {
    if (!address) return 'Not generated';
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  return (
    <AdvancedContainer>
      <AdvancedTitle>
        🔧 HTLC Technical Details
        <span style={{ fontSize: '11px', color: '#666', fontWeight: 'normal' }}>
          (Hash Time Locked Contracts)
        </span>
      </AdvancedTitle>

      <HTLCStep completed={getStepStatus('secret') === 'completed'}>
        <StepHeader>
          <StepTitle completed={getStepStatus('secret') === 'completed'}>
            1. Secret Generation
          </StepTitle>
          <StepStatus completed={getStepStatus('secret') === 'completed'}>
            {getStepStatus('secret') === 'completed' ? '✓ DONE' : '⏳ PENDING'}
          </StepStatus>
        </StepHeader>
        <TechnicalDetail>
          Secret Hash: <CodeBlock>{formatHash(exchangeStore.swapId || 'Awaiting generation...')}</CodeBlock>
        </TechnicalDetail>
        <TechnicalDetail>
          Lock Time: <CodeBlock>24 hours (144 blocks)</CodeBlock>
        </TechnicalDetail>
      </HTLCStep>

      <HTLCStep 
        completed={getStepStatus('btc_htlc') === 'completed'}
        active={getStepStatus('btc_htlc') === 'active'}
      >
        <StepHeader>
          <StepTitle 
            completed={getStepStatus('btc_htlc') === 'completed'}
            active={getStepStatus('btc_htlc') === 'active'}
          >
            2. Bitcoin HTLC Creation
          </StepTitle>
          <StepStatus 
            completed={getStepStatus('btc_htlc') === 'completed'}
            active={getStepStatus('btc_htlc') === 'active'}
          >
            {getStepStatus('btc_htlc') === 'completed' ? '✓ DONE' : 
             getStepStatus('btc_htlc') === 'active' ? '🔄 ACTIVE' : '⏳ PENDING'}
          </StepStatus>
        </StepHeader>
        <TechnicalDetail>
          BTC Deposit Address: <CodeBlock>{formatAddress(exchangeStore.btcDepositAddress || 'Generating...')}</CodeBlock>
        </TechnicalDetail>
        <TechnicalDetail>
          Script Type: <CodeBlock>P2WSH (Witness Script Hash)</CodeBlock>
        </TechnicalDetail>
      </HTLCStep>

      <HTLCStep 
        completed={getStepStatus('btc_deposit') === 'completed'}
        active={getStepStatus('btc_deposit') === 'active'}
      >
        <StepHeader>
          <StepTitle 
            completed={getStepStatus('btc_deposit') === 'completed'}
            active={getStepStatus('btc_deposit') === 'active'}
          >
            3. Bitcoin Deposit Detection
          </StepTitle>
          <StepStatus 
            completed={getStepStatus('btc_deposit') === 'completed'}
            active={getStepStatus('btc_deposit') === 'active'}
          >
            {getStepStatus('btc_deposit') === 'completed' ? '✓ DONE' : 
             getStepStatus('btc_deposit') === 'active' ? '🔍 MONITORING' : '⏳ WAITING'}
          </StepStatus>
        </StepHeader>
        <TechnicalDetail>
          Required Confirmations: <CodeBlock>1 block</CodeBlock>
        </TechnicalDetail>
        <TechnicalDetail>
          BTC TxHash: <CodeBlock>{formatHash(exchangeStore.btcTxHash || 'Awaiting deposit...')}</CodeBlock>
        </TechnicalDetail>
      </HTLCStep>

      <HTLCStep 
        completed={getStepStatus('evm_escrow') === 'completed'}
        active={getStepStatus('evm_escrow') === 'active'}
      >
        <StepHeader>
          <StepTitle 
            completed={getStepStatus('evm_escrow') === 'completed'}
            active={getStepStatus('evm_escrow') === 'active'}
          >
            4. EVM Escrow Creation
          </StepTitle>
          <StepStatus 
            completed={getStepStatus('evm_escrow') === 'completed'}
            active={getStepStatus('evm_escrow') === 'active'}
          >
            {getStepStatus('evm_escrow') === 'completed' ? '✓ DONE' : 
             getStepStatus('evm_escrow') === 'active' ? '🔄 PROCESSING' : '⏳ WAITING'}
          </StepStatus>
        </StepHeader>
        <TechnicalDetail>
          Contract: <CodeBlock>FusionBtcSettlement.sol</CodeBlock>
        </TechnicalDetail>
        <TechnicalDetail>
          EVM TxHash: <CodeBlock>{formatHash(exchangeStore.evmTxHash || 'Awaiting transaction...')}</CodeBlock>
        </TechnicalDetail>
      </HTLCStep>

      <HTLCStep 
        completed={getStepStatus('secret_reveal') === 'completed'}
        active={getStepStatus('secret_reveal') === 'active'}
      >
        <StepHeader>
          <StepTitle 
            completed={getStepStatus('secret_reveal') === 'completed'}
            active={getStepStatus('secret_reveal') === 'active'}
          >
            5. Secret Reveal & Claim
          </StepTitle>
          <StepStatus 
            completed={getStepStatus('secret_reveal') === 'completed'}
            active={getStepStatus('secret_reveal') === 'active'}
          >
            {getStepStatus('secret_reveal') === 'completed' ? '✓ DONE' : 
             getStepStatus('secret_reveal') === 'active' ? '🔍 MONITORING' : '⏳ WAITING'}
          </StepStatus>
        </StepHeader>
        <TechnicalDetail>
          User Claims: <CodeBlock>ETH/tokens from Polygon escrow</CodeBlock>
        </TechnicalDetail>
        <TechnicalDetail>
          Event: <CodeBlock>SecretRevealed(bytes32 secret)</CodeBlock>
        </TechnicalDetail>
      </HTLCStep>

      <HTLCStep 
        completed={getStepStatus('btc_claim') === 'completed'}
      >
        <StepHeader>
          <StepTitle completed={getStepStatus('btc_claim') === 'completed'}>
            6. Bitcoin Redemption
          </StepTitle>
          <StepStatus completed={getStepStatus('btc_claim') === 'completed'}>
            {getStepStatus('btc_claim') === 'completed' ? '✓ DONE' : '⏳ FINAL STEP'}
          </StepStatus>
        </StepHeader>
        <TechnicalDetail>
          Resolver Redeems: <CodeBlock>BTC using revealed secret</CodeBlock>
        </TechnicalDetail>
        <TechnicalDetail>
          User Receives: <CodeBlock>BTC at destination address</CodeBlock>
        </TechnicalDetail>
      </HTLCStep>

      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '11px', color: '#666' }}>
        💡 <strong>HTLC Flow:</strong> Atomic swaps use cryptographic proofs to ensure both parties receive their tokens or both transactions fail. The secret acts as the key that unlocks both sides of the trade.
      </div>
    </AdvancedContainer>
  );
});

export default AdvancedHTLCDetails;