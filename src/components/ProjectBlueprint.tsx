import React, { useEffect, useState } from 'react';
import { Project } from '../types';

interface ProjectBlueprintProps {
    project: Project;
    onClose: () => void;
    origin?: { x: number; y: number };
}

export const ProjectBlueprint: React.FC<ProjectBlueprintProps> = ({ project, onClose, origin }) => {
    const [transform, setTransform] = useState<string>('translate(-50%,-50%) scale(1)');
    const [opacity, setOpacity] = useState<number>(0);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // compute dx/dy from viewport center to click
        let t: number | undefined;
        if (origin) {
            const dx = Math.round(origin.x - window.innerWidth / 2);
            const dy = Math.round(origin.y - window.innerHeight / 2);
            // start at centered position offset by dx/dy
            setTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.78)`);
            setOpacity(0);
            // next frame -> animate to true center
            t = window.setTimeout(() => {
                setTransform('translate(-50%,-50%) scale(1)');
                setOpacity(1);
            }, 20);
        } else {
            setTransform('translate(-50%,-50%) scale(0.9)');
            setOpacity(0);
            t = window.setTimeout(() => {
                setTransform('translate(-50%,-50%) scale(1)');
                setOpacity(1);
            }, 20);
        }

        // Escape to close
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);

        return () => {
            if (t) clearTimeout(t);
            document.body.style.overflow = prev || '';
            window.removeEventListener('keydown', onKey);
        };
    }, [origin, onClose]);

    return (
        <div
            className="fixed inset-0 z-60 bg-zinc-950/95 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="fixed left-1/2 top-1/2 w-full max-w-4xl bg-[#0f172a] border-2 border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ease-out"
                onClick={e => e.stopPropagation()}
                style={{ transform, opacity }}
            >
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Blueprint Header */}
        <div className="bg-[#1e293b] border-b border-white/10 p-4 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
                <div className="border border-white/30 px-2 py-1 text-xs font-mono text-white/70">FIG. 0{Math.floor(Math.random() * 10)}</div>
                <h2 className="font-mono text-xl font-bold text-white uppercase tracking-wider">SCHEMATIC: {project.name}</h2>
            </div>
            <button 
                onClick={onClose} 
                className="text-white/50 hover:text-white transition-colors"
            >
                [CLOSE_VIEW]
            </button>
        </div>

        {/* Main Content */}
        <div className="p-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Visual Schematic Column */}
            <div className="lg:col-span-2 space-y-6">
                <div className="border border-dashed border-white/20 p-6 min-h-[200px] flex items-center justify-center relative">
                    <div className="absolute top-2 right-2 text-xs font-mono text-white/30">ARCH_DIAGRAM_V1.0</div>
                    {/* Simulated Flowchart */}
                    <div className="flex flex-col md:flex-row items-center gap-4 opacity-80">
                        <div className="w-24 h-16 border-2 border-primary/50 flex items-center justify-center text-xs font-mono text-primary bg-primary/5 rounded">CLIENT</div>
                        <div className="h-8 w-0.5 md:w-8 md:h-0.5 bg-white/20"></div>
                        <div className="w-24 h-16 border-2 border-secondary/50 flex items-center justify-center text-xs font-mono text-secondary bg-secondary/5 rounded">SERVER</div>
                        <div className="h-8 w-0.5 md:w-8 md:h-0.5 bg-white/20"></div>
                        <div className="w-24 h-16 border-2 border-white/50 flex items-center justify-center text-xs font-mono text-white bg-white/5 rounded-full">DB</div>
                    </div>
                </div>
                
                <div className="font-mono text-sm text-zinc-400">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary"></span>
                        SYSTEM_DESCRIPTION
                    </h3>
                    <p className="leading-relaxed border-l border-white/10 pl-4">{project.description}</p>
                </div>

                <div className="font-mono text-sm text-zinc-400">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-secondary"></span>
                        ARCHITECTURE_NOTES
                    </h3>
                    <p className="leading-relaxed border-l border-white/10 pl-4 text-xs">{project.architecture}</p>
                </div>
            </div>

            {/* Spec Sheet Column */}
            <div className="border-l border-white/10 pl-8 flex flex-col justify-between">
                <div>
                    <div className="mb-6">
                        <span className="text-xs font-mono text-white/40 block mb-1">TECH_STACK</span>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map(tech => (
                                <span key={tech} className="text-xs font-mono text-secondary border border-secondary/30 px-2 py-1 rounded-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <span className="text-xs font-mono text-white/40 block mb-1">KEY_FEATURES</span>
                        <ul className="text-xs font-mono text-zinc-300 space-y-2">
                            {project.features?.map((feat, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-primary">-</span>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Confidential Stamp */}
                <div className="mt-8 border-4 border-red-500/30 text-red-500/30 font-bold text-3xl p-2 -rotate-12 text-center select-none uppercase">
                    CONFIDENTIAL
                    <div className="text-xs tracking-widest border-t border-red-500/30 mt-1 pt-1">RESTRICTED ACCESS</div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1e293b] border-t border-white/10 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-white/40">
            <span>APPROVED_BY: SNH-510</span>
            <span>DOC_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};