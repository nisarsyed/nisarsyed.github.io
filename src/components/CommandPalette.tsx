import React, { useState, useEffect, useRef } from 'react';
import { PERSONAL_INFO } from '../constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onChangeTheme: (theme: string) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onChangeTheme, onShowToast }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: 'about', label: 'Go to About Me', type: 'nav', target: 'about', icon: '👤' },
    { id: 'experience', label: 'Go to Experience', type: 'nav', target: 'experience', icon: '💼' },
    { id: 'projects', label: 'Go to Projects', type: 'nav', target: 'projects', icon: '🚀' },
    { id: 'skills', label: 'Go to Skills', type: 'nav', target: 'skills', icon: '⚡' },
    { id: 'theme-amber', label: 'Theme: Cyber Amber', type: 'theme', target: 'amber', icon: '🎨' },
    { id: 'theme-green', label: 'Theme: Matrix Green', type: 'theme', target: 'green', icon: '🎨' },
    { id: 'theme-purple', label: 'Theme: Neon Purple', type: 'theme', target: 'purple', icon: '🎨' },
    { id: 'email', label: 'Copy Email Address', type: 'action', action: 'copy-email', icon: '📧' },
    { id: 'resume', label: 'Download Resume', type: 'action', action: 'download-resume', icon: '📄' },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleAction = (action: any) => {
    if (action.type === 'nav') {
      onNavigate(action.target);
    } else if (action.type === 'theme') {
      onChangeTheme(action.target);
    } else if (action.type === 'action') {
      if (action.action === 'copy-email') {
        navigator.clipboard.writeText(PERSONAL_INFO.email);
        onShowToast('Clipboard', 'Email address copied successfully.');
      } else if (action.action === 'download-resume') {
        onShowToast('System', 'Initiating file transfer protocol...');
        // Simulate download
        setTimeout(() => {
           const link = document.createElement('a');
           link.href = '#'; // In a real app, this is the PDF path
           link.setAttribute('download', 'Syed_Nisar_Hussain_Resume.pdf');
           // link.click(); // Commented out for demo safety
           onShowToast('Download', 'Resume file transfer complete (Simulated).');
        }, 1500);
      }
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        handleAction(filteredActions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-panel border border-border rounded-lg shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-border">
          <span className="text-secondary font-mono mr-3 text-lg">❯</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none font-sans text-lg"
            placeholder="Type a command..."
            value={query}
            onChange={e => {
                setQuery(e.target.value);
                setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="text-xs text-zinc-500 font-mono border border-zinc-800 rounded px-2 py-0.5">ESC</span>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-500 font-mono text-sm">
              No commands found.
            </div>
          ) : (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                className={`w-full px-4 py-3 flex items-center gap-4 text-left transition-colors font-mono text-sm
                  ${index === selectedIndex ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-zinc-400 border-l-2 border-transparent hover:bg-zinc-900'}
                `}
                onClick={() => handleAction(action)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="text-lg">{action.icon}</span>
                <span className="flex-1">{action.label}</span>
                {index === selectedIndex && <span className="text-xs opacity-50">↵</span>}
              </button>
            ))
          )}
        </div>
        
        <div className="px-4 py-2 bg-black/30 border-t border-border text-xs text-zinc-600 font-mono flex justify-between">
            <span>ProTip: You can change themes here</span>
            <span>{filteredActions.length} results</span>
        </div>
      </div>
    </div>
  );
};