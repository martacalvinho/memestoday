import React, { useState } from 'react';
import { Crosshair, Search, Award } from 'lucide-react';

interface Bounty {
  id: number;
  description: string;
  criteria: string[];
  reward: string;
  submissions: string[];
}

const BountyHunts: React.FC = () => {
  const [bounties, setBounties] = useState<Bounty[]>([
    {
      id: 1,
      description: "Find the next big memecoin on Ethereum",
      criteria: ["Launched in the last 7 days", "Market cap under $1M", "At least 100 holders"],
      reward: "Top Hunter badge",
      submissions: []
    },
    {
      id: 2,
      description: "Discover a promising memecoin on Solana",
      criteria: ["Active Discord community", "Unique tokenomics", "Clear roadmap"],
      reward: "Featured spot on homepage",
      submissions: []
    }
  ]);

  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [submission, setSubmission] = useState('');

  const handleSubmit = () => {
    if (selectedBounty && submission) {
      setBounties(bounties.map(b =>
        b.id === selectedBounty.id
          ? { ...b, submissions: [...b.submissions, submission] }
          : b
      ));
      setSubmission('');
      setSelectedBounty(null);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Crosshair className="mr-2" /> Bounty Hunts
      </h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Active Bounties</h3>
        {bounties.map(bounty => (
          <div key={bounty.id} className="bg-gray-700 p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">{bounty.description}</h4>
            <ul className="list-disc list-inside mb-2">
              {bounty.criteria.map((criterion, index) => (
                <li key={index}>{criterion}</li>
              ))}
            </ul>
            <p className="text-yellow-400 mb-2">Reward: {bounty.reward}</p>
            <button
              onClick={() => setSelectedBounty(bounty)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            >
              <Search className="mr-2" /> Hunt this bounty
            </button>
          </div>
        ))}
      </div>
      {selectedBounty && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Submit for {selectedBounty.description}</h3>
          <input
            type="text"
            placeholder="Enter memecoin name or contract address"
            className="bg-gray-700 text-white p-2 rounded mb-2 w-full"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Award className="mr-2" /> Submit Bounty
          </button>
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold mb-2">Your Submissions</h3>
        {bounties.flatMap(bounty =>
          bounty.submissions.map((sub, index) => (
            <div key={`${bounty.id}-${index}`} className="bg-gray-700 p-2 rounded mb-2">
              {sub} - for "{bounty.description}"
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BountyHunts;