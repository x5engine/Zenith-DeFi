import React, { createContext, useContext } from 'react';
import RootStore from './RootStore';

// Create the store context
const StoreContext = createContext(null);

// Store provider component
export const StoreProvider = ({ children }) => {
  const store = new RootStore();
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook to use the store
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};

// Hook to use specific stores
export const useStateChannelStore = () => {
  const store = useStore();
  return store.stateChannelStore;
};

export const useOneInchStore = () => {
  const store = useStore();
  return store.oneInchStore;
};

export const useExchangeStore = () => {
  const store = useStore();
  return store.exchangeStore;
}; 