
import React, { useState, useRef, useEffect } from 'react';
import { EXPERIENCE, PROJECTS, SKILLS, PERSONAL_INFO, EDUCATION } from '../constants';
import { HackingMinigame } from './HackingMinigame';
import { VimEditor } from './VimEditor';
import { NanoEditor } from './NanoEditor';
import { TerminalRunner } from './TerminalRunner';
import { PongGame } from './PongGame';

type CommandType = 'help' | 'about' | 'projects' | 'experience' | 'skills' | 'contact' | 'clear' | 'unknown' | 'date' | 'whoami' | 'sudo' | 'theme' | 'download' | 'matrix' | 'game' | 'deploy' | 'trace' | 'weather' | 'ls' | 'cd' | 'cat' | 'pwd' | 'neofetch' | 'top' | 'history' | 'whois' | 'uptime' | 'curl' | 'scan' | 'fortune' | 'shop' | 'echo' | 'ascii' | 'buy' | 'ping' | 'cowsay' | 'who' | 'git' | 'calc' | 'joke' | 'credits' | 'vi' | 'vim' | 'nano' | 'man' | 'apt' | 'grep' | 'shutdown' | 'reboot' | 'sl' | 'su';

interface TerminalLine {
  type: 'input' | 'output';
  content: React.ReactNode;
}

interface TerminalProps {
    onThemeChange: (theme: string) => void;
    onCrash?: () => void;
    onShutdown?: () => void;
}

// VFS Structure
const FILE_SYSTEM: any = {
    '~': {
        type: 'dir',
        children: {
            'about.txt': { type: 'file', content: PERSONAL_INFO.bio },
            'contact.md': { type: 'file', content: `Email: ${PERSONAL_INFO.email}\nGitHub: ${PERSONAL_INFO.github}\nLinkedIn: ${PERSONAL_INFO.linkedin}` },
            'projects': { 
                type: 'dir', 
                children: PROJECTS.reduce((acc: any, p) => {
                    acc[p.name.toLowerCase().replace(/\s+/g, '_') + '.json'] = {
                        type: 'file',
                        content: JSON.stringify(p, null, 2)
                    };
                    return acc;
                }, {})
            },
            'experience': {
                type: 'dir',
                children: EXPERIENCE.reduce((acc: any, job) => {
                     acc[job.company.toLowerCase().replace(/\s+/g, '_') + '.log'] = {
                         type: 'file',
                         content: `ROLE: ${job.role}\nPERIOD: ${job.period}\n\nLOGS:\n${job.details.map(d => `- ${d}`).join('\n')}`
                     };
                     return acc;
                }, {})
            },
            'skills.yaml': {
                type: 'file',
                content: SKILLS.map(s => `${s.category}:\n  - ${s.items.join('\n  - ')}`).join('\n\n')
            }
        }
    }
};

const TypingOutput = ({ children }: { children?: React.ReactNode }) => {
    return <div>{children}</div>
}

