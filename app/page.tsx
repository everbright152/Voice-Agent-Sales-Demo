'use client';

import { useState } from 'react';
import NicheSelector from '@/components/NicheSelector';
import WebsiteCrawler from '@/components/WebsiteCrawler';
import BusinessDataEditor from '@/components/BusinessDataEditor';
import DemoCallPanel from '@/components/DemoCallPanel';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import ROIPanel from '@/components/ROIPanel';
import { BusinessData, NicheType } from '@/lib/types';

export default function HomePage() {
  const [step, setStep] = useState<'niche' | 'crawl' | 'edit' | 'demo'>('niche');
  const [selectedNiche, setSelectedNiche] = useState<NicheType | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);

  const handleNicheSelect = (niche: NicheType) => {
    setSelectedNiche(niche);
    setStep('crawl');
  };

  const handleDataExtracted = (data: BusinessData) => {
    setBusinessData(data);
    setStep('edit');
  };

  const handleDataConfirmed = (data: BusinessData) => {
    setBusinessData(data);
    setStep('demo');
  };

  const handleCallStarted = () => {
    setIsCallActive(true);
    setWorkflowStep(1);
  };

  const handleCallEnded = () => {
    setIsCallActive(false);
    setWorkflowStep(0);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-dark-950 to-blue-900/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-green-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Live AI Voice Demo — Powered by Retell AI
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Your Business Deserves a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300"> 24/7 AI Receptionist</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Enter your website URL. We extract your business info, build a custom AI voice agent, and let you demo a real call — in under 60 seconds.
          </p>
          
          {/* Demo phone number highlight */}
          <div className="inline-flex items-center gap-3 bg-dark-800 border border-white/10 rounded-2xl px-6 py-3 mb-8">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-xl">📞</span>
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-500 uppercase tracking-wider">Call the live demo agent</div>
              <div className="text-white font-bold text-lg">+1 (276) 447-9695</div>
            </div>
            <div className="flex gap-1 items-center">
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
        {/* Step 1: Niche Selection */}
        {step === 'niche' && (
          <NicheSelector onSelect={handleNicheSelect} />
        )}

        {/* Step 2: Website Crawler */}
        {step === 'crawl' && selectedNiche && (
          <WebsiteCrawler 
            niche={selectedNiche} 
            onDataExtracted={handleDataExtracted}
            onBack={() => setStep('niche')}
          />
        )}

        {/* Step 3: Data Editor */}
        {step === 'edit' && businessData && selectedNiche && (
          <BusinessDataEditor
            data={businessData}
            niche={selectedNiche}
            onConfirm={handleDataConfirmed}
            onBack={() => setStep('crawl')}
          />
        )}

        {/* Step 4: Demo Call */}
        {step === 'demo' && businessData && selectedNiche && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <DemoCallPanel
                businessData={businessData}
                niche={selectedNiche}
                onCallStarted={handleCallStarted}
                onCallEnded={handleCallEnded}
                isCallActive={isCallActive}
              />
              <WorkflowVisualizer 
                isCallActive={isCallActive}
                currentStep={workflowStep}
              />
            </div>
            <div>
              <ROIPanel niche={selectedNiche} businessData={businessData} />
            </div>
          </div>
        )}

        {/* Back to start */}
        {step === 'demo' && (
          <div className="text-center">
            <button
              onClick={() => {
                setStep('niche');
                setSelectedNiche(null);
                setBusinessData(null);
                setIsCallActive(false);
              }}
              className="text-slate-400 hover:text-white text-sm underline transition-colors"
            >
              ↩ Start over with a different business
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
