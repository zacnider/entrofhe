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
  GlobeAltIcon,
  AcademicCapIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CalculatorIcon
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
            Learn How to Build
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-cyan-400 dark:to-primary-400 bg-clip-text text-transparent">
              Privacy-Preserving Smart Contracts
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-primary-600 dark:text-slate-400 mb-6 max-w-3xl mx-auto leading-relaxed">
            22 standalone FHEVM examples teaching you step-by-step. 
            Each example demonstrates one clear concept with code, tests, and documentation.
          </p>
          {/* Zama FHEVM Badge */}
          <div className="mb-10 flex items-center justify-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-cyan-700 rounded-full">
              <span className="text-sm font-semibold text-blue-700 dark:text-cyan-300">Built with</span>
              <a 
                href="https://docs.zama.org/protocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 transition-colors"
              >
                Zama FHEVM
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link
              to="/examples"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 dark:bg-cyan-600 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-cyan-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              <AcademicCapIcon className="h-6 w-6" />
              <span>Start Learning</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white dark:bg-slate-800 text-primary-700 dark:text-cyan-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-semibold text-lg border-2 border-primary-300 dark:border-cyan-700"
            >
              <BookOpenIcon className="h-6 w-6" />
              <span>Read Tutorials</span>
            </Link>
            <a
              href="https://github.com/zacnider/entrofhe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white dark:bg-slate-800 text-primary-700 dark:text-cyan-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-semibold text-lg border-2 border-primary-300 dark:border-cyan-700"
            >
              <CodeBracketIcon className="h-6 w-6" />
              <span>View Source Code</span>
              <ArrowRightIcon className="h-5 w-5" />
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-500 dark:text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>22 Standalone Examples</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>10 Learning Categories</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span>Step-by-Step Tutorials</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            What You'll Learn
          </h2>
          <p className="text-xl text-primary-600 dark:text-slate-400 max-w-2xl mx-auto">
            Progressive learning path from basic FHE operations to advanced real-world patterns
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <CalculatorIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Basic Operations</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Learn FHE arithmetic, comparisons, and counters with step-by-step examples
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Encryption Patterns</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Understand how to encrypt and store values on-chain using FHE
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <LightBulbIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Access Control</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Master FHE permissions (FHE.allow, FHE.allowTransient) with practical examples
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
              <RocketLaunchIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Real-World Patterns</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Build complete applications like lotteries, NFTs, and token swaps
            </p>
          </div>
        </div>
      </section>

      {/* Zama FHEVM Technology Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
              Learn Zama FHEVM Through Examples
            </h2>
            <p className="text-xl text-primary-600 dark:text-slate-400 max-w-3xl mx-auto">
              All examples demonstrate real-world usage of <strong className="text-blue-600 dark:text-cyan-400">Zama FHEVM</strong> features. Learn by doing with hands-on examples.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-4">What is Zama FHEVM?</h3>
              <p className="text-primary-600 dark:text-slate-400 mb-4">
                Zama FHEVM is the core framework of the Zama Confidential Blockchain Protocol. It enables confidential smart contracts on EVM-compatible blockchains by leveraging Fully Homomorphic Encryption (FHE).
              </p>
              <p className="text-primary-600 dark:text-slate-400">
                All examples in this hub demonstrate real-world usage of Zama FHEVM's core features, including encrypted arithmetic operations, access control patterns, and public decryption.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-4">What You'll Learn</h3>
              <ul className="space-y-2 text-primary-600 dark:text-slate-400">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>ZamaEthereumConfig</strong>: All contracts inherit from Zama's network configuration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>FHE Operations</strong>: Using Zama's FHE library (FHE.add, FHE.sub, FHE.mul, FHE.eq, FHE.xor, etc.)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Encrypted Types</strong>: Using Zama's encrypted integer types (euint64, externalEuint64)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Access Control</strong>: Using Zama's permission system (FHE.allow, FHE.allowThis, FHE.allowTransient)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Zama FHEVM Relayer</strong>: All encrypted operations use Zama's relayer</span>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a 
                  href="https://docs.zama.org/protocol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-cyan-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-cyan-700 transition-colors text-sm font-semibold"
                >
                  <span>📚 Documentation</span>
                </a>
                <a 
                  href="https://www.zama.org/developer-hub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 border border-blue-300 dark:border-cyan-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold"
                >
                  <span>🎓 Developer Hub</span>
                </a>
                <a 
                  href="https://github.com/zama-ai/fhevm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 border border-blue-300 dark:border-cyan-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold"
                >
                  <span>💻 GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Examples Work Section */}
      <section className="py-12 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
              How Examples Are Structured
            </h2>
            <p className="text-xl text-primary-600 dark:text-slate-400">
              Each example follows a clear learning structure
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Clone Example</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                Each example is a standalone GitHub repository you can clone and study
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Study Code</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                Learn from well-documented contracts and comprehensive test files
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Run Tests</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                See correct usage patterns and common pitfalls demonstrated in tests
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 dark:bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-slate-100 mb-2">Build Your Own</h3>
              <p className="text-primary-600 dark:text-slate-400 text-sm">
                Apply what you learned to your own privacy-preserving smart contracts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Categories Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            Example Categories
          </h2>
          <p className="text-xl text-primary-600 dark:text-slate-400">
            22 examples organized by learning path
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/examples?category=basic"
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-cyan-900/50 transition">
              <CalculatorIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Basic Examples</h3>
            <p className="text-primary-600 dark:text-slate-400 mb-4">
              3 examples teaching core FHE operations (arithmetic, comparisons, counters)
            </p>
            <span className="text-primary-600 dark:text-cyan-400 font-semibold flex items-center space-x-1">
              <span>Explore Examples</span>
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
          <Link
            to="/examples?category=decryption"
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-cyan-900/50 transition">
              <LightBulbIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Decryption Examples</h3>
            <p className="text-primary-600 dark:text-slate-400 mb-4">
              4 examples teaching user and public decryption patterns with FHE.allow
            </p>
            <span className="text-primary-600 dark:text-cyan-400 font-semibold flex items-center space-x-1">
              <span>Explore Examples</span>
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
          <Link
            to="/examples?category=advanced"
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-cyan-900/50 transition">
              <RocketLaunchIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-2">Advanced Examples</h3>
            <p className="text-primary-600 dark:text-slate-400 mb-4">
              3 examples teaching real-world applications (lotteries, NFTs, random numbers)
            </p>
            <span className="text-primary-600 dark:text-cyan-400 font-semibold flex items-center space-x-1">
              <span>Explore Examples</span>
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Learning Resources Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-slate-800 dark:to-slate-900 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Learning Resources</h2>
            <p className="text-primary-100 dark:text-slate-300">Everything you need to master FHEVM</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">22</div>
              <div className="text-primary-100 dark:text-slate-300">Standalone Examples</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10</div>
              <div className="text-primary-100 dark:text-slate-300">Learning Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-primary-100 dark:text-slate-300">Test Coverage</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Auto</div>
              <div className="text-primary-100 dark:text-slate-300">Generated Docs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Learning Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            Start Learning
          </h2>
          <p className="text-xl text-primary-600 dark:text-slate-400">
            Choose your learning path
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/examples?type=tutorial"
            className="bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-primary-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-cyan-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <AcademicCapIcon className="h-10 w-10 text-primary-600 dark:text-cyan-400" />
              <ArrowRightIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-2">Tutorial Examples</h3>
            <p className="text-primary-600 dark:text-slate-400">
              22 step-by-step examples with code, tests, and documentation
            </p>
          </Link>
          <Link
            to="/examples?type=live"
            className="bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-primary-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-cyan-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <CubeIcon className="h-10 w-10 text-primary-600 dark:text-cyan-400" />
              <ArrowRightIcon className="h-6 w-6 text-primary-600 dark:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-2">Live Examples</h3>
            <p className="text-primary-600 dark:text-slate-400">
              Try deployed contracts on Sepolia: Lottery, Random Numbers, and NFT
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
              Complete guides, tutorials, and API reference
            </p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-slate-800 dark:to-slate-900 rounded-3xl text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Learn FHEVM?
          </h2>
          <p className="text-xl text-primary-100 dark:text-slate-300 mb-8">
            Start with basic examples and progress to advanced patterns. Each example teaches one clear concept with step-by-step guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/examples"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg shadow-lg"
            >
              <AcademicCapIcon className="h-6 w-6" />
              <span>Start Learning</span>
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-semibold text-lg"
            >
              <BookOpenIcon className="h-6 w-6" />
              <span>Read Tutorials</span>
            </Link>
            <a
              href="https://github.com/zacnider/entrofhe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-semibold text-lg"
            >
              <CodeBracketIcon className="h-6 w-6" />
              <span>View Source</span>
            </a>
          </div>
        </div>
      </section>

      {/* Example Context */}
      <section className="py-8 bg-gray-50 dark:bg-slate-900 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-4 text-center">Example Context</h3>
          <p className="text-primary-600 dark:text-slate-400 mb-4 text-center max-w-2xl mx-auto">
            All examples use a practical scenario (encrypted randomness) to teach FHEVM concepts. This gives you real-world context while learning, rather than abstract examples.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm mt-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="font-semibold text-primary-700 dark:text-cyan-400 mb-1">Example Contract</div>
              <div className="font-mono text-primary-600 dark:text-slate-300 break-all text-xs">
                0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361
              </div>
              <div className="text-primary-500 dark:text-slate-400 text-xs mt-1">Sepolia Testnet</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="font-semibold text-primary-700 dark:text-cyan-400 mb-1">Learning Focus</div>
              <div className="text-primary-600 dark:text-slate-300">
                FHEVM patterns and concepts, not the randomness contract itself
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

