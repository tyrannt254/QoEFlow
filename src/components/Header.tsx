/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types/index.ts';
import { 
  Activity, 
  ShieldCheck, 
  DollarSign, 
  Smartphone, 
  Terminal, 
  Rocket, 
  Search, 
  HelpCircle, 
  Sparkles 
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenPilot: () => void;
  onOpenHelp: () => void;
  onOpenAi: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenPilot,
  onOpenHelp,
  onOpenAi,
  onOpenCommandPalette
}) => {
  const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'simulator', label: 'Speed Fallacy & AQM', icon: Activity },
    { id: 'fleet', label: 'ISP Operations', icon: ShieldCheck },
    { id: 'calculator', label: 'ROI & Truck Rolls', icon: DollarSign },
    { id: 'subscriber', label: 'Subscriber App', icon: Smartphone },
    { id: 'architecture', label: 'eBPF / CAKE Core', icon: Terminal },
    { id: 'pilot', label: '30-Day Pilot', icon: Rocket }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Zone 1: Single text wordmark with subtle status marker */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('simulator')} 
            className="text-left font-bold tracking-tight text-white hover:text-cyan-400 transition-colors cursor-pointer text-xl flex items-center gap-2"
          >
            <span>QoEFlow</span>
          </button>

          {/* Quick Search Shortcut */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-white/10 rounded-lg hover:border-white/20 transition-all cursor-pointer"
            title="Search commands, subscribers, and tools (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search or jump to...</span>
            <kbd className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links with domain icons */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg relative ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Internal AI + Help */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Copilot Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-all cursor-pointer shadow-xs hover:shadow-cyan-500/10 active:scale-95 whitespace-nowrap"
            title="Open internal AI Copilot for network troubleshooting, ROI tips, and navigation"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg transition-colors cursor-pointer"
            title="Help Center, Guided Tour, and Glossary"
            aria-label="Open Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenPilot}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-all shadow-sm hover:shadow-cyan-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Deploy Pilot
          </button>
        </div>
      </div>
      
      {/* Mobile nav bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-white/5 px-4 py-2 gap-2 bg-slate-900/60">
        <button
          onClick={onOpenCommandPalette}
          className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-300 flex items-center gap-1.5 shrink-0"
        >
          <Search className="w-3 h-3" />
          <span>Search</span>
        </button>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md whitespace-nowrap cursor-pointer shrink-0 ${
                activeTab === item.id 
                  ? 'bg-cyan-500/20 text-cyan-300 font-medium' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
