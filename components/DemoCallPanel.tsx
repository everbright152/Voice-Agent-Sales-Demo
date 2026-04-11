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

type DemoMode = 'voice' | 'chat';

function buildDemoScript(niche: NicheType, biz: BusinessData): Array<{role: 'agent' | 'user', content: string}> {
  const name = biz.business_name;
  const svc = biz.services && biz.services.length > 0 ? biz.services[0] : 'our services';
  const svc2 = biz.services && biz.services.length > 1 ? biz.services[1] : 'additional services';
  const hours = biz.hours || 'Monday-Friday 9am-5pm';
  const booking = biz.booking_link ? ' You can also book online at ' + biz.booking_link + '.' : '';
  const scripts: Record<NicheType, Array<{role: 'agent' | 'user', content: string}>> = {
    legal: [
      { role: 'agent', content: 'Thank you for calling ' + name + ', how can I help you today?' },
      { role: 'user', content: 'Hi, I was in a car accident last week and I need an attorney.' },
      { role: 'agent', content: 'I am so sorry to hear that. You have come to the right place. Were you injured?' },
      { role: 'user', content: 'Yes, my neck and back have been hurting.' },
      { role: 'agent', content: 'At ' + name + ' we handle ' + svc + ' and ' + svc2 + '. We offer a free consultation. May I get your name and best number?' },
      { role: 'user', content: 'Sure, it is James, 954-555-0123.' },
      { role: 'agent', content: 'Perfect James. Our hours are ' + hours + '. I will schedule your free consultation and a team member will confirm shortly.' + booking },
    ],
    beauty: [
      { role: 'agent', content: 'Hey, thanks for calling ' + name + '! How can I help you today?' },
      { role: 'user', content: 'Hi! I am looking to book a hair appointment.' },
      { role: 'agent', content: 'Awesome! We offer ' + svc + ' and ' + svc2 + '. Are you looking for a cut, color, or both?' },
      { role: 'user', content: 'A cut and maybe highlights.' },
      { role: 'agent', content: 'Our hours are ' + hours + '. I can get you booked right now. What is your name and number?' },
      { role: 'user', content: 'I am Sarah, 305-555-0189.' },
      { role: 'agent', content: 'Perfect Sarah! You are all set. We will send a confirmation.' + booking + ' We cannot wait to see you!' },
    ],
    healthcare: [
      { role: 'agent', content: 'Thank you for calling ' + name + '. How can I assist you?' },
      { role: 'user', content: 'I need an appointment, I have tooth pain.' },
      { role: 'agent', content: 'We offer ' + svc + ' and ' + svc2 + '. Is this your first visit with us?' },
      { role: 'user', content: 'Yes, first visit.' },
      { role: 'agent', content: 'Welcome! Our hours are ' + hours + '. We have availability tomorrow. May I get your name, date of birth, and phone number?' },
      { role: 'user', content: 'Michael Chen, January 5th 1990, 786-555-0234.' },
      { role: 'agent', content: 'Thank you Michael! We will send a confirmation.' + booking + ' See you soon!' },
    ],
    home_services: [
      { role: 'agent', content: 'Hey, thanks for calling ' + name + '! What can we help with today?' },
      { role: 'user', content: 'I need my lawn mowed. It has gotten pretty bad.' },
      { role: 'agent', content: 'We specialize in ' + svc + ' and ' + svc2 + '. What is the address?' },
      { role: 'user', content: '742 Evergreen Terrace, just a regular house.' },
      { role: 'agent', content: 'Got it! We work ' + hours + '. One-time or regular biweekly service?' },
      { role: 'user', content: 'Regular, every two weeks.' },
      { role: 'agent', content: 'Set up! We can get out there this week. Name and number to send confirmation?' },
    ],
    financial: [
      { role: 'agent', content: 'Thank you for calling ' + name + '. How can I assist you?' },
      { role: 'user', content: 'Hi, I need help with my taxes. I have a small LLC.' },
      { role: 'agent', content: 'You are in the right place. We handle ' + svc + ' and ' + svc2 + '. Business only, or personal and business?' },
      { role: 'user', content: 'Both, I am a single-member LLC.' },
      { role: 'agent', content: 'Our hours are ' + hours + '. I will schedule a free CPA consultation.' + booking + ' How does your schedule look this week?' },
      { role: 'user', content: 'Thursday afternoon works.' },
      { role: 'agent', content: 'Confirmed for Thursday! Name and email so I can send intake forms?' },
    ],
  };
  return scripts[niche] || scripts.legal;
}

