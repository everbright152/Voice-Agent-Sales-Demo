
import { NextRequest, NextResponse } from 'next/server';
import { BusinessData, NicheType } from '@/lib/types';

// ============================================================
// MrCeesAI — Website Crawler API
// Extracts business data from any website URL
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url: string; niche: string };
    const { url, niche } = body;

    if (!url || !niche) {
      return NextResponse.json({ error: 'URL and niche are required' }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    let html = '';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(normalizedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MrCeesAI-Bot/1.0)' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      html = await response.text();
    } catch {
      const domain = extractDomain(normalizedUrl);
      return NextResponse.json({
        success: true,
        data: createTemplateData(domain, niche as NicheType, normalizedUrl),
        partial: true,
        message: 'Could not access website — here is a template you can fill in.',
      });
    }

    const businessData = parseHTML(html, niche as NicheType, normalizedUrl);
    return NextResponse.json({ success: true, data: businessData });

  } catch (error) {
    console.error('Crawler error:', error);
    return NextResponse.json({ error: 'Failed to crawl website' }, { status: 500 });
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url.replace(/https?:\/\//, '').replace('www.', '').split('/')[0];
  }
}

function parseHTML(html: string, niche: NicheType, url: string): BusinessData {
  // Simple regex-based extraction (no cheerio dependency needed)
  const getText = (regex: RegExp) => { const m = html.match(regex); return m ? m[1].replace(/<[^>]+>/g, '').trim() : ''; };
  
  const title = getText(/<title[^>]*>([^<]+)<\/title>/i) || extractDomain(url);
  const metaDesc = getText(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                   getText(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const ogTitle = getText(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
  
  const businessName = ogTitle || title.split('|')[0].split('-')[0].trim() ||
    extractDomain(url).split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  // Phone
  const phoneMatch = html.match(/href=["']tel:([^"']+)["']/i);
  const phone = phoneMatch ? phoneMatch[1] : '';

  // Email
  const emailMatch = html.match(/href=["']mailto:([^"'?]+)/i);
  const email = emailMatch ? emailMatch[1] : '';

  // Hours pattern
  const hoursMatch = html.match(/(monday|mon)[\s\S]{0,200}?(friday|fri)[\s\S]{0,50}?(\d{1,2}:\d{2}[^<]{0,20})/i);
  const hours = hoursMatch ? `Mon-Fri: ${hoursMatch[3]}` : 'Monday-Friday: 9:00 AM - 5:00 PM';

  const summary = metaDesc || `${businessName} provides professional services.`;

  return {
    business_name: businessName,
    industry: niche,
    services: getDefaultServices(niche),
    locations: [],
    hours,
    phone,
    email,
    faq: [],
    booking_link: '',
    summary: summary.substring(0, 300),
    website_url: url,
  };
}

function getDefaultServices(niche: NicheType): string[] {
  const map: Record<NicheType, string[]> = {
    legal: ['Personal Injury', 'Family Law', 'Criminal Defense', 'Business Law', 'Estate Planning'],
    beauty: ['Haircuts & Styling', 'Color Services', 'Facials', 'Waxing', 'Nail Services'],
    healthcare: ['New Patient Exams', 'Cleanings', 'Emergency Care', 'X-Rays', 'Orthodontics'],
    home_services: ['Lawn Mowing', 'Landscaping', 'Hedge Trimming', 'Leaf Removal', 'Mulching'],
    financial: ['Tax Preparation', 'Bookkeeping', 'Business Accounting', 'Payroll', 'Planning'],
  };
  return map[niche] || [];
}

function createTemplateData(domain: string, niche: NicheType, url: string): BusinessData {
  const businessName = domain.split('.')[0].replace(/-/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
  return {
    business_name: businessName,
    industry: niche,
    services: getDefaultServices(niche),
    locations: [],
    hours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    phone: '',
    email: '',
    faq: [],
    booking_link: '',
    summary: `${businessName} provides professional ${niche.replace('_', ' ')} services.`,
    website_url: url,
  };
}
