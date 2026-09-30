/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoiInputs } from '../types/index.ts';
import { DEFAULT_ROI_INPUTS, calculateRoi } from '../data/mockData.ts';

interface RoiCalculatorProps {
  onOpenPilot: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenPilot }) => {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_ROI_INPUTS);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const results = calculateRoi(inputs);

  const handleCopyPitch = () => {
    const summary = `QoEFlow Business Case & ROI Summary:
- Fleet Size: ${inputs.subscriberCount.toLocaleString()} subscribers
- Estimated Monthly Truck Rolls Avoided: ${results.truckRollsAvoidedMonthly} dispatches
- Monthly Truck Roll Cost Savings: $${results.truckRollCostSavedMonthly.toLocaleString()}
- Monthly Support Call Deflection: $${results.supportCallCostSavedMonthly.toLocaleString()}
- Churn Retained Value: $${results.churnPreventedValueMonthly.toLocaleString()}/mo
- B2B2C Gamer Tier Net Rev Split: $${results.ispGamerShareMonthly.toLocaleString()}/mo
- Net Annual Financial Gain: $${results.netAnnualGain.toLocaleString()}
- Expected ROI: ${results.roiPercentage}% (Payback in ~${results.paybackDays} days)`;

    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <span>B2B SaaS Business Engine</span>
            <span aria-hidden="true">·</span>
            <span>$0.20 - $0.50 / Subscriber</span>
            <span aria-hidden="true">·</span>
            <span>Proven Unit Economics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2" style={{ textWrap: 'balance' }}>
            Truck Roll Reduction & Churn Prevention ROI Model
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every unmanaged bufferbloat spike or Wi-Fi channel collision risks a costly field technician dispatch ($50 to $150 per truck roll) and drives customer churn. Calculate how much your ISP saves each month with autonomous queue management.
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs + Financial Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Form (5 cols) */}
        <div className="lg:col-span-5 border border-white/10 bg-slate-900/60 rounded-xl p-6 space-y-6">
          <h2 className="text-base font-semibold text-white">ISP Operating Parameters</h2>

          {/* Subscriber Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="sub-count" className="text-slate-300 font-medium">Total Active Subscribers</label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {inputs.subscriberCount.toLocaleString()} subs
              </span>
            </div>
            <input
              id="sub-count"
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={inputs.subscriberCount}
              onChange={(e) => setInputs({ ...inputs, subscriberCount: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>1k (Local WISP)</span>
              <span>15k (Regional)</span>
              <span>50k (Mid-tier)</span>
            </div>
          </div>

          {/* Truck Roll Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="truck-cost" className="text-slate-300 font-medium">Cost per Field Truck Roll</label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                ${inputs.costPerTruckRoll}
              </span>
            </div>
            <input
              id="truck-cost"
              type="range"
              min="50"
              max="150"
              step="5"
              value={inputs.costPerTruckRoll}
              onChange={(e) => setInputs({ ...inputs, costPerTruckRoll: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>$50</span>
              <span>$100</span>
              <span>$150</span>
            </div>
          </div>

          {/* Churn Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="churn-rate" className="text-slate-300 font-medium">Current Monthly Churn Rate</label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {inputs.churnRatePercent}% / mo
              </span>
            </div>
            <input
              id="churn-rate"
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={inputs.churnRatePercent}
              onChange={(e) => setInputs({ ...inputs, churnRatePercent: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>1.0%</span>
              <span>2.5%</span>
              <span>4.0%</span>
            </div>
          </div>

          {/* Support Calls Per 100 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="support-calls" className="text-slate-300 font-medium">Monthly Calls per 100 Subscribers</label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {inputs.supportCallsPer100} calls
              </span>
            </div>
            <input
              id="support-calls"
              type="range"
              min="6"
              max="28"
              step="1"
              value={inputs.supportCallsPer100}
              onChange={(e) => setInputs({ ...inputs, supportCallsPer100: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* SaaS Tier per sub */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="saas-fee" className="text-slate-300 font-medium">QoEFlow SaaS Tier</label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                ${inputs.saasFeePerSub.toFixed(2)} / sub / mo
              </span>
            </div>
            <input
              id="saas-fee"
              type="range"
              min="0.20"
              max="0.50"
              step="0.05"
              value={inputs.saasFeePerSub}
              onChange={(e) => setInputs({ ...inputs, saasFeePerSub: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>$0.20 (Volume)</span>
              <span>$0.35 (Standard)</span>
              <span>$0.50 (Enterprise)</span>
            </div>
          </div>

          {/* Gamer Addon Adoption Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="gamer-adoption" className="text-slate-300 font-medium">Gamer Addon (+$5/mo) Adoption</label>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                {inputs.gamerAddonAdoptionRate}% (50/50 Split)
              </span>
            </div>
            <input
              id="gamer-adoption"
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={inputs.gamerAddonAdoptionRate}
              onChange={(e) => setInputs({ ...inputs, gamerAddonAdoptionRate: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* Financial Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Headline Metrics */}
          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Financial Impact</span>
                <h3 className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  +${results.netAnnualGain.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ year</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPitch}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  {isCopied ? 'Copied to Clipboard!' : 'Copy Summary'}
                </button>
                <button
                  onClick={onOpenPilot}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  Start 30-Day Pilot
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-slate-950 border border-white/5">
                <span className="text-xs text-slate-400 block mb-1">Return on Investment</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {results.roiPercentage}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Annualized Net ROI</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-white/5">
                <span className="text-xs text-slate-400 block mb-1">Truck Rolls Deflected</span>
                <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                  {results.truckRollsAvoidedMonthly} <span className="text-xs font-normal text-slate-400">/mo</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">38% average reduction</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-white/5 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 block mb-1">Payback Period</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {results.paybackDays} <span className="text-xs font-normal text-slate-400">days</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Break-even timeline</span>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Revenue & Savings Decomposition</h4>

              <div className="space-y-3 text-xs">
                {/* Truck Roll Savings */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Truck Roll Elimination ({results.truckRollsAvoidedMonthly} calls × ${inputs.costPerTruckRoll})</span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums">+${results.truckRollCostSavedMonthly.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                {/* Support Call Deflection */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Support Call Deflection (QoE automated resolution)</span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums">+${results.supportCallCostSavedMonthly.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                {/* Churn Retained */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Prevented Churn Retention ($65 ARPU retained)</span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums">+${results.churnPreventedValueMonthly.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                {/* Gamer Tier Revenue */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">B2B2C Gamer Addon Revenue Split (50% of $5/mo fee)</span>
                    <span className="font-mono text-cyan-300 font-semibold tabular-nums">+${results.ispGamerShareMonthly.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                {/* SaaS License Fee */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">QoEFlow Middleware SaaS Cost ({inputs.subscriberCount.toLocaleString()} subs × ${inputs.saasFeePerSub.toFixed(2)})</span>
                    <span className="font-mono text-rose-400 font-semibold tabular-nums">-${results.saasCostMonthly.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Model Overview Card */}
          <div className="border border-white/10 bg-slate-900/60 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-white mb-4">Complete Monetization Architecture</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-white/5">
                <span className="font-semibold text-white block mb-1">1. B2B SaaS (Cost Reduction)</span>
                <span className="text-cyan-400 font-mono font-medium block mb-1">$0.20 - $0.50 / sub / month</span>
                <p className="text-slate-400 leading-relaxed">
                  Reduces truck rolls by 30-40% and deflects calls before subscribers notice latency spikes.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-white/5">
                <span className="font-semibold text-white block mb-1">2. B2B2C Gamer Tier (Revenue Share)</span>
                <span className="text-emerald-400 font-mono font-medium block mb-1">+$5.00 / month (50/50 Split)</span>
                <p className="text-slate-400 leading-relaxed">
                  White-labeled low-latency & gamer toggle in the ISP subscriber app. Generates immediate net ARPU.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-white/5">
                <span className="font-semibold text-white block mb-1">3. Network Audit & Setup</span>
                <span className="text-amber-400 font-mono font-medium block mb-1">$2,500 - $10,000 One-Time</span>
                <p className="text-slate-400 leading-relaxed">
                  Turnkey bufferbloat evaluation, eBPF middlebox installation, and physical RF/fiber calibration.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-white/5">
                <span className="font-semibold text-white block mb-1">4. Anonymized QoE Data Insights</span>
                <span className="text-purple-400 font-mono font-medium block mb-1">Annual CDN / Edge License</span>
                <p className="text-slate-400 leading-relaxed">
                  Aggregated telemetry on edge congestion sold to streaming platforms and CDN networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
