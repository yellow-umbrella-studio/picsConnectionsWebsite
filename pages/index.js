"use strict";

import { useState, useEffect } from "react";
import { Shuffle, X, Share, Copy } from "lucide-react";
import { IBM_Plex_Sans } from 'next/font/google';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit  } from 'firebase/firestore';

const ZoomedImageModal = ({ image, onClose }) => {
  const [isLabelVisible, setIsLabelVisible] = useState(false);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative w-[300px] h-[300px] bg-white rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            src={image.url}
            alt={image.label}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-50 py-2">
          {isLabelVisible ? (
            <span className="text-white">{image.label}</span>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsLabelVisible(true);
              }}
              className="text-white hover:text-gray-200 font-medium"
            >
              Reveal Word
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HowToPlayModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        
        <div className="space-y-4 text-sm">
          <p>
            <strong>Goal:</strong> Find four groups of four related images.
          </p>
          
          <div>
            <p className="font-medium mb-2">How to play:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select four images that you think belong together.</li>
              <li>Click "Submit" to check if they form a valid group.</li>
              <li>When you find a valid group, it will be removed from the board.</li>
              <li>Keep finding groups until you complete all four categories.</li>
              <li>Click the + button on any image to zoom in and see its label. Be aware doing so will make the puzzle much easier.</li>
            </ol>
          </div>
          
          <div>
            <p className="font-medium mb-2">Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Look for common themes like colors, shapes, or categories.</li>
              <li>Use "Shuffle" to rearrange the images if you're stuck.</li>
              <li>After 7 attempts, you can use "Reveal Answer" if you're stuck.</li>
              <li>If you're unsure about an image, use the + button to see it larger.</li>
            </ul>
          </div>
          
          <p>
            A new puzzle is available every day. Come back tomorrow for a new challenge!
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-2 mt-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

const StatsModal = ({ stats, onClose, solvedCategories, categoryColors, categories }) => {
  const [shareClicked, setShareClicked] = useState(false);

  const calculateTime = () => {
    const duration = stats.timeFinished - stats.timeStarted;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Move generateEmojiGrid inside StatsModal
  const generateEmojiGrid = () => {
    const colorEmojis = {
      "bg-yellow-200": "🟨",
      "bg-green-200": "🟩", 
      "bg-blue-200": "🟦",
      "bg-purple-200": "🟪"
    };
  
    // Create a grid where each row represents how the user solved the categories
    const rows = solvedCategories.map((categoryName, index) => {
      const category = categories.find(c => c.name === categoryName);
      if (!category) return "";
      
      return colorEmojis[categoryColors[index]].repeat(4);
    });
  
    // Join rows with newlines to create the grid
    const emojiGrid = rows.join('\n');
  
    // Return the formatted string including the puzzle number and attempts
    return `Pictures Connections #${stats.puzzleId}\n\n${emojiGrid}\n\n${stats.attempts} tries`;
  };

  const handleShareClick = () => {
    const resultText = generateEmojiGrid();
    navigator.clipboard.writeText(resultText)
      .then(() => {
        setShareClicked(true);
        setTimeout(() => setShareClicked(false), 2000);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Puzzle Complete!</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.attempts}</div>
              <div className="text-sm text-gray-600">Attempts</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{calculateTime()}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="font-bold text-green-700">
              {stats.attempts <= 10 ? "Excellent!" : stats.attempts <= 15 ? "Great job!" : "Well done!"}
            </div>
            <div className="text-sm text-green-600">
              You solved it in {stats.attempts} attempts
            </div>
          </div>

        

          {/* <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-center mb-2 font-medium">Your Results</div>
            <div className="grid grid-cols-4 gap-1 mb-3">
              {solvedCategories.map((_, index) => (
                <div key={index} className={`aspect-square ${categoryColors[index]} rounded-sm`} />
              ))}
            </div>
            <button
              onClick={handleShareClick}
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
            >
              {shareClicked ? "Copied!" : "Copy Results"}
            </button>
          </div> */}

          {/* Rest of modal content */}
          <button
            onClick={onClose}
            className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Close
          </button>

          {/* App promotion section */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center font-medium text-gray-700 mb-3">
              Love this game? Play unlimited connections on mobile!
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 items-center">
              <a 
                href="https://play.google.com/store/apps/details?id=com.yonigold.connections&hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-90 transition-opacity"
              >
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play" 
                  className="h-12"
                />
              </a>
              
              <a 
                href="https://apps.apple.com/il/app/word-chains-connections-game/id6738982688" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-90 transition-opacity"
              >
                <img 
                  src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" 
                  alt="Download on the App Store" 
                  className="h-8"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageWithLoader = ({ src, alt, className, size = "normal" }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`
            rounded-full animate-spin border-gray-300 border-t-gray-600
            ${size === "small" ? 'w-6 h-6 border-3' : 'w-8 h-8 border-4'}
          `}></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});



export default function Home() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [solvedCategories, setSolvedCategories] = useState([]);
  const [mistakes, setMistakes] = useState(4);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState('');
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [animatingTiles, setAnimatingTiles] = useState(null);
  const [categories, setCategories] = useState([]); // New state for categories
  const [isLoading, setIsLoading] = useState(true);
  const [submitClicks, setSubmitClicks] = useState(0);
  const [puzzleId, setPuzzleId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
const [longPressTimer, setLongPressTimer] = useState(null);
const [nextGameTime, setNextGameTime] = useState('');

  const [stats, setStats] = useState({
    attempts: 0,
    timeStarted: null,
    timeFinished: null,
    showStats: false
  });

const categoryColors = [
  "bg-yellow-200",  // First solved category will be yellow
  "bg-green-200",   // Second will be green
  "bg-blue-200",    // Third will be blue
  "bg-purple-200"   // Fourth will be purple
];

  useEffect(() => {
    fetchTodaysPuzzle();
    setStats(prev => ({ ...prev, timeStarted: Date.now() }));
  }, []);

  const fetchTodaysPuzzle = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      // Define UTC day boundaries for a universal daily puzzle
      const startOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0
      ));
      const endOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23, 59, 59, 999
      ));
      console.log("UTC day boundaries:", startOfDay, endOfDay);
  
      const puzzlesRef = collection(db, "puzzles");
      let querySnapshot = await getDocs(
        query(puzzlesRef, where("date", ">=", startOfDay), where("date", "<=", endOfDay))
      );
      
      if (querySnapshot.empty) {
        console.log("No puzzle found for today, defaulting to level 1 puzzle");
        querySnapshot = await getDocs(query(puzzlesRef, limit(1)));
      }
      
      if (!querySnapshot.empty) {
        const puzzleData = querySnapshot.docs[0].data();
        console.log("Puzzle chosen:", puzzleData);
        // Optionally, if your puzzleData has a level property, you could log:
        // console.log("Puzzle level:", puzzleData.level);
        setPuzzleId(puzzleData.id);
        setCategories(puzzleData.categories);
        
        const allImages = puzzleData.categories.flatMap((cat) => cat.items);
        setShuffledImages(shuffleArray([...allImages]));
      } else {
        console.log("No puzzles found in Firestore at all.");
        setMessage("No puzzles available");
      }
    } catch (error) {
      console.error("Error fetching puzzle:", error);
      setMessage("Error loading puzzle");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect to load the Buy Me A Coffee script
useEffect(() => {
  // Create script element
  const script = document.createElement('script');
  script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
  script.setAttribute('data-name', 'bmc-button');
  script.setAttribute('data-slug', 'yoni7022');
  script.setAttribute('data-color', '#FFDD00');
  script.setAttribute('data-emoji', '☕');
  script.setAttribute('data-font', 'Comic');
  script.setAttribute('data-text', 'Buy Me A Coffee');
  script.setAttribute('data-outline-color', '#000000');
  script.setAttribute('data-font-color', '#000000');
  script.setAttribute('data-coffee-color', '#ffffff');
  script.async = true;
  
  // Append to the document
  document.body.appendChild(script);
  
  // Cleanup function
  return () => {
    document.body.removeChild(script);
  };
}, []);

const calculateTimeUntilNextPuzzle = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeLeft = tomorrow - now;
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  return `${hours}h ${minutes}m ${seconds}s`;
};

