import React from 'react';
import styled from 'styled-components';
import { StoreProvider } from './stores/StoreContext';
import { ToastProvider } from './components/ToastProvider';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChainIndicator from './components/ChainIndicator';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #1a1a1a;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <AppContainer>
          <Sidebar />
          <MainContent>
            <Header />
            <ContentArea>
              <Dashboard />
            </ContentArea>
          </MainContent>
          <ChainIndicator />
        </AppContainer>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App; 