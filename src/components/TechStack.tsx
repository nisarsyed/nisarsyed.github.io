
import React from 'react';
import { SKILLS } from '../constants';

export const TechStack: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {SKILLS.map((cat, i) => (
        <div key={i} className="bg-zinc-900/20 border border-zinc-800 p-4 rounded-sm relative overflow-hidden group hover:border-zinc-600 transition-colors">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                    <span className="text-primary text-xs">./</span>
                    <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-300 group-hover:text-white transition-colors">
                        {cat.category.replace(/\s+/g, '_').toUpperCase()}
                    </h3>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">MOD_COUNT: {cat.items.length}</span>
            </div>
            
            {/* Items */}
            <div className="flex flex-wrap gap-2">
                {cat.items.map((item, j) => (
                    <div 
                        key={j} 
                        className="
                            text-xs font-mono text-zinc-400 bg-black/40 px-2 py-1 border border-zinc-800 rounded-sm 
                            flex items-center gap-2 hover:text-white hover:border-secondary/50 hover:bg-secondary/5 
                            transition-all cursor-default select-none
                        "
                    >
                        <span className="w-1 h-1 bg-success rounded-full opacity-50 group-hover:opacity-100"></span>
                        {item}
                    </div>
                ))}
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-4 -right-4 text-[4rem] text-zinc-800/20 font-bold select-none pointer-events-none">
                {i + 1}
            </div>
        </div>
      ))}
    </div>
  );
};
