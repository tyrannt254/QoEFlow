/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TabType } from '../types/index.ts';
import { 
  Sparkles, 
  Send, 
  X, 
  ArrowRight, 
  Bot, 
  User, 
  RefreshCw, 
  Lightbulb, 
  Sliders, 
  Activity, 
  DollarSign, 
  Smartphone, 
  Terminal, 
  ShieldCheck 
} from 'lucide-react';

interface AiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: {
    label: string;
    tab: TabType;
  };
}

export const AiCopilot: React.FC<AiCopilotProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  initialQuery
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your QoEFlow AI Copilot. Ask me anything about Bufferbloat, Active Queue Management (CAKE / FQ-CoDel), truck roll deflection ROI, or where to find tools in the platform.",
      suggestedAction: {
        label: 'Test Bufferbloat in the Simulator',
        tab: 'simulator'
      }
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    'Why does 1 Gbps Fiber still lag on Zoom and gaming?',
    'How do I calculate truck roll savings for 12,000 subscribers?',
    'What is the difference between CAKE and FQ-CoDel?',
    'Where can I export the CSV report for our QBR?',
    'How does the +$5/mo Gamer Mode addon generate profit?'
  ];

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSendPrompt(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });

      const data = await response.json();

      if (data && data.text) {
        // Decide contextual suggested navigation button based on user question
        let suggestedAction: ChatMessage['suggestedAction'] = undefined;
        const lower = textToSend.toLowerCase();

        if (lower.includes('speed') || lower.includes('fallacy') || lower.includes('bufferbloat') || lower.includes('simulator') || lower.includes('lag')) {
          suggestedAction = { label: 'Open Speed Fallacy Lab', tab: 'simulator' };
        } else if (lower.includes('roi') || lower.includes('cost') || lower.includes('dollar') || lower.includes('truck roll') || lower.includes('saving')) {
          suggestedAction = { label: 'Open ROI Calculator', tab: 'calculator' };
        } else if (lower.includes('fleet') || lower.includes('cpe') || lower.includes('heal') || lower.includes('csv') || lower.includes('report') || lower.includes('qbr')) {
          suggestedAction = { label: 'Open Fleet Operations Console', tab: 'fleet' };
        } else if (lower.includes('gamer') || lower.includes('mobile') || lower.includes('subscriber') || lower.includes('5')) {
          suggestedAction = { label: 'Open Subscriber White-Label App', tab: 'subscriber' };
        } else if (lower.includes('config') || lower.includes('tc') || lower.includes('kernel') || lower.includes('ebpf') || lower.includes('mikrotik') || lower.includes('openwrt')) {
          suggestedAction = { label: 'Open Kernel Config Generator', tab: 'architecture' };
        } else if (lower.includes('pilot') || lower.includes('trial') || lower.includes('500') || lower.includes('boss')) {
          suggestedAction = { label: 'Open 30-Day Pilot Setup', tab: 'pilot' };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            suggestedAction
          }
        ]);
      } else {
        // Fallback intelligent domain response engine
        generateDomainResponse(textToSend);
      }
    } catch (err) {
      generateDomainResponse(textToSend);
    } finally {
      setIsLoading(false);
    }
  };

  // High-accuracy fallback knowledge generator
  const generateDomainResponse = (query: string) => {
    const q = query.toLowerCase();
    let replyText = '';
    let suggestedAction: ChatMessage['suggestedAction'] = undefined;

    if (q.includes('speed') || q.includes('fallacy') || q.includes('why') || q.includes('zoom') || q.includes('bufferbloat')) {
      replyText = `Standard speed tests only measure unloaded bandwidth. When your household downloads files or streams 4K video, oversized router buffers fill up with packets. This creates standing queues, spiking latency from 14ms to 400ms+.

QoEFlow solves this using Active Queue Management (CAKE / FQ-CoDel), which isolates flows and drops/paces bulk packets so real-time video and gaming packets pass through instantly.`;
      suggestedAction = { label: 'Try Live Simulator & Audio/Game Streams', tab: 'simulator' };
    } else if (q.includes('truck roll') || q.includes('roi') || q.includes('money') || q.includes('cost') || q.includes('saving')) {
      replyText = `Field truck rolls cost ISPs $50 to $150 per dispatch. Most calls for "slow internet" are caused by in-home bufferbloat or poor Wi-Fi channels, not physical fiber cuts!

By deploying autonomous queue shaping and self-healing, regional ISPs reduce truck rolls by 38% and deflect support calls by 26%, generating an annualized ROI typically exceeding 320%.`;
      suggestedAction = { label: 'Launch Dynamic ROI Financial Model', tab: 'calculator' };
    } else if (q.includes('cake') || q.includes('codel') || q.includes('algorithm')) {
      replyText = `CAKE (Common Applications Kept Enhanced) is the state-of-the-art AQM algorithm (RFC 8290). Compared to FQ-CoDel:
• CAKE includes built-in DiffServ 4-tin classification (voice, interactive, best effort, bulk).
• Triple-isolate host fairness (per-host, per-flow isolation).
• Built-in TCP ACK filtering to prevent uplink choking.
• Automatic framing overhead compensation (Ethernet VLAN, PPPoE).`;
      suggestedAction = { label: 'View eBPF / CAKE Kernel Specs', tab: 'architecture' };
    } else if (q.includes('csv') || q.includes('report') || q.includes('qbr') || q.includes('download')) {
      replyText = `You can export a complete CSV incident and savings report for your Quarterly Business Review (QBR) directly from the Fleet Operations console. Look for the "Download Report (CSV)" button in the CPE Edge Nodes toolbar or above the Self-Healing log!`;
      suggestedAction = { label: 'Go to Fleet Console to Download CSV', tab: 'fleet' };
    } else if (q.includes('gamer') || q.includes('subscriber') || q.includes('addon') || q.includes('5')) {
      replyText = `The +$5.00/month Gamer & Low-Latency Tier is a B2B2C revenue-share feature (50/50 split). Subscribers activate it with one tap in their ISP-branded mobile app to get guaranteed single-digit latency under household load, unlocking high-margin net ARPU for the ISP.`;
      suggestedAction = { label: 'Preview Subscriber Mobile Experience', tab: 'subscriber' };
    } else if (q.includes('pilot') || q.includes('trial') || q.includes('500') || q.includes('wisp')) {
      replyText = `We recommend starting with a 30-day risk-free pilot on 500 subscribers (e.g. one WISP tower or GPON OLT). The platform tracks an A/B cohort against unmanaged lines, proving the drop in support tickets and converting trials into ongoing contracts.`;
      suggestedAction = { label: 'Open 30-Day Pilot Wizard', tab: 'pilot' };
    } else {
      replyText = `QoEFlow is a Software-Defined QoE Middlebox platform that eliminates bufferbloat and unmanaged latency for regional ISPs. You can:
1. Test queue algorithms in the Speed Fallacy Lab
2. Monitor CPE edge nodes and autonomous self-healing in Fleet Operations
3. Calculate truck roll financial savings in the ROI Calculator
4. Preview the white-label Subscriber App with Gamer Mode
5. Generate Linux tc / CAKE and LibreQoS configurations.`;
      suggestedAction = { label: 'Open Speed Fallacy Lab', tab: 'simulator' };
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        suggestedAction
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">QoEFlow AI Copilot</h3>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Ask about bufferbloat, CAKE configs, ROI, or navigation</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-950/40 border-b border-white/5 overflow-x-auto flex gap-2">
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendPrompt(prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[90%]">
              {msg.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/30">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-white/10 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.suggestedAction && (
                  <div className="pt-2 border-t border-white/10 mt-2">
                    <button
                      onClick={() => {
                        if (msg.suggestedAction) {
                          onNavigateTab(msg.suggestedAction.tab);
                          onClose();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-all cursor-pointer group"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
              <span>Analyzing network telemetry & generating advice...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-white/10 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI Copilot for help, configs, or ROI..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
