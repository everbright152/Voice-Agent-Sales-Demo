# 🤖 MrCeesAI — Voice Agent Sales Demo Platform

> **A production-ready demo tool for door-to-door sales meetings with businesses.**
> Enter any business URL → AI extracts their data → Demo a live AI voice call → Show ROI in real time.

## 🎯 Live Demo

📞 **Call the demo agent right now:** [+1 (276) 447-9695](tel:+12764479695)

---

## 🚀 What This Does

This is a **sales demo tool** for MrCeesAI, an AI automation agency. When visiting a prospect:

1. **Select their business type** (Legal, Beauty, Healthcare, Home Services, Financial)
2. **Enter their website URL** — the app crawls it and extracts business data automatically
3. **Review/edit the extracted data** before the demo
4. **Start a live AI voice call** — powered by Retell AI, customized for that specific business
5. **Watch the live workflow** animate as the AI handles the call
6. **Show the ROI panel** — calculated specifically for their niche

---

## 📁 Project Structure

```
mrceesai-voice-demo/
├── app/
│   ├── api/
│   │   ├── crawl/route.ts          # Website crawler API
│   │   └── retell/create-call/     # Retell web call creator
│   ├── globals.css                 # Dark theme styles + animations
│   ├── layout.tsx                  # Nav with demo phone number
│   └── page.tsx                    # Main app (4-step flow)
│
├── components/
│   ├── NicheSelector.tsx           # Niche picker (5 industries)
│   ├── WebsiteCrawler.tsx          # URL input + crawl UX
│   ├── BusinessDataEditor.tsx      # Edit extracted data
│   ├── DemoCallPanel.tsx           # Retell call + transcript
│   ├── WorkflowVisualizer.tsx      # Live workflow animation
│   └── ROIPanel.tsx                # Business impact calculator
│
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── niches.ts                   # 5 niche configs + prompts
│   └── prompts.ts                  # Layered prompt builder
│
├── .env.example                    # Environment variables template
├── next.config.js
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Start (Run Locally)

### 1. Clone the repo
```bash
git clone https://github.com/ausjones84/mrceesai-voice-demo.git
cd mrceesai-voice-demo
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your **Retell API key**:
```env
RETELL_API_KEY=your_key_from_retell_dashboard
RETELL_AGENT_ID=agent_419c1065694c58b9aa7d691a60
```

### 3. Get your Retell API Key
1. Go to [dashboard.retellai.com/settings/api-keys](https://dashboard.retellai.com/settings/api-keys)
2. Copy your API key (the "New Key")
3. Paste into `.env.local`

### 4. Run it
```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 🚢 Deploy to Vercel (5 minutes)

```bash
npm i -g vercel
vercel --prod
```

Or deploy via GitHub:
1. Push this repo to GitHub ✓ (already done)
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Connect your GitHub repo
4. Add environment variables in Vercel dashboard:
   - `RETELL_API_KEY` → your Retell API key
   - `RETELL_AGENT_ID` → `agent_419c1065694c58b9aa7d691a60`
5. Deploy!

---

## 🎙️ Retell AI Setup

### Your Existing Agent
- **Agent:** MrCeesAI-Demo
- **Agent ID:** `agent_419c1065694c58b9aa7d691a60`
- **Phone:** +1 (276) 447-9695
- **Dashboard:** [dashboard.retellai.com/agents](https://dashboard.retellai.com/agents)

### How It Works
The app **dynamically overrides the agent's prompt** for each demo:

```
FINAL_PROMPT = BASE_PROMPT + INDUSTRY_LAYER + BUSINESS_DATA
```

- **BASE:** Core rules (never say AI, always capture leads, professional tone)
- **INDUSTRY:** Niche-specific call flow, tone, qualification questions
- **BUSINESS DATA:** Extracted from their website (name, services, hours, FAQs, etc.)

The Retell agent answers as if it works for THAT specific business.

### Updating the Agent Prompt on Retell Dashboard
If you want to update the base prompt on the Retell dashboard:
1. Go to [dashboard.retellai.com/agents](https://dashboard.retellai.com/agents)
2. Click on **MrCeesAI-Demo**
3. Edit the system prompt
4. Publish

---

## 📞 Demo Call Modes

### 1. Real Retell Call (Recommended for live demos)
- Requires microphone permission
- Connects to your actual Retell agent
- Full voice conversation with AI
- Real-time transcript displayed

### 2. Demo Simulation Mode  
- No microphone needed
- Shows a pre-built conversation script per niche
- Great for quick screen demos without audio
- Click "🎭 Demo Simulation" before starting

### 3. Phone Call
- Clients can call **+1 (276) 447-9695** directly
- The Retell agent answers as MrCeesAI-Demo
- Best for showing a "real phone call" experience

---

## 🏭 Niche Configurations

Each niche in `lib/niches.ts` includes:

| Niche | Tone | Focus | ROI Model |
|-------|------|-------|-----------|
| ⚖️ Legal | Serious, calm | Consultation booking | $2,500/lead |
| 💅 Beauty | Upbeat, friendly | Appointment booking | $150/visit |
| 🏥 Healthcare | Caring, structured | Patient intake | $400/visit |
| 🏡 Home Services | Direct, efficient | Estimate scheduling | $350/job |
| 💰 Financial | Professional | Intake + follow-up | $800/client |

---

## 🔧 Adding More Niches

Edit `lib/niches.ts` and add a new entry to `NICHE_CONFIGS`:

```typescript
restaurant: {
  id: 'restaurant',
  label: 'Restaurant / Food Service',
  icon: '🍽️',
  // ... add all required fields
}
```

Also add the type to `lib/types.ts`:
```typescript
export type NicheType = 'legal' | 'beauty' | ... | 'restaurant';
```

---

## 🔌 Integration Placeholders

### Make.com (Automation)
Add `MAKE_WEBHOOK_URL` to your env — the app fires it when a demo call starts:
```json
{
  "event": "demo_call_started",
  "business_name": "Smith Law Firm",
  "niche": "legal",
  "call_id": "call_xxx"
}
```

### Twilio (SMS)
Add Twilio credentials to send real SMS confirmations after calls.

### Supabase (Lead Storage)
Add Supabase credentials to store leads from demo calls.

---

## 🗺️ Roadmap → Full MCP System

This demo is designed to evolve into a full **Multi-Agent Control Platform**:

```
Phase 1 (NOW): Sales Demo Tool ← You are here
Phase 2: Add CRM integration (Go High Level)
Phase 3: Multi-agent orchestration (booking + follow-up + reviews)
Phase 4: Client dashboard with analytics
Phase 5: Full MCP with agent-to-agent handoffs
```

The modular structure (`lib/niches`, `lib/prompts`, `lib/types`) makes this straightforward to extend.

---

## 📞 Support

**MrCeesAI** — AI Automation Agency
- Demo Line: [+1 (276) 447-9695](tel:+12764479695)
- Built by Austin Jones

---

*This tool was built to make prospects say: "This feels like it was built for me."*
