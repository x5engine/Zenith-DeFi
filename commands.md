# 🛠️ Useful Commands for Zenith DeFi Development

## 🟡 Bitcoin Commands (Regtest)

### Check BTC Balance
```bash
# Check balance for your destination address
bitcoin-cli -regtest getreceivedbyaddress bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn

# Check full wallet balance
bitcoin-cli -regtest getbalance
```

### Transaction Management
```bash
# View recent transactions
bitcoin-cli -regtest listtransactions

# Generate more test BTC (mine 10 blocks to your address)
bitcoin-cli -regtest generatetoaddress 10 bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn

# Generate blocks to mature coinbase transactions
bitcoin-cli -regtest generatetoaddress 101 bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn
```

### Network Info
```bash
# Check blockchain info
bitcoin-cli -regtest getblockchaininfo

# Get network info
bitcoin-cli -regtest getnetworkinfo

# List unspent outputs
bitcoin-cli -regtest listunspent
```

## 🔧 Backend Commands

### Start/Stop Backend
```bash
cd backend

# Start backend in background
nohup ./test-backend > backend.log 2>&1 &

# Check if backend is running
curl -s http://localhost:8080/quote > /dev/null && echo "✅ Backend is responding!" || echo "❌ Backend not responding"

# Kill backend process
lsof -i :8080 -t | xargs kill -9
```

### Build Backend
```bash
cd backend

# Rebuild backend
go build -o test-backend .

# Clean and rebuild
go clean && go build -o test-backend .
```

### Monitor Backend
```bash
cd backend

# View live backend logs
tail -f backend.log

# View last 50 lines of logs
tail -n 50 backend.log

# Search logs for errors
grep -i error backend.log
```

## 📡 API Testing

### Quote Endpoint
```bash
# Test quote endpoint
curl -X POST http://localhost:8080/quote \
  -H "Content-Type: application/json" \
  -d '{
    "fromChainId": 80002,
    "fromTokenAddress": "0x0000000000000000000000000000000000000000",
    "toChainId": 0,
    "toTokenAddress": "BTC",
    "amount": "10000000000000000",
    "btcDestinationAddress": "bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn"
  }'
```

### Swap Status
```bash
# Check swap status (replace SWAP_ID with actual ID)
curl -s http://localhost:8080/swap/status/SWAP_ID | jq .
```

## 🌐 Frontend Commands

### Development
```bash
# Start frontend development server
npm start

# Install dependencies
npm install

# Check for linting errors
npm run lint
```

### Package Management
```bash
# Install specific packages
npm install react-app-rewired framer-motion react-hot-toast qrcode.react --save

# Install development dependencies
npm install react-app-rewired --save-dev
```

## 🔍 System Monitoring

### Process Management
```bash
# Find processes using port 8080
lsof -i :8080

# Kill all processes on port 8080
lsof -i :8080 -t | xargs kill -9

# Check running background jobs
jobs

# View system processes
ps aux | grep test-backend
```

### Network Testing
```bash
# Test local connectivity
ping localhost

# Check port availability
netstat -tlnp | grep :8080

# Test HTTP endpoints
curl -I http://localhost:8080
curl -I http://localhost:3000
```

## 🧪 Demo/Testing Addresses

### Bitcoin Regtest Addresses
```
Test Address: bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn
```

### Ethereum Addresses (Demo)
```
Demo Wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### Network Configurations
```
Bitcoin Regtest RPC: localhost:18443
Polygon Amoy RPC: https://rpc-amoy.polygon.technology/
Polygon Amoy Chain ID: 80002
```

## 🚨 Troubleshooting

### Common Issues
```bash
# Backend port already in use
lsof -i :8080 -t | xargs kill -9

# Frontend build issues
rm -rf node_modules package-lock.json && npm install

# Bitcoin node not responding
bitcoin-cli -regtest getblockchaininfo

# Clear browser cache and localStorage
# Open DevTools → Application → Storage → Clear Storage
```

### Environment Reset
```bash
# Reset backend environment
cd backend && rm -f backend.log test-backend && go build -o test-backend .

# Reset frontend
rm -rf node_modules .next && npm install

# Restart Bitcoin regtest node
bitcoin-cli -regtest stop
bitcoind -regtest -daemon
```

## 📊 Monitoring Scripts

### Quick Health Check
```bash
#!/bin/bash
echo "🔍 System Health Check"
echo "====================="
echo "Bitcoin Node: $(bitcoin-cli -regtest getblockchaininfo | jq -r '.chain // "❌ Not running"')"
echo "Backend: $(curl -s http://localhost:8080/quote > /dev/null && echo "✅ Running" || echo "❌ Not running")"
echo "Frontend: $(curl -s http://localhost:3000 > /dev/null && echo "✅ Running" || echo "❌ Not running")"
echo "BTC Balance: $(bitcoin-cli -regtest getreceivedbyaddress bcrt1q7dp2ceypu7695utwjwzs3qs2nqxt4060a7yymn) BTC"
```

### Log Monitoring
```bash
# Monitor all logs simultaneously
tail -f backend/backend.log & 
echo "Monitoring backend logs... Press Ctrl+C to stop"
```

---

## 🎯 Quick Development Workflow

1. **Start Bitcoin Node:** `bitcoind -regtest -daemon`
2. **Start Backend:** `cd backend && nohup ./test-backend > backend.log 2>&1 &`
3. **Start Frontend:** `npm start`
4. **Monitor:** `tail -f backend/backend.log`
5. **Test:** Generate BTC, create swap, check balance

---

*📝 Keep this file updated as you add more commands and workflows!*