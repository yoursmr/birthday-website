import React, { useState, useEffect } from 'react';
import { Heart, Gift, Sparkles, Camera, Gamepad2 } from 'lucide-react';

const BirthdayWebsite = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  const [isOpened, setIsOpened] = useState(false);
  const [currentSection, setCurrentSection] = useState('gift');
  const [letterVisible, setLetterVisible] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [currentGame, setCurrentGame] = useState('memory');
  const [gameCards, setGameCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  
  // Quiz game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // Balloon pop game state
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [balloonGameActive, setBalloonGameActive] = useState(false);

  // Floating hearts animation
  useEffect(() => {
    if (isOpened) {
      const interval = setInterval(() => {
        setHearts(prev => [...prev, {
          id: Math.random(),
          left: Math.random() * 100,
          duration: 3 + Math.random() * 2
        }]);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isOpened]);

  // Clean up old hearts
  useEffect(() => {
    const cleanup = setInterval(() => {
      setHearts(prev => prev.slice(-15));
    }, 3000);
    return () => clearInterval(cleanup);
  }, []);

  // Initialize game
  useEffect(() => {
    if (currentSection === 'game') {
      initializeGame();
    }
  }, [currentSection]);

  const initializeGame = () => {
    const symbols = ['❤️', '💕', '🌹', '💝', '💖', '🦋', '⭐', '🌸'];
    const cards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, matched: false }));
    setGameCards(cards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const firstCard = gameCards.find(c => c.id === first);
      const secondCard = gameCards.find(c => c.id === second);

      if (firstCard.symbol === secondCard.symbol) {
        setMatchedCards([...matchedCards, first, second]);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === gameCards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const openGift = () => {
    setIsOpened(true);
    setTimeout(() => {
      setCurrentSection('letter');
      setLetterVisible(true);
    }, 1000);
  };

  const photos = [
    { color: 'bg-pink-300', text: 'Our First Date ❤️' },
    { color: 'bg-purple-300', text: 'Best Moments 💕' },
    { color: 'bg-red-300', text: 'Adventures Together 🌟' },
    { color: 'bg-rose-300', text: 'Forever Memories 💖' }
  ];

  if (!isOpened) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <Gift className="w-32 h-32 mx-auto text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4 font-script">
            Happy Birthday, My Love! 🎉
          </h1>
          <p className="text-xl text-purple-600 mb-8 font-sans">
            Click the gift to unwrap your surprise...
          </p>
          <button
            onClick={openGift}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:scale-110 transform transition-all duration-300 shadow-lg font-sans"
          >
            Open Gift 🎁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Floating Hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute bottom-0 text-pink-400 text-2xl animate-float pointer-events-none"
          style={{
            left: `${heart.left}%`,
            animation: `float ${heart.duration}s ease-in-out forwards`
          }}
        >
          ❤️
        </div>
      ))}

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .font-script {
          font-family: 'Dancing Script', cursive;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .font-sans {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white bg-opacity-80 backdrop-blur-sm shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-center gap-4 flex-wrap">
          {[
            { id: 'letter', icon: Heart, label: 'Love Letter' },
            { id: 'memories', icon: Camera, label: 'Our Memories' },
            { id: 'game', icon: Gamepad2, label: 'Play Game' },
            { id: 'promise', icon: Sparkles, label: 'My Promise' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentSection(item.id);
                if (item.id === 'letter') setLetterVisible(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentSection === item.id
                  ? 'bg-pink-500 text-white scale-105'
                  : 'bg-white text-pink-500 hover:bg-pink-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold font-sans">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Letter Section */}
        {currentSection === 'letter' && (
          <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-1000 ${
            letterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-red-500 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-center text-pink-600 mb-6 font-script">
              To My Dearest Love
            </h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed font-serif">
              <p>My Darling,</p>
              <p>
                On this special day, I want you to know how incredibly blessed I feel to have you in my life. 
                Every moment with you is a treasure, every laugh we share is a melody, and every day with you 
                is a beautiful adventure.
              </p>
              <p>
                You light up my world in ways I never thought possible. Your smile makes my heart skip a beat, 
                your kindness inspires me to be better, and your love gives me strength to face anything.
              </p>
              <p>
                Happy Birthday to the most amazing person I know. Here's to many more years of love, laughter, 
                and unforgettable memories together.
              </p>
              <p className="text-right italic font-script text-xl">Forever yours,<br/>With all my love ❤️</p>
            </div>
          </div>
        )}

        {/* Memories Section */}
        {currentSection === 'memories' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-8 font-script">
              Our Beautiful Journey 📸
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`${photo.color} rounded-2xl p-8 h-64 flex items-center justify-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer`}
                >
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-white opacity-80" />
                    <p className="text-white text-xl font-bold font-sans">{photo.text}</p>
                    <p className="text-white text-sm mt-2 opacity-80 font-sans">
                      Replace with your actual photos!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Section */}
        {currentSection === 'game' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-4 font-script">
              Love Memory Game 💕
            </h2>
            <p className="text-center text-gray-600 mb-2 font-sans">
              Find all the matching pairs! Moves: {moves}
            </p>
            {gameWon && (
              <div className="text-center mb-4 text-2xl font-bold text-pink-600 animate-bounce font-script">
                🎉 You Won! Just like you won my heart! 🎉
              </div>
            )}
            <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto mb-6">
              {gameCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer transform transition-all duration-300 ${
                    flippedCards.includes(card.id) || matchedCards.includes(card.id)
                      ? 'bg-pink-200 rotate-0'
                      : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:scale-105'
                  }`}
                >
                  {(flippedCards.includes(card.id) || matchedCards.includes(card.id)) ? card.symbol : '❤️'}
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={initializeGame}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all font-sans"
              >
                New Game
              </button>
            </div>
          </div>
        )}

        {/* Promise Section */}
        {currentSection === 'promise' && (
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-16 h-16 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 font-script">
              My Promise to You
            </h2>
            <div className="space-y-4 text-lg text-center font-serif">
              <p className="text-xl">✨ To always make you smile ✨</p>
              <p className="text-xl">💕 To support you in everything 💕</p>
              <p className="text-xl">🌟 To love you more each day 🌟</p>
              <p className="text-xl">💖 To be by your side forever 💖</p>
              <div className="mt-8 text-3xl font-bold font-script">
                Happy Birthday, My Love! 🎂🎉
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayWebsite;