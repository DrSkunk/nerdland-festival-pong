import type { GameState } from "./types";

function GameField({ state }: { state: GameState | null }) {
  const width = 400;
  const height = 400;
  const paddleW = 10;
  const paddleH = 80;
  const ballR = 10;
  if (!state)
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center h-[400px] w-[400px] bg-gray-100 rounded-lg text-gray-400 text-lg font-semibold shadow-inner">
          Waiting for game state...
        </div>
      </div>
    );
  return (
    <div className="flex flex-col items-center">
      {/* Score display */}
      <div className="flex items-center justify-between w-[400px] mb-4 px-8">
        <div className="text-2xl font-bold text-blue-600">
          Left: {state.score.left}
        </div>
        <div className="text-lg font-semibold text-gray-600">VS</div>
        <div className="text-2xl font-bold text-red-600">
          Right: {state.score.right}
        </div>
      </div>

      <svg
        width={width}
        height={height}
        aria-label="Pong game field"
        className="rounded-lg shadow-lg bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-300"
      >
        <title>Pong game field</title>
        {/* Left paddle */}
        <rect
          x={10}
          y={state.leftPaddle}
          width={paddleW}
          height={paddleH}
          fill="#fff"
          rx={3}
        />
        {/* Right paddle */}
        <rect
          x={width - 20}
          y={state.rightPaddle}
          width={paddleW}
          height={paddleH}
          fill="#fff"
          rx={3}
        />
        {/* Ball */}
        <circle cx={state.ball.x} cy={state.ball.y} r={ballR} fill="#0ff" />
        {/* Center line */}
        <line
          x1={width / 2}
          y1={0}
          x2={width / 2}
          y2={height}
          stroke="#fff"
          strokeDasharray="8 8"
          strokeWidth={2}
          opacity={0.3}
        />
      </svg>
    </div>
  );
}

export default GameField;
