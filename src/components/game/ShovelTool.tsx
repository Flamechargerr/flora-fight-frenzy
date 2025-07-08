import React from 'react';
import { Shovel } from 'lucide-react';

interface ShovelToolProps {
  isSelected: boolean;
  onSelect: () => void;
}

const ShovelTool: React.FC<ShovelToolProps> = ({ isSelected, onSelect }) => {
  return (
    <div className="w-full md:w-auto">
      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="glass-dark rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Tools</span>
          </div>
          
          <button
            onClick={onSelect}
            className={`w-full aspect-square rounded-lg p-3 transition-all duration-200 border-2 ${
              isSelected 
                ? 'bg-destructive/20 border-destructive animate-pulse' 
                : 'bg-card/80 border-border hover:border-destructive/50 hover:scale-105'
            }`}
            title="Shovel - Remove plants and get 80% refund"
          >
            <div className="flex flex-col items-center gap-2">
              <Shovel className={`w-6 h-6 ${isSelected ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium text-center">Shovel</span>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className="glass-dark w-[120px] rounded-xl p-3">
          <div className="text-center bg-destructive/20 rounded-lg py-2 mb-3 border border-destructive/30">
            <span className="text-xs text-foreground font-bold">TOOLS</span>
          </div>
          
          <button
            onClick={onSelect}
            className={`w-full aspect-square rounded-lg p-3 transition-all duration-200 border-2 ${
              isSelected 
                ? 'bg-destructive/20 border-destructive animate-pulse' 
                : 'bg-card/80 border-border hover:border-destructive/50 hover:scale-105'
            }`}
            title="Shovel - Remove plants and get 80% refund"
          >
            <div className="flex flex-col items-center gap-1">
              <Shovel className={`w-5 h-5 ${isSelected ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className="text-[10px] font-medium text-center">Shovel</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShovelTool;