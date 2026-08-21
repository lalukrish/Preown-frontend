"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./CustomerReviewsSection.module.css";
import { FaStar, FaQuoteRight } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Dr shreelekshmi",
    role: "Ipad Buyer",
    text: "Experience was memorable! Every detail exceeded expectations.",
    avatar: "re1.png",
  },
  {
    name: "Gafoor",
    role: "Apple Buyer",
    text: "Absolutely transformative purchase; unmatched quality and performance.",
    avatar: "re2.png",
  },
  {
    name: "Dr krishnaraj",
    role: "Apple Buyer",
    text: "Noteworthy assistance and brilliant support – a flawless experience!",
    avatar: "re3.png",
  },
  {
    name: "Abhay",
    role: "Ipad Buyer",
    text: "Incredible service and premium quality. Preown truly delivers excellence.",
    avatar: "rev4.png",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

const handleWhatsapp = () => {
  const phone = "919995556734";
  const message = encodeURIComponent("Hi, I want by a phone.");
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
};

const CustomerReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const autoSlideRef = useRef(null);

  // Determine cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, reviews.length - cardsPerView);

  // Auto slide functionality
  useEffect(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }

    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= maxIndex) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 5000); // Auto slide every 5 seconds

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [maxIndex]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    // Reset auto slide timer on manual navigation
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1,
      );
    }, 5000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
    // Reset auto slide timer on manual navigation
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1,
      );
    }, 5000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Reset auto slide timer on manual navigation
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1,
      );
    }, 5000);
  };

  // Calculate transform: move by one card width
  // Each visible card takes 100/cardsPerView% of the wrapper width
  // The gap is handled by flexbox, so we move by cardWidth% of the wrapper
  const cardWidthPercent = 100 / cardsPerView;
  const translateX = -(currentIndex * cardWidthPercent);

  return (
    <motion.section
      className={styles.customerReviews}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className={""}>
        <h2 className="max-w-3xl text-2xl font-medium text-black mx-auto w-full text-center flex items-center justify-center mb-7 ">
          Our Customer Reviews
        </h2>
        <p className="max-w-3xl mx-auto w-full text-center flex items-center justify-center mb-7 text-gray-600">
          Real stories from real users. From smooth trades to fast deliveries,
          see why thousands trust Preown for buying, selling, and upgrading
          their devices.
        </p>
      </div>
      <div className={styles.sliderContainer}>
        {reviews.length > cardsPerView && (
          <button
            className={styles.arrowButton}
            onClick={goToPrevious}
            aria-label="Previous reviews"
          >
            <FiChevronLeft size={20} />
          </button>
        )}
        <div className={styles.cardsWrapper}>
          <div
            className={styles.cards}
            style={{
              transform: `translateX(${translateX}%)`,
            }}
          >
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                className={styles.card}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className={styles.header_star}>
                  <img
                    src={`/${review.avatar}`}
                    alt={review.name}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  <div className={styles.stars}>
                    Review
                    <div className={styles.rating}>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <FaStar key={i} color="#0071e3" size={10} />
                        ))}
                    </div>
                  </div>
                </div>

                <p className={styles.text}>{review.text}</p>
                <div className={styles.footer}>
                  <div>
                    <p className={styles.name}>{review.name}</p>
                    <p className={styles.role}>{review.role}</p>
                  </div>
                  <span className={styles.badge}>
                    <FaQuoteRight /> Testimonial
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {reviews.length > cardsPerView && (
          <button
            className={styles.arrowButton}
            onClick={goToNext}
            aria-label="Next reviews"
          >
            <FiChevronRight size={20} />
          </button>
        )}
      </div>
      {reviews.length > cardsPerView && (
        <div className={styles.dots}>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${currentIndex === index ? styles.active : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      <motion.button
        onClick={handleWhatsapp}
        className={styles.writeReviewButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Write a Review
      </motion.button>
    </motion.section>
  );
};

export default CustomerReviewsSection;