function buildChatScript(niche: NicheType, biz: BusinessData): Array<{role: 'agent' | 'user', content: string}> {
  const name = biz.business_name;
  const svcList = biz.services.slice(0, 3).join(', ');
  const hours = biz.hours || 'Monday-Friday 9am-5pm';
  const booking = biz.booking_link ? ' Book online at ' + biz.booking_link + ' or' : '';
  const scripts: Record<NicheType, Array<{role: 'agent' | 'user', content: string}>> = {
    legal: [
      { role: 'agent', content: 'Hi! Welcome to ' + name + '. How can I assist you today?' },
      { role: 'user', content: 'What kind of cases do you handle?' },
      { role: 'agent', content: 'We handle ' + svcList + '. Is there a specific situation you need help with?' },
      { role: 'user', content: 'Yes, I had a car accident. What are your hours?' },
      { role: 'agent', content: 'Our hours are ' + hours + '. We offer free consultations for personal injury cases.' + booking + ' share your name and number to get started!' },
      { role: 'user', content: 'Yes please!' },
      { role: 'agent', content: 'Perfect! Provide your name and phone number and a team member from ' + name + ' will reach out within the hour.' },
    ],
    beauty: [
      { role: 'agent', content: 'Hey there! Welcome to ' + name + '. What can I help you with today?' },
      { role: 'user', content: 'What services do you offer?' },
      { role: 'agent', content: 'We offer ' + svcList + ', and more! What are you looking for?' },
      { role: 'user', content: 'I want to book a haircut. When are you open?' },
      { role: 'agent', content: 'We are open ' + hours + '.' + booking + ' share your name and number to book!' },
      { role: 'user', content: 'I will book here.' },
      { role: 'agent', content: 'Great! Drop your name and preferred time and we will confirm your spot at ' + name + '. We look forward to seeing you!' },
    ],
    healthcare: [
      { role: 'agent', content: 'Hello! Welcome to ' + name + '. How can I help?' },
      { role: 'user', content: 'Do you accept new patients?' },
      { role: 'agent', content: 'Yes, we are accepting new patients! We offer ' + svcList + '. What brings you in?' },
      { role: 'user', content: 'I have tooth pain and need to be seen soon. What are your hours?' },
      { role: 'agent', content: 'We are open ' + hours + '.' + booking + ' share your name, DOB, and phone to schedule!' },
      { role: 'user', content: 'My name is Lisa, 305-555-0099.' },
      { role: 'agent', content: 'Thank you Lisa! Our team at ' + name + ' will call to confirm your appointment shortly. See you soon!' },
    ],
    home_services: [
      { role: 'agent', content: 'Hi! Welcome to ' + name + '. What can we help you with today?' },
      { role: 'user', content: 'What services do you offer?' },
      { role: 'agent', content: 'We offer ' + svcList + '. What do you need done?' },
      { role: 'user', content: 'I need a quote for lawn care. When are you available?' },
      { role: 'agent', content: 'We work ' + hours + '.' + booking + ' drop your address and contact info for a free estimate!' },
      { role: 'user', content: 'My address is 123 Oak Lane.' },
      { role: 'agent', content: 'Our team from ' + name + ' will be in touch shortly to schedule your free estimate. Thanks for reaching out!' },
    ],
    financial: [
      { role: 'agent', content: 'Hello! Welcome to ' + name + '. How can I assist?' },
      { role: 'user', content: 'I need help with bookkeeping for my small business.' },
      { role: 'agent', content: 'You are in the right place! We specialize in ' + svcList + '. Ongoing monthly or a one-time cleanup?' },
      { role: 'user', content: 'Monthly service. What are your hours?' },
      { role: 'agent', content: 'We are available ' + hours + '.' + booking + ' share your name and email and a CPA will reach out!' },
      { role: 'user', content: 'My name is David, david@mybiz.com' },
      { role: 'agent', content: 'Thanks David! A CPA from ' + name + ' will follow up within 1 business day. Looking forward to working with you!' },
    ],
  };
  return scripts[niche] || scripts.legal;
}

