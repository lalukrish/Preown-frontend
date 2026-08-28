"use client";
import React from "react";
import styles from "./Category.module.css";

function Category() {
  return (
    <div className={`${styles.categoryContainer}  page-wrapper`}>
      {/* Warranty Card */}
      <div className={`${styles.card} ${styles.warrantyCard}`}>
        <div className={styles.cardContent}>
          <h2 className={styles.productTitle}>Warranty on Every Device</h2>
          <p className={styles.productSubtitle}>
            Every gadget comes with our trusted 1 month warranty and after-sales
            support. Peace of mind, guaranteed.
          </p>
        </div>
      </div>

      {/* Quality Check Card */}
      <div className={`${styles.card} ${styles.qualityCard}`}>
        <div className={styles.cardContent}>
          <h2 className={styles.productTitle}>Verified, Tested & Certified</h2>
          <p className={styles.productSubtitle}>
            Every device goes through a 30+ point quality check to ensure it's
            fully functional and ready for use. Preowned, Not Compromised.
          </p>
        </div>
      </div>

      {/* Preowned Card */}
      <div className={`${styles.card} ${styles.preownedCard}`}>
        <div className={styles.cardContent}>
          <h2 className={styles.productTitle}>
            Looks Like New, Feels Like New
          </h2>
          <p className={styles.productSubtitle}>
            Our devices look and work like new — with no compromise on quality.
            Preowned, Not Compromised.
          </p>
        </div>
      </div>

      {/* Customer Trust Card */}
      <div className={`${styles.card} ${styles.customerCard}`}>
        <div className={styles.cardContent}>
          <h2 className={styles.productTitle}>Loved by 1500+ Customers</h2>
          <p className={styles.productSubtitle}>
            Join a growing community of smart buyers and sellers who trust
            Preown for premium pre-owned gadgets.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Category;
