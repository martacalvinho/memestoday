import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SubmissionFormProps {
  onSubmit: (memeName: string, chain: string) => void;
  submittedMemes: string[];
  userSubmittedToday: boolean;
}

const blockchains = [
  'Aptos', 'Arbitrum', 'Avalanche', 'Cardano', 'Cosmos', 'Polkadot', 'Ethereum', 'Fantom', 
  'Bitcoin', 'Binance Chain', 'Loopring', 'Polygon', 'Metis', 'Optimism', 'Osmosis', 
  'Solana', 'Sui', 'Ton', 'Tezos', 'zkSync'
];

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit, submittedMemes, userSubmittedToday }) => {
  const [memeName, setMemeName] = useState('');
  const [chain, setChain] = useState('');
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [filteredBlockchains, setFilteredBlockchains] = useState(blockchains);

  useEffect(() => {
    setFilteredBlockchains(
      blockchains.filter(b => b.toLowerCase().startsWith(chain.toLowerCase()))
    );
  }, [chain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userSubmittedToday) {
      setError('You can only submit one coin per day.');
      return;
    }
    if (!memeName.includes('$')) {
      setError('Memecoin name must include a $ symbol.');
      return;
    }
    if (memeName.split(' ').length > 1) {
      setError('Memecoin name must be a single word.');
      return;
    }
    setError('');
    onSubmit(memeName, chain);
    setMemeName('');
    setChain('');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 my-8">
      <h2 className="text-2xl font-bold mb-4">Submit Your Memecoin</h2>
      <button 
        onClick={() => setShowRules(!showRules)} 
        className="flex items-center text-yellow-400 mb-4"
      >
        {showRules ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
        {showRules ? 'Hide Rules' : 'Show Rules'}
      </button>
      {showRules && (
        <div className="bg-gray-700 p-4 rounded-md mb-4">
          <ul className="list-disc list-inside">
            <li>Submissions reset every 24 hours. Only the Meme of the Day remains.</li>
            <li>You can only submit one coin per day.</li>
            <li>See what degens around the CT are loving in real-time.</li>
            <li>Memecoin name must include a $ symbol and be a single word.</li>
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={memeName}
            onChange={(e) => setMemeName(e.target.value)}
            placeholder="Memecoin Name (e.g. $PEPE)"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md"
            required
          />
          {submittedMemes.includes(memeName) && (
            <p className="text-yellow-400 mt-1">This memecoin has already been submitted today.</p>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            placeholder="Blockchain"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md"
            required
          />
          {chain && filteredBlockchains.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-700 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredBlockchains.map((blockchain, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => setChain(blockchain)}
                >
                  {blockchain}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-md"
          disabled={userSubmittedToday}
        >
          {userSubmittedToday ? 'Already Submitted Today' : 'Submit'}
        </button>
      </form>
      {error && (
        <div className="mt-4 bg-red-500 text-white p-3 rounded-md flex items-center">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default SubmissionForm;