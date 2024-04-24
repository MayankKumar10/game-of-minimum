import React, { useState } from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';

const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['♠', '♣', '♦', '♥'];

export function GameOfMinimum() {
  const [deck, setDeck] = useState([]);
  const [sequenceCards, setSequenceCards] = useState([]);
  const [pairCards, setPairCards] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [highlightedCards, setHighlightedCards] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Function to deal 7 cards to each player
  const dealCards = () => {
    let cards = [];
    for (let i = 0; i < 7; i++) {
      let randomCard = CARDS[Math.floor(Math.random() * CARDS.length)];
      let randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
      cards.push(randomCard + randomSuit);
    }
    setDeck(CARDS.map(card => card + SUITS[0])); // Deck has all cards of one suit, for simplicity
    setPlayerHand(cards);
    setShowCards(true);
  };

  // Function to check if a sequence is valid
  const isSequence = (arr) => {
    arr = arr.sort((a, b) => CARDS.indexOf(a[0]) - CARDS.indexOf(b[0]));
    console.log("Arr", arr);
    for (let i = 0; i < arr.length - 1; i++) {
      if (CARDS.indexOf(arr[i + 1][0]) - CARDS.indexOf(arr[i][0]) !== 1) {
        return false;
      }
    }
    return true;
  };

  // Function to check if a pair is valid
  const isPair = (arr) => {
    console.log("pair", arr)
    return arr.every((val, i, arr) =>{
      // console.log({
      //   "val[0]":val[0],
      //   "arr[0][0]": arr[0][0],
      // })
      return val[0] === arr[0][0]
    });
  };

  // Function to handle card click
  const handleCardClick = (card) => {
    let newHighlighted = [];
    let sequence = [card];
    for (let i = 0; i < playerHand.length; i++) {
      if (playerHand[i] !== card && (CARDS.indexOf(playerHand[i][0]) === CARDS.indexOf(card[0]) + 1 ||
        CARDS.indexOf(playerHand[i][0]) === CARDS.indexOf(card[0]) - 1)) {
        sequence.push(playerHand[i]);
        setSequenceCards(sequence)
      }
    }
    if (isSequence(sequence)) {
      newHighlighted.push(sequence);
      console.log("sequence newHighlighted", newHighlighted)
    }

    let pair = [card];
    setPairCards([card])
    for (let i = 0; i < playerHand.length; i++) {

      if (playerHand[i] !== card && playerHand[i][0] === card[0]) {
        pair.push(playerHand[i]);
        setPairCards([pair])
      }
    }

    console.log("isPair", isPair(pair));
    if (isPair(pairCards)) {
      console.log("pair newHighlighted", pairCards)
      newHighlighted.push(pair);
    }

    console.log("Highlight", newHighlighted)
    setHighlightedCards(newHighlighted);
  };

  // Function to handle throw
  const handleThrow = (thrownCards) => {
    const newPlayerHand = playerHand.filter(card => !thrownCards.includes(card));
    if (newPlayerHand.length === 0) {
      alert("Congratulations! You've won!");
    }
    let newCard = deck.pop();
    setDeck([...deck]);
    setPlayerHand([...newPlayerHand, newCard]);

    // Remove thrown cards from highlighted list
    const newHighlightedCards = highlightedCards.filter(
      highlighted => !highlighted.some(card => thrownCards.includes(card))
    );
    setHighlightedCards(newHighlightedCards);
    setSequenceCards([])
    setPairCards([])
  };
  return (
    <div className={`App ${darkMode ? 'App-dark' : ''}`}>
      <header className="App-header">
        <h1 className="text-3xl font-bold mb-4">Game of Minimum</h1>
        <button
          className={`bg-${darkMode ? 'gray-800' : 'blue-500'} hover:bg-${darkMode ? 'gray-600' : 'blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 mr-4`}
          onClick={dealCards}
        >
          Deal Cards
        </button>
        <button
          className={`bg-${darkMode ? 'gray-800' : 'blue-500'} hover:bg-${darkMode ? 'gray-600' : 'blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        {showCards && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Hand:</h2>
            <div className="card-container">
              {playerHand.map((card, index) => (
                <div
                  key={index}
                  className={`card ${highlightedCards.some(arr => arr.includes(card)) && 'highlighted'}`}
                  onClick={() => handleCardClick(card)}
                >
                  {card}
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold mt-6 mb-4">Highlighted Throws:</h3>
            <div className="highlighted-container">
              {highlightedCards.map((throwArray, index) => (
                <div
                  key={index}
                  className="throw"
                  onClick={() => handleThrow(throwArray)}
                >
                  {throwArray.map((card, idx) => (
                    <span key={idx}>{card} </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default GameOfMinimum;
