/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from '../types/index.ts';
import { 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  ShieldCheck, 
  DollarSign, 
  Smartphone, 
  Terminal, 
  X 
} from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenAi: (initialQuery?: string) => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenAi
}) => {
  const [activeHelpSection, setActiveHelpSection] = useState<'guide' | 'stuck' | 'glossary'>('stuck');
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const quickStuckActions = [
    {
      title: 'I want to see why 1 Gbps Fiber still lags on Zoom & Gaming',
      desc: 'Simulate saturated household downloads and watch latency jump from 14ms to 440ms without AQM.',
      tab: 'simulator' as TabType,
      icon: Activity,
      actionLabel: 'Open Speed Fallacy Lab'
    },
    {
      title: 'I want to calculate how much money my ISP saves on Truck Rolls',
      desc: 'Adjust your subscriber count ($1k - $50k) and truck roll costs ($50 - $150) to project annual ROI.',
      tab: 'calculator' as TabType,
      icon: DollarSign,
      actionLabel: 'Open ROI Calculator'
    },
    {
      title: 'I want to inspect live router queues & auto-heal congested nodes',
      desc: 'View real-time CPE devices, see how the software avoids truck rolls, and export CSV reports for QBR.',
      tab: 'fleet' as TabType,
      icon: ShieldCheck,
      actionLabel: 'Open Fleet Console'
    },
    {
      title: 'I want to see what subscribers get for the +$5/mo Gamer Addon',
      desc: 'Experience the white-label mobile app with instant 1-tap self-healing and device traffic prioritization.',
      tab: 'subscriber' as TabType,
      icon: Smartphone,
      actionLabel: 'Open Subscriber App'
    },
    {
      title: 'I need the exact Linux tc or LibreQoS config commands',
      desc: 'Generate production-ready CAKE, MikroTik RouterOS v7, and OpenWrt configuration snippets.',
      tab: 'architecture' as TabType,
      icon: Terminal,
      actionLabel: 'Open Config Generator'
    },
    {
      title: 'I want to pitch a 30-day pilot on 500 lines to management',
      desc: 'Review live side-by-side A/B trial metrics proving an 81% reduction in support tickets.',
      tab: 'pilot' as TabType,
      icon: Sliders,
      actionLabel: 'Open 30-Day Pilot'
    }
  ];

  const glossaryItems = [
    {
      term: 'Bufferbloat',
      def: 'High latency and jitter under network load caused by oversized, unmanaged packet buffers in consumer and edge routers. Creates standing queues that stall interactive packets (voice, video calls, gaming).'
    },
    {
      term: 'Active Queue Management (AQM)',
      def: 'Algorithms that proactively drop or mark packets before queue memory becomes bloated, signaling endpoints to throttle and preventing latency buildup.'
    },
    {
      term: 'CAKE (Common Applications Kept Enhanced)',
      def: 'The state-of-the-art Linux queue discipline (RFC 8290) featuring triple-isolate host fairness, DiffServ 4-tin classification, ACK filtering, and physical rate shaping.'
    },
    {
      term: 'FQ-CoDel (Fair Queuing Controlled Delay)',
      def: 'A modern queue algorithm that combines sub-flow hashing with a target delay threshold (typically 5ms) to prevent long buffer delays.'
    },
    {
      term: 'Roundtrips Per Minute (RPM)',
      def: 'An industry metric (popularized by Apple & IETF) measuring network responsiveness under working conditions. Higher is better (e.g. 3,500+ RPM in CAKE vs. 150 RPM in bloated FIFO).'
    },
    {
      term: 'Truck Roll',
      def: 'Dispatching a field technician in a physical vehicle to inspect a customer premises. Costs ISPs $50 to $150 per visit, often unnecessarily when the root cause is in-home bufferbloat or channel interference.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">QoEFlow Help & Navigation Center</h2>
              <p className="text-xs text-slate-400">Find exactly what you need or get AI-powered assistance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAi();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask AI Copilot</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close Help"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 px-6 bg-slate-950/30 gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveHelpSection('stuck')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeHelpSection === 'stuck'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            I'm Stuck / Quick Actions
          </button>
          <button
            onClick={() => setActiveHelpSection('guide')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeHelpSection === 'guide'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4-Step Guided Tour
          </button>
          <button
            onClick={() => setActiveHelpSection('glossary')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeHelpSection === 'glossary'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            QoE & Telecom Glossary
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Quick Actions if stuck */}
          {activeHelpSection === 'stuck' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300 mb-2">
                Click on any workflow below to navigate directly to the relevant dashboard:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickStuckActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        onNavigateTab(action.tab);
                        onClose();
                      }}
                      className="p-3.5 rounded-xl border border-white/5 bg-slate-950/50 hover:border-cyan-500/40 hover:bg-slate-950 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {action.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {action.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-cyan-400">
                        <span>{action.actionLabel}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: 4-Step Guided Tour */}
          {activeHelpSection === 'guide' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Step {activeStep} of 4
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <button
                      key={step}
                      onClick={() => setActiveStep(step)}
                      className={`w-6 h-6 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                        activeStep === step
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>

              {activeStep === 1 && (
                <div className="p-5 rounded-xl bg-slate-950 border border-white/5 space-y-3">
                  <h3 className="text-sm font-bold text-white">1. Understand the Speed Fallacy & Bufferbloat</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ISPs market raw gigabit speeds, but consumer routers have oversized buffers that build up massive packet queues during downloads. This causes ping to spike from 14ms to 400ms+, ruining Zoom and online games.
                  </p>
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        onNavigateTab('simulator');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Explore Simulator Tab
                    </button>
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="p-5 rounded-xl bg-slate-950 border border-white/5 space-y-3">
                  <h3 className="text-sm font-bold text-white">2. Monitor & Auto-Heal the Fleet</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In the <strong>ISP Operations</strong> console, inspect your subscriber CPE routers. Whenever bufferbloat or channel interference is detected, the software automatically tunes queue limits and DFS channels without sending a technician. You can also export a CSV report for your quarterly business review.
                  </p>
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        onNavigateTab('fleet');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Go to Fleet Console
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="p-5 rounded-xl bg-slate-950 border border-white/5 space-y-3">
                  <h3 className="text-sm font-bold text-white">3. Model ISP ROI & Truck Roll Savings</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Truck rolls cost $50 to $150 each. By slashing them by 38% and capturing the +$5/mo Gamer Mode addon, regional ISPs achieve a 300%+ ROI with payback in less than a month.
                  </p>
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        onNavigateTab('calculator');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Go to ROI Calculator
                    </button>
                    <button
                      onClick={() => setActiveStep(4)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="p-5 rounded-xl bg-slate-950 border border-white/5 space-y-3">
                  <h3 className="text-sm font-bold text-white">4. Deploy a 500-Subscriber Pilot</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Verify the impact with zero risk on 500 trial lines. Our A/B cohort telemetry proves support calls drop from 14.6 to 2.2 per 100 subscribers, converting trials into ongoing recurring SaaS contracts.
                  </p>
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        onNavigateTab('pilot');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Go to Pilot Onboarding
                    </button>
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Restart Tour ↺
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Glossary */}
          {activeHelpSection === 'glossary' && (
            <div className="space-y-3">
              {glossaryItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-xs font-bold text-cyan-300">{item.term}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{item.def}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Cmd + K</kbd> to open quick search anytime</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close Help
          </button>
        </div>
      </div>
    </div>
  );
};
