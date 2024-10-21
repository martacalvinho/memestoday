import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MemeGrid from './components/MemeGrid';
import ShillersPick from './components/ShillersPick';
import SubmissionForm from './components/SubmissionForm';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import BattleRoyale from './components/BattleRoyale';
import MemeWars from './components/MemeWars';
import BountyHunts from './components/BountyHunts';
import FlashChallenges from './components/FlashChallenges';
import { Meme, User } from './types';

function App() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [userLikes, setUserLikes] = useState<number[]>([]);
  const [submittedMemes, setSubmittedMemes] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');

  useEffect(() => {
    // Load memes and users from local storage
    const storedMemes = localStorage.getItem('memes');
    const storedUsers = localStorage.getItem('users');
    const storedCurrentUser = localStorage.getItem('currentUser');

    if (storedMemes) setMemes(JSON.parse(storedMemes));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));

    // If no stored data, initialize with mock data
    if (!storedMemes || !storedUsers || !storedCurrentUser) {
      initializeMockData();
    }

    // Load submitted memes and user likes from local storage
    const storedSubmittedMemes = localStorage.getItem('submittedMemes');
    const storedUserLikes = localStorage.getItem('userLikes');

    if (storedSubmittedMemes) setSubmittedMemes(JSON.parse(storedSubmittedMemes));
    if (storedUserLikes) setUserLikes(JSON.parse(storedUserLikes));
  }, []);

  const initializeMockData = () => {
    const initialMemes: Meme[] = [
      { 
        id: 1, 
        name: '$PEPE', 
        chain: 'Ethereum', 
        submissionCount: 4, 
        likes: 10,
        firstSubmitter: 'CryptoEnthusiast',
        shillersPickCount: 2,
        popularityHistory: [1, 2, 3, 2, 4, 3, 4, 4],
        submissionDate: new Date().toISOString()
      },
      { 
        id: 2, 
        name: '$DOGE', 
        chain: 'Dogecoin', 
        submissionCount: 2, 
        likes: 5,
        firstSubmitter: 'MemeQueen',
        shillersPickCount: 1,
        popularityHistory: [0, 1, 1, 2, 1, 2, 2, 2],
        submissionDate: new Date().toISOString()
      },
    ];

    const initialUsers: User[] = [
      { 
        id: 1, 
        name: 'CryptoEnthusiast', 
        streak: 3, 
        totalSubmissions: 1,
        likedMemes: [2],
        submittedMemes: ['$PEPE'],
        shillersPicks: ['$PEPE'],
        followers: [2],
        following: []
      },
      {
        id: 2,
        name: 'MemeQueen',
        streak: 1,
        totalSubmissions: 1,
        likedMemes: [1],
        submittedMemes: ['$DOGE'],
        shillersPicks: [],
        followers: [],
        following: [1]
      }
    ];

    setMemes(initialMemes);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);

    localStorage.setItem('memes', JSON.stringify(initialMemes));
    localStorage.setItem('users', JSON.stringify(initialUsers));
    localStorage.setItem('currentUser', JSON.stringify(initialUsers[0]));
  };

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      midnight.setHours(midnight.getHours() - 1); // Adjust for Portugal time (UTC+1)
      return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        // Reset daily submissions and update streaks
        setSubmittedMemes([]);
        localStorage.setItem('submittedMemes', JSON.stringify([]));
        if (currentUser && currentUser.totalSubmissions > 0) {
          const updatedUser = {
            ...currentUser,
            streak: currentUser.streak + 1,
            totalSubmissions: 0
          };
          setCurrentUser(updatedUser);
          updateUser(updatedUser);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser]);

  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const handleSubmit = (memeName: string, chain: string) => {
    if (submittedMemes.includes(memeName)) {
      const updatedMemes = memes.map(meme => 
        meme.name === memeName ? { ...meme, submissionCount: meme.submissionCount + 1 } : meme
      );
      setMemes(updatedMemes);
      localStorage.setItem('memes', JSON.stringify(updatedMemes));
    } else {
      const newMeme: Meme = {
        id: memes.length + 1,
        name: memeName,
        chain: chain,
        submissionCount: 1,
        likes: 0,
        firstSubmitter: currentUser?.name || 'Unknown',
        shillersPickCount: 0,
        popularityHistory: [0, 0, 0, 0, 0, 0, 0, 1],
        submissionDate: new Date().toISOString()
      };
      const updatedMemes = [...memes, newMeme];
      setMemes(updatedMemes);
      localStorage.setItem('memes', JSON.stringify(updatedMemes));
      const updatedSubmittedMemes = [...submittedMemes, memeName];
      setSubmittedMemes(updatedSubmittedMemes);
      localStorage.setItem('submittedMemes', JSON.stringify(updatedSubmittedMemes));
    }
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        totalSubmissions: currentUser.totalSubmissions + 1,
        submittedMemes: [...currentUser.submittedMemes, memeName]
      };
      setCurrentUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const handleLike = (memeId: number) => {
    if (!userLikes.includes(memeId)) {
      const updatedUserLikes = [...userLikes, memeId];
      setUserLikes(updatedUserLikes);
      localStorage.setItem('userLikes', JSON.stringify(updatedUserLikes));
      const updatedMemes = memes.map(meme => 
        meme.id === memeId ? { ...meme, likes: meme.likes + 1 } : meme
      );
      setMemes(updatedMemes);
      localStorage.setItem('memes', JSON.stringify(updatedMemes));
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          likedMemes: [...currentUser.likedMemes, memeId]
        };
        setCurrentUser(updatedUser);
        updateUser(updatedUser);
      }
    }
  };

  const handleDateChange = (date: string) => {
    // TODO: Fetch historical data for the selected date
    console.log(`Fetching data for ${date}`);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleFollowUser = (userId: number) => {
    if (currentUser && !currentUser.following.includes(userId)) {
      const updatedUser = {
        ...currentUser,
        following: [...currentUser.following, userId]
      };
      setCurrentUser(updatedUser);
      updateUser(updatedUser);

      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, followers: [...u.followers, currentUser.id] } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const handleUnfollowUser = (userId: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        following: currentUser.following.filter(id => id !== userId)
      };
      setCurrentUser(updatedUser);
      updateUser(updatedUser);

      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, followers: u.followers.filter(id => id !== currentUser.id) } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <SubmissionForm 
              onSubmit={handleSubmit} 
              submittedMemes={submittedMemes}
              userSubmittedToday={currentUser ? currentUser.totalSubmissions > 0 : false}
            />
            <MemeGrid memes={memes} onLike={handleLike} userLikes={userLikes} />
            <ShillersPick memes={memes} onDateChange={handleDateChange} />
            <Leaderboard />
          </>
        );
      case 'profile':
        return (
          <UserProfile 
            user={currentUser} 
            setUser={setCurrentUser} 
            allUsers={users}
            onFollowUser={handleFollowUser}
            onUnfollowUser={handleUnfollowUser}
          />
        );
      case 'battleRoyale':
        return <BattleRoyale memes={memes} />;
      case 'memeWars':
        return <MemeWars memes={memes} />;
      case 'bountyHunts':
        return <BountyHunts />;
      case 'flashChallenges':
        return <FlashChallenges />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header 
        user={currentUser} 
        timeRemaining={timeRemaining} 
        onViewChange={handleViewChange}
      />
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;