import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreContext';
import styled from 'styled-components';

const StatusContainer = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;

const StatusTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
`;

const StatusTimeline = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TimelineItem = styled.li`
  position: relative;
  padding: 16px 0 16px 40px;
  border-left: 2px solid #555;
  margin-left: 20px;
  
  &:before {
    content: '';
    position: absolute;
    left: -8px;
    top: 20px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${props => {
      if (props.status === 'complete') return '#28a745';
      if (props.status === 'active') return '#007bff';
      return '#555';
    }};
    border: 2px solid #2a2a2a;
  }
  
  &:last-child {
    border-left: none;
  }
  
  ${props => props.status === 'complete' && `
    border-left-color: #28a745;
  `}
  
  ${props => props.status === 'active' && `
    border-left-color: #007bff;
  `}
`;

const StepTitle = styled.strong`
  display: block;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const StepDescription = styled.p`
  color: #cccccc;
  font-size: 0.9rem;
  margin: 0;
`;

const ConfirmationCount = styled.span`
  color: #007bff;
  font-weight: 600;
`;

const StatusMessage = styled.div`
  background: #3a3a3a;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  border-left: 4px solid #007bff;
`;

const StatusSection = observer(() => {
  const { exchangeStore } = useStores();

  const getStepClass = (currentStatus, stepStatus) => {
    const statusOrder = ['IDLE', 'QUOTING', 'QUOTED', 'INITIATING', 'PENDING_DEPOSIT', 'CONFIRMED', 'EVM_FULFILLED', 'COMPLETED'];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (currentIndex === -1 || stepIndex === -1) return 'pending';
    
    if (currentIndex > stepIndex) return 'complete';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  const getStepDescription = (stepStatus) => {
    switch (stepStatus) {
      case 'PENDING_DEPOSIT':
        return exchangeStore.swapStatus === 'PENDING_DEPOSIT' 
          ? exchangeStore.statusMessage 
          : 'Completed';
      case 'CONFIRMED':
        return exchangeStore.swapStatus === 'CONFIRMED' 
          ? `Confirming... (${exchangeStore.confirmationCount}/3)` 
          : 'Pending';
      case 'EVM_FULFILLED':
        return exchangeStore.swapStatus === 'EVM_FULFILLED' 
          ? 'Processing...' 
          : 'Pending';
      case 'COMPLETED':
        return exchangeStore.swapStatus === 'COMPLETED' 
          ? 'Success!' 
          : 'Pending';
      default:
        return 'Pending';
    }
  };

  const steps = [
    {
      status: 'PENDING_DEPOSIT',
      title: 'Step 1: Awaiting Deposit',
      description: getStepDescription('PENDING_DEPOSIT')
    },
    {
      status: 'CONFIRMED',
      title: 'Step 2: Bitcoin Confirmation',
      description: getStepDescription('CONFIRMED')
    },
    {
      status: 'EVM_FULFILLED',
      title: 'Step 3: Fulfilling on EVM Chain',
      description: getStepDescription('EVM_FULFILLED')
    },
    {
      status: 'COMPLETED',
      title: 'Step 4: Swap Complete',
      description: getStepDescription('COMPLETED')
    }
  ];

  return (
    <StatusContainer>
      <StatusTitle>Swap Progress</StatusTitle>
      
      {exchangeStore.swapStatus !== 'IDLE' ? (
        <>
          <StatusTimeline>
            {steps.map((step, index) => (
              <TimelineItem 
                key={index}
                status={getStepClass(exchangeStore.swapStatus, step.status)}
              >
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>
                  {step.status === 'CONFIRMED' && exchangeStore.swapStatus === 'CONFIRMED' ? (
                    <>
                      Confirming... (<ConfirmationCount>{exchangeStore.confirmationCount}</ConfirmationCount>/3)
                    </>
                  ) : (
                    step.description
                  )}
                </StepDescription>
              </TimelineItem>
            ))}
          </StatusTimeline>
          
          <StatusMessage>
            <strong>Current Status:</strong> {exchangeStore.statusMessage}
          </StatusMessage>
        </>
      ) : (
        <StepDescription>
          No active swap. Start a new swap to see progress here.
        </StepDescription>
      )}
    </StatusContainer>
  );
});

export default StatusSection; 