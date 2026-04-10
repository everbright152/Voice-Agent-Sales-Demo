'use client';

import { useState, useEffect, useRef } from 'react';
import { BusinessData, NicheType, TranscriptMessage } from '@/lib/types';
import { getNicheConfig } from '@/lib/niches';

interface DemoCallPanelProps {
  businessData: BusinessData;
  niche: NicheType;
  onCallStarted: () => void;
  onCallEnded: () => void;
  isCallActive: boolean;
}

// Demo transcript lines per niche for simulation fallback
const DEMO_TRANSCRIPTS: Record<NicheType, Array<{role: 'agent' | 'user', content: string}>> = {
  legal: [
    { role: 'agent', content: `Thank you for calling ${'{business}'} Today, how can I help you?` },
    { role: 'user', content: "Hi, I was in a car accident last week and I think I need an attorney." },
    { role: 'agent', content: "I'm so sorry to hear that. You've definitely come to the right place. Can I ask — were you injured in the accident?" },
    { role: 'user', content: "Yes, my neck and back have been hurting." },
    { role: 'agent', content: "I understand. Personal injury cases are something our team handles regularly. To get you connected with the right attorney, may I get your name and the best number to reach you?" },
    { role: 'user', content: "Sure, it's James Miller, and my number is 954-555-0123." },
    { role: 'agent', content: "Perfect, James. I'm going to schedule you for a free 15-minute consultation with one of our attorneys. They'll review your situation at no cost to you. Does tomorrow morning work, or would another time be better?" },
  ],
  beauty: [
    { role: 'agent', content: `Hey, thanks for calling ${'{business}'} How can I help you today?` },
    { role: 'user', content: "Hi! I'm looking to book a hair appointment." },
    { role: 'agent', content: "Awesome! We'd love to have you in. Are you looking for just a cut, or something like color or a treatment as well?" },
    { role: 'user', content: "I was thinking a cut and maybe highlights?" },
    { role: 'agent', content: "Ooh that sounds gorgeous! We have some great availability this week. Do you have a preferred stylist, or would you like me to match you with someone?" },
    { role: 'user', content: "I don't have a preference." },
    { role: 'agent', content: "Perfect! I can get you booked with Sarah — she's amazing with color. How does Thursday at 2pm sound? And just so I have you in our system, what's your name and number?" },
  ],
  healthcare: [
    { role: 'agent', content: `Thank you for calling ${'{business}'} How can I assist you today?` },
    { role: 'user', content: "I need to schedule a dental appointment, I'm having some tooth pain." },
    { role: 'agent', content: "I'm sorry to hear you're in pain — let's get you taken care of as quickly as possible. Are you an existing patient with us, or would this be your first visit?" },
    { role: 'user', content: "First visit." },
    { role: 'agent', content: "Welcome! We'd love to take great care of you. For tooth pain, we'll want to get you in as soon as possible. We actually have an opening tomorrow morning at 10 AM — would that work for you?" },
    { role: 'user', content: "Yes, that works perfectly." },
    { role: 'agent', content: "Wonderful! Can I get your full name, date of birth, and best phone number? Also, do you have dental insurance you'd like to use?" },
  ],
  home_services: [
    { role: 'agent', content: `Hey, thanks for calling ${'{business}'} What can we help you with today?` },
    { role: 'user', content: "Yeah, I need my lawn mowed. It's gotten pretty bad." },
    { role: 'agent', content: "No problem, we can definitely take care of that! What's the address, and are we looking at a regular residential yard?" },
    { role: 'user', content: "Yeah, it's 742 Evergreen Terrace — just a normal house." },
    { role: 'agent', content: "Got it. Would this be a one-time cleanup, or are you looking for regular weekly or biweekly service?" },
    { role: 'user', content: "I'd want it done regularly — maybe every two weeks." },
    { role: 'agent', content: "Perfect, we can set that up. We can get out there this week for the first cut. Can I get your name and a good number to send you the confirmation and schedule?" },
  ],
  financial: [
    { role: 'agent', content: `Thank you for calling ${'{business}'} How can I assist you today?` },
    { role: 'user', content: "Hi, I need help with my taxes. I have a small LLC." },
    { role: 'agent', content: "Absolutely, you've come to the right place. Do you file just business taxes, or personal and business together?" },
    { role: 'user', content: "Both — I'm a single-member LLC." },
    { role: 'agent', content: "Got it. We handle that combination frequently. To get you started, I'd like to schedule you for a free initial consultation with one of our CPAs. They'll review your situation and give you a clear picture of what you need. How does your schedule look this week?" },
    { role: 'user', content: "I'm free Thursday afternoon." },
    { role: 'agent', content: "Thursday afternoon works great. Can I get your name and email so I can send you a confirmation and a quick intake form to save time on the call?" },
  ],
};

