import { STRAPI_BASE_URL, SITE_URL } from '@/utils/config';
import { fetchWithRetry } from '@/utils/seo';

const STRAPI_URL = STRAPI_BASE_URL;

/**
 * Generate sitemap for Next.js
 * This function is called by Next.js to generate the sitemap.xml
 */
export default async function sitemap() {
  const baseUrl = SITE_URL;

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/best-used-gadget-in-calicut`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best-used-gadget-in-kochi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic routes - fetch from Strapi
  const dynamicRoutes = [];

  try {
    // Fetch blog posts
    const blogRes = await fetchWithRetry(`${STRAPI_URL}/blogs?fields[0]=slug&fields[1]=updatedAt&pagination[limit]=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (blogRes.ok) {
      const blogData = await blogRes.json();
      if (blogData?.data) {
        blogData.data.forEach((blog) => {
          dynamicRoutes.push({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  try {
    // Fetch products
    const productRes = await fetchWithRetry(`${STRAPI_URL}/products?fields[0]=slug&fields[1]=updatedAt&pagination[limit]=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (productRes.ok) {
      const productData = await productRes.json();
      if (productData?.data) {
        productData.data.forEach((product) => {
          dynamicRoutes.push({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}

