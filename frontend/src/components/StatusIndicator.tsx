import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface StatusIndicatorProps {
  label: string;
  status: boolean;
  message?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, status, message }) => {
  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
      {status ? (
        <CheckCircleIcon className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0" />
      )}
      <div className="flex-1">
        <div className="font-medium text-primary-900 dark:text-slate-100">{label}</div>
        {message && (
          <div className="text-sm text-primary-600 dark:text-slate-400 mt-1">{message}</div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;

