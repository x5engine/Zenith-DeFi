import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';
import styled from 'styled-components';

const StatusContainer = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  border: 1px solid #444;
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 20px;
`;

const TimelineStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
`;

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  ${props => {
    if (props.state === 'complete') {
      return `
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: 2px solid #10b981;
      `;
    } else if (props.state === 'active') {
      return `
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: white;
        border: 2px solid #8b5cf6;
        animation: pulse 2s ease-in-out infinite;
      `;
    } else {
      return `
        background: #444;
        color: #888;
        border: 2px solid #555;
      `;
    }
  }}

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const StepLine = styled.div`
  position: absolute;
  left: 19px;
  top: 40px;
  width: 2px;
  height: 40px;
  background: ${props => props.completed ? '#10b981' : '#555'};
  transition: background-color 0.3s ease;
`;

const StepContent = styled.div`
  flex: 1;
  padding-top: 8px;
`;

const StepTitle = styled.h4`
  margin: 0 0 8px 0;
  color: ${props => {
    if (props.state === 'complete') return '#10b981';
    if (props.state === 'active') return '#8b5cf6';
    return '#ccc';
  }};
  font-size: 16px;
  font-weight: 600;
  transition: color 0.3s ease;
`;

const StepDescription = styled.p`
  margin: 0;
  color: ${props => props.state === 'active' ? '#fff' : '#aaa'};
  font-size: 14px;
  line-height: 1.5;
  transition: color 0.3s ease;
`;

const ExplorerLink = styled.a`
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  
  &:hover {
    color: #7c3aed;
    text-decoration: underline;
  }
`;

const ConfirmationBadge = styled.span`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
`;

const StatusSection = observer(() => {
  const { exchangeStore } = useStores();
  const { swapStatus, confirmationCount, evmTxHash, btcTxHash, statusMessage } = exchangeStore;

  // Define the timeline steps
  const getTimelineSteps = () => {
    const steps = [
      {
        id: 'deposit',
        title: 'Awaiting BTC Deposit',
        icon: '1',
        getDescription: () => 'Please send the exact BTC amount to the provided address.',
        getState: () => {
          if (['COMPLETED', 'EVM_FULFILLING', 'BTC_CONFIRMING'].includes(swapStatus)) return 'complete';
          if (swapStatus === 'PENDING_DEPOSIT') return 'active';
          return 'pending';
        }
      },
      {
        id: 'confirming',
        title: 'Confirming BTC Deposit',
        icon: '2',
        getDescription: () => {
          if (swapStatus === 'BTC_CONFIRMING') {
            return (
              <span>
                Deposit seen! Waiting for confirmations: 
                <ConfirmationBadge>{confirmationCount || 0} / 3</ConfirmationBadge>
                {btcTxHash && (
                  <ExplorerLink 
                    href={`https://mempool.space/testnet/tx/${btcTxHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on Block Explorer ↗
                  </ExplorerLink>
                )}
              </span>
            );
          }
          return 'Bitcoin transaction will be monitored for confirmations.';
        },
        getState: () => {
          if (['COMPLETED', 'EVM_FULFILLING'].includes(swapStatus)) return 'complete';
          if (swapStatus === 'BTC_CONFIRMING') return 'active';
          return 'pending';
        }
      },
      {
        id: 'fulfilling',
        title: 'Fulfilling on Polygon',
        icon: '3',
        getDescription: () => {
          if (swapStatus === 'EVM_FULFILLING') {
            return (
              <span>
                BTC locked. Finalizing your swap on Polygon...
                {evmTxHash && (
                  <ExplorerLink 
                    href={`https://amoy.polygonscan.com/tx/${evmTxHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View EVM Transaction ↗
                  </ExplorerLink>
                )}
              </span>
            );
          }
          return 'Your tokens will be delivered to your wallet.';
        },
        getState: () => {
          if (swapStatus === 'COMPLETED') return 'complete';
          if (swapStatus === 'EVM_FULFILLING') return 'active';
          return 'pending';
        }
      },
      {
        id: 'complete',
        title: 'Swap Complete',
        icon: '✓',
        getDescription: () => 'Success! Your swap is complete.',
        getState: () => {
          if (swapStatus === 'COMPLETED') return 'complete';
          return 'pending';
        }
      }
    ];

    return steps;
  };

  const steps = getTimelineSteps();

  // Don't show if no swap is initiated
  if (!exchangeStore.swapId && swapStatus === 'IDLE') {
    return null;
  }

  return (
    <StatusContainer>
      <h3>Swap Progress</h3>
      
      {statusMessage && (
        <div style={{
          background: '#1a1a1a',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #444',
          marginBottom: '20px'
        }}>
          <span style={{ color: '#8b5cf6', fontWeight: '500' }}>Current Status: </span>
          <span style={{ color: '#fff' }}>{statusMessage}</span>
        </div>
      )}

      <TimelineContainer>
        {steps.map((step, index) => {
          const state = step.getState();
          const isLastStep = index === steps.length - 1;
          
          return (
            <TimelineStep key={step.id}>
              <div style={{ position: 'relative' }}>
                <StepIcon state={state}>
                  {step.icon}
                </StepIcon>
                {!isLastStep && (
                  <StepLine completed={state === 'complete'} />
                )}
              </div>
              
              <StepContent>
                <StepTitle state={state}>
                  {step.title}
                </StepTitle>
                <StepDescription state={state}>
                  {typeof step.getDescription === 'function' ? step.getDescription() : step.getDescription}
                </StepDescription>
              </StepContent>
            </TimelineStep>
          );
        })}
      </TimelineContainer>
      
      {swapStatus === 'ERROR' && (
        <div style={{
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid #dc2626',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '20px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>
            ⚠️ Swap Failed
          </h4>
          <p style={{ margin: '0', color: '#fff', fontSize: '14px' }}>
            {statusMessage || 'An error occurred during the swap process. Please try again or contact support.'}
          </p>
        </div>
      )}
    </StatusContainer>
  );
});

export default StatusSection;