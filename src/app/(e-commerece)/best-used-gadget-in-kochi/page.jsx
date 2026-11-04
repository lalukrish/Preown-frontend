import Image from 'next/image';
import styles from './BestUsedGadget.module.css';
import { fetchSEOData, generateMetadataFromSEO, getStructuredData } from '@/utils/seo';
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from '@/utils/config';

const REVALIDATE_SECONDS = 300;

function extractDescriptionParagraphs(rawDescription) {
  if (typeof rawDescription === 'string') {
    return rawDescription
      .replace(/^Description:\s*/i, '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(rawDescription)) {
    return rawDescription
      .flatMap((block) => {
        if (!block || typeof block !== 'object') return [];
        const children = Array.isArray(block.children) ? block.children : [];
        const text = children.map((child) => child?.text || '').join('').trim();
        return text ? [text.replace(/^Description:\s*/i, '')] : [];
      })
      .filter(Boolean);
  }

  return [];
}

function normalizeImage(image) {
  const imageData = image?.data ?? image;
  const attributes = imageData?.attributes ?? imageData;

  if (!attributes?.url) {
    return null;
  }

  return {
    url: `${STRAPI_IMAGE_BASE_URL}${attributes.url}`,
    width: attributes.width || 720,
    height: attributes.height || 480,
    alt: attributes.alternativeText || attributes.name || 'Preown gadget',
  };
}

async function fetchGadgetEntries(endpoint) {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/${endpoint}?populate=*`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${endpoint}:`, response.statusText);
      return [];
    }

    const json = await response.json();
    const entries = Array.isArray(json?.data) ? json.data : [];

    return entries.map((item, index) => {
      const attributes = item?.attributes ?? item ?? {};
      const image = normalizeImage(attributes.image);
      const paragraphs = extractDescriptionParagraphs(attributes.description);

      return {
        id: item?.id ?? attributes.documentId ?? attributes.heading ?? `gadget-${index}`,
        heading: attributes.heading || '',
        description: paragraphs.length ? paragraphs : ['Stay tuned for more details on this gadget.'],
        image,
      };
    });
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export async function generateMetadata() {
  const seoData = await fetchSEOData('gadget-in-kochi');
  return generateMetadataFromSEO(
    seoData,
    'Best Used Gadget in Kochi - Preown by applebae',
    'Discover the best pre-owned gadgets in Kochi at Preown by applebae. We offer premium phones, tablets, laptops, and accessories at unbeatable prices.',
    '/best-used-gadget-in-kochi'
  );
}

export default async function BestUsedGadgetKochiPage() {
  const [seoData, gadgets] = await Promise.all([
    fetchSEOData('gadget-in-kochi'),
    fetchGadgetEntries('gadget-in-kochis'),
  ]);

  const structuredData = getStructuredData(seoData);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              Best Used Gadget in <span className={styles.highlight}>Kochi</span>
            </h1>
            <p className={styles.mainDescription}>
              Discover the best pre-owned gadgets in Kochi at Preown by applebae. We offer premium
              phones, tablets, laptops, and accessories at unbeatable prices.
            </p>
          </div>
        </section>

        <section className={styles.cardsSection}>
          <div className={styles.container}>


            <div className={styles.cardsList}>
              {gadgets.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No gadgets found right now. Please check back soon.</p>
                </div>
              )}

              {gadgets.map((gadget, index) => (
                <article
                  key={gadget.id}
                  className={`${styles.card} ${index % 2 !== 0 ? styles.cardReversed : ''}`}
                >
                  {gadget.image && (
                    <div className={styles.cardImage}>
                      <Image
                        src={gadget.image.url}
                        alt={gadget.image.alt}
                        width={gadget.image.width}
                        height={gadget.image.height}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                        priority={index === 0}
                      />
                    </div>
                  )}

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardHeading}>{gadget.heading}</h3>
                    <div className={styles.cardBody}>
                      {gadget.description.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex} className={styles.cardDescription}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Ready to Find Your Perfect Gadget in Kochi?</h2>
            <p className={styles.ctaDescription}>
              Browse our collection of premium pre-owned phones and gadgets available in Kochi.
            </p>
            <div className={styles.ctaButtons}>
              <a href="/products" className={styles.buttonFilled}>
                Shop Now
              </a>
              <a href="/about" className={styles.buttonOutlined}>
                Learn More
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

