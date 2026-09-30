/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 
  | 'simulator' 
  | 'fleet' 
  | 'calculator' 
  | 'subscriber' 
  | 'pilot' 
  | 'architecture';

export type QueueAlgorithm = 'fifo' | 'fq_codel' | 'cake';

export interface Packet {
  id: string;
  type: 'gaming' | 'voip' | 'streaming' | 'bulk_download' | 'cloud_backup';
  label: string;
  sizeBytes: number;
  flowId: number;
  priority: 'realtime' | 'interactive' | 'best_effort' | 'bulk';
  queueTimeMs: number;
  isDropped: boolean;
  color: string;
}

export interface SimulationMetrics {
  unloadedPingMs: number;
  downloadLatencyMs: number;
  uploadLatencyMs: number;
  downloadBandwidthMbps: number;
  uploadBandwidthMbps: number;
  bufferbloatGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  roundtripsPerMinute: number; // RPM metric popularized by Apple/IETF
  packetLossPercent: number;
  jitterMs: number;
  queueDepthPackets: number;
  queueStandingTimeMs: number;
}

export interface CpeNode {
  id: string;
  subscriberName: string;
  plan: string; // e.g. "500 Mbps Fiber", "100 Mbps WISP"
  serviceType: 'Fiber GPON' | 'Fixed Wireless (WISP)' | 'Cable DOCSIS' | 'DSL';
  regionNode: string; // e.g. "North Ridge Tower", "Metro Hub Alpha"
  ipAddress: string;
  cpeModel: string;
  agentVersion: string;
  unloadedPingMs: number;
  loadedPingMs: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  aqmActive: boolean;
  algorithm: QueueAlgorithm;
  gamerTierActive: boolean;
  wifiHealthPercent: number;
  lastHealedAt?: string;
  healingCount: number;
  status: 'nominal' | 'mitigating' | 'attention';
}

export interface SelfHealingEvent {
  id: string;
  timestamp: string;
  cpeId: string;
  subscriber: string;
  triggerType: 'bufferbloat_spike' | 'wifi_congestion' | 'standing_queue' | 'asymmetric_saturation';
  details: string;
  actionTaken: string;
  latencyBeforeMs: number;
  latencyAfterMs: number;
  truckRollAvoided: boolean;
  estimatedCostSaved: number;
}

export interface HouseholdDevice {
  id: string;
  name: string;
  category: 'gaming' | 'work' | 'streaming' | 'iot' | 'mobile';
  ip: string;
  mac: string;
  priorityLevel: 'ultra' | 'high' | 'normal' | 'background';
  currentRateMbps: number;
  currentLatencyMs: number;
  dscpTag: string;
}

export interface RoiInputs {
  subscriberCount: number;
  churnRatePercent: number;
  supportCallsPer100: number;
  truckRollRatePercent: number; // % of support calls requiring technician
  costPerTruckRoll: number;
  saasFeePerSub: number;
  gamerAddonAdoptionRate: number; // % of subs paying +$5/mo
}

export interface RoiResults {
  monthlySupportCalls: number;
  monthlyTruckRolls: number;
  truckRollsAvoidedMonthly: number;
  truckRollCostSavedMonthly: number;
  supportCallCostSavedMonthly: number;
  churnPreventedValueMonthly: number;
  gamerTierRevenueMonthly: number;
  ispGamerShareMonthly: number;
  saasCostMonthly: number;
  netMonthlyGain: number;
  netAnnualGain: number;
  roiPercentage: number;
  paybackDays: number;
}
