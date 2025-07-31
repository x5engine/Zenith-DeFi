# 1inch Fusion+ Bitcoin Resolver dApp Implementation

This implementation provides a complete frontend dApp for the 1inch Fusion+ Native Bitcoin Resolver backend, built according to the technical specification in `TECHNICAL.md` and refined according to `RefinementChanges2.md`.

## 🏗️ Architecture Overview

The implementation follows a **centralized MobX state management architecture** with clean separation of concerns:

- **`ExchangeStore`**: Single source of truth for all swap-related logic and data
- **`ApiService`**: Stateless service for network communication with backend
- **`WalletService`**: Stateless service for Web3 wallet interactions
- **`StatusSection`**: Reactive component for detailed swap progress tracking
- **`SwapInterface`**: Main UI component for swap interactions

## 📁 File Structure

```
src/
├── stores/
│   ├── ExchangeStore.js       # ✅ Centralized swap state management
│   ├── RootStore.js           # ✅ Main store with dependency injection
│   └── StoreContext.js        # ✅ MobX store context
├── services/
│   ├── ApiService.js          # ✅ Stateless network communication
│   └── WalletService.js       # ✅ Stateless Web3 wallet management
├── components/
│   ├── SwapInterface.js       # ✅ Main swap UI component
│   └── dashboard/
│       └── StatusSection.js   # ✅ Reactive status timeline
└── App.js                     # ✅ Updated with new architecture

public/
└── (standalone.html removed)  # ✅ Focused on React-only implementation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or another Web3 wallet extension

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

## 🔧 Configuration

### Backend URL

The default backend URL is set to `http://localhost:8080`. To change this:

Update the URL in `src/stores/RootStore.js`:
```javascript
this.apiService = new ApiService('YOUR_BACKEND_URL');
```

## 🎯 Usage

### 1. Connect Wallet

Click the "Connect Wallet" button to connect your MetaMask or other Web3 wallet.

### 2. Select Tokens

Choose the source and destination tokens from the dropdown menus:
- **From**: Select the token you want to swap from (e.g., BTC)
- **To**: Select the token you want to swap to (e.g., ETH on Arbitrum)

### 3. Enter Amount

Input the amount you want to swap in the amount field.

### 4. Get Quote

Click "Get Quote" to fetch a quote from the backend. The system will:
- Send a quote request to the backend
- Display the quote details (rate, fees, estimated time)
- Show a "Confirm Swap" button

### 5. Confirm Swap

Click "Confirm Swap" to initiate the swap. The system will:
- Generate a BTC refund public key using EIP-191 signature
- Send the swap initiation request to the backend
- Receive a BTC deposit address
- Display QR code and instructions for BTC deposit

### 6. Send Bitcoin

Follow the instructions to send the exact BTC amount to the provided address. The system will:
- Poll the swap status every 15 seconds
- Update the UI with real-time progress
- Show completion status when the swap is finished

## 🔄 Swap Flow

The complete swap flow follows this sequence:

1. **Quote Request** → Backend returns quote details
2. **User Confirmation** → User reviews and confirms quote
3. **BTC Key Generation** → EIP-191 signature-based key derivation
4. **Swap Initiation** → Backend generates BTC deposit address
5. **BTC Deposit** → User sends BTC to the provided address
6. **Status Polling** → Frontend monitors swap progress
7. **Completion** → Swap completes on destination chain

## 🛠️ API Endpoints

The dApp communicates with the backend through these endpoints:

- `POST /quote` - Get swap quote
- `POST /swap/initiate` - Initiate swap
- `GET /swap/status/{swapId}` - Get swap status

## 🎨 UI Features

### Reactive Architecture
- **MobX Integration**: Automatic reactivity with `@observable` properties
- **Real-time Updates**: UI automatically updates when state changes
- **Clean Separation**: Business logic in stores, UI in components

### Status Timeline
- **Visual Progress**: Multi-step timeline showing swap progress
- **Real-time Updates**: Live status updates with confirmation counts
- **Professional Design**: Clean, modern interface

### Security Features
- **EIP-191 Signatures**: Secure key generation using ethers.js
- **Non-custodial**: User maintains control of their keys
- **Deterministic**: Same signature always generates same key
- **Browser-compatible**: Uses ethers.js instead of Bitcoin-specific libraries

## 🔍 Debugging

### Console Logs

The implementation includes comprehensive logging:
- API requests and responses
- Wallet connection status
- Swap state changes
- Error messages

### Network Tab

Monitor network requests in your browser's developer tools to see:
- Quote requests
- Swap initiation requests
- Status polling requests

## 🧪 Testing

### Mock Backend

For testing without a backend, you can modify the `ApiService` to return mock responses:

```javascript
// In ApiService.js
async getQuote(quoteRequest) {
    // Mock response for testing
    return {
        quoteId: 'mock-quote-123',
        fromAmount: '0.1',
        fromToken: 'BTC',
        toAmount: '1.5',
        toToken: 'ETH',
        rate: '15.0',
        fee: '0.001',
        estimatedTime: '~10-15 minutes'
    };
}
```

## 🔒 Security Considerations

- **EIP-191 Signatures**: Uses domain-specific messages to prevent replay attacks
- **Deterministic Key Generation**: Same user signature always generates same BTC key
- **Non-custodial**: User's private keys never leave their wallet
- **Address Validation**: Always verify BTC addresses before sending funds
- **Error Handling**: Comprehensive error handling throughout the application

## 📝 Customization

### Adding New Tokens

To add new tokens, update the token options in `SwapInterface.js`:

```javascript
const [swapParams, setSwapParams] = useState({
  fromToken: 'BTC',
  toToken: 'ETH',
  amount: '0.1'
});
```

### Styling

The application uses styled-components for styling. Customize the theme by modifying the styled components in each file.

## 🐛 Troubleshooting

### Common Issues

1. **Wallet not connecting**: Ensure MetaMask is installed and unlocked
2. **Network errors**: Check that the backend is running on the correct URL
3. **Quote failures**: Verify the backend is properly configured
4. **Status polling issues**: Check network connectivity

### Error Messages

The application provides user-friendly error messages for common issues:
- Wallet connection failures
- Network request errors
- Invalid swap parameters
- Backend service errors

## 📚 Dependencies

- **mobx**: State management
- **mobx-react-lite**: React integration
- **ethers.js**: Web3 library for wallet interactions and key generation
- **qrcode**: QR code generation for BTC addresses
- **React**: Frontend framework
- **styled-components**: CSS-in-JS styling

## 🤝 Contributing

To extend the implementation:

1. Follow the existing MobX architecture patterns
2. Add comprehensive error handling
3. Include proper TypeScript types (if migrating to TypeScript)
4. Add unit tests for new functionality
5. Update documentation for new features

## 📄 License

This implementation follows the same license as the main project.

## 🔄 Architecture Changes

This implementation incorporates the four strategic refinements from `RefinementChanges2.md`:

1. **Centralized MobX Store**: Replaced service-based state management with reactive MobX store
2. **Removed Standalone HTML**: Focused exclusively on React implementation
3. **EIP-191 BTC Key Generation**: Secure, deterministic key derivation
4. **Enhanced UX for Async Processes**: Detailed status timeline with real-time updates 