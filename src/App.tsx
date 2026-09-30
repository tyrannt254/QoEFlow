/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, CpeNode, SelfHealingEvent } from './types/index.ts';
import { INITIAL_FLEET_NODES, INITIAL_SELF_HEALING_LOG } from './data/mockData.ts';
import { Header } from './components/Header.tsx';
import { SpeedFallacySimulator } from './components/SpeedFallacySimulator.tsx';
import { FleetDashboard } from './components/FleetDashboard.tsx';
import { RoiCalculator } from './components/RoiCalculator.tsx';
import { SubscriberPortal } from './components/SubscriberPortal.tsx';
import { ArchitectureAudit } from './components/ArchitectureAudit.tsx';
import { PilotOnboarding } from './components/PilotOnboarding.tsx';
import { HelpCenterModal } from './components/HelpCenterModal.tsx';
import { AiCopilot } from './components/AiCopilot.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [fleetNodes, setFleetNodes] = useState<CpeNode[]>(INITIAL_FLEET_NODES);
  const [selfHealingLog, setSelfHealingLog] = useState<SelfHealingEvent[]>(INITIAL_SELF_HEALING_LOG);

  // Modals & Navigation state
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');

  // Global hotkeys (Cmd+K for search, ? for help)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if currently typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle AQM on/off for any node
  const handleToggleAqm = (id: string) => {
    setFleetNodes((prev) =>
      prev.map((node) => {
        if (node.id !== id) return node;
        const newAqm = !node.aqmActive;
        return {
          ...node,
          aqmActive: newAqm,
          algorithm: newAqm ? 'cake' : 'fifo',
          loadedPingMs: newAqm ? 16 : 460,
          grade: newAqm ? 'A+' : 'F',
          status: newAqm ? 'nominal' : 'attention'
        };
      })
    );
  };

  // Toggle Gamer Tier for any node
  const handleToggleGamerTier = (id: string) => {
    setFleetNodes((prev) =>
      prev.map((node) => {
        if (node.id !== id) return node;
        return {
          ...node,
          gamerTierActive: !node.gamerTierActive
        };
      })
    );
  };

  // Trigger self-healing on a specific node
  const handleTriggerSelfHeal = (id: string) => {
    setFleetNodes((prev) =>
      prev.map((node) => {
        if (node.id !== id) return node;
        return {
          ...node,
          aqmActive: true,
          algorithm: 'cake',
          loadedPingMs: 15,
          grade: 'A+',
          status: 'nominal',
          healingCount: node.healingCount + 1,
          lastHealedAt: 'Just now',
          wifiHealthPercent: Math.min(100, node.wifiHealthPercent + 15)
        };
      })
    );

    const targetNode = fleetNodes.find((n) => n.id === id);
    if (targetNode) {
      const newEvent: SelfHealingEvent = {
        id: `HEAL-${Math.floor(Math.random() * 899 + 100)}`,
        timestamp: 'Just now',
        cpeId: targetNode.id,
        subscriber: targetNode.subscriberName,
        triggerType: 'standing_queue',
        details: 'High loaded latency detected during heavy concurrent downlink.',
        actionTaken: 'Applied CAKE diffserv4 fair-queuing and automated DFS channel selection. Cleared queue backlog.',
        latencyBeforeMs: targetNode.loadedPingMs,
        latencyAfterMs: 15,
        truckRollAvoided: true,
        estimatedCostSaved: 110
      };

      setSelfHealingLog((prev) => [newEvent, ...prev]);
    }
  };

  // Heal all nodes needing attention
  const handleHealAllNodes = () => {
    const attentionNodes = fleetNodes.filter((n) => n.status === 'attention');
    if (attentionNodes.length === 0) return;

    setFleetNodes((prev) =>
      prev.map((node) => ({
        ...node,
        aqmActive: true,
        algorithm: 'cake',
        loadedPingMs: 16,
        grade: 'A+',
        status: 'nominal',
        healingCount: node.healingCount + 1,
        lastHealedAt: 'Just now'
      }))
    );

    const newEvents: SelfHealingEvent[] = attentionNodes.map((n) => ({
      id: `HEAL-${Math.floor(Math.random() * 899 + 100)}`,
      timestamp: 'Just now',
      cpeId: n.id,
      subscriber: n.subscriberName,
      triggerType: 'bufferbloat_spike',
      details: 'Fleet automated sweep resolved standing FIFO buffer congestion.',
      actionTaken: 'Migrated line to CAKE qdisc with triple-host isolation and ACK filter.',
      latencyBeforeMs: n.loadedPingMs,
      latencyAfterMs: 16,
      truckRollAvoided: true,
      estimatedCostSaved: 110
    }));

    setSelfHealingLog((prev) => [...newEvents, ...prev]);
  };

  const handleOpenAiWithQuery = (query?: string) => {
    if (query) setAiInitialQuery(query);
    setIsAiOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* 3-Zone Header Contract with Quick Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPilot={() => setActiveTab('pilot')}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAi={() => handleOpenAiWithQuery()}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area with Smooth Animation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {activeTab === 'simulator' && <SpeedFallacySimulator />}
        {activeTab === 'fleet' && (
          <FleetDashboard
            fleetNodes={fleetNodes}
            selfHealingLog={selfHealingLog}
            onToggleAqm={handleToggleAqm}
            onToggleGamerTier={handleToggleGamerTier}
            onTriggerSelfHeal={handleTriggerSelfHeal}
            onHealAllNodes={handleHealAllNodes}
          />
        )}
        {activeTab === 'calculator' && (
          <RoiCalculator onOpenPilot={() => setActiveTab('pilot')} />
        )}
        {activeTab === 'subscriber' && <SubscriberPortal />}
        {activeTab === 'architecture' && <ArchitectureAudit />}
        {activeTab === 'pilot' && <PilotOnboarding />}
      </main>

      {/* Floating Action Button for Instant AI & Help (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsHelpOpen(true)}
          className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Open Help Center & Troubleshooting Guide (Press ?)"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5 text-cyan-400" />
        </button>

        <button
          onClick={() => handleOpenAiWithQuery()}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold shadow-xl shadow-cyan-500/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 text-xs tracking-tight"
          title="Open QoEFlow AI Copilot"
        >
          <Sparkles className="w-4 h-4 animate-spin text-slate-950" style={{ animationDuration: '6s' }} />
          <span>Ask AI Copilot</span>
        </button>
      </div>

      {/* Global Modals & Drawers */}
      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsHelpOpen(false);
        }}
        onOpenAi={(q) => handleOpenAiWithQuery(q)}
      />

      <AiCopilot
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false);
          setAiInitialQuery('');
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
        }}
        initialQuery={aiInitialQuery}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenAi={(q) => handleOpenAiWithQuery(q)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onHealAllNodes={handleHealAllNodes}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">QoEFlow Middlebox Platform</span>
            <span aria-hidden="true">·</span>
            <span>Software-Defined QoE for Regional ISPs & WISPs</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">⌘K</kbd> to search</span>
            <span aria-hidden="true">·</span>
            <span>Press <kbd className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">?</kbd> for help</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
