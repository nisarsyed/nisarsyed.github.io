import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const SystemMonitor: React.FC = () => {
  const [stats, setStats] = useState({
    cpu: 12,
    ram: 24,
    net: 150
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 5,
        ram: Math.floor(Math.random() * 10) + 20,
        net: Math.floor(Math.random() * 50) + 120
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const monitor = (
    <div className="hidden lg:flex fixed bottom-8 right-8 z-50 bg-void/90 border border-border p-3 rounded-sm font-mono text-xs shadow-lg shadow-secondary/10 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <span className="text-muted">CPU_LOAD</span>
            <span className="text-secondary text-right">{stats.cpu}%</span>
            
            <span className="text-muted">MEM_USAGE</span>
            <span className="text-primary text-right">{stats.ram}%</span>
            
            <span className="text-muted">NET_LATENCY</span>
            <span className="text-success text-right">{stats.net}ms</span>

            <span className="text-muted">UPTIME</span>
            <span className="text-white text-right">99.9%</span>
        </div>
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-secondary"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-secondary"></div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(monitor, document.body);
};