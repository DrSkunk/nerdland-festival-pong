import express from "express";
import { WebSocketServer, type WebSocket, type RawData } from "ws";
import http from "node:http";
import { randomUUID } from "node:crypto";

// --- Game Types ---
type PaddleMove = "UP" | "DOWN" | "STOP";
type Side = "left" | "right";

interface Player {
  ws: WebSocket;
  side: Side;
  currentDirection: PaddleMove;
}

interface GameState {
  leftPaddle: number;
  rightPaddle: number;
  ball: { x: number; y: number; vx: number; vy: number };
  players: Record<string, Player>;
  score: { left: number; right: number };
  viewers: WebSocket[]; // Field viewers
}

const GAMES: Record<string, GameState> = {};
const PADDLE_SPEED = 5;
const FIELD_HEIGHT = 400;
const FIELD_WIDTH = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SPEED = 5;
const BALL_SIZE = 10;

// --- Express & HTTP Server ---
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// --- Helper: Create New Game ---
function createGame(gameId: string): GameState {
  return {
    leftPaddle: FIELD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    rightPaddle: FIELD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ball: {
      x: FIELD_WIDTH / 2,
      y: FIELD_HEIGHT / 2,
      vx: BALL_SPEED,
      vy: BALL_SPEED,
    },
    players: {},
    score: { left: 0, right: 0 },
    viewers: [],
  };
}

// --- Helper: Reset Ball ---
function resetBall(game: GameState, direction: "left" | "right") {
  game.ball.x = FIELD_WIDTH / 2;
  game.ball.y = FIELD_HEIGHT / 2;
  game.ball.vx = direction === "left" ? -BALL_SPEED : BALL_SPEED;
  game.ball.vy = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
}

// --- Helper: Check Paddle Collision ---
function checkPaddleCollision(
  ball: { x: number; y: number; vx: number; vy: number },
  paddleY: number,
  paddleX: number
): boolean {
  return (
    ball.x < paddleX + PADDLE_WIDTH &&
    ball.x + BALL_SIZE > paddleX &&
    ball.y < paddleY + PADDLE_HEIGHT &&
    ball.y + BALL_SIZE > paddleY
  );
}

// --- WebSocket Handling ---
interface CustomWebSocketRequest extends http.IncomingMessage {
  url: string;
}

interface PlayerConnection {
  ws: WebSocket;
  req: CustomWebSocketRequest;
}

wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
  console.log("New WebSocket connection");
  const url: string = req.url || "";

  // Check for player connection
  const playerMatch: RegExpMatchArray | null = url.match(
    /\/player\/(\w+)\/(left|right)/
  );

  // Check for field viewer connection
  const fieldMatch: RegExpMatchArray | null = url.match(/\/field\/(\w+)/);

  if (playerMatch) {
    // Handle player connection
    const [, gameId, side] = playerMatch;
    if (!GAMES[gameId]) {
      GAMES[gameId] = createGame(gameId);
    }
    const playerId: string = randomUUID();
    const player: Player = {
      ws,
      side: side as Side,
      currentDirection: "STOP",
    };
    GAMES[gameId].players[playerId] = player;

    // Notify all clients about player count
    broadcastPlayerCount(gameId);

    ws.on("message", (data: RawData) => {
      const move: string = data.toString();
      if (move === "UP" || move === "DOWN" || move === "STOP") {
        player.currentDirection = move as PaddleMove;
      }
    });

    ws.on("close", () => {
      // Set player direction to STOP before removing them
      if (GAMES[gameId]?.players[playerId]) {
        GAMES[gameId].players[playerId].currentDirection = "STOP";
      }
      delete GAMES[gameId]?.players[playerId];
      broadcastPlayerCount(gameId);
    });
  } else if (fieldMatch) {
    // Handle field viewer connection
    const [, gameId] = fieldMatch;
    if (!GAMES[gameId]) {
      GAMES[gameId] = createGame(gameId);
    }

    // Add to viewers list
    GAMES[gameId].viewers.push(ws);

    ws.on("close", () => {
      // Remove from viewers list
      const game = GAMES[gameId];
      if (game) {
        game.viewers = game.viewers.filter((viewer) => viewer !== ws);
      }
    });
  } else {
    // Invalid connection
    ws.close();
    return;
  }
});

