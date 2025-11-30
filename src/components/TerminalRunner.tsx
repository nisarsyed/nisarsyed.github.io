
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TerminalRunnerProps {
  onExit: () => void;
}

const WIDTH = 30;
const HEIGHT = 20;
const PLAYER_Y = HEIGHT - 2;
const BASE_SPEED = 100;

export const TerminalRunner: React.FC<TerminalRunnerProps> = ({ onExit }) => {
  const [playerX, setPlayerX] = useState(Math.floor(WIDTH / 2));
  const [obstacles, setObstacles] = useState<{x: number, y: number}[]>([]);
  const [coins, setCoins] = useState<{x: number, y: number}[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [tick, setTick] = useState(0);
  
  // Game Loop
  useEffect(() => {
    if (gameOver) return;

    const speed = Math.max(30, BASE_SPEED - Math.floor(score / 100) * 5);
    
    const interval = setInterval(() => {
      setTick(t => t + 1);
      
      setObstacles(prev => {
        // Move obstacles down
        const moved = prev.map(o => ({ ...o, y: o.y + 1 })).filter(o => o.y < HEIGHT);
        
        // Spawn new obstacle
        if (Math.random() < 0.2 + (score / 2000)) { // Increase difficulty
           const newX = Math.floor(Math.random() * (WIDTH - 2)) + 1;
           // Don't spawn on top of another
           if (!moved.some(o => o.y === 0 && o.x === newX)) {
               moved.push({ x: newX, y: 0 });
           }
        }
        return moved;
      });

      setCoins(prev => {
          const moved = prev.map(c => ({ ...c, y: c.y + 1 })).filter(c => c.y < HEIGHT);
          if (Math.random() < 0.1) {
              const newX = Math.floor(Math.random() * (WIDTH - 2)) + 1;
              moved.push({ x: newX, y: 0 });
          }
          return moved;
      });

      setScore(s => s + 1);

    }, speed);

    return () => clearInterval(interval);
  }, [gameOver, score]);

  // Collision Detection
  useEffect(() => {
      // Check Hit Obstacle
      const hit = obstacles.some(o => o.x === playerX && o.y === PLAYER_Y);
      if (hit) {
          setGameOver(true);
      }

      // Check Collect Coin
      const collectedCoin = coins.find(c => c.x === playerX && c.y === PLAYER_Y);
      if (collectedCoin) {
          setScore(s => s + 50);
          setCoins(prev => prev.filter(c => c !== collectedCoin));
      }

  }, [tick, playerX, obstacles, coins]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
          if (e.key === 'Enter') {
              // Restart
              setGameOver(false);
              setScore(0);
              setObstacles([]);
              setCoins([]);
              setPlayerX(Math.floor(WIDTH / 2));
          } else if (e.key === 'Escape') {
              onExit();
          }
          return;
      }

      if (e.key === 'ArrowLeft') {
        setPlayerX(x => Math.max(1, x - 1));
      } else if (e.key === 'ArrowRight') {
        setPlayerX(x => Math.min(WIDTH - 2, x + 1));
      } else if (e.key === 'Escape') {
          onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, onExit]);

  // Render Grid
  const renderGrid = () => {
      let gridString = "";
      
      // Top Border
      gridString += `SCORE: ${score.toString().padStart(6, '0')} | SPEED: ${Math.floor(score / 100) + 1}x\n`;
      gridString += "+" + "-".repeat(WIDTH) + "+\n";

      for (let y = 0; y < HEIGHT; y++) {
          let row = "|";
          for (let x = 0; x < WIDTH; x++) {
              if (y === PLAYER_Y && x === playerX) {
                  row += gameOver ? "X" : "A"; // Player
              } else if (obstacles.some(o => o.x === x && o.y === y)) {
                  row += "#"; // Obstacle
              } else if (coins.some(c => c.x === x && c.y === y)) {
                  row += "$"; // Coin
              } else {
                  // Road markers
                  if (x === 0 || x === WIDTH - 1) row += " "; // Padding
                  else if (y % 4 === tick % 4 && (x === 1 || x === WIDTH - 2)) row += "."; // Moving road
                  else row += " ";
              }
          }
          row += "|\n";
          gridString += row;
      }

      gridString += "+" + "-".repeat(WIDTH) + "+";
      return gridString;
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center font-mono text-sm leading-none select-none overflow-hidden">
        {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 animate-fade-in">
                <h2 className="text-red-500 font-bold text-4xl mb-2">CRASHED</h2>
                <p className="text-white mb-6">FINAL SCORE: {score}</p>
                <div className="flex gap-4">
                    <button onClick={() => {
                         setGameOver(false);
                         setScore(0);
                         setObstacles([]);
                         setCoins([]);
                         setPlayerX(Math.floor(WIDTH / 2));
                    }} className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black transition-colors">
                        RETRY [ENTER]
                    </button>
                    <button onClick={onExit} className="border border-zinc-500 text-zinc-500 px-4 py-2 hover:border-white hover:text-white transition-colors">
                        EXIT [ESC]
                    </button>
                </div>
            </div>
        )}
        
        <pre className={`text-zinc-300 font-bold ${gameOver ? 'opacity-50 blur-sm' : ''}`}>
            {renderGrid()}
        </pre>
        
        <div className="mt-4 text-xs text-zinc-500">
            CONTROLS: LEFT/RIGHT ARROWS | DODGE '#' | COLLECT '$'
        </div>
    </div>
  );
};
