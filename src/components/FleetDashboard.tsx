/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { CpeNode, SelfHealingEvent } from '../types/index.ts';
import { CpeDetailsModal } from './CpeDetailsModal.tsx';

interface FleetDashboardProps {
  fleetNodes: CpeNode[];
  selfHealingLog: SelfHealingEvent[];
  onToggleAqm: (id: string) => void;
  onToggleGamerTier: (id: string) => void;
  onTriggerSelfHeal: (id: string) => void;
  onHealAllNodes: () => void;
}

export const FleetDashboard: React.FC<FleetDashboardProps> = ({
  fleetNodes,
  selfHealingLog,
  onToggleAqm,
  onToggleGamerTier,
  onTriggerSelfHeal,
  onHealAllNodes
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeModalNode, setActiveModalNode] = useState<CpeNode | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownloadReport = () => {
    // Generate CSV for QBR (Quarterly Business Review)
    const headers = [
      'Event ID',
      'Timestamp',
      'CPE Device ID',
      'Subscriber Name',
      'Trigger Category',
      'Incident Diagnostics',
      'Autonomous Remediation Action',
      'Latency Before (ms)',
      'Latency After (ms)',
      'Latency Saved (ms)',
      'Truck Roll Deflected',
      'Estimated Savings (USD)'
    ];

    const escapeCsv = (str: string | number) => {
      const stringified = String(str);
      if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };

    const rows = selfHealingLog.map((event) => {
      const latencyDelta = event.latencyBeforeMs - event.latencyAfterMs;
      return [
        escapeCsv(event.id),
        escapeCsv(event.timestamp),
        escapeCsv(event.cpeId),
        escapeCsv(event.subscriber),
        escapeCsv(event.triggerType),
        escapeCsv(event.details),
        escapeCsv(event.actionTaken),
        escapeCsv(event.latencyBeforeMs),
        escapeCsv(event.latencyAfterMs),
        escapeCsv(latencyDelta),
        escapeCsv(event.truckRollAvoided ? 'YES' : 'NO'),
        escapeCsv(`$${event.estimatedCostSaved}`)
      ].join(',');
    });

    // Summary calculations for QBR
    const totalDispatchesAvoided = selfHealingLog.filter(e => e.truckRollAvoided).length;
    const totalSavings = selfHealingLog.reduce((acc, curr) => acc + curr.estimatedCostSaved, 0);

    const summaryBlock = [
      '',
      '--- QUARTERLY BUSINESS REVIEW SUMMARY ---',
      `Total Autonomous Self-Healing Actions,${selfHealingLog.length}`,
      `Total Field Truck Rolls Deflected,${totalDispatchesAvoided}`,
      `Total Direct Operational Cost Saved,$${totalSavings}`,
      `Average Latency Reduction Under Load,${Math.round(selfHealingLog.reduce((acc, curr) => acc + (curr.latencyBeforeMs - curr.latencyAfterMs), 0) / Math.max(1, selfHealingLog.length))} ms`,
      `Generated On,${new Date().toISOString()}`,
      ''
    ].join('\n');

    const csvContent = [headers.join(','), ...rows, summaryBlock].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `QoEFlow_QBR_Self_Healing_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Filtered nodes
  const filteredNodes = fleetNodes.filter((node) => {
    const matchesSearch = 
      node.subscriberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.regionNode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.ipAddress.includes(searchQuery);

    const matchesService = selectedService === 'all' || node.serviceType === selectedService;
    const matchesStatus = selectedStatus === 'all' || node.status === selectedStatus;

    return matchesSearch && matchesService && matchesStatus;
  });

  const totalTruckRollsSaved = selfHealingLog.filter(e => e.truckRollAvoided).length;
  const totalCostSaved = selfHealingLog.reduce((acc, curr) => acc + curr.estimatedCostSaved, 0);
  const attentionCount = fleetNodes.filter(n => n.status === 'attention').length;
  const gradeAPercent = Math.round((fleetNodes.filter(n => n.grade === 'A+' || n.grade === 'A').length / fleetNodes.length) * 100);

  return (
    <div className="space-y-8">
      {/* Fleet KPI Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-white/10 bg-slate-900/60 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Fleet Subscribers</span>
            <span className="text-emerald-400 font-mono">14,250 Total</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {fleetNodes.length.toLocaleString()} Active
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{gradeAPercent}%</span>
            <span>Bufferbloat Grade A/A+</span>
          </div>
        </div>

        <div className="border border-white/10 bg-slate-900/60 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Truck Rolls Avoided</span>
            <span className="text-cyan-400 font-mono">This Month</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
            {totalTruckRollsSaved * 14 + 18} Dispatches
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Resolved via software self-healing
          </div>
        </div>

        <div className="border border-white/10 bg-slate-900/60 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Dispatch Cost Savings</span>
            <span className="text-emerald-400 font-mono tabular-nums">+$110/trip</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
            ${(totalCostSaved * 12 + 2450).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Direct operational field savings
          </div>
        </div>

        <div className="border border-white/10 bg-slate-900/60 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Gamer Addon Upsell</span>
            <span className="text-cyan-300 font-mono">50/50 Split</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            $3,027 <span className="text-xs font-normal text-slate-400">/mo net</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            1,211 active +$5/mo low-latency subs
          </div>
        </div>
      </div>

      {/* Main Section: Subscriber CPE Fleet Management */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <span>B2B Middlebox Fleet</span>
              <span aria-hidden="true">·</span>
              <span>Predictive QoE Diagnostics</span>
            </div>
            <h2 className="text-xl font-bold text-white">Subscriber CPE Edge Nodes</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              title="Export CSV report of all self-healing actions and truck rolls avoided for QBR"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Report Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Report (CSV)</span>
                </>
              )}
            </button>

            {attentionCount > 0 && (
              <button
                onClick={onHealAllNodes}
                className="px-3 py-1.5 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/30 transition-all cursor-pointer whitespace-nowrap"
              >
                Auto-Heal {attentionCount} Attention Nodes
              </button>
            )}
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              Showing {filteredNodes.length} of {fleetNodes.length} nodes
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search subscriber, IP, router model, or node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">All Service Types</option>
              <option value="Fiber GPON">Fiber GPON</option>
              <option value="Fixed Wireless (WISP)">Fixed Wireless (WISP)</option>
              <option value="Cable DOCSIS">Cable DOCSIS</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-950 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="nominal">Nominal (A/A+)</option>
              <option value="mitigating">Mitigating</option>
              <option value="attention">Needs Attention</option>
            </select>
          </div>
        </div>

        {/* Fleet Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-white/10 uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="py-3 px-4">Subscriber / CPE</th>
                <th className="py-3 px-4">Service & Node</th>
                <th className="py-3 px-4 text-right">Idle Ping</th>
                <th className="py-3 px-4 text-right">Loaded Latency</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">AQM Shaper</th>
                <th className="py-3 px-4 text-center">Gamer Tier</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredNodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No subscriber CPE nodes matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredNodes.map((node) => (
                  <tr 
                    key={node.id} 
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => setActiveModalNode(node)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {node.subscriberName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {node.id} · {node.ipAddress}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{node.plan}</div>
                      <div className="text-[11px] text-slate-400">{node.regionNode}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                      {node.unloadedPingMs}ms
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span className={node.loadedPingMs > 100 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                        {node.loadedPingMs}ms
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        node.grade === 'A+' ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/30' :
                        node.grade === 'A' ? 'text-teal-300 bg-teal-950/40 border border-teal-500/30' :
                        node.grade === 'B' ? 'text-amber-300 bg-amber-950/40 border border-amber-500/30' :
                        'text-rose-300 bg-rose-950/40 border border-rose-500/30'
                      }`}>
                        {node.grade}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleAqm(node.id);
                        }}
                        className={`text-[11px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${
                          node.aqmActive
                            ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                            : 'text-slate-400 bg-slate-900 border border-white/5 hover:text-white'
                        }`}
                      >
                        {node.aqmActive ? 'CAKE' : 'FIFO'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleGamerTier(node.id);
                        }}
                        className={`text-[11px] font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                          node.gamerTierActive
                            ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/30'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {node.gamerTierActive ? '+$5 Active' : 'Standard'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalNode(node);
                        }}
                        className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Autonomous Self-Healing Real-Time Feed */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <span>Autonomous Remediation</span>
              <span aria-hidden="true">·</span>
              <span>Zero Human Intervention</span>
            </div>
            <h2 className="text-lg font-bold text-white">Live Self-Healing & Ticket Deflection Log</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time eBPF Telemetry
            </span>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-white/10 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download QBR Log</span>
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {selfHealingLog.map((event) => (
            <div 
              key={event.id}
              className="p-4 rounded-lg bg-slate-950 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-semibold">{event.cpeId}</span>
                  <span className="text-slate-400">({event.subscriber})</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500 font-mono">{event.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-rose-400 line-through tabular-nums">{event.latencyBeforeMs}ms</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{event.latencyAfterMs}ms</span>
                  <span className="ml-2 text-[11px] text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Truck Roll Deflected (${event.estimatedCostSaved} Saved)
                  </span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                <span className="font-medium text-slate-200">Trigger: </span>
                {event.details}
              </p>

              <div className="mt-2 text-xs font-mono text-cyan-300/90 bg-cyan-950/20 p-2 rounded border border-cyan-500/20">
                <span className="text-cyan-400 font-semibold">Autonomous Fix: </span>
                {event.actionTaken}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Inspector */}
      {activeModalNode && (
        <CpeDetailsModal
          node={activeModalNode}
          onClose={() => setActiveModalNode(null)}
          onToggleAqm={onToggleAqm}
          onToggleGamerTier={onToggleGamerTier}
          onTriggerSelfHeal={onTriggerSelfHeal}
        />
      )}
    </div>
  );
};
