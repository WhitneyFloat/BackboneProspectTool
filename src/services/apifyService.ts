const APIFY_TOKEN = import.meta.env.VITE_APIFY_API_TOKEN;

// Act 1: Google Maps Scraper (nwua/google-maps-scraper)
export async function scrapeGoogleMaps(query: string, maxResults: number) {
  validateToken();
  const input = {
    searchStringsArray: [query],
    maxCrawledPlacesPerSearch: maxResults,
    language: "en",
    maxImages: 1,
    maxReviews: 0,
    exportPlaceUrls: false,
    includeWebResults: false,
  };
  return runApifyActor('nwua~google-maps-scraper', input);
}

// Act 2: LinkedIn Profile Scraper (curious_coder/linkedin-profile-scraper)
export async function scrapeLinkedInProfiles(urls: string[]) {
  validateToken();
  const input = {
    profileUrls: urls,
    // Add other LinkedIn specific inputs if needed (e.g. proxy configuration)
  };
  return runApifyActor('curious_coder~linkedin-profile-scraper', input);
}

// Act 3: Website Contact Scraper (jakubbalada/contact-email-scraper)
export async function scrapeWebsiteContacts(urls: string[]) {
  validateToken();
  const input = {
    startUrls: urls.map(url => ({ url })),
    maxRequestsPerCrawl: 50,
    maxRequestsPerStartUrl: 10,
    ignoreImageExt: true,
    ignoreVideoExt: true,
  };
  return runApifyActor('jakubbalada~contact-email-scraper', input);
}

// Act 4: State License Databases (Generic or Specific)
export async function scrapeStateLicenses(state: string, trade: string) {
  validateToken();
  const input = {
    state,
    trade,
    // Note: State Board scrapers are specialized. 
    // Example: CSLB (California) scraper actor ID: 'apify/cslb-scraper' (if available)
  };
  return runApifyActor('apify~state-license-scraper', input); // Generic placeholder
}

// Helper: Generic Apify Actor Runner
async function runApifyActor(actorId: string, input: any) {
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      throw new Error(`Apify Run failed for ${actorId}: ${response.statusText}`);
    }

    const { data: run } = await response.json();
    
    // For this app, we poll the dataset once the run is finished.
    // In a production app, we'd use webhooks or background polling.
    // We'll fetch the results from the default dataset.
    const resultsResponse = await fetch(
      `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${APIFY_TOKEN}`
    );
    
    return await resultsResponse.json();
  } catch (error) {
    console.error(`Apify Scrape Error (${actorId}):`, error);
    throw error;
  }
}

function validateToken() {
  if (!APIFY_TOKEN || APIFY_TOKEN === 'your_apify_token_here') {
    throw new Error('Apify token not configured. Please add it to your .env file.');
  }
}
