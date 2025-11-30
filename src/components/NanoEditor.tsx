
import React, { useState, useEffect, useRef } from 'react';

interface NanoEditorProps {
  initialContent?: string;
  filename?: string;
  onExit: () => void;
}

export const NanoEditor: React.FC<NanoEditorProps> = ({ initialContent = '', filename = '', onExit }) => {
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus textarea on mount
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Nano uses Ctrl key combinations
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'x':
          e.preventDefault();
          if (isDirty) {
            setShowExitPrompt(true);
          } else {
            onExit();
          }
          break;
        case 'o':
           e.preventDefault();
           setIsDirty(false);
           // In a real app we'd save, here we just simulate saving state
           break;
        // Block browser defaults for common nano shortcuts
        case 's': 
        case 'w':
        case 'k':
        case 'j':
        case 'r':
            e.preventDefault();
            break;
      }
    }

    if (showExitPrompt) {
        e.preventDefault();
        if (e.key.toLowerCase() === 'y') {
            onExit(); // "Saved" and exit
        } else if (e.key.toLowerCase() === 'n') {
            onExit(); // Discard and exit
        } else if (e.key === 'c' && e.ctrlKey) {
            setShowExitPrompt(false); // Cancel
        }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col font-mono text-sm bg-zinc-900 text-white overflow-hidden cursor-text" onClick={() => textareaRef.current?.focus()}>
      {/* Header */}
      <div className="bg-zinc-200 text-black px-2 py-0.5 flex justify-between items-center select-none shrink-0">
         <span className="w-1/3">GNU nano 6.2</span>
         <span className="w-1/3 text-center truncate">{filename || 'New Buffer'}</span>
         <span className="w-1/3 text-right">{isDirty ? 'Modified' : ''}</span>
      </div>

      {/* Editor Body */}
      <textarea
        ref={textareaRef}
        className="flex-1 bg-transparent resize-none outline-none p-2 text-zinc-300 whitespace-pre font-mono custom-scrollbar border-none w-full"
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />

      {/* Message Area / Prompt */}
      <div className="h-6 px-2 bg-zinc-900 flex items-center text-white text-xs shrink-0">
          {showExitPrompt ? (
              <span className="bg-white text-black px-1">Save modified buffer?  (Answering "No" will destroy changes) ?</span>
          ) : (
              <span>{isDirty ? 'File modified' : ''}</span>
          )}
      </div>

      {/* Footer Shortcuts */}
      <div className="shrink-0">
        {showExitPrompt ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-2 pb-1 text-xs select-none bg-zinc-900">
                <div><span className="bg-white text-black mr-1"> Y </span> Yes</div>
                <div><span className="bg-white text-black mr-1"> N </span> No</div>
                <div><span className="bg-white text-black mr-1">^C</span> Cancel</div>
            </div>
        ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-2 gap-y-1 px-2 pb-1 text-[10px] sm:text-xs select-none bg-zinc-900">
                <div><span className="font-bold">^G</span> Get Help</div>
                <div><span className="font-bold">^O</span> Write Out</div>
                <div><span className="font-bold">^W</span> Where Is</div>
                <div><span className="font-bold">^K</span> Cut Text</div>
                <div><span className="font-bold">^J</span> Justify</div>
                <div><span className="font-bold">^C</span> Cur Pos</div>
                <div><span className="font-bold">^X</span> Exit</div>
                <div><span className="font-bold">^R</span> Read File</div>
                <div><span className="font-bold">^/</span> Replace</div>
                <div><span className="font-bold">^U</span> Uncut Text</div>
                <div><span className="font-bold">^T</span> To Spell</div>
                <div><span className="font-bold">^_</span> Go To Line</div>
            </div>
        )}
      </div>
    </div>
  );
};
