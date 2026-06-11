import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL, SITE_URL } from './config';

const STRAPI_URL = STRAPI_BASE_URL;

// Custom fetch with timeout and retry logic
export async function fetchWithRetry(url, options = {}, retries = 1, backoff = 3000) {
  const timeout = 15000; // 15s timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok && retries > 0 && res.status >= 500) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }
    return res;
  } catch (error) {
    clearTimeout(id);
    if (retries > 0) {
      console.log(`Retrying fetch for ${url}... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    // Return a mocked failure response instead of throwing to allow graceful fallback
    console.error(`Fetch failed for ${url} after retries:`, error.message);
    return {
      ok: false,
      status: 500,
      statusText: 'Build Time Fetch Error',
      json: async () => ({ data: [] }), // Mock json response
      text: async () => error.message
    };
  }
}

/**
 * Fetches SEO data from Strapi API based on slug
 * @param {string} slug - The slug to fetch SEO data for
 * @returns {Promise<Object|null>} SEO data object or null if not found
 */
export async function fetchSEOData(slug) {
  if (!slug) return null;

  try {
    const url = `${STRAPI_URL}/seos?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
    // Use ISR with 1 hour revalidation to allow static generation
    const res = await fetchWithRetry(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error(`Failed to fetch SEO data for slug: ${slug}`);
      return null;
    }

    const json = await res.json();
    const seoData = json?.data?.[0] || null;

    return seoData;
  } catch (error) {
    console.error(`Error fetching SEO data for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Generates Next.js metadata object from SEO data
 * @param {Object} seoData - SEO data from Strapi
 * @param {string} defaultTitle - Default title if SEO data is not available
 * @param {string} defaultDescription - Default description if SEO data is not available
 * @param {string} pageUrl - The URL of the page (for OpenGraph)
 * @returns {Object} Next.js metadata object
 */
export function generateMetadataFromSEO(seoData, defaultTitle = 'Preown by applebae', defaultDescription = 'Your trusted source for premium phones and the latest gadgets', pageUrl = '') {
  if (!seoData) {
    return {
      title: defaultTitle,
      description: defaultDescription,
    };
  }

  const baseUrl = SITE_URL;
  const fullUrl = pageUrl ? `${baseUrl}${pageUrl}` : baseUrl;

  // Get image URLs
  const ogImageUrl = seoData.ogImages?.[0]?.url
    ? `${STRAPI_IMAGE_BASE_URL}${seoData.ogImages[0].url}`
    : null;

  const twitterImageUrl = seoData.twitterImage?.url
    ? `${STRAPI_IMAGE_BASE_URL}${seoData.twitterImage.url}`
    : ogImageUrl;

  const metadata = {
    title: seoData.title || defaultTitle,
    description: seoData.description || defaultDescription,
    keywords: seoData.keywords ? seoData.keywords.split(',').map(k => k.trim()) : undefined,
    robots: seoData.robotsMeta || undefined,
    alternates: seoData.canonicalUrl ? {
      canonical: seoData.canonicalUrl,
    } : undefined,
    openGraph: {
      title: seoData.ogTitle || seoData.title || defaultTitle,
      description: seoData.ogDescription || seoData.description || defaultDescription,
      url: seoData.ogUrl || fullUrl,
      type: seoData.ogType || 'website',
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.twitterTitle || seoData.title || defaultTitle,
      description: seoData.twitterDescription || seoData.description || defaultDescription,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };

  // Remove undefined values
  Object.keys(metadata).forEach(key => {
    if (metadata[key] === undefined) {
      delete metadata[key];
    }
  });

  if (metadata.openGraph && Object.keys(metadata.openGraph).length === 0) {
    delete metadata.openGraph;
  }

  if (metadata.twitter && Object.keys(metadata.twitter).length === 0) {
    delete metadata.twitter;
  }

  return metadata;
}

/**
 * Renders structured data JSON-LD script tag
 * @param {Object} seoData - SEO data from Strapi
 * @returns {string|null} JSON-LD script content or null
 */
export function getStructuredData(seoData) {
  if (!seoData?.structuredData) return null;

  try {
    // If structuredData is already a string, parse it
    const structuredData = typeof seoData.structuredData === 'string'
      ? JSON.parse(seoData.structuredData)
      : seoData.structuredData;

    return structuredData;
  } catch (error) {
    console.error('Error parsing structured data:', error);
    return null;
  }
}

