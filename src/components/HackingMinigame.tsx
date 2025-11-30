
import React, { useState, useEffect, useMemo } from 'react';

interface HackingMinigameProps {
  onExit: () => void;
  onWin: () => void;
}

const WORDS = [
  'SYSTEM', 'SERVER', 'SOCKET', 'KERNEL', 'BUFFER', 'OBJECT', 'SCRIPT', 
  'DEPLOY', 'OUTPUT', 'MEMORY', 'ACCESS', 'CONFIG', 'BRIDGE', 'VECTOR'
];

const GARBAGE = '!@#$%^&*()_+-=[]{}|;:,.<>/?`~';

export const HackingMinigame: React.FC<HackingMinigameProps> = ({ onExit, onWin }) => {
  const [attempts, setAttempts] = useState(4);
  const [locked, setLocked] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState(false);

  // Initialize Game Data
  const { password, wordList, memoryDump } = useMemo(() => {
    // Pick random password
    const target = WORDS[Math.floor(Math.random() * WORDS.length)];
    
    // Select 6-8 other random words
    const subset = [target];
    while (subset.length < 8) {
      const w = WORDS[Math.floor(Math.random() * WORDS.length)];
      if (!subset.includes(w)) subset.push(w);
    }
    
    // Shuffle words
    const shuffledWords = subset.sort(() => Math.random() - 0.5);

    // Generate Memory Dump Rows (0xXXXX format)
    const rows = [];
    let wordIdx = 0;
    
    for (let i = 0; i < 12; i++) {
      // Hex Address
      const addr = `0x${(Math.floor(Math.random() * 60000) + 4096).toString(16).toUpperCase()}`;
      
      // Generate row content (12 chars wide)
      let content = "";
      // Occasionally insert a word
      if (wordIdx < shuffledWords.length && Math.random() > 0.3) {
        content = shuffledWords[wordIdx];
        wordIdx++;
      }
      
      // Fill remaining space with garbage
      while (content.length < 12) {
        if (Math.random() > 0.5) {
           content = content + GARBAGE[Math.floor(Math.random() * GARBAGE.length)];
        } else {
           content = GARBAGE[Math.floor(Math.random() * GARBAGE.length)] + content;
        }
      }
      // Trim to exact length just in case
      content = content.substring(0, 12);
      
      rows.push({ addr, content });
    }

    return { password: target, wordList: shuffledWords, memoryDump: rows };
  }, []);

  const calculateLikeness = (guess: string, target: string) => {
    let matches = 0;
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === target[i]) matches++;
    }
    return matches;
  };

  const handleWordClick = (word: string) => {
    if (locked || gameWon) return;
    
    if (word === password) {
      setHistory(prev => [`> ${word}`, `> EXACT MATCH!`, `> LOGIN ACCEPTED.`, ...prev]);
      setGameWon(true);
      setTimeout(onWin, 2000);
    } else {
      const likeness = calculateLikeness(word, password);
      setAttempts(prev => prev - 1);
      setHistory(prev => [`> ${word}`, `> ENTRY DENIED.`, `> LIKENESS=${likeness}`, ...prev]);
      
      if (attempts - 1 <= 0) {
        setLocked(true);
        setHistory(prev => [`> TERMINAL LOCKED.`, ...prev]);
      }
    }
  };

  // Helper to render a row with clickable words
  const renderRow = (content: string) => {
    // Find if this row contains any word from our list
    const foundWord = wordList.find(w => content.includes(w));
    
    if (foundWord) {
      const parts = content.split(foundWord);
      return (
        <>
          <span className="text-zinc-600">{parts[0]}</span>
          <span 
            className={`cursor-pointer ${hoveredWord === foundWord ? 'bg-primary text-black' : 'text-zinc-300 hover:text-white'}`}
            onMouseEnter={() => { setHoveredWord(foundWord); }}
            onMouseLeave={() => setHoveredWord(null)}
            onClick={() => handleWordClick(foundWord)}
          >
            {foundWord}
          </span>
          <span className="text-zinc-600">{parts[1]}</span>
        </>
      );
    }
    
    return <span className="text-zinc-600">{content}</span>;
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-black/95 text-sm font-mono p-4 gap-6 animate-fade-in relative overflow-hidden">
      {/* Scanline overlay specific to game */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]"></div>
      
      {/* Left Column: Memory Dump */}
      <div className="flex-1 z-10">
        <div className="mb-2 text-primary font-bold">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
        <div className="mb-4 text-secondary">ENTER PASSWORD TO UNLOCK</div>
        
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 font-mono text-base">
          {memoryDump.map((row, i) => (
             <div key={i} className="flex gap-4">
               <span className="text-primary/70">{row.addr}</span>
               <span className="tracking-widest">{renderRow(row.content)}</span>
             </div>
          ))}
        </div>
      </div>

      {/* Right Column: Status & Log */}
      <div className="w-full md:w-64 flex flex-col z-10 border-l border-zinc-800 pl-6">
        <div className="mb-6">
           <div className="flex justify-between items-center mb-2">
             <span className="text-zinc-400">ATTEMPTS REMAINING:</span>
             <div className="flex gap-1">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className={`w-3 h-3 border ${i < attempts ? 'bg-primary border-primary' : 'border-zinc-800'}`}></div>
               ))}
             </div>
           </div>
           
           <div className="h-32 border border-zinc-700 p-2 overflow-y-auto font-mono text-xs flex flex-col-reverse bg-zinc-900/50">
             {history.map((line, i) => (
               <div key={i} className={`mb-1 ${line.includes('ACCEPTED') ? 'text-success' : line.includes('DENIED') ? 'text-red-400' : 'text-zinc-400'}`}>
                 {line}
               </div>
             ))}
           </div>
        </div>
        
        <div className="mt-auto">
            {gameWon ? (
                <div className="text-center space-y-2">
                    <div className="text-success font-bold text-lg animate-pulse">ACCESS GRANTED</div>
                    <button onClick={onExit} className="text-zinc-400 border border-zinc-600 px-4 py-1 hover:text-white hover:border-white text-xs">EXIT SYSTEM</button>
                </div>
            ) : locked ? (
                <div className="text-center space-y-2">
                    <div className="text-red-500 font-bold text-lg animate-pulse">TERMINAL LOCKED</div>
                    <div className="text-xs text-zinc-500">PLEASE CONTACT ADMINISTRATOR</div>
                    <button onClick={onExit} className="text-zinc-400 border border-zinc-600 px-4 py-1 hover:text-white hover:border-white text-xs mt-2">EXIT</button>
                </div>
            ) : (
                <div className="text-center text-zinc-500 text-xs">
                    {hoveredWord ? (
                        <span className="text-primary text-lg font-bold block h-8">{hoveredWord}</span>
                    ) : (
                        <span className="block h-8 opacity-50">HOVER MEMORY</span>
                    )}
                    <button onClick={onExit} className="mt-2 hover:text-white">[ESC] ABORT</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
