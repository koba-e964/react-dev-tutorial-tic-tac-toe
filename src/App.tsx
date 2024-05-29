import React, { useState } from "react";
import { calculateWinner } from "./game.ts";
import { on } from "events";

export default function Game(): JSX.Element {
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Array<string | null>): void {
    setHistory([...history.slice(0, currentMove + 1), nextSquares]);
    setCurrentMove(currentMove + 1);
  }

  function jumpTo(moveIndex: number): void {
    setCurrentMove(moveIndex);
  }

  const moves = history.map((squares: (string | null)[], moveIndex: number) => {
    let description: string;
    if (moveIndex > 0) {
      description = "Go to move #" + moveIndex;
    } else {
      description = "Go to game start";
    }
    if (moveIndex === currentMove) {
      return <li key={moveIndex}>{"You are on move #" + moveIndex}</li>;
    }
    return (
      <li key={moveIndex}>
        <button onClick={() => jumpTo(moveIndex)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: Array<string | null>;
  onPlay: (_: Array<string | null>) => void;
}): JSX.Element {
  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  function handleSquareClick(i: number): void {
    if (squares[i] !== null || calculateWinner(squares) !== null) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    onPlay(newSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleSquareClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleSquareClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleSquareClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleSquareClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleSquareClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleSquareClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleSquareClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleSquareClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleSquareClick(8)} />
      </div>
    </>
  );
}

function Square({
  value,
  onSquareClick,
}: {
  value: string | null;
  onSquareClick: () => void;
}): JSX.Element {
  function handleClick(): void {
    onSquareClick();
  }
  return (
    <button className="square" onClick={handleClick}>
      {value}
    </button>
  );
}
