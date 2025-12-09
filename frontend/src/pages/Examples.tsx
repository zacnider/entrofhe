import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSendTransaction } from 'wagmi';
import { parseEther, keccak256, stringToBytes } from 'viem';
import { toast } from 'react-toastify';
import { DocumentDuplicateIcon, CheckIcon, PlayIcon, CodeBracketIcon, UserPlusIcon, TrophyIcon, SparklesIcon, CubeIcon, PhotoIcon, CalculatorIcon, LockClosedIcon, KeyIcon, ShieldCheckIcon, DocumentTextIcon, ExclamationTriangleIcon, EyeIcon, LinkIcon, XMarkIcon, CommandLineIcon, RocketLaunchIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useFHEVM } from '../hooks/useFHEVM';
import { useExampleAPI } from '../hooks/useExampleAPI';
import { pinataService } from '../utils/pinata';
import SimpleLotteryABI from '../abis/SimpleLottery.json';
import RandomNumberGeneratorABI from '../abis/RandomNumberGenerator.json';
import EntropyNFTABI from '../abis/EntropyNFT.json';
import EntropyOracleABI from '../abis/EntropyOracle.json';

const ENTROPY_ORACLE_ADDRESS = process.env.REACT_APP_ENTROPY_ORACLE_ADDRESS || '0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361';
const SIMPLE_LOTTERY_ADDRESS = process.env.REACT_APP_SIMPLE_LOTTERY_ADDRESS || '0x92B9520EBf1bdF43784c3dbcAD57CB4bc8A84544';
const RANDOM_NUMBER_GENERATOR_ADDRESS = process.env.REACT_APP_RANDOM_NUMBER_GENERATOR_ADDRESS || '0x571A1A4cA7Ca5c439E8898251d7D730a4042a463';
const ENTROPY_NFT_ADDRESS = process.env.REACT_APP_ENTROPY_NFT_ADDRESS || '0xeEcda3b643b9153e7d4D7686E0774e6d5Ad323b7';

