import ProductsPageClient from './ProductsPageClient';
import { fetchSEOData, generateMetadataFromSEO, getStructuredData } from '@/utils/seo';

export async function generateMetadata() {
  const seoData = await fetchSEOData('product');
  return generateMetadataFromSEO(seoData, 'Products - Preown by applebae', 'Browse our collection of premium pre-owned phones and latest gadgets. Find the perfect device at unbeatable prices.', '/products');
}

export default async function ProductsPage() {
  const seoData = await fetchSEOData('product');
  const structuredData = getStructuredData(seoData);
  
  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ProductsPageClient />
    </>
  );
}