import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const ChainIndicatorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => props.isCorrectNetwork ? 'linear-gradient(135deg, #00d4aa, #00a693)' : 'linear-gradient(135deg, #ff6b6b, #ee5a52)'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid ${props => props.isCorrectNetwork ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .chain-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isCorrectNetwork ? '#ffffff' : '#ffeb3b'};
    animation: ${props => props.isCorrectNetwork ? 'none' : 'pulse 2s infinite'};
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  .chain-name {
    font-size: 12px;
    opacity: 0.9;
  }
`;

const TARGET_CHAIN_ID = '0x13882'; // Polygon Amoy (new testnet)

const networkNames = {
  '0x1': 'Ethereum Mainnet',
  '0x89': 'Polygon Mainnet',
  '0x13881': 'Polygon Mumbai (Deprecated)',
  '0x13882': 'Polygon Amoy',
  '0x539': 'Local Testnet'
};

const ChainIndicator = () => {
  const [chainInfo, setChainInfo] = useState({
    id: null,
    name: 'Unknown',
    isCorrectNetwork: false
  });

  const updateChainInfo = useCallback(async () => {
    if (!window.ethereum) {
      setChainInfo({
        id: null,
        name: 'No Wallet',
        isCorrectNetwork: false
      });
      return;
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainName = networkNames[chainId] || `Unknown (${chainId})`;
      const isCorrectNetwork = chainId === TARGET_CHAIN_ID;

      setChainInfo({
        id: chainId,
        name: chainName,
        isCorrectNetwork
      });
    } catch (error) {
      console.error('Error getting chain info:', error);
      setChainInfo({
        id: null,
        name: 'Error',
        isCorrectNetwork: false
      });
    }
  }, []);

  useEffect(() => {
    updateChainInfo();

    // Listen for chain changes
    if (window.ethereum) {
      const handleChainChanged = () => {
        updateChainInfo();
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', updateChainInfo);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', updateChainInfo);
      };
    }
  }, [updateChainInfo]);

  const handleClick = async () => {
    if (!chainInfo.isCorrectNetwork && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TARGET_CHAIN_ID }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: TARGET_CHAIN_ID,
                  chainName: 'Polygon Amoy',
                  rpcUrls: [
                    'https://rpc-amoy.polygon.technology/',
                    'https://rpc.ankr.com/polygon_amoy'
                  ],
                  nativeCurrency: { 
                    name: 'POL', 
                    symbol: 'POL', 
                    decimals: 18 
                  },
                  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
                },
              ],
            });
            console.log('✅ Polygon Amoy added successfully');
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        } else {
          console.error('Failed to switch network:', switchError);
        }
      }
    }
  };

  return (
    <ChainIndicatorContainer 
      isCorrectNetwork={chainInfo.isCorrectNetwork}
      onClick={handleClick}
      title={chainInfo.isCorrectNetwork ? 'Connected to correct network' : 'Click to switch to Polygon Amoy'}
    >
      <div className="chain-info">
        <div className="status-dot"></div>
        <div>
          <div>{chainInfo.isCorrectNetwork ? '✅' : '⚠️'} {chainInfo.name}</div>
          {!chainInfo.isCorrectNetwork && (
            <div className="chain-name">Click to switch</div>
          )}
        </div>
      </div>
    </ChainIndicatorContainer>
  );
};

export default ChainIndicator;