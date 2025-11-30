import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  id: string;
  children: ReactNode;
  number: string;
}

export const Section: React.FC<SectionProps> = ({ title, id, children, number }) => {
  return (
    <section id={id} className="py-20 relative">
      <div className="flex items-end gap-4 mb-12 border-b border-border pb-4">
        <span className="font-mono text-primary text-3xl font-bold opacity-80">{number}</span>
        <h2 className="font-sans text-4xl font-bold text-white tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-border/50 ml-4 mb-2"></div>
      </div>
      <div className="animate-fade-in">
        {children}
      </div>
    </section>
  );
};
