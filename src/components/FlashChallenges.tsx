import React, { useState, useEffect } from 'react';
import { Zap, Clock, Award } from 'lucide-react';

interface FlashChallenge {
  id: number;
  title: string;
  description: string;
  duration: number; // in seconds
  startTime: number;
  submissions: string[];
}

const FlashChallenges: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<FlashChallenge | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submission, setSubmission] = useState('');

  useEffect(() => {
    // Simulating a new challenge every 5 minutes
    const interval = setInterval(() => {
      const newChallenge: FlashChallenge = {
        id: Date.now(),
        title: "Next Hour Hero",
        description: "Submit the memecoin you think will gain the most attention in the next hour!",
        duration: 3600, // 1 hour in seconds
        startTime: Date.now(),
        submissions: []
      };
      setActiveChallenge(newChallenge);
      setTimeRemaining(newChallenge.duration);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeChallenge) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeChallenge.startTime) / 1000);
        const remaining = Math.max(0, activeChallenge.duration - elapsed);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setActiveChallenge(null);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeChallenge]);

  const handleSubmit = () => {
    if (activeChallenge && submission) {
      setActiveChallenge({
        ...activeChallenge,
        submissions: [...activeChallenge.submissions, submission]
      });
      setSubmission('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Zap className="mr-2" /> Flash Challenges
      </h2>
      {activeChallenge ? (
        <div>
          <h3 className="text-xl font-bold mb-2">{activeChallenge.title}</h3>
          <p className="mb-4">{activeChallenge.description}</p>
          <div className="flex items-center mb-4">
            <Clock className="mr-2" />
            <span className="text-xl font-bold">{formatTime(timeRemaining)}</span>
          </div>
          <input
            type="text"
            placeholder="Enter your submission"
            className="bg-gray-700 text-white p-2 rounded mb-2 w-full"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded flex items-center"
          >
            <Award className="mr-2" /> Submit Entry
          </button>
          <div className="mt-4">
            <h4 className="font-bold mb-2">Current Submissions:</h4>
            <ul className="list-disc list-inside">
              {activeChallenge.submissions.map((sub, index) => (
                <li key={index}>{sub}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No active flash challenge at the moment. Check back soon!</p>
      )}
    </div>
  );
};

export default FlashChallenges;