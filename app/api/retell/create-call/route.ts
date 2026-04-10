import { NextRequest, NextResponse } from 'next/server';
import { BusinessData, NicheType } from '@/lib/types';
import { buildFinalPrompt } from '@/lib/prompts';

// ============================================================
// MrCeesAI — Retell AI Web Call Creator
// Creates a web call session with dynamic prompt injection
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const { businessData, niche } = await request.json() as {
      businessData: BusinessData;
      niche: NicheType;
    };

    const RETELL_API_KEY = process.env.RETELL_API_KEY;
    const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID || 'agent_419c1065694c58b9aa7d691a60';

    if (!RETELL_API_KEY) {
      return NextResponse.json({ 
        error: 'Retell API key not configured. Add RETELL_API_KEY to your .env.local file.' 
      }, { status: 500 });
    }

    // Build the dynamic prompt for this specific business
    const finalPrompt = buildFinalPrompt(niche, businessData);

    // Create a web call via Retell API
    const retellResponse = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: RETELL_AGENT_ID,
        // Override the agent's prompt dynamically for this business
        retell_llm_dynamic_variables: {
          business_name: businessData.business_name,
          business_summary: businessData.summary,
          business_hours: businessData.hours,
          business_services: businessData.services.join(', '),
          business_location: businessData.locations.join(', '),
          business_phone: businessData.phone,
          business_email: businessData.email,
          booking_link: businessData.booking_link,
          industry: niche,
        },
        // Override the full prompt
        override_agent_config: {
          prompt: finalPrompt,
        },
      }),
    });

    if (!retellResponse.ok) {
      const errorData = await retellResponse.json();
      console.error('Retell API error:', errorData);
      
      // If override fails, try basic call without override
      const basicResponse = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RETELL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: RETELL_AGENT_ID,
        }),
      });

      if (!basicResponse.ok) {
        const basicError = await basicResponse.json();
        return NextResponse.json({ 
          error: 'Failed to create Retell call',
          details: basicError 
        }, { status: 500 });
      }

      const basicData = await basicResponse.json();
      return NextResponse.json({ 
        ...basicData,
        note: 'Using base agent config (prompt override not supported on your plan)',
      });
    }

    const callData = await retellResponse.json();
    
    // Also trigger Make.com webhook (async, non-blocking)
    if (process.env.MAKE_WEBHOOK_URL) {
      fetch(process.env.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'demo_call_started',
          business_name: businessData.business_name,
          niche,
          timestamp: new Date().toISOString(),
          call_id: callData.call_id,
        }),
      }).catch(console.error);
    }

    return NextResponse.json(callData);
  } catch (error) {
    console.error('Create call error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
