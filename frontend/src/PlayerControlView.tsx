import { useState } from "react";
import type { Side, PaddleMove } from "./types";

function PlayerControlView({
  gameId,
  side,
  sendMove,
}: {
  gameId: string;
  side: Side;
  sendMove: (move: PaddleMove) => void;
}) {
  const [currentDirection, setCurrentDirection] = useState<PaddleMove>("STOP");

  const handleMove = (move: PaddleMove) => {
    setCurrentDirection(move);
    sendMove(move);
  };
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-green-700 mb-2">Pong Game</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
        <span className="text-gray-700">
          Game ID:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-green-700">
            {gameId}
          </span>
        </span>
        <span className="text-gray-700">
          Side:{" "}
          <span className="font-semibold text-blue-700 uppercase">{side}</span>
        </span>
      </div>
      <div className="text-center space-y-4">
        <p className="text-gray-600">
          Use the controls below to set your paddle direction. Your paddle will
          continue moving in the selected direction until you change it or press
          Stop. You're playing on the{" "}
          <span className="font-semibold text-blue-700">{side}</span> side.
        </p>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Current direction:{" "}
            <span
              className={`font-semibold ${
                currentDirection === "UP"
                  ? "text-blue-600"
                  : currentDirection === "DOWN"
                  ? "text-pink-600"
                  : "text-gray-600"
              }`}
            >
              {currentDirection}
            </span>
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Watch the game at:{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">/field/{gameId}</code>
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          className={`px-6 py-2 rounded font-semibold shadow transition ${
            currentDirection === "UP"
              ? "bg-blue-600 text-white ring-2 ring-blue-300"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={() => handleMove("UP")}
        >
          Up
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded font-semibold shadow transition ${
            currentDirection === "DOWN"
              ? "bg-pink-600 text-white ring-2 ring-pink-300"
              : "bg-pink-500 hover:bg-pink-600 text-white"
          }`}
          onClick={() => handleMove("DOWN")}
        >
          Down
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded font-semibold shadow transition ${
            currentDirection === "STOP"
              ? "bg-gray-600 text-white ring-2 ring-gray-300"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          }`}
          onClick={() => handleMove("STOP")}
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default PlayerControlView;
