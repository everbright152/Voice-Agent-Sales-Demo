'use client';

import { useState, useEffect } from 'react';

interface WorkflowVisualizerProps {
  isCallActive: boolean;
  currentStep: number;
}

const WORKFLOW_STEPS = [
  {
    icon: '📞',
    label: 'Incoming Call',
    description: 'Client calls your business number',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: '🤖',
    label: 'AI Answers',
    description: 'Retell AI picks up instantly (0 rings)',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    icon: '🧠',
    label: 'Data Captured',
    description: 'Name, phone, reason — all captured',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: '⚡',
    label: 'Make.com Triggered',
    description: 'Automation workflow fires instantly',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    icon: '💾',
    label: 'Lead Stored',
    description: 'Contact saved to CRM / database',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  {
    icon: '📱',
    label: 'SMS Sent',
    description: 'Confirmation text sent via Twilio',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  {
    icon: '📅',
    label: 'Booking Link Sent',
    description: 'Appointment link delivered to client',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
  },
];

export default function WorkflowVisualizer({ isCallActive, currentStep }: WorkflowVisualizerProps) {
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (isCallActive) {
      // Animate through steps as call progresses
      setActiveStep(0);
      setCompletedSteps([]);
      
      const delays = [0, 2000, 5000, 8000, 10000, 12000, 15000];
      
      delays.forEach((delay, i) => {
        setTimeout(() => {
          setActiveStep(i);
          if (i > 0) {
            setCompletedSteps(prev => [...prev, i - 1]);
          }
        }, delay);
      });
    } else {
      if (completedSteps.length > 0) {
        // Call ended — mark all as completed
        setActiveStep(-1);
        setCompletedSteps(WORKFLOW_STEPS.map((_, i) => i));
      }
    }
  }, [isCallActive]);

  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) return 'completed';
    if (activeStep === index) return 'active';
    return 'pending';
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Live Workflow</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {isCallActive ? (
            <>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Active
            </>
          ) : completedSteps.length > 0 ? (
            <>
              <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
              Completed
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
              Start a call to see this live
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {WORKFLOW_STEPS.map((step, i) => {
          const status = getStepStatus(i);
          return (
            <div key={i} className="flex items-center gap-3">
              {/* Step indicator */}
              <div className={`workflow-step flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-base transition-all duration-500 ${
                status === 'completed' 
                  ? 'bg-green-500/20 border-green-500/50 scale-95' 
                  : status === 'active'
                    ? `${step.bgColor} ${step.borderColor} scale-110 shadow-lg`
                    : 'bg-dark-900 border-white/10 opacity-40'
              }`}>
                {status === 'completed' ? '✓' : step.icon}
              </div>
              
              {/* Step info */}
              <div className={`flex-1 transition-all duration-500 ${status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`text-sm font-medium ${
                  status === 'active' ? step.color : status === 'completed' ? 'text-green-400' : 'text-slate-400'
                }`}>
                  {step.label}
                  {status === 'active' && (
                    <span className="ml-2 text-xs font-normal animate-pulse">Processing...</span>
                  )}
                </div>
                <div className="text-xs text-slate-600">{step.description}</div>
              </div>

              {/* Status indicator */}
              <div className="flex-shrink-0">
                {status === 'completed' && (
                  <span className="text-green-400 text-xs font-medium">Done</span>
                )}
                {status === 'active' && (
                  <span className={`${step.color} text-xs`}>
                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full inline-block animate-spin"></span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isCallActive && completedSteps.length === 0 && (
        <div className="mt-4 p-3 bg-dark-900/50 rounded-xl text-center text-xs text-slate-500">
          This panel animates in real-time during a demo call, showing how your AI agent handles every step automatically — from answering to booking.
        </div>
      )}

      {!isCallActive && completedSteps.length > 0 && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center text-xs text-green-400">
          ✓ Full workflow completed — lead captured, SMS sent, booking link delivered
        </div>
      )}
    </div>
  );
}
