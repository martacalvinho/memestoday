import React, { useState } from 'react';
import { User } from '../types';
import { Rocket, User as UserIcon, Sword, Image, Crosshair, Zap, Wallet } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  timeRemaining: number;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, timeRemaining, onViewChange }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWalletConnection = () => {
    // In a real implementation, this would connect to a crypto wallet
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Rocket className="text-yellow-400 mr-2" />
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => onViewChange('home')}>MemesToday</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><button onClick={() => onViewChange('battleRoyale')} className="flex items-center"><Sword className="mr-1" />Battle Royale</button></li>
            <li><button onClick={() => onViewChange('memeWars')} className="flex items-center"><Image className="mr-1" />Meme Wars</button></li>
            <li><button onClick={() => onViewChange('bountyHunts')} className="flex items-center"><Crosshair className="mr-1" />Bounty Hunts</button></li>
            <li><button onClick={() => onViewChange('flashChallenges')} className="flex items-center"><Zap className="mr-1" />Flash Challenges</button></li>
          </ul>
        </nav>
        <div className="flex items-center">
          {user && (
            <div className="mr-4 flex items-center cursor-pointer" onClick={() => onViewChange('profile')}>
              <UserIcon className="mr-1" />
              <span className="font-semibold">{user.name}</span>
              <span className="ml-2 text-yellow-400">🔥 {user.streak} day streak</span>
            </div>
          )}
          <div className="bg-gray-700 px-3 py-1 rounded-full mr-4">
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
          <button
            onClick={handleWalletConnection}
            className={`flex items-center px-3 py-1 rounded-full ${
              isWalletConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Wallet className="mr-1" size={16} />
            {isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;