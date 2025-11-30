import React, { useEffect } from 'react';

interface BSODProps {
  onReboot: () => void;
}

export const BSOD: React.FC<BSODProps> = ({ onReboot }) => {
  
  useEffect(() => {
      const handleKeyDown = () => onReboot();
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('click', handleKeyDown);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('click', handleKeyDown);
      }
  }, [onReboot]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0000AA] text-white font-mono p-8 md:p-16 flex flex-col justify-center items-center text-left cursor-none select-none">
        <div className="max-w-3xl w-full space-y-6">
            <h1 className="bg-[#AAAAAA] text-[#0000AA] inline-block px-1 font-bold mb-4">SNH_OS</h1>
            <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.</p>
            
            <ul className="list-disc pl-5 space-y-1">
                <li>Press any key to terminate the current application.</li>
                <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
            </ul>

            <p className="mt-8">Press any key to continue _</p>
        </div>
    </div>
  );
};