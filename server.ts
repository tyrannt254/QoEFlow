/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Server-side Gemini AI endpoint
  app.post('/api/ai/ask', async (req, res) => {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({ fallback: true, reason: 'No API key configured' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the QoEFlow AI Copilot, an expert telecom and networking assistant embedded in the QoEFlow Software-Defined QoE Middlebox platform.
Your purpose:
1. Help ISP managers, network engineers, and operations staff understand and resolve Bufferbloat and unmanaged latency under load.
2. Guide users through the platform:
   - "simulator" -> The Speed Fallacy & AQM Live Lab (test loaded latency vs unloaded ping)
   - "fleet" -> ISP Operations Console (manage CPE edge nodes, self-healing log, CSV report export)
   - "calculator" -> ROI & Truck Roll Savings Calculator (financial modeling for 1k-50k subs)
   - "subscriber" -> Subscriber White-Label Portal & +$5/mo Gamer Priority Mode
   - "architecture" -> eBPF / CAKE Core & Turnkey Consulting Audit scopes
   - "pilot" -> 30-Day 500-Subscriber Proof-of-Concept Pilot Setup
3. Explain Active Queue Management (CAKE RFC 8290, FQ-CoDel RFC 8290, DiffServ RFC 4594).
Keep answers concise, direct, helpful, and scannable with bullet points when appropriate.`,
        },
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error('Server AI query error:', err);
      return res.json({ fallback: true, error: err.message });
    }
  });

  // Mount Vite SPA middleware in development
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      port: 3000,
      host: '0.0.0.0'
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`QoEFlow server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
