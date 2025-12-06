import React, { useState, useEffect, useMemo } from 'react';
import { usePublicClient } from 'wagmi';
import { keccak256, stringToBytes, decodeEventLog } from 'viem';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  ChartBarIcon,
  LockClosedIcon,
  UserIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import EntropyOracleABI from '../abis/EntropyOracle.json';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

const ENTROPY_ORACLE_ADDRESS = process.env.REACT_APP_ENTROPY_ORACLE_ADDRESS || '0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361';

interface EntropyRequest {
  requestId: bigint;
  consumer: string;
  tag: string;
  timestamp: bigint;
  fulfilled: boolean;
  txHash?: string;
  blockNumber?: bigint;
}

const EntropyScan: React.FC = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [requests, setRequests] = useState<EntropyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFulfilled, setFilterFulfilled] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<'public' | 'private'>('public');
  const [selectedRequest, setSelectedRequest] = useState<bigint | null>(null);
  
  // Auto-switch to private mode if wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      setViewMode('private');
    } else {
      setViewMode('public');
    }
  }, [isConnected, address]);

  // Fetch all requests from events
  useEffect(() => {
    const fetchRequests = async () => {
      if (!publicClient) {
        console.log('Public client not available');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get current block number
        const currentBlock = await publicClient.getBlockNumber();
        console.log('Current block:', currentBlock.toString());
        
        // Fetch events from last 10000 blocks (increase range)
        const fromBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);
        console.log('Fetching events from block', fromBlock.toString(), 'to', currentBlock.toString());
        
        // Get EntropyRequested event ABI
        const eventABI = EntropyOracleABI.abi.find((item: any) => item.name === 'EntropyRequested' && item.type === 'event');
        if (!eventABI) {
          console.error('EntropyRequested event ABI not found');
          setLoading(false);
          return;
        }
        
        // Get EntropyRequested events to find all request IDs
        const events = await publicClient.getLogs({
          address: ENTROPY_ORACLE_ADDRESS as `0x${string}`,
          event: {
            type: 'event',
            name: 'EntropyRequested',
            inputs: eventABI.inputs || [],
          },
          fromBlock,
          toBlock: currentBlock,
        });
        
        console.log('Found events:', events.length);

        // Extract unique request IDs and fetch details
        const requestIds = new Set<bigint>();
        const eventMap = new Map<string, { consumer: string; tag: string; txHash: string; blockNumber: bigint }>();
        
        for (const event of events) {
          try {
            // Decode event using viem's decodeEventLog
            const decoded = decodeEventLog({
              abi: [eventABI] as any,
              data: event.data,
              topics: event.topics,
            }) as { args: { requestId: bigint; hashedConsumer: string; hashedTag: string; feePaid: bigint } };

            const requestId = decoded.args.requestId;
            const hashedConsumer = decoded.args.hashedConsumer; // bytes32 hash
            const hashedTag = decoded.args.hashedTag; // bytes32 hash
            
            if (requestId > 0) {
              requestIds.add(requestId);
              eventMap.set(requestId.toString(), {
                consumer: hashedConsumer, // Will be replaced with actual address from tx
                tag: hashedTag,
                txHash: event.transactionHash,
                blockNumber: event.blockNumber,
              });
            }
          } catch (error) {
            console.error('Error decoding event:', error, event);
            // Fallback: try to parse from topics (indexed params)
            // topics[0] = event signature
            // topics[1] = requestId (indexed)
            // topics[2] = hashedConsumer (indexed, bytes32)
            if (event.topics && event.topics.length >= 3 && event.topics[1] && event.topics[2]) {
              try {
                const requestId = BigInt(event.topics[1]);
                const hashedConsumerTopic = event.topics[2]; // bytes32 hash
                
                if (requestId > 0) {
                  requestIds.add(requestId);
                  eventMap.set(requestId.toString(), {
                    consumer: hashedConsumerTopic, // Will be replaced with actual address from tx
                    tag: '0x0', // Tag not in topics, will get from getRequest
                    txHash: event.transactionHash,
                    blockNumber: event.blockNumber,
                  });
                }
              } catch (fallbackError) {
                console.error('Error in fallback parsing:', fallbackError);
              }
            }
          }
        }
        
        console.log('Unique request IDs found:', requestIds.size);

        // Fetch request details for all unique IDs
        const requestPromises = Array.from(requestIds).map(async (requestId) => {
          try {
            // Always use getRequest for accurate data
            const data: any = await publicClient.readContract({
              address: ENTROPY_ORACLE_ADDRESS as `0x${string}`,
              abi: EntropyOracleABI.abi,
              functionName: 'getRequest',
              args: [requestId],
            });

            const eventData = eventMap.get(requestId.toString());
            
            // getRequest returns a tuple: [consumer, tag, timestamp, fulfilled]
            // Handle both tuple array and object formats
            let consumer: string;
            let tag: string;
            let timestamp: bigint;
            let fulfilled: boolean;
            
            if (Array.isArray(data)) {
              // Tuple format: [consumer, tag, timestamp, fulfilled]
              consumer = (data[0] as string).toLowerCase();
              tag = data[1] as string;
              timestamp = data[2] as bigint;
              fulfilled = Boolean(data[3]); // Explicitly convert to boolean
            } else if (data && typeof data === 'object') {
              // Object format: { consumer, tag, timestamp, fulfilled }
              consumer = (data.consumer as string)?.toLowerCase() || (eventData?.consumer || '');
              tag = data.tag || eventData?.tag || '0x0';
              timestamp = data.timestamp || BigInt(0);
              // fulfilled can be false, so check explicitly for boolean
              fulfilled = typeof data.fulfilled === 'boolean' ? data.fulfilled : Boolean(data.fulfilled);
            } else {
              // Fallback to event data
              consumer = eventData?.consumer || '';
              tag = eventData?.tag || '0x0';
              timestamp = BigInt(0);
              fulfilled = true; // If we can't get from contract, assume fulfilled
            }
            
            // Get actual user address from transaction (not contract address)
            // If consumer is a contract, get the transaction sender
            let actualConsumer = consumer;
            if (eventData?.txHash) {
              try {
                const tx = await publicClient.getTransaction({ hash: eventData.txHash as `0x${string}` });
                // Use transaction 'from' address as the actual user
                actualConsumer = tx.from.toLowerCase();
              } catch (txError) {
                console.warn(`Could not fetch transaction for ${eventData.txHash}:`, txError);
                // Keep original consumer if we can't get transaction
              }
            }
            
            const request: EntropyRequest = {
              requestId,
              consumer: actualConsumer, // Use actual user address
              tag: tag,
              timestamp: timestamp,
              fulfilled: fulfilled,
              txHash: eventData?.txHash,
              blockNumber: eventData?.blockNumber,
            };
            
            return request;
          } catch (error) {
            console.error(`Error fetching request ${requestId}:`, error);
            // If getRequest fails, use event data as fallback
            const eventData = eventMap.get(requestId.toString());
            if (eventData) {
              // Try to get user address from transaction
              let actualConsumer = eventData.consumer;
              if (eventData.txHash) {
                try {
                  const tx = await publicClient.getTransaction({ hash: eventData.txHash as `0x${string}` });
                  actualConsumer = tx.from.toLowerCase();
                } catch (txError) {
                  // Keep original consumer if we can't get transaction
                }
              }
              
              return {
                requestId,
                consumer: actualConsumer,
                tag: eventData.tag,
                timestamp: BigInt(0), // Will be fetched from block
                fulfilled: true, // If event exists, it's fulfilled
                txHash: eventData.txHash,
                blockNumber: eventData.blockNumber,
              } as EntropyRequest;
            }
            return null;
          }
        });

        const results = await Promise.all(requestPromises);
        const validRequests = results.filter((r): r is EntropyRequest => r !== null);
        
        console.log('Valid requests after fetching details:', validRequests.length);

        // Fetch timestamps from blocks if missing
        for (const req of validRequests) {
          if (req.timestamp === BigInt(0) && req.blockNumber) {
            try {
              const block = await publicClient.getBlock({ blockNumber: req.blockNumber });
              req.timestamp = BigInt(block.timestamp);
            } catch (error) {
              console.error('Error fetching block:', error);
            }
          }
        }

        // Sort by requestId descending (newest first)
        validRequests.sort((a, b) => Number(b.requestId - a.requestId));

        setRequests(validRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error(`Error loading requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [publicClient]);

  // Transaction hashes are already fetched in the main useEffect

  // Filter requests based on view mode
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // In private mode, only show user's own requests
    if (viewMode === 'private' && address) {
      const userAddress = address.toLowerCase();
      filtered = filtered.filter(req => {
        const consumerAddress = req.consumer.toLowerCase();
        return consumerAddress === userAddress;
      });
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(req => {
        const matchesId = req.requestId.toString().includes(search);
        // In public mode, don't search by consumer/tag for privacy
        if (viewMode === 'public') {
          return matchesId;
        }
        // In private mode, allow full search
        const matchesConsumer = req.consumer.toLowerCase().includes(search);
        const matchesTag = req.tag.toLowerCase().includes(search);
        return matchesId || matchesConsumer || matchesTag;
      });
    }

    // Fulfilled filter
    if (filterFulfilled !== null) {
      filtered = filtered.filter(req => filterFulfilled === req.fulfilled);
    }

    return filtered;
  }, [requests, searchTerm, filterFulfilled, viewMode, address]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const fulfilled = requests.filter(r => r.fulfilled === true).length;
    const pending = requests.filter(r => r.fulfilled === false).length;
    
    // Group by date for trend
    const byDate = new Map<string, number>();
    requests.forEach(req => {
      const date = new Date(Number(req.timestamp) * 1000).toISOString().split('T')[0];
      byDate.set(date, (byDate.get(date) || 0) + 1);
    });
    
    return { total, fulfilled, pending, byDate };
  }, [requests]);

  // Hash address for privacy (public mode)
  const hashAddress = (addr: string): string => {
    if (viewMode === 'private') return addr;
    // Hash the address and show first 4 + last 4 chars
    const hash = keccak256(stringToBytes(addr));
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  // Hide tag in public mode
  const formatTagForDisplay = (tag: string): string => {
    if (viewMode === 'private') {
      return tag.startsWith('0x') ? tag.slice(0, 10) + '...' + tag.slice(-8) : tag;
    }
    return '🔒 Encrypted';
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const formatTag = (tag: string) => {
    if (tag.startsWith('0x')) {
      return tag.slice(0, 10) + '...' + tag.slice(-8);
    }
    return tag;
  };

  const copyToClipboard = async (text: string, label: string = 'Value') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
          {/* Header */}
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-4xl font-bold text-primary-900 dark:text-slate-100">
                    Entropy Scan
                  </h1>
                  {viewMode === 'public' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <LockClosedIcon className="h-4 w-4 mr-1" />
                      Public View
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <UserIcon className="h-4 w-4 mr-1" />
                      Private View
                    </span>
                  )}
                </div>
                <p className="text-lg text-primary-600 dark:text-slate-400">
                  {viewMode === 'public' 
                    ? 'Anonymous statistics and encrypted data'
                    : 'View your personal entropy requests'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600 dark:text-cyan-400">
                  {viewMode === 'public' ? stats.total : filteredRequests.length}
                </div>
                <div className="text-sm text-primary-500 dark:text-slate-500">
                  {viewMode === 'public' ? 'Total Requests' : 'Your Requests'}
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            {isConnected && (
              <div className="mb-6 flex items-center space-x-4">
                <button
                  onClick={() => setViewMode('public')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'public'
                      ? 'bg-primary-600 dark:bg-cyan-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <LockClosedIcon className="h-4 w-4" />
                  <span>Public View</span>
                </button>
                <button
                  onClick={() => setViewMode('private')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'private'
                      ? 'bg-primary-600 dark:bg-cyan-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>My Requests</span>
                </button>
              </div>
            )}

            {/* Statistics Cards */}
            {viewMode === 'public' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border border-primary-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-primary-600 dark:text-slate-400 mb-1">Total Requests</div>
                      <div className="text-2xl font-bold text-primary-900 dark:text-slate-100">{stats.total}</div>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-primary-600 dark:text-cyan-400" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border border-green-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-600 dark:text-slate-400 mb-1">Fulfilled</div>
                      <div className="text-2xl font-bold text-green-900 dark:text-slate-100">{stats.fulfilled}</div>
                    </div>
                    <ShieldCheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border border-yellow-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-yellow-600 dark:text-slate-400 mb-1">Pending</div>
                      <div className="text-2xl font-bold text-yellow-900 dark:text-slate-100">{stats.pending}</div>
                    </div>
                    <ArrowPathIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400 animate-spin" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border border-purple-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-purple-600 dark:text-slate-400 mb-1">Success Rate</div>
                      <div className="text-2xl font-bold text-purple-900 dark:text-slate-100">
                        {stats.total > 0 ? Math.round((stats.fulfilled / stats.total) * 100) : 0}%
                      </div>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={viewMode === 'public' ? "Search by Request ID..." : "Search by Request ID, Consumer, or Tag..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterFulfilled === null ? 'all' : filterFulfilled ? 'fulfilled' : 'pending'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilterFulfilled(value === 'all' ? null : value === 'fulfilled');
                  }}
                  className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-cyan-500"
                >
                  <option value="all">All Requests</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-3 bg-primary-600 dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-cyan-700 transition-colors flex items-center space-x-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
            
            {/* Privacy Notice for Public Mode */}
            {viewMode === 'public' && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Privacy Mode:</strong> In public view, all sensitive data (consumer addresses and tags) are encrypted and anonymized. 
                    Connect your wallet to view your personal requests with full details.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Requests Table */}
          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <ArrowPathIcon className="h-12 w-12 text-primary-600 dark:text-cyan-400 animate-spin mx-auto mb-4" />
                <p className="text-primary-600 dark:text-slate-400">Loading requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-slate-400">No requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Request ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Consumer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Tag</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Timestamp</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
                        {viewMode === 'public' ? 'Block' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => {
                      const isExpanded = selectedRequest === request.requestId;

                      return (
                        <React.Fragment key={request.requestId.toString()}>
                          <tr className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-mono text-sm text-primary-900 dark:text-slate-100">
                                #{request.requestId.toString()}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-mono text-sm text-gray-700 dark:text-slate-300">
                                {viewMode === 'public' 
                                  ? hashAddress(request.consumer) 
                                  : `${request.consumer.slice(0, 6)}...${request.consumer.slice(-4)}`}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-mono text-xs text-gray-600 dark:text-slate-400">
                                {formatTagForDisplay(request.tag)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600 dark:text-slate-400">
                                {formatDate(request.timestamp)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.fulfilled
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {request.fulfilled ? 'Fulfilled' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {viewMode === 'public' ? (
                                <div className="font-mono text-sm text-gray-700 dark:text-slate-300">
                                  {request.blockNumber ? request.blockNumber.toString() : '-'}
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSelectedRequest(isExpanded ? null : request.requestId)}
                                  className="p-2 text-primary-600 dark:text-cyan-400 hover:bg-primary-100 dark:hover:bg-cyan-900/30 rounded-lg transition"
                                  title="View Details"
                                >
                                  {isExpanded ? (
                                    <EyeSlashIcon className="h-4 w-4" />
                                  ) : (
                                    <EyeIcon className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                          {isExpanded && viewMode === 'private' && (
                            <tr>
                              <td colSpan={6} className="px-4 py-4 bg-gray-50 dark:bg-slate-900/50">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Request ID</div>
                                      <div className="font-mono text-sm text-gray-900 dark:text-slate-100">
                                        {request.requestId.toString()}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Consumer</div>
                                      <div className="font-mono text-sm text-gray-900 dark:text-slate-100 break-all">
                                        {request.consumer}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Tag</div>
                                      <div className="font-mono text-xs text-gray-900 dark:text-slate-100 break-all">
                                        {request.tag}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Block Number</div>
                                      <div className="font-mono text-sm text-gray-900 dark:text-slate-100">
                                        {request.blockNumber ? request.blockNumber.toString() : '-'}
                                      </div>
                                    </div>
                                  </div>

                                  {request.txHash && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-500 dark:text-slate-400">Transaction:</span>
                                      <div className="flex items-center space-x-2 group">
                                        <a
                                          href={`https://sepolia.etherscan.io/tx/${request.txHash}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-mono text-sm text-gray-900 dark:text-slate-100 cursor-pointer hover:text-primary-600 dark:hover:text-cyan-400 transition-colors break-all underline"
                                          title="View on Etherscan"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {request.txHash}
                                        </a>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(request.txHash!, 'Transaction hash');
                                          }}
                                          className="p-1 text-gray-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
                                          title="Copy transaction hash"
                                        >
                                          <DocumentDuplicateIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntropyScan;

