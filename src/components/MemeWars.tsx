import React, { useState } from 'react';
import { Meme } from '../types';
import { Image, ThumbsUp, Upload } from 'lucide-react';

interface MemeWarsProps {
  memes: Meme[];
}

interface MemeSub {
  id: number;
  memeId: number;
  imageUrl: string;
  votes: number;
}

const MemeWars: React.FC<MemeWarsProps> = ({ memes }) => {
  const [memeSubmissions, setMemeSubmissions] = useState<MemeSub[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleMemeSubmit = () => {
    if (selectedMeme && imageUrl) {
      const newSubmission: MemeSub = {
        id: memeSubmissions.length + 1,
        memeId: selectedMeme.id,
        imageUrl,
        votes: 0
      };
      setMemeSubmissions([...memeSubmissions, newSubmission]);
      setSelectedMeme(null);
      setImageUrl('');
    }
  };

  const handleVote = (submissionId: number) => {
    setMemeSubmissions(memeSubmissions.map(sub =>
      sub.id === submissionId ? { ...sub, votes: sub.votes + 1 } : sub
    ));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Image className="mr-2" /> Meme Wars
      </h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Submit a Meme</h3>
        <select
          className="bg-gray-700 text-white p-2 rounded mb-2 w-full"
          value={selectedMeme?.id || ''}
          onChange={(e) => setSelectedMeme(memes.find(m => m.id === Number(e.target.value)) || null)}
        >
          <option value="">Select a memecoin</option>
          {memes.map(meme => (
            <option key={meme.id} value={meme.id}>{meme.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter meme image URL"
          className="bg-gray-700 text-white p-2 rounded mb-2 w-full"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          onClick={handleMemeSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Upload className="mr-2" /> Submit Meme
        </button>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Meme Submissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memeSubmissions.map(sub => (
            <div key={sub.id} className="bg-gray-700 p-4 rounded-lg">
              <img src={sub.imageUrl} alt="Meme" className="w-full h-48 object-cover rounded mb-2" />
              <p className="font-bold">{memes.find(m => m.id === sub.memeId)?.name}</p>
              <div className="flex justify-between items-center mt-2">
                <span>Votes: {sub.votes}</span>
                <button
                  onClick={() => handleVote(sub.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center"
                >
                  <ThumbsUp className="mr-1" size={16} /> Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemeWars;