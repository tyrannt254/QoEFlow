/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType } from '../types/index.ts';
import { 
  Search, 
  Activity, 
  ShieldCheck, 
  DollarSign, 
  Smartphone, 
  Terminal, 
  Rocket, 
  Download, 
  Wrench, 
  Sparkles, 
  X, 
  ArrowRight 
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenAi: (query?: string) => void;
  onOpenHelp: () => void;
  onHealAllNodes: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenAi,
  onOpenHelp,
  onHealAllNodes
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'sim',
      title: 'Speed Fallacy & AQM Lab',
      desc: 'Simulate bufferbloat and test FIFO vs CAKE vs FQ-CoDel under saturated load',
      icon: Activity,
      category: 'Navigation',
      action: () => {
        onNavigateTab('simulator');
        onClose();
      }
    },
    {
      id: 'fleet',
      title: 'ISP Fleet Operations Console',
      desc: 'Inspect subscriber CPE edge nodes, signal quality, and live self-healing',
      icon: ShieldCheck,
      category: 'Navigation',
      action: () => {
        onNavigateTab('fleet');
        onClose();
      }
    },
    {
      id: 'roi',
      title: 'ROI & Truck Roll Savings Calculator',
      desc: 'Calculate support call deflection, dispatch cost savings, and gamer tier revenue',
      icon: DollarSign,
      category: 'Navigation',
      action: () => {
        onNavigateTab('calculator');
        onClose();
      }
    },
    {
      id: 'sub',
      title: 'Subscriber Mobile App & Gamer Mode',
      desc: 'Preview white-label mobile app with +$5/mo low-latency priority toggle',
      icon: Smartphone,
      category: 'Navigation',
      action: () => {
        onNavigateTab('subscriber');
        onClose();
      }
    },
    {
      id: 'arch',
      title: 'eBPF / CAKE Core & Config Generator',
      desc: 'Generate Linux tc, LibreQoS, MikroTik v7, and OpenWrt configs and audit scopes',
      icon: Terminal,
      category: 'Navigation',
      action: () => {
        onNavigateTab('architecture');
        onClose();
      }
    },
    {
      id: 'pilot',
      title: '30-Day 500-Subscriber Pilot',
      desc: 'A/B cohort trial metrics proving 81% reduction in customer support tickets',
      icon: Rocket,
      category: 'Navigation',
      action: () => {
        onNavigateTab('pilot');
        onClose();
      }
    },
    {
      id: 'heal',
      title: 'Auto-Heal All Fleet Attention Nodes',
      desc: 'Instantly calibrate CAKE shapers on all degraded subscriber lines',
      icon: Wrench,
      category: 'Operations',
      action: () => {
        onHealAllNodes();
        onNavigateTab('fleet');
        onClose();
      }
    },
    {
      id: 'ai',
      title: 'Ask QoEFlow AI Copilot',
      desc: 'Get technical help with bufferbloat, queue tuning, or financial projections',
      icon: Sparkles,
      category: 'Intelligence',
      action: () => {
        onClose();
        onOpenAi(searchTerm);
      }
    }
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-950/60">
          <Search className="w-4 h-4 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, feature, or question (e.g. 'simulator', 'roi', 'cake')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching commands. Press Enter to ask AI Copilot.
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  className="p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-white/5 text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{cmd.category}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-sm">
                        {cmd.desc}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-white/5 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">↑↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">ESC</kbd> to close</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenHelp();
            }}
            className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
};
