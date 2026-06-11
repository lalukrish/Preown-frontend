import Link from 'next/link';
import { fetchSEOData, generateMetadataFromSEO, getStructuredData, fetchWithRetry } from '@/utils/seo';
import ProductDetailClient from './ProductDetailClient';
import PhoneSelectorSection from '@/components/sections/PhoneSelectorSection/PhoneSelectorSection';
import styles from './ProductDetail.module.css';
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL, SITE_URL } from '@/utils/config';

// Build query string manually to avoid URLSearchParams encoding issues
const buildQuery = (field, value, populate = '*') => {
  return `filters[${field}][$eq]=${encodeURIComponent(value)}&populate=${populate}`;
};

async function fetchProduct(slug) {
  if (!slug) return null;

  // Try to fetch by slug first
  try {
    const query = buildQuery('slug', slug);
    let url = `${STRAPI_BASE_URL}/products?${query}`;
    let res = await fetchWithRetry(url, { next: { revalidate: 3600 } });

    if (res.ok) {
      const json = await res.json();
      const first = Array.isArray(json?.data) ? json.data[0] : null;
      if (first) {
        return first;
      }
    }
  } catch (e) {
    console.log("Error fetching by slug:", e);
  }

  // If not found by slug, try by documentId
  try {
    const query = buildQuery('documentId', slug);
    let url = `${STRAPI_BASE_URL}/products?${query}`;
    let res = await fetchWithRetry(url, { next: { revalidate: 3600 } });

    if (res.ok) {
      const json = await res.json();
      const first = Array.isArray(json?.data) ? json.data[0] : null;
      if (first) {
        return first;
      }
    }
  } catch (e) {
    console.log("Error fetching by documentId:", e);
  }

  // If still not found, try by id (numeric)
  const numericId = parseInt(slug, 10);
  if (!isNaN(numericId)) {
    try {
      const query = buildQuery('id', numericId);
      let url = `${STRAPI_BASE_URL}/products?${query}`;
      let res = await fetchWithRetry(url, { next: { revalidate: 3600 } });

      if (res.ok) {
        const json = await res.json();
        const first = Array.isArray(json?.data) ? json.data[0] : null;
        if (first) {
          return first;
        }
      }
    } catch (e) {
      console.log("Error fetching by id:", e);
    }
  }

  return null;
}

// Helper function to get image URL
function getImageUrl(image) {
  if (!image) return null;
  if (Array.isArray(image) && image.length > 0) {
    return `${STRAPI_IMAGE_BASE_URL}${image[0]?.url}`;
  }
  if (image.url) {
    return `${STRAPI_IMAGE_BASE_URL}${image.url}`;
  }
  return null;
}

// Helper function to get description text
function getDescriptionText(description) {
  if (!description) return '';
  if (Array.isArray(description)) {
    return description
      .map((block) => block.children?.map((child) => child.text).join('') || '')
      .join(' ');
  }
  return description;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found - Preown by applebae',
      description: 'The product you are looking for does not exist.',
    };
  }

  const productName = product.name || 'Product';
  const productDescription = getDescriptionText(product.description) ||
    `Buy ${productName} at Preown by applebae. Premium pre-owned phones and gadgets at unbeatable prices.`;
  const productImage = getImageUrl(product.image);
  const pageUrl = `${SITE_URL}/products/${slug}`;

  // Try to fetch SEO data from Strapi
  const seoData = await fetchSEOData(`products/${slug}`);

  // If SEO data exists, use it; otherwise generate from product data
  if (seoData) {
    return generateMetadataFromSEO(seoData, productName, productDescription, pageUrl);
  }

  // Generate metadata from product data
  return {
    title: `${productName} - Preown by applebae`,
    description: productDescription,
    keywords: [
      productName,
      'pre-owned phones',
      'used phones',
      'refurbished phones',
      'premium gadgets',
      'Calicut',
      'Kochi',
      'Kerala',
    ],
    openGraph: {
      title: `${productName} - Preown by applebae`,
      description: productDescription,
      url: pageUrl,
      type: 'website',
      images: productImage ? [{ url: productImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} - Preown by applebae`,
      description: productDescription,
      images: productImage ? [productImage] : undefined,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
        <Link href="/products" className={styles.backButton}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  // Fetch SEO data for structured data
  const seoData = await fetchSEOData(`products/${slug}`);
  const structuredData = getStructuredData(seoData);

  // Generate Product structured data if not available from SEO
  let productStructuredData = structuredData;
  if (!productStructuredData) {
    const imageUrl = getImageUrl(product.image);
    productStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: getDescriptionText(product.description),
      image: imageUrl ? [imageUrl] : undefined,
      offers: product.price ? {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/products/${slug}`,
      } : undefined,
      brand: {
        '@type': 'Brand',
        name: 'Preown by applebae',
      },
    };
  }

  return (
    <>
      {productStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        />
      )}
      <ProductDetailClient product={product} />
      <PhoneSelectorSection />

    </>
  );
}
