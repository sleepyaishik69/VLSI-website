import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Navbar />

      <main className="bg-grid flex-1">
        {/* Glow ball decorative background */}
        <div className={styles.glowBall}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.tagline}>Silicon Architecture Guide</div>
          <h1 className={styles.title}>
            Master VLSI. From <span className={styles.gradientText}>Transistors</span> to{" "}
            <span className={styles.gradientText}>Tape-Out</span>.
          </h1>
          <p className={styles.subtitle}>
            An interactive, visually rich learning environment designed for future semiconductor
            architects. Learn device physics, CMOS gate design, static timing analysis, and physical
            synthesis with hands-on playbooks and real-time simulators.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/topics">
              <button className={styles.primaryBtn}>Explore Topics</button>
            </Link>
            <Link href="/topics?topic=cmos-inverter">
              <button className={styles.secondaryBtn}>Try Simulators</button>
            </Link>
          </div>

          {/* Animated SVG Microchip */}
          <div className={styles.chipIllustration}>
            <svg viewBox="0 0 400 240" style={{ overflow: "visible", width: "100%" }}>
              <defs>
                <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="var(--accent-blue)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Silicon Die Substrate */}
              <rect
                x="80"
                y="30"
                width="240"
                height="180"
                rx="16"
                fill="var(--bg-secondary)"
                stroke="var(--border-glass)"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))" }}
              />

              {/* Micro-lines grid detail */}
              <rect x="95" y="45" width="210" height="150" rx="8" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" strokeDasharray="3,3" />

              {/* Core processor center box */}
              <rect
                x="150"
                y="90"
                width="100"
                height="60"
                rx="6"
                fill="var(--bg-tertiary)"
                stroke="var(--border-bright)"
                strokeWidth="1.5"
                style={{ filter: "drop-shadow(0 0 15px rgba(0, 242, 254, 0.15))" }}
              />
              <text x="200" y="125" fill="var(--accent-cyan)" fontSize="9" fontWeight="bold" letterSpacing="2" textAnchor="middle" fontFamily="var(--font-mono)">
                WAFERWISE
              </text>

              {/* Glow trace paths */}
              {/* Left-to-Center */}
              <path d="M 40 60 L 120 60 L 150 90" fill="none" stroke="url(#traceGrad)" strokeWidth="1.5" />
              <path d="M 40 120 L 150 120" fill="none" stroke="url(#traceGrad)" strokeWidth="1.5" />
              <path d="M 40 180 L 120 180 L 150 150" fill="none" stroke="url(#traceGrad)" strokeWidth="1.5" />

              {/* Right-to-Center */}
              <path d="M 360 60 L 280 60 L 250 90" fill="none" stroke="url(#traceGrad)" strokeWidth="1.5" />
              <path d="M 360 120 L 250 120" fill="none" stroke="url(#traceGrad)" strokeWidth="1.5" />
              <path d="M 360 180 L 280 180 L 250 150" fill="none" stroke="url(#traceGrad)" strokeWidth="1.5" />

              {/* Blinking signal nodes */}
              <circle cx="120" cy="60" r="3" fill="var(--accent-cyan)" style={{ animation: "blink 1.5s infinite" }} />
              <circle cx="150" cy="90" r="3" fill="var(--accent-teal)" style={{ animation: "blink 2.2s infinite" }} />
              <circle cx="120" cy="180" r="3" fill="var(--accent-cyan)" style={{ animation: "blink 1.8s infinite" }} />
              <circle cx="280" cy="60" r="3" fill="var(--accent-blue)" style={{ animation: "blink 2.5s infinite" }} />
              <circle cx="250" cy="150" r="3" fill="var(--accent-cyan)" style={{ animation: "blink 1.6s infinite" }} />

              {/* Outer input pins representation */}
              <circle cx="40" cy="60" r="4" fill="var(--bg-tertiary)" stroke="var(--accent-blue)" strokeWidth="1.5" />
              <circle cx="40" cy="120" r="4" fill="var(--bg-tertiary)" stroke="var(--accent-blue)" strokeWidth="1.5" />
              <circle cx="40" cy="180" r="4" fill="var(--bg-tertiary)" stroke="var(--accent-blue)" strokeWidth="1.5" />
              <circle cx="360" cy="60" r="4" fill="var(--bg-tertiary)" stroke="var(--accent-blue)" strokeWidth="1.5" />
              <circle cx="360" cy="120" r="4" fill="var(--bg-tertiary)" stroke="var(--accent-blue)" strokeWidth="1.5" />
              <circle cx="360" cy="180" r="4" fill="var(--bg-tertiary)" stroke="var(--accent-blue)" strokeWidth="1.5" />
            </svg>
          </div>
        </section>

        {/* Pillars / Course Topics Outline Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Four Pillars of Chip Design</h2>
          
          <div className={styles.grid}>
            {/* Pillar 1 */}
            <div className={`${styles.card} glass glow-hover`}>
              <div className={styles.cardIcon}>⚛️</div>
              <h3 className={styles.cardTitle}>Device Physics</h3>
              <p className={styles.cardDesc}>
                Understand PN junction diode behaviors and n/p-channel MOSFET channel mechanisms.
                Learn threshold voltage dynamics and current-voltage regions of operation.
              </p>
              <Link href="/topics?topic=mosfet-physics" className={styles.cardLink}>
                Learn Physics →
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className={`${styles.card} glass glow-hover`}>
              <div className={styles.cardIcon}>🔌</div>
              <h3 className={styles.cardTitle}>Digital Circuit Design</h3>
              <p className={styles.cardDesc}>
                Build inverter circuits, NAND gates, flip-flop memory registers, and sequential RTL networks.
                Simulate how sizing ratios affect gate thresholds and delay.
              </p>
              <Link href="/topics?topic=cmos-inverter" className={styles.cardLink}>
                Learn Circuits →
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className={`${styles.card} glass glow-hover`}>
              <div className={styles.cardIcon}>⏱️</div>
              <h3 className={styles.cardTitle}>Timing Signoff (STA)</h3>
              <p className={styles.cardDesc}>
                Define setup and hold limits mathematically. Visualise clock trees, skew, signal delays,
                and resolve timing slacks to secure glitch-free operation.
              </p>
              <Link href="/topics?topic=static-timing-analysis" className={styles.cardLink}>
                Learn Timing →
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className={`${styles.card} glass glow-hover`}>
              <div className={styles.cardIcon}>🏗️</div>
              <h3 className={styles.cardTitle}>Backend & Fabrication</h3>
              <p className={styles.cardDesc}>
                Explore the automated synthesis to GDSII layout flow. Delve into EUV photolithography,
                wafer layer etching, chemical polishing, and final packaging.
              </p>
              <Link href="/topics?topic=physical-design" className={styles.cardLink}>
                Learn Fabrication →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
