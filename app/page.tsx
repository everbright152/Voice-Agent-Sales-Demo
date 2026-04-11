
'use client';
import { useState } from 'react';
import NicheSelector from '@/components/NicheSelector';
import WebsiteCrawler from '@/components/WebsiteCrawler';
import BusinessDataEditor from '@/components/BusinessDataEditor';
import DemoCallPanel from '@/components/DemoCallPanel';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import ROIPanel from '@/components/ROIPanel';
import PricingSection from '@/components/PricingSection';
import { BusinessData, NicheType } from '@/lib/types';

export default function HomePage() {
  const [step, setStep] = useState('landing');
  const [selectedNiche, setSelectedNiche] = useState<NicheType | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [showPricing, setShowPricing] = useState(false);

  if (step !== 'landing') {
    return (
      <div className='min-h-screen bg-[#080d1a]'>
        {/* Step Progress */}
        <div className='max-w-4xl mx-auto px-4 pt-8 mb-8'>
          <div className='flex items-center justify-center gap-2 flex-wrap'>
            {[
              {key:'niche',label:'1. Pick Niche'},
              {key:'crawl',label:'2. Enter URL'},
              {key:'edit',label:'3. Review'},
              {key:'demo',label:'4. Demo'},
            ].map((s, i) => (
              <div key={s.key} className='flex items-center'>
                <div className={'px-3 py-2 rounded-full text-xs font-medium ' + (step === s.key ? 'bg-green-500 text-white' : ['niche','crawl','edit','demo'].indexOf(step) > i ? 'bg-green-500/30 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-500 border border-white/10')}>
                  {s.label}
                </div>
                {i < 3 && <div className='w-4 h-px bg-white/10 mx-1'></div>}
              </div>
            ))}
          </div>
        </div>

        <div className='max-w-6xl mx-auto px-4 pb-20 space-y-8'>
          {step === 'niche' && (
            <NicheSelector onSelect={(n) => { setSelectedNiche(n); setStep('crawl'); }} />
          )}

          {step === 'crawl' && selectedNiche && (
            <WebsiteCrawler
              niche={selectedNiche}
              onDataExtracted={(d) => { setBusinessData(d); setStep('edit'); }}
              onBack={() => setStep('niche')}
            />
          )}

          {step === 'edit' && businessData && selectedNiche && (
            <BusinessDataEditor
              data={businessData}
              niche={selectedNiche}
              onConfirm={(d) => { setBusinessData(d); setStep('demo'); }}
              onBack={() => setStep('crawl')}
            />
          )}

          {step === 'demo' && businessData && selectedNiche && (
            <>
              {/* Demo Header */}
              <div className='text-center'>
                <div className='inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-green-400 text-xs font-medium mb-3'>
                  <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
                  Live Demo — {businessData.business_name}
                </div>
                <h2 className='text-2xl font-black text-white mb-1'>Your AI Agent Is Ready</h2>
                <p className='text-slate-400 text-sm'>This is what your customers would experience. Try both voice and chat below.</p>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2 space-y-6'>
                  <DemoCallPanel
                    businessData={businessData}
                    niche={selectedNiche}
                    onCallStarted={() => { setIsCallActive(true); setWorkflowStep(1); }}
                    onCallEnded={() => { setIsCallActive(false); setWorkflowStep(5); }}
                    isCallActive={isCallActive}
                  />
                  <WorkflowVisualizer isCallActive={isCallActive} currentStep={workflowStep} />
                </div>
                <div className='space-y-6'>
                  <ROIPanel niche={selectedNiche} businessData={businessData} />
                  {/* Get This For My Business CTA */}
                  <div className='glass rounded-2xl p-6 text-center border border-green-500/20'>
                    <div className='text-2xl mb-2'>&#127775;</div>
                    <h3 className='text-white font-black text-lg mb-2'>Want This For {businessData.business_name}?</h3>
                    <p className='text-slate-400 text-xs mb-4'>Get a custom AI agent live for your business within days.</p>
                    <button
                      onClick={() => setShowPricing(true)}
                      className='w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black py-3 rounded-xl text-sm shadow-lg shadow-green-500/20'
                    >
                      See Pricing & Get Started &#8594;
                    </button>
                    <a href='tel:+12764479695' className='block mt-3 text-green-400 text-xs font-medium hover:text-green-300'>
                      Or call +1 (276) 447-9695
                    </a>
                  </div>
                </div>
              </div>

              {/* Pricing Section - reveals after demo */}
              {showPricing && (
                <div className='mt-8' id='pricing'>
                  <PricingSection businessName={businessData.business_name} />
                </div>
              )}

              <div className='text-center'>
                <button
                  onClick={() => { setStep('landing'); setSelectedNiche(null); setBusinessData(null); setShowPricing(false); setIsCallActive(false); setWorkflowStep(0); }}
                  className='text-slate-400 hover:text-white text-sm underline'
                >
                  Start a new demo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // LANDING PAGE
  // ============================================================
  return (
    <div className='min-h-screen bg-[#080d1a]'>
      {/* Hero */}
      <section className='relative flex flex-col items-center justify-center min-h-screen px-4 py-24 text-center overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none' style={{backgroundImage:'linear-gradient(rgba(34,197,94,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px'}}></div>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none'></div>
        <div className='relative z-10 max-w-5xl mx-auto'>
          <div className='inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2 text-green-400 text-sm font-medium mb-8'>
            <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
            AI Voice &amp; Chat Agent &#x2022; Live Demo &#x2022; Powered by Retell AI
          </div>
          <h1 className='text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6'>
            Your Business Needs an{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300'>AI Receptionist</span>
            <br />That Never Sleeps
          </h1>
          <p className='text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed'>
            Enter your website URL. We build a custom AI voice and chat agent for your business in 60 seconds.
            <strong className='text-white'> Watch it answer calls, capture leads, and book appointments — as YOUR business.</strong>
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16'>
            <button
              onClick={() => setStep('niche')}
              className='group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-green-500/25 flex items-center justify-center gap-3'
            >
              <span>Build My AI Agent</span>
              <span>&#8594;</span>
            </button>
            <a
              href='tel:+12764479695'
              className='flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-lg px-10 py-5 rounded-2xl'
            >
              <span className='text-2xl'>&#128222;</span>
              <div className='text-left'>
                <div className='text-xs text-slate-400 font-normal'>Call live demo now</div>
                <div>+1 (276) 447-9695</div>
              </div>
            </a>
          </div>
          <div className='grid grid-cols-3 gap-4 max-w-2xl mx-auto'>
            <div className='glass rounded-2xl p-4 text-center'><div className='text-3xl font-black text-green-400 mb-1'>847+</div><div className='text-xs text-slate-500'>Calls answered</div></div>
            <div className='glass rounded-2xl p-4 text-center'><div className='text-3xl font-black text-emerald-400 mb-1'>$127k+</div><div className='text-xs text-slate-500'>Revenue recovered</div></div>
            <div className='glass rounded-2xl p-4 text-center'><div className='text-3xl font-black text-blue-400 mb-1'>8s</div><div className='text-xs text-slate-500'>Avg answer time</div></div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className='py-20 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl font-black text-white mb-4'>Every Missed Call Is <span className='text-red-400'>Lost Revenue</span></h2>
          <p className='text-slate-400 text-lg mb-12'>The average business misses 62% of calls. Each missed call is a competitor getting that client.</p>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
            <div className='bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center'><div className='text-4xl mb-2'>&#128544;</div><div className='text-4xl font-black text-red-400 mb-2'>62%</div><div className='text-slate-400 text-sm'>of calls go unanswered</div></div>
            <div className='bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 text-center'><div className='text-4xl mb-2'>&#128184;</div><div className='text-4xl font-black text-orange-400 mb-2'>$28k</div><div className='text-slate-400 text-sm'>avg revenue lost per year</div></div>
            <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center'><div className='text-4xl mb-2'>&#128694;</div><div className='text-4xl font-black text-yellow-400 mb-2'>80%</div><div className='text-slate-400 text-sm'>of callers will not call back</div></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 px-4'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-black text-white mb-3'>From URL to Live AI Agent in <span className='text-green-400'>60 Seconds</span></h2>
            <p className='text-slate-400'>No code. No setup. Watch it work — as your actual business.</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
            {[
              {step:'01',icon:'&#127919;',title:'Pick Your Niche',desc:'Legal, beauty, healthcare, home services, or financial'},
              {step:'02',icon:'&#127760;',title:'Enter Your URL',desc:'We scan your website and pull in your business info automatically'},
              {step:'03',icon:'&#129302;',title:'AI Agent Built',desc:'A custom voice and chat agent with your exact services and hours'},
              {step:'04',icon:'&#128222;',title:'Watch It Work',desc:'Start a live demo call or chat — answering as YOUR business'},
            ].map((item) => (
              <div key={item.step} className='glass rounded-2xl p-5'>
                <div className='text-xs font-bold text-green-400 mb-2'>STEP {item.step}</div>
                <div className='text-3xl mb-3' dangerouslySetInnerHTML={{__html: item.icon}}></div>
                <div className='text-white font-bold mb-2'>{item.title}</div>
                <div className='text-slate-400 text-sm'>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA before pricing */}
      <section className='py-24 px-4'>
        <div className='max-w-3xl mx-auto'>
          <div className='relative overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-900/30 via-slate-900 to-blue-900/20 p-12 text-center'>
            <h2 className='text-4xl font-black text-white mb-4'>See It Work on Your Business</h2>
            <p className='text-slate-400 text-lg mb-8'>Enter your website URL. Free demo. 60 seconds. Then see the pricing that fits.</p>
            <button
              onClick={() => setStep('niche')}
              className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl shadow-green-500/25'
            >
              Build My Free Demo &#8594;
            </button>
            <div className='mt-6 text-slate-500 text-sm'>
              Or call live agent: <a href='tel:+12764479695' className='text-green-400 font-bold'>+1 (276) 447-9695</a>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Pricing Preview */}
      <PricingSection />
    </div>
  );
}
