import React from 'react';
import { Construction } from 'lucide-react';

interface ModulePlaceholderProps {
  name: string;
  phase: string;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ name, phase }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 animate-pulse">
        <Construction size={32} />
      </div>
      <h2 className="text-2xl font-bold font-heading gradient-text">{name}</h2>
      <p className="text-muted-foreground text-sm max-w-md leading-normal">
        This workspace module is scheduled for construction in <strong className="text-purple-300">{phase}</strong>. It will include full database models, API routes, and rich visual controls.
      </p>
    </div>
  );
};
