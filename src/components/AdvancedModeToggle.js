import React, { useState } from 'react';
import styled from 'styled-components';

const AdvancedToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: rgba(52, 52, 52, 0.9);
    border-color: #8b5cf6;
  }

  ${props => props.advancedMode && `
    background: rgba(139, 92, 246, 0.2);
    border-color: #8b5cf6;
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
  `}
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 32px;
  height: 18px;
  background: ${props => props.isOn ? '#8b5cf6' : '#666'};
  border-radius: 9px;
  transition: background 0.2s ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isOn ? '16px' : '2px'};
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    transition: left 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const AdvancedLabel = styled.span`
  font-weight: 500;
  margin-left: 2px;
  font-size: 11px;
`;

const AdvancedModeToggle = ({ advancedMode, onToggle }) => {
  const handleToggle = () => {
    onToggle(!advancedMode);
  };

  return (
    <AdvancedToggleContainer 
      onClick={handleToggle}
      advancedMode={advancedMode}
      title={advancedMode ? 'Switch to simple view' : 'Show HTLC technical details'}
    >
      <span style={{ fontSize: '10px' }}>🔧</span>
      <ToggleSwitch isOn={advancedMode} />
      <AdvancedLabel>
        {advancedMode ? 'Advanced' : 'Simple'}
      </AdvancedLabel>
    </AdvancedToggleContainer>
  );
};

export default AdvancedModeToggle;