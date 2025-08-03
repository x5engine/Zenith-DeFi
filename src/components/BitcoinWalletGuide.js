import React, { useState } from 'react';
import styled from 'styled-components';

const GuideOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
`;

const GuideModal = styled.div`
  background: #2a2a2a;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #444;
  animation: slideUp 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const GuideHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const GuideTitle = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #fff;
  }
`;

const WalletSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  color: #8b5cf6;
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
`;

const WalletOption = styled.div`
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  &:hover {
    border-color: #8b5cf6;
  }
`;

const WalletName = styled.div`
  color: #fff;
  font-weight: 600;
  margin-bottom: 4px;
`;

const WalletDescription = styled.div`
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
`;

const WalletLink = styled.a`
  color: #8b5cf6;
  text-decoration: none;
  font-size: 12px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AddressExample = styled.div`
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px;
  margin: 16px 0;
  font-family: monospace;
  font-size: 12px;
`;

const ExampleTitle = styled.div`
  color: #8b5cf6;
  margin-bottom: 8px;
  font-weight: 600;
`;

const ExampleAddress = styled.div`
  color: #10b981;
  margin-bottom: 4px;
`;

const ExampleNote = styled.div`
  color: #888;
  font-size: 11px;
`;

const Warning = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
  color: #fff;
  font-size: 14px;
`;

const BitcoinWalletGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <GuideOverlay onClick={onClose}>
      <GuideModal onClick={(e) => e.stopPropagation()}>
        <GuideHeader>
          <GuideTitle>📱 Where to Get Your Bitcoin Address</GuideTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </GuideHeader>

        <WalletSection>
          <SectionTitle>🏆 Recommended: Personal Wallets</SectionTitle>
          
          <WalletOption>
            <WalletName>📱 Mobile Wallets</WalletName>
            <WalletDescription>
              Easy to use on your phone. Download from official app stores.
            </WalletDescription>
            <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
              <WalletLink href="https://bluewallet.io/" target="_blank">BlueWallet</WalletLink>
              <WalletLink href="https://blockstream.com/green/" target="_blank">Green Wallet</WalletLink>
              <WalletLink href="https://samouraiwallet.com/" target="_blank">Samourai</WalletLink>
            </div>
          </WalletOption>

          <WalletOption>
            <WalletName>💻 Desktop Wallets</WalletName>
            <WalletDescription>
              Full-featured wallets for your computer. More control and features.
            </WalletDescription>
            <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
              <WalletLink href="https://electrum.org/" target="_blank">Electrum</WalletLink>
              <WalletLink href="https://bitcoin.org/en/download" target="_blank">Bitcoin Core</WalletLink>
              <WalletLink href="https://wasabiwallet.io/" target="_blank">Wasabi</WalletLink>
            </div>
          </WalletOption>

          <WalletOption>
            <WalletName>🔒 Hardware Wallets (Most Secure)</WalletName>
            <WalletDescription>
              Physical devices that store your Bitcoin offline. Best for large amounts.
            </WalletDescription>
            <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
              <WalletLink href="https://ledger.com/" target="_blank">Ledger</WalletLink>
              <WalletLink href="https://trezor.io/" target="_blank">Trezor</WalletLink>
              <WalletLink href="https://coldcard.com/" target="_blank">Coldcard</WalletLink>
            </div>
          </WalletOption>
        </WalletSection>

        <WalletSection>
          <SectionTitle>🧪 Local Development & Testing</SectionTitle>
          
          <WalletOption>
            <WalletName>🔧 Bitcoin Core Regtest Mode</WalletName>
            <WalletDescription>
              Running a local Bitcoin node for development? You already have a regtest address!
              Your address: <code style={{background: '#0a0a0a', padding: '2px 4px', borderRadius: '3px', fontSize: '11px'}}>bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn</code>
            </WalletDescription>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981' }}>
              ✅ Perfect for testing this demo! Click "🧪 Use Test Address" to auto-fill.
            </div>
          </WalletOption>

          <WalletOption>
            <WalletName>🌐 Bitcoin Testnet</WalletName>
            <WalletDescription>
              Want to test with real testnet Bitcoin? Use any wallet in "testnet mode" to get addresses starting with "tb1" or "2".
            </WalletDescription>
            <div style={{ marginTop: '8px' }}>
              <WalletLink href="https://testnet.help/" target="_blank">Get Testnet Bitcoin</WalletLink>
            </div>
          </WalletOption>
        </WalletSection>

        <WalletSection>
          <SectionTitle>⚠️ Exchange Wallets (Use Carefully)</SectionTitle>
          
          <WalletOption>
            <WalletName>🏦 Cryptocurrency Exchanges</WalletName>
            <WalletDescription>
              You can get a Bitcoin address from exchanges, but you don't fully control it.
              Only use for small amounts you plan to trade soon.
            </WalletDescription>
            <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
              <WalletLink href="https://coinbase.com/" target="_blank">Coinbase</WalletLink>
              <WalletLink href="https://binance.com/" target="_blank">Binance</WalletLink>
              <WalletLink href="https://kraken.com/" target="_blank">Kraken</WalletLink>
            </div>
          </WalletOption>
        </WalletSection>

        <AddressExample>
          <ExampleTitle>Bitcoin Address Examples:</ExampleTitle>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#f59e0b', marginBottom: '4px', fontWeight: '600' }}>🧪 Regtest (Local Testing):</div>
            <ExampleAddress>bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn</ExampleAddress>
            <ExampleNote>↑ Your local regtest address (starts with "bcrt1")</ExampleNote>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#8b5cf6', marginBottom: '4px', fontWeight: '600' }}>🌐 Mainnet (Real Bitcoin):</div>
            <ExampleAddress>bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4</ExampleAddress>
            <ExampleNote>↑ Bech32 address (modern, starts with "bc1")</ExampleNote>
            
            <ExampleAddress>1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</ExampleAddress>
            <ExampleNote>↑ Legacy address (older, starts with "1")</ExampleNote>
            
            <ExampleAddress>3FuP6XVvzaWbokKxo9nJqF2YWNPbYXGRJv</ExampleAddress>
            <ExampleNote>↑ Script address (starts with "3")</ExampleNote>
          </div>
          
          <div>
            <div style={{ color: '#10b981', marginBottom: '4px', fontWeight: '600' }}>🧪 Testnet (Test Bitcoin):</div>
            <ExampleAddress>tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zar</ExampleAddress>
            <ExampleNote>↑ Testnet address (starts with "tb1" or "2")</ExampleNote>
          </div>
        </AddressExample>

        <Warning>
          <strong>⚠️ Important:</strong> Always double-check your Bitcoin address before submitting! 
          Bitcoin transactions cannot be reversed. Never share your private keys or seed phrase.
        </Warning>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Got it! Let me get my wallet
          </button>
        </div>
      </GuideModal>
    </GuideOverlay>
  );
};

export default BitcoinWalletGuide;