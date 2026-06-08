"use client";

import React, { useState, useMemo } from "react";
import styles from "./TimingSim.module.css";

export default function TimingSim() {
  const [tclk, setTclk] = useState<number>(10.0); // Clock Period (ns)
  const [tsu, setTsu] = useState<number>(1.5);    // Setup Time (ns)
  const [th, setTh] = useState<number>(0.8);      // Hold Time (ns)
  const [tskew, setTskew] = useState<number>(0.4);  // Clock Skew (ns)
  const [tcq, setTcq] = useState<number>(1.2);    // Clock-to-Q (ns)
  const [tcomb, setTcomb] = useState<number>(4.8); // Combinational Delay (ns)

  // Timing Calculations
  const dataArrival = tcq + tcomb;
  const dataRequiredSetup = tclk + tskew - tsu;
  const setupSlack = dataRequiredSetup - dataArrival;

  const dataRequiredHold = tskew + th;
  const holdSlack = dataArrival - dataRequiredHold;

  // SVG coordinate conversions
  // Scale: 0 to 20ns mapped to plot area of 320px
  const svgW = 400;
  const plotW = 320;
  const padL = 65;
  const totalNs = 20;

  const mapX = (t: number) => padL + (t / totalNs) * plotW;

  // Generate Clock Waveform path
  const getClkPath = (offset: number, yLow: number, yHigh: number) => {
    // Generate two full cycles starting from offset
    const c = tclk;
    const t0 = offset;
    const t1 = offset + c / 2;
    const t2 = offset + c;
    const t3 = offset + 1.5 * c;
    const t4 = offset + 2 * c;

    return `
      M ${mapX(0)} ${yLow}
      L ${mapX(Math.max(0, t0))} ${yLow}
      L ${mapX(Math.max(0, t0))} ${yHigh}
      L ${mapX(Math.max(0, t1))} ${yHigh}
      L ${mapX(Math.max(0, t1))} ${yLow}
      L ${mapX(Math.max(0, t2))} ${yLow}
      L ${mapX(Math.max(0, t2))} ${yHigh}
      L ${mapX(Math.max(0, t3))} ${yHigh}
      L ${mapX(Math.max(0, t3))} ${yLow}
      L ${mapX(Math.max(0, t4))} ${yLow}
    `;
  };

  // Generate Data Waveform path
  // Data launches at t=0 and transitions to high at t = dataArrival
  const getDataPath = (yLow: number, yHigh: number) => {
    const tTrans = dataArrival;
    return `
      M ${mapX(0)} ${yLow}
      L ${mapX(Math.max(0, tTrans - 0.2))} ${yLow}
      L ${mapX(Math.max(0, tTrans + 0.2))} ${yHigh}
      L ${mapX(totalNs)} ${yHigh}
    `;
  };

  // Setup violation check
  const setupViolated = setupSlack < 0;
  // Hold violation check
  const holdViolated = holdSlack < 0;

  return (
    <div className={`${styles.simulator} glass`}>
      {/* Controls */}
      <div className={styles.controls}>
        <h3 className={styles.title}>STA Timing Simulator</h3>
        <p className={styles.subtitle}>
          Adjust clocks and delays to simulate Setup and Hold slack constraints.
        </p>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Clock Period (Tclk)</span>
            <span className={styles.sliderVal}>{tclk.toFixed(1)} ns</span>
          </div>
          <input
            type="range"
            min="6.0"
            max="14.0"
            step="0.5"
            value={tclk}
            onChange={(e) => setTclk(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Comb. Logic Delay (Tcomb)</span>
            <span className={styles.sliderVal}>{tcomb.toFixed(1)} ns</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.2"
            value={tcomb}
            onChange={(e) => setTcomb(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Clock Skew (Tskew)</span>
            <span className={styles.sliderVal}>{tskew.toFixed(1)} ns</span>
          </div>
          <input
            type="range"
            min="-1.5"
            max="2.5"
            step="0.1"
            value={tskew}
            onChange={(e) => setTskew(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Setup Time (Tsu)</span>
            <span className={styles.sliderVal}>{tsu.toFixed(2)} ns</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={tsu}
            onChange={(e) => setTsu(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Hold Time (Th)</span>
            <span className={styles.sliderVal}>{th.toFixed(2)} ns</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={th}
            onChange={(e) => setTh(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Reg Clk-to-Q (Tcq)</span>
            <span className={styles.sliderVal}>{tcq.toFixed(2)} ns</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={tcq}
            onChange={(e) => setTcq(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      {/* Visualizer Panel */}
      <div className={styles.displayPanel}>
        <div className={styles.waveformsContainer}>
          <svg className={styles.waveSvg} viewBox={`0 0 ${svgW} 220`}>
            {/* Timeline ticks */}
            {[0, 4, 8, 12, 16, 20].map((t) => (
              <g key={t}>
                <line x1={mapX(t)} y1="10" x2={mapX(t)} y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <text x={mapX(t)} y="212" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">
                  {t}ns
                </text>
              </g>
            ))}

            {/* Launch Clock wave (offset=0) */}
            <text x="15" y="45" className={styles.waveLabel}>CLK_launch</text>
            <path d={getClkPath(0, 55, 30)} className={`${styles.waveLine} ${styles.clkLine}`} />

            {/* Capture Clock wave (offset=tskew) */}
            <text x="15" y="95" className={styles.waveLabel}>CLK_capture</text>
            <path d={getClkPath(tskew, 105, 80)} className={`${styles.waveLine} ${styles.clkLine}`} strokeOpacity="0.75" />

            {/* Data at Capture Reg */}
            <text x="15" y="155" className={styles.waveLabel}>DATA (D)</text>
            <path d={getDataPath(165, 140)} className={`${styles.waveLine} ${styles.dataLine}`} />

            {/* Shaded Setup Window at tclk + tskew */}
            {/* From (tclk + tskew - tsu) to (tclk + tskew) */}
            <rect
              x={mapX(tclk + tskew - tsu)}
              y="20"
              width={mapX(tclk + tskew) - mapX(tclk + tskew - tsu)}
              height="180"
              className={styles.violMarker}
              stroke="var(--accent-rose)"
              fill="rgba(244,63,94,0.12)"
            />
            <text x={mapX(tclk + tskew - tsu / 2)} y="15" fill="var(--accent-rose)" fontSize="7" fontWeight="bold" textAnchor="middle">
              Setup
            </text>

            {/* Shaded Hold Window at tskew */}
            {/* From tskew to tskew + th */}
            <rect
              x={mapX(tskew)}
              y="20"
              width={mapX(tskew + th) - mapX(tskew)}
              height="180"
              className={styles.violMarker}
              stroke="var(--accent-amber)"
              fill="rgba(245,158,11,0.12)"
            />
            <text x={mapX(tskew + th / 2)} y="15" fill="var(--accent-amber)" fontSize="7" fontWeight="bold" textAnchor="middle">
              Hold
            </text>

            {/* Data transition vertical indicator line */}
            <line
              x1={mapX(dataArrival)}
              y1="130"
              x2={mapX(dataArrival)}
              y2="180"
              stroke="var(--accent-cyan)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <text x={mapX(dataArrival)} y="190" fill="var(--accent-cyan)" fontSize="8" fontWeight="bold" textAnchor="middle">
              Data Arrives ({dataArrival.toFixed(1)}ns)
            </text>
          </svg>
        </div>

        <div className={styles.slackPanel}>
          <div className={`${styles.slackCard} ${setupViolated ? styles.slackViol : styles.slackOk}`}>
            <span className={styles.slackLabel}>Setup Slack (Tclk + Tskew - Tsu - Tarrival)</span>
            <span className={styles.slackVal} style={{ color: setupViolated ? "var(--accent-rose)" : "var(--accent-teal)" }}>
              {setupSlack.toFixed(2)} ns
            </span>
            <span className={styles.slackStatus} style={{ color: setupViolated ? "var(--accent-rose)" : "var(--accent-teal)" }}>
              {setupViolated ? "⚠️ VIOLATION" : "✓ TIMING MET"}
            </span>
          </div>

          <div className={`${styles.slackCard} ${holdViolated ? styles.slackViol : styles.slackOk}`}>
            <span className={styles.slackLabel}>Hold Slack (Tarrival - Tskew - Th)</span>
            <span className={styles.slackVal} style={{ color: holdViolated ? "var(--accent-rose)" : "var(--accent-teal)" }}>
              {holdSlack.toFixed(2)} ns
            </span>
            <span className={styles.slackStatus} style={{ color: holdViolated ? "var(--accent-rose)" : "var(--accent-teal)" }}>
              {holdViolated ? "⚠️ VIOLATION" : "✓ TIMING MET"}
            </span>
          </div>
        </div>

        <div className={styles.alertsContainer}>
          {setupViolated ? (
            <div className={`${styles.alert} ${styles.alertViol}`}>
              <span className={styles.alertIcon}>⚠️</span>
              <div>
                <strong>Setup Timing Violation:</strong> Data is arriving too late ({dataArrival.toFixed(1)}ns) and isn't stable before the setup window starts ({dataRequiredSetup.toFixed(1)}ns). 
                <em> To fix: Decrease combinational delay, increase clock period (lower clock speed), or reduce clock skew.</em>
              </div>
            </div>
          ) : (
            <div className={`${styles.alert} ${styles.alertOk}`}>
              <span className={styles.alertIcon}>✓</span>
              <div>
                <strong>Setup Timing Met:</strong> Data arrives successfully before the capture setup window.
              </div>
            </div>
          )}

          {holdViolated ? (
            <div className={`${styles.alert} ${styles.alertViol}`}>
              <span className={styles.alertIcon}>⚠️</span>
              <div>
                <strong>Hold Timing Violation:</strong> Data changed too fast! The new data transition arrived at {dataArrival.toFixed(1)}ns, which is before the hold window cleared ({dataRequiredHold.toFixed(1)}ns). 
                <em> To fix: Increase combinational logic delay (add buffers) or reduce clock skew. Slower clock cycles will NOT fix hold violations!</em>
              </div>
            </div>
          ) : (
            <div className={`${styles.alert} ${styles.alertOk}`}>
              <span className={styles.alertIcon}>✓</span>
              <div>
                <strong>Hold Timing Met:</strong> Data remains stable long enough after the clock edge.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
