import React, { useState } from 'react';
import { keccak256, stringToBytes } from 'viem';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface EntropyRequestFormProps {
  onSubmit: (tag: string) => void;
  isPending: boolean;
  disabled?: boolean;
}

const EntropyRequestForm: React.FC<EntropyRequestFormProps> = ({ onSubmit, isPending, disabled = false }) => {
  const [tag, setTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim()) {
      return;
    }
    onSubmit(tag);
    setTag('');
  };

  const generateRandomTag = () => {
    const randomTag = keccak256(stringToBytes(`${Date.now()}-${Math.random()}`));
    setTag(randomTag);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-primary-700 dark:text-slate-300 mb-2">
          Request Tag (bytes32)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag or generate random"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
            required
          />
          <button
            type="button"
            onClick={generateRandomTag}
            className="px-4 py-3 bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-cyan-400 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition font-medium"
          >
            <SparklesIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-primary-500 dark:text-slate-400">
          Unique tag for this entropy request (e.g., keccak256("my-feature"))
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-slate-700 dark:to-slate-800 p-6 rounded-lg border border-primary-200 dark:border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-700 dark:text-slate-300">Fee Per Request</p>
            <p className="text-3xl font-bold text-primary-900 dark:text-cyan-400">0.00001 ETH</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || !tag.trim() || disabled}
        className="w-full px-6 py-3 bg-primary-600 dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-medium shadow-md hover:shadow-lg"
      >
        {disabled 
          ? 'Master Seed Not Initialized' 
          : isPending 
          ? 'Requesting...' 
          : 'Request Entropy'}
      </button>
    </form>
  );
};

export default EntropyRequestForm;

