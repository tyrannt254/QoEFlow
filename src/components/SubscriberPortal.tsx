/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HouseholdDevice } from '../types/index.ts';
import { INITIAL_SUBSCRIBER_DEVICES } from '../data/mockData.ts';

export const SubscriberPortal: React.FC = () => {
  const [devices, setDevices] = useState<HouseholdDevice[]>(INITIAL_SUBSCRIBER_DEVICES);
  const [isGamerModeEnabled, setIsGamerModeEnabled] = useState<boolean>(true);
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixResult, setFixResult] = useState<string | null>(null);

  // Toggle device priority
  const cyclePriority = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextPriority: Record<HouseholdDevice['priorityLevel'], HouseholdDevice['priorityLevel']> = {
          ultra: 'high',
          high: 'normal',
          normal: 'background',
          background: 'ultra'
        };
        const next = nextPriority[d.priorityLevel];
        return {
          ...d,
          priorityLevel: next,
          currentLatencyMs: next === 'ultra' ? 14 : next === 'high' ? 18 : next === 'normal' ? 24 : 32
        };
      })
    );
  };

  const handleOneTapFix = () => {
    setIsFixing(true);
    setFixResult(null);

    setTimeout(() => {
      setIsFixing(false);
      setFixResult('Self-Healing Complete: Cleared 240 standing buffer packets, migrated 5GHz Wi-Fi from congested Ch 36 to DFS Ch 100. Latency settled at 14ms.');
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <span>B2B2C White-Label App</span>
            <span aria-hidden="true">·</span>
            <span>+$5.00/mo Revenue Share</span>
            <span aria-hidden="true">·</span>
            <span>Self-Service Deflection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2" style={{ textWrap: 'balance' }}>
            Subscriber Self-Service & "Gamer Mode" Addon
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            This is what end subscribers see in their ISP-branded mobile app. Instead of calling support when a game lags or Zoom freezes, subscribers manage device priorities and run 1-tap self-healing—unlocking high-margin revenue and deflecting support calls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile Viewport Simulation Frame (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl border-2 border-slate-700 bg-slate-950 p-4 shadow-2xl space-y-4">
            {/* Phone Top Notch */}
            <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400 font-mono">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">Wi-Fi 7</span>
                <span>100%</span>
              </div>
            </div>

            {/* Gateway Card with Real Hardware Image */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900">
              <img
                src="/src/assets/images/cpe_wifi_gateway_1790745759683.jpg"
                alt="ISP Home Wi-Fi 7 Gateway Router"
                referrerPolicy="no-referrer"
                className="w-full h-32 object-cover object-center"
              />
              <div className="p-2.5 bg-slate-950/90 border-t border-white/5 flex justify-between items-center text-[11px]">
                <span className="font-semibold text-white">Apex Home Wi-Fi 7 Router</span>
                <span className="font-mono text-emerald-400">Nominal · 14ms</span>
              </div>
            </div>

            {/* Gamer Mode Toggle Card */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">Ultra-Low Latency Mode</span>
                    <span className="text-[10px] bg-cyan-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                      +$5/mo
                    </span>
                  </div>
                  <span className="text-xs text-slate-300">Fast-tracks Gaming & Zoom UDP</span>
                </div>
                <button
                  onClick={() => setIsGamerModeEnabled(!isGamerModeEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isGamerModeEnabled ? 'bg-cyan-400' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle Gamer Mode"
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      isGamerModeEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 font-mono">
                <span className="text-slate-400">Gaming Ping:</span>
                <span className={isGamerModeEnabled ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {isGamerModeEnabled ? '14 ms (Zero Jitter)' : '320 ms (Bufferbloat)'}
                </span>
              </div>
            </div>

            {/* One-Tap Self Healing Button */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Connection Feeling Slow?</span>
                  <span className="text-[11px] text-slate-400">Automated queue flush & Wi-Fi channel tune</span>
                </div>
              </div>

              <button
                onClick={handleOneTapFix}
                disabled={isFixing}
                className="w-full py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isFixing ? 'Running Self-Healing...' : 'Run 1-Tap Home Fix'}
              </button>

              {fixResult && (
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
                  {fixResult}
                </div>
              )}
            </div>

            {/* Device Prioritization in Mobile */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Connected Devices ({devices.length})</span>
                <span className="text-[10px] text-cyan-400">Tap priority to cycle</span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    onClick={() => cyclePriority(device.id)}
                    className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-xs hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-white truncate max-w-[170px]">{device.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{device.ip}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                        {device.currentLatencyMs}ms
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        device.priorityLevel === 'ultra' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        device.priorityLevel === 'high' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        device.priorityLevel === 'normal' ? 'bg-slate-800 text-slate-300' :
                        'bg-slate-900 text-slate-500'
                      }`}>
                        {device.priorityLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Explanatory Content & Value Proposition (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">How B2B2C Generates Clean ISP Profit</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional ISPs lose money on customer support because the only tool the subscriber has is dialing a call center or threatening cancellation. With QoEFlow:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-slate-950 border border-white/5">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                  1. The $5/mo Gamer Upsell
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gamers and remote workers eagerly pay an extra $5/month for guaranteed single-digit latency under household load. 50% goes straight to the ISP with zero additional bandwidth infrastructure costs.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-white/5">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  2. 1-Tap Deflection vs. $110 Truck Roll
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a user clicks "1-Tap Fix", the CPE agent checks channel interference, flushes standing buffer queues, and validates modulation—fixing the issue in 2 seconds instead of dispatching a technician.
                </p>
              </div>
            </div>
          </div>

          {/* Under the Hood: DSCP & CAKE DiffServ Tins */}
          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Real-Time DSCP Classification & CAKE Tins</h3>
              <span className="text-xs font-mono text-cyan-400">RFC 4594 Compliant</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="text-slate-200">Tin 0: Real-Time / Voice (DSCP EF / CS6)</span>
                </div>
                <span className="text-cyan-400 tabular-nums">0ms buffer delay · Expedited</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-200">Tin 1: Interactive / Gaming (DSCP CS4 / AF41)</span>
                </div>
                <span className="text-emerald-400 tabular-nums">&lt;5ms target · Isolated</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="text-slate-200">Tin 2: Best Effort / Web (DSCP CS0 / Default)</span>
                </div>
                <span className="text-slate-400 tabular-nums">Fair queuing share</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="text-slate-200">Tin 3: Bulk / Cloud Backup (DSCP CS1 / Scavenger)</span>
                </div>
                <span className="text-purple-400 tabular-nums">Paced out behind interactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
