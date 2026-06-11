import Image from 'next/image';
import Link from 'next/link';
import styles from './BlogDetail.module.css';
import { fetchSEOData, generateMetadataFromSEO, getStructuredData, fetchWithRetry } from '@/utils/seo';
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL, SITE_URL } from '@/utils/config';

const STRAPI_URL = STRAPI_BASE_URL;

async function fetchBlog(slug) {
  console.log("Server fetchBlog slug", slug);
  if (!slug) return null;

  // Build query string manually to avoid URLSearchParams encoding issues
  const buildQuery = (field, value, populate = '*') => {
    // Encode only the value, not the brackets in the key
    return `filters[${field}][$eq]=${encodeURIComponent(value)}&populate=${populate}`;
  };

  // Try to fetch by slug first
  try {
    const query = buildQuery('slug', slug);
    let url = `${STRAPI_URL}/blogs?${query}`;
    let res = await fetchWithRetry(url, { next: { revalidate: 3600 } });

    if (res.ok) {
      const json = await res.json();
      const first = Array.isArray(json?.data) ? json.data[0] : null;
      if (first) {
        console.log("Found blog by slug");
        return first;
      }
    } else {
      const errorText = await res.text();
      console.log("Error response:", res.status, errorText.substring(0, 200));
    }
  } catch (e) {
    console.log("Error fetching by slug:", e);
  }

  // If not found by slug, try by documentId
  try {
    const query = buildQuery('documentId', slug);
    let url = `${STRAPI_URL}/blogs?${query}`;
    let res = await fetchWithRetry(url, { next: { revalidate: 3600 } });
    console.log("Fetching by documentId:", url, "Status:", res.status);

    if (res.ok) {
      const json = await res.json();
      const first = Array.isArray(json?.data) ? json.data[0] : null;
      if (first) {
        console.log("Found blog by documentId");
        return first;
      }
    } else {
      const errorText = await res.text();
      console.log("Error response:", res.status, errorText.substring(0, 200));
    }
  } catch (e) {
    console.log("Error fetching by documentId:", e);
  }

  // If still not found, try by id (numeric)
  const numericId = parseInt(slug, 10);
  if (!isNaN(numericId)) {
    try {
      const query = buildQuery('id', numericId);
      let url = `${STRAPI_URL}/blogs?${query}`;
      let res = await fetchWithRetry(url, { next: { revalidate: 3600 } });
      console.log("Fetching by id:", url, "Status:", res.status);

      if (res.ok) {
        const json = await res.json();
        const first = Array.isArray(json?.data) ? json.data[0] : null;
        if (first) {
          console.log("Found blog by id");
          return first;
        }
      } else {
        const errorText = await res.text();
        console.log("Error response:", res.status, errorText.substring(0, 200));
      }
    } catch (e) {
      console.log("Error fetching by id:", e);
    }
  }

  console.log("Blog not found for slug:", slug);
  return null;
}

function renderDescription(description) {
  if (!Array.isArray(description)) return null;
  const paragraphs = [];
  description.forEach((block, idx) => {
    if (block?.type === 'paragraph' && Array.isArray(block.children)) {
      const text = block.children.map(c => (c?.type === 'text' ? c.text : '')).join('');
      if (text && text.trim()) {
        paragraphs.push(<p key={idx} className={styles.paragraph}>{text}</p>);
      }
    }
  });
  return paragraphs;
}

