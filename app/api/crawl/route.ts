import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { BusinessData, NicheType } from '@/lib/types';

// ============================================================
// MrCeesAI — Website Crawler API
// Extracts business data from any website URL
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const { url, niche } = await request.json();

    if (!url || !niche) {
      return NextResponse.json({ error: 'URL and niche are required' }, { status: 400 });
    }

    // Normalize the URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Fetch the website
    let html = '';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MrCeesAI-Bot/1.0; +https://mrceesai.com)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      html = await response.text();
    } catch (fetchError) {
      // If fetch fails, return a template with the URL domain
      const domain = extractDomain(normalizedUrl);
      return NextResponse.json({
        success: true,
        data: createTemplateData(domain, niche as NicheType, normalizedUrl),
        partial: true,
        message: 'Could not access website directly — here is a template you can fill in.',
      });
    }

    // Parse the HTML
    const $ = cheerio.load(html);
    
    // Remove script and style tags
    $('script, style, nav, footer, .nav, .footer, .header, .menu, .cookie, .popup, .modal, .overlay').remove();

    // Extract data
    const businessName = extractBusinessName($, normalizedUrl);
    const services = extractServices($);
    const hours = extractHours($);
    const locations = extractLocations($);
    const phone = extractPhone($);
    const email = extractEmail($);
    const bookingLink = extractBookingLink($, normalizedUrl);
    const faq = extractFAQ($);
    const summary = extractSummary($, businessName);

    const businessData: BusinessData = {
      business_name: businessName,
      industry: niche as NicheType,
      services,
      locations,
      hours,
      phone,
      email,
      faq,
      booking_link: bookingLink,
      summary,
      website_url: normalizedUrl,
    };

    return NextResponse.json({ success: true, data: businessData });
  } catch (error) {
    console.error('Crawler error:', error);
    return NextResponse.json({ 
      error: 'Failed to crawl website', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// ============================================================
// Extraction Helpers
// ============================================================

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url.replace(/https?:\/\//, '').replace('www.', '').split('/')[0];
  }
}

function extractBusinessName($: cheerio.CheerioAPI, url: string): string {
  // Try various selectors for business name
  const candidates = [
    $('meta[property="og:site_name"]').attr('content'),
    $('meta[name="application-name"]').attr('content'),
    $('[class*="logo"] img').attr('alt'),
    $('[class*="brand"] img').attr('alt'),
    $('h1').first().text().trim(),
    $('title').text().trim().split('|')[0].split('-')[0].trim(),
    $('title').text().trim().split('–')[0].trim(),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate && candidate.length > 2 && candidate.length < 80) {
      // Clean up common suffixes
      return candidate
        .replace(/\s*[-|]\s*Home.*$/i, '')
        .replace(/\s*[-|]\s*Welcome.*$/i, '')
        .trim();
    }
  }
  
  return extractDomain(url).split('.')[0].replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function extractServices($: cheerio.CheerioAPI): string[] {
  const services: string[] = [];
  const seen = new Set<string>();
  
  // Look for service sections
  const serviceSelectors = [
    '[class*="service"] li',
    '[class*="services"] li',
    '[id*="service"] li',
    '[class*="offer"] li',
    '[class*="treatment"] li',
    '[class*="practice"] li',
    'ul li',
  ];

  for (const selector of serviceSelectors) {
    $(selector).each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 3 && text.length < 80 && !seen.has(text.toLowerCase())) {
        // Filter out navigation items
        if (!text.match(/^(home|about|contact|blog|news|login|sign|privacy|terms)/i)) {
          seen.add(text.toLowerCase());
          services.push(text);
        }
      }
    });
    if (services.length >= 8) break;
  }

  // If no services found, try headings in service sections
  if (services.length === 0) {
    $('[class*="service"] h3, [class*="service"] h4, [class*="services"] h2').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 3 && text.length < 80 && !seen.has(text.toLowerCase())) {
        seen.add(text.toLowerCase());
        services.push(text);
      }
    });
  }

  return services.slice(0, 10);
}

function extractHours($: cheerio.CheerioAPI): string {
  // Look for hours in various places
  const hoursSelectors = [
    '[class*="hours"]',
    '[class*="schedule"]',
    '[id*="hours"]',
    '[class*="timing"]',
  ];

  for (const selector of hoursSelectors) {
    const text = $(selector).text().trim();
    if (text.length > 10 && text.length < 500) {
      // Look for day patterns
      if (text.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)/i)) {
        return text.replace(/\s+/g, ' ').substring(0, 300).trim();
      }
    }
  }

  // Try schema.org markup
  const schemaHours = $('[itemprop="openingHours"]').attr('content') || 
                      $('[itemprop="openingHours"]').text();
  if (schemaHours) return schemaHours;

  // Default
  return 'Monday-Friday: 9:00 AM - 5:00 PM (Please verify on website)';
}

