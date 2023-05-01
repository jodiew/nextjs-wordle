import styles from '../styles/keyboard.module.css';

function KeyboardButton({ letter, state, onLetterClick }) {
  if (letter === "ENTER" || letter === "DELETE") {
    return (
      <button
        className={`${styles.keyboardButton} ${styles.alt}`}
        onClick={() => onLetterClick(letter)}
      >
        {letter}
      </button>
    );
  } else {
    return (
      <button
        className={`${styles.keyboardButton} ${styles[state]}`}
        onClick={() => onLetterClick(letter)}
      >
        {letter}
      </button>
    );
  }
}

export default function Keyboard({ letterStates, onLetterClick }) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S",
    "T", "U", "V", "W", "X", "Y", "Z", "ENTER", "DELETE"];
  return (
    <div className={styles.keyboard}>
      {letters.map(letter => {
        return (
          <KeyboardButton
            key={letter}
            letter={letter}
            state={letterStates[letter]}
            onLetterClick={onLetterClick}
          />
        );
      })}
    </div>
  );
}
