import Link from "next/link";
import {
  fetchSEOData,
  generateMetadataFromSEO,
  getStructuredData,
  fetchWithRetry,
} from "@/utils/seo";
import ProductDetailClient from "./ProductDetailClient";
import PhoneSelectorSection from "@/components/sections/PhoneSelectorSection/PhoneSelectorSection";
import styles from "./ProductDetail.module.css";
import {
  STRAPI_BASE_URL,
  STRAPI_IMAGE_BASE_URL,
  SITE_URL,
} from "@/utils/config";
import ScrollRightSection from "@/components/sections/landing/scrollRight";

// The new-products endpoint takes the documentId directly in the path,
// e.g. /api/new-products/wg99z3pfl183d03hvp0oks5u — no more filtering by
// slug/documentId/id since there's no `slug` field on this content type.
async function fetchProduct(documentId) {
  //  if (!documentId) return null;
  console.log("first!!!!!", documentId);
  try {
    const url = `https://backapp.preown.store/api/new-products/${documentId}?populate=*`;
    const res = await fetchWithRetry(url, { next: { revalidate: 3600 } });
    console.log("res", res);
    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        console.log("data", json.data);

        return json.data;
      }
    }
  } catch (e) {
    console.log("Error fetching product:", e);
  }

  return null;
}

// Extract an image URL from the ProductImagesAndVideos media array
function getImageUrl(media) {
  if (!media || !Array.isArray(media) || media.length === 0) return null;
  const item = media[0];
  const path =
    item?.formats?.medium?.url || item?.formats?.large?.url || item?.url;
  return path ? `${STRAPI_IMAGE_BASE_URL}${path}` : null;
}

// There's no rich-text description field on the new schema, so we build a
// simple fallback description from the product name.
function buildDescription(productName) {
  return `Buy ${productName} at Preown by applebae. Premium pre-owned phones and gadgets at unbeatable prices.`;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found - Preown by applebae",
      description: "The product you are looking for does not exist.",
    };
  }

  const productName = product.ProductName || "Product";
  const productDescription = buildDescription(productName);
  const productImage = getImageUrl(product.ProductImagesAndVideos);
  const pageUrl = `${SITE_URL}/products/${slug}`;

  // Try to fetch SEO data from Strapi
  const seoData = await fetchSEOData(`products/${slug}`);

  // If SEO data exists, use it; otherwise generate from product data
  if (seoData) {
    return generateMetadataFromSEO(
      seoData,
      productName,
      productDescription,
      pageUrl,
    );
  }

  // Generate metadata from product data
  return {
    title: `${productName} - Preown by applebae`,
    description: productDescription,
    keywords: [
      productName,
      "pre-owned phones",
      "used phones",
      "refurbished phones",
      "premium gadgets",
      "Calicut",
      "Kochi",
      "Kerala",
    ],
    openGraph: {
      title: `${productName} - Preown by applebae`,
      description: productDescription,
      url: pageUrl,
      type: "website",
      images: productImage ? [{ url: productImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
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
  console.log("fetchProduct", slug);
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
    const imageUrl = getImageUrl(product.ProductImagesAndVideos);
    productStructuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.ProductName,
      description: buildDescription(product.ProductName || "Product"),
      image: imageUrl ? [imageUrl] : undefined,
      offers: product.TotalPriceWithGST
        ? {
            "@type": "Offer",
            price: product.TotalPriceWithGST,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/products/${slug}`,
          }
        : undefined,
      brand: {
        "@type": "Brand",
        name: product.Brand || "Preown by applebae",
      },
    };
  }
  console.log("product", product);
  return (
    <>
      {productStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData),
          }}
        />
      )}

      <ProductDetailClient product={product} />
      <ScrollRightSection featured={true} isJustIn={true} />

      {/* <PhoneSelectorSection /> */}
    </>
  );
}
