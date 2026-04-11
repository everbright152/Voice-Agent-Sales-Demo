'use client';
import { useState } from 'react';

interface PricingTier {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  setupOriginal: number;
  setupSale: number;
  monthlyOriginal: number;
  monthlySale: number;
  totalToStart: number;
  monthTwoPlus: number;
  features: string[];
  highlight: boolean;
  stripeLink: string;
  calendlyLink: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tag: 'TIER 1 — ENTRY-LEVEL AI AUTOMATION',
    tagColor: 'text-emerald-400',
    setupOriginal: 2500,
    setupSale: 1250,
    monthlyOriginal: 497,
    monthlySale: 248,
    totalToStart: 1498,
    monthTwoPlus: 497,
    features: [
      'AI Voice Receptionist',
      '24/7 Call Answering — Never Miss a Lead',
      'Automated Lead Capture',
      'Up to 500 Calls/Month',
      'GHL CRM Setup & Integration',
      'Onboarding & Go-Live Support',
    ],
    highlight: false,
    stripeLink: 'https://buy.stripe.com/YOUR_STARTER_LINK',
    calendlyLink: 'https://calendly.com/mrceesai/discovery',
  },
  {
    id: 'growth',
    name: 'Growth',
    tag: 'TIER 2 — MOST POPULAR',
    tagColor: 'text-green-400',
    setupOriginal: 5000,
    setupSale: 2500,
    monthlyOriginal: 997,
    monthlySale: 498,
    totalToStart: 2998,
    monthTwoPlus: 997,
    features: [
      'Everything in Starter',
      'AI Follow-Up & Nurture Sequences',
      'Appointment Booking Automation',
      'Advanced CRM Integration',
      'Up to 2,000 Calls/Month',
      'Full Workflow Automation Build-Out',
      'Priority Support',
    ],
    highlight: true,
    stripeLink: 'https://buy.stripe.com/YOUR_GROWTH_LINK',
    calendlyLink: 'https://calendly.com/mrceesai/discovery',
  },
  {
    id: 'scale',
    name: 'Scale',
    tag: 'TIER 3 — FULL AI BUSINESS SYSTEM',
    tagColor: 'text-blue-400',
    setupOriginal: 10000,
    setupSale: 5000,
    monthlyOriginal: 1997,
    monthlySale: 998,
    totalToStart: 5998,
    monthTwoPlus: 1997,
    features: [
      'Everything in Growth',
      'Custom AI Workflows Built for Your Business',
      'ReviewBot SaaS — Automated Reputation Management',
      'ClientWinBot — AI-Powered Client Acquisition',
      'Unlimited Calls/Month',
      'Dedicated Support Manager',
      'Contracts, Payments & Delivery Infrastructure',
    ],
    highlight: false,
    stripeLink: 'https://buy.stripe.com/YOUR_SCALE_LINK',
    calendlyLink: 'https://calendly.com/mrceesai/discovery',
  },
];

interface PricingSectionProps {
  businessName?: string;
}