function extractLocations($: cheerio.CheerioAPI): string[] {
  const locations: string[] = [];
  
  // Schema.org address
  const streetAddress = $('[itemprop="streetAddress"]').text().trim();
  const city = $('[itemprop="addressLocality"]').text().trim();
  const state = $('[itemprop="addressRegion"]').text().trim();
  
  if (streetAddress && city) {
    locations.push(`${streetAddress}, ${city}${state ? ', ' + state : ''}`);
  }

  // Google Maps embeds or addresses
  const addressText = $('[class*="address"], [class*="location"]').first().text().trim();
  if (addressText && addressText.length > 5 && addressText.length < 200) {
    if (!locations.includes(addressText)) {
      locations.push(addressText.substring(0, 200));
    }
  }

  return locations.slice(0, 3);
}

function extractPhone($: cheerio.CheerioAPI): string {
  // Schema.org
  const schemaTel = $('[itemprop="telephone"]').text().trim();
  if (schemaTel) return schemaTel;
  
  // Tel links
  const telLink = $('a[href^="tel:"]').first().attr('href');
  if (telLink) return telLink.replace('tel:', '');
  
  // Text pattern matching
  const bodyText = $('body').text();
  const phoneMatch = bodyText.match(/(?:\+1[\s.-]?)?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}/);
  if (phoneMatch) return phoneMatch[0];
  
  return '';
}

function extractEmail($: cheerio.CheerioAPI): string {
  // Email links
  const emailLink = $('a[href^="mailto:"]').first().attr('href');
  if (emailLink) return emailLink.replace('mailto:', '').split('?')[0];
  
  // Text pattern
  const bodyText = $('body').text();
  const emailMatch = bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !emailMatch[0].includes('example.com') && !emailMatch[0].includes('sentry')) {
    return emailMatch[0];
  }
  
  return '';
}

function extractBookingLink($: cheerio.CheerioAPI, baseUrl: string): string {
  const bookingKeywords = ['book', 'schedule', 'appointment', 'reserve', 'calendar', 'request'];
  
  const bookingLink = $('a').filter((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().toLowerCase();
    return bookingKeywords.some(kw => text.includes(kw) || href.includes(kw));
  }).first().attr('href');
  
  if (bookingLink) {
    if (bookingLink.startsWith('http')) return bookingLink;
    if (bookingLink.startsWith('/')) {
      try {
        const base = new URL(baseUrl);
        return base.origin + bookingLink;
      } catch {
        return bookingLink;
      }
    }
  }
  
  return '';
}

function extractFAQ($: cheerio.CheerioAPI): Array<{question: string, answer: string}> {
  const faqs: Array<{question: string, answer: string}> = [];
  
  // Schema.org FAQ
  $('[itemtype*="FAQPage"] [itemtype*="Question"]').each((_, el) => {
    const question = $(el).find('[itemprop="name"]').text().trim();
    const answer = $(el).find('[itemprop="acceptedAnswer"] [itemprop="text"]').text().trim();
    if (question && answer) {
      faqs.push({ question: question.substring(0, 200), answer: answer.substring(0, 500) });
    }
  });

  // Accordion/details patterns
  if (faqs.length === 0) {
    $('details, [class*="faq-item"], [class*="accordion-item"]').each((_, el) => {
      const question = $(el).find('summary, [class*="question"], [class*="title"], h3, h4').first().text().trim();
      const answer = $(el).find('[class*="answer"], [class*="content"], p').first().text().trim();
      if (question && answer && question.length < 200) {
        faqs.push({ question, answer: answer.substring(0, 500) });
      }
    });
  }

  return faqs.slice(0, 5);
}

function extractSummary($: cheerio.CheerioAPI, businessName: string): string {
  // Try meta description first
  const metaDesc = $('meta[name="description"]').attr('content') || 
                    $('meta[property="og:description"]').attr('content');
  
  if (metaDesc && metaDesc.length > 20) {
    return metaDesc.substring(0, 300);
  }
  
  // Try hero text
  const heroText = $('h1, h2, [class*="hero"] p, [class*="banner"] p').first().text().trim();
  if (heroText && heroText.length > 20) {
    return heroText.substring(0, 300);
  }
  
  return `${businessName} is a professional business serving clients with high-quality services.`;
}

function createTemplateData(domain: string, niche: NicheType, url: string): BusinessData {
  const businessName = domain.split('.')[0].replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  const nicheServices: Record<NicheType, string[]> = {
    legal: ['Personal Injury', 'Family Law', 'Criminal Defense', 'Business Law', 'Estate Planning'],
    beauty: ['Haircuts & Styling', 'Color Services', 'Facials', 'Waxing', 'Nail Services', 'Eyelash Extensions'],
    healthcare: ['New Patient Exams', 'Cleanings & Preventive Care', 'Teeth Whitening', 'Emergency Care', 'Orthodontics'],
    home_services: ['Lawn Mowing', 'Landscaping Design', 'Hedge Trimming', 'Leaf Removal', 'Irrigation'],
    financial: ['Tax Preparation', 'Bookkeeping', 'Business Accounting', 'Payroll Services', 'Financial Planning'],
  };

  return {
    business_name: businessName,
    industry: niche,
    services: nicheServices[niche],
    locations: [],
    hours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    phone: '',
    email: '',
    faq: [],
    booking_link: '',
    summary: `${businessName} provides professional ${niche.replace('_', ' ')} services. Please edit the details below to customize your demo.`,
    website_url: url,
  };
      }
