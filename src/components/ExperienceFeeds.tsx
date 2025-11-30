
import React from 'react';
import { EXPERIENCE } from '../constants';

export const ExperienceFeeds: React.FC = () => {
  return (
    <div className="space-y-8 font-mono">
      {EXPERIENCE.map((job, index) => (
        <div key={index} className="bg-panel/40 border border-zinc-800 rounded p-6 hover:border-primary/30 transition-colors group">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-zinc-800/50 pb-2">
            <div>
              <div className="text-xs text-secondary mb-1">
                [{job.period.toUpperCase()}] :: PROCESS_ID_{1000 + index}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                {job.role}
              </h3>
            </div>
            <div className="mt-2 md:mt-0 text-right">
              <div className="text-white font-bold">{job.company}</div>
              <div className="text-xs text-zinc-500">{job.location}</div>
            </div>
          </div>
          
          <div className="space-y-3">
             <div className="text-xs text-zinc-600 mb-2">
                &gt; TAIL -F /VAR/LOGS/{job.company.replace(/\s+/g, '_').toUpperCase()}.LOG
             </div>
             {job.details.map((detail, i) => (
               <div key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                 <span className="text-success mt-1">$</span>
                 <span className="leading-relaxed">{detail}</span>
               </div>
             ))}
          </div>
        </div>
      ))}
    </div>
  );
};
