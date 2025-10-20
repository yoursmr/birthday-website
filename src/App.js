import React, { useState, useEffect } from 'react';
import { Heart, Gift, Sparkles, Camera, Gamepad2, Music, Star } from 'lucide-react';

const BirthdayWebsite = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600;700&family=Pacifico&family=Great+Vibes&family=Righteous&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load EmailJS SDK
    console.log('🔄 Loading EmailJS SDK...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ EmailJS SDK loaded successfully!');
      try {
        window.emailjs.init('na8mybrNB6RfJIsSp');
        console.log('✅ EmailJS initialized with public key: na8mybrNB6RfJIsSp');
        console.log('✅ EmailJS is ready to use!');
      } catch (error) {
        console.error('❌ Error initializing EmailJS:', error);
      }
    };
    script.onerror = () => {
      console.error('❌ Failed to load EmailJS SDK');
    };
    document.head.appendChild(script);
  }, []);

  const [isOpened, setIsOpened] = useState(false);
  const [currentSection, setCurrentSection] = useState('gift');
  const [letterVisible, setLetterVisible] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [currentGame, setCurrentGame] = useState('memory');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [gameCards, setGameCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [balloonGameActive, setBalloonGameActive] = useState(false);
  const [letterUnlocked, setLetterUnlocked] = useState(false);
  const [promiseUnlocked, setPromiseUnlocked] = useState(false);
  const [letterPassword, setLetterPassword] = useState('');
  const [promisePassword, setPromisePassword] = useState('');
  const [letterShake, setLetterShake] = useState(false);
  const [promiseShake, setPromiseShake] = useState(false);
  const [teddyHover, setTeddyHover] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [burstHearts, setBurstHearts] = useState([]);
  const [giftOpening, setGiftOpening] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [wishText, setWishText] = useState('');
  const [wishes, setWishes] = useState([]);
  const [showWishResponse, setShowWishResponse] = useState(false);
  const [wishResponse, setWishResponse] = useState('');
  
  const LETTER_PASSWORD = 'iloveyou';
  const PROMISE_PASSWORD = 'forever';

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
      title: 'Chandalai 🌊',
      caption: 'Our first dating destination ...'
    }
  ];


  const songs = [
    { url: 'https://www.youtube.com/embed/JGwWNGJdvx8', title: 'Perfect 🎵', caption: 'I am in love in shape with you... ' },
    { url: 'https://www.youtube.com/embed/JFUoE0ArWd4', title: 'Khayal 💕', caption: 'I am yours bebu...' },
    { url: 'https://www.youtube.com/embed/DULrvDVqyXI', title: 'Naam Tera Tera 🫂', caption: 'Dil ki surkh diwaron p naam hai tera ...' }
  ];

  useEffect(() => {
    if (currentSection === 'memories') {
      const randomIndex = Math.floor(Math.random() * videos.length);
      setCurrentVideoIndex(randomIndex);
    }
  }, [currentSection]);

  useEffect(() => {
    if (currentSection === 'songs') {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    }
  }, [currentSection]);

  useEffect(() => {
    if (isOpened) {
      const interval = setInterval(() => {
        setHearts(prev => [...prev, { id: Math.random(), left: Math.random() * 100, duration: 3 + Math.random() * 2 }]);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isOpened]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setHearts(prev => prev.slice(-30));
    }, 3000);
    return () => clearInterval(cleanup);
  }, []);

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
    { question: "What do I love most about you?", options: ["Your smile", "Your kindness", "Your laugh", "Everything!"], correct: 3 },
    { question: "What's our favorite thing to do together?", options: ["Watch movies", "Go for walks", "Cook together", "Talk for hours"], correct: 3 },
    { question: "When did I know you were special?", options: ["First moment I saw you", "Our first date", "After a few weeks", "Instantly"], correct: 0 },
    { question: "What makes our relationship unique?", options: ["Trust", "Love", "Friendship", "All of the above"], correct: 3 },
    { question: "How much do I love you?", options: ["A lot", "So much", "More than words", "To infinity!"], correct: 3 }
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
    setGiftOpening(true);
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: 50 + (Math.random() - 0.5) * 20,
      color: ['#ec4899', '#a855f7', '#f43f5e', '#fb923c', '#fbbf24'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.3,
      xOffset: (Math.random() - 0.5) * 400
    }));
    setConfettiPieces(newConfetti);
    setTimeout(() => {
      setGiftOpening(false);
      setIsOpened(true);
      setTimeout(() => {
        setCurrentSection('letter');
        setLetterVisible(true);
      }, 500);
    }, 2000);
  };

  const handleTeddyClick = () => {
    setHeartBurst(true);
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 20,
      delay: i * 0.05
    }));
    setBurstHearts(newHearts);
    setTimeout(() => {
      openGift();
    }, 1200);
    setTimeout(() => {
      setHeartBurst(false);
      setBurstHearts([]);
    }, 1500);
  };

  const handleLetterPasswordSubmit = (e) => {
    e.preventDefault();
    if (letterPassword.toLowerCase() === LETTER_PASSWORD.toLowerCase()) {
      setLetterUnlocked(true);
      setLetterPassword('');
    } else {
      setLetterShake(true);
      setTimeout(() => setLetterShake(false), 500);
      setLetterPassword('');
    }
  };

  const handlePromisePasswordSubmit = (e) => {
    e.preventDefault();
    if (promisePassword.toLowerCase() === PROMISE_PASSWORD.toLowerCase()) {
      setPromiseUnlocked(true);
      setPromisePassword('');
    } else {
      setPromiseShake(true);
      setTimeout(() => setPromiseShake(false), 500);
      setPromisePassword('');
    }
  };

  const handleWishSubmit = async (e) => {
    e.preventDefault();
    if (wishText.trim()) {
      try {
        const templateParams = {
          wish: wishText,
          timestamp: new Date().toLocaleString(),
          wish_number: wishes.length + 1
        };
        await window.emailjs.send('service_rm81ox8', 'template_8l6xv55', templateParams);
        console.log('✅ Wish sent successfully via email!');
      } catch (error) {
        console.error('❌ Error sending wish:', error);
      }
      
      const burstHearts = Array.from({ length: 50 }, (_, i) => ({
        id: Math.random(),
        left: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 0.5
      }));
      setHearts(prev => [...prev, ...burstHearts]);
      
      const responses = [
        "Your wish has been sent to the stars! ✨ May all your dreams come true, my love.",
        "The universe heard your wish! 💫 I hope this year brings you everything your heart desires.",
        "What a beautiful wish! 🌟 You deserve all the happiness in the world.",
        "Your wish is sealed with love! 💕 May it blossom into reality.",
        "The magic is real! ✨ Your wish is flying to the heavens as we speak.",
        "Wish granted in my heart! 💖 You are truly special and deserve the best.",
        "Your wish touched my soul! 🌙 May the universe conspire to make it happen.",
        "Such a heartfelt wish! 💝 I'm sending all my love to make it come true."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setWishResponse(randomResponse);
      setShowWishResponse(true);
      setWishes(prev => [...prev, wishText]);
      setWishText('');
      setTimeout(() => {
        setShowWishResponse(false);
      }, 4000);
    }
  };

  if (!isOpened) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `bounce-hearts ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              💕
            </div>
          ))}
        </div>

        {heartBurst && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
            {burstHearts.map((heart) => {
              const tx = Math.cos((heart.angle * Math.PI) / 180) * 300;
              const ty = Math.sin((heart.angle * Math.PI) / 180) * 300;
              return (
                <div
                  key={heart.id}
                  className="absolute text-4xl"
                  style={{
                    animation: `heart-burst 1.2s ease-out ${heart.delay}s forwards`,
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`
                  }}
                >
                  💖
                </div>
              );
            })}
          </div>
        )}

        {giftOpening && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {confettiPieces.map((piece) => (
              <div
                key={piece.id}
                className="absolute w-3 h-3"
                style={{
                  left: `${piece.left}%`,
                  top: '50%',
                  backgroundColor: piece.color,
                  animation: `confetti-fall 2s ease-out ${piece.delay}s forwards`,
                  '--fx': `${piece.xOffset}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0'
                }}
              />
            ))}
            
            <div className="text-9xl" style={{ animation: 'gift-shake 0.5s ease-in-out infinite' }}>
              🎁
            </div>
            
            <div 
              className="absolute text-5xl md:text-7xl font-bold text-white animate-pulse" 
              style={{ 
                fontFamily: "'Righteous', cursive",
                textShadow: '0 0 30px rgba(236, 72, 153, 1), 0 0 60px rgba(168, 85, 247, 0.8)',
                top: '60%'
              }}
            >
              🎉 OPENING! 🎉
            </div>
          </div>
        )}

        <style>{`
          @keyframes bounce-hearts {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes heart-burst {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx), var(--ty)) scale(0.5);
              opacity: 0;
            }
          }
          @keyframes confetti-fall {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(var(--fx), 100vh) rotate(720deg);
              opacity: 0;
            }
          }
          @keyframes gift-shake {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(-10deg); }
            50% { transform: scale(1.2) rotate(10deg); }
            75% { transform: scale(1.1) rotate(-10deg); }
          }
        `}</style>

        <div className="text-center relative z-10">
          <div 
            className="mb-8 relative inline-block cursor-pointer hover:scale-105 transition-transform"
            onMouseEnter={() => setTeddyHover(true)}
            onMouseLeave={() => setTeddyHover(false)}
            onClick={handleTeddyClick}
          >
            <div className={`text-9xl ${heartBurst ? '' : 'animate-bounce'}`}>
              🧸
            </div>
            <div className={`absolute -top-4 right-0 text-6xl transition-all duration-300 ${
              teddyHover ? 'scale-125 rotate-12' : 'scale-100'
            }`}>
              🎁
            </div>
            {teddyHover && !heartBurst && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap animate-pulse">
                <span className="text-sm font-sans text-pink-600">Click me! 💕</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "'Great Vibes', cursive" }}>
            <span className="text-pink-600">Happy Birthday,</span>
            <br />
            <span className="text-6xl md:text-8xl text-purple-600">My Love!</span>
            <span className="inline-block ml-4 text-6xl animate-spin" style={{ animationDuration: '3s' }}>🎉</span>
          </h1>
          
          <p className="text-2xl text-purple-600 mb-4 mt-6" style={{ fontFamily: "'Righteous', cursive", fontWeight: '400', letterSpacing: '1px' }}>
            Teddy has a special surprise for you...
          </p>
          
          <p className="text-lg text-pink-500 mb-8 animate-pulse" style={{ fontFamily: "'Righteous', cursive" }}>
            ✨ Click the teddy or the gift to unwrap! ✨
          </p>

          <button
            onClick={openGift}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-5 rounded-full text-2xl font-semibold hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 group relative overflow-hidden"
            style={{ fontFamily: "'Righteous', cursive" }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>Open Your Gift</span>
              <span className="group-hover:rotate-12 transition-transform">🎁</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <div className="mt-8 flex justify-center gap-6 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎈</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💝</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌹</span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>💕</span>
            <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🎂</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute bottom-0 text-pink-400 text-2xl pointer-events-none"
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
          0% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-200px) rotate(5deg); }
          100% { transform: translateY(-400px) rotate(-5deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.5); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.8), 0 0 60px rgba(168, 85, 247, 0.6); }
        }
        @keyframes unlock {
          0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .shake { animation: shake 0.5s; }
        .glow-animation { animation: glow 2s infinite; }
        .unlock-animation { animation: unlock 0.8s ease-out; }
      `}</style>

      <nav className="bg-white bg-opacity-80 backdrop-blur-sm shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-center gap-4 flex-wrap">
          {[
            { id: 'letter', icon: Heart, label: 'Love Letter' },
            { id: 'songs', icon: Music, label: 'Our Songs' },
            { id: 'memories', icon: Camera, label: 'Our Memories' },
            { id: 'wishes', icon: Star, label: 'Birthday Wishes' },
            { id: 'game', icon: Gamepad2, label: 'Play Game' },
            { id: 'promise', icon: Sparkles, label: 'My Promise' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentSection(item.id);
                if (item.id === 'letter') setLetterVisible(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-110 font-sans ${
                currentSection === item.id
                  ? 'bg-pink-500 text-white scale-105 shadow-lg'
                  : 'bg-white text-pink-500 hover:bg-pink-100 hover:shadow-md'
              }`}
            >
              {typeof item.icon === 'string' ? (
                <span className="text-xl">{item.icon}</span>
              ) : (
                <item.icon className="w-5 h-5" />
              )}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
        {currentSection === 'letter' && (
          <div className={`unlock-animation ${letterVisible ? 'opacity-100' : 'opacity-0'}`}>
            {!letterUnlocked ? (
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 to-purple-200/30 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative group">
                      <Heart className="w-24 h-24 text-pink-500 opacity-20 absolute top-0 left-0 group-hover:scale-150 transition-transform duration-500" />
                      <div className="text-8xl group-hover:scale-110 transition-transform duration-300">🔒</div>
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    A Love Letter Awaits... 💕
                  </h2>
                  <p className="text-center text-gray-600 mb-8 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Enter the secret word to unlock my heart's message
                  </p>
                  
                  <form onSubmit={handleLetterPasswordSubmit} className="max-w-md mx-auto">
                    <div className={`relative ${letterShake ? 'shake' : ''}`}>
                      <input
                        type="password"
                        value={letterPassword}
                        onChange={(e) => setLetterPassword(e.target.value)}
                        placeholder="Enter the magic word..."
                        className="w-full px-6 py-4 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-center text-lg font-sans transition-all glow-animation"
                        autoFocus
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                        ✨
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl font-sans group"
                    >
                      <span className="group-hover:hidden">Unlock My Heart 💖</span>
                      <span className="hidden group-hover:inline">Click to Open 🔓</span>
                    </button>
                  </form>
                  
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-pink-400 animate-pulse">
                      <span className="text-2xl">💡</span>
                      <span className="text-sm font-sans">Hint: Three words, eight letters</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-1000 hover:shadow-pink-200 hover:shadow-2xl unlock-animation">
                <div className="flex items-center justify-center mb-6">
                  <Heart className="w-12 h-12 text-red-500 animate-pulse hover:scale-125 transition-transform duration-300" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-center text-pink-600 mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  To My Dearest NK
                </h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
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
                  <p className="text-right italic text-xl" style={{ fontFamily: "'Dancing Script', cursive" }}>Forever yours,<br/>With all my love ❤️</p>
                </div>
              </div>
            )}
          </div>
        )}

        {currentSection === 'songs' && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-3" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Songs I Dedicate to You 🎵
            </h2>
            <p className="text-center text-gray-600 mb-6 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {songs[currentSongIndex].caption}
            </p>
            
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                key={currentSongIndex}
                className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
                src={`${songs[currentSongIndex].url}?autoplay=0`}
                title={songs[currentSongIndex].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="text-center mt-6">
              <h3 className="text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {songs[currentSongIndex].title}
              </h3>
              <p className="text-gray-500 font-sans text-sm mb-6">
                Click play to hear the music of my heart 💕
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <button
                onClick={() => setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full font-semibold hover:scale-110 transition-all hover:shadow-xl flex items-center justify-center text-2xl"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentSongIndex(Math.floor(Math.random() * songs.length))}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-14 h-14 rounded-full font-semibold hover:scale-110 transition-all hover:shadow-xl flex items-center justify-center text-2xl"
              >
                🎲
              </button>
              <button
                onClick={() => setCurrentSongIndex((prev) => (prev + 1) % songs.length)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full font-semibold hover:scale-110 transition-all hover:shadow-xl flex items-center justify-center text-2xl"
              >
                →
              </button>
            </div>
          </div>
        )}

        {currentSection === 'memories' && (
          <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              {videos[currentVideoIndex].title}
            </h2>
            <p className="text-center text-gray-600 mb-6 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
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

            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <button
                onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full font-semibold hover:scale-110 transition-all hover:shadow-xl flex items-center justify-center text-2xl"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentVideoIndex(Math.floor(Math.random() * videos.length))}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-14 h-14 rounded-full font-semibold hover:scale-110 transition-all hover:shadow-xl flex items-center justify-center text-2xl"
              >
                🎲
              </button>
              <button
                onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full font-semibold hover:scale-110 transition-all hover:shadow-xl flex items-center justify-center text-2xl"
              >
                →
              </button>
            </div>
          </div>
        )}

        {currentSection === 'timeline' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Our Beautiful Journey 📅
            </h2>
            <p className="text-center text-gray-600 mb-10 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Every moment with you is a milestone worth celebrating
            </p>

            <div className="max-w-3xl mx-auto relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 to-purple-300 hidden md:block"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`mb-8 flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  onClick={() => setCurrentMilestone(index)}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className={`bg-gradient-to-br ${
                      index % 2 === 0 ? 'from-pink-100 to-purple-100' : 'from-purple-100 to-pink-100'
                    } p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                      currentMilestone === index ? 'ring-4 ring-pink-400' : ''
                    }`}>
                      <div className="text-4xl mb-3">{milestone.emoji}</div>
                      <h3 className="text-xl font-bold text-pink-600 mb-2" style={{ fontFamily: "'Righteous', cursive" }}>
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 font-sans">{milestone.date}</p>
                      <p className="text-gray-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className={`w-6 h-6 rounded-full ${
                      currentMilestone === index ? 'bg-pink-500 scale-150' : 'bg-purple-400'
                    } border-4 border-white shadow-lg transition-all duration-300`}></div>
                  </div>

                  <div className="w-full md:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSection === 'wishes' && (
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Make a Birthday Wish 🌟
            </h2>
            <p className="text-center text-gray-600 mb-8 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Close your eyes, make a wish, and send it to the universe...
            </p>

            {showWishResponse ? (
              <div className="max-w-2xl mx-auto mb-10">
                <div className="relative">
                  {/* Sparkles burst animation */}
                  {[...Array(20)].map((_, i) => {
                    const angle = (i * 360) / 20;
                    const distance = 150;
                    const tx = Math.cos((angle * Math.PI) / 180) * distance;
                    const ty = Math.sin((angle * Math.PI) / 180) * distance;
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 text-3xl pointer-events-none"
                        style={{
                          animation: `sparkle-burst 1.5s ease-out forwards`,
                          animationDelay: `${i * 0.05}s`,
                          '--sparkle-tx': `${tx}px`,
                          '--sparkle-ty': `${ty}px`
                        }}
                      >
                        ✨
                      </div>
                    );
                  })}
                  
                  {/* Floating hearts */}
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={`heart-${i}`}
                      className="absolute text-4xl pointer-events-none"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '100%',
                        animation: `wish-heart-float ${2 + Math.random()}s ease-out forwards`,
                        animationDelay: `${Math.random() * 0.5}s`
                      }}
                    >
                      💖
                    </div>
                  ))}

                  {/* Magical stars rain */}
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={`star-${i}`}
                      className="absolute text-2xl pointer-events-none"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        animation: `star-rain ${1.5 + Math.random()}s ease-in forwards`,
                        animationDelay: `${Math.random() * 0.8}s`
                      }}
                    >
                      ⭐
                    </div>
                  ))}

                  {/* Response card with glow */}
                  <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-8 rounded-3xl shadow-2xl text-center relative z-10"
                    style={{ 
                      animation: 'wish-glow 2s ease-in-out infinite, scale-in 0.5s ease-out'
                    }}>
                    <div className="text-6xl mb-4 animate-bounce">🎂</div>
                    <p className="text-white text-2xl font-bold leading-relaxed" style={{ fontFamily: "'Righteous', cursive" }}>
                      {wishResponse}
                    </p>
                  </div>
                </div>

                <style>{`
                  @keyframes sparkle-burst {
                    0% {
                      transform: translate(-50%, -50%) scale(0);
                      opacity: 1;
                    }
                    50% {
                      opacity: 1;
                    }
                    100% {
                      transform: translate(calc(-50% + var(--sparkle-tx)), calc(-50% + var(--sparkle-ty))) scale(1.5);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes wish-heart-float {
                    0% {
                      transform: translateY(0) rotate(0deg) scale(0);
                      opacity: 0;
                    }
                    10% {
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(-600px) rotate(360deg) scale(1);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes star-rain {
                    0% {
                      transform: translateY(0) rotate(0deg);
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(500px) rotate(180deg);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes wish-glow {
                    0%, 100% {
                      box-shadow: 0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
                    }
                    50% {
                      box-shadow: 0 0 40px rgba(236, 72, 153, 0.8), 0 0 80px rgba(168, 85, 247, 0.6);
                    }
                  }
                  
                  @keyframes scale-in {
                    0% {
                      transform: scale(0);
                      opacity: 0;
                    }
                    100% {
                      transform: scale(1);
                      opacity: 1;
                    }
                  }
                `}</style>
              </div>
            ) : (
              <form onSubmit={handleWishSubmit} className="max-w-2xl mx-auto mb-10">
                <div className="flex flex-col gap-4">
                  <textarea
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Write your birthday wish here... ✨"
                    className="w-full px-6 py-4 rounded-3xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-lg font-sans transition-all resize-none h-32"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all hover:shadow-xl text-xl"
                    style={{ fontFamily: "'Righteous', cursive" }}
                  >
                    ✨ Send My Wish ✨
                  </button>
                </div>
              </form>
            )}

            {wishes.length > 0 && !showWishResponse && (
              <div className="text-center mb-8 animate-pulse">
                <p className="text-pink-600 text-xl font-bold" style={{ fontFamily: "'Righteous', cursive" }}>
                  🌟 Make Another Wish! 🌟
                </p>
                <p className="text-gray-600 mt-2 font-sans">
                  You've made {wishes.length} wish{wishes.length !== 1 ? 'es' : ''} so far! Keep them coming! 💫
                </p>
              </div>
            )}

            <div className="text-center py-12">
              <div className="text-8xl mb-4 animate-pulse">🎂</div>
              <p className="text-gray-500 text-lg font-sans">
                Your wishes are precious and magical! 💫
              </p>
            </div>
          </div>
        )}

        {currentSection === 'game' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>
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
                  <div className="text-center mb-4 text-2xl font-bold text-pink-600 animate-bounce" style={{ fontFamily: "'Dancing Script', cursive" }}>
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
                    <h3 className="text-2xl font-bold text-center text-pink-600 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
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
                    <h3 className="text-3xl font-bold text-pink-600 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      Quiz Complete!
                    </h3>
                    <p className="text-2xl text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
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
                  <div className="text-center mb-4 text-2xl font-bold text-pink-600 animate-bounce" style={{ fontFamily: "'Dancing Script', cursive" }}>
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
          <div className="unlock-animation">
            {!promiseUnlocked ? (
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative group">
                      <Sparkles className="w-24 h-24 text-purple-400 opacity-20 absolute top-0 left-0 group-hover:rotate-180 transition-transform duration-700" />
                      <div className="text-8xl group-hover:scale-110 transition-transform duration-300">🔐</div>
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-center text-purple-600 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    My Sacred Promise 💫
                  </h2>
                  <p className="text-center text-gray-600 mb-8 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Enter the word that binds us eternally
                  </p>
                  
                  <form onSubmit={handlePromisePasswordSubmit} className="max-w-md mx-auto">
                    <div className={`relative ${promiseShake ? 'shake' : ''}`}>
                      <input
                        type="password"
                        value={promisePassword}
                        onChange={(e) => setPromisePassword(e.target.value)}
                        placeholder="Our eternal word..."
                        className="w-full px-6 py-4 rounded-full border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-center text-lg font-sans transition-all glow-animation"
                        autoFocus
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                        💫
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl font-sans group"
                    >
                      <span className="group-hover:hidden">Reveal My Promise 🌟</span>
                      <span className="hidden group-hover:inline">Unlock Forever 🔓</span>
                    </button>
                  </form>
                  
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-purple-400 animate-pulse">
                      <span className="text-2xl">💡</span>
                      <span className="text-sm font-sans">Hint: Our time together</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl shadow-2xl p-8 md:p-12 text-white unlock-animation">
                <div className="flex items-center justify-center mb-6">
                  <Sparkles className="w-16 h-16 animate-pulse" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  My Promise to You
                </h2>
                <div className="space-y-4 text-lg text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
<p className="text-xl">✨ To always make you happy ✨</p>
              <p className="text-xl">💕 To support you in everything 💕</p>
              <p className="text-xl">🌟 To love you more each day 🌟</p>
              <p className="text-xl">💖 To be by your side forever 💖</p>
              <p className="text-xl">🫂 To do everything for us forever ♾️</p> 
                  <div className="mt-8 text-3xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Happy Birthday, My Love! ❤️, My Nkudi 😘, My Tutu 🐢✨
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayWebsite;