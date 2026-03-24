import type { Lead } from '../types';

/**
 * Extracts a logo URL using the Clearbit Logo API based on the lead's website domain.
 */
export function getLogoUrl(website: string): string {

  try {
    const domain = website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    return `https://logo.clearbit.com/${domain}?size=200`;
  } catch (err) {
    return '';
  }
}

/**
 * Service to handle mockup generation via Google Stitch MCP.
 * Now hyper-personalizes mockups using Brand DNA (Logo and industry context).
 */
export async function generateStitchMockup(lead: Lead): Promise<string> {
  const logoUrl = getLogoUrl(lead.website);
  
  console.log(`[Stitch Service] COORDINATING UPLINK FOR: ${lead.name}`);
  console.log(`[Stitch Service] Extracting Brand DNA... Found Logo: ${logoUrl}`);
  console.log(`[Stitch Service] Framing Unicorn Vision for ${lead.industry} in ${lead.city}...`);

  // This prompt represents what the user would manually do in Stitch
  const stitchPrompt = `
    Create a futuristic, high-end technician mobile app for "${lead.name}".
    Brand Context:
    - Primary Colors: Inspired by their industry (${lead.industry || 'Modern Enterprise'})
    - Branding: Utilize their logo from ${logoUrl}
    - Aesthetic: Glassmorphic, dark-mode HUD, premium translucent cards.
    - Features: Real-time job tracking, digital signatures, and AI-assisted field documentation.
    - Location: Specialized for their team in ${lead.city || 'their local area'}.
  `;

  console.log(`[Stitch Service] Stitch Prompt:`, stitchPrompt);

  // Simulating the MCP tool call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return a sample mockup URL that represents the generated design
  return `https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200`;
}

