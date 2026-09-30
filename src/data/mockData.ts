/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CpeNode, SelfHealingEvent, HouseholdDevice, RoiInputs } from '../types/index.ts';

export const INITIAL_FLEET_NODES: CpeNode[] = [
  {
    id: 'CPE-8492',
    subscriberName: 'Marcus Vance',
    plan: '500 Mbps / 50 Mbps',
    serviceType: 'Fixed Wireless (WISP)',
    regionNode: 'North Ridge Tower Sector 3',
    ipAddress: '100.64.14.88',
    cpeModel: 'MikroTik hEX S + QoEFlow Agent',
    agentVersion: 'v2.4.1-ebpf',
    unloadedPingMs: 14,
    loadedPingMs: 19,
    grade: 'A+',
    aqmActive: true,
    algorithm: 'cake',
    gamerTierActive: true,
    wifiHealthPercent: 96,
    lastHealedAt: '12 mins ago',
    healingCount: 4,
    status: 'nominal'
  },
  {
    id: 'CPE-7120',
    subscriberName: 'Elena Rostova',
    plan: '1 Gbps / 1 Gbps Symmetrical',
    serviceType: 'Fiber GPON',
    regionNode: 'Metro Core Central Hub',
    ipAddress: '100.64.28.14',
    cpeModel: 'Ubiquiti EdgeRouter X',
    agentVersion: 'v2.4.1-ebpf',
    unloadedPingMs: 9,
    loadedPingMs: 14,
    grade: 'A+',
    aqmActive: true,
    algorithm: 'cake',
    gamerTierActive: false,
    wifiHealthPercent: 91,
    lastHealedAt: '2 hours ago',
    healingCount: 2,
    status: 'nominal'
  },
  {
    id: 'CPE-6304',
    subscriberName: 'David K. Chen',
    plan: '250 Mbps / 25 Mbps',
    serviceType: 'Cable DOCSIS',
    regionNode: 'East Valley Distribution',
    ipAddress: '100.64.44.102',
    cpeModel: 'OpenWrt AX3000 Standard',
    agentVersion: 'v2.4.0-ebpf',
    unloadedPingMs: 18,
    loadedPingMs: 440,
    grade: 'F',
    aqmActive: false,
    algorithm: 'fifo',
    gamerTierActive: false,
    wifiHealthPercent: 68,
    lastHealedAt: undefined,
    healingCount: 0,
    status: 'attention'
  },
  {
    id: 'CPE-5519',
    subscriberName: 'Sarah Jenkins',
    plan: '100 Mbps / 20 Mbps',
    serviceType: 'Fixed Wireless (WISP)',
    regionNode: 'Summit Peak Relay',
    ipAddress: '100.64.91.205',
    cpeModel: 'MikroTik RB5009',
    agentVersion: 'v2.4.1-ebpf',
    unloadedPingMs: 22,
    loadedPingMs: 27,
    grade: 'A',
    aqmActive: true,
    algorithm: 'fq_codel',
    gamerTierActive: true,
    wifiHealthPercent: 88,
    lastHealedAt: 'Yesterday',
    healingCount: 7,
    status: 'nominal'
  },
  {
    id: 'CPE-4982',
    subscriberName: 'Rodriguez Household',
    plan: '500 Mbps / 100 Mbps',
    serviceType: 'Fiber GPON',
    regionNode: 'Pinecrest Substation',
    ipAddress: '100.64.12.59',
    cpeModel: 'QoEFlow Micro-Middlebox 1U',
    agentVersion: 'v2.4.1-ebpf',
    unloadedPingMs: 11,
    loadedPingMs: 16,
    grade: 'A+',
    aqmActive: true,
    algorithm: 'cake',
    gamerTierActive: true,
    wifiHealthPercent: 94,
    lastHealedAt: '45 mins ago',
    healingCount: 3,
    status: 'nominal'
  },
  {
    id: 'CPE-3820',
    subscriberName: 'Liam O\'Connor',
    plan: '300 Mbps / 30 Mbps',
    serviceType: 'Cable DOCSIS',
    regionNode: 'West Basin GPON',
    ipAddress: '100.64.73.111',
    cpeModel: 'Arris Touchstone + Agent',
    agentVersion: 'v2.4.1-ebpf',
    unloadedPingMs: 16,
    loadedPingMs: 38,
    grade: 'B',
    aqmActive: true,
    algorithm: 'cake',
    gamerTierActive: false,
    wifiHealthPercent: 74,
    lastHealedAt: '3 hours ago',
    healingCount: 5,
    status: 'mitigating'
  },
  {
    id: 'CPE-2911',
    subscriberName: 'Amina Al-Mansoor',
    plan: '1 Gbps / 1 Gbps',
    serviceType: 'Fiber GPON',
    regionNode: 'Metro Core Central Hub',
    ipAddress: '100.64.88.22',
    cpeModel: 'LibreQoS Edge Shaper',
    agentVersion: 'v2.4.1-ebpf',
    unloadedPingMs: 8,
    loadedPingMs: 12,
    grade: 'A+',
    aqmActive: true,
    algorithm: 'cake',
    gamerTierActive: true,
    wifiHealthPercent: 98,
    lastHealedAt: '5 hours ago',
    healingCount: 1,
    status: 'nominal'
  },
  {
    id: 'CPE-1845',
    subscriberName: 'Travis Becker',
    plan: '100 Mbps / 10 Mbps',
    serviceType: 'Fixed Wireless (WISP)',
    regionNode: 'North Ridge Tower Sector 1',
    ipAddress: '100.64.103.54',
    cpeModel: 'Generic WISP CPE',
    agentVersion: 'v2.3.9-legacy',
    unloadedPingMs: 25,
    loadedPingMs: 512,
    grade: 'F',
    aqmActive: false,
    algorithm: 'fifo',
    gamerTierActive: false,
    wifiHealthPercent: 59,
    lastHealedAt: undefined,
    healingCount: 0,
    status: 'attention'
  }
];

