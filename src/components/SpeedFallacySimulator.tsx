/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { QueueAlgorithm, Packet, SimulationMetrics } from '../types/index.ts';

export const SpeedFallacySimulator: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<QueueAlgorithm>('fifo');
  const [linkBandwidth, setLinkBandwidth] = useState<number>(500); // Mbps
  const [isSteamDownloading, setIsSteamDownloading] = useState<boolean>(true);
  const [isCloudBackupRunning, setIsCloudBackupRunning] = useState<boolean>(true);
  const [is4KStreaming, setIs4KStreaming] = useState<boolean>(true);
  const [isGamingActive, setIsGamingActive] = useState<boolean>(true);
  const [isZoomCallActive, setIsZoomCallActive] = useState<boolean>(true);
  
  // Test runner state
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'unloaded' | 'download_load' | 'upload_load' | 'complete'>('idle');
  const [testProgress, setTestProgress] = useState<number>(0);

  // Live simulation metrics
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    unloadedPingMs: 14,
    downloadLatencyMs: 385,
    uploadLatencyMs: 442,
    downloadBandwidthMbps: 485,
    uploadBandwidthMbps: 48,
    bufferbloatGrade: 'F',
    roundtripsPerMinute: 135,
    packetLossPercent: 4.8,
    jitterMs: 148,
    queueDepthPackets: 284,
    queueStandingTimeMs: 410
  });

  // Recent packets for queue visualizer
  const [activePackets, setActivePackets] = useState<Packet[]>([]);
  const packetCounterRef = useRef(0);

  // Recalculate metrics whenever algorithm or traffic changes
  useEffect(() => {
    let loadFactor = 0;
    if (isSteamDownloading) loadFactor += 0.5;
    if (isCloudBackupRunning) loadFactor += 0.3;
    if (is4KStreaming) loadFactor += 0.2;
    if (isGamingActive) loadFactor += 0.05;
    if (isZoomCallActive) loadFactor += 0.05;

    const basePing = 14;

    if (algorithm === 'fifo') {
      // High standing queue under load
      const addedDelay = Math.round(loadFactor * 460);
      const dlLatency = basePing + addedDelay;
      const ulLatency = basePing + Math.round(addedDelay * 1.15);
      const jitter = Math.round(addedDelay * 0.35);
      const queueDepth = Math.round(loadFactor * 320);
      const packetLoss = loadFactor > 0.6 ? +(loadFactor * 5.2).toFixed(1) : 0.8;
      
      // RPM calculation: 60,000 / avg_latency
      const avgLatency = (dlLatency + ulLatency) / 2;
      const rpm = Math.round(60000 / Math.max(20, avgLatency));

      let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
      if (addedDelay < 10) grade = 'A+';
      else if (addedDelay < 30) grade = 'A';
      else if (addedDelay < 70) grade = 'B';
      else if (addedDelay < 150) grade = 'C';
      else if (addedDelay < 250) grade = 'D';
      else grade = 'F';

      setMetrics({
        unloadedPingMs: basePing,
        downloadLatencyMs: dlLatency,
        uploadLatencyMs: ulLatency,
        downloadBandwidthMbps: Math.min(linkBandwidth, Math.round(linkBandwidth * 0.98)),
        uploadBandwidthMbps: Math.round(linkBandwidth * 0.1),
        bufferbloatGrade: grade,
        roundtripsPerMinute: rpm,
        packetLossPercent: packetLoss,
        jitterMs: jitter,
        queueDepthPackets: queueDepth,
        queueStandingTimeMs: addedDelay
      });
    } else if (algorithm === 'fq_codel') {
      // CoDel drops packets early to prevent standing queues, separates flows
      const addedDelay = Math.min(22, Math.round(loadFactor * 16));
      const dlLatency = basePing + addedDelay;
      const ulLatency = basePing + Math.round(addedDelay * 1.1);
      const jitter = 4;
      const queueDepth = Math.round(loadFactor * 24);
      const avgLatency = (dlLatency + ulLatency) / 2;
      const rpm = Math.round(60000 / avgLatency);

      setMetrics({
        unloadedPingMs: basePing,
        downloadLatencyMs: dlLatency,
        uploadLatencyMs: ulLatency,
        downloadBandwidthMbps: Math.min(linkBandwidth, Math.round(linkBandwidth * 0.94)),
        uploadBandwidthMbps: Math.round(linkBandwidth * 0.095),
        bufferbloatGrade: 'A',
        roundtripsPerMinute: rpm,
        packetLossPercent: 0.1,
        jitterMs: jitter,
        queueDepthPackets: queueDepth,
        queueStandingTimeMs: addedDelay
      });
    } else {
      // CAKE - pristine host fairness, ACK filter, diffserv
      const addedDelay = Math.min(6, Math.round(loadFactor * 5));
      const dlLatency = basePing + addedDelay;
      const ulLatency = basePing + addedDelay;
      const jitter = 1.8;
      const queueDepth = Math.round(loadFactor * 12);
      const avgLatency = (dlLatency + ulLatency) / 2;
      const rpm = Math.round(60000 / avgLatency);

      setMetrics({
        unloadedPingMs: basePing,
        downloadLatencyMs: dlLatency,
        uploadLatencyMs: ulLatency,
        downloadBandwidthMbps: Math.min(linkBandwidth, Math.round(linkBandwidth * 0.95)),
        uploadBandwidthMbps: Math.round(linkBandwidth * 0.096),
        bufferbloatGrade: 'A+',
        roundtripsPerMinute: rpm,
        packetLossPercent: 0.0,
        jitterMs: jitter,
        queueDepthPackets: queueDepth,
        queueStandingTimeMs: addedDelay
      });
    }
  }, [algorithm, linkBandwidth, isSteamDownloading, isCloudBackupRunning, is4KStreaming, isGamingActive, isZoomCallActive]);

  // Animated packet generator loop
  useEffect(() => {
    const interval = setInterval(() => {
      packetCounterRef.current += 1;
      const id = `pkt-${packetCounterRef.current}`;
      
      const candidates: { type: Packet['type']; label: string; priority: Packet['priority']; color: string }[] = [];
      if (isGamingActive) candidates.push({ type: 'gaming', label: 'CS2 Tick (UDP)', priority: 'realtime', color: 'bg-emerald-400' });
      if (isZoomCallActive) candidates.push({ type: 'voip', label: 'Zoom Audio (RTP)', priority: 'interactive', color: 'bg-cyan-400' });
      if (is4KStreaming) candidates.push({ type: 'streaming', label: 'Netflix 4K (TCP)', priority: 'best_effort', color: 'bg-amber-400' });
      if (isSteamDownloading) candidates.push({ type: 'bulk_download', label: 'Steam 90GB (TCP)', priority: 'bulk', color: 'bg-indigo-400' });
      if (isCloudBackupRunning) candidates.push({ type: 'cloud_backup', label: 'iCloud Photos (TCP)', priority: 'bulk', color: 'bg-purple-400' });

      if (candidates.length === 0) return;

      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      const newPacket: Packet = {
        id,
        type: randomCandidate.type,
        label: randomCandidate.label,
        sizeBytes: randomCandidate.priority === 'realtime' ? 64 : randomCandidate.priority === 'interactive' ? 120 : 1480,
        flowId: Math.floor(Math.random() * 8),
        priority: randomCandidate.priority,
        queueTimeMs: algorithm === 'fifo' ? (randomCandidate.priority === 'realtime' ? 380 : 420) : (randomCandidate.priority === 'realtime' ? 2 : 12),
        isDropped: algorithm === 'fifo' && Math.random() < 0.08,
        color: randomCandidate.color
      };

      setActivePackets((prev) => [newPacket, ...prev.slice(0, 14)]);
    }, 450);

    return () => clearInterval(interval);
  }, [algorithm, isGamingActive, isZoomCallActive, is4KStreaming, isSteamDownloading, isCloudBackupRunning]);

  // Run full loaded latency test benchmark
  const runBufferbloatTest = () => {
    setIsTesting(true);
    setTestPhase('unloaded');
    setTestProgress(10);

    setTimeout(() => {
      setTestPhase('download_load');
      setTestProgress(45);
    }, 1800);

    setTimeout(() => {
      setTestPhase('upload_load');
      setTestProgress(80);
    }, 3600);

    setTimeout(() => {
      setTestPhase('complete');
      setTestProgress(100);
      setIsTesting(false);
    }, 5200);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
      case 'A': return 'text-teal-400 border-teal-500/40 bg-teal-950/30';
      case 'B': return 'text-amber-300 border-amber-500/40 bg-amber-950/30';
      case 'C': return 'text-amber-500 border-amber-500/40 bg-amber-950/30';
      case 'D': return 'text-orange-500 border-orange-500/40 bg-orange-950/30';
      case 'F': return 'text-rose-500 border-rose-500/40 bg-rose-950/30';
      default: return 'text-slate-400 border-slate-700 bg-slate-900/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Explainer Hero */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <span>The Speed Fallacy</span>
            <span aria-hidden="true">·</span>
            <span>Unmanaged Bufferbloat</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time AQM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3" style={{ textWrap: 'balance' }}>
            Why 1 Gbps Fiber Still Feels Laggy Under Load
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Standard ISP speed tests measure raw, unloaded bandwidth. But when a household streams 4K video, backs up photos, or downloads a game, consumer router buffers fill up with hundreds of megabytes of packets. This creates standing queues, spiking latency from 14ms to 400ms+ and causing Zoom calls and online gaming to stutter.
          </p>
        </div>

        {/* Visual Comparison: FIFO vs CAKE */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border transition-all ${
            algorithm === 'fifo' 
              ? 'bg-rose-950/20 border-rose-500/40' 
              : 'bg-slate-950/40 border-white/5 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-rose-300">Legacy ISP Router (FIFO / DropTail)</span>
              <span className="text-xs font-mono text-rose-400 tabular-nums">Latency: +380ms under load</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              One giant buffer holds every packet. Small interactive packets (Zoom audio, game ticks) wait behind massive 1500-byte video and download blocks.
            </p>
            <div className="mt-3 flex items-center gap-1.5 overflow-hidden h-6 bg-slate-900 rounded px-1.5">
              <div className="h-3.5 bg-indigo-500/80 w-24 rounded-xs" title="Bulk Steam Download" />
              <div className="h-3.5 bg-indigo-500/80 w-32 rounded-xs" title="Bulk Steam Download" />
              <div className="h-3.5 bg-purple-500/80 w-20 rounded-xs" title="Cloud Backup" />
              <div className="h-3.5 bg-rose-500 w-3 rounded-xs animate-pulse" title="Blocked Zoom Packet!" />
              <div className="h-3.5 bg-indigo-500/80 w-16 rounded-xs" />
            </div>
          </div>

          <div className={`p-4 rounded-lg border transition-all ${
            algorithm === 'cake' 
              ? 'bg-emerald-950/20 border-emerald-500/40' 
              : 'bg-slate-950/40 border-white/5 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-emerald-300">QoEFlow Middlebox (CAKE AQM)</span>
              <span className="text-xs font-mono text-emerald-400 tabular-nums">Latency: +5ms under load</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              DiffServ flow hashing separates streams. Real-time voice and gaming packets pass instantly through prioritized lanes without standing queue delays.
            </p>
            <div className="mt-3 flex items-center gap-1.5 overflow-hidden h-6 bg-slate-900 rounded px-1.5">
              <div className="h-3.5 bg-emerald-400 w-3 rounded-xs shadow-xs" title="Real-time Game Packet (Fast-track)" />
              <div className="h-3.5 bg-cyan-400 w-4 rounded-xs shadow-xs" title="Zoom Audio RTP (Fast-track)" />
              <div className="h-3.5 bg-indigo-500/40 w-16 rounded-xs" />
              <div className="h-3.5 bg-emerald-400 w-3 rounded-xs shadow-xs" />
              <div className="h-3.5 bg-purple-500/40 w-14 rounded-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Live Queuing Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-1 border border-white/10 bg-slate-900/60 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Queue Management Algorithm</h2>
            <p className="text-xs text-slate-400 mb-3">Select the active middlebox shaping algorithm:</p>
            
            <div className="space-y-2">
              <button
                onClick={() => setAlgorithm('fifo')}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  algorithm === 'fifo'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">1. Standard FIFO (No AQM)</span>
                  <span className="text-xs font-mono text-rose-400">Default Router</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Oversized buffer, zero flow isolation. Saturated queues spike latency.</p>
              </button>

              <button
                onClick={() => setAlgorithm('fq_codel')}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  algorithm === 'fq_codel'
                    ? 'border-teal-500 bg-teal-500/10 text-white'
                    : 'border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">2. FQ-CoDel (RFC 8290)</span>
                  <span className="text-xs font-mono text-teal-400">Standard AQM</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Fair queuing + controlled delay. Prevents buffer bloat by dropping stale TCP packets.</p>
              </button>

              <button
                onClick={() => setAlgorithm('cake')}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  algorithm === 'cake'
                    ? 'border-cyan-400 bg-cyan-400/10 text-white shadow-sm shadow-cyan-500/10'
                    : 'border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">3. CAKE (QoEFlow Optimized)</span>
                  <span className="text-xs font-mono text-cyan-300">Enterprise AQM</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Common Applications Kept Enhanced. DiffServ parsing, ACK filtering, triple host isolation.</p>
              </button>
            </div>
          </div>

          <div className="border-t border-white/5 pt-5">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="bandwidth-slider" className="text-xs font-medium text-slate-300">Subscriber Provisioned Speed</label>
              <span className="text-xs font-mono text-cyan-400 tabular-nums">{linkBandwidth} Mbps</span>
            </div>
            <input
              id="bandwidth-slider"
              type="range"
              min="50"
              max="1000"
              step="50"
              value={linkBandwidth}
              onChange={(e) => setLinkBandwidth(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>50 Mbps (WISP)</span>
              <span>500 Mbps</span>
              <span>1 Gbps (Fiber)</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Simulate Household Traffic Load</h3>
            
            <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                Steam Game Download (Bulk 90 GB)
              </span>
              <input
                type="checkbox"
                checked={isSteamDownloading}
                onChange={(e) => setIsSteamDownloading(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                iCloud / Google Photos Backup (Uplink)
              </span>
              <input
                type="checkbox"
                checked={isCloudBackupRunning}
                onChange={(e) => setIsCloudBackupRunning(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                Netflix 4K HDR Stream (Living Room)
              </span>
              <input
                type="checkbox"
                checked={is4KStreaming}
                onChange={(e) => setIs4KStreaming(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                CS2 / Valorant Gaming Stream (UDP)
              </span>
              <input
                type="checkbox"
                checked={isGamingActive}
                onChange={(e) => setIsGamingActive(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                Remote Work Zoom Video Call (WebRTC)
              </span>
              <input
                type="checkbox"
                checked={isZoomCallActive}
                onChange={(e) => setIsZoomCallActive(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right 2 Columns: Live Scorecard & Real-Time Queue Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bufferbloat Scorecard */}
          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Diagnostic Scorecard</span>
                <h2 className="text-xl font-bold text-white">Bufferbloat & Loaded Latency Audit</h2>
              </div>
              <button
                onClick={runBufferbloatTest}
                disabled={isTesting}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isTesting ? `Running Audit (${testProgress}%)...` : 'Run 10s Bufferbloat Audit'}
              </button>
            </div>

            {/* Test progress indicator */}
            {isTesting && (
              <div className="my-4 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex justify-between text-xs text-cyan-300 font-mono mb-1">
                  <span>Phase: {testPhase.replace('_', ' ').toUpperCase()}</span>
                  <span>{testProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${testProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {/* Bufferbloat Grade */}
              <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getGradeColor(metrics.bufferbloatGrade)}`}>
                <span className="text-xs uppercase font-medium text-slate-400 mb-1">Bufferbloat Grade</span>
                <span className="text-4xl font-black font-mono tracking-tight">{metrics.bufferbloatGrade}</span>
                <span className="text-[11px] mt-1 opacity-80">
                  {metrics.bufferbloatGrade === 'A+' ? 'Zero Standing Delay' : metrics.bufferbloatGrade === 'A' ? 'Minimal Jitter' : 'Severe Congestion'}
                </span>
              </div>

              {/* Unloaded vs Loaded Ping */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Unloaded Latency</span>
                  <span className="text-2xl font-bold font-mono text-white tabular-nums">{metrics.unloadedPingMs}</span>
                  <span className="text-xs text-slate-400 ml-1">ms</span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                  Baseline idle fiber ping
                </div>
              </div>

              {/* Loaded Download Latency */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Download Under Load</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold font-mono tabular-nums ${
                      metrics.downloadLatencyMs > 100 ? 'text-rose-400' : metrics.downloadLatencyMs > 30 ? 'text-amber-300' : 'text-emerald-400'
                    }`}>
                      {metrics.downloadLatencyMs}
                    </span>
                    <span className="text-xs text-slate-400">ms</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/5 text-xs font-mono text-slate-400 tabular-nums">
                  +{metrics.downloadLatencyMs - metrics.unloadedPingMs}ms queue delay
                </div>
              </div>

              {/* Loaded Upload Latency */}
              <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Upload Under Load</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold font-mono tabular-nums ${
                      metrics.uploadLatencyMs > 100 ? 'text-rose-400' : metrics.uploadLatencyMs > 30 ? 'text-amber-300' : 'text-emerald-400'
                    }`}>
                      {metrics.uploadLatencyMs}
                    </span>
                    <span className="text-xs text-slate-400">ms</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/5 text-xs font-mono text-slate-400 tabular-nums">
                  +{metrics.uploadLatencyMs - metrics.unloadedPingMs}ms queue delay
                </div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
              <div>
                <span className="text-xs text-slate-400 block">Roundtrips/Min (RPM)</span>
                <span className="text-base font-semibold font-mono text-slate-200 tabular-nums">
                  {metrics.roundtripsPerMinute.toLocaleString()} RPM
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Queue Standing Delay</span>
                <span className="text-base font-semibold font-mono text-slate-200 tabular-nums">
                  {metrics.queueStandingTimeMs} ms
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Jitter Variance</span>
                <span className="text-base font-semibold font-mono text-slate-200 tabular-nums">
                  ±{metrics.jitterMs} ms
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Queue Packet Depth</span>
                <span className="text-base font-semibold font-mono text-slate-200 tabular-nums">
                  {metrics.queueDepthPackets} pkts
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Packet Queuing Visualizer */}
          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Live Router Queue Inspection</h3>
                <p className="text-xs text-slate-400">Real-time packet arrival, queue scheduling, and flow egress</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Real-time
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Voice
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Bulk TCP
                </span>
              </div>
            </div>

            {/* Queue Visualization Rail */}
            <div className="relative bg-slate-950 border border-white/5 rounded-lg p-4">
              <div className="text-[11px] font-mono text-slate-500 mb-2 flex justify-between">
                <span>Ingress Flow Buffer (Incoming)</span>
                <span>Router Egress to ISP Uplink</span>
              </div>

              {/* Queue Packets */}
              <div className="flex items-center gap-2 overflow-x-auto py-2 min-h-16">
                {activePackets.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-4">No active traffic packets generated yet...</div>
                ) : (
                  activePackets.map((pkt) => (
                    <div
                      key={pkt.id}
                      className={`shrink-0 p-2 rounded border text-xs font-mono transition-all ${
                        pkt.isDropped 
                          ? 'border-rose-500/50 bg-rose-950/40 text-rose-300 line-through' 
                          : 'border-white/10 bg-slate-900 text-slate-200'
                      }`}
                      style={{ width: '130px' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`w-2 h-2 rounded-full ${pkt.color}`} />
                        <span className="text-[10px] text-slate-400 tabular-nums">{pkt.sizeBytes}B</span>
                      </div>
                      <div className="text-[11px] truncate font-medium text-white">{pkt.label}</div>
                      <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                        <span>Delay:</span>
                        <span className={pkt.queueTimeMs > 100 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                          {pkt.queueTimeMs}ms
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Router mechanism caption */}
              <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
                <div>
                  <span className="font-semibold text-slate-300">Active Discipline: </span>
                  {algorithm === 'fifo' && 'pfifo_fast (Single Queue, 1000 pkt buffer, drop-tail)'}
                  {algorithm === 'fq_codel' && 'fq_codel (Fair queuing across 1024 flow buckets, 5ms target delay)'}
                  {algorithm === 'cake' && 'cake diffserv4 (Bandwidth shaping, ACK filter, host triple-isolate)'}
                </div>
                <div className="font-mono text-cyan-400 tabular-nums">
                  Throughput: {metrics.downloadBandwidthMbps} Mbps
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