export default function DemoCallPanel({ businessData, niche, onCallStarted, onCallEnded, isCallActive }: DemoCallPanelProps) {
  const [demoMode, setDemoMode] = useState<DemoMode>('voice');
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [retellClient, setRetellClient] = useState<unknown>(null);
  const [useRealCall, setUseRealCall] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'agent' | 'user', content: string}>>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatScriptIndex, setChatScriptIndex] = useState(1);
  const [chatTyping, setChatTyping] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nicheConfig = getNicheConfig(niche);

  useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [transcript]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => { setCallDuration(d => d + 1); }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (callState === 'idle') setCallDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ':' + sec.toString().padStart(2, '0');
  };

  const startCall = async () => {
    setCallState('connecting');
    setTranscript([]);
    setStatusMessage('Connecting to AI agent...');
    onCallStarted();
    if (useRealCall) {
      try {
        const resp = await fetch('/api/retell/create-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessData, niche }),
        });
        const callData = await resp.json();
        if (!resp.ok || !callData.access_token) throw new Error(callData.error || 'Failed to create call');
        const { RetellWebClient } = await import('retell-client-js-sdk');
        const client = new RetellWebClient();
        client.on('call_started', () => { setCallState('active'); setStatusMessage(''); });
        client.on('call_ended', () => { setCallState('ended'); onCallEnded(); });
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
        client.on('error', () => { setStatusMessage('Connection issue - using demo mode'); startDemoMode(); });
        setRetellClient(client);
        await client.startCall({ accessToken: callData.access_token });
      } catch {
        setStatusMessage('Using demo simulation...');
        startDemoMode();
      }
    } else {
      startDemoMode();
    }
  };

  const startDemoMode = () => {
    setCallState('active');
    setStatusMessage('Demo Simulation Mode');
    const demoLines = buildDemoScript(niche, businessData);
    let index = 0;
    const addNextLine = () => {
      if (index >= demoLines.length) return;
      const line = demoLines[index];
      setTranscript(prev => [...prev, { role: line.role, content: line.content, timestamp: new Date() }]);
      index++;
      if (index < demoLines.length) {
        const delay = line.role === 'agent' ? 2500 + line.content.length * 20 : 3500;
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

  const startChat = () => {
    setChatStarted(true);
    setChatMessages([]);
    setChatScriptIndex(1);
    const script = buildChatScript(niche, businessData);
    setChatTyping(true);
    setTimeout(() => {
      setChatMessages([{ role: 'agent', content: script[0].content }]);
      setChatTyping(false);
    }, 1000);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const script = buildChatScript(niche, businessData);
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatTyping(true);
    setTimeout(() => {
      let agentReply = 'Thank you for reaching out to ' + businessData.business_name + '! A team member will be in touch shortly.';
      if (chatScriptIndex < script.length) {
        const nextMsg = script[chatScriptIndex];
        if (nextMsg.role === 'agent') {
          agentReply = nextMsg.content;
          setChatScriptIndex(prev => prev + 2);
        } else if (chatScriptIndex + 1 < script.length) {
          agentReply = script[chatScriptIndex + 1].content;
          setChatScriptIndex(prev => prev + 2);
        }
      }
      setChatMessages(prev => [...prev, { role: 'agent', content: agentReply }]);
      setChatTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={() => setDemoMode('voice')}
          className={'flex-1 py-3 rounded-xl font-bold text-sm transition-all ' + (demoMode === 'voice' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white')}
        >
          Voice Call Demo
        </button>
        <button
          onClick={() => setDemoMode('chat')}
          className={'flex-1 py-3 rounded-xl font-bold text-sm transition-all ' + (demoMode === 'chat' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white')}
        >
          Chat Demo
        </button>
      </div>

      {demoMode === 'voice' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className={'p-6 border-b border-white/10 ' + (callState === 'active' ? 'bg-green-500/5' : '')}>
            <div className="flex items-center justify-between">
              <div>
                <div className={'inline-flex items-center gap-2 ' + nicheConfig.bgColor + ' ' + nicheConfig.color + ' border ' + nicheConfig.borderColor + ' rounded-full px-3 py-1 text-xs font-medium mb-2'}>
                  {nicheConfig.icon} {nicheConfig.label} Voice Agent
                </div>
                <h2 className="text-xl font-bold text-white">{businessData.business_name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{(businessData.summary || '').substring(0, 80)}{businessData.summary && businessData.summary.length > 80 ? '...' : ''}</p>
              </div>
              <div className="text-right">
                {callState === 'idle' && <div className="text-slate-500 text-sm">Ready</div>}
                {callState === 'connecting' && <div className="flex items-center gap-2 text-yellow-400"><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span><span className="text-sm">Connecting...</span></div>}
                {callState === 'active' && <div className="flex items-center gap-2 text-green-400"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span><span className="text-sm font-mono">{formatDuration(callDuration)}</span></div>}
                {callState === 'ended' && <div className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 bg-slate-400 rounded-full"></span><span className="text-sm">Ended</span></div>}
              </div>
            </div>
          </div>
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-dark-950/50">
            {transcript.length === 0 && callState === 'idle' && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-4xl mb-3">&#128222;</div>
                  <div className="text-slate-500 text-sm">Start the demo to hear the AI answer as {businessData.business_name}</div>
                  <div className="text-slate-600 text-xs mt-2">Customized with your actual services and hours</div>
                </div>
              </div>
            )}
            {callState === 'connecting' && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="flex gap-1 justify-center mb-3">
                    <span className="wave-bar"></span><span className="wave-bar"></span><span className="wave-bar"></span><span className="wave-bar"></span><span className="wave-bar"></span>
                  </div>
                  <div className="text-green-400 text-sm">{statusMessage}</div>
                </div>
              </div>
            )}
            {transcript.map((msg, i) => (
              <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start') + ' animate-slide-up'}>
                <div className={'max-w-xs sm:max-w-sm ' + (msg.role === 'agent' ? 'bg-dark-800 border border-white/10 text-white' : 'bg-green-500/20 border border-green-500/30 text-green-100') + ' rounded-2xl ' + (msg.role === 'agent' ? 'rounded-tl-sm' : 'rounded-tr-sm') + ' px-4 py-3'}>
                  <div className={'text-xs font-medium mb-1 ' + (msg.role === 'agent' ? 'text-slate-400' : 'text-green-400')}>
                    {msg.role === 'agent' ? businessData.business_name + ' AI' : 'Caller'}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
          {statusMessage && callState === 'active' && (
            <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/20 text-yellow-400 text-xs text-center">{statusMessage}</div>
          )}
          <div className="p-4 border-t border-white/10 space-y-3">
            {callState === 'idle' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Mode:</span>
                <div className="flex gap-2">
                  <button onClick={() => setUseRealCall(true)} className={'px-3 py-1 rounded-full text-xs font-medium ' + (useRealCall ? 'bg-green-500 text-white' : 'bg-dark-800 text-slate-400 border border-white/10')}>Real Call</button>
                  <button onClick={() => setUseRealCall(false)} className={'px-3 py-1 rounded-full text-xs font-medium ' + (!useRealCall ? 'bg-blue-500 text-white' : 'bg-dark-800 text-slate-400 border border-white/10')}>Simulation</button>
                </div>
              </div>
            )}
            {callState === 'idle' && (
              <button onClick={startCall} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg shadow-lg shadow-green-500/20">
                &#128222; Start Demo Call
              </button>
            )}
            {callState === 'connecting' && (
              <button disabled className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></span> Connecting...
              </button>
            )}
            {callState === 'active' && (
              <button onClick={endCall} className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3">
                &#128308; End Call
              </button>
            )}
            {callState === 'ended' && (
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center text-green-400 text-sm">
                  Call complete for {businessData.business_name} — {transcript.length} messages
                </div>
                <button onClick={() => { setCallState('idle'); setTranscript([]); }} className="w-full bg-dark-800 border border-white/10 text-white py-3 rounded-xl hover:bg-dark-700">
                  Run Another Demo
                </button>
              </div>
            )}
            {callState === 'idle' && (
              <p className="text-center text-slate-500 text-xs">Or call live: <a href="tel:+12764479695" className="text-green-400">+1 (276) 447-9695</a></p>
            )}
          </div>
        </div>
      )}

      {demoMode === 'chat' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-blue-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-3 py-1 text-xs font-medium mb-2">
                  {nicheConfig.icon} {nicheConfig.label} Chat Agent
                </div>
                <h2 className="text-xl font-bold text-white">{businessData.business_name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">AI chat — answers as your business</p>
              </div>
              {chatStarted && <div className="flex items-center gap-2 text-blue-400"><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span><span className="text-sm">Online</span></div>}
            </div>
          </div>
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-dark-950/50">
            {!chatStarted && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-4xl mb-3">&#128172;</div>
                  <div className="text-slate-500 text-sm">Chat demo for {businessData.business_name}</div>
                  <div className="text-slate-600 text-xs mt-2">Uses your actual services and business hours</div>
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start') + ' animate-slide-up'}>
                <div className={'max-w-xs sm:max-w-sm ' + (msg.role === 'agent' ? 'bg-dark-800 border border-white/10 text-white' : 'bg-blue-500/20 border border-blue-500/30 text-blue-100') + ' rounded-2xl ' + (msg.role === 'agent' ? 'rounded-tl-sm' : 'rounded-tr-sm') + ' px-4 py-3'}>
                  <div className={'text-xs font-medium mb-1 ' + (msg.role === 'agent' ? 'text-slate-400' : 'text-blue-400')}>
                    {msg.role === 'agent' ? businessData.business_name + ' AI' : 'You'}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            {chatTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-800 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="text-xs font-medium mb-1 text-slate-400">{businessData.business_name} AI</div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-white/10 space-y-3">
            {!chatStarted ? (
              <button onClick={startChat} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-500/20">
                &#128172; Start Chat Demo
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder={'Message ' + businessData.business_name + '...'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <button onClick={sendChatMessage} className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-5 py-3 rounded-xl transition-all">
                  Send
                </button>
              </div>
            )}
            {chatStarted && (
              <button onClick={() => { setChatStarted(false); setChatMessages([]); }} className="w-full text-slate-500 text-xs hover:text-slate-300 transition-colors py-1">
                Reset Chat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
                                       }
