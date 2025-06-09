import { useEffect, useRef, useState } from "react";
import type { GameState, PaddleMove, Side, PlayerCounts } from "./types";

const WS_SERVER =
  (location.protocol === "https:" ? "wss://" : "ws://") +
  location.host.replace(/:\d+$/, ":3001");

function getGameParams(pathname: string) {
  const match = pathname.match(/player\/(\w+)\/(left|right)/);
  if (!match) return null;
  return { gameId: match[1], side: match[2] as Side };
}

function getFieldParams(pathname: string) {
  const match = pathname.match(/field\/(\w+)/);
  if (!match) return null;
  return { gameId: match[1] };
}

export default function useGameWebSocket(pathname: string) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerCounts, setPlayerCounts] = useState<PlayerCounts>({
    leftCount: 0,
    rightCount: 0,
    totalCount: 0,
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const playerParams = getGameParams(pathname);
    const fieldParams = getFieldParams(pathname);

    let ws: WebSocket | null = null;
    if (playerParams) {
      ws = new WebSocket(
        `${WS_SERVER}/player/${playerParams.gameId}/${playerParams.side}`
      );
    } else if (fieldParams) {
      ws = new WebSocket(`${WS_SERVER}/field/${fieldParams.gameId}`);
    }
    if (ws) {
      wsRef.current = ws;
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        // Only field viewers receive game state and player count updates
        if (fieldParams) {
          if (msg.type === "state") {
            setGameState({
              leftPaddle: msg.leftPaddle,
              rightPaddle: msg.rightPaddle,
              ball: msg.ball,
              score: msg.score,
              leftMove: msg.leftMove,
              rightMove: msg.rightMove,
              leftPlayerCount: msg.leftPlayerCount,
              rightPlayerCount: msg.rightPlayerCount,
            });
          } else if (msg.type === "playerCount") {
            setPlayerCounts({
              leftCount: msg.leftCount,
              rightCount: msg.rightCount,
              totalCount: msg.totalCount,
            });
          }
        }
      };
      return () => ws?.close();
    }
  }, [pathname]);

  const playerParams = getGameParams(pathname);
  const fieldParams = getFieldParams(pathname);

  function sendMove(move: PaddleMove) {
    wsRef.current?.send(move);
  }

  return { gameState, playerCounts, playerParams, fieldParams, sendMove };
}
