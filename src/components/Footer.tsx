import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} max-w-7xl`}>
        <div className={styles.top}>
          <div className={styles.info}>
            <div className={styles.brand}>
              <div className={styles.logoIcon}>W</div>
              <span className={styles.brandText}>WaferWise</span>
            </div>
            <p className={styles.desc}>
              An interactive learning platform dedicated to making Very Large Scale
              Integration (VLSI) concepts easy to understand. Dive deep into MOSFET physics,
              CMOS design, and physical design flows with our interactive playgrounds.
            </p>
          </div>

          <div className={styles.linksContainer}>
            <div className={styles.section}>
              <h4 className={styles.title}>Explore</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/" className={styles.link}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/topics" className={styles.link}>
                    VLSI Topics
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h4 className={styles.title}>Topics</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/topics?topic=mosfet-physics" className={styles.link}>
                    MOSFET Physics
                  </Link>
                </li>
                <li>
                  <Link href="/topics?topic=cmos-inverter" className={styles.link}>
                    CMOS Inverter
                  </Link>
                </li>
                <li>
                  <Link href="/topics?topic=static-timing-analysis" className={styles.link}>
                    Static Timing (STA)
                  </Link>
                </li>
                <li>
                  <Link href="/topics?topic=physical-design" className={styles.link}>
                    Physical Design Flow
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} WaferWise. All rights reserved.</p>
          <p>Designed for future chip architects.</p>
        </div>
      </div>
    </footer>
  );
}
