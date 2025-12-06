import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  ShieldCheckIcon, 
  BoltIcon,
  CubeIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-br from-primary-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-900 dark:text-slate-100 mb-2">
              Entro<span className="bg-gradient-to-r from-primary-500 to-cyan-500 dark:from-cyan-400 dark:to-cyan-600 bg-clip-text text-transparent">FHE</span>
            </h1>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-primary-900 dark:text-slate-100 mb-6 leading-tight">
            Encrypted Randomness
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-cyan-400 dark:to-primary-400 bg-clip-text text-transparent">
              For Your dApps
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-primary-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get cryptographically secure, encrypted entropy using Fully Homomorphic Encryption. 
            Perfect for lotteries, NFT minting, gaming, and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link
              to="/examples"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 dark:bg-cyan-600 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-cyan-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              <SparklesIcon className="h-6 w-6" />
              <span>Try Live Examples</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white dark:bg-slate-800 text-primary-700 dark:text-cyan-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-semibold text-lg border-2 border-primary-300 dark:border-cyan-700"
            >
              <BookOpenIcon className="h-6 w-6" />
              <span>View Documentation</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-500 dark:text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>Only 0.00001 ETH per request</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>Sepolia Testnet</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>Fully Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            Why Choose Entrofhe?
          </h2>
          <p className="text-xl text-primary-600 dark:text-slate-400 max-w-2xl mx-auto">
            Built with cutting-edge FHE technology for maximum security and privacy
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">FHE Encryption</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Seeds and entropy remain encrypted on-chain using Fully Homomorphic Encryption
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <BoltIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Ultra Low Cost</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Only 0.00001 ETH per request - the most affordable entropy solution
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <CodeBracketIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Easy Integration</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Simple interface - just import and call. Works with any Solidity contract
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <GlobeAltIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">On-Chain Only</h3>
            <p className="text-primary-600 dark:text-slate-400">
              No external dependencies. All randomness generated from blockchain data
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-primary-600 dark:text-slate-400">
              Simple, secure, and fast entropy generation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Request Entropy</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                Call requestEntropy() with a unique tag and pay 0.00001 ETH
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Seed Collection</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                System collects internal seeds from blockchain data
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Chaos Generation</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                Logistic map function generates entropy while encrypted
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Get Result</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                Receive encrypted entropy (euint64) ready for FHE operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            Use Cases
          </h2>
          <p className="text-xl text-primary-600 dark:text-slate-400">
            Perfect for a wide range of blockchain applications
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/examples"
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-cyan-900/50 transition">
              <TrophyIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Lottery Systems</h3>
            <p className="text-primary-600 dark:text-slate-400 mb-4">
              Fair winner selection using encrypted entropy for transparent lotteries
            </p>
            <span className="text-primary-600 dark:text-cyan-400 font-semibold flex items-center space-x-1">
              <span>Try Example</span>
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
          <Link
            to="/examples"
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-cyan-900/50 transition">
              <CubeIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">NFT Minting</h3>
            <p className="text-primary-600 dark:text-slate-400 mb-4">
              Random trait selection for NFTs with IPFS metadata support
            </p>
            <span className="text-primary-600 dark:text-cyan-400 font-semibold flex items-center space-x-1">
              <span>Try Example</span>
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
          <Link
            to="/examples"
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-cyan-900/50 transition">
              <SparklesIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Random Numbers</h3>
            <p className="text-primary-600 dark:text-slate-400 mb-4">
              Generate encrypted random numbers for gaming and applications
            </p>
            <span className="text-primary-600 dark:text-cyan-400 font-semibold flex items-center space-x-1">
              <span>Try Example</span>
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-slate-800 dark:to-slate-900 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">0.00001 ETH</div>
              <div className="text-primary-100 dark:text-slate-300">Per Request</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Sepolia</div>
              <div className="text-primary-100 dark:text-slate-300">Testnet</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">FHE</div>
              <div className="text-primary-100 dark:text-slate-300">Encrypted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-primary-100 dark:text-slate-300">Unlimited</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            Get Started
          </h2>
          <p className="text-xl text-primary-600 dark:text-slate-400">
            Explore examples, read docs, or scan the network
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/examples"
            className="bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-primary-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-cyan-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <CubeIcon className="h-10 w-10 text-primary-600 dark:text-cyan-400" />
              <ArrowRightIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-2">Live Examples</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Try our deployed example contracts: Lottery, Random Numbers, and NFT Minting
            </p>
          </Link>
          <Link
            to="/docs"
            className="bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-primary-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-cyan-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <BookOpenIcon className="h-10 w-10 text-primary-600 dark:text-cyan-400" />
              <ArrowRightIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-2">Documentation</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Complete integration guide, API reference, and code examples
            </p>
          </Link>
          <Link
            to="/scan"
            className="bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-primary-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-cyan-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="h-10 w-10 text-primary-600 dark:text-cyan-400" />
              <ArrowRightIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-2">Entropy Scan</h3>
            <p className="text-primary-600 dark:text-slate-400">
              View all entropy requests on the network in real-time
            </p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-slate-800 dark:to-slate-900 rounded-3xl text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build?
          </h2>
          <p className="text-xl text-primary-100 dark:text-slate-300 mb-8">
            Start integrating encrypted entropy into your dApp today. It only takes a few lines of code.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/examples"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg shadow-lg"
            >
              <SparklesIcon className="h-6 w-6" />
              <span>Try Examples</span>
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-semibold text-lg"
            >
              <BookOpenIcon className="h-6 w-6" />
              <span>Read Docs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contract Info */}
      <section className="py-8 bg-gray-50 dark:bg-slate-900 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-4 text-center">Contract Addresses</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="font-semibold text-primary-700 dark:text-cyan-400 mb-1">EntropyOracle</div>
              <div className="font-mono text-primary-600 dark:text-slate-300 break-all">
                0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="font-semibold text-primary-700 dark:text-cyan-400 mb-1">Network</div>
              <div className="text-primary-600 dark:text-slate-300">
                Sepolia Testnet (Chain ID: 11155111)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

