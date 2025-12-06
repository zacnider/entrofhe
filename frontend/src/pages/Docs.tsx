import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: RocketLaunchIcon },
    { id: 'how-it-works', title: 'How It Works', icon: CpuChipIcon },
    { id: 'integration', title: 'Integration Guide', icon: CodeBracketIcon },
    { id: 'api-reference', title: 'API Reference', icon: DocumentTextIcon },
    { id: 'examples', title: 'Code Examples', icon: LightBulbIcon },
    { id: 'faq', title: 'FAQ', icon: QuestionMarkCircleIcon },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return <GettingStarted />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'integration':
        return <IntegrationGuide />;
      case 'api-reference':
        return <APIReference />;
      case 'examples':
        return <CodeExamples />;
      case 'faq':
        return <FAQ />;
      default:
        return <GettingStarted />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <BookOpenIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Documentation</h2>
              </div>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-primary-100 dark:bg-cyan-900 text-primary-900 dark:text-cyan-100 font-semibold'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Getting Started Section
const GettingStarted: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
        Getting Started
      </h1>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Welcome to Entrofhe - A Fully Homomorphic Encryption (FHE) based entropy and randomness infrastructure for blockchain applications.
      </p>
    </div>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">What is Entrofhe?</h2>
      <p className="text-gray-700 dark:text-slate-300">
        Entrofhe is an on-chain entropy oracle that provides cryptographically secure randomness using FHE technology. 
        Unlike traditional VRF (Verifiable Random Function) solutions, Entrofhe keeps seeds encrypted at all times, 
        ensuring maximum privacy and security.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Key Features</h2>
      <ul className="space-y-2 text-gray-700 dark:text-slate-300">
        <li className="flex items-start">
          <ShieldCheckIcon className="h-5 w-5 text-primary-600 dark:text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
          <span><strong>FHE-Based Privacy:</strong> Seeds and entropy remain encrypted on-chain</span>
        </li>
        <li className="flex items-start">
          <ShieldCheckIcon className="h-5 w-5 text-primary-600 dark:text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
          <span><strong>Low Cost:</strong> Only 0.00001 ETH per entropy request</span>
        </li>
        <li className="flex items-start">
          <ShieldCheckIcon className="h-5 w-5 text-primary-600 dark:text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
          <span><strong>Developer-Friendly:</strong> Simple interface for easy integration</span>
        </li>
        <li className="flex items-start">
          <ShieldCheckIcon className="h-5 w-5 text-primary-600 dark:text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
          <span><strong>On-Chain:</strong> No external dependencies or oracles</span>
        </li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Quick Start</h2>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-primary-800 dark:text-cyan-300">1. Install Dependencies</h3>
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto">
{`npm install @fhevm/solidity
npm install ethers`}
        </pre>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-primary-800 dark:text-cyan-300">2. Import Interface</h3>
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto">
{`import "./interfaces/IEntropyOracle.sol";`}
        </pre>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-primary-800 dark:text-cyan-300">3. Request Entropy</h3>
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto">
{`IEntropyOracle oracle = IEntropyOracle(0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361);
bytes32 tag = keccak256("my-unique-tag");
uint256 requestId = oracle.requestEntropy{value: 0.00001 ether}(tag);
euint64 entropy = oracle.getEncryptedEntropy(requestId);`}
        </pre>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Network Information</h2>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-200">
          <strong>Network:</strong> Sepolia Testnet (Chain ID: 11155111)
        </p>
        <p className="text-blue-800 dark:text-blue-200 mt-2">
          <strong>EntropyOracle Address:</strong> <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code>
        </p>
        <p className="text-blue-800 dark:text-blue-200 mt-2">
          <strong>Fee per Request:</strong> 0.00001 ETH (10,000,000,000,000 wei)
        </p>
      </div>
    </section>
  </div>
);