// Add this useEffect to update the timer
useEffect(() => {
  const timer = setInterval(() => {
    setNextGameTime(calculateTimeUntilNextPuzzle());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setMessage("Couldn't copy link to clipboard");
      });
  };

  const generateEmojiGrid = () => {
    const colorEmojis = {
      "bg-yellow-200": "🟨",
      "bg-green-200": "🟩",
      "bg-blue-200": "🟦",
      "bg-purple-200": "🟪"
    };
  
    let emojiString = solvedCategories.map((_, index) => {
      return `${colorEmojis[categoryColors[index]]}`.repeat(4);
    }).join('');
  
    // Add the puzzle number and attempts
    return `Pictures Connections #${puzzleId}\n${emojiString}\n${stats.attempts} tries`;
  };


  const handleImageLongPress = (image) => {
    setZoomedImage(image);
  };
  
  const handleTouchStart = (image) => {
    const timer = setTimeout(() => handleImageLongPress(image), 500);
    setLongPressTimer(timer);
  };
  
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleImageClick = (imageUrl) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(selectedImages.filter((img) => img !== imageUrl));
    } else if (selectedImages.length < 4) {
      setSelectedImages([...selectedImages, imageUrl]);
    }
  };

  const handleSubmit = () => {
    if (selectedImages.length !== 4) {
      setMessage("Select exactly 4 images");
      return;
    }
  
    setStats(prev => ({ ...prev, attempts: prev.attempts + 1 }));
    setSubmitClicks(prev => prev + 1);
  
    // Check for a complete correct category
    const correctCategory = categories.find((category) =>
      category.items.every((img) => selectedImages.includes(img.url))
    );
  
    // Check for "one away" scenario
    const oneAwayCategory = categories.find((category) => {
      const correctSelections = category.items.filter(img => 
        selectedImages.includes(img.url)
      ).length;
      return correctSelections === 3;
    });
  
    if (correctCategory && !solvedCategories.includes(correctCategory.name)) {
      setAnimatingTiles(selectedImages);
      
      setTimeout(() => {
        setSolvedCategories([...solvedCategories, correctCategory.name]);
        setSelectedImages([]);
        setAnimatingTiles(null);
        setMessage(`Correct! That's the ${correctCategory.name} category!`);
    
        if (solvedCategories.length + 1 === categories.length) {
          setGameWon(true);
          setMessage("Congratulations! You've won the game!");
          
          // Add delay before showing stats modal
          setTimeout(() => {
            setStats(prev => ({
              ...prev,
              timeFinished: Date.now(),
              showStats: true
            }));
          }, 2000); // 2.5 seconds delay
        }
      }, 800);
  
    } else {
      setMistakes(mistakes - 1);
      setMessage(oneAwayCategory ? "So close! You're one away from a category!" : "That's not a valid category");
      setIsWrongAnswer(true);
      setTimeout(() => setIsWrongAnswer(false), 500);
    }
  };

  const handleShuffle = () => {
    setShuffledImages(shuffleArray([...shuffledImages]));
  };

  const handleDeselectAll = () => {
    setSelectedImages([]);
  };

  const handleRevealAnswers = () => {
    // Map through all categories and get their names
    const allCategoryNames = categories.map(cat => cat.name);
    setSolvedCategories(allCategoryNames);
    setSelectedImages([]);
    setGameWon(true);
    setMessage("All categories have been revealed!");
  };
  

  const renderSolvedCategory = (categoryName, index) => {
    const category = categories.find((c) => c.name === categoryName);
    if (!category) return null;
  
    return (
      <div className={`w-full ${categoryColors[index]} rounded-lg p-1.5 mb-2 shadow-sm`}>
      <h3 className="text-center font-bold mb-1 text-sm tracking-wider uppercase">
        {category.name}
      </h3>
        <div className="grid grid-cols-4 gap-1">
          {category.items.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full h-full flex items-center justify-center relative">
                <ImageWithLoader
                  src={image.url}
                  alt={image.label}
                  className="max-w-[60%] max-h-[60%] object-contain"
                  size="small"
                />
              </div>
              <span className="text-xs text-center font-medium mt-0.5">{image.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const remainingImages = shuffledImages.filter(
    (image) => !solvedCategories.some(
      (categoryName) => categories
        .find((c) => c.name === categoryName)
        ?.items.some((img) => img.url === image.url) // Changed from images to items
    )
  );

  return (
<div className="min-h-screen bg-[#fafafa] py-4 sm:py-6 lg:py-8 px-2 sm:px-4">

<div className="max-w-xl lg:max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-6">
{/* Header */}
<div className="text-center mb-6 sm:mb-8">
<h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
    Pictures Connections #{puzzleId || '...'}
  </h1>
  <p className="text-gray-600 font-medium text-sm sm:text-base">
    {new Date().toDateString()}
  </p>
  <p className="text-sm text-gray-500">
    Next puzzle in: {nextGameTime}
  </p>
  {stats.showStats && (
  <StatsModal
    stats={{...stats, puzzleId}}
    solvedCategories={solvedCategories}
    categoryColors={categoryColors}
    categories={categories} // Add this line
    onClose={() => setStats(prev => ({ ...prev, showStats: false }))}
  />
)}
</div>
  
        {isLoading ? (
          <div className="text-center py-8">Loading puzzle...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">No puzzle available for today</div>
        ) : (
          <>
            {/* Solved Categories */}
            <div className="solved-categories space-y-2 mb-8">
      {solvedCategories.map((categoryName, index) => (
        <div key={categoryName} className={`opacity-0 animate-category-appear`} style={{
          animationDelay: `${index * 0.1}s`
        }}>
          {renderSolvedCategory(categoryName, index)}
        </div>
      ))}
    </div>
  
            {/* Image Grid */}
            <div className={`grid grid-cols-4 gap-1.5 sm:gap-2 mb-6 sm:mb-8 relative ${isWrongAnswer ? 'animate-shake' : ''}`}>
            {remainingImages.map((image, index) => {
  const isSelected = selectedImages.includes(image.url);
  const isAnimating = animatingTiles?.includes(image.url);

  return (
    <button
  key={index}
  data-image={image.url}
  onClick={() => handleImageClick(image.url)}
  className={`
    aspect-square rounded-md p-1 relative
    ${isSelected ? 'bg-[#c0c0b7] ring-2 ring-black' : 'bg-[#e8e8e3] hover:brightness-95'}
    ${isAnimating ? 'animate-complete' : ''}
    transition-all
  `}
>
  <div className="w-full h-full flex items-center justify-center">
    <ImageWithLoader
      src={image.url}
      alt={image.label}
      className="max-w-[85%] sm:max-w-[90%] max-h-[85%] sm:max-h-[90%] object-contain"
    />
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setZoomedImage(image);
      }}
      className="absolute top-1 right-1 w-4 h-4 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full flex items-center justify-center text-white text-xs transition-all"
    >
      +
    </button>
  </div>
</button>
  );
})}
            </div>
  
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-2 px-2">
  <button
    onClick={handleShare}
    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full border border-gray-300 hover:bg-gray-50 flex items-center gap-1"
  >
    {copied ? "Copied!" : "Share"}
    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
  </button>
  <button
    onClick={handleDeselectAll}
    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full border border-gray-300 hover:bg-gray-50"
    disabled={selectedImages.length === 0 || gameWon}
  >
    Deselect All
  </button>
  <button
    onClick={handleShuffle}
    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full border border-gray-300 hover:bg-gray-50"
    disabled={gameWon}
  >
    Shuffle
  </button>
  
  {submitClicks >= 7 && !gameWon && (
    <button
      onClick={handleRevealAnswers}
      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-red-500 text-white hover:bg-red-600"
    >
      Reveal Answer
    </button>
  )}
  <button
    onClick={handleSubmit}
    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-black text-white hover:bg-gray-800"
  >
    Submit
  </button>
</div>
          </>
        )}
  
        {/* Message Display */}
        {message && (
          <div className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </div>
        )}
      </div>
      <div className="text-center mt-6">
  {/* How to Play and BMC buttons */}
  <div className="flex flex-wrap justify-center gap-6 items-center mb-4">
    <button 
      onClick={() => setHowToPlayOpen(true)}
      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
    >
      How to Play
    </button>
    
    <a 
      href="https://www.buymeacoffee.com/yoni7022" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-2 rounded-md bg-[#FFDD00] text-black font-medium text-sm border border-[#000000] hover:bg-[#ffea80] transition-colors"
      style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}
    >
      <span className="w-5 h-5 mr-2 flex items-center justify-center">☕</span>
      <span>Buy Me A Coffee</span>
    </a>
  </div>
  
  {/* App promo text */}
  <p className="text-center font-medium text-gray-700 mb-3">
    Play unlimited connections on mobile!
  </p>
  
  {/* App store buttons */}
  <div className="flex flex-wrap justify-center gap-4 items-center">
    <a 
      href="https://play.google.com/store/apps/details?id=com.yonigold.connections&hl=en" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:opacity-90 transition-opacity"
    >
      <img 
        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
        alt="Get it on Google Play" 
        className="h-14"
      />
    </a>
    
    <a 
      href="https://apps.apple.com/il/app/word-chains-connections-game/id6738982688" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:opacity-90 transition-opacity"
    >
      <img 
        src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" 
        alt="Download on the App Store" 
        className="h-10"
      />
    </a>
  </div>
</div>
    {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}
    {zoomedImage && (
  <ZoomedImageModal 
    image={zoomedImage} 
    onClose={() => setZoomedImage(null)} 
  />
)}
    </div>
  );
}