function broadcastPlayerCount(gameId: string) {
  const game = GAMES[gameId];
  const leftCount = Object.values(game.players).filter(
    (p) => p.side === "left"
  ).length;
  const rightCount = Object.values(game.players).filter(
    (p) => p.side === "right"
  ).length;

  const message = JSON.stringify({
    type: "playerCount",
    leftCount,
    rightCount,
    totalCount: leftCount + rightCount,
  });

  // Send only to viewers (players don't need this info)
  for (const viewer of game.viewers) {
    viewer.send(message);
  }
}

// --- Game Loop ---
setInterval(() => {
  for (const gameId in GAMES) {
    const game = GAMES[gameId];

    // Collect current directions from all players
    const leftDirections: PaddleMove[] = [];
    const rightDirections: PaddleMove[] = [];

    for (const pid in game.players) {
      const p = game.players[pid];
      if (p.side === "left") leftDirections.push(p.currentDirection);
      else rightDirections.push(p.currentDirection);
    }

    // Count active players for each side
    const leftPlayerCount = Object.values(game.players).filter(
      (p) => p.side === "left"
    ).length;
    const rightPlayerCount = Object.values(game.players).filter(
      (p) => p.side === "right"
    ).length;

    // Most popular direction for each side
    const leftMove = mostPopularMove(leftDirections) || "STOP";
    const rightMove = mostPopularMove(rightDirections) || "STOP";
    // Update paddles
    if (leftMove === "UP")
      game.leftPaddle = Math.max(0, game.leftPaddle - PADDLE_SPEED);
    if (leftMove === "DOWN")
      game.leftPaddle = Math.min(
        FIELD_HEIGHT - PADDLE_HEIGHT,
        game.leftPaddle + PADDLE_SPEED
      );
    if (rightMove === "UP")
      game.rightPaddle = Math.max(0, game.rightPaddle - PADDLE_SPEED);
    if (rightMove === "DOWN")
      game.rightPaddle = Math.min(
        FIELD_HEIGHT - PADDLE_HEIGHT,
        game.rightPaddle + PADDLE_SPEED
      );
    // Update ball (simple physics)
    game.ball.x += game.ball.vx;
    game.ball.y += game.ball.vy;

    // Bounce off top/bottom
    if (game.ball.y <= 0 || game.ball.y >= FIELD_HEIGHT - BALL_SIZE) {
      game.ball.vy *= -1;
    }

    // Check paddle collisions
    if (
      game.ball.vx < 0 &&
      checkPaddleCollision(game.ball, game.leftPaddle, 0)
    ) {
      game.ball.vx = Math.abs(game.ball.vx); // Make ball go right
    } else if (
      game.ball.vx > 0 &&
      checkPaddleCollision(
        game.ball,
        game.rightPaddle,
        FIELD_WIDTH - PADDLE_WIDTH
      )
    ) {
      game.ball.vx = -Math.abs(game.ball.vx); // Make ball go left
    }

    // Check scoring (ball goes off screen)
    let scored = false;
    if (game.ball.x <= -BALL_SIZE) {
      // Right player scores
      game.score.right++;
      resetBall(game, "right");
      scored = true;
    } else if (game.ball.x >= FIELD_WIDTH) {
      // Left player scores
      game.score.left++;
      resetBall(game, "left");
      scored = true;
    }

    // Broadcast state only to viewers (not to players)
    const message = JSON.stringify({
      type: "state" as const,
      leftPaddle: game.leftPaddle,
      rightPaddle: game.rightPaddle,
      ball: game.ball,
      score: game.score,
      leftMove,
      rightMove,
      leftPlayerCount,
      rightPlayerCount,
      ...(scored && { scored: true }),
    });

    // Send only to viewers
    for (const viewer of game.viewers) {
      viewer.send(message);
    }
  }
}, 100);

function mostPopularMove(moves: PaddleMove[]): PaddleMove | undefined {
  if (!moves.length) return undefined;
  const freq: Record<PaddleMove, number> = { UP: 0, DOWN: 0, STOP: 0 };
  for (const m of moves) freq[m]++;
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0] as PaddleMove;
}

// --- Express routes ---
app.get("/", (req, res) => {
  res.send("Pong server running");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
