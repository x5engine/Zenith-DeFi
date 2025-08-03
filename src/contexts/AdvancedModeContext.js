import React, { createContext, useContext, useState } from 'react';

const AdvancedModeContext = createContext();

export const useAdvancedMode = () => {
  const context = useContext(AdvancedModeContext);
  if (!context) {
    throw new Error('useAdvancedMode must be used within an AdvancedModeProvider');
  }
  return context;
};

export const AdvancedModeProvider = ({ children }) => {
  const [advancedMode, setAdvancedMode] = useState(false);

  return (
    <AdvancedModeContext.Provider value={{ advancedMode, setAdvancedMode }}>
      {children}
    </AdvancedModeContext.Provider>
  );
};

export default AdvancedModeContext;