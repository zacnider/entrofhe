# EntroFHE Backend Server

Backend server for running Hardhat test/compile/verify operations.

## 🚀 Quick Start

### Local Development

```bash
cd backend
npm install
npm start
```

Server will run on `http://localhost:3001`

### Environment Variables

Create a `.env` file:

```env
PORT=3001
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
PRIVATE_KEY=your_private_key (optional, for deployment)
```

## 📡 API Endpoints

### POST /api/test

Run Hardhat tests for an example.

**Request:**
```json
{
  "examplePath": "basic-simplecounter"
}
```

**Response:**
```json
{
  "success": true,
  "stdout": "...",
  "stderr": ""
}
```

### POST /api/compile

Compile contracts for an example.

**Request:**
```json
{
  "examplePath": "basic-simplecounter",
  "contractName": "EntropyCounter"
}
```

**Response:**
```json
{
  "success": true,
  "stdout": "...",
  "stderr": "",
  "bytecode": "0x...",
  "abi": [...]
}
```

### POST /api/verify

Verify a contract on Etherscan.

**Request:**
```json
{
  "examplePath": "basic-simplecounter",
  "contractAddress": "0x...",
  "network": "sepolia",
  "constructorArgs": []
}
```

**Response:**
```json
{
  "success": true,
  "stdout": "...",
  "stderr": ""
}
```

## 🚢 Deployment

### Railway.app

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set Root Directory to `backend`
5. Add environment variables
6. Deploy!

### Render.com

1. Go to [Render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy!

## 🔧 Frontend Integration

Update `frontend/src/hooks/useExampleAPI.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const callAPI = async (endpoint: string, body: any) => {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  // ...
};
```

Add to `frontend/.env`:

```env
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

## 📝 Notes

- Dependencies are installed on first request (cached after)
- Hardhat tests can take up to 2 minutes
- Compile can take up to 2 minutes
- Verify can take up to 2 minutes

