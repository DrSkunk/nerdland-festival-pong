export interface GameState {
  leftPaddle: number;
  rightPaddle: number;
  ball: { x: number; y: number; vx: number; vy: number };
  score: { left: number; right: number };
  leftMove?: PaddleMove;
  rightMove?: PaddleMove;
  leftPlayerCount?: number;
  rightPlayerCount?: number;
}

export interface PlayerCounts {
  leftCount: number;
  rightCount: number;
  totalCount: number;
}

export type PaddleMove = "UP" | "DOWN" | "STOP";

export type Side = "left" | "right";