export const INITIAL_SELF_HEALING_LOG: SelfHealingEvent[] = [
  {
    id: 'HEAL-901',
    timestamp: '12 mins ago',
    cpeId: 'CPE-8492',
    subscriber: 'Marcus Vance',
    triggerType: 'bufferbloat_spike',
    details: 'Heavy 4K stream + Steam game download saturated 50Mbps uplink, causing latency spike to 385ms.',
    actionTaken: 'Autonomous CAKE shaping adjusted egress limit to 47.5 Mbps (overhead compensation: 95%). Real-time flows isolated.',
    latencyBeforeMs: 385,
    latencyAfterMs: 19,
    truckRollAvoided: true,
    estimatedCostSaved: 120
  },
  {
    id: 'HEAL-902',
    timestamp: '45 mins ago',
    cpeId: 'CPE-4982',
    subscriber: 'Rodriguez Household',
    triggerType: 'asymmetric_saturation',
    details: 'Cloud photo backup saturated uplink with 8 parallel TCP streams. Zoom audio packets queuing behind bulk TCP chunks.',
    actionTaken: 'FQ-CoDel active queue dropped 3 non-responsive TCP packets; fast-tracked UDP RTP stream on DSCP Expedited Forwarding.',
    latencyBeforeMs: 420,
    latencyAfterMs: 16,
    truckRollAvoided: true,
    estimatedCostSaved: 120
  },
  {
    id: 'HEAL-903',
    timestamp: '2 hours ago',
    cpeId: 'CPE-7120',
    subscriber: 'Elena Rostova',
    triggerType: 'wifi_congestion',
    details: 'Neighboring AP co-channel interference on 5GHz Ch 36 reduced channel efficiency to 42%.',
    actionTaken: 'Dynamic DFS scan executed; migrated home router to clean UNII-2e Ch 100 with zero frame drops.',
    latencyBeforeMs: 88,
    latencyAfterMs: 14,
    truckRollAvoided: true,
    estimatedCostSaved: 85
  },
  {
    id: 'HEAL-904',
    timestamp: '3 hours ago',
    cpeId: 'CPE-3820',
    subscriber: 'Liam O\'Connor',
    triggerType: 'standing_queue',
    details: 'Oversized FIFO buffer accumulated 280 standing packets during continuous BitTorrent upload.',
    actionTaken: 'Switched default qdisc from pfifo_fast to CAKE dual-srchost fairness. Queue backlog cleared in 180ms.',
    latencyBeforeMs: 490,
    latencyAfterMs: 38,
    truckRollAvoided: true,
    estimatedCostSaved: 120
  },
  {
    id: 'HEAL-905',
    timestamp: 'Yesterday 18:42',
    cpeId: 'CPE-5519',
    subscriber: 'Sarah Jenkins',
    triggerType: 'bufferbloat_spike',
    details: 'WISP tower RF modulation dipped during heavy rain; hard-coded rate caused packet backlog.',
    actionTaken: 'Adaptive bandwidth tracking reduced shaper bandwidth dynamically by 12% to match physical RF capacity.',
    latencyBeforeMs: 310,
    latencyAfterMs: 27,
    truckRollAvoided: true,
    estimatedCostSaved: 150
  }
];

