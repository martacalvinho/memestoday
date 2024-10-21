import React, { useState, useEffect } from 'react';
import { Meme } from '../types';
import { Sword, Trophy, ArrowRight, Calendar } from 'lucide-react';

interface BattleRoyaleProps {
  memes: Meme[];
}

const BattleRoyale: React.FC<BattleRoyaleProps> = ({ memes }) => {
  const [brackets, setBrackets] = useState<Meme[][]>([]);
  const [currentMatchup, setCurrentMatchup] = useState(0);
  const [weeklyWinner, setWeeklyWinner] = useState<Meme | null>(null);
  const [tournamentStartDate, setTournamentStartDate] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize brackets with top 16 memes or placeholders
    const topMemes = [...memes].sort((a, b) => b.likes - a.likes).slice(0, 16);
    const placeholders = Array(16 - topMemes.length).fill(null).map((_, index) => ({
      id: -index - 1,
      name: `Placeholder ${index + 1}`,
      chain: 'TBA',
      submissionCount: 0,
      likes: 0,
      firstSubmitter: 'TBA',
      shillersPickCount: 0,
      popularityHistory: [],
      submissionDate: new Date().toISOString()
    }));
    const initialBracket = [...topMemes, ...placeholders];
    setBrackets([initialBracket]);

    // Set tournament start date to the most recent Monday
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setTournamentStartDate(new Date(today.setDate(diff)));
  }, [memes]);

  useEffect(() => {
    // Check if it's time to advance to the next round
    const today = new Date();
    if (tournamentStartDate && today.getDay() === 0) {
      if (brackets[brackets.length - 1].length === 1) {
        setWeeklyWinner(brackets[brackets.length - 1][0]);
      } else {
        advanceToNextRound();
      }
    }
  }, [brackets, tournamentStartDate]);

  const advanceToNextRound = () => {
    const currentRound = brackets[brackets.length - 1];
    const nextRound = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      const winner = Math.random() < 0.5 ? currentRound[i] : currentRound[i + 1];
      nextRound.push(winner);
    }
    setBrackets([...brackets, nextRound]);
    setCurrentMatchup(0);
  };

  const handleVote = (memeId: number) => {
    // In a real implementation, this would update the vote count in the backend
    console.log(`Voted for meme with ID: ${memeId}`);
  };

  const renderMatchup = (meme1: Meme, meme2: Meme) => (
    <div key={`${meme1.id}-${meme2.id}`} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-4">
      <div className="flex-1 text-center">
        <h3 className="font-bold">{meme1.name}</h3>
        <p className="text-sm text-gray-400">Submitted by: {meme1.firstSubmitter}</p>
        <button 
          onClick={() => handleVote(meme1.id)} 
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Vote
        </button>
      </div>
      <div className="mx-4 text-2xl font-bold">VS</div>
      <div className="flex-1 text-center">
        <h3 className="font-bold">{meme2.name}</h3>
        <p className="text-sm text-gray-400">Submitted by: {meme2.firstSubmitter}</p>
        <button 
          onClick={() => handleVote(meme2.id)} 
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Vote
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Sword className="mr-2" /> Battle Royale
      </h2>
      {tournamentStartDate && (
        <p className="mb-4 flex items-center">
          <Calendar className="mr-2" />
          Tournament started on: {tournamentStartDate.toDateString()}
        </p>
      )}
      {weeklyWinner ? (
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Trophy className="mr-2 text-yellow-400" /> Weekly Champion
          </h3>
          <p className="text-2xl">{weeklyWinner.name}</p>
          <p className="text-gray-400">Submitted by: {weeklyWinner.firstSubmitter}</p>
        </div>
      ) : brackets.length > 0 ? (
        <div>
          <h3 className="text-xl font-bold mb-2">Current Matchup</h3>
          {renderMatchup(
            brackets[brackets.length - 1][currentMatchup * 2],
            brackets[brackets.length - 1][currentMatchup * 2 + 1]
          )}
          <p className="mt-4">
            Round {brackets.length} - Matchup {currentMatchup + 1} of {brackets[brackets.length - 1].length / 2}
          </p>
        </div>
      ) : (
        <p>Loading tournament bracket...</p>
      )}
    </div>
  );
};

export default BattleRoyale;