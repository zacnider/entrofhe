import React from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-slate-900 transition-colors">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity -mt-4 -mb-4">
            <img 
              src="/logo.png" 
              alt="Entrofhe Logo" 
              className="h-28 w-28 md:h-36 md:w-36 object-contain"
            />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 text-primary-600 dark:text-slate-300 hover:text-primary-800 dark:hover:text-cyan-400 transition"
            >
              Home
            </Link>
            <Link
              to="/scan"
              className="px-3 py-2 text-primary-600 dark:text-slate-300 hover:text-primary-800 dark:hover:text-cyan-400 transition"
            >
              Scan
            </Link>
            <Link
              to="/docs"
              className="px-3 py-2 text-primary-600 dark:text-slate-300 hover:text-primary-800 dark:hover:text-cyan-400 transition"
            >
              Docs
            </Link>
            <Link
              to="/examples"
              className="px-3 py-2 text-primary-600 dark:text-slate-300 hover:text-primary-800 dark:hover:text-cyan-400 transition"
            >
              Examples
            </Link>
            {address?.toLowerCase() === '0xa2cd33e6e81595fbe8cef825abc1550416829e8f' && (
              <Link
                to="/admin"
                className="px-3 py-2 text-primary-600 dark:text-slate-300 hover:text-primary-800 dark:hover:text-cyan-400 transition"
              >
                Admin
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5 text-gray-600 dark:text-slate-300" />
              ) : (
                <SunIcon className="h-5 w-5 text-gray-600 dark:text-slate-300" />
              )}
            </button>
            {isConnected && address && (
              <div className="text-sm text-primary-600 dark:text-slate-300 font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

