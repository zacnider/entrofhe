import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  LightBulbIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: RocketLaunchIcon },
    { id: 'how-it-works', title: 'How It Works', icon: CpuChipIcon },
    { id: 'integration', title: 'Integration Guide', icon: CodeBracketIcon },
    { id: 'api-reference', title: 'API Reference', icon: DocumentTextIcon },
    { id: 'examples', title: 'Code Examples', icon: LightBulbIcon },
    { id: 'tutorial-track', title: 'Full Tutorial Track', icon: AcademicCapIcon },
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
      case 'tutorial-track':
        return <FullTutorialTrack />;
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
          Practical examples for common use cases. Includes 3 live examples and 19 tutorial examples (14 FHEVM + 5 OpenZeppelin) - all integrated with EntropyOracle.
        </p>
      </div>

      {/* Tutorial Playbook */}
      <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300">Tutorial Playbook (all 19 examples)</h3>
        <p className="text-sm text-primary-700 dark:text-slate-300">
          Oracle arg is fixed to EntropyOracle: <code className="bg-blue-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code>
        </p>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-blue-100 dark:border-slate-700 space-y-2">
          <h4 className="text-sm font-semibold text-primary-800 dark:text-cyan-200">Global workflow</h4>
          <ul className="list-decimal list-inside text-sm space-y-1 text-primary-700 dark:text-slate-300">
            <li>Install (first run): <code className="bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">npm install --legacy-peer-deps</code></li>
            <li>Compile: <code className="bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">npx hardhat compile</code></li>
            <li>Test (local FHE + local oracle/chaos engine auto-deployed): <code className="bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">npx hardhat test</code></li>
            <li>Deploy (frontend “Deploy”): wallet tx uses fixed oracle arg automatically</li>
            <li>Verify: <code className="bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">npx hardhat verify --network sepolia &lt;contractAddress&gt; 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code></li>
          </ul>
          <p className="text-xs text-primary-600 dark:text-slate-400">Frontend Test/Compile/Verify calls backend API; deps auto-install on first run; uses local Hardhat.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-primary-700 dark:text-slate-300">
          <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg p-3 space-y-1">
            <h4 className="text-sm font-semibold text-primary-800 dark:text-cyan-200">Core FHE + Entropy pattern</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Import FHE + EntropyOracle</li>
              <li>Encrypt inputs (externalEuint64 → FHE.fromExternal)</li>
              <li>Request entropy → getEncryptedEntropy(requestId)</li>
              <li>Grant permissions: FHE.allowThis(entropy)</li>
              <li>FHE ops on euint64 (add/xor/compare)</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg p-3 space-y-1">
            <h4 className="text-sm font-semibold text-primary-800 dark:text-cyan-200">Common pitfalls</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Missing FHE.allowThis on entropy or external inputs</li>
              <li>View/pure functions can’t run FHE ops</li>
              <li>Wrong constructor arg on verify (must be oracle)</li>
              <li>Missing deps → run npm install --legacy-peer-deps</li>
              <li>Etherscan timeout → retry verify</li>
            </ul>
          </div>
        </div>
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
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                <strong>📦 GitHub:</strong> <a href={getExampleRepoUrl('advanced-simplelottery')} target="_blank" rel="noopener noreferrer" className="underline font-semibold">View source code</a>
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
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                <strong>📦 GitHub:</strong> <a href={getExampleRepoUrl('advanced-randomnumbergenerator')} target="_blank" rel="noopener noreferrer" className="underline font-semibold">View source code</a>
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
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                <strong>📦 GitHub:</strong> <a href={getExampleRepoUrl('advanced-entropynft')} target="_blank" rel="noopener noreferrer" className="underline font-semibold">View source code</a>
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
                Educational examples demonstrating EntropyOracle integration patterns. Each example shows how to use entropy in different FHEVM scenarios. Includes 19 examples across 10 categories: Basic, Encryption, Decryption, Access Control, Input Proof, Anti-Patterns, Handles, Advanced, and OpenZeppelin Confidential Contracts.
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
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/basic-simplecounter</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('basic-simplecounter')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyArithmetic</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            FHE arithmetic operations using EntropyOracle. Shows entropy-enhanced calculations (add, sub, mul).
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/basic-arithmetic</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('basic-arithmetic')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyEqualityComparison</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            FHE equality comparison using EntropyOracle. Demonstrates entropy-enhanced comparison operations.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/basic-equalitycomparison</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('basic-equalitycomparison')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
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
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/encryption-encryptsingle</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('encryption-encryptsingle')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
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
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/user-decryption-userdecryptsingle</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('user-decryption-userdecryptsingle')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyPublicDecryption</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            Public decrypt using EntropyOracle and makePubliclyDecryptable. Shows entropy-enhanced public decryption.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/public-decryption-publicdecryptsingle</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('public-decryption-publicdecryptsingle')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
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
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/access-control-accesscontrol</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('access-control-accesscontrol')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
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
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/input-proof-inputproofexplanation</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('input-proof-inputproofexplanation')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
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
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/anti-patterns-missingallowthis</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('anti-patterns-missingallowthis')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyViewWithEncrypted</h4>
          <p className="text-gray-600 dark:text-slate-400 mb-3">
            View functions with encrypted values and EntropyOracle. Shows limitations of view functions with FHE.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
            <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/anti-patterns-viewwithencrypted</code>
          </p>
          <p className="text-sm">
            <a href={getExampleRepoUrl('anti-patterns-viewwithencrypted')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
              📦 View on GitHub
            </a>
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
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
                  <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/handles-handlelifecycle</code>
                </p>
                <p className="text-sm">
                  <a href={getExampleRepoUrl('handles-handlelifecycle')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
                    📦 View on GitHub
                  </a>
                </p>
              </div>
            </div>

            {/* OpenZeppelin Examples */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary-800 dark:text-cyan-300 border-b border-gray-200 dark:border-slate-700 pb-2">
                OpenZeppelin Confidential Contracts Examples
              </h3>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyERC7984Token</h4>
                <p className="text-gray-600 dark:text-slate-400 mb-3">
                  Basic ERC7984 confidential token implementation with EntropyOracle. Demonstrates encrypted balances and token operations.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
                  <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/openzeppelin-erc7984token</code>
                </p>
                <p className="text-sm">
                  <a href={getExampleRepoUrl('openzeppelin-erc7984token')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
                    📦 View on GitHub
                  </a>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyERC7984ToERC20Wrapper</h4>
                <p className="text-gray-600 dark:text-slate-400 mb-3">
                  Wrapper contract to convert ERC7984 confidential tokens to ERC20 tokens with EntropyOracle integration.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
                  <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/openzeppelin-erc7984toerc20wrapper</code>
                </p>
                <p className="text-sm">
                  <a href={getExampleRepoUrl('openzeppelin-erc7984toerc20wrapper')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
                    📦 View on GitHub
                  </a>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropySwapERC7984ToERC20</h4>
                <p className="text-gray-600 dark:text-slate-400 mb-3">
                  Swap ERC7984 confidential tokens to ERC20 tokens with EntropyOracle integration.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
                  <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/openzeppelin-swaperc7984toerc20</code>
                </p>
                <p className="text-sm">
                  <a href={getExampleRepoUrl('openzeppelin-swaperc7984toerc20')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
                    📦 View on GitHub
                  </a>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropySwapERC7984ToERC7984</h4>
                <p className="text-gray-600 dark:text-slate-400 mb-3">
                  Swap between two ERC7984 tokens with EntropyOracle integration. Demonstrates cross-token swaps with encrypted amounts.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
                  <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/openzeppelin-swaperc7984toerc7984</code>
                </p>
                <p className="text-sm">
                  <a href={getExampleRepoUrl('openzeppelin-swaperc7984toerc7984')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
                    📦 View on GitHub
                  </a>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-primary-700 dark:text-cyan-300 mb-2">EntropyVestingWallet</h4>
                <p className="text-gray-600 dark:text-slate-400 mb-3">
                  Vesting wallet with encrypted amounts and EntropyOracle integration. Demonstrates time-based vesting with confidential amounts.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-2">
                  <strong>Path:</strong> <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">examples/openzeppelin-vestingwallet</code>
                </p>
                <p className="text-sm">
                  <a href={getExampleRepoUrl('openzeppelin-vestingwallet')} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold">
                    📦 View on GitHub
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

// Full Tutorial Track Section
const FullTutorialTrack: React.FC = () => {
  const [activeSubSection, setActiveSubSection] = useState<string>('quick-start');

  const subSections = [
    { id: 'quick-start', title: 'Quick Start' },
    { id: 'solidity-guides', title: 'Solidity Guides' },
    { id: 'frontend-integration', title: 'Frontend Integration' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'example-tutorials', title: 'Example Tutorials' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
          Full Tutorial Track
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400">
          Complete step-by-step guide to building with Zama FHEVM and EntropyOracle. Learn from scratch how to create confidential smart contracts that use encrypted randomness.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {subSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSubSection(section.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeSubSection === section.id
                  ? 'border-primary-500 dark:border-cyan-500 text-primary-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeSubSection === 'quick-start' && <QuickStartTutorial />}
      {activeSubSection === 'solidity-guides' && <SolidityGuidesTutorial />}
      {activeSubSection === 'frontend-integration' && <FrontendIntegrationTutorial />}
      {activeSubSection === 'architecture' && <ArchitectureTutorial />}
      {activeSubSection === 'example-tutorials' && <ExampleTutorials />}
    </div>
  );
};

// Quick Start Tutorial
const QuickStartTutorial: React.FC = () => (
  <div className="space-y-8">
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100">Quick Start</h2>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Build your first confidential smart contract with EntropyOracle in 5 minutes.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Prerequisites</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
          <div>
            <p className="font-semibold text-primary-900 dark:text-slate-100">Node.js 18+</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Install from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-cyan-400 underline">nodejs.org</a></p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
          <div>
            <p className="font-semibold text-primary-900 dark:text-slate-100">Sepolia Testnet Access</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Get Sepolia ETH from a faucet. We'll use Alchemy RPC.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
          <div>
            <p className="font-semibold text-primary-900 dark:text-slate-100">Wallet (MetaMask or similar)</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Connect to Sepolia testnet</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
          <div>
            <p className="font-semibold text-primary-900 dark:text-slate-100">EntropyOracle Address</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Fixed address: <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code></p>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 1: Clone and Setup</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`# Clone the repository
git clone https://github.com/zacnider/entrofhe.git
cd entrofhe

# Navigate to an example
cd examples/basic-simplecounter

# Install dependencies
npm install --legacy-peer-deps`}
        </pre>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-3">
          <strong>Note:</strong> We use <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">--legacy-peer-deps</code> to resolve dependency conflicts with FHEVM packages.
        </p>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 2: Configure Environment</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          Create a <code className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">.env</code> file in the example directory:
        </p>
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
ENTROPY_ORACLE_ADDRESS=0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`}
        </pre>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>⚠️ Security:</strong> Never commit your <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">.env</code> file or private keys to version control.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 3: Compile Contracts</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`npx hardhat compile`}
        </pre>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-3">
          This generates contract artifacts and TypeScript types in the <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">artifacts/</code> and <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">types/</code> directories.
        </p>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 4: Run Tests</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`npx hardhat test`}
        </pre>
        <p className="text-gray-700 dark:text-slate-300">
          Tests automatically deploy a local FHEChaosEngine and EntropyOracle on the Hardhat network. This means:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
          <li>No Sepolia network required for testing</li>
          <li>Fast execution (local network)</li>
          <li>Full FHE functionality with local coprocessor</li>
          <li>Isolated test environment</li>
        </ul>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>💡 Tip:</strong> Test output shows encrypted values as handles. Decrypt off-chain using FHEVM SDK.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 5: Deploy to Sepolia</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          You can deploy in two ways:
        </p>
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Option 1: Frontend (Recommended)</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
              Use the <a href="/examples" className="text-primary-600 dark:text-cyan-400 underline">Examples page</a> Deploy button. Your wallet will prompt for transaction approval.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 ml-4 space-y-1">
              <li>Constructor argument (EntropyOracle address) is automatically included</li>
              <li>No manual ABI encoding needed</li>
              <li>Transaction status shown in real-time</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Option 2: CLI</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs mt-2">
{`npx hardhat run scripts/deploy.ts --network sepolia`}
            </pre>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
              Ensure your deploy script passes <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code> as constructor argument.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Step 6: Verify on Etherscan</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          After deployment, verify your contract:
        </p>
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Option 1: Frontend</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
              Click the "Verify" button on the <a href="/examples" className="text-primary-600 dark:text-cyan-400 underline">Examples page</a> after deployment.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Option 2: CLI</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs mt-2">
{`npx hardhat verify --network sepolia <CONTRACT_ADDRESS> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`}
            </pre>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
              Replace <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">&lt;CONTRACT_ADDRESS&gt;</code> with your deployed contract address.
            </p>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
          <p className="text-green-800 dark:text-green-200 text-sm">
            <strong>✅ Success:</strong> Once verified, your contract source code will be visible on Etherscan, and users can interact with it directly.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">What's Next?</h3>
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6">
        <p className="text-gray-700 dark:text-slate-300 mb-4">
          Now that you've deployed your first contract, explore:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
          <li><strong>Solidity Guides:</strong> Learn FHE types, permissions, and EntropyOracle patterns</li>
          <li><strong>Frontend Integration:</strong> Build dApps that interact with your contracts</li>
          <li><strong>Example Tutorials:</strong> Deep dive into each of our 19 tutorial examples</li>
          <li><strong>Architecture:</strong> Understand how FHEVM and EntropyOracle work under the hood</li>
        </ul>
      </div>
    </section>
  </div>
);

// Solidity Guides Tutorial
const SolidityGuidesTutorial: React.FC = () => (
  <div className="space-y-8">
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100">Solidity Guides</h2>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Learn how to write Solidity contracts that compute on encrypted data using Zama FHEVM and EntropyOracle.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">FHE Types</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">euint64</h4>
          <p className="text-gray-700 dark:text-slate-300 mb-2">
            Encrypted unsigned 64-bit integer. This is the primary type for encrypted values in FHEVM.
          </p>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`euint64 private encryptedValue;

// Create from plain value
euint64 value = FHE.asEuint64(42);

// Operations
euint64 sum = FHE.add(value1, value2);
euint64 product = FHE.mul(value1, value2);
ebool isEqual = FHE.eq(value1, value2);`}
          </pre>
        </div>
        <div>
          <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">externalEuint64</h4>
          <p className="text-gray-700 dark:text-slate-300 mb-2">
            Encrypted value from external source (frontend). Requires an input proof for validation.
          </p>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`function initialize(externalEuint64 encryptedValue, bytes calldata inputProof) external {
    // Convert external to internal
    euint64 internalValue = FHE.fromExternal(encryptedValue, inputProof);
    
    // Grant permission
    FHE.allowThis(internalValue);
    
    // Now you can use it
    storedValue = internalValue;
}`}
          </pre>
        </div>
        <div>
          <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">ebool</h4>
          <p className="text-gray-700 dark:text-slate-300 mb-2">
            Encrypted boolean. Result of comparison operations.
          </p>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`ebool isGreater = FHE.gt(value1, value2);
ebool isEqual = FHE.eq(value1, value2);
ebool isLess = FHE.lt(value1, value2);`}
          </pre>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Permissions: FHE.allow and FHE.allowThis</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          FHEVM uses an Access Control List (ACL) to manage who can use encrypted values. This is a security feature to prevent unauthorized access.
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">FHE.allowThis()</h4>
            <p className="text-gray-700 dark:text-slate-300 mb-2">
              Grants the current contract permission to use an encrypted value. <strong>Required before using any encrypted value in FHE operations.</strong>
            </p>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
FHE.allowThis(entropy); // Required!

// Now you can use entropy
euint64 result = FHE.add(counter, entropy);`}
            </pre>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-2">
              <p className="text-red-800 dark:text-red-200 text-sm">
                <strong>⚠️ Common Error:</strong> Forgetting <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">FHE.allowThis()</code> results in <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">SenderNotAllowed()</code> error.
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">FHE.allow()</h4>
            <p className="text-gray-700 dark:text-slate-300 mb-2">
              Grants a specific user permission to decrypt an encrypted value. Used for user-specific decryption.
            </p>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`euint64 secretValue = ...;
FHE.allow(secretValue, userAddress);

// Now user can decrypt this value off-chain using FHEVM SDK`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">FHE.makePubliclyDecryptable()</h4>
            <p className="text-gray-700 dark:text-slate-300 mb-2">
              Makes an encrypted value publicly decryptable. <strong>Use with caution!</strong> This removes privacy.
            </p>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`euint64 result = FHE.add(value1, value2);
FHE.makePubliclyDecryptable(result);

// Now anyone can decrypt this value`}
            </pre>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Input Proofs</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          When accepting encrypted values from external sources (frontend), you must validate them using input proofs. This ensures the encrypted value is valid and hasn't been tampered with.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>💡 How it works:</strong> The frontend generates an input proof when encrypting a value. The contract validates this proof before accepting the encrypted value.
          </p>
        </div>
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`// Frontend (TypeScript)
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encrypted = await input.encrypt();

// Send to contract
await contract.initialize(encrypted.handles[0], encrypted.inputProof);

// Contract (Solidity)
function initialize(externalEuint64 value, bytes calldata inputProof) external {
    euint64 internal = FHE.fromExternal(value, inputProof);
    // inputProof is validated here
    FHE.allowThis(internal);
    storedValue = internal;
}`}
        </pre>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>⚠️ Important:</strong> Each <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">externalEuint64</code> parameter requires its own <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">inputProof</code>. If you have 2 external inputs, you need 2 proofs.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">EntropyOracle Integration Pattern</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          The standard pattern for using EntropyOracle in your contracts:
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">1. Import and Declare</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "./IEntropyOracle.sol";

contract MyContract {
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361);
    uint256 public constant FEE_AMOUNT = 0.00001 ether;
}`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">2. Request Entropy</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`function useRandomness(bytes32 tag) external payable {
    require(msg.value >= FEE_AMOUNT, "Insufficient fee");
    
    // Request entropy
    uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: FEE_AMOUNT}(tag);
    
    // Store requestId for later use
    pendingRequests[requestId] = true;
}`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">3. Get and Use Entropy</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`function completeWithEntropy(uint256 requestId) external {
    require(ENTROPY_ORACLE.isRequestFulfilled(requestId), "Not ready");
    
    // Get encrypted entropy
    euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
    
    // CRITICAL: Grant permission
    FHE.allowThis(entropy);
    
    // Use entropy in FHE operations
    euint64 result = FHE.xor(storedValue, entropy);
    FHE.allowThis(result);
    
    storedValue = result;
}`}
            </pre>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
          <p className="text-green-800 dark:text-green-200 text-sm">
            <strong>✅ Best Practice:</strong> Always check <code className="bg-green-100 dark:bg-green-900 px-1 py-0.5 rounded">isRequestFulfilled()</code> before using entropy. The oracle needs time to generate entropy.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Common FHE Operations</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">Arithmetic</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
{`FHE.add(a, b)    // Addition
FHE.sub(a, b)    // Subtraction
FHE.mul(a, b)    // Multiplication
FHE.div(a, b)    // Division
FHE.mod(a, b)    // Modulo`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">Bitwise</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
{`FHE.xor(a, b)   // XOR
FHE.and(a, b)    // AND
FHE.or(a, b)     // OR`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">Comparison</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
{`FHE.eq(a, b)    // Equal
FHE.ne(a, b)     // Not equal
FHE.lt(a, b)     // Less than
FHE.le(a, b)     // Less or equal
FHE.gt(a, b)     // Greater than
FHE.ge(a, b)     // Greater or equal`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">Type Conversion</h4>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
{`FHE.asEuint64(uint64)  // Plain to encrypted
FHE.fromExternal(...)    // External to internal`}
            </pre>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Anti-Patterns to Avoid</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Using FHE in view/pure functions</h4>
          <p className="text-red-700 dark:text-red-300 text-sm">
            FHE operations modify state symbolically and cannot be used in <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">view</code> or <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">pure</code> functions.
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Forgetting FHE.allowThis()</h4>
          <p className="text-red-700 dark:text-red-300 text-sm">
            Always call <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">FHE.allowThis()</code> on encrypted values (including entropy) before using them in operations.
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Wrong number of input proofs</h4>
          <p className="text-red-700 dark:text-red-300 text-sm">
            Each <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">externalEuint64</code> parameter requires its own <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">inputProof</code>.
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Using wrong constructor argument</h4>
          <p className="text-red-700 dark:text-red-300 text-sm">
            Always use <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code> as the EntropyOracle address in constructor and verification.
          </p>
        </div>
      </div>
    </section>
  </div>
);

// Frontend Integration Tutorial
const FrontendIntegrationTutorial: React.FC = () => (
  <div className="space-y-8">
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100">Frontend Integration</h2>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Learn how to build frontends that interact with FHEVM contracts and EntropyOracle.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Using Our Frontend Tools</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          Our frontend provides built-in tools for testing, compiling, deploying, and verifying contracts:
        </p>
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Test Button</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Runs <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">npx hardhat test</code> on the backend. Shows test results in a terminal window.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Compile Button</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Compiles contracts and shows compilation status. Generates artifacts and TypeScript types.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Deploy Button</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Connects to your wallet and deploys the contract. Constructor argument (EntropyOracle address) is automatically included.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-primary-800 dark:text-cyan-300 mb-2">Verify Button</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Verifies your contract on Etherscan. Constructor arguments are automatically passed.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">Building Your Own Frontend</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          To build a custom frontend, you'll need:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
          <li><strong>Wagmi</strong> - React Hooks for Ethereum</li>
          <li><strong>RainbowKit</strong> - Wallet connection UI</li>
          <li><strong>FHEVM SDK</strong> - For encrypting values and generating input proofs</li>
          <li><strong>Viem</strong> - TypeScript Ethereum library</li>
        </ul>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>💡 Tip:</strong> Check our <a href="https://github.com/zacnider/entrofhe" target="_blank" rel="noopener noreferrer" className="underline">GitHub repository</a> for frontend implementation examples.
          </p>
        </div>
      </div>
    </section>
  </div>
);

// Architecture Tutorial
const ArchitectureTutorial: React.FC = () => (
  <div className="space-y-8">
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100">Architecture</h2>
      <p className="text-lg text-gray-600 dark:text-slate-400">
        Deep dive into how FHEVM and EntropyOracle work together.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">FHEVM Overview</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <p className="text-gray-700 dark:text-slate-300">
          FHEVM (Fully Homomorphic Encryption Virtual Machine) enables computation on encrypted data without decryption. Key components:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
          <li><strong>Coprocessor:</strong> Off-chain service that performs FHE operations</li>
          <li><strong>Symbolic Execution:</strong> Tracks encrypted values as handles</li>
          <li><strong>ACL (Access Control List):</strong> Manages permissions for encrypted values</li>
          <li><strong>Relayer:</strong> Handles encryption/decryption in frontend</li>
        </ul>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">EntropyOracle Flow</h3>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Request Entropy</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">User calls <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">requestEntropy()</code> with a unique tag and pays fee.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Seed Collection</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">FHEChaosEngine collects on-chain data (timestamp, prevrandao, blockhash) and combines with master seed.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Chaos Generation</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">Logistic map function iterates on combined seeds to generate entropy (all encrypted).</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Return Encrypted Entropy</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">Encrypted entropy (euint64) is returned and can be used in FHE operations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// Example Tutorials - Will be expanded with detailed per-example content
const ExampleTutorials: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<string>('basic-simplecounter');

  const examples = [
    { id: 'basic-simplecounter', name: 'EntropyCounter', category: 'Basic' },
    { id: 'basic-arithmetic', name: 'EntropyArithmetic', category: 'Basic' },
    { id: 'basic-equalitycomparison', name: 'EntropyEqualityComparison', category: 'Basic' },
    { id: 'encryption-encryptsingle', name: 'EntropyEncryption', category: 'Encryption' },
    { id: 'user-decryption-userdecryptsingle', name: 'EntropyUserDecryption', category: 'Decryption' },
    { id: 'public-decryption-publicdecryptsingle', name: 'EntropyPublicDecryption', category: 'Decryption' },
    { id: 'access-control-accesscontrol', name: 'EntropyAccessControl', category: 'Access Control' },
    { id: 'input-proof-inputproofexplanation', name: 'EntropyInputProof', category: 'Input Proof' },
    { id: 'anti-patterns-missingallowthis', name: 'EntropyMissingAllowThis', category: 'Anti-Patterns' },
    { id: 'anti-patterns-viewwithencrypted', name: 'EntropyViewWithEncrypted', category: 'Anti-Patterns' },
    { id: 'handles-handlelifecycle', name: 'EntropyHandleLifecycle', category: 'Handles' },
    { id: 'advanced-simplelottery', name: 'SimpleLottery', category: 'Advanced' },
    { id: 'advanced-randomnumbergenerator', name: 'RandomNumberGenerator', category: 'Advanced' },
    { id: 'advanced-entropynft', name: 'EntropyNFT', category: 'Advanced' },
    { id: 'openzeppelin-erc7984token', name: 'EntropyERC7984Token', category: 'OpenZeppelin' },
    { id: 'openzeppelin-erc7984toerc20wrapper', name: 'EntropyERC7984ToERC20Wrapper', category: 'OpenZeppelin' },
    { id: 'openzeppelin-swaperc7984toerc20', name: 'EntropySwapERC7984ToERC20', category: 'OpenZeppelin' },
    { id: 'openzeppelin-swaperc7984toerc7984', name: 'EntropySwapERC7984ToERC7984', category: 'OpenZeppelin' },
    { id: 'openzeppelin-vestingwallet', name: 'EntropyVestingWallet', category: 'OpenZeppelin' },
  ];

  // Group examples by category
  const examplesByCategory = examples.reduce((acc, example) => {
    if (!acc[example.category]) {
      acc[example.category] = [];
    }
    acc[example.category].push(example);
    return acc;
  }, {} as Record<string, typeof examples>);

  const selectedExampleData = examples.find(e => e.id === selectedExample);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100 mb-4">Example Tutorials</h2>
        <p className="text-lg text-gray-600 dark:text-slate-400">
          Deep dive into each of our 19 tutorial examples. Learn the what, why, and how of each pattern.
        </p>
      </div>

      {/* Dropdown Menu */}
      <div className="space-y-2">
        <label htmlFor="example-select" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Select Example:
        </label>
        <select
          id="example-select"
          value={selectedExample}
          onChange={(e) => setSelectedExample(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-cyan-500 focus:border-primary-500 dark:focus:border-cyan-500 transition-all"
        >
          {Object.entries(examplesByCategory).map(([category, categoryExamples]) => (
            <optgroup key={category} label={category}>
              {categoryExamples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedExampleData && (
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            <span className="font-semibold">Category:</span> {selectedExampleData.category}
          </p>
        )}
      </div>

      {/* Selected Example Tutorial */}
      <div className="mt-6">
        {selectedExample === 'basic-simplecounter' && <EntropyCounterTutorial />}
        {selectedExample === 'basic-arithmetic' && <EntropyArithmeticTutorial />}
        {selectedExample === 'basic-equalitycomparison' && <EntropyEqualityComparisonTutorial />}
        {selectedExample === 'encryption-encryptsingle' && <EntropyEncryptionTutorial />}
        {selectedExample === 'user-decryption-userdecryptsingle' && <EntropyUserDecryptionTutorial />}
        {selectedExample === 'public-decryption-publicdecryptsingle' && <EntropyPublicDecryptionTutorial />}
        {selectedExample === 'access-control-accesscontrol' && <EntropyAccessControlTutorial />}
        {selectedExample === 'input-proof-inputproofexplanation' && <EntropyInputProofTutorial />}
        {selectedExample === 'anti-patterns-missingallowthis' && <EntropyMissingAllowThisTutorial />}
        {selectedExample === 'anti-patterns-viewwithencrypted' && <EntropyViewWithEncryptedTutorial />}
        {selectedExample === 'handles-handlelifecycle' && <EntropyHandleLifecycleTutorial />}
        {selectedExample === 'advanced-simplelottery' && <SimpleLotteryTutorial />}
        {selectedExample === 'advanced-randomnumbergenerator' && <RandomNumberGeneratorTutorial />}
        {selectedExample === 'advanced-entropynft' && <EntropyNFTTutorial />}
        {selectedExample === 'openzeppelin-erc7984token' && <EntropyERC7984TokenTutorial />}
        {selectedExample === 'openzeppelin-erc7984toerc20wrapper' && <EntropyERC7984ToERC20WrapperTutorial />}
        {selectedExample === 'openzeppelin-swaperc7984toerc20' && <EntropySwapERC7984ToERC20Tutorial />}
        {selectedExample === 'openzeppelin-swaperc7984toerc7984' && <EntropySwapERC7984ToERC7984Tutorial />}
        {selectedExample === 'openzeppelin-vestingwallet' && <EntropyVestingWalletTutorial />}
      </div>
    </div>
  );
};

// Detailed EntropyCounter Tutorial (example)
const EntropyCounterTutorial: React.FC = () => (
  <div className="space-y-8 mt-6">
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">EntropyCounter: Complete Tutorial</h3>
      <p className="text-gray-700 dark:text-slate-300">
        Learn how to build a counter that uses encrypted randomness from EntropyOracle for entropy-enhanced increments.
      </p>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">What This Example Teaches</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
          <li>How to integrate EntropyOracle into your contract</li>
          <li>How to request and use encrypted entropy</li>
          <li>How to combine entropy with encrypted values using FHE operations</li>
          <li>How to handle external encrypted inputs with input proofs</li>
          <li>The importance of <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">FHE.allowThis()</code></li>
        </ul>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Contract Logic Explained</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <div>
          <h5 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">1. Constructor</h5>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`constructor(address _entropyOracle) {
    require(_entropyOracle != address(0), "Invalid oracle address");
    entropyOracle = IEntropyOracle(_entropyOracle);
}`}
          </pre>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            Stores the EntropyOracle address. Always use <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code>.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">2. Initialize</h5>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`function initialize(externalEuint64 encryptedValue, bytes calldata inputProof) external {
    require(!initialized, "Counter already initialized");
    
    euint64 internalValue = FHE.fromExternal(encryptedValue, inputProof);
    FHE.allowThis(internalValue); // Required!
    counter = internalValue;
    initialized = true;
}`}
          </pre>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            Converts external encrypted input to internal, grants permission, and stores it. Can only be called once.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">3. Request Entropy</h5>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`function requestIncrement(bytes32 tag) external payable returns (uint256 requestId) {
    require(initialized, "Counter not initialized");
    require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
    
    requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
    incrementRequests[requestId] = true;
    return requestId;
}`}
          </pre>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            Requests entropy from oracle. Requires 0.00001 ETH fee. Returns requestId for later use.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">4. Increment with Entropy</h5>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
{`function incrementWithEntropy(uint256 requestId) external {
    require(entropyOracle.isRequestFulfilled(requestId), "Entropy not ready");
    
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy); // CRITICAL!
    
    euint64 mixed = FHE.xor(counter, entropy);
    FHE.allowThis(mixed);
    
    euint64 one = FHE.asEuint64(1);
    FHE.allowThis(one);
    counter = FHE.add(mixed, one);
}`}
          </pre>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            Gets entropy, grants permission, combines with counter using XOR, then adds 1. This creates entropy-enhanced increments.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Step-by-Step Testing</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Deploy Contracts</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Test fixture automatically deploys FHEChaosEngine, EntropyOracle, and EntropyCounter on local Hardhat network.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Initialize Counter</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Create encrypted input (value 0), encrypt it, and call <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">initialize()</code>.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Request Entropy</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Call <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">requestIncrement()</code> with a unique tag and fee.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Wait for Fulfillment</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Check <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">isRequestFulfilled()</code> until true.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
            <div>
              <p className="font-semibold text-primary-900 dark:text-slate-100">Increment with Entropy</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Call <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded">incrementWithEntropy()</code> with the requestId.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Expected Outputs</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
        <div>
          <p className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">Test Results</p>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
{`✓ Should deploy successfully
✓ Should not be initialized by default
✓ Should have EntropyOracle address set
✓ Should initialize with encrypted value
✓ Should not allow double initialization
✓ Should increment encrypted counter without entropy
✓ Should request entropy for increment
✓ Should track increment count`}
          </pre>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>💡 Note:</strong> Encrypted values appear as handles in test output. Decrypt off-chain to see actual values.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Common Errors & Solutions</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error: SenderNotAllowed()</h5>
          <p className="text-red-700 dark:text-red-300 text-sm mb-2">
            <strong>Cause:</strong> Missing <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">FHE.allowThis()</code> call.
          </p>
          <p className="text-red-700 dark:text-red-300 text-sm">
            <strong>Solution:</strong> Always call <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">FHE.allowThis()</code> on encrypted values (including entropy) before using them.
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error: Entropy not ready</h5>
          <p className="text-red-700 dark:text-red-300 text-sm mb-2">
            <strong>Cause:</strong> Calling <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">incrementWithEntropy()</code> before entropy is fulfilled.
          </p>
          <p className="text-red-700 dark:text-red-300 text-sm">
            <strong>Solution:</strong> Check <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">isRequestFulfilled()</code> and wait if needed.
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error: Invalid oracle address</h5>
          <p className="text-red-700 dark:text-red-300 text-sm mb-2">
            <strong>Cause:</strong> Wrong or zero address passed to constructor.
          </p>
          <p className="text-red-700 dark:text-red-300 text-sm">
            <strong>Solution:</strong> Always use <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361</code>.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">GitHub Resources</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <p className="text-gray-700 dark:text-slate-300 mb-3">
          View the complete source code and tests:
        </p>
        <a 
          href={getExampleRepoUrl('basic-simplecounter')} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold"
        >
          📦 View on GitHub →
        </a>
      </div>
    </section>
  </div>
);

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

// GitHub repo mapping for submodules
const getExampleRepoUrl = (exampleId: string): string => {
  const repoMap: Record<string, string> = {
    'basic-simplecounter': 'fhevm-example-basic-simplecounter',
    'basic-arithmetic': 'fhevm-example-basic-arithmetic',
    'basic-equalitycomparison': 'fhevm-example-basic-equalitycomparison',
    'encryption-encryptsingle': 'fhevm-example-encryption-encryptsingle',
    'user-decryption-userdecryptsingle': 'fhevm-example-user-decryption-userdecryptsingle',
    'public-decryption-publicdecryptsingle': 'fhevm-example-public-decryption-publicdecryptsingle',
    'access-control-accesscontrol': 'fhevm-example-access-control-accesscontrol',
    'input-proof-inputproofexplanation': 'fhevm-example-input-proof-inputproofexplanation',
    'anti-patterns-viewwithencrypted': 'fhevm-example-anti-patterns-viewwithencrypted',
    'anti-patterns-missingallowthis': 'fhevm-example-anti-patterns-missingallowthis',
    'handles-handlelifecycle': 'fhevm-example-handles-handlelifecycle',
    'advanced-simplelottery': 'fhevm-example-advanced-simplelottery',
    'advanced-randomnumbergenerator': 'fhevm-example-advanced-randomnumbergenerator',
    'advanced-entropynft': 'fhevm-example-advanced-entropynft',
    'openzeppelin-erc7984token': 'fhevm-example-openzeppelin-erc7984token',
    'openzeppelin-erc7984toerc20wrapper': 'fhevm-example-openzeppelin-erc7984toerc20wrapper',
    'openzeppelin-swaperc7984toerc20': 'fhevm-example-openzeppelin-swaperc7984toerc20',
    'openzeppelin-swaperc7984toerc7984': 'fhevm-example-openzeppelin-swaperc7984toerc7984',
    'openzeppelin-vestingwallet': 'fhevm-example-openzeppelin-vestingwallet',
  };
  const repoName = repoMap[exampleId] || `entrofhe/tree/main/examples/${exampleId}`;
  return `https://github.com/zacnider/${repoName}`;
};

// Generic Tutorial Template Component
const GenericTutorial: React.FC<{
  name: string;
  exampleId: string;
  category: string;
  description: string;
  whatTeaches: string[];
  whyMatters: string[];
  contractLogic: { title: string; code: string; explanation: string }[];
  testSteps: { step: number; title: string; description: string }[];
  expectedOutputs: string;
  commonErrors: { error: string; cause: string; solution: string }[];
}> = ({ name, exampleId, category, description, whatTeaches, whyMatters, contractLogic, testSteps, expectedOutputs, commonErrors }) => (
  <div className="space-y-8 mt-6">
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300">{name}: Complete Tutorial</h3>
      <p className="text-gray-700 dark:text-slate-300">{description}</p>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">What This Example Teaches</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
          {whatTeaches.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Why This Matters</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-slate-300 ml-4">
          {whyMatters.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Contract Logic Explained</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        {contractLogic.map((logic, idx) => (
          <div key={idx}>
            <h5 className="font-semibold text-primary-700 dark:text-cyan-300 mb-2">{logic.title}</h5>
            <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
              {logic.code}
            </pre>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">{logic.explanation}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Step-by-Step Testing</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        <div className="space-y-3">
          {testSteps.map((step) => (
            <div key={step.step} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {step.step}
              </div>
              <div>
                <p className="font-semibold text-primary-900 dark:text-slate-100">{step.title}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Expected Outputs</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
        <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
          {expectedOutputs}
        </pre>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>💡 Note:</strong> Encrypted values appear as handles in test output. Decrypt off-chain to see actual values.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">Common Errors & Solutions</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
        {commonErrors.map((error, idx) => (
          <div key={idx} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error: {error.error}</h5>
            <p className="text-red-700 dark:text-red-300 text-sm mb-2">
              <strong>Cause:</strong> {error.cause}
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              <strong>Solution:</strong> {error.solution}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-4">
      <h4 className="text-xl font-semibold text-primary-800 dark:text-cyan-300">GitHub Resources</h4>
      <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
        <p className="text-gray-700 dark:text-slate-300 mb-3">View the complete source code and tests:</p>
        <a
          href={getExampleRepoUrl(exampleId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-cyan-400 hover:underline font-semibold"
        >
          📦 View on GitHub →
        </a>
      </div>
    </section>
  </div>
);

// Placeholder tutorials - will be expanded with detailed content
const EntropyArithmeticTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyArithmetic"
    exampleId="basic-arithmetic"
    category="Basic"
    description="Learn how to perform FHE arithmetic operations (add, subtract, multiply) enhanced with encrypted randomness from EntropyOracle."
    whatTeaches={[
      "How to perform arithmetic operations on encrypted values",
      "How to enhance arithmetic operations with entropy",
      "How to handle multiple external encrypted inputs",
      "The importance of FHE.allowThis() for each encrypted value"
    ]}
    whyMatters={[
      "Arithmetic operations are fundamental to FHEVM",
      "Entropy enhancement adds randomness to calculations",
      "Multiple inputs require multiple input proofs"
    ]}
    contractLogic={[
      {
        title: "1. Initialize Two Values",
        code: `function initialize(
    externalEuint64 encryptedValue1,
    externalEuint64 encryptedValue2,
    bytes calldata inputProof1,
    bytes calldata inputProof2
) external {
    euint64 internalValue1 = FHE.fromExternal(encryptedValue1, inputProof1);
    euint64 internalValue2 = FHE.fromExternal(encryptedValue2, inputProof2);
    FHE.allowThis(internalValue1);
    FHE.allowThis(internalValue2);
    value1 = internalValue1;
    value2 = internalValue2;
}`,
        explanation: "Converts two external encrypted inputs to internal format. Each input requires its own input proof."
      },
      {
        title: "2. Add with Entropy",
        code: `function addWithEntropy(uint256 requestId) external {
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    euint64 sum = FHE.add(value1, value2);
    FHE.allowThis(sum);
    result = FHE.xor(sum, entropy);
}`,
        explanation: "Adds two values, then mixes result with entropy using XOR for randomness."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture automatically deploys FHEChaosEngine, EntropyOracle, and EntropyArithmetic." },
      { step: 2, title: "Initialize Values", description: "Create two encrypted inputs (e.g., 5 and 3), encrypt them, and call initialize() with both handles and proofs." },
      { step: 3, title: "Request Entropy", description: "Call requestEntropy() with a unique tag and fee." },
      { step: 4, title: "Wait for Fulfillment", description: "Check isRequestFulfilled() until true." },
      { step: 5, title: "Perform Operations", description: "Call addWithEntropy(), subtractWithEntropy(), or multiplyWithEntropy() with the requestId." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should initialize with two encrypted values
✓ Should perform addition
✓ Should perform subtraction
✓ Should perform multiplication
✓ Should perform entropy-enhanced operations`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted value.",
        solution: "Always call FHE.allowThis() on all encrypted values before using them."
      },
      {
        error: "Incorrect number of arguments",
        cause: "Wrong number of input proofs passed to initialize().",
        solution: "Each externalEuint64 parameter requires its own inputProof. For two inputs, pass two proofs."
      }
    ]}
  />
);

const EntropyEqualityComparisonTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyEqualityComparison"
    exampleId="basic-equalitycomparison"
    category="Basic"
    description="Learn how to compare encrypted values for equality using FHE operations enhanced with EntropyOracle."
    whatTeaches={[
      "How to compare encrypted values for equality",
      "How to use ebool (encrypted boolean) results",
      "How to enhance comparisons with entropy",
      "Understanding FHE.eq() operation"
    ]}
    whyMatters={[
      "Equality checks are essential for conditional logic",
      "ebool results can be used in encrypted conditionals",
      "Entropy adds randomness to comparison results"
    ]}
    contractLogic={[
      {
        title: "1. Compare Values",
        code: `function compare() external returns (ebool result) {
    result = FHE.eq(value1, value2);
    FHE.allowThis(result);
    return result;
}`,
        explanation: "Compares two encrypted values for equality. Returns encrypted boolean (ebool)."
      },
      {
        title: "2. Compare with Entropy",
        code: `function compareWithEntropy(uint256 requestId) external {
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    euint64 mixed1 = FHE.xor(value1, entropy);
    euint64 mixed2 = FHE.xor(value2, entropy);
    result = FHE.eq(mixed1, mixed2);
}`,
        explanation: "Mixes values with entropy before comparison, adding randomness to the result."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Initialize Values", description: "Initialize with two encrypted values (can be same or different)." },
      { step: 3, title: "Request Entropy", description: "Request entropy for entropy-enhanced comparison." },
      { step: 4, title: "Perform Comparison", description: "Call compare() or compareWithEntropy() to get encrypted boolean result." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should initialize with two encrypted values
✓ Should perform equality comparison
✓ Should return encrypted boolean result
✓ Should perform entropy-enhanced comparison`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() on encrypted values or result.",
        solution: "Call FHE.allowThis() on all encrypted values before operations."
      }
    ]}
  />
);

// Placeholder components for remaining examples - will be expanded
const EntropyEncryptionTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyEncryption"
    exampleId="encryption-encryptsingle"
    category="Encryption"
    description="Learn how to encrypt and store values using EntropyOracle for enhanced security. This example demonstrates basic encryption patterns and entropy-enhanced encryption."
    whatTeaches={[
      "How to encrypt values off-chain and send to contract",
      "How to store encrypted values on-chain",
      "How to enhance encryption with entropy using XOR",
      "How to update encrypted values",
      "The importance of FHE.allowThis() for stored values"
    ]}
    whyMatters={[
      "Encryption is fundamental to FHEVM",
      "Entropy adds randomness to encrypted values",
      "Enhanced encryption provides better security",
      "Learn the foundation for more complex encryption patterns"
    ]}
    contractLogic={[
      {
        title: "1. Encrypt and Store",
        code: `function encryptAndStore(
    externalEuint64 encryptedInput,
    bytes calldata inputProof
) external {
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    encryptedValue = internalValue;
    initialized = true;
}`,
        explanation: "Converts external encrypted input to internal format, grants permission, and stores it. User encrypts value off-chain using FHEVM SDK."
      },
      {
        title: "2. Encrypt with Entropy",
        code: `function encryptAndStoreWithEntropy(
    externalEuint64 encryptedInput,
    bytes calldata inputProof,
    uint256 requestId
) external {
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    
    euint64 enhancedValue = FHE.xor(internalValue, entropy);
    FHE.allowThis(enhancedValue);
    encryptedValue = enhancedValue;
}`,
        explanation: "Combines user-encrypted value with entropy using XOR. This creates entropy-enhanced encryption with added randomness."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture automatically deploys FHEChaosEngine, EntropyOracle, and EntropyEncryption." },
      { step: 2, title: "Encrypt and Store", description: "Create encrypted input (e.g., value 42), encrypt it, and call encryptAndStore() with handle and proof." },
      { step: 3, title: "Request Entropy", description: "Call requestEntropy() with a unique tag and fee for entropy-enhanced encryption." },
      { step: 4, title: "Wait for Fulfillment", description: "Check isRequestFulfilled() until true." },
      { step: 5, title: "Encrypt with Entropy", description: "Call encryptAndStoreWithEntropy() with encrypted input, proof, and requestId." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should encrypt and store value
✓ Should update encrypted value
✓ Should request entropy
✓ Should encrypt and store with entropy enhancement`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted value.",
        solution: "Always call FHE.allowThis() on all encrypted values before using them."
      },
      {
        error: "Entropy not ready",
        cause: "Calling encryptAndStoreWithEntropy() before entropy is fulfilled.",
        solution: "Always check isRequestFulfilled() before using entropy."
      }
    ]}
  />
);

const EntropyUserDecryptionTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyUserDecryption"
    exampleId="user-decryption-userdecryptsingle"
    category="Decryption"
    description="Learn how to allow specific users to decrypt encrypted values using FHE.allow(). This example demonstrates user-specific access control with entropy enhancement."
    whatTeaches={[
      "How to use FHE.allow() for user-specific decryption",
      "How to grant decryption permissions to specific users",
      "How to enhance user decryption with entropy",
      "The difference between FHE.allow() and FHE.allowThis()",
      "User-specific access control patterns"
    ]}
    whyMatters={[
      "Selective decryption maintains privacy",
      "FHE.allow() enables fine-grained access control",
      "Only authorized users can decrypt values",
      "Entropy adds randomness to decryption patterns"
    ]}
    contractLogic={[
      {
        title: "1. Store and Allow User",
        code: `function storeAndAllow(
    externalEuint64 encryptedInput,
    bytes calldata inputProof,
    address user
) external {
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);  // Contract can use
    FHE.allow(internalValue, user); // User can decrypt
    encryptedValue = internalValue;
    allowedUser = user;
}`,
        explanation: "Stores encrypted value and grants specific user permission to decrypt. FHE.allow() enables user to decrypt off-chain using FHEVM SDK."
      },
      {
        title: "2. Store with Entropy and Allow",
        code: `function storeAndAllowWithEntropy(
    externalEuint64 encryptedInput,
    bytes calldata inputProof,
    address user,
    uint256 requestId
) external {
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    
    euint64 enhancedValue = FHE.xor(internalValue, entropy);
    FHE.allowThis(enhancedValue);
    FHE.allow(enhancedValue, user); // User can decrypt enhanced value
    encryptedValue = enhancedValue;
}`,
        explanation: "Combines value with entropy, then grants user permission to decrypt the enhanced value. User can decrypt off-chain to see entropy-enhanced result."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Store and Allow", description: "Create encrypted input, encrypt it, and call storeAndAllow() with user address." },
      { step: 3, title: "Request Entropy", description: "Call requestEntropy() for entropy-enhanced storage." },
      { step: 4, title: "Wait for Fulfillment", description: "Check isRequestFulfilled() until true." },
      { step: 5, title: "Store with Entropy", description: "Call storeAndAllowWithEntropy() with encrypted input, proof, user address, and requestId." },
      { step: 6, title: "Decrypt Off-Chain", description: "Allowed user can decrypt the value off-chain using FHEVM SDK with their private key." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should store and allow user to decrypt
✓ Should have correct allowed user address
✓ Should request entropy
✓ Should store with entropy and allow user`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() or FHE.allow() call.",
        solution: "Call FHE.allowThis() for contract use, and FHE.allow() for user decryption."
      },
      {
        error: "Invalid user address",
        cause: "Zero address passed as user parameter.",
        solution: "Always pass a valid user address (not address(0))."
      }
    ]}
  />
);

const EntropyPublicDecryptionTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyPublicDecryption"
    exampleId="public-decryption-publicdecryptsingle"
    category="Decryption"
    description="Learn how to make encrypted values publicly decryptable using FHE.makePubliclyDecryptable(). This example demonstrates public decryption patterns with entropy enhancement."
    whatTeaches={[
      "How to use FHE.makePubliclyDecryptable()",
      "Public decryption patterns",
      "When to use public decryption",
      "How to enhance public decryption with entropy",
      "The trade-off between privacy and accessibility"
    ]}
    whyMatters={[
      "Public decryption enables anyone to decrypt values",
      "Useful for transparent systems where values should be public",
      "Entropy adds randomness even to public values",
      "Use with caution - removes privacy"
    ]}
    contractLogic={[
      {
        title: "1. Store and Make Public",
        code: `function storeAndMakePublic(
    externalEuint64 encryptedInput,
    bytes calldata inputProof
) external {
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    
    // Make publicly decryptable (anyone can decrypt)
    encryptedValue = FHE.makePubliclyDecryptable(internalValue);
}`,
        explanation: "Stores encrypted value and makes it publicly decryptable. Anyone can decrypt this value off-chain using FHEVM SDK."
      },
      {
        title: "2. Store with Entropy and Make Public",
        code: `function storeAndMakePublicWithEntropy(
    externalEuint64 encryptedInput,
    bytes calldata inputProof,
    uint256 requestId
) external {
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    
    euint64 enhancedValue = FHE.xor(internalValue, entropy);
    FHE.allowThis(enhancedValue);
    
    // Make enhanced value publicly decryptable
    encryptedValue = FHE.makePubliclyDecryptable(enhancedValue);
}`,
        explanation: "Combines value with entropy, then makes it publicly decryptable. Anyone can decrypt the entropy-enhanced value."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Store and Make Public", description: "Create encrypted input, encrypt it, and call storeAndMakePublic() with handle and proof." },
      { step: 3, title: "Request Entropy", description: "Call requestEntropy() for entropy-enhanced storage." },
      { step: 4, title: "Wait for Fulfillment", description: "Check isRequestFulfilled() until true." },
      { step: 5, title: "Store with Entropy", description: "Call storeAndMakePublicWithEntropy() with encrypted input, proof, and requestId." },
      { step: 6, title: "Decrypt Off-Chain", description: "Anyone can decrypt the value off-chain using FHEVM SDK (no permission needed)." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should store and make value publicly decryptable
✓ Should request entropy
✓ Should store with entropy and make publicly decryptable`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted value.",
        solution: "Always call FHE.allowThis() on all encrypted values before using them."
      },
      {
        error: "Privacy Warning",
        cause: "Using FHE.makePubliclyDecryptable() removes privacy.",
        solution: "Only use when values should be publicly accessible. Consider FHE.allow() for selective access instead."
      }
    ]}
  />
);

const EntropyAccessControlTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyAccessControl"
    exampleId="access-control-accesscontrol"
    category="Access Control"
    description="Learn how to implement access control with FHE using FHE.allow() and FHE.allowTransient(). This example demonstrates fine-grained permission management with entropy enhancement."
    whatTeaches={[
      "Access control with FHE",
      "FHE.allow() vs FHE.allowTransient()",
      "Permission management patterns",
      "How to grant and revoke user access",
      "Entropy-enhanced access control"
    ]}
    whyMatters={[
      "Access control is essential for security",
      "FHE permissions enable fine-grained control",
      "FHE.allow() grants permanent access",
      "FHE.allowTransient() grants temporary access for single operation"
    ]}
    contractLogic={[
      {
        title: "1. Allow User (Permanent)",
        code: `function allowUser(address user) external {
    require(!allowedUsers[user], "User already allowed");
    
    // Grant permanent decryption rights
    FHE.allow(encryptedValue, user);
    allowedUsers[user] = true;
}`,
        explanation: "Grants user permanent permission to decrypt the encrypted value. User can decrypt off-chain anytime."
      },
      {
        title: "2. Transient Operation (Temporary)",
        code: `function performTransientOperation() external {
    // Grant temporary access for this operation only
    FHE.allowTransient(encryptedValue, msg.sender);
    
    // Use value in operation
    euint64 result = FHE.add(encryptedValue, someOtherValue);
    
    // Access automatically revoked after operation
}`,
        explanation: "Grants temporary permission for a single operation. Access is automatically revoked after the operation completes."
      },
      {
        title: "3. Entropy-Enhanced Access",
        code: `function grantEntropyAccess(address user, uint256 requestId) external {
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    
    euint64 enhancedValue = FHE.xor(encryptedValue, entropy);
    FHE.allowThis(enhancedValue);
    FHE.allow(enhancedValue, user);
}`,
        explanation: "Combines value with entropy, then grants user access to decrypt the enhanced value."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Initialize Value", description: "Create encrypted input, encrypt it, and call initialize() with handle and proof." },
      { step: 3, title: "Allow User", description: "Call allowUser() with user address to grant permanent access." },
      { step: 4, title: "Request Entropy", description: "Call requestEntropy() for entropy-enhanced access." },
      { step: 5, title: "Grant Entropy Access", description: "Call grantEntropyAccess() with user address and requestId." },
      { step: 6, title: "Perform Transient Operation", description: "Call performTransientOperation() to use value temporarily." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should initialize with encrypted value
✓ Should allow user to decrypt
✓ Should perform transient operation
✓ Should request entropy
✓ Should grant entropy-enhanced access`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allow() or FHE.allowTransient() call.",
        solution: "Call FHE.allow() for permanent access or FHE.allowTransient() for temporary access."
      },
      {
        error: "User already allowed",
        cause: "Trying to allow the same user twice.",
        solution: "Check if user is already allowed before calling allowUser()."
      }
    ]}
  />
);

const EntropyInputProofTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyInputProof"
    exampleId="input-proof-inputproofexplanation"
    category="Input Proof"
    description="Learn how input proofs work and why they're required for external encrypted inputs. This example demonstrates input proof validation with entropy enhancement."
    whatTeaches={[
      "What are input proofs",
      "Why input proofs are needed",
      "How to generate input proofs",
      "How input proofs validate encrypted inputs",
      "Security implications of input proofs",
      "Entropy-enhanced input validation"
    ]}
    whyMatters={[
      "Input proofs validate encrypted inputs",
      "Security mechanism against tampering",
      "Prevents invalid or malicious encrypted values",
      "Ensures encryption is correct and from FHEVM SDK"
    ]}
    contractLogic={[
      {
        title: "1. Store with Input Proof",
        code: `function storeWithProof(
    externalEuint64 encryptedInput,
    bytes calldata inputProof
) external {
    // FHE.fromExternal requires inputProof to validate
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    storedValue = internalValue;
}`,
        explanation: "Input proof validates that the encrypted value is properly encrypted and from FHEVM SDK. Without proof, FHE.fromExternal() will fail."
      },
      {
        title: "2. Store with Entropy and Proof",
        code: `function storeWithProofAndEntropy(
    externalEuint64 encryptedInput,
    bytes calldata inputProof,
    uint256 requestId
) external {
    // Validate input with proof
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    
    // Get entropy
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    
    // Combine with entropy
    euint64 enhancedValue = FHE.xor(internalValue, entropy);
    FHE.allowThis(enhancedValue);
    storedValue = enhancedValue;
}`,
        explanation: "Validates input with proof, then combines with entropy. Input proof ensures the user-provided encrypted value is valid before entropy enhancement."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Create Encrypted Input", description: "Use FHEVM SDK to create encrypted input - this automatically generates input proof." },
      { step: 3, title: "Store with Proof", description: "Call storeWithProof() with encrypted input handle and input proof." },
      { step: 4, title: "Request Entropy", description: "Call requestEntropy() for entropy-enhanced storage." },
      { step: 5, title: "Store with Entropy", description: "Call storeWithProofAndEntropy() with encrypted input, proof, and requestId." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should store value with input proof
✓ Should validate input proof correctly
✓ Should request entropy
✓ Should store with entropy and proof`}
    commonErrors={[
      {
        error: "Invalid input proof",
        cause: "Wrong or missing input proof passed to FHE.fromExternal().",
        solution: "Always use the input proof generated by FHEVM SDK when encrypting values. Don't create proofs manually."
      },
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call after FHE.fromExternal().",
        solution: "Always call FHE.allowThis() after FHE.fromExternal() to grant contract permission."
      }
    ]}
  />
);

const EntropyMissingAllowThisTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyMissingAllowThis"
    exampleId="anti-patterns-missingallowthis"
    category="Anti-Patterns"
    description="Learn the common mistake of forgetting FHE.allowThis() and how to avoid it. This example demonstrates the WRONG way (that fails) and the CORRECT way (that works)."
    whatTeaches={[
      "Common mistake: missing FHE.allowThis()",
      "Why FHE.allowThis() is required",
      "How to fix the error",
      "When to call FHE.allowThis()",
      "The difference between wrong and correct patterns"
    ]}
    whyMatters={[
      "This is the most common FHE error",
      "Understanding prevents frustration",
      "Learning from mistakes helps avoid them",
      "Shows both wrong and correct patterns"
    ]}
    contractLogic={[
      {
        title: "❌ WRONG: Missing FHE.allowThis()",
        code: `function initializeWrong(
    externalEuint64 encryptedInput1,
    externalEuint64 encryptedInput2,
    bytes calldata inputProof1,
    bytes calldata inputProof2
) external {
    euint64 internalValue1 = FHE.fromExternal(encryptedInput1, inputProof1);
    euint64 internalValue2 = FHE.fromExternal(encryptedInput2, inputProof2);
    
    // ❌ MISSING: FHE.allowThis(internalValue1);
    // ❌ MISSING: FHE.allowThis(internalValue2);
    
    value1 = internalValue1;
    value2 = internalValue2;
    
    // This will FAIL when trying to use value1 or value2!
}`,
        explanation: "This will fail with SenderNotAllowed() error when trying to use value1 or value2 in FHE operations. Missing FHE.allowThis() calls."
      },
      {
        title: "✅ CORRECT: Using FHE.allowThis()",
        code: `function initializeCorrect(
    externalEuint64 encryptedInput1,
    externalEuint64 encryptedInput2,
    bytes calldata inputProof1,
    bytes calldata inputProof2
) external {
    euint64 internalValue1 = FHE.fromExternal(encryptedInput1, inputProof1);
    euint64 internalValue2 = FHE.fromExternal(encryptedInput2, inputProof2);
    
    // ✅ REQUIRED: Grant contract permission
    FHE.allowThis(internalValue1);
    FHE.allowThis(internalValue2);
    
    value1 = internalValue1;
    value2 = internalValue2;
    
    // Now value1 and value2 can be used in FHE operations!
}`,
        explanation: "This works correctly. FHE.allowThis() grants contract permission to use the encrypted values in FHE operations."
      },
      {
        title: "❌ WRONG: Missing FHE.allowThis() on Entropy",
        code: `function useEntropyWrong(uint256 requestId) external {
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    // ❌ MISSING: FHE.allowThis(entropy);
    
    euint64 result = FHE.xor(value1, entropy); // ❌ FAILS!
}`,
        explanation: "This will fail because entropy is not allowed. Must call FHE.allowThis(entropy) before using it."
      },
      {
        title: "✅ CORRECT: Using FHE.allowThis() on Entropy",
        code: `function useEntropyCorrect(uint256 requestId) external {
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy); // ✅ REQUIRED!
    
    euint64 result = FHE.xor(value1, entropy); // ✅ WORKS!
}`,
        explanation: "This works correctly. FHE.allowThis(entropy) grants permission to use entropy in FHE operations."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Test Wrong Pattern", description: "Call initializeWrong() - this will fail when trying to use values." },
      { step: 3, title: "Test Correct Pattern", description: "Call initializeCorrect() - this works because FHE.allowThis() is called." },
      { step: 4, title: "Request Entropy", description: "Call requestEntropy() for entropy operations." },
      { step: 5, title: "Test Wrong Entropy Usage", description: "Call useEntropyWrong() - this will fail." },
      { step: 6, title: "Test Correct Entropy Usage", description: "Call useEntropyCorrect() - this works because FHE.allowThis(entropy) is called." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should fail when missing FHE.allowThis() (wrong pattern)
✓ Should succeed when using FHE.allowThis() (correct pattern)
✓ Should demonstrate the difference between wrong and correct`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted value or entropy.",
        solution: "Always call FHE.allowThis() on all encrypted values (including entropy) before using them in FHE operations."
      },
      {
        error: "Permission denied",
        cause: "Trying to use encrypted value without permission.",
        solution: "Call FHE.allowThis() immediately after FHE.fromExternal() or after getting entropy from oracle."
      }
    ]}
  />
);

const EntropyViewWithEncryptedTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyViewWithEncrypted"
    exampleId="anti-patterns-viewwithencrypted"
    category="Anti-Patterns"
    description="Learn why FHE operations cannot be used in view or pure functions. This example demonstrates the WRONG way (that fails) and the CORRECT way (that works)."
    whatTeaches={[
      "Why view/pure functions can't use FHE",
      "Limitations of view functions",
      "How to work around this",
      "Why FHE operations are state-modifying",
      "Alternative approaches for view-like behavior"
    ]}
    whyMatters={[
      "Understanding limitations prevents errors",
      "FHE operations modify state symbolically",
      "View functions cannot return euint64",
      "EntropyOracle operations cannot be in view functions"
    ]}
    contractLogic={[
      {
        title: "❌ WRONG: View Function Returning euint64",
        code: `// ❌ This will NOT compile!
function getValue() external view returns (euint64) {
    return encryptedValue; // ❌ Error: Function cannot be declared as view
}`,
        explanation: "This will fail to compile. View functions cannot return euint64 because FHE operations are considered state-modifying."
      },
      {
        title: "❌ WRONG: View Function Getting Entropy",
        code: `// ❌ This will NOT compile!
function getEntropyInView(uint256 requestId) external view returns (euint64) {
    return entropyOracle.getEncryptedEntropy(requestId); // ❌ Error: Not view
}`,
        explanation: "This will fail because EntropyOracle.getEncryptedEntropy() is not a view function. It performs FHE operations."
      },
      {
        title: "✅ CORRECT: Regular Function (Not View)",
        code: `function getValue() external returns (euint64) {
    require(initialized, "Not initialized");
    return encryptedValue; // ✅ This works!
}`,
        explanation: "This works correctly. Regular functions (not view) can return euint64 and perform FHE operations."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Initialize Value", description: "Create encrypted input, encrypt it, and call initialize() with handle and proof." },
      { step: 3, title: "Test Correct Pattern", description: "Call getValue() (regular function) - this works because it's not view." },
      { step: 4, title: "Understand Limitation", description: "Note that getValue() cannot be view because it returns euint64." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should initialize with encrypted value
✓ Should get value using regular function (not view)
✓ Should demonstrate view function limitations`}
    commonErrors={[
      {
        error: "Function cannot be declared as view",
        cause: "Trying to return euint64 from view function or use FHE operations in view function.",
        solution: "Remove 'view' modifier. FHE operations are state-modifying and cannot be in view functions."
      },
      {
        error: "Function cannot be declared as pure",
        cause: "Trying to use FHE operations in pure function.",
        solution: "Remove 'pure' modifier. FHE operations require state access."
      }
    ]}
  />
);

const EntropyHandleLifecycleTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyHandleLifecycle"
    exampleId="handles-handlelifecycle"
    category="Handles"
    description="Learn about handles, symbolic execution, and the lifecycle of encrypted values in FHEVM. This example demonstrates how handles work with EntropyOracle."
    whatTeaches={[
      "What are handles",
      "Symbolic execution in FHEVM",
      "Handle lifecycle and permissions",
      "How handles are generated and used",
      "EntropyOracle handle management",
      "How to use handles in FHE operations"
    ]}
    whyMatters={[
      "Handles are fundamental to FHEVM",
      "Understanding handles helps debug issues",
      "Handles represent encrypted values symbolically",
      "Actual decryption happens off-chain"
    ]}
    contractLogic={[
      {
        title: "1. Store Handle",
        code: `function storeHandle(
    externalEuint64 encryptedInput,
    bytes calldata inputProof
) external {
    // Convert external handle to internal handle
    euint64 internalHandle = FHE.fromExternal(encryptedInput, inputProof);
    
    // Grant contract permission to use handle
    FHE.allowThis(internalHandle);
    
    // Store handle (not actual encrypted data)
    encryptedValue = internalHandle;
}`,
        explanation: "Handles are references to encrypted values, not the actual encrypted data. They're generated by FHEVM SDK and used symbolically in contracts."
      },
      {
        title: "2. Use Handle in FHE Operation",
        code: `function useHandle() external returns (euint64) {
    // Use stored handle in FHE operation
    euint64 one = FHE.asEuint64(1);
    euint64 result = FHE.add(encryptedValue, one);
    
    // Result is also a handle (not decrypted value)
    return result;
}`,
        explanation: "FHE operations work on handles symbolically. The result is also a handle. Actual decryption happens off-chain using FHEVM SDK."
      },
      {
        title: "3. Use Entropy Handle",
        code: `function useEntropyHandle(uint256 requestId) external returns (euint64) {
    // Get entropy handle from oracle
    euint64 entropyHandle = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropyHandle);
    
    // Use entropy handle in FHE operation
    euint64 result = FHE.add(encryptedValue, entropyHandle);
    return result;
}`,
        explanation: "EntropyOracle returns handles for encrypted entropy. These handles can be used in FHE operations just like other handles."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Store Handle", description: "Create encrypted input (generates handle), encrypt it, and call storeHandle() with handle and proof." },
      { step: 3, title: "Use Handle", description: "Call useHandle() to perform FHE operation on stored handle." },
      { step: 4, title: "Request Entropy", description: "Call requestEntropy() to get entropy handle." },
      { step: 5, title: "Use Entropy Handle", description: "Call useEntropyHandle() to use entropy handle in FHE operation." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should store handle
✓ Should use handle in FHE operations
✓ Should request entropy handle
✓ Should use entropy handle in FHE operations`}
    commonErrors={[
      {
        error: "Handle not found",
        cause: "Trying to use handle that doesn't exist or wasn't stored.",
        solution: "Ensure handle is stored before using it. Check initialization status."
      },
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on handle.",
        solution: "Always call FHE.allowThis() on handles before using them in FHE operations."
      }
    ]}
  />
);

const SimpleLotteryTutorial: React.FC = () => (
  <GenericTutorial
    name="SimpleLottery"
    exampleId="advanced-simplelottery"
    category="Advanced"
    description="Learn how to build a fair lottery system using EntropyOracle for random winner selection. This example demonstrates round-based lottery with entropy-based winner selection."
    whatTeaches={[
      "Building lottery systems",
      "Fair randomness with entropy",
      "Participant management",
      "Round-based lottery mechanics",
      "Winner selection using entropy"
    ]}
    whyMatters={[
      "Lotteries need fair randomness",
      "EntropyOracle provides cryptographic randomness",
      "Prevents manipulation of winner selection",
      "Transparent and verifiable lottery system"
    ]}
    contractLogic={[
      {
        title: "1. Enter Lottery",
        code: `function enter() external {
    require(!lotteryComplete, "Lottery already complete");
    require(!hasParticipated[lotteryRound][msg.sender], "Already participated");
    
    participants.push(msg.sender);
    hasParticipated[lotteryRound][msg.sender] = true;
}`,
        explanation: "Users enter the lottery by calling enter(). Each user can only participate once per round. Participants are stored in an array."
      },
      {
        title: "2. Select Winner with Entropy",
        code: `function selectWinner() external payable {
    require(participants.length > 0, "No participants");
    
    // Request entropy for random selection
    bytes32 tag = keccak256("lottery-winner-selection");
    uint256 requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
    
    // Use request ID to select winner (simplified)
    // In production, decrypt entropy and use FHE.mod
    uint256 winnerIndex = requestId % participants.length;
    winner = participants[winnerIndex];
    lotteryComplete = true;
}`,
        explanation: "Requests entropy from EntropyOracle and uses it to select a random winner. The entropy ensures fair and unpredictable winner selection."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Enter Lottery", description: "Multiple users call enter() to participate in the lottery." },
      { step: 3, title: "Select Winner", description: "Call selectWinner() with fee to request entropy and select random winner." },
      { step: 4, title: "Verify Winner", description: "Check winner address and verify it's one of the participants." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should allow users to enter lottery
✓ Should prevent duplicate entries
✓ Should request entropy for winner selection
✓ Should select random winner from participants`}
    commonErrors={[
      {
        error: "Already participated",
        cause: "User trying to enter lottery twice in the same round.",
        solution: "Check hasParticipated mapping before allowing entry. Each user can only participate once per round."
      },
      {
        error: "No participants",
        cause: "Trying to select winner when no one has entered.",
        solution: "Ensure at least one participant has entered before selecting winner."
      }
    ]}
  />
);

const RandomNumberGeneratorTutorial: React.FC = () => (
  <GenericTutorial
    name="RandomNumberGenerator"
    exampleId="advanced-randomnumbergenerator"
    category="Advanced"
    description="Learn how to generate encrypted random numbers using EntropyOracle. This example demonstrates storing and retrieving encrypted random numbers."
    whatTeaches={[
      "Random number generation",
      "Storing encrypted randomness",
      "Request management",
      "Retrieving encrypted random numbers",
      "Multiple random number generation"
    ]}
    whyMatters={[
      "Random numbers are essential for many dApps",
      "Encrypted randomness maintains privacy",
      "EntropyOracle provides cryptographic randomness",
      "Each request generates unique random number"
    ]}
    contractLogic={[
      {
        title: "1. Request Random Number",
        code: `function requestRandomNumber(bytes32 tag) external payable returns (uint256 requestId) {
    require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
    
    // Request entropy from oracle
    requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
    
    // Get encrypted entropy (random number)
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    
    // Store encrypted random number
    randomNumbers[requestId] = entropy;
    isGenerated[requestId] = true;
    totalGenerated++;
    
    return requestId;
}`,
        explanation: "Requests entropy from EntropyOracle and stores it as an encrypted random number. Each request generates a unique random number."
      },
      {
        title: "2. Get Random Number",
        code: `function getRandomNumber(uint256 requestId) external view returns (euint64 randomNumber) {
    require(isGenerated[requestId], "Random number not generated");
    return randomNumbers[requestId];
}`,
        explanation: "Retrieves the encrypted random number for a specific request ID. The number is encrypted and can be decrypted off-chain."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Request Random Number", description: "Call requestRandomNumber() with unique tag and fee to generate encrypted random number." },
      { step: 3, title: "Get Random Number", description: "Call getRandomNumber() with request ID to retrieve encrypted random number." },
      { step: 4, title: "Decrypt Off-Chain", description: "Decrypt the random number off-chain using FHEVM SDK to see actual value." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should request random number
✓ Should store encrypted random number
✓ Should retrieve random number by request ID
✓ Should track total generated random numbers`}
    commonErrors={[
      {
        error: "Random number not generated",
        cause: "Trying to get random number for request ID that doesn't exist.",
        solution: "Ensure requestRandomNumber() was called and completed before getting the random number."
      },
      {
        error: "Insufficient fee",
        cause: "Not sending enough ETH when requesting random number.",
        solution: "Always send exactly 0.00001 ETH (the entropy oracle fee)."
      }
    ]}
  />
);

const EntropyNFTTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyNFT"
    exampleId="advanced-entropynft"
    category="Advanced"
    description="Learn how to mint ERC721 NFTs with trait selection using EntropyOracle for randomness. This example demonstrates NFT minting with entropy-based trait selection and IPFS metadata."
    whatTeaches={[
      "ERC721 NFT minting",
      "Trait selection with entropy",
      "IPFS metadata integration",
      "Two-phase minting (request + complete)",
      "Entropy-based randomness for traits"
    ]}
    whyMatters={[
      "NFTs need random trait selection",
      "EntropyOracle provides fair randomness",
      "Prevents manipulation of NFT traits",
      "Transparent and verifiable trait selection"
    ]}
    contractLogic={[
      {
        title: "1. Request Mint",
        code: `function requestMint(bytes32 tag) external payable returns (uint256 tokenId, uint256 requestId) {
    require(msg.value >= entropyOracle.getFee(), "Insufficient fee");
    
    tokenId = nextTokenId++;
    
    // Request entropy for trait selection
    requestId = entropyOracle.requestEntropy{value: msg.value}(tag);
    
    // Store NFT request
    nftData[tokenId] = NFTData({
        tokenId: tokenId,
        entropyRequestId: requestId,
        minted: false
    });
    
    return (tokenId, requestId);
}`,
        explanation: "First phase of minting: request entropy for trait selection. Returns token ID and request ID. Traits will be selected using entropy."
      },
      {
        title: "2. Complete Mint",
        code: `function completeMint(uint256 tokenId, string memory tokenURI) external {
    NFTData storage nft = nftData[tokenId];
    require(!nft.minted, "NFT already minted");
    require(entropyOracle.isRequestFulfilled(nft.entropyRequestId), "Entropy not ready");
    
    // Get encrypted entropy
    euint64 entropy = entropyOracle.getEncryptedEntropy(nft.entropyRequestId);
    
    // Traits selected off-chain based on entropy
    // In production: Use FHE.mod(entropy, backgrounds.length) etc.
    nft.tokenURI = tokenURI;
    nft.minted = true;
    
    // Mint NFT
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
}`,
        explanation: "Second phase: complete minting after entropy is ready. Traits are selected using entropy (off-chain or with FHE operations), then NFT is minted with metadata URI."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Request Mint", description: "Call requestMint() with unique tag and fee to request entropy for trait selection." },
      { step: 3, title: "Wait for Entropy", description: "Check isRequestFulfilled() until entropy is ready." },
      { step: 4, title: "Select Traits", description: "Use entropy to select traits (background, accessory, expression) - can be done off-chain or with FHE operations." },
      { step: 5, title: "Complete Mint", description: "Call completeMint() with token ID and IPFS metadata URI to mint the NFT." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should request mint with entropy
✓ Should store NFT request data
✓ Should complete mint after entropy ready
✓ Should mint ERC721 NFT with metadata`}
    commonErrors={[
      {
        error: "Entropy not ready",
        cause: "Trying to complete mint before entropy is fulfilled.",
        solution: "Always check isRequestFulfilled() before calling completeMint()."
      },
      {
        error: "NFT already minted",
        cause: "Trying to complete mint for already minted NFT.",
        solution: "Check nft.minted before completing mint. Each token can only be minted once."
      }
    ]}
  />
);

const EntropyERC7984TokenTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyERC7984Token"
    exampleId="openzeppelin-erc7984token"
    category="OpenZeppelin"
    description="Learn how to implement ERC7984 confidential tokens with EntropyOracle integration. This example demonstrates encrypted token balances, transfers, and minting with entropy."
    whatTeaches={[
      "ERC7984 standard implementation",
      "Confidential token balances",
      "Encrypted transfers",
      "Minting with entropy",
      "Encrypted total supply"
    ]}
    whyMatters={[
      "ERC7984 enables private token transfers",
      "EntropyOracle adds randomness to minting",
      "Balances remain encrypted on-chain",
      "Privacy-preserving token operations"
    ]}
    contractLogic={[
      {
        title: "1. Transfer Encrypted Tokens",
        code: `function transfer(address to, externalEuint64 encryptedAmount, bytes calldata inputProof) external {
    euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
    FHE.allowThis(amount);
    
    euint64 senderBalance = encryptedBalances[msg.sender];
    FHE.allowThis(senderBalance);
    
    // Check balance and transfer
    euint64 newSenderBalance = FHE.sub(senderBalance, amount);
    euint64 newReceiverBalance = FHE.add(encryptedBalances[to], amount);
    
    encryptedBalances[msg.sender] = newSenderBalance;
    encryptedBalances[to] = newReceiverBalance;
}`,
        explanation: "Transfers encrypted tokens between addresses. All balances and amounts remain encrypted. Uses FHE operations for balance checks and transfers."
      },
      {
        title: "2. Mint with Entropy",
        code: `function mintWithEntropy(
    uint256 requestId,
    externalEuint64 encryptedAmount,
    bytes calldata inputProof
) external {
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    
    euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
    FHE.allowThis(amount);
    
    // Combine amount with entropy for randomness
    euint64 mintAmount = FHE.xor(amount, entropy);
    FHE.allowThis(mintAmount);
    
    // Mint to user
    encryptedBalances[msg.sender] = FHE.add(encryptedBalances[msg.sender], mintAmount);
}`,
        explanation: "Mints tokens using entropy for randomness. The minted amount is combined with entropy using XOR, adding randomness to the mint operation."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Request Mint with Entropy", description: "Call requestMintWithEntropy() with unique tag and fee." },
      { step: 3, title: "Mint with Entropy", description: "Call mintWithEntropy() with request ID, encrypted amount, and proof." },
      { step: 4, title: "Transfer Tokens", description: "Call transfer() with recipient address, encrypted amount, and proof." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should request mint with entropy
✓ Should mint tokens with entropy enhancement
✓ Should transfer encrypted tokens
✓ Should maintain encrypted balances`}
    commonErrors={[
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted balance or amount.",
        solution: "Always call FHE.allowThis() on all encrypted values before using them in FHE operations."
      },
      {
        error: "Entropy not ready",
        cause: "Trying to mint before entropy is fulfilled.",
        solution: "Always check isRequestFulfilled() before using entropy."
      }
    ]}
  />
);

const EntropyERC7984ToERC20WrapperTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyERC7984ToERC20Wrapper"
    exampleId="openzeppelin-erc7984toerc20wrapper"
    category="OpenZeppelin"
    description="Learn how to wrap ERC7984 confidential tokens into ERC20 tokens with EntropyOracle. This example demonstrates bridging between confidential and public token standards."
    whatTeaches={[
      "Token wrapping patterns",
      "ERC7984 to ERC20 conversion",
      "Bridge patterns",
      "Interoperability between token standards",
      "Entropy-enhanced wrapping operations"
    ]}
    whyMatters={[
      "Wrapping enables interoperability",
      "Bridges confidential and public tokens",
      "Allows use of confidential tokens in DeFi protocols",
      "Entropy adds randomness to wrapping operations"
    ]}
    contractLogic={[
      {
        title: "1. Wrap ERC7984 to ERC20",
        code: `function wrap(
    externalEuint64 encryptedAmount,
    bytes calldata inputProof
) external {
    // Convert encrypted amount
    euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
    FHE.allowThis(amount);
    
    // Lock ERC7984 tokens
    erc7984Token.transferFrom(msg.sender, address(this), amount);
    
    // Mint ERC20 wrapped tokens
    erc20Token.mint(msg.sender, amount);
}`,
        explanation: "Wraps ERC7984 confidential tokens into ERC20 tokens. Locks ERC7984 tokens in wrapper contract and mints equivalent ERC20 tokens."
      },
      {
        title: "2. Unwrap ERC20 to ERC7984",
        code: `function unwrap(uint256 amount) external {
    // Burn ERC20 wrapped tokens
    erc20Token.burnFrom(msg.sender, amount);
    
    // Release ERC7984 tokens
    erc7984Token.transfer(msg.sender, amount);
}`,
        explanation: "Unwraps ERC20 tokens back to ERC7984 tokens. Burns ERC20 tokens and releases locked ERC7984 tokens."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys ERC7984 token, ERC20 token, and wrapper contract." },
      { step: 2, title: "Wrap Tokens", description: "Call wrap() with encrypted amount and proof to wrap ERC7984 tokens into ERC20." },
      { step: 3, title: "Unwrap Tokens", description: "Call unwrap() with amount to convert ERC20 tokens back to ERC7984." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should wrap ERC7984 tokens to ERC20
✓ Should unwrap ERC20 tokens to ERC7984
✓ Should maintain 1:1 conversion ratio`}
    commonErrors={[
      {
        error: "Insufficient balance",
        cause: "Trying to wrap more tokens than available.",
        solution: "Check ERC7984 balance before wrapping. Ensure sufficient tokens are approved for wrapper contract."
      },
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted amount.",
        solution: "Always call FHE.allowThis() on encrypted amounts before using them."
      }
    ]}
  />
);

const EntropySwapERC7984ToERC20Tutorial: React.FC = () => (
  <GenericTutorial
    name="EntropySwapERC7984ToERC20"
    exampleId="openzeppelin-swaperc7984toerc20"
    category="OpenZeppelin"
    description="Learn how to swap ERC7984 confidential tokens for ERC20 tokens with EntropyOracle. This example demonstrates token swapping with encrypted amounts."
    whatTeaches={[
      "Token swapping mechanics",
      "ERC7984 to ERC20 swaps",
      "Encrypted amount calculations",
      "Swap rate calculations",
      "Entropy-enhanced swap operations"
    ]}
    whyMatters={[
      "Swaps enable token conversion",
      "EntropyOracle adds randomness to swaps",
      "Allows trading between confidential and public tokens",
      "Privacy-preserving swap operations"
    ]}
    contractLogic={[
      {
        title: "1. Swap ERC7984 for ERC20",
        code: `function swapERC7984ForERC20(
    externalEuint64 encryptedAmount,
    bytes calldata inputProof
) external {
    euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
    FHE.allowThis(amount);
    
    // Calculate ERC20 output amount (with swap rate)
    euint64 outputAmount = FHE.mul(amount, swapRate);
    FHE.allowThis(outputAmount);
    
    // Transfer ERC7984 tokens from user
    erc7984Token.transferFrom(msg.sender, address(this), amount);
    
    // Transfer ERC20 tokens to user
    erc20Token.transfer(msg.sender, outputAmount);
}`,
        explanation: "Swaps ERC7984 tokens for ERC20 tokens. Uses encrypted amount calculations with swap rate. All amounts remain encrypted during calculation."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys ERC7984 token, ERC20 token, and swap contract." },
      { step: 2, title: "Approve Tokens", description: "Approve swap contract to spend ERC7984 tokens." },
      { step: 3, title: "Swap Tokens", description: "Call swapERC7984ForERC20() with encrypted amount and proof to swap tokens." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should swap ERC7984 tokens for ERC20
✓ Should calculate swap rate correctly
✓ Should transfer tokens correctly`}
    commonErrors={[
      {
        error: "Insufficient balance",
        cause: "Trying to swap more tokens than available.",
        solution: "Check ERC7984 balance and ensure sufficient tokens are approved for swap contract."
      },
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted amount.",
        solution: "Always call FHE.allowThis() on encrypted amounts before using them in FHE operations."
      }
    ]}
  />
);

const EntropySwapERC7984ToERC7984Tutorial: React.FC = () => (
  <GenericTutorial
    name="EntropySwapERC7984ToERC7984"
    exampleId="openzeppelin-swaperc7984toerc7984"
    category="OpenZeppelin"
    description="Learn how to swap between two ERC7984 confidential tokens with EntropyOracle. This example demonstrates cross-token swaps with encrypted amounts."
    whatTeaches={[
      "Cross-token swaps",
      "ERC7984 to ERC7984 swaps",
      "Encrypted amount calculations",
      "Swap rate calculations with FHE",
      "Entropy-enhanced swap operations"
    ]}
    whyMatters={[
      "Cross-token swaps are essential",
      "EntropyOracle adds randomness to swap calculations",
      "Allows trading between different confidential tokens",
      "Privacy-preserving cross-token swaps"
    ]}
    contractLogic={[
      {
        title: "1. Swap Between ERC7984 Tokens",
        code: `function swap(
    address tokenIn,
    address tokenOut,
    externalEuint64 encryptedAmountIn,
    bytes calldata inputProof
) external {
    euint64 amountIn = FHE.fromExternal(encryptedAmountIn, inputProof);
    FHE.allowThis(amountIn);
    
    // Calculate output amount (with swap rate)
    euint64 amountOut = FHE.mul(amountIn, swapRates[tokenIn][tokenOut]);
    FHE.allowThis(amountOut);
    
    // Transfer input tokens from user
    ERC7984Token(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    
    // Transfer output tokens to user
    ERC7984Token(tokenOut).transfer(msg.sender, amountOut);
}`,
        explanation: "Swaps between two ERC7984 tokens. Uses encrypted amount calculations with swap rate. All amounts remain encrypted during the swap operation."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys two ERC7984 tokens and swap contract." },
      { step: 2, title: "Approve Tokens", description: "Approve swap contract to spend input token." },
      { step: 3, title: "Swap Tokens", description: "Call swap() with token addresses, encrypted amount, and proof to swap tokens." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should swap between ERC7984 tokens
✓ Should calculate swap rate correctly
✓ Should transfer tokens correctly`}
    commonErrors={[
      {
        error: "Insufficient balance",
        cause: "Trying to swap more tokens than available.",
        solution: "Check token balance and ensure sufficient tokens are approved for swap contract."
      },
      {
        error: "SenderNotAllowed()",
        cause: "Missing FHE.allowThis() call on encrypted amount.",
        solution: "Always call FHE.allowThis() on encrypted amounts before using them in FHE operations."
      }
    ]}
  />
);

const EntropyVestingWalletTutorial: React.FC = () => (
  <GenericTutorial
    name="EntropyVestingWallet"
    exampleId="openzeppelin-vestingwallet"
    category="OpenZeppelin"
    description="Learn how to implement a vesting wallet with encrypted amounts and EntropyOracle integration. This example demonstrates time-based vesting with encrypted amounts."
    whatTeaches={[
      "Vesting mechanics",
      "Time-based vesting schedules",
      "Encrypted vesting amounts",
      "Releasing vested tokens",
      "Entropy-enhanced vesting creation"
    ]}
    whyMatters={[
      "Vesting is common in DeFi",
      "Encrypted amounts maintain privacy",
      "Time-based release schedules",
      "Entropy adds randomness to vesting creation"
    ]}
    contractLogic={[
      {
        title: "1. Create Vesting with Entropy",
        code: `function createVestingWithEntropy(
    address beneficiary,
    uint256 requestId,
    externalEuint64 encryptedAmount,
    bytes calldata inputProof,
    uint64 duration
) external {
    euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
    FHE.allowThis(amount);
    
    vestingSchedules[beneficiary] = VestingSchedule({
        totalAmount: amount,
        releasedAmount: FHE.asEuint64(0),
        startTime: uint64(block.timestamp),
        duration: duration,
        initialized: true
    });
}`,
        explanation: "Creates a vesting schedule with encrypted amount. The amount is encrypted and remains private. Vesting starts at current timestamp and lasts for specified duration."
      },
      {
        title: "2. Release Vested Tokens",
        code: `function release(address beneficiary, externalEuint64 encryptedAmount, bytes calldata inputProof) external {
    VestingSchedule storage schedule = vestingSchedules[beneficiary];
    require(schedule.initialized, "Vesting not found");
    
    // Calculate releasable amount based on time
    uint64 elapsed = uint64(block.timestamp) - schedule.startTime;
    // In production: Use FHE operations to calculate encrypted releasable amount
    
    euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
    FHE.allowThis(amount);
    
    // Update released amount
    schedule.releasedAmount = FHE.add(schedule.releasedAmount, amount);
}`,
        explanation: "Releases vested tokens based on time elapsed. The released amount is encrypted and added to the released amount. In production, use FHE operations to calculate releasable amount."
      }
    ]}
    testSteps={[
      { step: 1, title: "Deploy Contracts", description: "Test fixture deploys all required contracts." },
      { step: 2, title: "Request Vesting with Entropy", description: "Call requestVestingWithEntropy() with unique tag and fee." },
      { step: 3, title: "Create Vesting", description: "Call createVestingWithEntropy() with beneficiary, request ID, encrypted amount, proof, and duration." },
      { step: 4, title: "Wait for Vesting Period", description: "Advance time to allow vesting period to elapse." },
      { step: 5, title: "Release Tokens", description: "Call release() with beneficiary, encrypted amount, and proof to release vested tokens." }
    ]}
    expectedOutputs={`✓ Should deploy successfully
✓ Should request vesting with entropy
✓ Should create vesting schedule
✓ Should release vested tokens
✓ Should track released amounts`}
    commonErrors={[
      {
        error: "Vesting already exists",
        cause: "Trying to create vesting for beneficiary that already has one.",
        solution: "Check if vesting already exists before creating. Each beneficiary can only have one vesting schedule."
      },
      {
        error: "Entropy not ready",
        cause: "Trying to create vesting before entropy is fulfilled.",
        solution: "Always check isRequestFulfilled() before using entropy."
      }
    ]}
  />
);

export default Docs;

