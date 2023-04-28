import styles from '../styles/board.module.css';

function Square({ letter, state }) {
  return (
    <div className={`${styles.square} ${styles[state]}`}>
      <span>{letter}</span>
    </div>
  );
}

export default function Board({ guesses }) {
  return (
    <div className={styles.board}>
      {guesses.map((guess, i) => {
        return (
          <div key={i} className={styles.guess}>
            {guess.map(({ letter, state }, j) => {
              return (
                <Square key={j} letter={letter} state={state}/>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