export default function DemoCallPanel({ 
  businessData, 
  niche, 
  onCallStarted, 
  onCallEnded, 
  isCallActive 
}: DemoCallPanelProps) {
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [retellClient, setRetellClient] = useState<unknown>(null);
  const [useRealCall, setUseRealCall] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nicheConfig = getNicheConfig(niche);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (callState === 'idle') setCallDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    setCallState('connecting');
    setTranscript([]);
    setStatusMessage('Connecting to AI agent...');
    onCallStarted();

    if (useRealCall) {
      try {
        // Get web call token from our API
        const resp = await fetch('/api/retell/create-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessData, niche }),
        });

        const callData = await resp.json();

        if (!resp.ok || !callData.access_token) {
          throw new Error(callData.error || 'Failed to create call');
        }

        // Import and initialize Retell client
        const { RetellWebClient } = await import('retell-client-js-sdk');
        const client = new RetellWebClient();

        client.on('call_started', () => {
          setCallState('active');
          setStatusMessage('');
        });

        client.on('call_ended', () => {
          setCallState('ended');
          onCallEnded();
        });

        client.on('update', (update: unknown) => {
          if (update && typeof update === 'object' && 'transcript' in update) {
            const u = update as { transcript: Array<{role: string, content: string}> };
            if (u.transcript && Array.isArray(u.transcript)) {
              const messages: TranscriptMessage[] = u.transcript.map(t => ({
                role: t.role as 'agent' | 'user',
                content: t.content,
                timestamp: new Date(),
              }));
              setTranscript(messages);
            }
          }
        });

        client.on('error', (error: unknown) => {
          console.error('Retell error:', error);
          setStatusMessage('Connection issue — switching to demo mode');
          startDemoMode();
        });

        setRetellClient(client);
        await client.startCall({ accessToken: callData.access_token });

      } catch (error) {
        console.error('Real call failed, using demo mode:', error);
        setStatusMessage('Using demo simulation...');
        startDemoMode();
      }
    } else {
      startDemoMode();
    }
  };

  const startDemoMode = () => {
    setCallState('active');
    setStatusMessage('🎭 Demo Simulation Mode');
    
    const demoLines = DEMO_TRANSCRIPTS[niche];
    const businessName = businessData.business_name;

    let index = 0;
    const addNextLine = () => {
      if (index >= demoLines.length) return;
      
      const line = demoLines[index];
      const content = line.content.replace('{business}', businessName + '.');
      
      setTranscript(prev => [...prev, {
        role: line.role,
        content,
        timestamp: new Date(),
      }]);
      
      index++;
      if (index < demoLines.length) {
        // Varied delay to feel more natural
        const delay = line.role === 'agent' ? 2500 + content.length * 25 : 3500;
        setTimeout(addNextLine, Math.min(delay, 6000));
      }
    };

    setTimeout(addNextLine, 800);
  };

  const endCall = async () => {
    if (retellClient && typeof retellClient === 'object' && 'stopCall' in retellClient) {
      (retellClient as { stopCall: () => void }).stopCall();
    }
    setCallState('ended');
    onCallEnded();
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Call Header */}
      <div className={`p-6 border-b border-white/10 ${callState === 'active' ? 'bg-green-500/5' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 ${nicheConfig.bgColor} ${nicheConfig.color} border ${nicheConfig.borderColor} rounded-full px-3 py-1 text-xs font-medium mb-2`}>
              {nicheConfig.icon} {nicheConfig.label} Agent
            </div>
            <h2 className="text-xl font-bold text-white">{businessData.business_name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{businessData.summary?.substring(0, 80)}...</p>
          </div>
          
          {/* Call status indicator */}
          <div className="text-right">
            {callState === 'idle' && (
              <div className="text-slate-500 text-sm">Ready to demo</div>
            )}
            {callState === 'connecting' && (
              <div className="flex items-center gap-2 text-yellow-400">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <span className="text-sm">Connecting...</span>
              </div>
            )}
            {callState === 'active' && (
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-mono">{formatDuration(callDuration)}</span>
              </div>
            )}
            {callState === 'ended' && (
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                <span className="text-sm">Call ended</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="p-4 h-80 overflow-y-auto space-y-3 bg-dark-950/50">
        {transcript.length === 0 && callState === 'idle' && (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-4xl mb-3">📞</div>
              <div className="text-slate-500 text-sm">
                Start the demo call to see a live conversation transcript.
              </div>
              <div className="text-slate-600 text-xs mt-2">
                The AI agent will answer as {businessData.business_name}
              </div>
            </div>
          </div>
        )}

        {callState === 'connecting' && (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="flex gap-1 justify-center mb-3">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
              <div className="text-green-400 text-sm">{statusMessage}</div>
            </div>
          </div>
        )}

        {transcript.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div className={`max-w-xs sm:max-w-sm ${
              msg.role === 'agent'
                ? 'bg-dark-800 border border-white/10 text-white'
                : 'bg-green-500/20 border border-green-500/30 text-green-100'
            } rounded-2xl ${msg.role === 'agent' ? 'rounded-tl-sm' : 'rounded-tr-sm'} px-4 py-3`}>
              <div className={`text-xs font-medium mb-1 ${msg.role === 'agent' ? 'text-slate-400' : 'text-green-400'}`}>
                {msg.role === 'agent' ? `🤖 ${businessData.business_name}` : '👤 Caller'}
              </div>
              <div className="text-sm leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      {/* Status Message */}
      {statusMessage && callState === 'active' && (
        <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/20 text-yellow-400 text-xs text-center">
          {statusMessage}
        </div>
      )}

      {/* Controls */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Mode toggle */}
        {callState === 'idle' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Call mode:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseRealCall(true)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${useRealCall ? 'bg-green-500 text-white' : 'bg-dark-800 text-slate-400 border border-white/10'}`}
              >
                🎙️ Real Retell Call
              </button>
              <button
                onClick={() => setUseRealCall(false)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!useRealCall ? 'bg-blue-500 text-white' : 'bg-dark-800 text-slate-400 border border-white/10'}`}
              >
                🎭 Demo Simulation
              </button>
            </div>
          </div>
        )}

        {/* Main button */}
        {callState === 'idle' && (
          <button
            onClick={startCall}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg shadow-green-500/20"
          >
            <span className="text-2xl">📞</span>
            Start Demo Call
          </button>
        )}

        {callState === 'connecting' && (
          <button disabled className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3">
            <span className="w-5 h-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></span>
            Connecting to AI Agent...
          </button>
        )}

        {callState === 'active' && (
          <button
            onClick={endCall}
            className="w-full call-active bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <span className="text-xl">🔴</span>
            End Call
          </button>
        )}

        {callState === 'ended' && (
          <div className="space-y-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center text-green-400 text-sm">
              ✓ Call completed — {transcript.length} messages exchanged
            </div>
            <button
              onClick={() => {
                setCallState('idle');
                setTranscript([]);
              }}
              className="w-full bg-dark-800 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-dark-700 transition-all"
            >
              Run Another Demo
            </button>
          </div>
        )}

        {/* Phone number CTA */}
        {callState === 'idle' && (
          <div className="text-center">
            <p className="text-slate-500 text-xs">
              Or call our live demo line:{' '}
              <a href="tel:+12764479695" className="text-green-400 font-medium hover:text-green-300 transition-colors">
                +1 (276) 447-9695
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
              }
