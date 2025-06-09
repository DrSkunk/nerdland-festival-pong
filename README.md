# Nerdland Festival Pong

A real-time multiplayer Pong game built with React, TypeScript, and WebSockets. This game features separate views for spectators and players, making it perfect for festival settings where one screen shows the game field and players use their own devices to control their paddles.

NOTE: This is not the game that was played at the Nerdland Festival 2025, but a recreation.

## Features

- **Real-time multiplayer gameplay** using WebSockets
- **Separate viewing modes:**
  - Game field view for spectators
  - Player control view for participants
- **Modern UI** built with React and Tailwind CSS
- **TypeScript** for type safety
- **Express.js backend** with WebSocket server

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── App.tsx           # Main app component with routing
│   │   ├── GameField.tsx     # Game field SVG component
│   │   ├── GameFieldView.tsx # Spectator view of the game field
│   │   ├── PlayerControlView.tsx # Player control interface
│   │   ├── useGameWebSocket.ts # WebSocket hook for real-time communication
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── main.tsx          # React app entry point
│   │   ├── index.css         # Global CSS with Tailwind imports
│   │   └── vite-env.d.ts     # Vite environment types
│   ├── index.html            # Main HTML template
│   ├── vite.config.ts        # Vite configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── eslint.config.js      # ESLint configuration
│   └── package.json          # Frontend dependencies and scripts
├── server/            # Express.js backend with WebSocket server
│   ├── src/
│   │   └── index.ts          # Main server file with game logic
│   ├── tsconfig.json         # TypeScript configuration
│   └── package.json          # Server dependencies and scripts
└── README.md
```

## Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm**

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:DrSkunk/nerdland-festival-pong.git
   cd nerdland-festival-pong
   ```

2. **Install dependencies for both frontend and backend:**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

### Running the Application

You'll need to run both the server and frontend in separate terminals:

#### Terminal 1 - Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in the code).

#### Terminal 2 - Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`.

## How to Play

### For Game Organizers (Field View)

1. Open your browser and navigate to: `http://localhost:5173/field/<gameId>`
   - Replace `<gameId>` with any unique identifier for your game session
   - This displays the game field for spectators

### For Players

1. Open your mobile device or browser and navigate to: `http://localhost:5173/player/<gameId>/<side>`
   - Replace `<gameId>` with the same game ID used for the field view
   - Replace `<side>` with either `left` or `right`
   - Use the control buttons to move your paddle up, down, or stop

### Example URLs

- Field view: `http://localhost:5173/field/game1`
- Left player: `http://localhost:5173/player/game1/left`
- Right player: `http://localhost:5173/player/game1/right`

## Development

### Available Scripts

#### Frontend (`/frontend`)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

#### Backend (`/server`)

- `npm run dev` - Start development server with auto-reload
- `npm run start` - Start production server
- `npm run build` - Build TypeScript

### Tech Stack

#### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing

#### Backend

- **Express.js** - Web server
- **WebSocket (ws)** - Real-time communication
- **TypeScript** - Type safety
- **ts-node** - TypeScript execution

## Configuration

### WebSocket Connection

The frontend automatically connects to the WebSocket server at:

- **Development**: `ws://localhost:3001`
- **Production**: Configure based on your deployment

Make sure both servers are running for the real-time multiplayer functionality.

### WebSocket Protocol

The application uses different WebSocket endpoints:

- **Field viewers**: `ws://server/field/{gameId}` - Receives game state and player count updates
- **Players**: `ws://server/player/{gameId}/{side}` - Sends paddle movement commands ("UP", "DOWN", "STOP")

Messages sent from server to field viewers:

```json
{
  "type": "state",
  "leftPaddle": 160,
  "rightPaddle": 160,
  "ball": { "x": 200, "y": 200, "vx": 5, "vy": 5 },
  "score": { "left": 0, "right": 1 },
  "leftMove": "UP",
  "rightMove": "STOP",
  "leftPlayerCount": 2,
  "rightPlayerCount": 1
}
```

### Port Configuration

- Frontend: `http://localhost:5173` (Vite default)
- Backend: `http://localhost:3001` (configurable via `PORT` environment variable)

### Environment Variables

The backend supports the following environment variables:

- `PORT` - Server port (default: 3001)

### Game Mechanics

- **Collective Paddle Control**: Multiple players can control the same paddle. The paddle moves based on the most popular direction chosen by all players on that side.
- **Real-time Physics**: Ball bounces off paddles and top/bottom walls with simple physics simulation.
- **Scoring**: Points are awarded when the ball goes off-screen on either side.
- **Game Field**: 400x400 pixel game area with 80px tall paddles.

## Building and Serving

### Development with Vite

The frontend uses **Vite** as the build tool and development server, which provides:

- **Fast Hot Module Replacement (HMR)** - Changes appear instantly in the browser
- **TypeScript support** - Built-in TypeScript compilation
- **Optimized builds** - Efficient bundling for production

#### Development Server

```bash
cd frontend
npm run dev
```

This starts the Vite development webserver.

#### Building for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist/` folder which can be deployed to any static file server.

#### Preview Production Build

```bash
cd frontend
npm run preview
```

Serves the production build locally to test before deployment.

### Backend Server

The Express.js server runs on port **3001** by default and can be configured via the `PORT` environment variable.

#### Development Mode

```bash
cd server
npm run dev
```

Uses `ts-node` with watch mode for automatic restart on file changes.

#### Production Mode

```bash
cd server
npm run build  # Compile TypeScript
npm start      # Run compiled JavaScript
```

### WebSocket Connection

The frontend automatically connects to the WebSocket server at:

- **Development**: `ws://localhost:3001`
- **Production**: Configure based on your deployment

Make sure both servers are running for the real-time multiplayer functionality.

## Production Deployment

### Frontend

```bash
cd frontend
npm run build
# Deploy the `dist` folder to your web server
```

The `dist` folder contains all static assets and can be served by any web server (Nginx, Apache, Vercel, Netlify, etc.).

### Backend

```bash
cd server
npm run build
npm start
```

### Environment Configuration

For production deployment, make sure to:

1. Set the `PORT` environment variable for the backend server
2. Update the WebSocket connection URL in the frontend if deploying to a different domain
3. Configure CORS if frontend and backend are on different domains

## Browser Compatibility

This application works in modern browsers that support:

- WebSockets
- ES2020+ JavaScript features
- CSS Grid and Flexbox

Tested browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

**WebSocket connection fails:**

- Ensure both frontend and backend servers are running
- Check that the backend is accessible on port 3001
- Verify firewall settings

**Game state not updating:**

- Check browser console for WebSocket errors
- Ensure you're using the correct game ID in URLs
- Try refreshing the page

**Players can't control paddles:**

- Verify you're using the player URL format: `/player/{gameId}/{side}`
- Check that WebSocket connection is established
- Ensure you're clicking the control buttons

## License

This project is licensed under the ISC License.