// How It Works Section
const HowItWorks: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
        How It Works
      </h1>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Understanding the architecture and flow of Entrofhe.
      </p>
    </div>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Architecture</h2>
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-slate-100">Master Seed Initialization</h3>
              <p className="text-gray-700 dark:text-slate-300">Contract owner initializes an encrypted master seed using FHEVM.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-slate-100">Entropy Request</h3>
              <p className="text-gray-700 dark:text-slate-300">Developer calls <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">requestEntropy()</code> with a unique tag and pays 0.00001 ETH fee.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-slate-100">Seed Collection</h3>
              <p className="text-gray-700 dark:text-slate-300">System collects internal seeds from blockchain data (timestamp, prevrandao, blockhash, etc.) and combines with master seed.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-slate-100">Chaos Generation</h3>
              <p className="text-gray-700 dark:text-slate-300">Logistic map function iterates on combined seeds to generate entropy, all while remaining encrypted.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-slate-100">Return Encrypted Entropy</h3>
              <p className="text-gray-700 dark:text-slate-300">Encrypted entropy (euint64) is returned and can be used in FHE operations or decrypted if needed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">FHE Technology</h2>
      <p className="text-gray-700 dark:text-slate-300">
        Entrofhe uses Zama Network's FHEVM (Fully Homomorphic Encryption Virtual Machine) to perform computations 
        on encrypted data without ever decrypting it. This ensures that:
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
        <li>Master seeds remain encrypted on-chain</li>
        <li>Entropy generation happens in encrypted form</li>
        <li>Results can be used in other FHE operations</li>
        <li>Decryption only happens when explicitly requested</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Security Model</h2>
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Internal Seeds Only</h3>
        <p className="text-green-700 dark:text-green-300">
          Entrofhe generates entropy using only on-chain data. No external oracles or user-provided seeds are used, 
          ensuring deterministic yet unpredictable randomness.
        </p>
      </div>
    </section>
  </div>
);

// Integration Guide Section
const IntegrationGuide: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
        Integration Guide
      </h1>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Step-by-step guide to integrate Entrofhe into your smart contract.
      </p>
    </div>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 1: Add Interface</h2>
      <p className="text-gray-700 dark:text-slate-300">
        Copy the <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">IEntropyOracle</code> interface to your project:
      </p>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";

interface IEntropyOracle {
    function requestEntropy(bytes32 tag) 
        external 
        payable 
        returns (uint256 requestId);
    
    function getEncryptedEntropy(uint256 requestId) 
        external 
        view 
        returns (euint64);
    
    function isRequestFulfilled(uint256 requestId) 
        external 
        view 
        returns (bool);
    
    function getRequest(uint256 requestId) 
        external 
        view 
        returns (
            address consumer,
            bytes32 tag,
            uint256 timestamp,
            bool fulfilled
        );
    
    function getFee() external pure returns (uint256);
}`}
        </pre>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 2: Import in Your Contract</h2>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "./interfaces/IEntropyOracle.sol";

contract MyDApp {
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361);
    
    uint256 public constant FEE_AMOUNT = 0.00001 ether;
    
    // Your contract code...
}`}
        </pre>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 3: Request Entropy</h2>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`function useRandomness(bytes32 uniqueTag) external payable {
    // Ensure correct fee is paid
    require(msg.value >= FEE_AMOUNT, "Insufficient fee");
    
    // Request entropy
    uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: FEE_AMOUNT}(
        uniqueTag
    );
    
    // Get encrypted entropy
    euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
    
    // Use entropy in your FHE operations
    // Example: combine with other encrypted values
    euint64 result = FHE.xor(entropy, someOtherEncryptedValue);
    
    // Your business logic here...
}`}
        </pre>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Important Notes</h2>
      <div className="space-y-3">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Fee Requirement:</strong> Always send exactly 0.00001 ETH (10,000,000,000,000 wei) when calling <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">requestEntropy()</code>
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Tag Uniqueness:</strong> Use a unique tag (e.g., <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">keccak256(abi.encodePacked(msg.sender, block.timestamp))</code>) for each request to ensure different entropy values.
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200">
            <strong>FHE Operations:</strong> Entropy is returned as <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">euint64</code> and can be used directly in FHE operations without decryption.
          </p>
        </div>
      </div>
    </section>
  </div>
);