export default function PricingSection({ businessName }: PricingSectionProps) {
  const [showCalendly, setShowCalendly] = useState(false);
  const [calendlyTier, setCalendlyTier] = useState<PricingTier | null>(null);

  const handleGetStarted = (t: PricingTier) => {
    setCalendlyTier(t);
    setShowCalendly(true);
  };

  const handleProceedToPayment = (t: PricingTier) => {
    setShowCalendly(false);
    window.open(t.stripeLink, '_blank');
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'linear-gradient(rgba(34,197,94,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.02) 1px,transparent 1px)',backgroundSize:'60px 60px'}}></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 text-red-400 text-sm font-bold mb-6 animate-pulse">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            Only 5 Spots Remaining — Launch Pricing Ends Soon
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">MrCeesAI</h2>
          <p className="text-xl font-bold text-green-400 mb-6">Your Business Should Work Even When You&#39;re Not.</p>
          <div className="bg-gradient-to-r from-green-900/40 via-emerald-900/20 to-green-900/40 border border-green-500/30 rounded-2xl p-6 max-w-2xl mx-auto mb-4">
            <div className="text-white font-black text-lg mb-1">Limited Time Launch Offer — First 5 Clients Only</div>
            <div className="text-green-400 font-bold">50% Off Setup Fee + 50% Off First Month of Recurring</div>
            <div className="text-slate-400 text-sm mt-2">Once these 5 spots are gone, pricing returns to full rate.</div>
          </div>
          {businessName && (
            <p className="text-slate-400 text-sm">Ready to automate <span className="text-white font-bold">{businessName}</span>? Pick your plan below.</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRICING_TIERS.map((pt) => (
            <div key={pt.id} className={'relative rounded-3xl border overflow-hidden transition-all duration-300 ' + (pt.highlight ? 'border-green-500/60 bg-gradient-to-b from-green-900/20 to-slate-900/90 shadow-2xl shadow-green-500/10 scale-105' : 'border-white/10 bg-slate-900/50 hover:border-white/20')}>
              {pt.highlight && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-black text-center py-2 tracking-widest">MOST POPULAR</div>
              )}
              <div className="p-8">
                <div className={'text-xs font-bold mb-2 ' + pt.tagColor}>{pt.tag}</div>
                <div className="text-3xl font-black text-white mb-6">{pt.name}</div>
                <div className="mb-4">
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">One-Time Setup Fee</div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white">${pt.setupSale.toLocaleString()}</span>
                    <span className="text-slate-500 line-through text-sm">${pt.setupOriginal.toLocaleString()}</span>
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">50% OFF</span>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Monthly Recurring</div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white">${pt.monthlySale}/mo</span>
                    <span className="text-slate-500 line-through text-sm">${pt.monthlyOriginal}/mo</span>
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">50% OFF</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">50% Off — First Month Only</div>
                </div>
                <div className="space-y-2 mb-8">
                  {pt.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">&#10003;</span>
                      <span className="text-slate-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Total to Get Started</span>
                    <span className="text-white font-black text-xl">${pt.totalToStart.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">Then ${pt.monthTwoPlus}/mo starting Month 2</div>
                </div>
                <button onClick={() => handleGetStarted(pt)} className={'w-full py-4 rounded-xl font-black text-base transition-all ' + (pt.highlight ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/25' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10')}>
                  Get Started — {pt.name} &#8594;
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl overflow-hidden mb-12">
          <div className="p-6 border-b border-white/10"><h3 className="text-white font-black text-xl">Pricing at a Glance</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/10">
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Tier</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Setup (50% Off)</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Month 1 (50% Off)</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Total to Start</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Month 2+</th>
                <th className="p-4"></th>
              </tr></thead>
              <tbody>
                {PRICING_TIERS.map((pt) => (
                  <tr key={pt.id} className={'border-b border-white/5 hover:bg-white/5 ' + (pt.highlight ? 'bg-green-500/5' : '')}>
                    <td className="p-4"><span className={'font-bold ' + (pt.highlight ? 'text-green-400' : 'text-white')}>{pt.name}</span>{pt.highlight && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Popular</span>}</td>
                    <td className="p-4 text-white font-bold">${pt.setupSale.toLocaleString()}</td>
                    <td className="p-4 text-white font-bold">${pt.monthlySale}</td>
                    <td className="p-4 text-white font-bold">${pt.totalToStart.toLocaleString()}</td>
                    <td className="p-4 text-slate-400">${pt.monthTwoPlus}/mo</td>
                    <td className="p-4"><button onClick={() => handleGetStarted(pt)} className={'text-xs font-bold px-3 py-1.5 rounded-lg ' + (pt.highlight ? 'bg-green-500 text-white hover:bg-green-400' : 'bg-white/10 text-slate-300 hover:bg-white/20')}>Select</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showCalendly && calendlyTier && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0d1526] border border-white/10 rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
              <button onClick={() => setShowCalendly(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">&#215;</button>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">&#128197;</div>
                <h3 className="text-2xl font-black text-white mb-2">Book Your Onboarding Call</h3>
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 text-green-400 text-sm font-bold mb-3">
                  {calendlyTier.name} Plan — ${calendlyTier.totalToStart.toLocaleString()} to get started
                </div>
                <p className="text-slate-400 text-sm">Book your strategy call with Austin. We will get your AI agent live within days.</p>
              </div>
              <div className="space-y-3">
                <a href={calendlyTier.calendlyLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black py-4 rounded-xl text-center text-lg shadow-lg shadow-green-500/20">
                  &#128197; Schedule My Onboarding Call
                </a>
                <button onClick={() => handleProceedToPayment(calendlyTier)} className="block w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-center text-sm">
                  Already booked? Continue to Payment &#8594;
                </button>
              </div>
              <div className="mt-4 text-center text-slate-500 text-xs">Secure payment powered by Stripe. 100% safe and encrypted.</div>
            </div>
          </div>
        )}
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-2">Questions? Talk to Austin directly.</p>
          <a href="tel:+12764479695" className="text-green-400 font-bold hover:text-green-300 text-lg">+1 (276) 447-9695</a>
        </div>
      </div>
    </section>
  );
}
