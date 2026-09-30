/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CpeNode } from '../types/index.ts';

interface CpeDetailsModalProps {
  node: CpeNode | null;
  onClose: () => void;
  onToggleAqm: (id: string) => void;
  onToggleGamerTier: (id: string) => void;
  onTriggerSelfHeal: (id: string) => void;
}

export const CpeDetailsModal: React.FC<CpeDetailsModalProps> = ({
  node,
  onClose,
  onToggleAqm,
  onToggleGamerTier,
  onTriggerSelfHeal
}) => {
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [healMessage, setHealMessage] = useState<string | null>(null);

  if (!node) return null;

  const handleSelfHealClick = () => {
    setIsHealing(true);
    setHealMessage('Running real-time AQM queue calibration & Wi-Fi spectrum audit...');
    setTimeout(() => {
      onTriggerSelfHeal(node.id);
      setIsHealing(false);
      setHealMessage('Optimized: CAKE triple-isolate configured. Loaded latency reduced to 16ms. Wi-Fi channel clear.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>{node.id}</span>
              <span aria-hidden="true">·</span>
              <span>{node.ipAddress}</span>
              <span aria-hidden="true">·</span>
              <span>{node.serviceType}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{node.subscriberName}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {healMessage && (
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-300 animate-in fade-in">
              {healMessage}
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Bufferbloat Grade</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{node.grade}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Loaded Latency</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">{node.loadedPingMs}ms</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Wi-Fi Quality</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{node.wifiHealthPercent}%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Auto-Healed Events</span>
              <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">{node.healingCount}</span>
            </div>
          </div>

          {/* Router Hardware & Middlebox Agent Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">CPE Hardware & Agent Firmware</h3>
            <div className="bg-slate-950 border border-white/5 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Router Hardware Model:</span>
                <span className="text-white font-medium">{node.cpeModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">QoEFlow Agent Core:</span>
                <span className="text-cyan-400 font-mono">{node.agentVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distribution Node:</span>
                <span className="text-slate-200">{node.regionNode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provisioned Plan:</span>
                <span className="text-slate-200">{node.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Queue Discipline:</span>
                <span className="font-mono text-white font-semibold uppercase">{node.algorithm}</span>
              </div>
            </div>
          </div>

          {/* Interactive Management Toggles */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Autonomous Middlebox Controls</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-white/5">
                <div>
                  <span className="text-sm font-semibold text-white block">Active Queue Management (CAKE)</span>
                  <span className="text-xs text-slate-400">Eliminates bufferbloat by shaping egress and isolating flows</span>
                </div>
                <button
                  onClick={() => onToggleAqm(node.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    node.aqmActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {node.aqmActive ? 'Enabled (CAKE)' : 'Disabled (FIFO)'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-white/5">
                <div>
                  <span className="text-sm font-semibold text-white block">Gamer & Low-Latency Tier (+$5/mo)</span>
                  <span className="text-xs text-slate-400">Prioritizes gaming UDP streams and Zoom RTP packets</span>
                </div>
                <button
                  onClick={() => onToggleGamerTier(node.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    node.gamerTierActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {node.gamerTierActive ? 'Active Addon' : 'Standard Tier'}
                </button>
              </div>
            </div>
          </div>

          {/* Linux tc Configuration Snippet */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Applied Linux Kernel tc / cake Command</h3>
              <span className="text-[11px] font-mono text-cyan-400">eBPF Hook Active</span>
            </div>
            <pre className="p-3 bg-slate-950 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{node.aqmActive ? (
`# Active CAKE qdisc on subscriber WAN interface
tc qdisc replace dev eth0.100 root cake \\
  bandwidth ${node.plan.split(' ')[0]}mbit \\
  diffserv4 \\
  triple-isolate \\
  ack-filter \\
  overhead 44`
) : (
`# Unmanaged legacy FIFO queue (bloat prone)
tc qdisc replace dev eth0.100 root pfifo_fast \\
  limit 1000`
)}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleSelfHealClick}
            disabled={isHealing}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-all cursor-pointer disabled:opacity-50"
          >
            {isHealing ? 'Calibrating...' : 'Trigger Instant Self-Healing'}
          </button>
        </div>
      </div>
    </div>
  );
};