// Helper function to get description text for SEO
function getDescriptionText(description) {
  if (!description) return '';
  if (Array.isArray(description)) {
    return description
      .map((block) => block.children?.map((child) => child.text).join('') || '')
      .join(' ')
      .substring(0, 160); // Limit to 160 characters for meta description
  }
  return description.substring(0, 160);
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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  // Decode the slug in case it was URL-encoded
  const decodedSlug = decodeURIComponent(slug);
  const post = await fetchBlog(decodedSlug);

  if (!post) {
    return {
      title: 'Post Not Found - Preown by applebae',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  const title = post?.heading || 'Untitled';
  const description = getDescriptionText(post?.discription || post?.description) ||
    `Read ${title} on Preown by applebae. Discover the latest news, tips, and insights about premium phones and gadgets.`;
  const pageUrl = `${SITE_URL}/blog/${slug}`;
  const imageUrl = getImageUrl(post?.blogImage);

  // Try to fetch SEO data from Strapi
  const seoData = await fetchSEOData(`blog/${slug}`);

  // If SEO data exists, use it; otherwise generate from blog post data
  if (seoData) {
    return generateMetadataFromSEO(seoData, title, description, pageUrl);
  }

  // Generate metadata from blog post data
  return {
    title: `${title} - Preown by applebae`,
    description: description,
    keywords: [
      title,
      post?.category || 'Blog',
      'pre-owned phones',
      'used phones',
      'refurbished phones',
      'premium gadgets',
      'Calicut',
      'Kochi',
      'Kerala',
    ],
    openGraph: {
      title: `${title} - Preown by applebae`,
      description: description,
      url: pageUrl,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      publishedTime: post?.date || post?.createdAt,
      authors: [post?.subHeading?.replace(/^By\s*/i, '').trim() || 'Preown by applebae'],
      section: post?.category || 'Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Preown by applebae`,
      description: description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  // Decode the slug in case it was URL-encoded
  const decodedSlug = decodeURIComponent(slug);
  const post = await fetchBlog(decodedSlug);

  if (!post) {
    return (
      <div className={styles.errorContainer}>
        <h2>Post Not Found</h2>
        <p>The blog post you are looking for does not exist.</p>
        <Link href="/blog" className={styles.backButton}>
          ← Back to Blog
        </Link>
      </div>
    );
  }

  // Fetch SEO data for structured data
  const seoData = await fetchSEOData(`blog/${slug}`);
  const structuredData = getStructuredData(seoData);

  const imageUrl = getImageUrl(post?.blogImage);
  const title = post?.heading || 'Untitled';
  const category = post?.category || 'Blog';
  const date = post?.date || post?.createdAt;
  const author = (post?.subHeading || '').replace(/^By\s*/i, '').trim() || 'Preown by applebae';
  const description = getDescriptionText(post?.discription || post?.description);

  // Generate Article structured data if not available from SEO
  let articleStructuredData = structuredData;
  if (!articleStructuredData) {
    articleStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: imageUrl ? [imageUrl] : undefined,
      datePublished: post?.date || post?.createdAt,
      dateModified: post?.updatedAt || post?.date || post?.createdAt,
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Preown by applebae',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/blog/${slug}`,
      },
      articleSection: category,
    };
  }

  return (
    <>
      {articleStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
      )}
      <div className={styles.blogDetail}>
        <article className={styles.postContent}>
          <Link href="/blog" className={styles.backButton}>
            ← Back to Blog
          </Link>

          <div className={styles.header}>
            <div className={styles.metaInfo}>
              <span className={styles.category}>{category}</span>
              <span className={styles.date}>
                {date ? new Date(date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : ''}
              </span>
            </div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.authorInfo}>
              <span className={styles.author}>By {author}</span>
            </div>
          </div>

          {imageUrl && (
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                alt={title}
                width={1200}
                height={600}
                className={styles.featuredImage}
                priority={true}
              />
            </div>
          )}

          <div className={styles.content}>
            <div className={styles.contentBody}>
              {renderDescription(post?.discription || post?.description)}
            </div>
          </div>

          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>Ready to Find Your Perfect Device?</h3>
            <p className={styles.ctaText}>
              Explore our collection of premium pre-owned phones and latest gadgets.
            </p>
            <a href="/products" className={styles.ctaButton}>
              Shop Now
            </a>
          </div>
        </article>
      </div>
    </>
  );
}

