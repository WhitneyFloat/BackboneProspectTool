const APIFY_TOKEN = import.meta.env.VITE_APIFY_API_TOKEN;

// Diagnostic: Verify token is loaded (obfuscated)
if (import.meta.env.DEV) {
  console.log('[Apify Service] Token check:', APIFY_TOKEN ? `Loaded (${APIFY_TOKEN.slice(0, 8)}...)` : 'MISSING');
}

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
  // Using official Apify Google Maps Scraper
  return runApifyActor('apify~google-maps-scraper', input);
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
  // Using official Apify Contact Details Scraper
  return runApifyActor('apify~contact-details-scraper', input);
}

// Act 4: Yelp Scraper (apify/yelp-scraper)
export async function scrapeYelp(query: string, location: string, maxResults: number) {
  validateToken();
  const input = {
    searchTerms: [query],
    location,
    maxResultsPerTerm: maxResults,
  };
  return runApifyActor('apify~yelp-scraper', input);
}

// Act 5: Facebook Pages Scraper (apify/facebook-pages-scraper)
export async function scrapeFacebook(queries: string[], maxResults: number) {
  validateToken();
  const input = {
    searchQueries: queries,
    maxResults,
    scrapeAbout: true,
    scrapePosts: false,
  };
  return runApifyActor('apify~facebook-pages-scraper', input);
}

/*
## Final Steps for Vercel

The code is now on GitHub, but for the "API token not configured" error to disappear on your live site, you **must** add the environment variables to Vercel manually.

### 1. Add Variables to Vercel
1.  Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Navigate to **Settings** > **Environment Variables**.
3.  Add the following keys (copy the values from your local `.env` file):
    - `VITE_APIFY_API_TOKEN`
    - `VITE_GEMINI_API_KEY`
    - `VITE_N8N_WEBHOOK_URL`
    - `VITE_STITCH_API_KEY`
4.  Click **Save**.

### 2. Redeploy
1.  Go to the **Deployments** tab.
2.  Find the latest deployment (it should be BUILDING now because of my push).
3.  If it hasn't started, click the three dots (...) and select **Redeploy**.

### 3. Local Verification
Don't forget to **RESTART** your local `npm run dev` server as well! I've added diagnostic logs that will show up in your browser console to confirm when the keys are loaded correctly.
*/

// Act 6: State License Databases (Generic placeholder)
export async function scrapeStateLicenses(state: string, trade: string) {
  validateToken();
  const input = {
    state,
    trade,
  };
  return runApifyActor('apify~state-license-scraper', input);
}


// Helper: Generic Apify Actor Runner
async function runApifyActor(actorId: string, input: Record<string, unknown>) {
  try {
    console.log(`[Apify Service] Starting Run for ${actorId}...`);
    
    // 1. Start the actor run and wait for it to finish (up to 60s)
    const response = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}&wait=60`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`[UPLINK_FIX_v2] Apify Run failed for ${actorId}: ${response.statusText} ${errorData.error?.message || ''}`);
    }

    const { data: run } = await response.json();
    
    if (run.status !== 'SUCCEEDED') {
      console.warn(`[Apify Service] Run ${run.id} finished with status: ${run.status}`);
      // If it's still running, we might need to fetch what we have so far
    }

    // 2. Fetch the results from the default dataset
    const resultsResponse = await fetch(
      `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${APIFY_TOKEN}`
    );
    
    if (!resultsResponse.ok) {
      throw new Error(`Failed to fetch results from dataset ${run.defaultDatasetId}`);
    }

    const results = await resultsResponse.json();
    console.log(`[Apify Service] Run Complete. Fetched ${results.length} results.`);
    return results;
  } catch (error: any) {
    console.error(`Apify Scrape Error (${actorId}):`, error);
    throw error;
  }
}

function validateToken() {
  if (!APIFY_TOKEN || APIFY_TOKEN === 'your_apify_token_here') {
    throw new Error('Apify token not configured. Please add it to your .env file and RESTART your dev server (npm run dev).');
  }
}
