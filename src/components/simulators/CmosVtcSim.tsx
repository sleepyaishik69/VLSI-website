"use client";

import React, { useState, useMemo } from "react";
import styles from "./CmosVtcSim.module.css";

export default function CmosVtcSim() {
  const [widthRatio, setWidthRatio] = useState<number>(2.5); // Wp / Wn
  const [vtn, setVtn] = useState<number>(0.4); // NMOS Vth
  const [vtp, setVtp] = useState<number>(0.4); // PMOS |Vth|
  const [vin, setVin] = useState<number>(0.9); // Input Voltage

  const VDD = 1.8; // Fixed VDD

  // Compute logic threshold Vm
  const vmInfo = useMemo(() => {
    // beta_n = 1.0 (arbitrary scaling)
    // beta_p = widthRatio * 0.4 (since holes are ~2.5x slower)
    const betaN = 1.0;
    const betaP = widthRatio * 0.4;
    const r = betaN / betaP;
    const vm = (VDD - vtp + vtn * Math.sqrt(r)) / (1 + Math.sqrt(r));
    return { vm, r };
  }, [widthRatio, vtn, vtp]);

  const Vm = vmInfo.vm;

  // Function to calculate Vout based on Vin
  const calculateVout = (v: number) => {
    if (v <= 0) return VDD;
    if (v >= VDD) return 0;

    // Use a sigmoid-tanh profile to simulate the transfer curve.
    // Gain/steepness changes slightly with widthRatio mismatch
    const gain = 10 + (widthRatio < 2.5 ? (2.5 - widthRatio) * 2 : (widthRatio - 2.5) * 1);
    
    const f = (x: number) => {
      return (VDD / 2) * (1 - Math.tanh((gain * (x - Vm)) / VDD));
    };

    const y0 = f(0);
    const yDD = f(VDD);

    // Normalize to ensure exact boundary conditions: Vout(0)=VDD, Vout(VDD)=0
    const rawVal = VDD * ((f(v) - yDD) / (y0 - yDD));
    return Math.max(0, Math.min(VDD, rawVal));
  };

  const vout = useMemo(() => calculateVout(vin), [vin, Vm, widthRatio]);

  // Determine region of operation
  const region = useMemo(() => {
    if (vin < vtn) {
      return {
        id: "A",
        title: "Region A (NMOS Cutoff)",
        desc: "NMOS is OFF because Vin < Vtn. PMOS is ON (Linear) pulling Vout to VDD (1.8V). Static current is zero.",
        nmosState: "OFF (Cutoff)",
        pmosState: "ON (Linear)",
        nmosColor: "var(--text-muted)",
        pmosColor: "var(--accent-teal)",
        shortCircuit: false,
      };
    } else if (vin > VDD - vtp) {
      return {
        id: "E",
        title: "Region E (PMOS Cutoff)",
        desc: "PMOS is OFF because Vsg < |Vtp|. NMOS is ON (Linear) pulling Vout to GND (0V). Static current is zero.",
        nmosState: "ON (Linear)",
        pmosState: "OFF (Cutoff)",
        nmosColor: "var(--accent-teal)",
        pmosColor: "var(--text-muted)",
        shortCircuit: false,
      };
    } else if (Math.abs(vin - Vm) < 0.08) {
      return {
        id: "C",
        title: "Region C (Both Saturated)",
        desc: "Both NMOS and PMOS are ON in Saturation. Maximum gain is achieved here. A direct short-circuit path exists from VDD to GND, peaking static current.",
        nmosState: "ON (Saturation)",
        pmosState: "ON (Saturation)",
        nmosColor: "var(--accent-amber)",
        pmosColor: "var(--accent-amber)",
        shortCircuit: true,
      };
    } else if (vin >= vtn && vin < Vm) {
      return {
        id: "B",
        title: "Region B (PMOS Sat, NMOS Lin)",
        desc: "NMOS is in Linear, and PMOS is in Saturation. Vout starts dropping. There is moderate current draw.",
        nmosState: "ON (Linear)",
        pmosState: "ON (Saturation)",
        nmosColor: "var(--accent-teal)",
        pmosColor: "var(--accent-amber)",
        shortCircuit: false,
      };
    } else {
      return {
        id: "D",
        title: "Region D (PMOS Lin, NMOS Sat)",
        desc: "NMOS is in Saturation, and PMOS is in Linear. Vout is low but not yet zero. There is moderate current draw.",
        nmosState: "ON (Saturation)",
        pmosState: "ON (Linear)",
        nmosColor: "var(--accent-amber)",
        pmosColor: "var(--accent-teal)",
        shortCircuit: false,
      };
    }
  }, [vin, vtn, vtp, Vm]);

  // SVG dimensions & mapping
  const svgW = 280;
  const svgH = 200;
  const paddingL = 35;
  const paddingB = 30;
  const plotW = svgW - paddingL - 15;
  const plotH = svgH - paddingB - 15;

  const mapX = (x: number) => paddingL + (x / VDD) * plotW;
  const mapY = (y: number) => svgH - paddingB - (y / VDD) * plotH;

  // Generate curve path
  const curvePath = useMemo(() => {
    let path = "";
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const xVal = (i / steps) * VDD;
      const yVal = calculateVout(xVal);
      const px = mapX(xVal);
      const py = mapY(yVal);
      if (i === 0) {
        path += `M ${px} ${py}`;
      } else {
        path += ` L ${px} ${py}`;
      }
    }
    return path;
  }, [Vm, widthRatio, vtn, vtp]);

  return (
    <div className={`${styles.simulator} glass`}>
      {/* Sliders Container */}
      <div className={styles.controls}>
        <h3 className={styles.title}>CMOS VTC Simulator</h3>
        <p className={styles.subtitle}>
          Tweak device sizes and thresholds to see how they impact the Voltage Transfer
          Characteristics (VTC).
        </p>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>PMOS / NMOS Width Ratio (Wp/Wn)</span>
            <span className={styles.sliderVal}>{widthRatio.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={widthRatio}
            onChange={(e) => setWidthRatio(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>NMOS Threshold Voltage (Vtn)</span>
            <span className={styles.sliderVal}>{vtn.toFixed(2)} V</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.05"
            value={vtn}
            onChange={(e) => setVtn(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>PMOS Threshold Voltage (|Vtp|)</span>
            <span className={styles.sliderVal}>{vtp.toFixed(2)} V</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.05"
            value={vtp}
            onChange={(e) => setVtp(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup} style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "1rem" }}>
          <div className={styles.sliderLabel}>
            <span>Input Voltage (Vin)</span>
            <span className={styles.sliderVal} style={{ color: "var(--accent-amber)" }}>
              {vin.toFixed(2)} V
            </span>
          </div>
          <input
            type="range"
            min="0.00"
            max="1.80"
            step="0.02"
            value={vin}
            onChange={(e) => setVin(parseFloat(e.target.value))}
            className={styles.slider}
            style={{ accentColor: "var(--accent-amber)" }}
          />
        </div>
      </div>

      {/* Graphs & Schematic Panel */}
      <div className={styles.displayPanel}>
        <div className={styles.chartContainer}>
          <svg className={styles.chartSvg} viewBox={`0 0 ${svgW} ${svgH}`}>
            <defs>
              <linearGradient id="vtcGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="50%" stopColor="var(--accent-blue)" />
                <stop offset="100%" stopColor="var(--accent-teal)" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1={mapX(0)} y1={mapY(0.9)} x2={mapX(VDD)} y2={mapY(0.9)} className={styles.gridLine} />
            <line x1={mapX(0.9)} y1={mapY(0)} x2={mapX(0.9)} y2={mapY(VDD)} className={styles.gridLine} />

            {/* Axes */}
            <line x1={mapX(0)} y1={mapY(0)} x2={mapX(VDD)} y2={mapY(0)} className={styles.axis} />
            <line x1={mapX(0)} y1={mapY(0)} x2={mapX(0)} y2={mapY(VDD)} className={styles.axis} />

            {/* Axis Labels */}
            <text x={mapX(VDD) - 10} y={mapY(0) + 20} className={styles.axisLabel}>
              Vin (V)
            </text>
            <text x={mapX(0) - 30} y={mapY(VDD) + 10} className={styles.axisLabel} transform={`rotate(-90 ${mapX(0) - 30} ${mapY(VDD) + 10})`}>
              Vout (V)
            </text>

            {/* Tick marks */}
            <text x={mapX(0) - 15} y={mapY(0) + 4} className={styles.axisLabel}>0</text>
            <text x={mapX(0.9) - 10} y={mapY(0) + 15} className={styles.axisLabel}>0.9</text>
            <text x={mapX(VDD) - 10} y={mapY(0) + 15} className={styles.axisLabel}>1.8</text>
            <text x={mapX(0) - 22} y={mapY(0.9) + 4} className={styles.axisLabel}>0.9</text>
            <text x={mapX(0) - 22} y={mapY(VDD) + 4} className={styles.axisLabel}>1.8</text>

            {/* Curve */}
            <path d={curvePath} className={styles.curve} />

            {/* Intersection Dot */}
            <circle cx={mapX(vin)} cy={mapY(vout)} r="6" className={styles.dot} />
          </svg>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Output Voltage (Vout)</span>
            <span className={styles.metricVal} style={{ color: "var(--accent-cyan)" }}>
              {vout.toFixed(3)} V
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Logic Threshold (Vm)</span>
            <span className={styles.metricVal} style={{ color: "var(--accent-blue)" }}>
              {Vm.toFixed(3)} V
            </span>
          </div>
        </div>

        <div className={styles.schematicSection}>
          {/* Dynamic SVG Schematic */}
          <svg className={styles.schematic} viewBox="0 0 100 130">
            {/* Rails */}
            <line x1="20" y1="10" x2="80" y2="10" stroke="var(--text-muted)" strokeWidth="2" />
            <text x="50" y="8" fill="var(--text-muted)" fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">VDD (1.8V)</text>
            
            <line x1="20" y1="120" x2="80" y2="120" stroke="var(--text-muted)" strokeWidth="2" />
            <text x="50" y="128" fill="var(--text-muted)" fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">GND (0V)</text>

            {/* PMOS (Top Transistor) */}
            {/* Source Connection */}
            <line x1="50" y1="10" x2="50" y2="30" stroke={region.id === "A" || region.id === "B" || region.shortCircuit ? "var(--accent-cyan)" : "var(--border-glass)"} strokeWidth={region.id === "A" || region.id === "B" || region.shortCircuit ? "3" : "2"} />
            {/* PMOS Box/Body */}
            <rect x="42" y="30" width="16" height="20" rx="2" fill="var(--bg-secondary)" stroke="var(--text-primary)" strokeWidth="1.5" />
            {/* PMOS Gate Circle */}
            <circle cx="37" cy="40" r="3" fill="var(--bg-secondary)" stroke="var(--text-primary)" strokeWidth="1.5" />
            {/* Gate Line */}
            <line x1="25" y1="40" x2="34" y2="40" stroke="var(--text-primary)" strokeWidth="1.5" />
            <text x="50" y="42" fill={region.pmosColor} fontSize="8" textAnchor="middle" fontWeight="bold">P</text>

            {/* NMOS (Bottom Transistor) */}
            {/* Source Connection */}
            <line x1="50" y1="100" x2="50" y2="120" stroke={region.id === "D" || region.id === "E" || region.shortCircuit ? "var(--accent-cyan)" : "var(--border-glass)"} strokeWidth={region.id === "D" || region.id === "E" || region.shortCircuit ? "3" : "2"} />
            {/* NMOS Box/Body */}
            <rect x="42" y="80" width="16" height="20" rx="2" fill="var(--bg-secondary)" stroke="var(--text-primary)" strokeWidth="1.5" />
            {/* Gate Line */}
            <line x1="25" y1="90" x2="42" y2="90" stroke="var(--text-primary)" strokeWidth="1.5" />
            <text x="50" y="92" fill={region.nmosColor} fontSize="8" textAnchor="middle" fontWeight="bold">N</text>

            {/* Inter-transistor connections */}
            <line x1="50" y1="50" x2="50" y2="80" stroke={region.id === "A" || region.id === "B" ? "var(--accent-cyan)" : (region.id === "D" || region.id === "E" ? "var(--border-glass)" : "var(--accent-amber)")} strokeWidth="2" />
            {/* Output Node */}
            <circle cx="50" cy="65" r="3" fill="var(--accent-amber)" />
            <line x1="50" y1="65" x2="85" y2="65" stroke="var(--accent-amber)" strokeWidth="2" />
            <text x="88" y="68" fill="var(--accent-amber)" fontSize="8" fontWeight="bold">Out</text>

            {/* Input wire */}
            <line x1="15" y1="65" x2="25" y2="65" stroke="var(--accent-cyan)" strokeWidth="2" />
            <line x1="25" y1="40" x2="25" y2="90" stroke="var(--accent-cyan)" strokeWidth="2" />
            <text x="10" y="68" fill="var(--accent-cyan)" fontSize="8" fontWeight="bold">In</text>

            {/* Short circuit glow arrow */}
            {region.shortCircuit && (
              <path d="M 50 20 L 50 110" stroke="var(--accent-rose)" strokeWidth="3" markerEnd="url(#arrow)" strokeDasharray="3,3" />
            )}
          </svg>

          {/* Region details */}
          <div className={styles.regionInfo}>
            <span className={styles.regionBadge}>{region.title}</span>
            <span className={styles.regionTitle}>
              PMOS: <span style={{ color: region.pmosColor }}>{region.pmosState}</span> | NMOS:{" "}
              <span style={{ color: region.nmosColor }}>{region.nmosState}</span>
            </span>
            <p className={styles.regionDesc}>{region.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
