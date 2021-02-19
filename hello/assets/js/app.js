// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "../css/app.css";
import "milligram";
import { ch_join, ch_push, ch_reset } from "./socket";

function SetTitle({ text }) {
  useEffect(() => {
    let orig = document.title;
    document.title = text;

    // Cleanup function
    return () => {
      document.title = orig;
    };
  });

  return <div />;
}

function GameOver(props) {
  //let reset = props['reset'];
  let { reset } = props;

  // On GameOver screen,
  // set page title to "Game Over!"

  return (
    <div className="row">
      <SetTitle text="Game Over!" />
      <div className="column">
        <h1>Game Over!</h1>
        <p>
          <button onClick={reset}>Reset</button>
        </p>
      </div>
    </div>
  );
}

function SubmitButton({ gameState, makeGuess }) {
  let button = null;
  if (gameState < 3) {
    button = (
      <button className="button" onClick={makeGuess}>
        Guess
      </button>
    );
  } else {
    button = (
      <button className="button" onClick={makeGuess} disabled>
        Guess
      </button>
    );
  }
  return <div className="column column-20">{button}</div>;
}

function Controls({ makeGuess, results }) {
  const [state, setState] = useState({
    text: "",
    gameState: 0,
  });

  let statusText = getStatus(state.gameState);

  function keyPress(ev) {
    if (ev.key === "Enter") {
      validGuess(state.text);
    }
  }

  function submit() {
    validGuess(state.text);
  }

  function getStatus(gameStatus) {
    if (gameStatus === 4) {
      return "Correct! You have won the game.";
    } else if (gameStatus === 3) {
      return "You have lost the game.";
    } else if (gameStatus === 2) {
      return "Invalid Guess. Please make sure that your guess is 4 unique digits.";
    } else if (gameStatus === 1) {
      return "Incorrect. Please make another guess.";
    } else {
      return "Please make a guess to start the game.";
    }
  }

  function updateText(ev) {
    let vv = ev.target.value;
    setState({
      text: vv,
      gameState: state.gameState,
    });
    console.log(state);
  }

  function validGuess(text) {
    if (isNaN(text)) {
      setState({
        text: "",
        gameState: 2,
      });
    }
    if (text.length === 4) {
      let seen = "";
      for (const char of text) {
        if (seen.includes(char)) {
          setState({
            text: "",
            gameState: 2,
          });
          return;
        } else {
          seen += char;
        }
      }
      setState({ text: "", gameState: state.gameState });
      return makeGuess(text);
    } else {
      setState({
        text: "",
        gameState: 2,
      });
    }
  }

  return (
    <div>
      <div className="row">
        <p>{statusText}</p>
      </div>
      <div className="row controls">
        <div className="column column-60">
          <input
            type="text"
            value={state.text}
            onChange={updateText}
            onKeyPress={keyPress}
          ></input>
        </div>
        <SubmitButton gameState={2} makeGuess={submit} />
        <div className="column column-20">
          <button className="button button-outline" onClick={ch_reset}>
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [state, setState] = useState({
    word: "00",
    guesses: [],
    results: [],
  });

  useEffect(() => {
    ch_join(setState);
  });

  const listItems = state.guesses.map((guess) => (
    <p key={guess}>
      {guess}-Cows:{state.results[state.guesses.indexOf(guess)][1]} Bulls:
      {state.results[state.guesses.indexOf(guess)][0]}
    </p>
  ));

  let statusText = `Bulls: ${state.word
    .toString()
    .charAt(0)} Cows: ${state.word.toString().charAt(1)}.`;

  function makeGuess(text) {
    console.log(text);
    ch_push({ guess: text });
  }

  function restartGame() {
    ch_reset();
  }

  let body = <p>component loading</p>;
  if (state.guesses.length < 9) {
    if (state.guesses.length > 0) {
      if (state.results[0][0] == 4) {
        body = <GameOver reset={restartGame} />;
      } else {
        body = (
          <div>
            <Controls makeGuess={makeGuess} results={state} />
            <div>{listItems}</div>
          </div>
        );
      }
    } else {
      body = (
        <div>
          <Controls makeGuess={makeGuess} results={state} />
          <div>{listItems}</div>
        </div>
      );
    }
  } else {
    body = <GameOver reset={restartGame} />;
  }

  return (
    <div className="App">
      <h1>Bulls and Cows</h1>
      {body}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
