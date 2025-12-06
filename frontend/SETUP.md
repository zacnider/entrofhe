# Frontend Setup Instructions

## Required Environment Variables

Create a `.env` file in the `frontend` directory with:

```env
REACT_APP_ENTROPY_ORACLE_ADDRESS=0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361
REACT_APP_CHAOS_ENGINE_ADDRESS=0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020
REACT_APP_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Getting WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Sign up / Log in
3. Create a new project
4. Copy the Project ID
5. Add it to your `.env` file

## Running the Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

The frontend will open at http://localhost:3000

## Troubleshooting

- If you see WalletConnect errors, make sure you have a valid Project ID
- Make sure you're connected to Sepolia testnet
- Check browser console for detailed error messages

