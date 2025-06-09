import { BrowserRouter, useLocation } from "react-router-dom";
import GameFieldView from "./GameFieldView";
import PlayerControlView from "./PlayerControlView";
import useGameWebSocket from "./useGameWebSocket";

function AppInner() {
  const location = useLocation();
  const pathname = location.pathname;
  const { gameState, playerCounts, playerParams, fieldParams, sendMove } =
    useGameWebSocket(pathname);

  if (fieldParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="w-full max-w-3xl p-6 bg-white/80 rounded-xl shadow-lg">
          <GameFieldView
            gameId={fieldParams.gameId}
            state={gameState}
            playerCounts={playerCounts}
          />
        </div>
      </div>
    );
  }
  if (playerParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
        <div className="w-full max-w-2xl p-6 bg-white/80 rounded-xl shadow-lg">
          <PlayerControlView
            gameId={playerParams.gameId}
            side={playerParams.side}
            sendMove={sendMove}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="p-8 bg-white/90 rounded-xl shadow-lg text-center">
        <div className="text-2xl font-bold text-red-500 mb-2">Invalid URL</div>
        <div className="text-gray-700">
          Use <span className="font-mono">/field/GAME_ID</span> or{" "}
          <span className="font-mono">/player/GAME_ID/left</span> or{" "}
          <span className="font-mono">/right</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
