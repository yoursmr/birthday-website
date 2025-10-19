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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
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

  // Video URLs - REPLACE THESE WITH YOUR ACTUAL VIDEO URLs
  const videos = [
    { 
        url: 'https://www.youtube.com/embed/oZHQhiUfcwU', 
      title: 'My bebuda 😂✨',
      caption: 'Bebu stuck under bench ...'
    },
    { 
      url: 'https://www.youtube.com/embed/ejrr94fav4E', 
      title: 'Jaanu with 🛫',
      caption: 'Janu while airplane is taking off ...'
    },
    { 
      url: 'https://www.youtube.com/embed/fVDL9Y_uFrA', 
      title: 'Us at Cafe Avion ☕️',
      caption: 'Possible just cuz of you ...'
    },
    { 
      url: 'https://www.youtube.com/embed/ZLOWOO92LGE', 
      title: 'Chandali ☕️',
      caption: 'Our first dating destination ...'
    }
  ];

  // Randomize video when entering memories section
  useEffect(() => {
    if (currentSection === 'memories') {
      const randomIndex = Math.floor(Math.random() * videos.length);
      setCurrentVideoIndex(randomIndex);
    }
  }, [currentSection]);

  // Floating hearts animation - MORE hearts!
  useEffect(() => {
    if (isOpened) {
      const interval = setInterval(() => {
        setHearts(prev => [...prev, {
          id: Math.random(),
          left: Math.random() * 100,
          duration: 3 + Math.random() * 2
        }]);
      }, 400);

      return () => clearInterval(interval);
    }
  }, [isOpened]);

  // Clean up old hearts
  useEffect(() => {
    const cleanup = setInterval(() => {
      setHearts(prev => prev.slice(-30));
    }, 3000);
    return () => clearInterval(cleanup);
  }, []);

  // Initialize game
  useEffect(() => {
    if (currentSection === 'game') {
      if (currentGame === 'memory') {
        initializeGame();
      } else if (currentGame === 'quiz') {
        initializeQuiz();
      } else if (currentGame === 'balloon') {
        initializeBalloonGame();
      }
    }
  }, [currentSection, currentGame]);

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

  const quizQuestions = [
    {
      question: "What do I love most about you?",
      options: ["Your smile", "Your kindness", "Your laugh", "Everything!"],
      correct: 3
    },
    {
      question: "What's our favorite thing to do together?",
      options: ["Watch movies", "Go for walks", "Cook together", "Talk for hours"],
      correct: 3
    },
    {
      question: "When did I know you were special?",
      options: ["First moment I saw you", "Our first date", "After a few weeks", "Instantly"],
      correct: 0
    },
    {
      question: "What makes our relationship unique?",
      options: ["Trust", "Love", "Friendship", "All of the above"],
      correct: 3
    },
    {
      question: "How much do I love you?",
      options: ["A lot", "So much", "More than words", "To infinity!"],
      correct: 3
    }
  ];

  const initializeQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
  };

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const initializeBalloonGame = () => {
    setBalloonGameActive(true);
    setPoppedCount(0);
    const newBalloons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 85,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 2,
      color: ['bg-pink-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-300'][Math.floor(Math.random() * 4)],
      popped: false
    }));
    setBalloons(newBalloons);
  };

  const popBalloon = (id) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(prev => prev + 1);
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
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-2xl font-sans animate-pulse hover:animate-none"
          >
            Open Gift 🎁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
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
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-200px) rotate(5deg);
          }
          100% {
            transform: translateY(-400px) rotate(-5deg);
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-110 ${
                currentSection === item.id
                  ? 'bg-pink-500 text-white scale-105 shadow-lg'
                  : 'bg-white text-pink-500 hover:bg-pink-100 hover:shadow-md'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold font-sans">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
        {currentSection === 'letter' && (
          <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-1000 hover:shadow-pink-200 hover:shadow-2xl ${
            letterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-red-500 animate-pulse hover:scale-125 transition-transform duration-300" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-center text-pink-600 mb-6 font-script">
              To My Dearest NK
            </h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed font-serif">
              <p>My Baby,</p>
              <p>
                On this special day, I want you to know how incredibly blessed I feel to have you in my life. 
                Every moment with you is a Sukoon 🧿✨, every laugh we share is a deep happiness 🫂✨, and every day with you 
                is a blessing ❤️🧿.
              </p>
              <p>
                You light up my world in ways I never thought possible. Your smile makes my heart skip a beat 🫠, 
                your kindness inspires me to be better 🙇🏻, and your love gives me strength to face anything 🫂.
              </p>
              <p>
                Happy Birthday to the most amazing person I know ❤️✨. Here's to many more years of love, laughter, 
                and unforgettable memories together 🫂❤️🧿.
                 I loveeeee youuuuu soooooo muchhhh myyyyy jaaaannnnnn 🥹❤️🫂😘🧿✨
              </p>
             
              <p className="text-right italic font-script text-xl">Forever yours,<br/>With all my love ❤️</p>
            </div>
          </div>
        )}

        {currentSection === 'memories' && (
          <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 overflow-hidden">
            {videos.length > 0 ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-4 font-script">
                  {videos[currentVideoIndex].title}
                </h2>
                <p className="text-center text-gray-600 mb-6 font-serif text-lg">
                  {videos[currentVideoIndex].caption}
                </p>
                
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    key={currentVideoIndex}
                    className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-lg"
                    src={`${videos[currentVideoIndex].url}?autoplay=1&mute=1&loop=1&playlist=${videos[currentVideoIndex].url.split('/embed/')[1]}`}
                    title={videos[currentVideoIndex].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="text-center mt-4">
                  <a
                    href={videos[currentVideoIndex].url.replace('/embed/', '/watch?v=')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 underline font-sans text-sm"
                  >
                    Video not loading? Open in YouTube →
                  </a>
                </div>

                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                  <button
                    onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all font-sans hover:shadow-xl"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      const randomIndex = Math.floor(Math.random() * videos.length);
                      setCurrentVideoIndex(randomIndex);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all font-sans hover:shadow-xl"
                  >
                    🎲 Random
                  </button>
                  <button
                    onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all font-sans hover:shadow-xl"
                  >
                    Next →
                  </button>
                </div>

                <div className="text-center mt-4 text-gray-500 font-sans">
                  Video {currentVideoIndex + 1} of {videos.length}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-24 h-24 mx-auto mb-6 text-pink-400 animate-pulse" />
                <h2 className="text-3xl font-bold text-pink-600 mb-4 font-script">
                  Our Beautiful Memories 💕
                </h2>
                <p className="text-gray-600 font-serif text-lg mb-4">
                  Add your special videos to make this section come alive!
                </p>
                <p className="text-gray-500 font-sans text-sm">
                  Update the videos array in App.js with your YouTube or Google Drive links
                </p>
              </div>
            )}
          </div>
        )}

        {currentSection === 'game' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-6 font-script">
              Love Games 💕
            </h2>
            
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <button
                onClick={() => setCurrentGame('memory')}
                className={`px-6 py-3 rounded-full font-sans font-semibold transition-all hover:scale-110 hover:shadow-lg ${
                  currentGame === 'memory'
                    ? 'bg-pink-500 text-white scale-105'
                    : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                }`}
              >
                💕 Memory Match
              </button>
              <button
                onClick={() => setCurrentGame('quiz')}
                className={`px-6 py-3 rounded-full font-sans font-semibold transition-all hover:scale-110 hover:shadow-lg ${
                  currentGame === 'quiz'
                    ? 'bg-pink-500 text-white scale-105'
                    : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                }`}
              >
                💖 Love Quiz
              </button>
              <button
                onClick={() => setCurrentGame('balloon')}
                className={`px-6 py-3 rounded-full font-sans font-semibold transition-all hover:scale-110 hover:shadow-lg ${
                  currentGame === 'balloon'
                    ? 'bg-pink-500 text-white scale-105'
                    : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                }`}
              >
                🎈 Pop Hearts
              </button>
            </div>

            {currentGame === 'memory' && (
              <div>
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
                      className={`w-full rounded-xl flex items-center justify-center text-4xl cursor-pointer transform transition-all duration-300 ${
                        flippedCards.includes(card.id) || matchedCards.includes(card.id)
                          ? 'bg-pink-200 rotate-0'
                          : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:scale-105'
                      }`}
                      style={{ aspectRatio: '1/1', minHeight: '70px' }}
                    >
                      {(flippedCards.includes(card.id) || matchedCards.includes(card.id)) ? card.symbol : '❤️'}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={initializeGame}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all font-sans hover:shadow-xl"
                  >
                    New Game
                  </button>
                </div>
              </div>
            )}

            {currentGame === 'quiz' && (
              <div className="max-w-2xl mx-auto">
                {!quizCompleted ? (
                  <div>
                    <div className="mb-6 text-center">
                      <span className="text-sm text-gray-500 font-sans">
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-center text-pink-600 mb-8 font-serif">
                      {quizQuestions[currentQuestion].question}
                    </h3>
                    <div className="space-y-4">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 rounded-xl font-sans text-lg transition-all ${
                            selectedAnswer === null
                              ? 'bg-pink-100 hover:bg-pink-200 text-pink-800'
                              : selectedAnswer === index
                              ? index === quizQuestions[currentQuestion].correct
                                ? 'bg-green-400 text-white'
                                : 'bg-red-400 text-white'
                              : index === quizQuestions[currentQuestion].correct
                              ? 'bg-green-400 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-3xl font-bold text-pink-600 mb-4 font-script">
                      Quiz Complete!
                    </h3>
                    <p className="text-2xl text-gray-700 mb-4 font-serif">
                      You scored {quizScore} out of {quizQuestions.length}!
                    </p>
                    <p className="text-xl text-pink-600 mb-8 font-sans">
                      {quizScore === quizQuestions.length
                        ? "Perfect! You know me so well! 💕"
                        : quizScore >= 3
                        ? "Amazing! Our connection is special! ❤️"
                        : "Every answer is right when it comes to us! 💖"}
                    </p>
                    <button
                      onClick={initializeQuiz}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all font-sans hover:shadow-xl"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentGame === 'balloon' && (
              <div className="relative">
                <p className="text-center text-gray-600 mb-4 font-sans text-lg">
                  Pop the heart balloons! 🎈 Popped: {poppedCount}/15
                </p>
                {poppedCount === 15 && (
                  <div className="text-center mb-4 text-2xl font-bold text-pink-600 animate-bounce font-script">
                    🎉 You popped all my heart balloons! 🎉
                  </div>
                )}
                <div className="relative h-96 bg-gradient-to-b from-blue-100 to-blue-50 rounded-2xl overflow-hidden">
                  {balloons.map((balloon) => (
                    !balloon.popped && (
                      <div
                        key={balloon.id}
                        onClick={() => popBalloon(balloon.id)}
                        className={`absolute bottom-0 w-16 h-20 ${balloon.color} rounded-full cursor-pointer hover:scale-110 transition-transform`}
                        style={{
                          left: `${balloon.left}%`,
                          animation: `floatUp ${balloon.duration}s ease-in ${balloon.delay}s infinite`,
                        }}
                      >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                          ❤️
                        </div>
                        <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-pink-300 transform -translate-x-1/2"></div>
                      </div>
                    )
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button
                    onClick={initializeBalloonGame}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all font-sans hover:shadow-xl"
                  >
                    New Game
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentSection === 'promise' && (
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-16 h-16 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 font-script">
              My Promise to You
            </h2>
            <div className="space-y-4 text-lg text-center font-serif">
              <p className="text-xl">✨ To always make you happy ✨</p>
              <p className="text-xl">💕 To support you in everything 💕</p>
              <p className="text-xl">🌟 To love you more each day 🌟</p>
              <p className="text-xl">💖 To be by your side forever 💖</p>
              <p className="text-xl">🫂 To do everything for us forever ♾️</p>
           
              <div className="mt-8 text-3xl font-bold font-script">
                Happy Birthday, My Love! ❤️, My Nkudi 😘, My Tutu 🐢✨
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayWebsite;