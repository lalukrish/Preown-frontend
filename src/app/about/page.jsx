import styles from "./About.module.css";
import {
  fetchSEOData,
  generateMetadataFromSEO,
  getStructuredData,
} from "@/utils/seo";

export async function generateMetadata() {
  const seoData = await fetchSEOData("about");
  return generateMetadataFromSEO(
    seoData,
    "About Us - Preown by applebae.",
    "Preown by applebae is your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.",
    "/about",
  );
}

export default async function AboutPage() {
  const seoData = await fetchSEOData("about");
  const structuredData = getStructuredData(seoData);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div className={`${styles.aboutPage} mt-10 md:mt-14`}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              About <span className={styles.highlight}>Preown by applebae</span>
            </h1>
            <p className={styles.mainDescription}>
              Preown by applebae is your trusted source for premium phones and
              the latest gadgets. Discover top brands, unbeatable deals, and
              expert support.
            </p>
          </div>
        </section>

        <section className={styles.introduction}>
          <div className={styles.container}>
            <div className={styles.introContent}>
              <div className={styles.introImage}>
                <img
                  src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop"
                  alt="Preown by applebae - Premium Pre-Owned Devices"
                />
              </div>
              <div className={styles.introText}>
                <h2 className={styles.introTitle}>
                  Welcome to Preown by applebae
                </h2>
                <p className={styles.introParagraph}>
                  At Preown by applebae, we are passionate about making premium
                  technology accessible to everyone. We are a trusted
                  marketplace specializing in high-quality pre-owned
                  smartphones, tablets, laptops, and the latest gadgets from
                  top-tier brands like Apple, Samsung, and more. Our mission is
                  to bridge the gap between cutting-edge technology and
                  affordability, ensuring that everyone can experience the joy
                  of owning premium devices without breaking the bank. We
                  understand that technology evolves rapidly, and many people
                  want to upgrade to the latest models while others seek
                  reliable, budget-friendly alternatives. That's where we come
                  in. Every device in our inventory undergoes rigorous quality
                  checks, authenticity verification, and comprehensive testing
                  to ensure it meets our high standards. We believe in
                  transparency, trust, and customer satisfaction above all else.
                  Whether you're looking to buy a certified pre-owned device or
                  sell your current gadget, we provide a seamless, secure, and
                  rewarding experience. Our team of experts is dedicated to
                  helping you find the perfect device that matches your needs
                  and budget, while our warranty programs and customer support
                  ensure peace of mind with every purchase.
                </p>
                <a href="/products" className={styles.aboutButton}>
                  About Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.container}>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Trusted Source</h3>
                <p className={styles.featureDescription}>
                  Your reliable partner for quality pre-owned devices with
                  verified authenticity and warranty-backed products.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Premium Phones</h3>
                <p className={styles.featureDescription}>
                  Explore our curated selection of premium smartphones from top
                  manufacturers in excellent condition.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Latest Gadgets</h3>
                <p className={styles.featureDescription}>
                  Stay up-to-date with the newest technology and innovative
                  gadgets at affordable prices.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Top Brands</h3>
                <p className={styles.featureDescription}>
                  Shop from renowned brands including Apple, Samsung, and other
                  leading manufacturers you can trust.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Unbeatable Deals</h3>
                <p className={styles.featureDescription}>
                  Get the best value for your money with competitive pricing and
                  special offers on quality devices.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Expert Support</h3>
                <p className={styles.featureDescription}>
                  Our knowledgeable team is here to help you find the perfect
                  device and answer all your questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>
              Ready to Find Your Perfect Device?
            </h2>
            <p className={styles.ctaDescription}>
              Browse our collection of premium pre-owned phones and gadgets
              today.
            </p>
            <div className={styles.ctaButtons}>
              <a href="/products" className={styles.buttonFilled}>
                Shop Now
              </a>
              <a href="/#contact" className={styles.buttonOutlined}>
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
