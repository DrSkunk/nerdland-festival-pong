import type { GameState, PlayerCounts } from "./types";
import GameField from "./GameField";

function GameFieldView({
  gameId,
  state,
  playerCounts,
}: {
  gameId: string;
  state: GameState | null;
  playerCounts: PlayerCounts;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">
        Pong Game{" "}
        <span className="text-base font-normal text-gray-500">(Spectator)</span>
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
        <span className="text-gray-700">
          Game ID:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-indigo-700">
            {gameId}
          </span>
        </span>
        <span className="text-gray-700">
          Left players:{" "}
          <span className="font-semibold text-blue-600">
            {playerCounts.leftCount}
          </span>
        </span>
        <span className="text-gray-700">
          Right players:{" "}
          <span className="font-semibold text-green-600">
            {playerCounts.rightCount}
          </span>
        </span>
        <span className="text-gray-700">
          Total:{" "}
          <span className="font-semibold text-purple-600">
            {playerCounts.totalCount}
          </span>
        </span>
      </div>
      {state && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm">
          <span className="text-gray-600">
            Left team move:{" "}
            <span className="font-semibold text-blue-700">
              {state.leftMove || "STOP"}
            </span>
          </span>
          <span className="text-gray-600">
            Right team move:{" "}
            <span className="font-semibold text-green-700">
              {state.rightMove || "STOP"}
            </span>
          </span>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <GameField state={state} />
      </div>
    </div>
  );
}

export default GameFieldView;
