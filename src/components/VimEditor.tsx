
import React, { useState, useEffect, useRef } from 'react';

interface VimEditorProps {
  initialContent?: string;
  filename?: string;
  onExit: () => void;
}

export const VimEditor: React.FC<VimEditorProps> = ({ initialContent = '', filename = '[No Name]', onExit }) => {
  const [lines, setLines] = useState<string[]>(initialContent ? initialContent.split('\n') : ['']);
  const [cursor, setCursor] = useState({ r: 0, c: 0 }); // Row, Column
  const [mode, setMode] = useState<'NORMAL' | 'INSERT' | 'COMMAND'>('NORMAL');
  const [commandBuffer, setCommandBuffer] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Scroll ref to keep cursor in view
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (mode === 'NORMAL') {
        switch (e.key) {
          case 'i':
            setMode('INSERT');
            setStatusMsg('-- INSERT --');
            break;
          case ':':
            setMode('COMMAND');
            setCommandBuffer(':');
            break;
          case 'h':
          case 'ArrowLeft':
            setCursor(prev => ({ ...prev, c: Math.max(0, prev.c - 1) }));
            break;
          case 'l':
          case 'ArrowRight':
            setCursor(prev => ({ ...prev, c: Math.min((lines[prev.r]?.length || 0), prev.c + 1) }));
            break;
          case 'j':
          case 'ArrowDown':
            setCursor(prev => ({ ...prev, r: Math.min(lines.length - 1, prev.r + 1) }));
            break;
          case 'k':
          case 'ArrowUp':
            setCursor(prev => ({ ...prev, r: Math.max(0, prev.r - 1) }));
            break;
          case '$':
            setCursor(prev => ({ ...prev, c: lines[prev.r].length }));
            break;
          case '0':
            setCursor(prev => ({ ...prev, c: 0 }));
            break;
          case 'x':
             // Delete char under cursor
             setLines(prev => {
                 const newLines = [...prev];
                 const line = newLines[cursor.r];
                 if (line.length > 0) {
                     newLines[cursor.r] = line.slice(0, cursor.c) + line.slice(cursor.c + 1);
                 }
                 return newLines;
             });
             break;
        }
      } else if (mode === 'INSERT') {
        if (e.key === 'Escape') {
          setMode('NORMAL');
          setStatusMsg('');
          // Clamp cursor if it went past end of line during insert
          setCursor(prev => ({ ...prev, c: Math.min(lines[prev.r].length > 0 ? lines[prev.r].length - 1 : 0, prev.c) }));
          return;
        }

        if (e.key === 'Enter') {
            setLines(prev => {
                const newLines = [...prev];
                const currentLine = newLines[cursor.r];
                const before = currentLine.slice(0, cursor.c);
                const after = currentLine.slice(cursor.c);
                newLines[cursor.r] = before;
                newLines.splice(cursor.r + 1, 0, after);
                return newLines;
            });
            setCursor(prev => ({ r: prev.r + 1, c: 0 }));
        } else if (e.key === 'Backspace') {
            if (cursor.c > 0) {
                // Delete char in line
                setLines(prev => {
                    const newLines = [...prev];
                    const line = newLines[cursor.r];
                    newLines[cursor.r] = line.slice(0, cursor.c - 1) + line.slice(cursor.c);
                    return newLines;
                });
                setCursor(prev => ({ ...prev, c: prev.c - 1 }));
            } else if (cursor.r > 0) {
                // Merge with previous line
                setLines(prev => {
                    const newLines = [...prev];
                    const currentLine = newLines[cursor.r];
                    const prevLineLen = newLines[cursor.r - 1].length;
                    newLines[cursor.r - 1] += currentLine;
                    newLines.splice(cursor.r, 1);
                    setCursor({ r: cursor.r - 1, c: prevLineLen });
                    return newLines;
                });
            }
        } else if (e.key.length === 1) {
            setLines(prev => {
                const newLines = [...prev];
                const line = newLines[cursor.r];
                newLines[cursor.r] = line.slice(0, cursor.c) + e.key + line.slice(cursor.c);
                return newLines;
            });
            setCursor(prev => ({ ...prev, c: prev.c + 1 }));
        }
      } else if (mode === 'COMMAND') {
        if (e.key === 'Escape') {
          setMode('NORMAL');
          setCommandBuffer('');
          return;
        }

        if (e.key === 'Enter') {
            const cmd = commandBuffer.slice(1).trim(); // Remove leading :
            if (cmd === 'q') {
                onExit();
            } else if (cmd === 'q!') {
                onExit();
            } else if (cmd === 'w') {
                setStatusMsg(`"${filename}" written (simulated)`);
                setMode('NORMAL');
            } else if (cmd === 'wq') {
                onExit();
            } else {
                setStatusMsg(`E492: Not an editor command: ${cmd}`);
                setMode('NORMAL');
            }
            setCommandBuffer('');
        } else if (e.key === 'Backspace') {
            setCommandBuffer(prev => {
                if (prev.length <= 1) {
                    setMode('NORMAL');
                    return '';
                }
                return prev.slice(0, -1);
            });
        } else if (e.key.length === 1) {
            setCommandBuffer(prev => prev + e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, lines, cursor, commandBuffer, filename, onExit]);

  // Viewport Logic
  const renderLines = () => {
      // Simple viewport: show lines around cursor or all if few
      // For this basic version, we render all and rely on CSS overflow
      return lines.map((line, idx) => {
          const isCurrentLine = idx === cursor.r;
          
          return (
              <div key={idx} className="flex relative leading-none min-h-[1.2em]">
                  {/* Line Number (optional, typical vim doesn't show by default unless set number, but good for visuals) */}
                  {/* <span className="w-8 text-zinc-600 text-right mr-4 select-none">{idx + 1}</span> */}
                  
                  <div className="flex-1 whitespace-pre break-all font-mono text-zinc-300">
                      {line.length === 0 && isCurrentLine ? (
                           <span className={mode === 'NORMAL' ? 'bg-white/80 text-black' : 'border-l-2 border-white'}>&nbsp;</span>
                      ) : (
                          line.split('').map((char, charIdx) => {
                              const isCursor = isCurrentLine && charIdx === cursor.c;
                              return (
                                  <span 
                                    key={charIdx}
                                    className={`${isCursor && mode === 'NORMAL' ? 'bg-white/80 text-black' : ''} ${isCursor && mode === 'INSERT' ? 'border-l-2 border-white' : ''}`}
                                  >
                                    {char}
                                  </span>
                              )
                          })
                      )}
                      {/* Cursor at end of line */}
                      {isCurrentLine && cursor.c === line.length && (
                          <span className={`${mode === 'NORMAL' ? 'bg-white/80 text-black opacity-50' : 'border-l-2 border-white'}`}>&nbsp;</span>
                      )}
                  </div>
              </div>
          )
      });
  }

  // Generate tildes for empty space
  const renderTildes = () => {
      const emptyCount = Math.max(0, 20 - lines.length);
      return Array(emptyCount).fill('~').map((_, i) => (
          <div key={`tilde-${i}`} className="text-blue-900 font-bold">~</div>
      ));
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 bg-[#0f0f0f] text-sm font-mono flex flex-col cursor-none">
        <div className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
            {renderLines()}
            {renderTildes()}
        </div>
        
        {/* Status Bar */}
        <div className="h-6 bg-zinc-300 text-black flex justify-between items-center px-2 text-xs font-bold">
            <div className="flex gap-4">
                <span>{mode}</span>
                <span>{filename}</span>
            </div>
            <div className="flex gap-4">
                <span>utf-8</span>
                <span>{Math.floor((cursor.r / Math.max(1, lines.length)) * 100)}%</span>
                <span>{cursor.r + 1},{cursor.c + 1}</span>
            </div>
        </div>

        {/* Command Line / Message Bar */}
        <div className="h-6 bg-black text-white px-2 flex items-center border-t border-zinc-800">
             {mode === 'COMMAND' ? (
                 <span>{commandBuffer}</span>
             ) : (
                 <span className="text-zinc-300">{statusMsg}</span>
             )}
        </div>
    </div>
  );
};