const ScanOutput = () => {
    const [lines, setLines] = useState<string[]>(['Initializing network scan...']);
    
    useEffect(() => {
        const steps = [
            { text: 'Target: localhost (127.0.0.1)', delay: 400 },
            { text: 'Scanning ports 1-1024...', delay: 800 },
            { text: 'Found open port: 80 (HTTP) - Nginx', delay: 1200 },
            { text: 'Found open port: 443 (HTTPS) - OpenSSL', delay: 1600 },
            { text: 'Found open port: 3000 (React Dev Server)', delay: 2000 },
            { text: 'Analyzing services...', delay: 2500 },
            { text: 'Vulnerability check: CVE-2025-XXXX... SAFE', delay: 3200 },
            { text: 'Scan complete. System integrity: 100%', delay: 3800, className: 'text-success font-bold' }
        ];

        let timeouts: ReturnType<typeof setTimeout>[] = [];
        steps.forEach((step) => {
            const t = setTimeout(() => {
                setLines(prev => [...prev, step.text]);
            }, step.delay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="space-y-1 font-mono text-xs text-zinc-400">
            {lines.map((l, i) => (
                <div key={i} className={l.includes('SAFE') || l.includes('integrity') ? 'text-success' : ''}>{l}</div>
            ))}
        </div>
    );
};

const AptOutput = ({ pkg, cmd }: { pkg: string, cmd: string }) => {
    const [lines, setLines] = useState<string[]>([`Reading package lists... Done`]);
    
    useEffect(() => {
        if (cmd === 'update') {
             const repos = [
                 'http://security.ubuntu.com/ubuntu jammy-security InRelease',
                 'http://archive.ubuntu.com/ubuntu jammy InRelease',
                 'http://archive.ubuntu.com/ubuntu jammy-updates InRelease'
             ];
             let timeouts: ReturnType<typeof setTimeout>[] = [];
             repos.forEach((repo, i) => {
                 timeouts.push(setTimeout(() => {
                     setLines(prev => [...prev, `Get:${i+1} ${repo} [${Math.floor(Math.random()*200)} kB]`]);
                 }, (i + 1) * 300));
             });
             timeouts.push(setTimeout(() => {
                 setLines(prev => [...prev, 'Fetched 4,200 kB in 1s (3,500 kB/s)', 'Reading package lists... Done']);
             }, 1500));
             return () => timeouts.forEach(clearTimeout);
        } else if (cmd === 'upgrade') {
             setTimeout(() => {
                 setLines(prev => [...prev, 'Calculating upgrade... Done', '0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.']);
             }, 800);
        } else if (cmd === 'install') {
             if (!pkg) {
                 setLines(prev => [...prev, 'apt install: missing package name']);
                 return;
             }
             const steps = [
                 { text: 'Building dependency tree... Done', delay: 300 },
                 { text: 'Reading state information... Done', delay: 600 },
                 { text: `The following NEW packages will be installed: ${pkg}`, delay: 900 },
                 { text: `0 upgraded, 1 newly installed, 0 to remove.`, delay: 1200 },
                 { text: `Need to get ${Math.floor(Math.random()*5000)} kB of archives.`, delay: 1500 },
                 { text: `Get:1 http://archive.ubuntu.com/ubuntu jammy/main amd64 ${pkg} [${Math.floor(Math.random()*5000)} kB]`, delay: 2000 },
                 { text: `Selecting previously unselected package ${pkg}.`, delay: 2500 },
                 { text: `(Reading database ... 254302 files and directories currently installed.)`, delay: 2800 },
                 { text: `Preparing to unpack .../${pkg} ...`, delay: 3100 },
                 { text: `Unpacking ${pkg} ...`, delay: 3400 },
                 { text: `Setting up ${pkg} ...`, delay: 4000 },
                 { text: `Processing triggers for man-db (2.10.2-1) ...`, delay: 4500 }
             ];
             let timeouts: ReturnType<typeof setTimeout>[] = [];
             steps.forEach(step => {
                 timeouts.push(setTimeout(() => setLines(prev => [...prev, step.text]), step.delay));
             });
             return () => timeouts.forEach(clearTimeout);
        }
    }, [cmd, pkg]);

    return (
        <div className="space-y-1 font-mono text-xs text-zinc-400">
             {lines.map((l, i) => (
                <div key={i}>{l}</div>
            ))}
        </div>
    )
}

const TrainOutput = () => {
    const trainRef = useRef<HTMLPreElement>(null);
    
    useEffect(() => {
        if (!trainRef.current) return;
        const train = trainRef.current;
        let pos = 100;
        
        const interval = setInterval(() => {
            pos -= 1;
            train.style.transform = `translateX(${pos}%)`;
            if (pos < -100) {
                clearInterval(interval);
                train.style.display = 'none';
            }
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="overflow-hidden w-full h-32 relative">
             <pre ref={trainRef} className="absolute right-0 text-white font-bold leading-none text-xs whitespace-pre">
{`
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        |    |
   /     |  |   H  |  |     |   |        |    |
  |      |  |   H  |__-----------------------------|
  | ________|___H__/__|_____/[][]~\\_______|___|___|
  |/ |   |-----------I_____I [][] []  D   |   |
__/  |   |  |    |   |  | _  __  _   _  |   |
|    |   |  |    |   |  |  |  |   |   | |   |
|____|___|__|____|___|__|__|__|___|___|_|___|
`}
             </pre>
        </div>
    )
}

const JokeOutput = () => {
    const [content, setContent] = useState<React.ReactNode>(<span className="text-zinc-500 animate-pulse">Connecting to humor database...</span>);

    useEffect(() => {
        const fetchJoke = async () => {
            try {
                const res = await fetch('https://official-joke-api.appspot.com/random_joke');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                
                // Simulate a slight network delay for effect if response is too fast
                setTimeout(() => {
                    setContent(
                        <div className="space-y-2 animate-fade-in">
                            <span className="text-zinc-300 block">"{data.setup}"</span>
                            <div className="text-secondary font-bold pl-4 border-l-2 border-secondary/30">
                                &gt; {data.punchline}
                            </div>
                            <div className="text-[10px] text-zinc-600 font-mono mt-2">
                                [JOKE_ID: {data.id}] [TYPE: {data.type.toUpperCase()}]
                            </div>
                        </div>
                    );
                }, 800);
            } catch (err) {
                 setContent(<span className="text-red-400">Error: 404 Humor Not Found. Connection terminated.</span>);
            }
        };
        
        fetchJoke();
    }, []);

    return <div>{content}</div>;
};

const PingOutput = ({ args }: { args: string[] }) => {
    const host = args[0] || 'google.com';
    const [lines, setLines] = useState<string[]>([`PING ${host} (${host}) 56(84) bytes of data.`]);

    useEffect(() => {
        let timeouts: ReturnType<typeof setTimeout>[] = [];
        for (let i = 1; i <= 4; i++) {
            timeouts.push(setTimeout(() => {
                const time = Math.floor(Math.random() * 50) + 10;
                setLines(prev => [...prev, `64 bytes from ${host}: icmp_seq=${i} ttl=117 time=${time} ms`]);
            }, i * 1000));
        }
        
        timeouts.push(setTimeout(() => {
             setLines(prev => [...prev, '', `--- ${host} ping statistics ---`, `4 packets transmitted, 4 received, 0% packet loss`]);
        }, 4500));

        return () => timeouts.forEach(clearTimeout);
    }, [host]);

    return (
        <div className="space-y-0.5 text-zinc-300 text-xs font-mono">
            {lines.map((l, i) => (
                <div key={i}>{l || '\u00A0'}</div>
            ))}
        </div>
    )
};

// Mini Matrix Component for Terminal
const TerminalMatrix = ({ onExit }: { onExit: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.parentElement?.clientWidth || 600;
        canvas.height = canvas.parentElement?.clientHeight || 400;

        const columns = Math.floor(canvas.width / 15);
        const drops: number[] = new Array(columns).fill(1);
        const chars = "01010101XYZΩ≈ç√∫";

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = '12px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 15, drops[i] * 15);
                if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        
        const handleResize = () => {
             if(canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
             }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-20 bg-black cursor-pointer" onClick={onExit}>
            <canvas ref={canvasRef} className="block w-full h-full" />
            <div className="absolute bottom-4 right-4 text-green-500 font-mono text-xs animate-pulse bg-black/50 px-2 py-1">
                Click to exit matrix...
            </div>
        </div>
    )
}

// Search helper
const searchFileSystem = (term: string, dir: any, path: string = ''): string[] => {
    let results: string[] = [];
    Object.keys(dir.children || {}).forEach(key => {
        const item = dir.children[key];
        const currentPath = path ? `${path}/${key}` : key;
        if (item.type === 'file') {
            const lines = item.content.split('\n');
            lines.forEach((line: string, i: number) => {
                if (line.toLowerCase().includes(term.toLowerCase())) {
                    results.push(`${currentPath}:${i + 1}: ${line.trim()}`);
                }
            });
        } else if (item.type === 'dir') {
            results = [...results, ...searchFileSystem(term, item, currentPath)];
        }
    });
    return results;
}

export const Terminal: React.FC<TerminalProps> = ({ onThemeChange, onCrash, onShutdown }) => {
  const [mode, setMode] = useState<'shell' | 'hack' | 'matrix' | 'vim' | 'nano' | 'runner' | 'pong'>('shell');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState<string[]>(['~']); 
  const [user, setUser] = useState('visitor');
  
  // Editor State
  const [editorFile, setEditorFile] = useState<{name: string, content: string}>({ name: '', content: '' });
  
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: <span className="text-secondary">Welcome to SNH_OS v1.0.0 (tty1)</span> },
    { type: 'output', content: <span className="text-zinc-400">System initialized... <span className="text-success">OK</span></span> },
    { type: 'output', content: <span className="text-zinc-400">Type <span className="text-primary font-bold">'help'</span> for commands or explore the file system with <span className="text-primary font-bold">'ls'</span>.</span> }
  ]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current && mode === 'shell') {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [lines, mode]);

    // Focus input on mount without causing the page to scroll to the terminal
    useEffect(() => {
        try {
            inputRef.current?.focus?.({ preventScroll: true } as FocusOptions);
        } catch {
            // fallback for browsers/environments that don't support the options param
            inputRef.current?.focus?.();
        }
    }, []);

  const addToHistory = (cmd: string) => {
      setHistory(prev => [cmd, ...prev]);
      setHistoryIndex(-1);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (history.length > 0 && historyIndex < history.length - 1) {
              const newIndex = historyIndex + 1;
              setHistoryIndex(newIndex);
              setInput(history[newIndex]);
          } else if (history.length > 0 && historyIndex === -1) {
               setHistoryIndex(0);
               setInput(history[0]);
          }
      } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex > 0) {
              const newIndex = historyIndex - 1;
              setHistoryIndex(newIndex);
              setInput(history[newIndex]);
          } else if (historyIndex === 0) {
              setHistoryIndex(-1);
              setInput('');
          }
      } else if (e.key === 'Tab') {
          e.preventDefault();
      } else if (e.key === 'c' && e.ctrlKey) {
          setLines(prev => [...prev, { type: 'input', content: <span><span className="text-success mr-2">{user}@desktop:{cwd.length === 1 ? '~' : '~/' + cwd[cwd.length-1]}$</span>{input}^C</span> }]);
          setInput('');
      }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
  }

  const getDir = (pathStack: string[]) => {
      let current = FILE_SYSTEM['~'];
      for (let i = 1; i < pathStack.length; i++) {
          if (current.children && current.children[pathStack[i]]) {
              current = current.children[pathStack[i]];
          } else {
              return null;
          }
      }
      return current;
  }

  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    const args = trimmedCmd.split(' ');
    const baseCmd = args[0].toLowerCase();
    let response: React.ReactNode;
    
    if (trimmedCmd === 'sudo rm -rf /' || trimmedCmd === 'sudo rm -rf /*') {
        if (onCrash) {
             onCrash();
             return;
        }
    }

    switch (baseCmd) {
      case 'help':
        const helpCommands = [
            { cmd: 'ls', desc: 'List directory contents' },
            { cmd: 'cd [dir]', desc: 'Change the current working directory' },
            { cmd: 'cat [file]', desc: 'Concatenate and display file content' },
            { cmd: 'grep [str]', desc: 'Search for patterns in files' },
            { cmd: 'vi [file]', desc: 'Edit file (Vim editor)' },
            { cmd: 'nano [file]', desc: 'Edit file (Nano editor)' },
            { cmd: 'apt [cmd]', desc: 'Package manager (update, install)' },
            { cmd: 'pwd', desc: 'Print working directory' },
            { cmd: 'neofetch', desc: 'Display system information' },
            { cmd: 'git [cmd]', desc: 'Execute git commands (status, log)' },
            { cmd: 'calc [exp]', desc: 'Calculate math expression' },
            { cmd: 'clear', desc: 'Clear the terminal screen' },
            { cmd: 'top', desc: 'Display active system processes' },
            { cmd: 'scan', desc: 'Perform network vulnerability scan' },
            { cmd: 'ping [host]', desc: 'Ping a remote host' },
            { cmd: 'sl', desc: 'Steam Locomotive' },
            { cmd: 'cowsay [msg]', desc: 'Make the cow speak' },
            { cmd: 'fortune', desc: 'Display a random dev quote' },
            { cmd: 'joke', desc: 'Tell a random programming joke' },
            { cmd: 'shop', desc: 'Open developer item shop' },
            { cmd: 'ascii', desc: 'Show random ASCII art' },
            { cmd: 'history', desc: 'Show command history' },
            { cmd: 'game [name]', desc: 'Play games (pong, runner, hack)' },
            { cmd: 'deploy', desc: 'Simulate deployment pipeline' },
            { cmd: 'trace', desc: 'Trace route to server' },
            { cmd: 'matrix', desc: 'Enter the matrix' },
            { cmd: 'weather', desc: 'Fetch weather report' },
            { cmd: 'theme [color]', desc: 'Change system theme (amber, green, purple)' },
            { cmd: 'shutdown', desc: 'Halt system' },
            { cmd: 'reboot', desc: 'Reboot system' },
        ];

        response = (
          <div className="space-y-1 text-zinc-300">
            <div className="mb-2 text-primary font-bold">AVAILABLE COMMANDS:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm">
                {helpCommands.map((item, idx) => (
                    <div key={idx} className="flex">
                        <span className="text-secondary w-32 shrink-0">{item.cmd}</span>
                        <span className="text-zinc-500">- {item.desc}</span>
                    </div>
                ))}
            </div>
            <div className="mt-2 text-zinc-500 text-xs">Type any command to execute.</div>
          </div>
        );
        break;
        
      case 'ls':
          const currentDirObj = getDir(cwd);
          if (currentDirObj && currentDirObj.children) {
              const items = Object.keys(currentDirObj.children).map(key => {
                  const isDir = currentDirObj.children[key].type === 'dir';
                  return (
                      <span key={key} className={isDir ? "text-primary font-bold mr-4" : "text-zinc-300 mr-4"}>
                          {key}{isDir ? '/' : ''}
                      </span>
                  );
              });
              response = <div className="flex flex-wrap">{items}</div>;
          } else {
              response = <span className="text-red-400">Error reading directory.</span>
          }
          break;
          
      case 'cd':
          const target = args[1];
          if (!target || target === '~') {
              setCwd(['~']);
          } else if (target === '..') {
              if (cwd.length > 1) {
                  setCwd(prev => prev.slice(0, -1));
              }
          } else {
              const curr = getDir(cwd);
              if (curr.children && curr.children[target] && curr.children[target].type === 'dir') {
                  setCwd(prev => [...prev, target]);
              } else {
                  response = <span className="text-red-400">cd: no such file or directory: {target}</span>
              }
          }
          break;
          
      case 'pwd':
          response = <span className="text-zinc-300">{cwd.join('/').replace('~', '/home/' + user)}</span>
          break;

      case 'cat':
          const fileTarget = args[1];
          const curr = getDir(cwd);
          if (!fileTarget) {
               response = <span className="text-red-400">Usage: cat [filename]</span>
          } else if (curr.children && curr.children[fileTarget]) {
              if (curr.children[fileTarget].type === 'file') {
                  response = <pre className="whitespace-pre-wrap text-zinc-300 font-mono text-xs">{curr.children[fileTarget].content}</pre>
              } else {
                   response = <span className="text-red-400">cat: {fileTarget}: Is a directory</span>
              }
          } else {
              response = <span className="text-red-400">cat: {fileTarget}: No such file or directory</span>
          }
          break;
        
      case 'grep':
          const term = args[1] ? args[1].replace(/"/g, '') : '';
          if (!term) {
              response = <span className="text-red-400">Usage: grep "search term" [file]</span>
          } else {
              const root = FILE_SYSTEM['~'];
              const hits = searchFileSystem(term, root);
              if (hits.length > 0) {
                  response = <div className="text-zinc-300 whitespace-pre-wrap">{hits.join('\n')}</div>
              } else {
                  response = <span className="text-zinc-500">No matches found.</span>
              }
          }
          break;

      case 'vi':
      case 'vim':
          const viTarget = args[1];
          let initialContent = '';
          const viCurr = getDir(cwd);
          
          if (viTarget && viCurr.children && viCurr.children[viTarget]) {
              if (viCurr.children[viTarget].type === 'file') {
                  initialContent = viCurr.children[viTarget].content;
              } else {
                  response = <span className="text-red-400">{baseCmd}: {viTarget}: Is a directory</span>;
                  break;
              }
          }
          
          setEditorFile({ name: viTarget || '[No Name]', content: initialContent });
          setMode('vim');
          setLines(prev => [
            ...prev,
            { type: 'input', content: <span><span className="text-success mr-2">{user}@desktop:{cwd.length === 1 ? '~' : '~/' + cwd[cwd.length-1]}$</span>{cmd}</span> }
          ]);
          return;

      case 'nano':
          const nanoTarget = args[1];
          let nanoContent = '';
          const nanoCurr = getDir(cwd);
          
          if (nanoTarget && nanoCurr.children && nanoCurr.children[nanoTarget]) {
              if (nanoCurr.children[nanoTarget].type === 'file') {
                  nanoContent = nanoCurr.children[nanoTarget].content;
              } else {
                  response = <span className="text-red-400">{baseCmd}: {nanoTarget}: Is a directory</span>;
                  break;
              }
          }
          
          setEditorFile({ name: nanoTarget || '', content: nanoContent });
          setMode('nano');
          setLines(prev => [
            ...prev,
            { type: 'input', content: <span><span className="text-success mr-2">{user}@desktop:{cwd.length === 1 ? '~' : '~/' + cwd[cwd.length-1]}$</span>{cmd}</span> }
          ]);
          return;
    
      case 'apt':
          const aptCmd = args[1];
          const pkg = args[2];
          if (!aptCmd) {
              response = <span className="text-zinc-300">apt 2.4.10 (amd64)<br/>Usage: apt command [options]</span>
          } else {
              response = <AptOutput cmd={aptCmd} pkg={pkg} />
          }
          break;

      case 'neofetch':
          response = (
              <div className="flex flex-col md:flex-row gap-6 text-xs md:text-sm text-zinc-300 font-mono">
                  <pre className="text-primary hidden md:block leading-none">
{`       .---.
      /     \\
      | SNH |
      \\     /
       '---'
     .       .
    /|       |\\
   / |       | \\
  /  |       |  \\
     |       |
`}
                  </pre>
                  <div className="space-y-1">
                      <div><span className="text-primary font-bold">{user}@SNH_OS</span></div>
                      <div>-----------------</div>
                      <div><span className="text-primary">OS</span>: SNH Arch Linux x86_64</div>
                      <div><span className="text-primary">Host</span>: Portfolio Web v2.5</div>
                      <div><span className="text-primary">Kernel</span>: React 19.2.0</div>
                      <div><span className="text-primary">Uptime</span>: {Math.floor(performance.now() / 60000)} mins</div>
                      <div><span className="text-primary">Packages</span>: {Object.keys(FILE_SYSTEM['~'].children.projects.children).length} (projects)</div>
                      <div><span className="text-primary">Shell</span>: bash 5.1</div>
                      <div><span className="text-primary">Role</span>: {PERSONAL_INFO.role}</div>
                      <div><span className="text-primary">Location</span>: {PERSONAL_INFO.location}</div>
                      <div className="mt-2 flex gap-1">
                          <span className="w-3 h-3 bg-black"></span>
                          <span className="w-3 h-3 bg-red-500"></span>
                          <span className="w-3 h-3 bg-green-500"></span>
                          <span className="w-3 h-3 bg-yellow-500"></span>
                          <span className="w-3 h-3 bg-blue-500"></span>
                          <span className="w-3 h-3 bg-purple-500"></span>
                          <span className="w-3 h-3 bg-cyan-500"></span>
                          <span className="w-3 h-3 bg-white"></span>
                      </div>
                  </div>
              </div>
          );
          break;
      
      case 'history':
          response = (
              <div className="text-zinc-400 text-xs space-y-0.5">
                  {history.map((cmd, i) => (
                      <div key={i}>{i + 1}  {cmd}</div>
                  ))}
                  <div>{history.length + 1}  {trimmedCmd}</div>
              </div>
          );
          break;

      case 'top':
          response = (
            <div className="text-xs font-mono text-zinc-300 whitespace-pre">
                <div className="bg-zinc-800 text-black px-1 mb-1">top - {new Date().toLocaleTimeString()} up {Math.floor(performance.now() / 60000)} min,  1 user,  load average: 0.15, 0.05, 0.01</div>
                <div className="mb-2">Tasks: 12 total,   1 running,  11 sleeping,   0 stopped,   0 zombie</div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-700 pb-1 mb-1 font-bold text-secondary">
                    <span className="col-span-2">PID</span>
                    <span className="col-span-2">USER</span>
                    <span className="col-span-1">PR</span>
                    <span className="col-span-1">NI</span>
                    <span className="col-span-1">S</span>
                    <span className="col-span-1">%CPU</span>
                    <span className="col-span-1">%MEM</span>
                    <span className="col-span-3">COMMAND</span>
                </div>
                {[
                    { pid: 1337, user: user, pr: 20, ni: 0, s: 'R', cpu: 12.5, mem: 4.2, cmd: 'portfolio_v2' },
                    { pid: 1, user: 'root', pr: 20, ni: 0, s: 'S', cpu: 0.0, mem: 0.1, cmd: 'systemd' },
                    { pid: 420, user: user, pr: 20, ni: 0, s: 'S', cpu: 0.2, mem: 1.5, cmd: 'react_renderer' },
                    { pid: 69, user: 'root', pr: -20, ni: 0, s: 'S', cpu: 0.0, mem: 0.0, cmd: 'kworker' },
                    { pid: 8080, user: user, pr: 20, ni: 0, s: 'S', cpu: 0.1, mem: 2.3, cmd: 'node' },
                ].map(proc => (
                    <div key={proc.pid} className="grid grid-cols-12 gap-2 text-zinc-400">
                        <span className="col-span-2 text-primary">{proc.pid}</span>
                        <span className="col-span-2">{proc.user}</span>
                        <span className="col-span-1">{proc.pr}</span>
                        <span className="col-span-1">{proc.ni}</span>
                        <span className="col-span-1">{proc.s}</span>
                        <span className="col-span-1">{proc.cpu}</span>
                        <span className="col-span-1">{proc.mem}</span>
                        <span className="col-span-3 text-white">{proc.cmd}</span>
                    </div>
                ))}
            </div>
          );
          break;

      case 'whois':
        const domain = args[1] || 'snh.dev';
        response = (
            <div className="text-zinc-400 text-xs whitespace-pre-wrap">
                <p>Domain Name: {domain.toUpperCase()}</p>
                <p>Registry Domain ID: 8675309_DOMAIN_COM-VRSN</p>
                <p>Registrar WHOIS Server: whois.google.com</p>
                <p>Registrar URL: http://www.google.com</p>
                <p>Updated Date: 2025-01-01T12:00:00Z</p>
                <p>Creation Date: 2020-05-10T04:20:00Z</p>
                <p>Registrar: GOOGLE INC.</p>
                <p>Registrant Name: Syed Nisar Hussain</p>
                <p>Registrant City: Karachi</p>
                <p>Registrant Country: PK</p>
                <p className="text-success mt-2">Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited</p>
            </div>
        );
        break;

      case 'uptime':
          response = <span className="text-zinc-300">up {Math.floor(performance.now() / 60000)} minutes, 1 user, load average: 0.08, 0.03, 0.01</span>
          break;

      case 'curl':
          const url = args[1] || 'localhost';
          response = (
            <div className="text-zinc-400 text-xs whitespace-pre-wrap">
                <p>{`> GET / HTTP/1.1`}</p>
                <p>{`> Host: ${url}`}</p>
                <p>{`> User-Agent: curl/7.68.0`}</p>
                <p>{`> Accept: */*`}</p>
                <p>{`< HTTP/1.1 200 OK`}</p>
                <p>{`< Content-Type: text/html`}</p>
                <p>{`< Content-Length: 420`}</p>
                <p className="mt-2 text-primary">{`<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>`}</p>
            </div>
          );
          break;

      case 'scan':
          response = <ScanOutput />;
          break;
      
      case 'ping':
          response = <PingOutput args={args.slice(1)} />;
          break;

      case 'sl':
          response = <TrainOutput />;
          break;

      case 'who':
          response = <span className="text-zinc-300">{user}  pts/0        {new Date().toISOString().slice(0,10)} 10:00 (127.0.0.1)</span>;
          break;
      
      case 'su':
          const newUser = args[1];
          if (!newUser) {
              response = <span className="text-zinc-300">Usage: su [username]</span>
          } else {
              setUser(newUser);
              response = <span className="text-zinc-300">Switched user to {newUser}</span>
          }
          break;

      case 'cowsay':
          const msg = args.slice(1).join(' ') || "Moo";
          response = (
              <pre className="text-zinc-300 text-xs leading-none">
{` _______________________
< ${msg} >
 -----------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`}
              </pre>
          );
          break;
      
      case 'fortune':
          const fortunes = [
              "\"First, solve the problem. Then, write the code.\" - John Johnson",
              "\"Experience is the name everyone gives to their mistakes.\" - Oscar Wilde",
              "\"Java is to JavaScript what car is to Carpet.\" - Chris Heilmann",
              "\"Knowledge is power.\" - Francis Bacon",
              "\"Simplicity is the soul of efficiency.\" - Austin Freeman",
              "\"Before software can be reusable it first has to be usable.\" - Ralph Johnson",
              "\"Make it work, make it right, make it fast.\" - Kent Beck"
          ];
          response = <div className="text-secondary italic">"{fortunes[Math.floor(Math.random() * fortunes.length)]}"</div>;
          break;

      case 'joke':
          response = <JokeOutput />;
          break;

      case 'calc':
          const expr = args.slice(1).join('');
          try {
              if (!expr) throw new Error("No expression");
              if (!/^[0-9+\-*/().\s]+$/.test(expr)) throw new Error("Invalid characters");
              // eslint-disable-next-line no-new-func
              const result = new Function(`return ${expr}`)();
              response = <span className="text-success">{result}</span>;
          } catch (e) {
              response = <span className="text-red-400">Error: Invalid expression. Usage: calc 2+2</span>;
          }
          break;

      case 'git':
          const gitCmd = args[1];
          if (gitCmd === 'status') {
              response = <div className="text-zinc-300">On branch main<br/>Your branch is up to date with 'origin/main'.<br/><br/>nothing to commit, working tree clean</div>
          } else if (gitCmd === 'log') {
               response = <div className="text-zinc-400 text-xs">
                   <p className="text-primary">commit 8d2f1a... (HEAD -&gt; main)</p>
                   <p>Author: Syed Nisar Hussain &lt;nisarsyed510@gmail.com&gt;</p>
                   <p>Date:   {new Date().toDateString()}</p>
                   <p className="pl-4">Update portfolio features</p>
               </div>
          } else if (gitCmd === 'commit') {
              response = <span className="text-red-400">fatal: nothing added to commit but untracked files present</span>
          } else {
              response = <span className="text-zinc-300">git: '{gitCmd}' is not a git command. See 'git --help'.</span>
          }
          break;

      case 'credits':
          response = (
            <div className="text-zinc-300 text-xs space-y-1">
                <p className="text-primary font-bold">PROJECT CREDITS</p>
                <p>Director: Syed Nisar Hussain</p>
                <p>Tech Stack: React, TypeScript, Tailwind CSS</p>
                <p>Inspiration: Retro Terminals, Cyberpunk, Linux</p>
                <p>Thanks for visiting!</p>
            </div>
          );
          break;

      case 'man':
          const manCmd = args[1];
          if(manCmd) {
              response = <div className="text-zinc-300">No manual entry for {manCmd}</div>
          } else {
              response = <div className="text-zinc-300">What manual page do you want?</div>
          }
          break;

      case 'shop':
          response = (
            <div className="text-zinc-300 font-mono text-xs">
                <div className="text-primary font-bold mb-2">--- DEV_SHOP_V1.0 ---</div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-700 pb-1 mb-1 text-secondary">
                    <span className="col-span-1">ID</span>
                    <span className="col-span-8">ITEM</span>
                    <span className="col-span-3 text-right">COST (XP)</span>
                </div>
                {[
                    { id: '01', name: 'Coffee Refill', cost: 50 },
                    { id: '02', name: 'Mechanical Switch (Blue)', cost: 150 },
                    { id: '03', name: 'Dark Mode License', cost: 500 },
                    { id: '04', name: 'RTX 5090 Ti', cost: 9999 },
                    { id: '05', name: 'StackOverflow Premium', cost: 1337 },
                ].map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 hover:bg-zinc-800/50 cursor-pointer">
                        <span className="col-span-1 text-zinc-500">{item.id}</span>
                        <span className="col-span-8">{item.name}</span>
                        <span className="col-span-3 text-right text-success">{item.cost}</span>
                    </div>
                ))}
                <div className="mt-2 text-zinc-500">To buy, type: buy [ID]</div>
            </div>
          );
          break;
      
      case 'buy':
          response = <span className="text-red-400">Transaction Failed: Insufficient Credits (Current: 0 XP)</span>;
          break;

      case 'ascii':
          const art = [
`    \\_/_/
    ( o.o )
     > ^ <
   (robot)`,
`   /\\___/\\
  (  o o  )
  /   *   \\
  \\__\\_/__/
   (cat)`,
`      .--.
    |o_o |
    |:_/ |
   //   \\ \\
  (|     | )
 /'\\_   _/\`\\
 \\___)=(___/
   (tux)`
          ];
          response = <pre className="text-primary leading-none text-xs">{art[Math.floor(Math.random() * art.length)]}</pre>;
          break;
      
      case 'echo':
          response = <span className="text-zinc-300">{args.slice(1).join(' ')}</span>;
          break;

      case 'about':
        response = <div className="text-zinc-300">{PERSONAL_INFO.bio}</div>;
        break;
      case 'contact':
        response = (
          <div className="text-zinc-300">
             <p>EMAIL: {PERSONAL_INFO.email}</p>
             <p>LINKEDIN: {PERSONAL_INFO.linkedin}</p>
          </div>
        );
        break;
      case 'projects':
      case 'experience':
      case 'skills':
         response = <span className="text-zinc-400">Tip: Try using 'ls' and 'cd' to explore {baseCmd} as files.</span>
         break;
      case 'date':
          response = <span className="text-zinc-300">{new Date().toString()}</span>
          break;
      case 'whoami':
          response = <span className="text-zinc-300">{user} (Guest User)</span>
          break;
      case 'clear':
        setLines([]);
        return;
      case 'weather':
          response = (
              <div className="text-zinc-300 font-mono text-xs leading-none">
                  <pre className="text-primary mb-2">
{`   \\   /
    .-.
 ― (   ) ―
    \`-’
   /   \\`}
                  </pre>
                  <p><span className="text-secondary">LOCATION:</span> Karachi, PK</p>
                  <p><span className="text-secondary">TEMP:</span> 32°C (Feels like 40°C)</p>
                  <p><span className="text-secondary">CONDITION:</span> Clear Sky / Haze</p>
              </div>
          );
          break;
      case 'theme':
        if (args[1]) {
            const t = args[1];
            if (['amber', 'green', 'purple'].includes(t)) {
                onThemeChange(t);
                response = <span className="text-success">System theme updated to '{t}'.</span>
            } else {
                response = <span className="text-red-400">Invalid theme.</span>
            }
        } else {
            response = <span className="text-zinc-400">Usage: theme [amber|green|purple]</span>
        }
        break;
      case 'game':
        const gameName = args[1];
        if (!gameName) {
            response = (
                <div className="text-zinc-300">
                    <div className="mb-2 text-primary font-bold">AVAILABLE GAMES:</div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                        <div><span className="text-secondary font-bold w-20 inline-block">hack</span> - Fallout-style password hacking</div>
                        <div><span className="text-secondary font-bold w-20 inline-block">runner</span> - Infinite ASCII runner</div>
                        <div><span className="text-secondary font-bold w-20 inline-block">pong</span> - Classic Ping Pong</div>
                    </div>
                    <div className="mt-2 text-zinc-500">Usage: game [name]</div>
                </div>
            );
        } else {
            switch(gameName.toLowerCase()) {
                case 'hack': setMode('hack'); return;
                case 'runner': setMode('runner'); return;
                case 'pong': setMode('pong'); return;
                default: response = <span className="text-red-400">Game '{gameName}' not found. Type 'game' for list.</span>;
            }
        }
        break;
      case 'matrix':
        setMode('matrix');
        return;
      case 'deploy':
          response = (
              <div className="text-zinc-300 font-mono text-xs space-y-1">
                  <p className="text-secondary">Initiating CI/CD Pipeline...</p>
                  <p>✔ Fetching source code...</p>
                  <p>✔ Running tests (pytest)... <span className="text-success">PASSED</span></p>
                  <p>✔ Building Docker image...</p>
                  <p>✔ Pushing to Google Cloud Run...</p>
                  <p className="text-success mt-2">DEPLOYMENT SUCCESSFUL.</p>
              </div>
          );
          break;
      case 'trace':
          response = (
            <div className="text-zinc-400 font-mono text-xs space-y-1">
                <p>Tracing route to nisar-syed-portfolio [127.0.0.1]...</p>
                <p>1  192.168.1.1     &lt;1 ms  &lt;1 ms  &lt;1 ms  Localhost</p>
                <p>2  10.244.0.1      2 ms   1 ms   3 ms   gateway.kubernetes.docker.internal</p>
                <p className="text-success">3  127.0.0.1       1 ms   1 ms   1 ms   TARGET REACHED</p>
            </div>
          );
          break;
      case 'shutdown':
          response = <span className="text-red-500">System halting...</span>;
          setTimeout(() => {
              if (onShutdown) onShutdown();
          }, 1000);
          break;
      case 'reboot':
          response = <span className="text-primary">System rebooting...</span>;
          setTimeout(() => {
               if (onShutdown) onShutdown();
          }, 1000);
          break;
      default:
        response = <span className="text-red-400">Command not found: '{trimmedCmd}'. Type 'help'.</span>;
    }

    setLines(prev => [
      ...prev,
      { type: 'input', content: <span><span className="text-success mr-2">{user}@desktop:{cwd.length === 1 ? '~' : '~/' + cwd[cwd.length-1]}$</span>{cmd}</span> },
      { type: 'output', content: <TypingOutput>{response}</TypingOutput> }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addToHistory(input);
    processCommand(input);
    setInput('');
  };

  const QuickCommand = ({ cmd }: { cmd: string }) => (
    <button 
        onClick={() => {
            setInput(cmd);
            processCommand(cmd);
            inputRef.current?.focus({ preventScroll: true });
        }}
        className="px-3 py-1 bg-border/30 hover:bg-primary/20 border border-border hover:border-primary/50 rounded text-xs font-mono text-zinc-400 hover:text-primary transition-colors active:scale-95"
    >
        {cmd}
    </button>
  );

  if (mode === 'hack') {
      return (
        <div className="w-full h-96 bg-void/90 backdrop-blur-sm border border-border rounded-sm shadow-2xl shadow-primary/5 relative z-10 overflow-hidden">
            <HackingMinigame 
                onExit={() => setMode('shell')} 
                onWin={() => {
                    setMode('shell');
                    setLines(prev => [...prev, { type: 'output', content: <span className="text-success font-bold">ACCESS GRANTED. Welcome, admin.</span> }]);
                }}
            />
        </div>
      );
  }

  if (mode === 'matrix') {
      return (
        <div className="w-full h-96 bg-void/90 backdrop-blur-sm border border-border rounded-sm shadow-2xl shadow-primary/5 relative z-10 overflow-hidden">
            <TerminalMatrix onExit={() => setMode('shell')} />
        </div>
      )
  }

  if (mode === 'vim') {
      return (
          <div className="w-full h-96 bg-void/90 backdrop-blur-sm border border-border rounded-sm shadow-2xl shadow-primary/5 relative z-10 overflow-hidden">
              <VimEditor 
                initialContent={editorFile.content} 
                filename={editorFile.name} 
                onExit={() => setMode('shell')} 
              />
          </div>
      )
  }

  if (mode === 'nano') {
      return (
          <div className="w-full h-96 bg-void/90 backdrop-blur-sm border border-border rounded-sm shadow-2xl shadow-primary/5 relative z-10 overflow-hidden">
              <NanoEditor 
                initialContent={editorFile.content} 
                filename={editorFile.name} 
                onExit={() => setMode('shell')} 
              />
          </div>
      )
  }

  if (mode === 'runner') {
      return (
          <div className="w-full h-96 bg-void/90 backdrop-blur-sm border border-border rounded-sm shadow-2xl shadow-primary/5 relative z-10 overflow-hidden">
              <TerminalRunner onExit={() => setMode('shell')} />
          </div>
      )
  }

  if (mode === 'pong') {
      return (
          <div className="w-full h-96 bg-void/90 backdrop-blur-sm border border-border rounded-sm shadow-2xl shadow-primary/5 relative z-10 overflow-hidden">
              <PongGame onExit={() => setMode('shell')} />
          </div>
      )
  }

  return (
    <div 
        className="w-full bg-void/90 backdrop-blur-sm border border-border rounded-sm flex flex-col font-mono text-sm shadow-2xl shadow-primary/5 relative z-10 overflow-hidden transition-all duration-300"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
        {/* Terminal Header */}
        <div className="bg-panel border-b border-border px-4 py-2 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
                <div className="w-3 h-3 rounded-full bg-secondary/20 border border-secondary"></div>
            </div>
            <span className="text-muted text-xs tracking-widest uppercase">bash -- {user}@desktop</span>
        </div>

        {/* Terminal Output Area (Now includes Input) */}
        <div 
            ref={containerRef}
            className="h-96 overflow-y-auto p-4 space-y-1 font-mono scroll-smooth cursor-text" 
        >
            {lines.map((line, idx) => (
                <div key={idx} className="break-words">
                    {line.content}
                </div>
            ))}
            
            {/* Active Input Line - Integrated into scroll view */}
            <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-x-2">
                <span className="text-success font-bold whitespace-nowrap">
                    {user}@desktop:{cwd.length === 1 ? '~' : '~/' + cwd[cwd.length-1]}$
                </span>
                <input 
                    ref={inputRef}
                    type="text" 
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-primary p-0 m-0 min-w-[50px]"
                />
            </form>
        </div>

        {/* Quick Actions (Still separate for ease of use on mobile/desktop) */}
        <div className="bg-panel/50 border-t border-border px-4 py-2 flex flex-wrap gap-2 items-center z-20">
            <span className="text-xs text-zinc-500 mr-2">Quick Run:</span>
            <QuickCommand cmd="ls" />
            <QuickCommand cmd="scan" />
            <QuickCommand cmd="ping google.com" />
            <QuickCommand cmd="game" />
            <QuickCommand cmd="deploy" />
            <QuickCommand cmd="top" />
            <QuickCommand cmd="help" />
        </div>
    </div>
  );
};