export const INITIAL_SUBSCRIBER_DEVICES: HouseholdDevice[] = [
  {
    id: 'DEV-1',
    name: 'Custom Gaming Rig (Ethernet)',
    category: 'gaming',
    ip: '192.168.1.101',
    mac: 'e4:5f:01:2b:89:12',
    priorityLevel: 'ultra',
    currentRateMbps: 3.4,
    currentLatencyMs: 15,
    dscpTag: 'CS6 (Network / High Priority)'
  },
  {
    id: 'DEV-2',
    name: 'Work MacBook Pro (M3 Max)',
    category: 'work',
    ip: '192.168.1.104',
    mac: '3c:22:fb:90:3d:74',
    priorityLevel: 'ultra',
    currentRateMbps: 4.8,
    currentLatencyMs: 17,
    dscpTag: 'EF (Expedited Forwarding - Zoom/VoIP)'
  },
  {
    id: 'DEV-3',
    name: 'Living Room Apple TV 4K',
    category: 'streaming',
    ip: '192.168.1.118',
    mac: 'f0:d5:bf:8a:11:00',
    priorityLevel: 'high',
    currentRateMbps: 24.5,
    currentLatencyMs: 22,
    dscpTag: 'AF31 (Video / Assured Forwarding)'
  },
  {
    id: 'DEV-4',
    name: 'Synology NAS (Nightly Cloud Backup)',
    category: 'iot',
    ip: '192.168.1.200',
    mac: '00:11:32:ea:45:90',
    priorityLevel: 'background',
    currentRateMbps: 42.0,
    currentLatencyMs: 28,
    dscpTag: 'CS1 (Bulk / Scavenger)'
  },
  {
    id: 'DEV-5',
    name: 'iPhone 16 Pro (Living Room)',
    category: 'mobile',
    ip: '192.168.1.145',
    mac: 'aa:bb:cc:dd:ee:ff',
    priorityLevel: 'normal',
    currentRateMbps: 1.2,
    currentLatencyMs: 19,
    dscpTag: 'BE (Best Effort)'
  }
];

export const DEFAULT_ROI_INPUTS: RoiInputs = {
  subscriberCount: 8500,
  churnRatePercent: 2.2,
  supportCallsPer100: 14,
  truckRollRatePercent: 12,
  costPerTruckRoll: 110,
  saasFeePerSub: 0.35,
  gamerAddonAdoptionRate: 8.5
};

export function calculateRoi(inputs: RoiInputs) {
  // Monthly support calls
  const monthlySupportCalls = Math.round((inputs.subscriberCount / 100) * inputs.supportCallsPer100);
  
  // Current monthly truck rolls
  const monthlyTruckRolls = Math.round(monthlySupportCalls * (inputs.truckRollRatePercent / 100));
  
  // QoEFlow software reduces truck rolls by 38% (typical ISP benchmark on bufferbloat & Wi-Fi issues)
  const truckRollsAvoidedMonthly = Math.round(monthlyTruckRolls * 0.38);
  const truckRollCostSavedMonthly = truckRollsAvoidedMonthly * inputs.costPerTruckRoll;
  
  // Support calls deflected by 26% (self-healing resolves issues before subscriber calls)
  const supportCallsDeflected = Math.round(monthlySupportCalls * 0.26);
  const supportCallCostSavedMonthly = supportCallsDeflected * 18; // Avg $18 support call cost
  
  // Churn reduction: prevents ~18% of churn caused by QoE dissatisfaction
  // Lifetime or monthly value: avg $65 ARPU retained
  const monthlyChurnCount = inputs.subscriberCount * (inputs.churnRatePercent / 100);
  const churnPreventedCount = Math.round(monthlyChurnCount * 0.18);
  const churnPreventedValueMonthly = churnPreventedCount * 65; // $65 ARPU
  
  // B2B2C Gamer Tier ($5/mo, 50% split = $2.50 to ISP)
  const gamerSubscribers = Math.round(inputs.subscriberCount * (inputs.gamerAddonAdoptionRate / 100));
  const gamerTierRevenueMonthly = gamerSubscribers * 5.0;
  const ispGamerShareMonthly = gamerSubscribers * 2.50;
  
  // SaaS Cost
  const saasCostMonthly = inputs.subscriberCount * inputs.saasFeePerSub;
  
  // Net gains
  const totalMonthlyBenefits = truckRollCostSavedMonthly + supportCallCostSavedMonthly + churnPreventedValueMonthly + ispGamerShareMonthly;
  const netMonthlyGain = totalMonthlyBenefits - saasCostMonthly;
  const netAnnualGain = netMonthlyGain * 12;
  
  const roiPercentage = saasCostMonthly > 0 ? Math.round((netMonthlyGain / saasCostMonthly) * 100) : 0;
  const paybackDays = netMonthlyGain > 0 ? Math.max(1, Math.round((saasCostMonthly / (totalMonthlyBenefits / 30)))) : 0;

  return {
    monthlySupportCalls,
    monthlyTruckRolls,
    truckRollsAvoidedMonthly,
    truckRollCostSavedMonthly,
    supportCallCostSavedMonthly,
    churnPreventedValueMonthly,
    gamerTierRevenueMonthly,
    ispGamerShareMonthly,
    saasCostMonthly,
    netMonthlyGain,
    netAnnualGain,
    roiPercentage,
    paybackDays
  };
}
