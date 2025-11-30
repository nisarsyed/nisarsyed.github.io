
import React, { useEffect, useRef, useState } from 'react';

interface PongGameProps {
  onExit: () => void;
}

export const PongGame: React.FC<PongGameProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game constants
    const PADDLE_HEIGHT = 60;
    const PADDLE_WIDTH = 10;
    const BALL_SIZE = 8;
    const WIN_SCORE = 5;

    // Game state
    let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
    let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 3;

    // Resize handling
    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || 600;
        canvas.height = canvas.parentElement?.clientHeight || 400;
        // Reset positions on resize
        playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
        aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    };
    resize();
    window.addEventListener('resize', resize);

    // Controls
    let mouseY = canvas.height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const gameLoop = () => {
      // Logic
      if (gameState !== 'playing') return;

      // Player Movement
      playerY = mouseY - PADDLE_HEIGHT / 2;
      // Clamp player
      if (playerY < 0) playerY = 0;
      if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;

      // AI Movement (Simple tracking)
      const aiCenter = aiY + PADDLE_HEIGHT / 2;
      if (aiCenter < ballY - 35) {
        aiY += 4;
      } else if (aiCenter > ballY + 35) {
        aiY -= 4;
      }
      // Clamp AI
      if (aiY < 0) aiY = 0;
      if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;

      // Ball Movement
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Wall Collision (Top/Bottom)
      if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
      }

      // Paddle Collision
      // Player
      if (ballX < PADDLE_WIDTH && ballY > playerY && ballY < playerY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        const deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
        // Speed up slightly
        ballSpeedX = ballSpeedX > 0 ? ballSpeedX + 0.5 : ballSpeedX - 0.5;
      }
      // AI
      if (ballX > canvas.width - PADDLE_WIDTH && ballY > aiY && ballY < aiY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        const deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
        // Speed up slightly
        ballSpeedX = ballSpeedX > 0 ? ballSpeedX + 0.5 : ballSpeedX - 0.5;
      }

      // Scoring
      if (ballX < 0) {
        setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
        resetBall();
      } else if (ballX > canvas.width) {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
        resetBall();
      }

      // Draw
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dashed line
      ctx.strokeStyle = '#333';
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Paddles
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(canvas.width - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      ctx.fillRect(ballX - BALL_SIZE/2, ballY - BALL_SIZE/2, BALL_SIZE, BALL_SIZE);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const resetBall = () => {
       ballX = canvas.width / 2;
       ballY = canvas.height / 2;
       ballSpeedX = -ballSpeedX; // Serve to winner
       ballSpeedY = 3;
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

  // Check win condition outside loop to avoid state thrashing in render
  useEffect(() => {
      if (scores.player >= 5 || scores.ai >= 5) {
          setGameState('gameover');
      }
  }, [scores]);

  return (
    <div className="relative w-full h-full bg-black cursor-none overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Score HUD */}
      <div className="absolute top-4 w-full flex justify-center gap-16 font-mono text-4xl font-bold text-white/20 pointer-events-none">
          <span>{scores.player}</span>
          <span>{scores.ai}</span>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs font-mono text-zinc-500 pointer-events-none">
          MOUSE: Move Paddle | ESC: Exit
      </div>

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center font-mono animate-fade-in">
              <h2 className={`text-4xl font-bold mb-4 ${scores.player > scores.ai ? 'text-success' : 'text-red-500'}`}>
                  {scores.player > scores.ai ? 'YOU WIN' : 'GAME OVER'}
              </h2>
              <div className="flex gap-4">
                  <button 
                    onClick={() => {
                        setScores({ player: 0, ai: 0 });
                        setGameState('playing');
                    }}
                    className="border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
                  >
                      RESTART
                  </button>
                  <button 
                    onClick={onExit}
                    className="border border-zinc-500 text-zinc-500 px-4 py-2 hover:border-white hover:text-white transition-colors"
                  >
                      EXIT
                  </button>
              </div>
          </div>
      )}

      {/* Exit Button (Always visible just in case) */}
      {gameState === 'playing' && (
          <button 
            onClick={onExit}
            className="absolute top-4 right-4 text-zinc-600 hover:text-white font-mono text-xs z-20"
          >
              [ESC]
          </button>
      )}
    </div>
  );
};
