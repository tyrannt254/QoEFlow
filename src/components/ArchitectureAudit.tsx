/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const ArchitectureAudit: React.FC = () => {
  const [activeConfigTab, setActiveConfigTab] = useState<'linux_cake' | 'libreqos' | 'mikrotik' | 'openwrt'>('linux_cake');
  const [bandwidthMb, setBandwidthMb] = useState<number>(500);
  const [overheadType, setOverheadType] = useState<string>('ethernet_vlan');

  const getGeneratedConfig = () => {
    switch (activeConfigTab) {
      case 'linux_cake':
        return `# -------------------------------------------------------------
# Linux Kernel Active Queue Management via CAKE (RFC 8290)
# Applied at ISP Core Edge or Subscriber Gateway (eth0)
# -------------------------------------------------------------
sudo ip link set dev eth0 up

# Replace existing pfifo_fast / drop-tail queue with CAKE
sudo tc qdisc replace dev eth0 root cake \\
  bandwidth ${bandwidthMb}mbit \\
  diffserv4 \\
  triple-isolate \\
  ack-filter \\
  ${overheadType === 'ethernet_vlan' ? 'overhead 44' : overheadType === 'pppoe' ? 'overhead 40' : 'overhead 18'} \\
  nat \\
  wash

# Verify live queue statistics, dropped packets, and tin backlogs
tc -s qdisc show dev eth0`;

      case 'libreqos':
        return `# -------------------------------------------------------------
# LibreQoS v2.x Integration (ISP Core Inline Shaper)
# eBPF / XDP Architecture with CAKE qdisc
# -------------------------------------------------------------
[isp_network]
shaper_interface_in = "eth1"
shaper_interface_out = "eth2"
default_algorithm = "cake"
diffserv_profile = "diffserv4"
auto_rtt = true

[circuit_500m]
circuit_id = "CRKT-08492"
rate_down = "${bandwidthMb}mbit"
rate_up = "${Math.round(bandwidthMb * 0.2)}mbit"
overhead = "vlan"
target_ip = "100.64.14.88"
enable_ack_filter = true`;

      case 'mikrotik':
        return `# -------------------------------------------------------------
# MikroTik RouterOS v7.x CAKE Queue Setup
# -------------------------------------------------------------
/queue type
add name="qoe-cake-down" kind=cake \\
  cake-bandwidth=${bandwidthMb}M \\
  cake-diffserv=diffserv4 \\
  cake-flowmode=triple-isolate \\
  cake-ack-filter=filter \\
  cake-nat=yes

/queue simple
add name="sub-wan-queue" target=ether1 \\
  max-limit=${Math.round(bandwidthMb * 0.2)}M/${bandwidthMb}M \\
  queue=qoe-cake-down/qoe-cake-down`;

      case 'openwrt':
        return `# -------------------------------------------------------------
# OpenWrt SQM (Smart Queue Management) Configuration
# /etc/config/sqm
# -------------------------------------------------------------
config queue 'eth1'
  option enabled '1'
  option interface 'eth1'
  option download '${bandwidthMb * 1000}'
  option upload '${Math.round(bandwidthMb * 200)}'
  option qdisc 'cake'
  option script 'layer_cake.qos'
  option qdisc_advanced '1'
  option linklayer 'ethernet'
  option overhead '44'
  option diffserv 'diffserv4'`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <span>Architecture & Standards</span>
            <span aria-hidden="true">·</span>
            <span>Linux eBPF & CAKE</span>
            <span aria-hidden="true">·</span>
            <span>Turnkey Audit Consulting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2" style={{ textWrap: 'balance' }}>
            Middlebox Software Architecture & Open-Source Core
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            QoEFlow leverages battle-tested, high-throughput queueing technologies (Linux kernel eBPF, LibreQoS drivers, and RFC 8290 CAKE) wrapped in a proprietary automated self-healing and remote subscriber management layer.
          </p>
        </div>
      </div>

      {/* Middlebox Hardware & 3-Tier Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 rounded-xl overflow-hidden border border-white/10 bg-slate-900/60 relative group">
          <img
            src="/src/assets/images/middlebox_hardware_appliance_1790745749409.jpg"
            alt="QoEFlow 1U Telecom Middlebox Server Appliance"
            referrerPolicy="no-referrer"
            className="w-full h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="p-3 bg-slate-950/90 border-t border-white/5 flex justify-between items-center text-xs">
            <span className="font-mono text-cyan-400">QoEFlow-100G Edge Appliance</span>
            <span className="text-[11px] text-slate-400">10G/40G/100G eBPF</span>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold">Tier 1</span>
              <span className="text-[11px] text-slate-400">ISP Edge Bridge</span>
            </div>
            <h2 className="text-sm font-bold text-white">Core Inline Shaper (eBPF)</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridges 10G/40G/100G links on commodity 1U Linux hardware. Classifies micro-flows with LibreQoS and XDP without CPU bottlenecks.
            </p>
          </div>

          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-semibold">Tier 2</span>
              <span className="text-[11px] text-slate-400">Customer Gateway</span>
            </div>
            <h2 className="text-sm font-bold text-white">CPE Firmware Agent</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lightweight C/Go daemon embedded in OpenWrt, MikroTik, or TR-069 containers to shape upstream queues and tune Wi-Fi airtime.
            </p>
          </div>

          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 font-semibold">Tier 3</span>
              <span className="text-[11px] text-slate-400">Cloud Orchestrator</span>
            </div>
            <h2 className="text-sm font-bold text-white">Self-Healing Controller</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Telemetry collector analyzing loaded latency and Wi-Fi interference. Automatically mitigates bufferbloat and powers B2B2C apps.
            </p>
          </div>
        </div>
      </div>

      {/* Production Configuration Generator for ISP Engineers */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Engineering Tooling</span>
            <h3 className="text-lg font-bold text-white">Kernel & Router Config Generator</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <label htmlFor="cfg-speed" className="text-slate-400">Target Speed:</label>
              <select
                id="cfg-speed"
                value={bandwidthMb}
                onChange={(e) => setBandwidthMb(Number(e.target.value))}
                className="bg-slate-950 border border-white/10 rounded px-2 py-1 text-slate-200 text-xs font-mono cursor-pointer"
              >
                <option value={100}>100 Mbps</option>
                <option value={250}>250 Mbps</option>
                <option value={500}>500 Mbps</option>
                <option value={1000}>1 Gbps</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <label htmlFor="cfg-overhead" className="text-slate-400">Overhead Framing:</label>
              <select
                id="cfg-overhead"
                value={overheadType}
                onChange={(e) => setOverheadType(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded px-2 py-1 text-slate-200 text-xs font-mono cursor-pointer"
              >
                <option value="ethernet_vlan">Ethernet + VLAN (44B)</option>
                <option value="pppoe">PPPoE (40B)</option>
                <option value="raw">Raw IP (18B)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Config Tabs */}
        <div className="mt-4 flex gap-2 border-b border-white/5 pb-2 overflow-x-auto">
          {[
            { id: 'linux_cake', label: 'Linux tc CAKE' },
            { id: 'libreqos', label: 'LibreQoS Core Config' },
            { id: 'mikrotik', label: 'MikroTik RouterOS v7' },
            { id: 'openwrt', label: 'OpenWrt SQM' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveConfigTab(tab.id as typeof activeConfigTab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeConfigTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code display */}
        <div className="mt-3 relative">
          <pre className="p-4 bg-slate-950 border border-white/5 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {getGeneratedConfig()}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(getGeneratedConfig())}
            className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-white/10 cursor-pointer"
          >
            Copy Snippet
          </button>
        </div>
      </div>

      {/* ISP Onboarding & Network Audit Consulting Packages */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
        <div className="pb-6 border-b border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Professional Services</span>
          <h3 className="text-lg font-bold text-white">ISP Onboarding & Network Audit Consulting</h3>
          <p className="text-xs text-slate-400 mt-1">
            Turnkey engineering engagements ($2,500 – $10,000) for new ISP deployments to evaluate network bufferbloat, eliminate bottleneck standing queues, and calibrate hardware.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-950 border border-white/5 space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">$2,500 One-Time</span>
            <h4 className="text-base font-semibold text-white">Edge Bufferbloat Audit</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete diagnostic assessment of your network core, BNG, and upstream transit under peak busy-hour load.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
              <li>✓ Loaded latency probe on 50 sample lines</li>
              <li>✓ Bufferbloat grade breakdown across plans</li>
              <li>✓ Identification of bloated OLT buffers</li>
              <li>✓ Executive technical findings report</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 relative space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-cyan-300 font-bold">$5,000 One-Time</span>
              <span className="text-[10px] font-bold uppercase bg-cyan-400 text-slate-950 px-2 py-0.5 rounded">
                Most Popular
              </span>
            </div>
            <h4 className="text-base font-semibold text-white">Middlebox Deployment & Tuning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hands-on deployment of Linux eBPF / LibreQoS or CPE container agents across your primary regional POP.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
              <li>✓ Inline 10G/40G shaper server setup</li>
              <li>✓ CAKE diffserv4 queue configuration</li>
              <li>✓ RADIUS / PPPoE subscriber sync integration</li>
              <li>✓ 30-day monitoring & threshold calibration</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-white/5 space-y-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">$10,000 One-Time</span>
            <h4 className="text-base font-semibold text-white">Enterprise Full-Stack Overhaul</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full network modernization: core shaping, CPE agent fleet rollout, NOC dashboard training, and B2B2C gamer tier launch.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
              <li>✓ Multi-POP redundant middlebox architecture</li>
              <li>✓ White-label subscriber mobile app branding</li>
              <li>✓ NOC dispatch deflection workflow integration</li>
              <li>✓ Dedicated technical account engineer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
