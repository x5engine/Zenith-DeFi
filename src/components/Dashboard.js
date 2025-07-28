import React from 'react';
import styled from 'styled-components';
import StatusSection from './dashboard/StatusSection';
import TransactionsSection from './dashboard/TransactionsSection';
import QuickActionsSection from './dashboard/QuickActionsSection';
import TokenList from './dashboard/TokenList';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto auto auto;
  gap: 20px;
  height: 100%;
`;

const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <MainGrid>
        <StatusSection />
        <TransactionsSection />
        <QuickActionsSection />
      </MainGrid>
      
      <SidePanel>
        <TokenList />
      </SidePanel>
    </DashboardContainer>
  );
};

export default Dashboard; 