const Examples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'tutorial'>('live');
  const [selectedExample, setSelectedExample] = useState<string>('lottery');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'basic', label: 'Basic' },
    { value: 'encryption', label: 'Encryption' },
    { value: 'user-decryption', label: 'User Decryption' },
    { value: 'public-decryption', label: 'Public Decryption' },
    { value: 'access-control', label: 'Access Control' },
    { value: 'input-proof', label: 'Input Proof' },
    { value: 'anti-patterns', label: 'Anti-Patterns' },
    { value: 'handles', label: 'Handles' },
    { value: 'openzeppelin', label: 'OpenZeppelin' },
  ];

  const tutorialExamples = [
    {
      title: "EntropyCounter",
      description: "Counter using EntropyOracle for encrypted randomness",
      category: "basic",
      path: "basic-simplecounter",
      icon: <CalculatorIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyArithmetic",
      description: "FHE arithmetic operations using EntropyOracle",
      category: "basic",
      path: "basic-arithmetic",
      icon: <CalculatorIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyEqualityComparison",
      description: "FHE equality comparison using EntropyOracle",
      category: "basic",
      path: "basic-equalitycomparison",
      icon: <CalculatorIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyEncryption",
      description: "Encrypt and store values using EntropyOracle",
      category: "encryption",
      path: "encryption-encryptsingle",
      icon: <LockClosedIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyUserDecryption",
      description: "User decrypt using EntropyOracle and FHE.allow",
      category: "user-decryption",
      path: "user-decryption-userdecryptsingle",
      icon: <KeyIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyPublicDecryption",
      description: "Public decrypt using EntropyOracle and makePubliclyDecryptable",
      category: "public-decryption",
      path: "public-decryption-publicdecryptsingle",
      icon: <KeyIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyAccessControl",
      description: "Access control with EntropyOracle, FHE.allow and allowTransient",
      category: "access-control",
      path: "access-control-accesscontrol",
      icon: <ShieldCheckIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyInputProof",
      description: "Input proofs with EntropyOracle integration",
      category: "input-proof",
      path: "input-proof-inputproofexplanation",
      icon: <DocumentTextIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyMissingAllowThis",
      description: "Missing FHE.allowThis() permissions with EntropyOracle (ANTI-PATTERN)",
      category: "anti-patterns",
      path: "anti-patterns-missingallowthis",
      icon: <ExclamationTriangleIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyViewWithEncrypted",
      description: "View functions with encrypted values and EntropyOracle (ANTI-PATTERN)",
      category: "anti-patterns",
      path: "anti-patterns-viewwithencrypted",
      icon: <EyeIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyHandleLifecycle",
      description: "Understanding handles and symbolic execution with EntropyOracle",
      category: "handles",
      path: "handles-handlelifecycle",
      icon: <LinkIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyERC7984Token",
      description: "Basic ERC7984 confidential token implementation with EntropyOracle",
      category: "openzeppelin",
      path: "openzeppelin-erc7984token",
      icon: <CubeIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyERC7984ToERC20Wrapper",
      description: "Wrapper contract to convert ERC7984 to ERC20 tokens with EntropyOracle",
      category: "openzeppelin",
      path: "openzeppelin-erc7984toerc20wrapper",
      icon: <CubeIcon className="h-6 w-6" />,
    },
    {
      title: "EntropySwapERC7984ToERC20",
      description: "Swap ERC7984 confidential tokens to ERC20 tokens with EntropyOracle",
      category: "openzeppelin",
      path: "openzeppelin-swaperc7984toerc20",
      icon: <CubeIcon className="h-6 w-6" />,
    },
    {
      title: "EntropySwapERC7984ToERC7984",
      description: "Swap between two ERC7984 tokens with EntropyOracle integration",
      category: "openzeppelin",
      path: "openzeppelin-swaperc7984toerc7984",
      icon: <CubeIcon className="h-6 w-6" />,
    },
    {
      title: "EntropyVestingWallet",
      description: "Vesting wallet with encrypted amounts and EntropyOracle integration",
      category: "openzeppelin",
      path: "openzeppelin-vestingwallet",
      icon: <CubeIcon className="h-6 w-6" />,
    },
  ];

  const filteredExamples = selectedCategory === 'all' 
    ? tutorialExamples 
    : tutorialExamples.filter(ex => ex.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100 mb-4">
          Example Contracts
        </h1>
        <p className="text-lg text-primary-600 dark:text-slate-400">
          Test and interact with deployed example contracts that use Entrofhe entropy oracle
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
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300 mb-4">
              Live Examples
            </h2>
            <p className="text-primary-600 dark:text-slate-400 mb-6">
              Interact with deployed contracts on Sepolia testnet
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <ExampleCard
              id="lottery"
              title="Simple Lottery"
              description="Enter and select a winner using entropy"
              icon={<TrophyIcon className="h-8 w-8" />}
              isSelected={selectedExample === 'lottery'}
              onClick={() => setSelectedExample('lottery')}
            />
            <ExampleCard
              id="random"
              title="Random Number Generator"
              description="Generate encrypted random numbers"
              icon={<SparklesIcon className="h-8 w-8" />}
              isSelected={selectedExample === 'random'}
              onClick={() => setSelectedExample('random')}
            />
            <ExampleCard
              id="entropy-nft"
              title="EntropyNFT"
              description="Mint real NFTs with IPFS metadata"
              icon={<CubeIcon className="h-8 w-8" />}
              isSelected={selectedExample === 'entropy-nft'}
              onClick={() => setSelectedExample('entropy-nft')}
            />
          </div>

          {/* Live Demo Section */}
          {selectedExample === 'lottery' && <SimpleLotteryDemo />}
          {selectedExample === 'random' && <RandomNumberGeneratorDemo />}
          {selectedExample === 'entropy-nft' && <EntropyNFTDemo />}
        </div>
      )}

      {/* Tutorial Examples Tab */}
      {activeTab === 'tutorial' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary-800 dark:text-cyan-300 mb-4">
              Tutorial Examples
            </h2>
            <p className="text-primary-600 dark:text-slate-400 mb-6">
              Educational examples demonstrating EntropyOracle integration patterns. Each example shows how to use entropy in different FHEVM scenarios.
            </p>
            
            {/* Category Dropdown */}
            <div className="mb-6">
              <label htmlFor="category-select" className="block text-sm font-medium text-primary-700 dark:text-cyan-400 mb-2">
                Filter by Category
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-cyan-500 focus:border-primary-500 dark:focus:border-cyan-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExamples.map((example) => (
              <TutorialExampleCard
                key={example.path}
                title={example.title}
                description={example.description}
                category={example.category}
                path={example.path}
                icon={example.icon}
              />
            ))}
          </div>

          {filteredExamples.length === 0 && (
            <div className="text-center py-12">
              <p className="text-primary-600 dark:text-slate-400">
                No examples found in this category.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ExampleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, description, icon, isSelected, onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 transition-all cursor-pointer p-6 ${
        isSelected
          ? 'border-primary-500 dark:border-cyan-500'
          : 'border-gray-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4 mb-3">
        <div className="text-primary-500 dark:text-cyan-400">{icon}</div>
        <h3 className="text-xl font-bold text-primary-900 dark:text-slate-100">{title}</h3>
      </div>
      <p className="text-primary-600 dark:text-slate-400 text-sm">{description}</p>
    </div>
  );
};

interface TutorialExampleCardProps {
  title: string;
  description: string;
  category: string;
  path: string;
  icon: React.ReactNode;
}

// GitHub repo mapping for submodules
const getExampleRepoUrl = (examplePath: string): string => {
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
  const repoName = repoMap[examplePath] || `entrofhe/tree/main/examples/${examplePath}`;
  return `https://github.com/zacnider/${repoName}`;
};

const TutorialExampleCard: React.FC<TutorialExampleCardProps> = ({ title, description, category, path, icon }) => {
  const githubUrl = getExampleRepoUrl(path);
  const { address, isConnected } = useAccount();
  const { loading, output, error, testExample, compileExample, verifyExample, clearOutput, setOutput } = useExampleAPI();
  const { sendTransaction, isPending: isDeploying, data: deployHash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isDeployed, data: receipt } = useWaitForTransactionReceipt({
    hash: deployHash,
  });
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalAction, setTerminalAction] = useState<'test' | 'compile' | 'deploy' | 'verify' | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string>('');
  const [compiledBytecode, setCompiledBytecode] = useState<string>('');
  const [compiledABI, setCompiledABI] = useState<any[]>([]);
  // Constructor args for swap contracts
  const [swapERC20TokenAddress, setSwapERC20TokenAddress] = useState<string>('');
  const [swapTokenAAddress, setSwapTokenAAddress] = useState<string>('');
  const [swapTokenBAddress, setSwapTokenBAddress] = useState<string>('');
  // Constructor args are fixed to the Entropy Oracle address for all tutorial examples

  // Extract contract name from path (e.g., "basic-simplecounter" -> "EntropyCounter")
  const getContractName = (path: string): string => {
    // Mapping for known contract names
    const contractNameMap: { [key: string]: string } = {
      'basic-simplecounter': 'EntropyCounter',
      'basic-arithmetic': 'EntropyArithmetic',
      'basic-equalitycomparison': 'EntropyEqualityComparison',
      'basic-videodemo': 'VideoDemo',
      'encryption-encryptsingle': 'EntropyEncryption',
      'user-decryption-userdecryptsingle': 'EntropyUserDecryption',
      'public-decryption-publicdecryptsingle': 'EntropyPublicDecryption',
      'access-control-accesscontrol': 'EntropyAccessControl',
      'input-proof-inputproofexplanation': 'EntropyInputProof',
      'anti-patterns-missingallowthis': 'EntropyMissingAllowThis',
      'anti-patterns-viewwithencrypted': 'EntropyViewWithEncrypted',
      'handles-handlelifecycle': 'EntropyHandleLifecycle',
      'openzeppelin-erc7984token': 'EntropyERC7984Token',
      'openzeppelin-erc7984toerc20wrapper': 'EntropyERC7984ToERC20Wrapper',
      'openzeppelin-swaperc7984toerc20': 'EntropySwapERC7984ToERC20',
      'openzeppelin-swaperc7984toerc7984': 'EntropySwapERC7984ToERC7984',
      'openzeppelin-vestingwallet': 'EntropyVestingWallet',
    };

    if (contractNameMap[path]) {
      return contractNameMap[path];
    }

    // Fallback: try to extract from path
    const parts = path.split('-');
    const category = parts[0];
    const name = parts.slice(1).join('');
    // Convert to PascalCase
    const pascalName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    return `Entropy${pascalName}`;
  };

  const handleTest = async () => {
    setTerminalAction('test');
    setShowTerminal(true);
    clearOutput();
    try {
      await testExample(path);
      toast.success('Tests completed successfully!');
    } catch (err) {
      toast.error('Tests failed. Check terminal for details.');
    }
  };

  const handleCompile = async () => {
    setTerminalAction('compile');
    setShowTerminal(true);
    clearOutput();
    try {
      const contractName = getContractName(path);
      const result = await compileExample(path, contractName);
      if (result.bytecode) {
        setCompiledBytecode(result.bytecode);
        setCompiledABI(result.abi || []);
        toast.success('Compilation completed successfully! Bytecode ready for deployment.');
      } else {
        toast.success('Compilation completed successfully!');
      }
    } catch (err) {
      toast.error('Compilation failed. Check terminal for details.');
    }
  };

  const handleDeploy = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!compiledBytecode) {
      toast.error('Please compile the contract first');
      return;
    }

    setTerminalAction('deploy');
    setShowTerminal(true);
    clearOutput();
    setOutput('Sending transaction...');

    try {
      // For all tutorial examples we fix constructor args to the EntropyOracle address
      // Special handling for contracts that require additional constructor parameters
      let args: any[] = [ENTROPY_ORACLE_ADDRESS];
      
      // Special cases for contracts with additional constructor parameters
      if (path === 'openzeppelin-erc7984token') {
        // EntropyERC7984Token requires: (oracle, name, symbol)
        args = [ENTROPY_ORACLE_ADDRESS, 'EntropyToken', 'ENTROPY'];
      } else if (path === 'openzeppelin-erc7984toerc20wrapper') {
        // EntropyERC7984ToERC20Wrapper requires: (oracle, name, symbol)
        args = [ENTROPY_ORACLE_ADDRESS, 'ERC7984Wrapper', 'WRAP'];
      } else if (path === 'openzeppelin-swaperc7984toerc20') {
        // EntropySwapERC7984ToERC20 requires: (oracle, erc20Token)
        if (!swapERC20TokenAddress || swapERC20TokenAddress.trim() === '') {
          toast.error('Please enter a valid ERC20 token address');
          throw new Error('ERC20 token address is required');
        }
        if (!swapERC20TokenAddress.startsWith('0x') || swapERC20TokenAddress.length !== 42) {
          toast.error('Invalid ERC20 token address format');
          throw new Error('ERC20 token address must be a valid Ethereum address (0x...)');
        }
        args = [ENTROPY_ORACLE_ADDRESS, swapERC20TokenAddress.trim()];
      } else if (path === 'openzeppelin-swaperc7984toerc7984') {
        // EntropySwapERC7984ToERC7984 requires: (oracle, tokenA, tokenB)
        if (!swapTokenAAddress || swapTokenAAddress.trim() === '' || !swapTokenBAddress || swapTokenBAddress.trim() === '') {
          toast.error('Please enter valid ERC7984 token addresses for both Token A and Token B');
          throw new Error('Token addresses are required');
        }
        if (!swapTokenAAddress.startsWith('0x') || swapTokenAAddress.length !== 42) {
          toast.error('Invalid Token A address format');
          throw new Error('Token A address must be a valid Ethereum address (0x...)');
        }
        if (!swapTokenBAddress.startsWith('0x') || swapTokenBAddress.length !== 42) {
          toast.error('Invalid Token B address format');
          throw new Error('Token B address must be a valid Ethereum address (0x...)');
        }
        if (swapTokenAAddress.toLowerCase() === swapTokenBAddress.toLowerCase()) {
          toast.error('Token A and Token B must be different addresses');
          throw new Error('Token addresses must be different');
        }
        args = [ENTROPY_ORACLE_ADDRESS, swapTokenAAddress.trim(), swapTokenBAddress.trim()];
      }

      // Encode constructor arguments
      const { encodeAbiParameters } = await import('viem');
      let encodedArgs = '0x';
      if (compiledABI.length > 0 && args.length > 0) {
        const constructor = compiledABI.find((item: any) => item.type === 'constructor');
        if (constructor && constructor.inputs && constructor.inputs.length > 0) {
          // Check if args length matches constructor inputs length
          if (args.length !== constructor.inputs.length) {
            throw new Error(
              `Constructor argument mismatch: Expected ${constructor.inputs.length} arguments, but got ${args.length}. ` +
              `Contract requires: ${constructor.inputs.map((inp: any) => inp.name || inp.type).join(', ')}`
            );
          }
          // Use constructor inputs directly as AbiParameter[]
          const abiParameters = constructor.inputs.map((input: any) => ({
            type: input.type,
            name: input.name,
            internalType: input.internalType,
          }));
          encodedArgs = encodeAbiParameters(abiParameters as any, args);
        }
      }

      // Combine bytecode with constructor args
      const deployData = compiledBytecode + encodedArgs.slice(2);

      // Deploy using wagmi (contract creation - no 'to' field)
      await sendTransaction({
        data: deployData as `0x${string}`,
      } as any);
      setOutput('Transaction sent. Waiting for confirmation...');
    } catch (err: any) {
      toast.error(`Deployment failed: ${err.message}`);
      setOutput(err?.message || 'Deployment failed');
    }
  };

  // Handle deployment success
  useEffect(() => {
    if (isDeployed && receipt) {
      // Get contract address from transaction receipt
      const contractAddress = receipt.contractAddress;
      if (contractAddress) {
        setDeployedAddress(contractAddress);
        toast.success(`Contract deployed to ${contractAddress}`);
        setOutput((prev) => `${prev ? `${prev}\n` : ''}Deployed at ${contractAddress}`);
      }
    }
  }, [isDeployed, receipt]);

  const handleVerify = async () => {
    setTerminalAction('verify');
    setShowTerminal(true);
    clearOutput();
    try {
      // Always use EntropyOracle address as constructor argument
      // Special handling for contracts that require additional constructor parameters
      let parsedConstructorArgs: string[] = [ENTROPY_ORACLE_ADDRESS];
      
      // Special cases for contracts with additional constructor parameters
      if (path === 'openzeppelin-erc7984token') {
        // EntropyERC7984Token requires: (oracle, name, symbol)
        parsedConstructorArgs = [ENTROPY_ORACLE_ADDRESS, 'EntropyToken', 'ENTROPY'];
      } else if (path === 'openzeppelin-erc7984toerc20wrapper') {
        // EntropyERC7984ToERC20Wrapper requires: (oracle, name, symbol)
        parsedConstructorArgs = [ENTROPY_ORACLE_ADDRESS, 'ERC7984Wrapper', 'WRAP'];
      } else if (path === 'openzeppelin-swaperc7984toerc20') {
        // EntropySwapERC7984ToERC20 requires: (oracle, erc20Token)
        if (!swapERC20TokenAddress || swapERC20TokenAddress.trim() === '') {
          toast.error('Please enter the ERC20 token address used during deployment');
          return;
        }
        parsedConstructorArgs = [ENTROPY_ORACLE_ADDRESS, swapERC20TokenAddress.trim()];
      } else if (path === 'openzeppelin-swaperc7984toerc7984') {
        // EntropySwapERC7984ToERC7984 requires: (oracle, tokenA, tokenB)
        if (!swapTokenAAddress || swapTokenAAddress.trim() === '' || !swapTokenBAddress || swapTokenBAddress.trim() === '') {
          toast.error('Please enter the token addresses used during deployment');
          return;
        }
        parsedConstructorArgs = [ENTROPY_ORACLE_ADDRESS, swapTokenAAddress.trim(), swapTokenBAddress.trim()];
      }

      if (!deployedAddress) {
        toast.info('Please enter the contract address to verify');
        return;
      }
      await verifyExample(path, deployedAddress, 'sepolia', parsedConstructorArgs);
      toast.success('Contract verified successfully!');
    } catch (err) {
      toast.error('Verification failed. Check terminal for details.');
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600 transition-all p-6">
        <div className="flex items-center space-x-4 mb-3">
          <div className="text-primary-500 dark:text-cyan-400">{icon}</div>
          <h3 className="text-lg font-bold text-primary-900 dark:text-slate-100">{title}</h3>
        </div>
        <p className="text-primary-600 dark:text-slate-400 text-sm mb-4">{description}</p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleTest}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PlayIcon className="w-4 h-4" />
            <span>Test</span>
          </button>
          <button
            onClick={handleCompile}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CodeBracketIcon className="w-4 h-4" />
            <span>Compile</span>
          </button>
          <button
            onClick={handleDeploy}
            disabled={loading || isDeploying || isConfirming || !isConnected || !compiledBytecode}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RocketLaunchIcon className="w-4 h-4" />
            <span>{isDeploying || isConfirming ? 'Deploying...' : 'Deploy'}</span>
          </button>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>Verify</span>
          </button>
        </div>

        {/* Constructor args input fields - Show when compiled or when deploy action is active */}
        {((terminalAction === 'deploy' || compiledBytecode) && (path === 'openzeppelin-swaperc7984toerc20' || path === 'openzeppelin-swaperc7984toerc7984')) && (
          <div className="mb-4 space-y-3">
            {path === 'openzeppelin-swaperc7984toerc20' && (
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
                  <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                    📋 Token Address Required
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    This contract requires an ERC20 token address. You need to deploy or use an existing ERC20 token first.
                    For testing, you can deploy a standard ERC20 token (e.g., using OpenZeppelin's ERC20) or use any existing ERC20 token on Sepolia.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-700 dark:text-slate-300 mb-1">
                    ERC20 Token Address *
                  </label>
                  <input
                    type="text"
                    value={swapERC20TokenAddress}
                    onChange={(e) => setSwapERC20TokenAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-primary-500 dark:text-slate-400 mt-1">
                    Enter the address of the ERC20 token to swap with (must be a valid ERC20 contract on Sepolia)
                  </p>
                </div>
              </>
            )}
            {path === 'openzeppelin-swaperc7984toerc7984' && (
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
                  <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                    📋 Token Addresses Required
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                    This contract requires two ERC7984 token addresses. You need to deploy <strong>EntropyERC7984Token</strong> contracts first.
                  </p>
                  <ol className="text-xs text-blue-700 dark:text-blue-300 list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <strong>EntropyERC7984Token</strong> example above</li>
                    <li>Deploy it to get Token A address</li>
                    <li>Deploy it again (or use a different instance) to get Token B address</li>
                    <li>Copy the deployed addresses and paste them below</li>
                  </ol>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-700 dark:text-slate-300 mb-1">
                    Token A Address (ERC7984) *
                  </label>
                  <input
                    type="text"
                    value={swapTokenAAddress}
                    onChange={(e) => setSwapTokenAAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-primary-500 dark:text-slate-400 mt-1">
                    First ERC7984 token address (deploy EntropyERC7984Token first)
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-700 dark:text-slate-300 mb-1">
                    Token B Address (ERC7984) *
                  </label>
                  <input
                    type="text"
                    value={swapTokenBAddress}
                    onChange={(e) => setSwapTokenBAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-primary-500 dark:text-slate-400 mt-1">
                    Second ERC7984 token address (must be different from Token A)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        {/* Constructor args info for other contracts */}
        {terminalAction === 'deploy' && path !== 'openzeppelin-swaperc7984toerc20' && path !== 'openzeppelin-swaperc7984toerc7984' && (
          <div className="mb-4 p-3 bg-primary-50 dark:bg-slate-900 rounded-lg text-xs text-primary-700 dark:text-slate-300">
            {path === 'openzeppelin-erc7984token' || path === 'openzeppelin-erc7984toerc20wrapper' ? (
              <>
                Constructor args: EntropyOracle ({ENTROPY_ORACLE_ADDRESS}), Name, Symbol
              </>
            ) : (
              <>
                Constructor args are fixed to EntropyOracle address: {ENTROPY_ORACLE_ADDRESS}
              </>
            )}
          </div>
        )}
        {/* Verify Input - Contract Address; constructor args */}
        {terminalAction === 'verify' && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-primary-700 dark:text-slate-300 mb-1">
                Contract Address *
              </label>
              <input
                type="text"
                value={deployedAddress}
                onChange={(e) => setDeployedAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-primary-500 dark:text-slate-400 mt-1">
                Enter the deployed contract address to verify
              </p>
            </div>
            {path === 'openzeppelin-swaperc7984toerc20' && (
              <div>
                <label className="block text-xs font-medium text-primary-700 dark:text-slate-300 mb-1">
                  ERC20 Token Address (used during deployment) *
                </label>
                <input
                  type="text"
                  value={swapERC20TokenAddress}
                  onChange={(e) => setSwapERC20TokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-primary-500 dark:text-slate-400 mt-1">
                  Enter the same ERC20 token address you used when deploying this contract
                </p>
              </div>
            )}
            {path === 'openzeppelin-swaperc7984toerc7984' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-primary-700 dark:text-slate-300 mb-1">
                    Token A Address (used during deployment) *
                  </label>
                  <input
                    type="text"
                    value={swapTokenAAddress}
                    onChange={(e) => setSwapTokenAAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-primary-500 dark:text-slate-400 mt-1">
                    Enter the same Token A address you used when deploying this contract
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-700 dark:text-slate-300 mb-1">
                    Token B Address (used during deployment) *
                  </label>
                  <input
                    type="text"
                    value={swapTokenBAddress}
                    onChange={(e) => setSwapTokenBAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-primary-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-primary-500 dark:text-slate-400 mt-1">
                    Enter the same Token B address you used when deploying this contract
                  </p>
                </div>
              </>
            )}
            {(path !== 'openzeppelin-swaperc7984toerc20' && path !== 'openzeppelin-swaperc7984toerc7984') && (
              <div className="p-3 bg-primary-50 dark:bg-slate-900 rounded-lg text-xs text-primary-700 dark:text-slate-300">
                {path === 'openzeppelin-erc7984token' || path === 'openzeppelin-erc7984toerc20wrapper' ? (
                  <>
                    Constructor args: EntropyOracle ({ENTROPY_ORACLE_ADDRESS}), Name, Symbol
                  </>
                ) : (
                  <>
                    Constructor args are fixed to EntropyOracle address: {ENTROPY_ORACLE_ADDRESS}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wallet Connection Warning */}
        {terminalAction === 'deploy' && !isConnected && (
          <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Please connect your wallet to deploy
            </p>
          </div>
        )}

        {/* Deployed Address Display */}
        {deployedAddress && (
          <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">Deployed Address:</p>
            <p className="text-xs font-mono text-green-600 dark:text-green-400 break-all">{deployedAddress}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-slate-300 rounded">
            {category}
          </span>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 dark:text-cyan-400 hover:text-primary-700 dark:hover:text-cyan-300 text-sm font-medium flex items-center space-x-1"
          >
            <span>View Code</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Terminal Modal */}
      {showTerminal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col border border-slate-700">
            {/* Terminal Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <CommandLineIcon className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm font-semibold text-white">
                    {terminalAction === 'test' && 'Terminal - Running Tests'}
                    {terminalAction === 'compile' && 'Terminal - Compiling Contracts'}
                    {terminalAction === 'deploy' && 'Terminal - Deploying Contract'}
                    {terminalAction === 'verify' && 'Terminal - Verifying Contract'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTerminal(false);
                  clearOutput();
                }}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-black rounded">
              <div className="font-mono text-sm text-green-400 whitespace-pre-wrap break-words">
                {loading ? (
                  <div>
                    <span className="text-yellow-400 animate-pulse">$ </span>
                    <span className="text-cyan-400">
                      {terminalAction === 'test' && 'npx hardhat test'}
                      {terminalAction === 'compile' && 'npx hardhat compile'}
                      {terminalAction === 'deploy' && 'Deploying contract...'}
                      {terminalAction === 'verify' && 'npx hardhat verify'}
                    </span>
                    <span className="animate-pulse">▋</span>
                    <div className="mt-2 text-slate-400">Running... Please wait...</div>
                  </div>
                ) : output ? (
                  <div>
                    <span className="text-slate-500">$ </span>
                    <span className="text-cyan-400">
                      {terminalAction === 'test' && 'npx hardhat test'}
                      {terminalAction === 'compile' && 'npx hardhat compile'}
                      {terminalAction === 'deploy' && 'Deploying contract...'}
                      {terminalAction === 'verify' && 'npx hardhat verify'}
                    </span>
                    <div className="mt-2 text-green-400">{output}</div>
                  </div>
                ) : error ? (
                  <div>
                    <span className="text-slate-500">$ </span>
                    <span className="text-cyan-400">
                      {terminalAction === 'test' && 'npx hardhat test'}
                      {terminalAction === 'compile' && 'npx hardhat compile'}
                      {terminalAction === 'deploy' && 'Deploying contract...'}
                      {terminalAction === 'verify' && 'npx hardhat verify'}
                    </span>
                    <div className="mt-2 text-red-400">{error}</div>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-500">$ </span>
                    <span className="text-cyan-400">
                      {terminalAction === 'test' && 'npx hardhat test'}
                      {terminalAction === 'compile' && 'npx hardhat compile'}
                      {terminalAction === 'deploy' && 'Deploying contract...'}
                      {terminalAction === 'verify' && 'npx hardhat verify'}
                    </span>
                    <div className="mt-2 text-slate-500">Ready to run...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => {
                  setShowTerminal(false);
                  clearOutput();
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Simple Lottery Demo
const SimpleLotteryDemo: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [lotteryComplete, setLotteryComplete] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>('');
  const [hasParticipated, setHasParticipated] = useState<boolean>(false);
  const [lotteryRound, setLotteryRound] = useState<number>(1);

  const { data: status, refetch: refetchStatus } = useReadContract({
    address: SIMPLE_LOTTERY_ADDRESS as `0x${string}`,
    abi: SimpleLotteryABI.abi,
    functionName: 'getStatus',
    query: {
      enabled: isConnected,
    },
  });

  const { data: lotteryRoundData } = useReadContract({
    address: SIMPLE_LOTTERY_ADDRESS as `0x${string}`,
    abi: SimpleLotteryABI.abi,
    functionName: 'lotteryRound',
    query: {
      enabled: isConnected,
    },
  });

  const { data: hasParticipatedData } = useReadContract({
    address: SIMPLE_LOTTERY_ADDRESS as `0x${string}`,
    abi: SimpleLotteryABI.abi,
    functionName: 'hasParticipated',
    args: address && lotteryRound ? [BigInt(lotteryRound), address] : undefined,
    query: {
      enabled: isConnected && !!address && !!lotteryRound,
    },
  });

  useEffect(() => {
    if (status && Array.isArray(status)) {
      setParticipantCount(Number(status[0]));
      setLotteryComplete(status[1] as boolean);
      setWinner(status[2] as string);
    }
    if (lotteryRoundData !== undefined) {
      setLotteryRound(Number(lotteryRoundData));
    }
    if (hasParticipatedData !== undefined) {
      setHasParticipated(hasParticipatedData as boolean);
    }
  }, [status, hasParticipatedData, lotteryRoundData]);

  const { writeContract: enterLottery, isPending: isEntering, error: enterError } = useWriteContract();
  const { writeContract: selectWinner, data: selectHash, isPending: isSelecting, error: selectError } = useWriteContract();
  const { writeContract: resetLottery, data: resetHash, isPending: isResetting, error: resetError } = useWriteContract();
  const { data: selectReceipt, isLoading: isSelectConfirming, isSuccess: isSelected, isError: isSelectError, error: selectReceiptError } = useWaitForTransactionReceipt({
    hash: selectHash,
  });
  const { isLoading: isResetConfirming, isSuccess: isReset, isError: isResetError, error: resetReceiptError } = useWaitForTransactionReceipt({
    hash: resetHash,
  });
  const [winningRequestId, setWinningRequestId] = useState<number | null>(null);

  useEffect(() => {
    if (selectReceipt && selectReceipt.logs) {
      try {
        // Find WinnerSelected event
        const eventSignature = keccak256(stringToBytes('WinnerSelected(address,uint256)'));
        const winnerEvent = selectReceipt.logs.find((log: any) => 
          log.address.toLowerCase() === SIMPLE_LOTTERY_ADDRESS.toLowerCase() &&
          log.topics && log.topics[0] === eventSignature
        );
        
        if (winnerEvent && winnerEvent.topics && winnerEvent.topics.length >= 3 && winnerEvent.topics[2]) {
          // requestId is in topics[2] (second indexed parameter)
          const requestId = Number(BigInt(winnerEvent.topics[2]));
          setWinningRequestId(requestId);
        }
      } catch (error) {
        console.error('Error parsing request ID:', error);
      }
    }
  }, [selectReceipt]);

  useEffect(() => {
    if (isSelected) {
      toast.success('Winner selected!');
      refetchStatus();
    }
  }, [isSelected, refetchStatus]);

  useEffect(() => {
    if (isReset) {
      toast.success('Lottery reset! New round started.');
      // Refetch all data after reset
      refetchStatus();
      // Reset local state
      setParticipantCount(0);
      setWinner('');
      setWinningRequestId(null);
      setHasParticipated(false);
    }
  }, [isReset, refetchStatus]);

  const handleEnter = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    enterLottery({
      address: SIMPLE_LOTTERY_ADDRESS as `0x${string}`,
      abi: SimpleLotteryABI.abi,
      functionName: 'enter',
    });
  };

  const handleSelectWinner = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    selectWinner({
      address: SIMPLE_LOTTERY_ADDRESS as `0x${string}`,
      abi: SimpleLotteryABI.abi,
      functionName: 'selectWinner',
      value: parseEther('0.00001'),
    });
  };

  const handleResetLottery = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    resetLottery({
      address: SIMPLE_LOTTERY_ADDRESS as `0x${string}`,
      abi: SimpleLotteryABI.abi,
      functionName: 'resetLottery',
    });
  };

  useEffect(() => {
    if (isResetting) {
      toast.info('Resetting lottery...');
    }
  }, [isResetting]);

  useEffect(() => {
    if (resetError) {
      console.error('Reset error:', resetError);
      toast.error(`Reset failed: ${(resetError as any)?.message || (resetError as any)?.shortMessage || 'Unknown error'}`);
    }
    if (isResetError && resetReceiptError) {
      console.error('Reset receipt error:', resetReceiptError);
      toast.error(`Reset transaction failed: ${(resetReceiptError as any)?.message || (resetReceiptError as any)?.shortMessage || 'Unknown error'}`);
    }
  }, [resetError, isResetError, resetReceiptError]);

  useEffect(() => {
    if (resetHash) {
      console.log('Reset transaction hash:', resetHash);
      toast.info('Reset transaction submitted! Waiting for confirmation...');
    }
  }, [resetHash]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100 mb-2">Simple Lottery</h2>
        <p className="text-primary-600 dark:text-slate-400">
          Enter the lottery and select a winner using entropy oracle
        </p>
        <p className="text-sm text-primary-500 dark:text-slate-500 mt-2 font-mono">
          Contract: {SIMPLE_LOTTERY_ADDRESS}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-primary-50 dark:bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Lottery Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-600 dark:text-slate-400">Participants:</span>
              <span className="font-bold text-primary-900 dark:text-slate-100">{participantCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-600 dark:text-slate-400">Status:</span>
              <span className={`font-bold ${lotteryComplete ? 'text-green-600' : 'text-amber-600'}`}>
                {lotteryComplete ? 'Complete' : 'Active'}
              </span>
            </div>
            {winner && (
              <div className="flex justify-between">
                <span className="text-primary-600 dark:text-slate-400">Winner:</span>
                <span className="font-mono text-sm text-primary-900 dark:text-slate-100">
                  {winner.slice(0, 6)}...{winner.slice(-4)}
                </span>
              </div>
            )}
            {winningRequestId !== null && (
              <div className="flex justify-between">
                <span className="text-primary-600 dark:text-slate-400">Request ID:</span>
                <span className="font-mono text-sm text-primary-900 dark:text-slate-100">
                  #{winningRequestId}
                </span>
              </div>
            )}
            {hasParticipated && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">✓ You are participating!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary-50 dark:bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleEnter}
              disabled={isEntering || hasParticipated || lotteryComplete || !isConnected}
              className="w-full px-4 py-3 bg-primary-600 dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              <UserPlusIcon className="h-5 w-5" />
              <span>{hasParticipated ? 'Already Participated' : 'Enter Lottery'}</span>
            </button>
            <button
              onClick={handleSelectWinner}
              disabled={isSelecting || isSelectConfirming || lotteryComplete || participantCount === 0 || !isConnected}
              className="w-full px-4 py-3 bg-amber-600 dark:bg-amber-600 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              <TrophyIcon className="h-5 w-5" />
              <span>{isSelecting || isSelectConfirming ? 'Selecting...' : 'Select Winner (0.00001 ETH)'}</span>
            </button>
            <button
              onClick={handleResetLottery}
              disabled={isResetting || isResetConfirming || !lotteryComplete || !isConnected}
              className="w-full px-4 py-3 bg-purple-600 dark:bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              <PlayIcon className="h-5 w-5" />
              <span>{isResetting || isResetConfirming ? 'Resetting...' : 'Reset Lottery (New Round)'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 border border-primary-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4 flex items-center space-x-2">
            <span>📖</span>
            <span>How to Use Simple Lottery</span>
          </h3>
          <div className="space-y-3 text-primary-700 dark:text-slate-300">
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">1.</span>
              <div>
                <p className="font-semibold">Enter the Lottery</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">Click "Enter Lottery" to participate. You can only enter once per lottery.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">2.</span>
              <div>
                <p className="font-semibold">Wait for Participants</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">The lottery needs at least one participant. You can see the current participant count above.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">3.</span>
              <div>
                <p className="font-semibold">Select Winner</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">Click "Select Winner" to use entropy oracle to randomly select a winner. This costs 0.00001 ETH for the entropy request.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">4.</span>
              <div>
                <p className="font-semibold">View Results</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">Once a winner is selected, the lottery is complete and the winner address will be displayed.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>💡 Tip:</strong> The winner selection uses encrypted entropy from Entrofhe oracle, ensuring fair and unpredictable randomness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Random Number Generator Demo
const RandomNumberGeneratorDemo: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [tag, setTag] = useState<string>('');
  const [requestIds, setRequestIds] = useState<number[]>([]);
  const [totalGenerated, setTotalGenerated] = useState<number>(0);
  const [lastRequestId, setLastRequestId] = useState<number | null>(null);

  const { data: totalData, refetch: refetchTotal } = useReadContract({
    address: RANDOM_NUMBER_GENERATOR_ADDRESS as `0x${string}`,
    abi: RandomNumberGeneratorABI.abi,
    functionName: 'totalGenerated',
    query: {
      enabled: isConnected,
    },
  });

  useEffect(() => {
    if (totalData !== undefined) {
      setTotalGenerated(Number(totalData));
    }
  }, [totalData]);

  const { writeContract: requestRandom, data: requestHash, isPending: isRequesting } = useWriteContract();
  const { data: requestReceipt, isLoading: isRequestConfirming, isSuccess: isRequested } = useWaitForTransactionReceipt({
    hash: requestHash,
  });

  // Parse request ID from transaction receipt
  useEffect(() => {
    if (requestReceipt && requestReceipt.logs) {
      try {
        // Find RandomNumberRequested event
        const eventSignature = keccak256(stringToBytes('RandomNumberRequested(uint256,bytes32)'));
        const randomEvent = requestReceipt.logs.find((log: any) => 
          log.address.toLowerCase() === RANDOM_NUMBER_GENERATOR_ADDRESS.toLowerCase() &&
          log.topics && log.topics[0] === eventSignature
        );
        
        if (randomEvent && randomEvent.topics && randomEvent.topics.length >= 2 && randomEvent.topics[1]) {
          // requestId is in topics[1] (indexed parameter)
          const requestId = Number(BigInt(randomEvent.topics[1]));
          setLastRequestId(requestId);
          setRequestIds(prev => {
            if (!prev.includes(requestId)) {
              return [...prev, requestId];
            }
            return prev;
          });
          toast.success(`Random number requested! Request ID: ${requestId}`);
        } else {
          toast.success('Random number requested!');
        }
      } catch (error) {
        console.error('Error parsing request ID:', error);
        toast.success('Random number requested!');
      }
    }
  }, [requestReceipt]);

  useEffect(() => {
    if (isRequested) {
      refetchTotal();
    }
  }, [isRequested, refetchTotal]);

  const handleRequestRandom = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    if (!tag.trim()) {
      toast.error('Please enter a tag');
      return;
    }
    const tagBytes32 = keccak256(stringToBytes(tag));
    requestRandom({
      address: RANDOM_NUMBER_GENERATOR_ADDRESS as `0x${string}`,
      abi: RandomNumberGeneratorABI.abi,
      functionName: 'requestRandomNumber',
      args: [tagBytes32],
      value: parseEther('0.00001'),
    });
  };

  const generateRandomTag = () => {
    const randomTag = keccak256(stringToBytes(`${Date.now()}-${Math.random()}`));
    setTag(randomTag);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100 mb-2">Random Number Generator</h2>
        <p className="text-primary-600 dark:text-slate-400">
          Request encrypted random numbers using entropy oracle
        </p>
        <p className="text-sm text-primary-500 dark:text-slate-500 mt-2 font-mono">
          Contract: {RANDOM_NUMBER_GENERATOR_ADDRESS}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-primary-50 dark:bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Request Random Number</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-slate-300 mb-2">
                Tag (optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Enter tag or generate random"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                />
                <button
                  onClick={generateRandomTag}
                  className="px-4 py-2 bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-cyan-400 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition"
                >
                  <SparklesIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleRequestRandom}
              disabled={isRequesting || isRequestConfirming || !isConnected}
              className="w-full px-4 py-3 bg-primary-600 dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="h-5 w-5" />
              <span>{isRequesting || isRequestConfirming ? 'Requesting...' : 'Request Random Number (0.00001 ETH)'}</span>
            </button>
          </div>
        </div>

        <div className="bg-primary-50 dark:bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-600 dark:text-slate-400">Total Generated:</span>
              <span className="font-bold text-primary-900 dark:text-slate-100">{totalGenerated}</span>
            </div>
            {lastRequestId !== null && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>✓ Last Request ID:</strong> #{lastRequestId}
                </p>
              </div>
            )}
            {requestIds.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-primary-600 dark:text-slate-400 mb-2">Your Request IDs:</p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {requestIds.map((id) => (
                    <span
                      key={id}
                      className="px-2 py-1 text-xs rounded bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-cyan-400 font-mono"
                    >
                      #{id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Random numbers are encrypted (euint64). Use FHE operations to work with them.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 border border-primary-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4 flex items-center space-x-2">
            <span>📖</span>
            <span>How to Use Random Number Generator</span>
          </h3>
          <div className="space-y-3 text-primary-700 dark:text-slate-300">
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">1.</span>
              <div>
                <p className="font-semibold">Enter a Tag (Optional)</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">You can enter a custom tag to identify your random number request, or click the sparkle icon to generate a random tag.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">2.</span>
              <div>
                <p className="font-semibold">Request Random Number</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">Click "Request Random Number" to generate an encrypted random number. This costs 0.00001 ETH for the entropy request.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">3.</span>
              <div>
                <p className="font-semibold">Get Your Random Number</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">The random number is encrypted (euint64) and stored on-chain. You can retrieve it using the request ID.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-bold text-primary-600 dark:text-cyan-400">4.</span>
              <div>
                <p className="font-semibold">Use in Your Contract</p>
                <p className="text-sm text-primary-600 dark:text-slate-400">The encrypted random number can be used in FHE operations without decryption, or decrypted if needed for your use case.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>💡 Tip:</strong> Each random number is unique and cryptographically secure. The total generated count shows how many random numbers have been created.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NFTTraitSelectorDemo removed - replaced by EntropyNFTDemo (Real ERC721 NFT)

// EntropyNFT Demo (Real ERC721 NFT)
const EntropyNFTDemo: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { decrypt64, isReady: fhevmReady } = useFHEVM();
  const [tag, setTag] = useState<string>('');
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [nftData, setNftData] = useState<any>(null);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<number | null>(null);
  const [mintedNFTs, setMintedNFTs] = useState<Array<{tokenId: number; requestId: number; minted: boolean; traits?: any}>>([]);
  const [availableTraits, setAvailableTraits] = useState<{
    backgrounds: string[];
    accessories: string[];
    expressions: string[];
  } | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<{
    background: number;
    accessory: number;
    expression: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('/nft1.png');

  const { data: nftInfo, refetch: refetchNft } = useReadContract({
    address: ENTROPY_NFT_ADDRESS as `0x${string}`,
    abi: EntropyNFTABI.abi,
    functionName: 'getNFT',
    args: selectedTokenId !== null ? [BigInt(selectedTokenId)] : undefined,
    query: {
      enabled: isConnected && selectedTokenId !== null,
    },
  });

  const { data: traitsData } = useReadContract({
    address: ENTROPY_NFT_ADDRESS as `0x${string}`,
    abi: EntropyNFTABI.abi,
    functionName: 'getAvailableTraits',
    query: {
      enabled: isConnected,
    },
  });

  useEffect(() => {
    if (traitsData && Array.isArray(traitsData) && traitsData.length === 3) {
      setAvailableTraits({
        backgrounds: traitsData[0] as string[],
        accessories: traitsData[1] as string[],
        expressions: traitsData[2] as string[],
      });
    }
  }, [traitsData]);

  useEffect(() => {
    if (nftInfo && Array.isArray(nftInfo) && nftInfo.length >= 7) {
      setNftData({
        tokenId: Number(nftInfo[0]),
        entropyRequestId: Number(nftInfo[1]),
        background: nftInfo[2] as string,
        accessory: nftInfo[3] as string,
        expression: nftInfo[4] as string,
        tokenURI: nftInfo[5] as string,
        minted: nftInfo[6] as boolean,
      });
    }
  }, [nftInfo]);

  const { writeContract: requestMint, data: mintHash, isPending: isMinting } = useWriteContract();
  const { writeContract: completeMint, data: completeHash, isPending: isCompleting } = useWriteContract();
  const { data: mintReceipt, isLoading: isMintConfirming } = useWaitForTransactionReceipt({
    hash: mintHash,
  });
  const { isLoading: isCompleteConfirming, isSuccess: isCompleted } = useWaitForTransactionReceipt({
    hash: completeHash,
  });

  // Parse token ID from transaction receipt
  useEffect(() => {
    if (mintReceipt && mintReceipt.logs) {
      try {
        const eventSignature = keccak256(stringToBytes('NFTMintRequested(uint256,uint256)'));
        const mintEvent = mintReceipt.logs.find((log: any) => 
          log.address.toLowerCase() === ENTROPY_NFT_ADDRESS.toLowerCase() &&
          log.topics && log.topics[0] === eventSignature
        );
        
        if (mintEvent && mintEvent.topics && mintEvent.topics.length >= 3 && mintEvent.topics[1] && mintEvent.topics[2]) {
          const tokenId = Number(BigInt(mintEvent.topics[1]));
          const requestId = Number(BigInt(mintEvent.topics[2]));
          setLastMintedTokenId(tokenId);
          setTokenIds(prev => {
            if (!prev.includes(tokenId)) {
              return [...prev, tokenId];
            }
            return prev;
          });
          setSelectedTokenId(tokenId);
          setMintedNFTs(prev => {
            const exists = prev.find(nft => nft.tokenId === tokenId);
            if (!exists) {
              return [...prev, {tokenId, requestId, minted: false}];
            }
            return prev;
          });
          toast.success(`Mint requested! Token ID: ${tokenId}`);
        }
      } catch (error) {
        console.error('Error parsing token ID:', error);
      }
    }
  }, [mintReceipt]);

  useEffect(() => {
    if (isCompleted) {
      toast.success('NFT minted successfully!');
      refetchNft();
    }
  }, [isCompleted, refetchNft]);

  const handleRequestMint = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    if (!tag.trim()) {
      toast.error('Please enter a tag');
      return;
    }
    const tagBytes32 = keccak256(stringToBytes(tag));
    requestMint({
      address: ENTROPY_NFT_ADDRESS as `0x${string}`,
      abi: EntropyNFTABI.abi,
      functionName: 'requestMint',
      args: [tagBytes32],
      value: parseEther('0.00001'),
    });
  };

  // Get encrypted entropy for trait selection
  const { data: encryptedEntropy } = useReadContract({
    address: ENTROPY_ORACLE_ADDRESS as `0x${string}`,
    abi: EntropyOracleABI.abi,
    functionName: 'getEncryptedEntropy',
    args: selectedTokenId !== null && nftData ? [BigInt(nftData.entropyRequestId)] : undefined,
    query: {
      enabled: isConnected && selectedTokenId !== null && nftData !== null && !nftData.minted,
    },
  });

  const handleSelectTraits = async () => {
    if (!isConnected || selectedTokenId === null || !nftData) {
      toast.error('Please select a token');
      return;
    }
    if (!fhevmReady) {
      toast.error('FHEVM is not ready');
      return;
    }
    if (!availableTraits) {
      toast.error('Traits not loaded');
      return;
    }

    try {
      toast.info('Selecting traits from entropy...');
      
      // For now, use a deterministic approach based on requestId
      // In production, you would decrypt the encrypted entropy using FHEVM
      // This is a simplified version that uses requestId as seed
      const seed = BigInt(nftData.entropyRequestId) * BigInt(1000) + BigInt(selectedTokenId);
      
      // Select traits using pseudo-random from seed
      const backgroundIdx = Number(seed % BigInt(availableTraits.backgrounds.length));
      const accessoryIdx = Number((seed / BigInt(availableTraits.backgrounds.length)) % BigInt(availableTraits.accessories.length));
      const expressionIdx = Number((seed / BigInt(availableTraits.backgrounds.length * availableTraits.accessories.length)) % BigInt(availableTraits.expressions.length));

      setSelectedTraits({
        background: backgroundIdx,
        accessory: accessoryIdx,
        expression: expressionIdx,
      });

      toast.success('Traits selected!');
    } catch (error: any) {
      console.error('Error selecting traits:', error);
      toast.error(`Error: ${error.message || 'Failed to select traits'}`);
    }
  };

  const handleCompleteMint = async () => {
    if (!isConnected || selectedTokenId === null || !selectedTraits || !availableTraits) {
      toast.error('Please select traits first');
      return;
    }

    try {
      setIsUploading(true);
      toast.info('Uploading image to IPFS...');

      // Upload image to IPFS
      let imageHash: string;
      if (imageFile) {
        imageHash = await pinataService.uploadImage(imageFile);
      } else {
        // Use default image (nft1.png) - convert to File
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const file = new File([blob], 'nft1.png', { type: 'image/png' });
        imageHash = await pinataService.uploadImage(file);
      }

      toast.info('Creating metadata...');

      // Create metadata
      const metadata = pinataService.createMetadata(
        `EntropyNFT #${selectedTokenId}`,
        `A unique NFT minted using Entrofhe entropy oracle. Traits: ${availableTraits.backgrounds[selectedTraits.background]}, ${availableTraits.accessories[selectedTraits.accessory]}, ${availableTraits.expressions[selectedTraits.expression]}`,
        imageHash,
        [
          { trait_type: 'Background', value: availableTraits.backgrounds[selectedTraits.background] },
          { trait_type: 'Accessory', value: availableTraits.accessories[selectedTraits.accessory] },
          { trait_type: 'Expression', value: availableTraits.expressions[selectedTraits.expression] },
        ]
      );

      toast.info('Uploading metadata to IPFS...');

      // Upload metadata to IPFS
      const metadataHash = await pinataService.uploadMetadata(metadata);
      const tokenURI = `ipfs://${metadataHash}`;

      toast.info('Completing mint...');

      // Complete mint with traits
      completeMint({
        address: ENTROPY_NFT_ADDRESS as `0x${string}`,
        abi: EntropyNFTABI.abi,
        functionName: 'completeMintWithTraits',
        args: [
          BigInt(selectedTokenId),
          selectedTraits.background,
          selectedTraits.accessory,
          selectedTraits.expression,
          tokenURI,
        ],
      });

      setIsUploading(false);
    } catch (error: any) {
      console.error('Error completing mint:', error);
      toast.error(`Error: ${error.message || 'Failed to complete mint'}`);
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomTag = () => {
    const randomTag = keccak256(stringToBytes(`nft-${Date.now()}-${Math.random()}`));
    setTag(randomTag);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100 mb-2">EntropyNFT (Real ERC721)</h2>
        <p className="text-primary-600 dark:text-slate-400">
          Mint real NFTs with IPFS metadata and trait selection using entropy
        </p>
        <p className="text-sm text-primary-500 dark:text-slate-500 mt-2 font-mono">
          Contract: {ENTROPY_NFT_ADDRESS}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-primary-50 dark:bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Request Mint</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-slate-300 mb-2">
                Tag
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Enter tag or generate random"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                />
                <button
                  onClick={generateRandomTag}
                  className="px-4 py-2 bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-cyan-400 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition"
                >
                  <SparklesIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleRequestMint}
              disabled={isMinting || isMintConfirming || !isConnected}
              className="w-full px-4 py-3 bg-primary-600 dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              <CubeIcon className="h-5 w-5" />
              <span>{isMinting || isMintConfirming ? 'Requesting...' : 'Request Mint (0.00001 ETH)'}</span>
            </button>
          </div>
        </div>

        <div className="bg-primary-50 dark:bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Select Traits</h3>
          {selectedTokenId !== null && nftData && !nftData.minted && (
            <div className="space-y-4">
              <button
                onClick={handleSelectTraits}
                disabled={!fhevmReady || isUploading}
                className="w-full px-4 py-3 bg-amber-600 dark:bg-amber-600 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition"
              >
                Select Traits from Entropy
              </button>
              {selectedTraits && availableTraits && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">Selected Traits:</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Background: <strong>{availableTraits.backgrounds[selectedTraits.background]}</strong>
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Accessory: <strong>{availableTraits.accessories[selectedTraits.accessory]}</strong>
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Expression: <strong>{availableTraits.expressions[selectedTraits.expression]}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary-50 dark:bg-slate-900 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Complete Mint</h3>
        <div className="space-y-4">
          {lastMintedTokenId !== null && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>✓ Last Minted Token ID:</strong> {lastMintedTokenId}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-slate-300 mb-2">
              Token ID
            </label>
            <input
              type="number"
              value={selectedTokenId || ''}
              onChange={(e) => setSelectedTokenId(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Enter token ID"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-slate-300 mb-2">
              NFT Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 border-2 border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                <img src={imagePreview} alt="NFT Preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-cyan-400 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition cursor-pointer inline-flex items-center space-x-2"
                >
                  <PhotoIcon className="h-5 w-5" />
                  <span>Upload Image</span>
                </label>
                <p className="text-xs text-primary-500 dark:text-slate-500 mt-2">
                  Default: nft1.png
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleCompleteMint}
            disabled={isCompleting || isCompleteConfirming || isUploading || selectedTokenId === null || !selectedTraits || (nftData && nftData.minted)}
            className="w-full px-4 py-3 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
          >
            <CubeIcon className="h-5 w-5" />
            <span>{isUploading ? 'Uploading to IPFS...' : isCompleting || isCompleteConfirming ? 'Completing...' : 'Complete Mint'}</span>
          </button>
        </div>
      </div>

      {/* Minted NFTs Collection */}
      {mintedNFTs.length > 0 && (
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-cyan-300 mb-4">Your NFT Collection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mintedNFTs.map((nft) => (
              <div
                key={nft.tokenId}
                className={`border-2 rounded-xl overflow-hidden transition-all cursor-pointer shadow-lg hover:shadow-xl ${
                  selectedTokenId === nft.tokenId
                    ? 'border-primary-500 dark:border-cyan-500 ring-2 ring-primary-300 dark:ring-cyan-700'
                    : 'border-gray-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600'
                }`}
                onClick={() => setSelectedTokenId(nft.tokenId)}
              >
                <div className="relative w-full aspect-square bg-gradient-to-br from-primary-100 to-cyan-100 dark:from-slate-900 dark:to-slate-800">
                  <img
                    src={
                      nftData && nft.tokenId === nftData.tokenId && nftData.tokenURI 
                        ? pinataService.getIpfsUrl(nftData.tokenURI.replace('ipfs://', '')) 
                        : imagePreview
                    }
                    alt={`NFT #${nft.tokenId}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = imagePreview;
                    }}
                  />
                  {!nft.minted && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/90 text-white text-xs rounded-full font-semibold">
                      Pending
                    </div>
                  )}
                  {nft.minted && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/90 text-white text-xs rounded-full font-semibold">
                      ✓ Minted
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white dark:bg-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-primary-900 dark:text-slate-100">
                      #{nft.tokenId}
                    </h4>
                  </div>
                  {nftData && nft.tokenId === nftData.tokenId && nftData.minted && (
                    <div className="space-y-1 text-sm">
                      <p className="text-primary-600 dark:text-slate-400">
                        <strong>Background:</strong> {nftData.background}
                      </p>
                      <p className="text-primary-600 dark:text-slate-400">
                        <strong>Accessory:</strong> {nftData.accessory}
                      </p>
                      <p className="text-primary-600 dark:text-slate-400">
                        <strong>Expression:</strong> {nftData.expression}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Examples;
