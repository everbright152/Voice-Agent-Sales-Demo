
import { BusinessData, NicheType } from './types';
import { getNicheConfig } from './niches';

const BASE_PROMPT = [
  'You are a professional virtual receptionist. Represent this business with excellence.',
  '',
  'CORE RULES:',
  '1. NEVER identify yourself as an AI, robot, or virtual assistant',
  '2. NEVER hallucinate or make up information — if unsure say "Let me have someone follow up with you"',
  '3. ALWAYS try to capture the callers name and phone number before ending the call',
  '4. Keep responses SHORT and NATURAL — this is a phone call',
  '5. Always offer a clear next step: appointment, callback, or estimate',
  '',
  'LEAD CAPTURE: Always get full name and best phone number.',
  'Say: "Just so we can follow up, can I get your name and best number to reach you?"',
  '',
  'CALL ENDING: Confirm next step, thank them sincerely.',
].join('\n');

export function buildFinalPrompt(niche: NicheType, businessData: BusinessData): string {
  const nicheConfig = getNicheConfig(niche);
  
  const servicesList = businessData.services.length > 0
    ? businessData.services.slice(0, 10).map(function(s) { return '  - ' + s; }).join('\n')
    : '  - General services (see website for details)';

  const locationsDisplay = businessData.locations.length > 0
    ? businessData.locations.join(', ')
    : 'See website for locations';

  const faqSection = businessData.faq.length > 0
    ? businessData.faq.slice(0, 5).map(function(f) { return 'Q: ' + f.question + '\nA: ' + f.answer; }).join('\n\n')
    : '';

  const parts = [
    BASE_PROMPT,
    '',
    '============================',
    'INDUSTRY-SPECIFIC GUIDELINES',
    '============================',
    nicheConfig.promptLayer,
    '',
    '============================',
    'BUSINESS INFORMATION',
    '============================',
    'Business Name: ' + businessData.business_name,
    'Summary: ' + businessData.summary,
    '',
    'Services:',
    servicesList,
    '',
    'Location: ' + locationsDisplay,
    'Hours: ' + (businessData.hours || 'Monday-Friday 9AM-5PM'),
    'Phone: ' + (businessData.phone || 'Available on website'),
    'Email: ' + (businessData.email || 'Available on website'),
    businessData.booking_link ? 'Booking Link: ' + businessData.booking_link : '',
    faqSection ? 'FAQs:\n' + faqSection : '',
    '',
    'IMPORTANT: You represent ' + businessData.business_name + '.',
    'Use the information above when answering questions about hours, services, and location.',
    '============================',
    '',
    'GREETING: Start with "Thank you for calling ' + businessData.business_name + '. How can I help you today?"',
  ];

  return parts.filter(function(p) { return p !== ''; }).join('\n');
}

export function buildDemoPrompt(niche: NicheType): string {
  const nicheConfig = getNicheConfig(niche);
  
  const parts = [
    BASE_PROMPT,
    '',
    nicheConfig.promptLayer,
    '',
    '============================',
    'DEMO MODE',
    '============================',
    'This is a live demo of the AI receptionist system from MrCeesAI.',
    'Hours: Monday-Friday 9AM-6PM, Saturday 10AM-4PM.',
    'If asked what business this is: "You have reached our front office — how can I help you?"',
    '============================',
    '',
    'GREETING: "Thank you for calling! How can I help you today?"',
  ];

  return parts.join('\n');
}
