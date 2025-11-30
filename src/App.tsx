
import React, { useState, useEffect } from 'react';
import { PROJECTS, PERSONAL_INFO } from './constants';
import { Section } from './components/Section';
import { Terminal } from './components/Terminal';
import { MatrixBackground } from './components/MatrixBackground';
import { GlitchText } from './components/GlitchText';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/Toast';
import { BootScreen } from './components/BootScreen';
import { TechStack } from './components/TechStack';
import { EducationPanel } from './components/EducationPanel';
import { ProjectBlueprint } from './components/ProjectBlueprint';
import { BSOD } from './components/BSOD';
import { ExperienceFeeds } from './components/ExperienceFeeds';
import { ToastMessage, Project } from './types';

const App: React.FC = () => {
  const [hasBooted, setHasBooted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // New States
  const [selectedProject, setSelectedProject] = useState<{ project: Project; origin: { x: number; y: number } } | null>(null);
  const [isGodMode, setIsGodMode] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);

  // Konami Code Logic
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let cursor = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === konamiCode[cursor]) {
            cursor++;
            if (cursor === konamiCode.length) {
                setIsGodMode(prev => !prev);
                cursor = 0;
                showToast(
                    'GOD MODE ACTIVATED', 
                    'System resources overclocked. RGB initialized.', 
                    'success'
                );
            }
        } else {
            cursor = 0;
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBootComplete = () => {
      setHasBooted(true);
  };
  
  const handleCrash = () => {
      setHasCrashed(true);
  }

  const handleReboot = () => {
      setHasCrashed(false);
      setHasBooted(false); 
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'projects', 'skills'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      title,
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const changeTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'green') {
      root.style.setProperty('--color-primary', '#4ade80'); 
      root.style.setProperty('--color-secondary', '#22d3ee'); 
      showToast('Theme Updated', 'Matrix protocol loaded.', 'success');
    } else if (theme === 'purple') {
      root.style.setProperty('--color-primary', '#c084fc'); 
      root.style.setProperty('--color-secondary', '#f472b6'); 
      showToast('Theme Updated', 'Neon protocol loaded.', 'success');
    } else {
      root.style.setProperty('--color-primary', '#fbbf24');
      root.style.setProperty('--color-secondary', '#22d3ee');
      showToast('Theme Updated', 'Standard protocol loaded.', 'success');
    }
  };

  const NavLink = ({ href, label, isActive }: { href: string, label: string, isActive: boolean }) => (
    <a 
      href={href} 
      className={`font-mono text-sm tracking-widest transition-all duration-300 hover:text-primary ${isActive ? 'text-primary border-b border-primary' : 'text-muted'}`}
    >
      {label}
    </a>
  );
  
  if (hasCrashed) {
      return <BSOD onReboot={handleReboot} />
  }

  if (!hasBooted) {
      return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className={`min-h-screen bg-void selection:bg-primary/30 selection:text-white relative animate-fade-in ${isGodMode ? 'animate-rainbow' : ''}`}>
      <MatrixBackground />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
        {selectedProject && (
          <ProjectBlueprint project={selectedProject.project} origin={selectedProject.origin} onClose={() => setSelectedProject(null)} />
        )}
      
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        onNavigate={(id) => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }}
        onChangeTheme={changeTheme}
        onShowToast={showToast}
      />
      
      <header className="fixed top-0 left-0 right-0 z-40 bg-void/80 backdrop-blur-md border-b border-border h-14 flex items-center justify-between px-6 lg:px-12">
        <div className="font-mono font-bold text-white flex items-center gap-2">
          <span className={`text-success animate-pulse ${isGodMode ? 'text-white' : ''}`}>●</span>
          <span>SNH_510 {isGodMode ? '[GOD_MODE]' : ''}</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="#about" label="00.ABOUT" isActive={activeSection === 'about'} />
          <NavLink href="#experience" label="01.EXP" isActive={activeSection === 'experience'} />
          <NavLink href="#projects" label="10.WORK" isActive={activeSection === 'projects'} />
          <NavLink href="#skills" label="11.SKILLS" isActive={activeSection === 'skills'} />
        </nav>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => {
                    setIsPaletteOpen(true);
                }}
                className="hidden lg:flex items-center gap-2 font-mono text-xs border border-zinc-800 bg-black/50 text-zinc-400 px-3 py-1.5 rounded-md hover:border-primary/50 transition-colors"
            >
                <span>CMD+K</span>
            </button>
            <a 
                href={`mailto:${PERSONAL_INFO.email}`} 
                className="font-mono text-xs border border-primary/50 text-primary px-4 py-1.5 rounded-sm hover:bg-primary hover:text-black transition-colors"
            >
            CONTACT_ME
            </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-12 pt-32 pb-24 relative z-10">
        
        <section id="about" className="min-h-[80vh] flex flex-col justify-center mb-24">
          <div className="font-mono text-secondary mb-4 tracking-wide">Hi, my name is</div>
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tighter">
            <GlitchText text={PERSONAL_INFO.name} />
          </h1>
          <h2 className="font-sans text-4xl md:text-6xl font-semibold text-muted mb-8">
            I build intelligent backends.
          </h2>
          <p className="font-sans text-lg text-zinc-400 max-w-xl leading-relaxed mb-8">
            {PERSONAL_INFO.bio} Currently optimizing systems at <span className="text-primary">Future Technologies</span>.
          </p>
          
          <div className="flex flex-wrap gap-4 font-mono text-sm mb-12">
             {Object.entries({
                 GITHUB: PERSONAL_INFO.github,
                 LINKEDIN: PERSONAL_INFO.linkedin,
             }).map(([key, val]) => (
                 <a 
                    key={key} 
                    href={`https://${val}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-panel border border-border px-4 py-2 rounded-sm hover:border-secondary"
                 >
                    <span className="text-secondary">./</span>{key}
                 </a>
             ))}
          </div>

        </section>

        <section className="mb-32">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-primary text-sm"> SYSTEM_ACCESS_TERMINAL</h3>
                <span className="font-mono text-xs text-muted animate-pulse">CONNECTION_SECURE</span>
            </div>
            <Terminal onThemeChange={changeTheme} onCrash={handleCrash} onShutdown={handleReboot} />
            <div className="flex justify-between items-start font-mono text-xs text-zinc-600 mt-2">
                <span>* Tip: Use 'ls', 'cd', 'cat' to explore</span>
                <span>* Try 'neofetch' or 'game'</span>
            </div>
        </section>

        <Section title="Experience" id="experience" number="01">
          <ExperienceFeeds />
        </Section>

        <Section title="Something I've Built" id="projects" number="02">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project, index) => (
              <div 
                key={index} 
                className="bg-surface/50 backdrop-blur-sm p-6 rounded-sm border border-border hover:border-secondary/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                onClick={(e) => {
                    const ev = e as React.MouseEvent<HTMLDivElement>;
                    setSelectedProject({ project, origin: { x: ev.clientX, y: ev.clientY } });
                }}
              >
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-panel border border-border flex items-center justify-center rounded text-secondary group-hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div className="text-xs font-mono text-zinc-600 group-hover:text-primary transition-colors">[VIEW_SCHEMATIC]</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors">
                    {project.name}
                </h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tech Stack & Education" id="skills" number="03">
          <div className="grid grid-cols-1 gap-6 ">
            {/* Tech Stack Column */}
            <div className="lg:col-span-1">
               <TechStack />
            </div>
            <EducationPanel />
          </div>
          {/* Education Column */}
            <div>
               
            </div>
        </Section>
        
        <footer className="mt-32 border-t border-border pt-8 text-center">
            <p className="font-mono text-zinc-600 text-xs">
                Built with React & Tailwind.
            </p>
        </footer>

      </main>
    </div>
  );
};

export default App;
