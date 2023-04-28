import Head from 'next/head'
import { useState } from 'react';

import Board from '@/components/board';
import Keyboard from '@/components/keyboard';


function setNestedArray(array, i, j, letter) {
  let newArray = array[i].slice();
  let newArrays = array.slice();
  newArray.splice(j, 1, letter);
  newArrays.splice(i, 1, newArray);
  return newArrays;
}

function countOf(array, pred) {
  return array.filter(pred).length;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default function Home({ word, words }) {
  const [guesses, setGuesses] = useState(Array(6).fill(Array(5).fill({letter: '', state: 'empty'})));
  const [letterStates, setLetterStates] = useState({});
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [won, setWon] = useState(false);

  function checkGuess() {
    let guess = guesses[i].slice().map(g => g.letter);
    if(!words.includes(guess.join(''))) {
      alert('Not in word list');
      return;
    }
    let newLetterStates = Object.assign({}, letterStates);
    const checkedGuess = guess.map((letter, ind) => {
      if(letter === word[ind]) {
        newLetterStates[letter] = 'correct';
        return {letter: letter, state: 'correct'};
      } else if(word.includes(letter) && countOf(guess, x => x.letter === letter) <= countOf(word, l => l === letter)) {
        newLetterStates[letter] = 'misplaced';
        return {letter: letter, state: 'misplaced'};
      } else {
        newLetterStates[letter] = 'incorrect';
        return {letter: letter, state: 'incorrect'};
      }
    });
    setLetterStates(newLetterStates);
    return checkedGuess;
  }

  function handleLetterClick(letter) {
    switch(true) {
      case won:
        break;
      case j === 5 && letter === 'ENTER':
        const checked = checkGuess();
        if(checked === undefined) return;
        setGuesses([
          ...guesses.slice(0, i),
          checked,
          ...guesses.slice(i + 1)
        ]);
        if(countOf(checked, l => l.state === 'correct') === 5) {
          setWon(true);
        } else {
          setI(i + 1);
          setJ(0);
        }
        break;
      case j > 0 && letter === 'DELETE':
        setGuesses(setNestedArray(guesses, i, j - 1, {letter: '', state: 'empty'}));
        setJ(j - 1);
        break;
      case i < 6 && j < 5 && letter !== 'ENTER' && letter !== 'DELETE':
        setGuesses(setNestedArray(guesses, i, j, {letter: letter, state: 'unchecked'}));
        setJ(j + 1);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Head>
        <title>Wordle - Next.js</title>
        <meta name="description" content="Wordle word guessing game made with next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Wordle</h1>
        <Board guesses={guesses} />
        <Keyboard letterStates={letterStates} onLetterClick={handleLetterClick}/>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const res = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
  const wordsText = await res.text();
  const words = wordsText.split('\n')
                         .map(word => word.toUpperCase());
  const word = words[getRandomInt(words.length)].split('');

  return {
    props: {
      word,
      words
    }
  };
}
