
import React, { useState, useEffect } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootText = [
    "Initializing BIOS...",
    "Checking CPU... OK",
    "Checking RAM... 32GB OK",
    "Loading Kernel... SNH-510 v2.0",
    "Mounting File System...",
    "Loading Portfolio Assets...",
    "Establishing Secure Connection...",
    "Access Granted."
  ];

  useEffect(() => {
    let lineIndex = 0;
    const textInterval = setInterval(() => {
      setLines(prev => [...prev, bootText[lineIndex]]);
      lineIndex++;
      if (lineIndex >= bootText.length) {
        clearInterval(textInterval);
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800); // Wait a bit after 100%
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-start justify-end p-8 md:p-16 font-mono text-sm md:text-base text-primary cursor-wait">
      <div className="w-full max-w-2xl mb-8 space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="animate-fade-in">
            <span className="text-zinc-500 mr-2">{`[${(i * 0.12).toFixed(4)}]`}</span>
            <span>{line}</span>
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex justify-between text-xs text-secondary mb-2 uppercase">
             <span>System Loading</span>
             <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-75 ease-out relative"
            style={{ width: `${progress}%` }}
          >
             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

       <button 
        onClick={onComplete}
        className="absolute top-8 right-8 text-zinc-600 text-xs border border-zinc-800 px-3 py-1 hover:text-white hover:border-zinc-500"
      >
        SKIP_BOOT
      </button>
    </div>
  );
};
