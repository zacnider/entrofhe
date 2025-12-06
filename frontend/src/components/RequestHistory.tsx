import React, { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Request {
  requestId: bigint;
  consumer: string;
  tag: string;
  timestamp: bigint;
  fulfilled: boolean;
}

interface RequestHistoryProps {
  address?: string;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ address }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!address || !publicClient) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would filter events by address
        // For now, we'll show a placeholder
        setRequests([]);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [address, publicClient]);

  if (loading) {
    return <div className="text-center py-8 text-primary-600 dark:text-slate-400">Loading requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-8 border border-gray-200 dark:border-slate-700">
          <p className="text-primary-600 dark:text-slate-400 text-lg">
            No requests yet. Make your first entropy request above!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={request.requestId.toString()}
          className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-900 transition bg-white dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {request.fulfilled ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
              ) : (
                <ClockIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-primary-900 dark:text-slate-100">
                  Request #{request.requestId.toString()}
                </p>
                <p className="text-sm text-primary-500 dark:text-slate-400 font-mono">
                  {request.tag}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-600 dark:text-slate-300">
                {new Date(Number(request.timestamp) * 1000).toLocaleString()}
              </p>
              <p className="text-xs text-primary-400 dark:text-slate-500">
                {request.fulfilled ? 'Fulfilled' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestHistory;

