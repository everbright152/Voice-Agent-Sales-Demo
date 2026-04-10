
'use client';

import { useState, useEffect } from 'react';
import NicheSelector from '@/components/NicheSelector';
import WebsiteCrawler from '@/components/WebsiteCrawler';
import BusinessDataEditor from '@/components/BusinessDataEditor';
import DemoCallPanel from '@/components/DemoCallPanel';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import ROIPanel from '@/components/ROIPanel';
import { BusinessData, NicheType } from '@/lib/types';

// Animated counter hook
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

export default function HomePage() {
  const [step, setStep] = useState<'landing' | 'niche' | 'crawl' | 'edit' | 'demo'>('landing');
  const [selectedNiche, setSelectedNiche] = useState<NicheType | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const calls = useCounter(847, 2500, statsVisible);
  const revenue = useCounter(127000, 2800, statsVisible);
  const seconds = useCounter(8, 1500, statsVisible);

  if (step !== 'landing') {
    return (
      <div className="min-h-screen bg-dark-950">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-4 pt-8 mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { key: 'niche', label: '1. Pick Niche', icon: '🎯' },
              { key: 'crawl', label: '2. Enter URL', icon: '🌐' },
              { key: 'edit', label: '3. Review Data', icon: '✏️' },
              { key: 'demo', label: '4. Demo Call', icon: '📞' },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  step === s.key
                    ? 'bg-green-500 text-white'
                    : ['niche', 'crawl', 'edit', 'demo'].indexOf(step) > i
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-dark-800 text-slate-500 border border-white/10'
                }`}>
                  <span>{s.icon}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 3 && <div className="w-4 sm:w-8 h-px bg-white/10 mx-1"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
          {step === 'niche' && (
            <NicheSelector onSelect={(niche) => { setSelectedNiche(niche); setStep('crawl'); }} />
          )}
          {step === 'crawl' && selectedNiche && (
            <WebsiteCrawler
              niche={selectedNiche}
              onDataExtracted={(data) => { setBusinessData(data); setStep('edit'); }}
              onBack={() => setStep('niche')}
            />
          )}
          {step === 'edit' && businessData && selectedNiche && (
            <BusinessDataEditor
              data={businessData}
              niche={selectedNiche}
              onConfirm={(data) => { setBusinessData(data); setStep('demo'); }}
              onBack={() => setStep('crawl')}
            />
          )}
          {step === 'demo' && businessData && selectedNiche && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <DemoCallPanel
                  businessData={businessData}
                  niche={selectedNiche}
                  onCallStarted={() => { setIsCallActive(true); setWorkflowStep(1); }}
                  onCallEnded={() => { setIsCallActive(false); setWorkflowStep(0); }}
                  isCallActive={isCallActive}
                />
                <WorkflowVisualizer isCallActive={isCallActive} currentStep={workflowStep} />
              </div>
              <div>
                <ROIPanel niche={selectedNiche} businessData={businessData} />
              </div>
            </div>
          )}
          {step === 'demo' && (
            <div className="text-center">
              <button onClick={() => { setStep('landing'); setSelectedNiche(null); setBusinessData(null); }}
                className="text-slate-400 hover:text-white text-sm underline transition-colors">
                ↩ Back to home
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // LANDING PAGE — The wow factor starts here
  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 py-24">
        {/* Animated background grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px'}}>
        </div>
        {/* Green glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2 text-green-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            AI Voice Agent • Live Demo • Powered by Retell AI
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 animate-slide-up">
            Your Business Needs an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-400">
              AI Receptionist
            </span>
            <br />That Never Sleeps
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
            Enter your website. We build a custom AI voice agent for your business in 60 seconds.
            <strong className="text-white"> Watch it answer calls, capture leads, and book appointments — live.</strong>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <button
              onClick={() => setStep('niche')}
              className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-green-500/25 flex items-center justify-center gap-3"
            >
              <span>🚀</span>
              Build My AI Agent — Free Demo
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <a
              href="tel:+12764479695"
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-200"
            >
              <span className="text-2xl">📞</span>
              <div className="text-left">
                <div className="text-xs text-slate-400 font-normal">Call live demo agent</div>
                <div>+1 (276) 447-9695</div>
              </div>
            </a>
          </div>

          {/* Live stats counters */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-green-400 mb-1">
                {calls.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-500">Calls answered by AI</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-400 mb-1">
                ${(revenue / 1000).toFixed(0)}k+
              </div>
              <div className="text-xs text-slate-500">Revenue recovered</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-blue-400 mb-1">
                {seconds}s
              </div>
              <div className="text-xs text-slate-500">Avg answer time</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce-slow">
          <span className="text-xs">Scroll to see niches</span>
          <span>↓</span>
        </div>
      </section>

      {/* ── PROBLEM SECTION ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Every Missed Call Is{' '}
            <span className="text-red-400">Lost Revenue</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            The average business misses 62% of calls. Each missed call = a competitor getting that client.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '😤', stat: '62%', label: 'of calls go unanswered', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
              { icon: '💸', stat: '$28k', label: 'avg revenue lost per year', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
              { icon: '🚶', stat: '80%', label: 'of callers won't call back', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            ].map((item) => (
              <div key={item.stat} className={`${item.bg} border ${item.border} rounded-2xl p-6 text-center`}>
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className={`text-4xl font-black ${item.color} mb-2`}>{item.stat}</div>
                <div className="text-slate-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">
              From Website to Live AI Agent in{' '}
              <span className="text-green-400">60 Seconds</span>
            </h2>
            <p className="text-slate-400">No code. No setup. Watch it work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: '01', icon: '🎯', title: 'Pick Your Niche', desc: 'Legal, beauty, healthcare, home services, or financial' },
              { step: '02', icon: '🌐', title: 'Enter Your URL', desc: 'We scan your website and pull in your business info automatically' },
              { step: '03', icon: '🤖', title: 'AI Agent Built', desc: 'A custom voice agent is configured with your exact services & hours' },
              { step: '04', icon: '📞', title: 'Watch It Work', desc: 'Start a live demo call — hear it answer as YOUR business' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="glass rounded-2xl p-5 h-full">
                  <div className="text-xs font-bold text-green-400 mb-2">STEP {item.step}</div>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-white font-bold mb-2">{item.title}</div>
                  <div className="text-slate-400 text-sm">{item.desc}</div>
                </div>
                {item.step !== '04' && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 text-slate-600 text-xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NICHE SHOWCASE ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">
              Built for <span className="text-green-400">Your Industry</span>
            </h2>
            <p className="text-slate-400">Each AI agent is trained specifically for your business type — different tone, different call flow, different outcomes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '⚖️', niche: 'Legal', tone: 'Serious & calm', flow: 'Consultation booking', roi: '$2,500/lead', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', sample: '"Thank you for calling. I understand you need legal assistance — can I ask what type of matter this involves?"' },
              { icon: '💅', niche: 'Beauty & Aesthetics', tone: 'Warm & upbeat', flow: 'Appointment booking', roi: '$150/visit', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', sample: '"Hey! Thanks for calling! We'd love to get you in — what service were you thinking about?"' },
              { icon: '🏥', niche: 'Healthcare', tone: 'Caring & structured', flow: 'Patient intake', roi: '$400/visit', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', sample: '"Thank you for calling. Are you a new patient with us, or have you visited before?"' },
              { icon: '🏡', niche: 'Home Services', tone: 'Direct & efficient', flow: 'Estimate scheduling', roi: '$350/job', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', sample: '"Hey, thanks for calling! What service do you need help with today?"' },
              { icon: '💰', niche: 'Financial', tone: 'Professional & trusted', flow: 'Intake + follow-up', roi: '$800/client', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', sample: '"Thank you for calling. Are you looking for help with personal taxes, business taxes, or both?"' },
              { icon: '➕', niche: 'Your Industry', tone: 'Fully customizable', flow: 'Any call flow you need', roi: 'Custom ROI', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', sample: '"Any business type can be configured. Ask us about your specific industry."' },
            ].map((item) => (
              <div key={item.niche} className={`glass border ${item.border} rounded-2xl p-5 flex flex-col gap-3`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className={`font-bold ${item.color}`}>{item.niche}</div>
                    <div className="text-xs text-slate-500">{item.tone}</div>
                  </div>
                </div>
                <div className={`text-xs italic text-slate-400 ${item.bg} border ${item.border} rounded-xl p-3 leading-relaxed`}>
                  {item.sample}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">📋 {item.flow}</span>
                  <span className={`${item.color} font-bold`}>~{item.roi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTOMATION WORKFLOW ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">
              One Call. <span className="text-green-400">Full Automation.</span>
            </h2>
            <p className="text-slate-400">When the AI answers, everything else happens automatically — zero manual work.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 to-blue-500 opacity-30"></div>
            {[
              { icon: '📞', label: 'Incoming Call', desc: 'Client calls your number at any time — 2 AM, Sunday, holiday', color: 'text-blue-400', bg: 'bg-blue-500/20' },
              { icon: '🤖', label: 'AI Answers Instantly', desc: 'No rings. No hold music. A professional voice picks up in under 1 second', color: 'text-green-400', bg: 'bg-green-500/20' },
              { icon: '🧠', label: 'Lead Info Captured', desc: 'Name, phone number, reason for calling — all extracted automatically', color: 'text-purple-400', bg: 'bg-purple-500/20' },
              { icon: '⚡', label: 'Make.com Triggered', desc: 'Your automation workflow fires — CRM updated, team notified', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
              { icon: '📱', label: 'SMS Confirmation Sent', desc: 'Client gets a text with appointment details or next steps via Twilio', color: 'text-orange-400', bg: 'bg-orange-500/20' },
              { icon: '📅', label: 'Booking Link Delivered', desc: 'Appointment link sent directly to the client — they book while still on the call', color: 'text-pink-400', bg: 'bg-pink-500/20' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 mb-6 relative pl-16">
                <div className={`absolute left-0 w-16 h-16 ${item.bg} rounded-full flex items-center justify-center text-2xl flex-shrink-0 border border-white/10`}>
                  {item.icon}
                </div>
                <div className="glass rounded-2xl p-4 flex-1">
                  <div className={`font-bold ${item.color} mb-1`}>{item.label}</div>
                  <div className="text-slate-400 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">What Business Owners Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { quote: "I was missing calls every night and weekend. Now the AI handles all of them. Booked 3 new clients in the first week.", name: 'Marcus T.', role: 'Personal Injury Attorney', stars: 5 },
              { quote: "My salon went from losing 20 calls a week to zero. The voice sounds completely natural. Clients don't even know it's AI.", name: 'Jasmine L.', role: 'Salon Owner', stars: 5 },
              { quote: "We scheduled 11 new estimates in the first month just from after-hours calls we used to miss. This pays for itself 10x over.", name: 'Derek M.', role: 'Landscaping Business', stars: 5 },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {'★★★★★'.split('').map((s, j) => (
                    <span key={j} className="text-yellow-400">{s}</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{item.quote}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{item.name}</div>
                  <div className="text-slate-500 text-xs">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-900/30 via-dark-900 to-blue-900/20 p-12 text-center">
            <div className="absolute inset-0 pointer-events-none"
              style={{backgroundImage:'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.1) 0%, transparent 60%)'}}>
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-4xl font-black text-white mb-4">
                See It Work on Your Business
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Enter your website URL. We'll build a live AI agent for your business in 60 seconds — completely free demo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setStep('niche')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-green-500/25"
                >
                  Build My Free Demo →
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Or call our live agent right now:
                <a href="tel:+12764479695" className="text-green-400 font-bold hover:text-green-300 transition-colors">
                  +1 (276) 447-9695
                </a>
              </div>
              <div className="mt-3 text-slate-600 text-xs">
                No credit card • No setup • Works in 60 seconds
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
                }
