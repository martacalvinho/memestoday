import React from 'react';
import { Trophy } from 'lucide-react';

const Leaderboard: React.FC = () => {
  // Mock data for the leaderboard
  const topShillers = [
    { id: 1, name: 'CryptoKing', submissions: 15, picks: 3 },
    { id: 2, name: 'MemeQueen', submissions: 12, picks: 2 },
    { id: 3, name: 'BlockchainBoss', submissions: 10, picks: 1 },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Trophy className="text-yellow-400 mr-2" />
        Leaderboard
      </h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="py-2">Rank</th>
            <th>Name</th>
            <th>Submissions</th>
            <th>Shiller's Picks</th>
          </tr>
        </thead>
        <tbody>
          {topShillers.map((shiller, index) => (
            <tr key={shiller.id} className="border-t border-gray-700">
              <td className="py-2">{index + 1}</td>
              <td>{shiller.name}</td>
              <td>{shiller.submissions}</td>
              <td>{shiller.picks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;