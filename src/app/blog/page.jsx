import Link from "next/link";
import Image from "next/image";
import styles from "./Blog.module.css";
import {
  fetchSEOData,
  generateMetadataFromSEO,
  getStructuredData,
  fetchWithRetry,
} from "@/utils/seo";
import { STRAPI_BASE_URL, STRAPI_IMAGE_BASE_URL } from "@/utils/config";

const STRAPI_URL = STRAPI_BASE_URL;

export async function generateMetadata() {
  const seoData = await fetchSEOData("blog");
  return generateMetadataFromSEO(
    seoData,
    "Blog - Preown by applebae",
    "Welcome to Preown by applebae Blog. Discover the latest news, tips, and insights about premium phones and gadgets.",
    "/blog",
  );
}

// Regenerate this page at most once per minute
export const revalidate = 60;

async function fetchBlogs() {
  try {
    // Request all blogs, sorted by newest first
    const query = `${STRAPI_URL}/blogs?populate=*&pagination[page]=1&pagination[pageSize]=100&sort[0]=date:desc&publicationState=live`;
    const res = await fetchWithRetry(query, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }
    const json = await res.json();
    const blogs = json?.data ?? [];
    console.log(`Fetched ${blogs.length} blog(s) from Strapi`);
    return blogs;
  } catch (error) {
    console.error("Error in fetchBlogs:", error);
    throw error;
  }
}

function getFirstParagraphText(description) {
  if (!Array.isArray(description)) return "";
  for (const block of description) {
    if (block?.type === "paragraph" && Array.isArray(block.children)) {
      // Get all text from children and join them
      const textParts = block.children
        .filter((c) => c?.type === "text" && c.text?.trim())
        .map((c) => c.text)
        .join("");
      if (textParts) return textParts.trim();
    }
  }
  return "";
}

// Helper function to create URL-friendly slug
function createSlug(slug) {
  if (!slug) return "";
  // If slug already looks like a URL-friendly string, return it
  // Otherwise, encode it for URL use
  return encodeURIComponent(slug);
}

export default async function BlogPage() {
  let blogs = [];
  try {
    blogs = await fetchBlogs();
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  const seoData = await fetchSEOData("blog");
  const structuredData = getStructuredData(seoData);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div className={`${styles.blogPage} mt-10 md:mt-14`}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              Welcome to{" "}
              <span className={styles.highlight}>Preown by applebae</span> Blog
            </h1>
            <p className={styles.mainDescription}>
              Preown by applebae is your trusted source for premium phones and
              the latest gadgets. Discover top brands, unbeatable deals, and
              expert support.
            </p>
          </div>
        </section>

        <section className={styles.postsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Latest Articles</h2>
            {blogs.length === 0 ? (
              <div className={styles.noPosts}>
                <p>No blog posts available at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className={styles.postsGrid}>
                {blogs.map((item) => {
                  const imagePath = item?.blogImage?.url;
                  const imageUrl = imagePath
                    ? `${STRAPI_IMAGE_BASE_URL}${imagePath}`
                    : "/next.svg";
                  const title = item?.heading || "Untitled";
                  const date = item?.date || item?.createdAt;
                  // Fix: use discription (with 'i') instead of description
                  const excerpt =
                    item?.subHeading ||
                    getFirstParagraphText(
                      item?.discription || item?.description,
                    ) ||
                    "";
                  // Use slug if available, otherwise fallback to documentId or id
                  const slug = item?.slug || item?.documentId || item?.id;
                  const urlSlug = createSlug(slug);

                  return (
                    <article
                      key={item.id || item.documentId}
                      className={styles.postCard}
                    >
                      <Link
                        href={`/blog/${urlSlug}`}
                        className={styles.cardLink}
                      >
                        <div className={styles.imageContainer}>
                          <img
                            src={imageUrl}
                            alt={title}
                            width={400}
                            height={250}
                            className={styles.postImage}
                          />
                        </div>
                        <div className={styles.cardContent}>
                          <div className={styles.postHeader}>
                            <span className={styles.category}>
                              {item?.category || "Blog"}
                            </span>
                            <span className={styles.date}>
                              {date
                                ? new Date(date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>
                          <h3 className={styles.postTitle}>{title}</h3>
                          <p className={styles.postExcerpt}>{excerpt}</p>
                          <span className={styles.readMore}>
                            Read More
                            <svg
                              className={styles.arrowIcon}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>
              Ready to Explore Our Collection?
            </h2>
            <p className={styles.ctaDescription}>
              Browse our premium selection of pre-owned phones and latest
              gadgets today.
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
