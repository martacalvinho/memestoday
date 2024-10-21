import React, { useState } from 'react';
import { Meme } from '../types';
import { Heart, RotateCcw, User, Award, TrendingUp, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MemeGridProps {
  memes: Meme[];
  onLike: (memeId: number) => void;
  userLikes: number[];
}

const MemeGrid: React.FC<MemeGridProps> = ({ memes, onLike, userLikes }) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const toggleCard = (memeId: number) => {
    setFlippedCards(prev => 
      prev.includes(memeId) ? prev.filter(id => id !== memeId) : [...prev, memeId]
    );
  };

  const renderPopularityGraph = (meme: Meme) => {
    const data = {
      labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
      datasets: [
        {
          label: 'Popularity',
          data: meme.popularityHistory || [0, 2, 1, 3, 5, 4, 6, meme.submissionCount],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Popularity Over Time',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
      {memes.map((meme) => (
        <div 
          key={meme.id} 
          className={`bg-gray-800 rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ${
            flippedCards.includes(meme.id) ? 'rotate-y-180' : ''
          }`}
          onClick={() => toggleCard(meme.id)}
        >
          <div className="p-4 h-full">
            {!flippedCards.includes(meme.id) ? (
              // Front of the card
              <>
                <h3 className="text-xl font-bold mb-2">{meme.name}</h3>
                <p className="text-gray-400 mb-2">{meme.chain}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-400 font-semibold">
                    x{meme.submissionCount}
                  </span>
                  <button 
                    className={`flex items-center ${userLikes.includes(meme.id) ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-400`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(meme.id);
                    }}
                    disabled={userLikes.includes(meme.id)}
                  >
                    <Heart className="mr-1" size={16} fill={userLikes.includes(meme.id) ? 'currentColor' : 'none'} />
                    {meme.likes}
                  </button>
                </div>
                <div className="text-sm text-gray-400 flex items-center">
                  <Calendar className="mr-1" size={14} />
                  {new Date(meme.submissionDate).toLocaleDateString()}
                </div>
              </>
            ) : (
              // Back of the card
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{meme.name} Stats</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <User className="mr-2" size={16} />
                      First submitted by: {meme.firstSubmitter || 'Unknown'}
                    </li>
                    <li className="flex items-center">
                      <RotateCcw className="mr-2" size={16} />
                      Total submissions: {meme.submissionCount}
                    </li>
                    <li className="flex items-center">
                      <Award className="mr-2" size={16} />
                      Shiller's Pick: {meme.shillersPickCount || 0} times
                    </li>
                    <li className="flex items-center">
                      <Heart className="mr-2" size={16} />
                      Total hearts: {meme.likes}
                    </li>
                    <li className="flex items-center">
                      <Calendar className="mr-2" size={16} />
                      Submitted: {new Date(meme.submissionDate).toLocaleString()}
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                    <TrendingUp className="mr-1" size={14} />
                    Popularity Trend
                  </h4>
                  {renderPopularityGraph(meme)}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemeGrid;