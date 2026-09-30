/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const PilotOnboarding: React.FC = () => {
  const [ispName, setIspName] = useState<string>('Cascadia Broadband & Wireless');
  const [targetNode, setTargetNode] = useState<string>('North Ridge Tower & West GPON Node');
  const [deploymentMethod, setDeploymentMethod] = useState<'core_bridge' | 'cpe_agent'>('core_bridge');
  const [trialStatus, setTrialStatus] = useState<'configuring' | 'active'>('active');
  const [activeDay, setActiveDay] = useState<number>(18); // Day 18 of 30-day trial

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <span>Execution Strategy</span>
            <span aria-hidden="true">·</span>
            <span>30-Day Risk-Free Trial</span>
            <span aria-hidden="true">·</span>
            <span>A/B Trial Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2" style={{ textWrap: 'balance' }}>
            500-Subscriber Proof of Concept Pilot
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Regional ISPs convert to long-term SaaS subscriptions by proving quantifiable support ticket deflection and truck roll elimination within 30 days. Run a side-by-side A/B trial comparing 500 managed subscribers against 500 unmanaged lines.
          </p>
        </div>
      </div>

      {/* Trial Status & Cohort A/B Scorecard */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Pilot Active: Day {activeDay} of 30
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Live A/B Cohort Performance Trial
            </h2>
            <p className="text-xs text-slate-400">
              ISP: <span className="text-slate-200 font-medium">{ispName}</span> · Target: <span className="text-slate-200 font-medium">{targetNode}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Trial Progress:</span>
            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full" style={{ width: `${(activeDay / 30) * 100}%` }}></div>
            </div>
            <span className="text-xs font-mono text-cyan-400 tabular-nums">{Math.round((activeDay / 30) * 100)}%</span>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Cohort A: QoEFlow Middlebox (500 Subs) */}
          <div className="p-5 rounded-xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-950 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Cohort A (Active Trial)</span>
                <h3 className="text-base font-bold text-white">500 QoEFlow Middlebox Subscribers</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-semibold border border-cyan-400/30">
                CAKE / eBPF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">Bufferbloat Grade A/A+</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">96.4%</span>
                <span className="text-[11px] text-slate-400 block mt-1">482 of 500 lines</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">Support Calls Received</span>
                <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">11 calls</span>
                <span className="text-[11px] text-slate-400 block mt-1">2.2 calls / 100 subs</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">Truck Rolls Dispatched</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">1 trip</span>
                <span className="text-[11px] text-slate-400 block mt-1">Deflected 14 dispatches</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">Customer NPS Score</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">+68 NPS</span>
                <span className="text-[11px] text-emerald-400 block mt-1">Delighted remote workers</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex justify-between items-center">
              <span>Estimated 18-Day Trial Savings:</span>
              <span className="font-mono font-bold text-sm tabular-nums">+$1,940 Net Saved</span>
            </div>
          </div>

          {/* Cohort B: Control Group (500 Subs) */}
          <div className="p-5 rounded-xl border border-white/10 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">Cohort B (Control Group)</span>
                <h3 className="text-base font-bold text-white">500 Unmanaged Standard Subscribers</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Default FIFO
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Bufferbloat Grade A/A+</span>
                <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">14.2%</span>
                <span className="text-[11px] text-slate-400 block mt-1">71 of 500 lines</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Support Calls Received</span>
                <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">68 calls</span>
                <span className="text-[11px] text-slate-400 block mt-1">13.6 calls / 100 subs</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Truck Rolls Dispatched</span>
                <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">15 trips</span>
                <span className="text-[11px] text-slate-400 block mt-1">$1,650 dispatch expense</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Customer NPS Score</span>
                <span className="text-2xl font-bold font-mono text-slate-300 tabular-nums">+12 NPS</span>
                <span className="text-[11px] text-rose-400 block mt-1">Complaints about lag/stutter</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-400 flex justify-between items-center">
              <span>Operational Dispatch Cost:</span>
              <span className="font-mono font-bold text-sm text-rose-400 tabular-nums">-$1,650 Incurred</span>
            </div>
          </div>
        </div>

        {/* Conversion Action */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Convert Pilot to Full Commercial Fleet</h4>
            <p className="text-xs text-slate-400">
              Expand from 500 trial lines to your full subscriber base at $0.35/sub/mo.
            </p>
          </div>
          <button
            onClick={() => alert('Pilot Conversion Proposal generated! Our regional ISP account team will provision your full network middlebox cluster.')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            Approve Full Fleet Rollout
          </button>
        </div>
      </div>

      {/* Deployment Workflow Guide */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">How a Regional ISP Launches in Under 24 Hours</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-950 border border-white/5 space-y-2">
            <span className="font-mono text-cyan-400 font-bold">Step 1</span>
            <div className="font-semibold text-white">Select Distribution Node</div>
            <p className="text-slate-400 leading-relaxed">
              Identify a single WISP sector tower or GPON OLT with 500 subscribers experiencing support call volume.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-white/5 space-y-2">
            <span className="font-mono text-cyan-400 font-bold">Step 2</span>
            <div className="font-semibold text-white">Insert Inline Shaper or Push Agent</div>
            <p className="text-slate-400 leading-relaxed">
              Bridge a 1U Linux appliance inline via eBPF/LibreQoS, or push the lightweight container agent to existing CPE routers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-white/5 space-y-2">
            <span className="font-mono text-cyan-400 font-bold">Step 3</span>
            <div className="font-semibold text-white">Automate & Monetize</div>
            <p className="text-slate-400 leading-relaxed">
              Watch truck rolls collapse by 38% and invite gamers to activate the $5/month low-latency priority toggle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
