import React, { useEffect, useRef, useState } from 'react';

const quotes = [
  "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
  "Do not wait to strike till the iron is hot, but make it hot by striking. – William Butler Yeats",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Success is not the key to happiness. Happiness is the key to success. – Albert Schweitzer",
  "The best way to predict the future is to create it. – Peter Drucker",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Act as if what you do makes a difference. It does. – William James",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
  "The future depends on what you do today. – Mahatma Gandhi",
  "Your time is limited, so don't waste it living someone else's life. – Steve Jobs",
  "Success is not the destination; it's the journey. – Zig Ziglar",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. – Ralph Waldo Emerson",
  "Everything you’ve ever wanted is on the other side of fear. – George Addair",
  "You miss 100% of the shots you don’t take. – Wayne Gretzky",
  "It always seems impossible until it’s done. – Nelson Mandela",
  "Opportunities don't happen. You create them. – Chris Grosser",
  "Success is walking from failure to failure with no loss of enthusiasm. – Winston Churchill",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "Limit your 'always' and your 'nevers'. – Amy Poehler",
  "Dream big and dare to fail. – Norman Vaughan"
];

const QuotesMarquee = () => {
  const quoteRef = useRef(null);
  const [currentQuote, setCurrentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [duration, setDuration] = useState(15); // Default duration

  const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

  // Function to adjust speed based on screen size
  const calculateDuration = (quoteWidth) => {
    const screenWidth = window.innerWidth;
    const speed = screenWidth < 768 ? 30 : 50; // Faster for smaller screens
    const animationDuration = quoteWidth / speed;
    return animationDuration;
  };

  useEffect(() => {
    const updateQuote = () => {
      const randomQuote = getRandomQuote();
      setCurrentQuote(randomQuote);
      setTimeout(() => {
        const quoteWidth = quoteRef.current.offsetWidth; // Get the width of the quote
        const duration = calculateDuration(quoteWidth); // Calculate duration based on width and screen size
        setDuration(duration); // Update duration
      }, 100); // Delay to ensure quote width is measured after rendering
    };

    const interval = setInterval(updateQuote, 45000); // Change quote every 45 seconds
    updateQuote(); // Initialize first quote

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={{
      backgroundColor: 'transparent',
      padding: '10px',
      textAlign: 'center',
      fontSize: '1.2em',
      color: '#333',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <div ref={quoteRef} style={{
        display: 'inline-block',
        animation: `scroll ${duration}s linear forwards`, // Use calculated duration
      }}>
        {currentQuote}
      </div>
      <style>
        {`
          @keyframes scroll {
            from {
              transform: translateX(200%); // Start just off the right side
            }
            to {
              transform: translateX(-250%); // End just off the left side
            }
          }
        `}
      </style>
    </div>
  );
};

export default QuotesMarquee;