// API Reference Section
const APIReference: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
        API Reference
      </h1>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Complete API documentation for Entrofhe contracts.
      </p>
    </div>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">IEntropyOracle Interface</h2>
      
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-primary-700 dark:text-cyan-300 mb-2">
            requestEntropy(bytes32 tag)
          </h3>
          <p className="text-gray-700 dark:text-slate-300 mb-3">
            Requests encrypted entropy from the oracle. Must be called with exactly 0.00001 ETH.
          </p>
          <div className="bg-gray-100 dark:bg-slate-800 rounded p-4 space-y-2">
            <p><strong className="text-primary-700 dark:text-cyan-300">Parameters:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>tag</code> (bytes32): Unique identifier for this request</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Returns:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>requestId</code> (uint256): Unique request identifier</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Value:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li>Must send exactly 0.00001 ETH (10,000,000,000,000 wei)</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Gas:</strong> ~200,000 - 300,000</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary-700 dark:text-cyan-300 mb-2">
            getEncryptedEntropy(uint256 requestId)
          </h3>
          <p className="text-gray-700 dark:text-slate-300 mb-3">
            Retrieves the encrypted entropy for a given request ID.
          </p>
          <div className="bg-gray-100 dark:bg-slate-800 rounded p-4 space-y-2">
            <p><strong className="text-primary-700 dark:text-cyan-300">Parameters:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>requestId</code> (uint256): Request identifier from <code>requestEntropy()</code></li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Returns:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>entropy</code> (euint64): Encrypted entropy value</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Gas:</strong> ~2,100 (view function)</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary-700 dark:text-cyan-300 mb-2">
            isRequestFulfilled(uint256 requestId)
          </h3>
          <p className="text-gray-700 dark:text-slate-300 mb-3">
            Checks if a request has been fulfilled.
          </p>
          <div className="bg-gray-100 dark:bg-slate-800 rounded p-4 space-y-2">
            <p><strong className="text-primary-700 dark:text-cyan-300">Parameters:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>requestId</code> (uint256): Request identifier</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Returns:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>fulfilled</code> (bool): True if request is fulfilled</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Gas:</strong> ~2,100 (view function)</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary-700 dark:text-cyan-300 mb-2">
            getRequest(uint256 requestId)
          </h3>
          <p className="text-gray-700 dark:text-slate-300 mb-3">
            Gets detailed information about a request.
          </p>
          <div className="bg-gray-100 dark:bg-slate-800 rounded p-4 space-y-2">
            <p><strong className="text-primary-700 dark:text-cyan-300">Parameters:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>requestId</code> (uint256): Request identifier</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Returns:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>consumer</code> (address): Address that made the request</li>
              <li><code>tag</code> (bytes32): Request tag</li>
              <li><code>timestamp</code> (uint256): Request timestamp</li>
              <li><code>fulfilled</code> (bool): Fulfillment status</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Gas:</strong> ~2,100 (view function)</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary-700 dark:text-cyan-300 mb-2">
            getFee()
          </h3>
          <p className="text-gray-700 dark:text-slate-300 mb-3">
            Returns the current fee amount required for entropy requests.
          </p>
          <div className="bg-gray-100 dark:bg-slate-800 rounded p-4 space-y-2">
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Returns:</strong></p>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-slate-300">
              <li><code>fee</code> (uint256): Fee in wei (0.00001 ETH = 10,000,000,000,000 wei)</li>
            </ul>
            <p className="mt-3"><strong className="text-primary-700 dark:text-cyan-300">Gas:</strong> ~21 (pure function)</p>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Events</h2>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-cyan-300">EntropyRequested</h3>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded mt-2 text-sm">
{`event EntropyRequested(
    uint256 indexed requestId,
    address indexed consumer,
    bytes32 tag,
    uint256 feePaid
);`}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-cyan-300">EntropyFulfilled</h3>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded mt-2 text-sm">
{`event EntropyFulfilled(
    uint256 indexed requestId,
    address indexed consumer,
    bytes32 tag
);`}
            </pre>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Contract Addresses</h2>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyOracle</h3>
            <p className="text-gray-700 dark:text-slate-300 font-mono text-sm">
              <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code>
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Main oracle contract for requesting entropy
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">FHEChaosEngine</h3>
            <p className="text-gray-700 dark:text-slate-300 font-mono text-sm">
              <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020</code>
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Core entropy generation engine (owner-only operations)
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// Code Examples Section
const CodeExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'tutorial'>('live');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
          Code Examples
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400">
          Practical examples for common use cases.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('live')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'live'
                  ? 'border-primary-500 dark:border-cyan-500 text-primary-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              Live Examples
            </button>
            <button
              onClick={() => setActiveTab('tutorial')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tutorial'
                  ? 'border-primary-500 dark:border-cyan-500 text-primary-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              Tutorial Examples
            </button>
          </nav>
        </div>
      </div>

      {/* Live Examples Tab */}
      {activeTab === 'live' && (
        <div className="space-y-6">

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Example 1: Simple Lottery</h2>
      <p className="text-gray-600 dark:text-slate-400">
        Fair winner selection using entropy. Participants enter the lottery, then entropy is used to randomly select a winner.
      </p>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "../interfaces/IEntropyOracle.sol";

contract SimpleLottery {
    IEntropyOracle public entropyOracle;
    
    // Lottery state
    address[] public participants;
    mapping(uint256 => mapping(address => bool)) public hasParticipated; // Round-based
    uint256 public winningRequestId;
    address public winner;
    bool public lotteryComplete;
    uint256 public lotteryRound; // Track lottery rounds
    
    event LotteryStarted(uint256 indexed round);
    event ParticipantAdded(address indexed participant, uint256 indexed round);
    event WinnerSelected(address indexed winner, uint256 indexed requestId, uint256 indexed round);
    event LotteryReset(uint256 indexed newRound);
    
    constructor(address _entropyOracle) {
        require(_entropyOracle != address(0), "Invalid oracle address");
        entropyOracle = IEntropyOracle(_entropyOracle);
        lotteryRound = 1;
        emit LotteryStarted(lotteryRound);
    }
    
    function enter() external {
        require(!lotteryComplete, "Lottery already complete");
        require(!hasParticipated[lotteryRound][msg.sender], "Already participated in this round");
        
        participants.push(msg.sender);
        hasParticipated[lotteryRound][msg.sender] = true;
        
        emit ParticipantAdded(msg.sender, lotteryRound);
    }
    
    function selectWinner() external payable {
        require(!lotteryComplete, "Lottery already complete");
        require(participants.length > 0, "No participants");
        require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
        
        bytes32 tag = keccak256("lottery-winner-selection");
        uint256 requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
        winningRequestId = requestId;
        
        // Simplified: Use request ID modulo participants length
        uint256 winnerIndex = requestId % participants.length;
        winner = participants[winnerIndex];
        lotteryComplete = true;
        
        emit WinnerSelected(winner, requestId, lotteryRound);
    }
    
    function getStatus() external view returns (
        uint256 participantCount,
        bool complete,
        address currentWinner
    ) {
        return (participants.length, lotteryComplete, winner);
    }
    
    function resetLottery() external {
        require(lotteryComplete, "Lottery must be complete before reset");
        
        delete participants;
        lotteryComplete = false;
        winner = address(0);
        winningRequestId = 0;
        lotteryRound++;
        
        emit LotteryReset(lotteryRound);
        emit LotteryStarted(lotteryRound);
    }
}`}
        </pre>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>💡 Live Example:</strong> Test this contract on the <a href="/examples" className="underline font-semibold">Examples page</a> (Simple Lottery).
        </p>
      </div>
    </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Example 2: Random Number Generator</h2>
      <p className="text-gray-600 dark:text-slate-400">
        Generate encrypted random numbers using entropy. Each request creates a unique encrypted random number.
      </p>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "../interfaces/IEntropyOracle.sol";

contract RandomNumberGenerator {
    IEntropyOracle public entropyOracle;
    mapping(uint256 => euint64) public randomNumbers;
    mapping(uint256 => bool) public isGenerated;
    uint256 public totalGenerated;

    constructor(address _entropyOracle) {
        require(_entropyOracle != address(0), "Invalid oracle address");
        entropyOracle = IEntropyOracle(_entropyOracle);
    }

    function requestRandomNumber(bytes32 tag) external payable returns (uint256 requestId) {
        require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
        
        requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
        
        // Get encrypted entropy
        euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
        
        // Store encrypted random number
        randomNumbers[requestId] = entropy;
        isGenerated[requestId] = true;
        totalGenerated++;
        
        emit RandomNumberRequested(requestId, tag);
        emit RandomNumberGenerated(requestId, totalGenerated);
        
        return requestId;
    }

    function getEncryptedRandomNumber(uint256 requestId) external view returns (euint64) {
        require(isGenerated[requestId], "Random number not generated");
        return randomNumbers[requestId];
    }
    
    event RandomNumberRequested(uint256 indexed requestId, bytes32 tag);
    event RandomNumberGenerated(uint256 indexed requestId, uint256 requestNumber);
}`}
        </pre>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>💡 Live Example:</strong> Test this contract on the <a href="/examples" className="underline font-semibold">Examples page</a> (Random Number Generator).
        </p>
      </div>
    </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Example 3: EntropyNFT (Real ERC721)</h2>
      <p className="text-gray-600 dark:text-slate-400">
        Mint real ERC721 NFTs with IPFS metadata and trait selection using entropy. Traits are selected from entropy and stored on-chain.
      </p>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "../interfaces/IEntropyOracle.sol";

contract EntropyNFT is ERC721, ERC721URIStorage {
    IEntropyOracle public entropyOracle;
    
    // NFT traits
    string[] public backgrounds = ["Red", "Blue", "Green", "Yellow", "Purple"];
    string[] public accessories = ["Hat", "Glasses", "Necklace", "Watch", "Ring"];
    string[] public expressions = ["Happy", "Sad", "Angry", "Surprised", "Cool"];
    
    struct NFTData {
        uint256 tokenId;
        uint256 entropyRequestId;
        uint8 backgroundIndex;
        uint8 accessoryIndex;
        uint8 expressionIndex;
        string tokenURI;
        bool minted;
    }
    
    mapping(uint256 => NFTData) public nftData;
    uint256 public nextTokenId;
    
    constructor(address _entropyOracle) ERC721("EntropyNFT", "ENTNFT") {
        entropyOracle = IEntropyOracle(_entropyOracle);
        nextTokenId = 1;
    }
    
    function requestMint(bytes32 tag) external payable returns (uint256 tokenId, uint256 requestId) {
        require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
        
        tokenId = nextTokenId++;
        requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
        
        nftData[tokenId] = NFTData({
            tokenId: tokenId,
            entropyRequestId: requestId,
            backgroundIndex: 0,
            accessoryIndex: 0,
            expressionIndex: 0,
            tokenURI: "",
            minted: false
        });
        
        emit NFTMintRequested(tokenId, requestId);
        return (tokenId, requestId);
    }
    
    function completeMintWithTraits(
        uint256 tokenId,
        uint8 backgroundIdx,
        uint8 accessoryIdx,
        uint8 expressionIdx,
        string memory tokenURI
    ) external {
        NFTData storage nft = nftData[tokenId];
        require(!nft.minted, "NFT already minted");
        require(entropyOracle.isRequestFulfilled(nft.entropyRequestId), "Entropy not ready");
        
        // Store traits (selected off-chain using entropy)
        nft.backgroundIndex = backgroundIdx;
        nft.accessoryIndex = accessoryIdx;
        nft.expressionIndex = expressionIdx;
        nft.tokenURI = tokenURI;
        nft.minted = true;
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(tokenId, nft.entropyRequestId, tokenURI);
    }
    
    event NFTMintRequested(uint256 indexed tokenId, uint256 indexed requestId);
    event NFTMinted(uint256 indexed tokenId, uint256 indexed requestId, string tokenURI);
}`}
        </pre>
      </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>💡 Live Example:</strong> Test this contract on the <a href="/examples" className="underline font-semibold">Examples page</a> (EntropyNFT). Mint real NFTs with IPFS metadata!
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Tutorial Examples Tab */}
      {activeTab === 'tutorial' && (
        <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300 mb-4">
                Tutorial Examples
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Educational examples demonstrating EntropyOracle integration patterns. Each example shows how to use entropy in different FHEVM scenarios.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>💡 Explore:</strong> View all tutorial examples on the <a href="/examples" className="underline font-semibold">Examples page</a> (Tutorial Examples tab).
                </p>
              </div>
            </div>

      {/* Basic Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
          Basic Examples
        </h3>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyCounter</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            Counter using EntropyOracle for encrypted randomness. Demonstrates entropy-based counter increments.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/basic-simplecounter</code>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyArithmetic</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            FHE arithmetic operations using EntropyOracle. Shows entropy-enhanced calculations (add, sub, mul).
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/basic-arithmetic</code>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyEqualityComparison</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            FHE equality comparison using EntropyOracle. Demonstrates entropy-enhanced comparison operations.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/basic-equalitycomparison</code>
          </p>
        </div>
      </div>

      {/* Encryption Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
          Encryption Examples
        </h3>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyEncryption</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            Encrypt and store values using EntropyOracle. Shows entropy-enhanced encryption patterns.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/encryption-encryptsingle</code>
          </p>
        </div>
      </div>

      {/* Decryption Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
          Decryption Examples
        </h3>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyUserDecryption</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            User decrypt using EntropyOracle and FHE.allow. Demonstrates entropy-enhanced user-specific decryption.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/user-decryption-userdecryptsingle</code>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyPublicDecryption</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            Public decrypt using EntropyOracle and makePubliclyDecryptable. Shows entropy-enhanced public decryption.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/public-decryption-publicdecryptsingle</code>
          </p>
        </div>
      </div>

      {/* Access Control Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
          Access Control Examples
        </h3>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyAccessControl</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            Access control with EntropyOracle, FHE.allow and FHE.allowTransient. Demonstrates entropy-enhanced access control patterns.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/access-control-accesscontrol</code>
          </p>
        </div>
      </div>

      {/* Input Proof Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
          Input Proof Examples
        </h3>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyInputProof</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            Input proofs with EntropyOracle integration. Shows entropy-enhanced input validation and proof requirements.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/input-proof-inputproofexplanation</code>
          </p>
        </div>
      </div>

      {/* Anti-Patterns Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
          Anti-Patterns Examples
        </h3>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyMissingAllowThis</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            Missing FHE.allowThis() permissions with EntropyOracle. Demonstrates common mistakes when using entropy.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/anti-patterns-missingallowthis</code>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyViewWithEncrypted</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            View functions with encrypted values and EntropyOracle. Shows limitations of view functions with FHE.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/anti-patterns-viewwithencrypted</code>
          </p>
        </div>
      </div>

            {/* Handles Examples */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
                Handles Examples
              </h3>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyHandleLifecycle</h4>
                <p className="text-gray-600 dark:text-slate-400 mb-3">
                  Understanding handles and symbolic execution with EntropyOracle. Demonstrates entropy handle lifecycle and permissions.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-500">
                  <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/handles-handlelifecycle</code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

// FAQ Section
const FAQ: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
        Frequently Asked Questions
      </h1>
    </div>

    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 mb-2">
          What is the fee for requesting entropy?
        </h3>
        <p className="text-gray-700 dark:text-slate-300">
          The fee is fixed at 0.00001 ETH (10,000,000,000,000 wei) per entropy request. This fee covers the cost of FHE operations and maintains the oracle infrastructure.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 mb-2">
          How do I decrypt the entropy?
        </h3>
        <p className="text-gray-700 dark:text-slate-300">
          Entropy is returned as <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">euint64</code> (encrypted uint64). 
          You can decrypt it using FHEVM's relayer SDK in your frontend, or use it directly in FHE operations without decryption.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 mb-2">
          What network is Entrofhe deployed on?
        </h3>
        <p className="text-gray-700 dark:text-slate-300">
          Currently, Entrofhe is deployed on Sepolia Testnet (Chain ID: 11155111). Mainnet deployment will be available in the future.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 mb-2">
          Can I use entropy in multiple FHE operations?
        </h3>
        <p className="text-gray-700 dark:text-slate-300">
          Yes! The encrypted entropy can be used in any FHE operation (add, mul, xor, etc.) without needing to decrypt it first. 
          This is one of the key advantages of FHE technology.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 mb-2">
          How unique is each entropy value?
        </h3>
        <p className="text-gray-700 dark:text-slate-300">
          Each entropy value is unique because it combines:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Master seed (encrypted, initialized once)</li>
            <li>Blockchain data (timestamp, prevrandao, blockhash)</li>
            <li>Request-specific data (request ID, consumer address, tag)</li>
            <li>Chaos function iterations</li>
          </ul>
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 mb-2">
          What happens if I send the wrong fee amount?
        </h3>
        <p className="text-gray-700 dark:text-slate-300">
          The transaction will revert with an <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">InsufficientFee</code> error. 
          You must send exactly 0.00001 ETH for the request to succeed.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 mb-2">
          Is the entropy truly random?
        </h3>
        <p className="text-gray-700 dark:text-slate-300">
          Yes! Entropy is generated using a combination of:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Cryptographically secure master seed</li>
            <li>Blockchain randomness (prevrandao, blockhash)</li>
            <li>Chaos theory (logistic map function)</li>
            <li>Request-specific data</li>
          </ul>
          This ensures high-quality randomness suitable for cryptographic applications.
        </p>
      </div>
    </div>
  </div>
);

export default Docs;

