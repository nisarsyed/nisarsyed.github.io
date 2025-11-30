
import React from 'react';
import { EDUCATION, CERTIFICATIONS } from '../constants';

export const EducationPanel: React.FC = () => {
    return (
        <div className="h-full bg-zinc-900/20 border border-zinc-800 p-6 rounded-sm flex flex-col font-mono text-sm relative overflow-hidden group hover:border-zinc-600 transition-colors">
             {/* Window Controls */}
             <div className="flex items-center gap-2 mb-6 opacity-50">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-xs text-zinc-500">user@education:~</span>
             </div>
             
             <div className="space-y-6 flex-1 relative z-10">
                {/* Command 1 */}
                <div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <span className="text-secondary">➜</span>
                        <span className="text-zinc-500">~</span>
                        <span>cat university_info.txt</span>
                    </div>
                    <div className="mt-2 pl-4 border-l-2 border-zinc-800 text-zinc-300">
                        <p className="font-bold text-white text-base mb-1">{EDUCATION.institution}</p>
                        <p className="text-xs text-primary mb-1">{EDUCATION.degree}</p>
                        <p className="text-xs text-zinc-500">{EDUCATION.date} | {EDUCATION.location}</p>
                    </div>
                </div>
                
                {/* Command 2 */}
                <div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <span className="text-secondary">➜</span>
                        <span className="text-zinc-500">~</span>
                        <span>grep "GPA" transcript.log</span>
                    </div>
                    <div className="mt-1 pl-4 text-zinc-300 text-xs">
                         <span className="text-success">{EDUCATION.gpa}</span> <span className="text-zinc-600">(High Performance)</span>
                    </div>
                </div>

                {/* Command 3 */}
                <div>
                     <div className="flex items-center gap-2 text-zinc-400">
                        <span className="text-secondary">➜</span>
                        <span className="text-zinc-500">~</span>
                        <span>cat awards.json</span>
                     </div>
                     <div className="mt-1 pl-4 text-yellow-400/90 text-xs whitespace-pre-wrap">
                        {`"${EDUCATION.awards}"`}
                     </div>
                </div>

                {/* Command 4 */}
                <div>
                     <div className="flex items-center gap-2 text-zinc-400">
                        <span className="text-secondary">➜</span>
                        <span className="text-zinc-500">~</span>
                        <span>ls ./certifications</span>
                     </div>
                     <div className="mt-2 pl-4 space-y-1">
                        {CERTIFICATIONS.map((c, i) => (
                            <div key={i} className="flex gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">
                                <span>-rw-r--r--</span>
                                <span>{c.split('–')[0].trim().replace(/\s+/g, '_')}.crt</span>
                            </div>
                        ))}
                     </div>
                </div>
             </div>
             
             {/* Blinking Cursor at bottom */}
             <div className="mt-6 flex items-center gap-2">
                 <span className="text-secondary">➜</span>
                 <span className="text-zinc-500">~</span>
                 <span className="w-2 h-4 bg-zinc-500 animate-pulse"></span>
             </div>
        </div>
    )
}
