// Descript Metadata Fetcher
// Extracts metadata from Descript share URLs and provides framework for API integration

/**
 * Extract project ID from Descript share URL
 * @param {string} shareUrl - Descript share URL (e.g., https://share.descript.com/view/1yBN4l3yaRL)
 * @returns {string|null} - Project ID or null if invalid
 */
function extractDescriptProjectId(shareUrl) {
  try {
    const url = new URL(shareUrl);
    if (url.hostname === 'share.descript.com' && url.pathname.startsWith('/view/')) {
      return url.pathname.split('/view/')[1];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Attempt to fetch video metadata from Descript (experimental)
 * Currently tries to scrape public metadata, future: use official API
 * @param {string} shareUrl - Descript share URL
 * @returns {Promise<Object>} - Video metadata
 */
async function fetchDescriptMetadata(shareUrl) {
  const projectId = extractDescriptProjectId(shareUrl);
  if (!projectId) {
    throw new Error('Invalid Descript share URL');
  }

  try {
    // Use dynamic import for fetch in Node.js environments
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    
    // Attempt to fetch the page and extract metadata
    const response = await fetch(shareUrl, {
      headers: {
        'User-Agent': 'ACT-Brand-Guide-Bot/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract metadata from HTML meta tags and structured data
    const metadata = {
      title: extractMetaContent(html, 'title') || extractFromTitle(html) || 'Untitled Descript Video',
      description: extractMetaContent(html, 'description') || 'Video story shared from Descript',
      duration: extractDuration(html) || null,
      transcript: extractTranscript(html) || null,
      embedUrl: convertToEmbedUrl(shareUrl),
      shareUrl: shareUrl,
      projectId: projectId,
      extractedAt: new Date().toISOString(),
      source: 'descript-metadata-scraper'
    };

    return metadata;
  } catch (error) {
    console.warn('Could not fetch Descript metadata:', error.message);
    
    // Return fallback metadata
    return {
      title: 'Video Story from Descript',
      description: 'A compelling story shared through Descript\'s video platform',
      duration: null,
      transcript: null,
      embedUrl: convertToEmbedUrl(shareUrl),
      shareUrl: shareUrl,
      projectId: projectId,
      extractedAt: new Date().toISOString(),
      source: 'descript-fallback'
    };
  }
}

/**
 * Extract content from meta tags
 */
function extractMetaContent(html, property) {
  // Try various meta tag formats
  const patterns = [
    new RegExp(`<meta\\s+property="og:${property}"\\s+content="([^"]*)"`, 'i'),
    new RegExp(`<meta\\s+name="${property}"\\s+content="([^"]*)"`, 'i'),
    new RegExp(`<meta\\s+content="([^"]*)"\\s+property="og:${property}"`, 'i'),
    new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${property}"`, 'i')
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return decodeHtmlEntities(match[1]);
    }
  }
  return null;
}

/**
 * Extract title from HTML title tag
 */
function extractFromTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? decodeHtmlEntities(match[1]) : null;
}

/**
 * Extract duration from various possible sources
 */
function extractDuration(html) {
  // Look for duration in structured data or meta tags
  const patterns = [
    /"duration":\s*"([^"]*)"/, 
    /"PT(\d+M\d+S)"/, 
    /duration['"]\s*:\s*['"]([^'"]*)['"]/
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Extract transcript if available in page
 */
function extractTranscript(html) {
  // Look for transcript data in script tags or data attributes
  const patterns = [
    /"transcript":\s*"([^"]*)"/, 
    /transcript['"]\s*:\s*['"]([^'"]*)['"]/
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return decodeHtmlEntities(match[1]);
    }
  }
  return null;
}

/**
 * Convert share URL to embed URL
 */
function convertToEmbedUrl(shareUrl) {
  const projectId = extractDescriptProjectId(shareUrl);
  if (projectId) {
    return `https://share.descript.com/embed/${projectId}`;
  }
  return shareUrl;
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  return text.replace(/&[#\w]+;/g, entity => entities[entity] || entity);
}

/**
 * Future: Official Descript API integration
 * This function will be implemented when Descript provides public API access
 */
async function fetchDescriptAPIMetadata(shareUrl, apiKey) {
  // Placeholder for future official API integration
  // const projectId = extractDescriptProjectId(shareUrl);
  // const response = await fetch(`https://api.descript.com/v1/projects/${projectId}`, {
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json'
  //   }
  // });
  // return response.json();
  
  throw new Error('Official Descript API integration not yet available. Contact Descript for API access.');
}

/**
 * Main function to get Descript metadata
 * @param {string} shareUrl - Descript share URL
 * @param {Object} options - Options (apiKey for future use)
 * @returns {Promise<Object>} - Video metadata
 */
async function getDescriptMetadata(shareUrl, options = {}) {
  if (options.apiKey) {
    try {
      return await fetchDescriptAPIMetadata(shareUrl, options.apiKey);
    } catch (error) {
      console.warn('API method failed, falling back to scraping:', error.message);
    }
  }

  return await fetchDescriptMetadata(shareUrl);
}

module.exports = {
  getDescriptMetadata,
  extractDescriptProjectId,
  convertToEmbedUrl
}; 