"use client";

import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vlsiTopics, Topic } from "@/data/vlsiTopics";
import CmosVtcSim from "@/components/simulators/CmosVtcSim";
import TimingSim from "@/components/simulators/TimingSim";
import Quiz from "@/components/Quiz";
import styles from "./topics.module.css";

// Helper component to render specific SVG diagrams for each topic
function TopicDiagram({ topicId }: { topicId: string }) {
  switch (topicId) {
    case "intro-to-vlsi":
      return (
        <svg className={styles.diagramSvg} viewBox="0 0 300 120">
          {/* Silicon Wafer & Dies */}
          <circle cx="150" cy="60" r="50" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="2" />
          <path d="M 100 60 L 200 60 M 150 10 L 150 110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {/* Micro Grid (Dies) */}
          <line x1="120" y1="20" x2="120" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="180" y1="20" x2="180" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="100" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="100" y1="80" x2="200" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Zoomed Chip Detail */}
          <rect x="220" y="30" width="40" height="40" rx="4" fill="var(--bg-tertiary)" stroke="var(--accent-cyan)" strokeWidth="1.5" />
          <line x1="200" y1="60" x2="220" y2="50" stroke="var(--accent-cyan)" strokeDasharray="2,2" strokeWidth="1" />
          <line x1="200" y1="80" x2="220" y2="70" stroke="var(--accent-cyan)" strokeDasharray="2,2" strokeWidth="1" />
          {/* Internal gates */}
          <circle cx="230" cy="50" r="4" fill="var(--accent-cyan)" />
          <circle cx="250" cy="50" r="4" fill="var(--accent-blue)" />
          <line x1="234" y1="50" x2="246" y2="50" stroke="var(--text-primary)" strokeWidth="1" />
        </svg>
      );
    case "mosfet-physics":
      return (
        <svg className={styles.diagramSvg} viewBox="0 0 300 130">
          {/* Substrate */}
          <rect x="50" y="60" width="200" height="50" fill="var(--bg-secondary)" stroke="var(--text-muted)" strokeWidth="1.5" />
          <text x="150" y="100" fill="var(--text-muted)" fontSize="8" textAnchor="middle">P-Substrate (Bulk)</text>
          
          {/* Source and Drain N+ Diffusions */}
          <rect x="70" y="60" width="35" height="20" fill="rgba(0, 242, 254, 0.15)" stroke="var(--accent-cyan)" strokeWidth="1" />
          <text x="87" y="72" fill="var(--accent-cyan)" fontSize="8" textAnchor="middle">N+ Source</text>

          <rect x="195" y="60" width="35" height="20" fill="rgba(0, 242, 254, 0.15)" stroke="var(--accent-cyan)" strokeWidth="1" />
          <text x="212" y="72" fill="var(--accent-cyan)" fontSize="8" textAnchor="middle">N+ Drain</text>

          {/* Oxide Layer */}
          <rect x="105" y="52" width="90" height="8" fill="var(--bg-tertiary)" stroke="var(--accent-amber)" strokeWidth="1" />
          <text x="150" y="58" fill="var(--accent-amber)" fontSize="6" textAnchor="middle">Gate Oxide (SiO2)</text>

          {/* Gate Poly */}
          <rect x="115" y="32" width="70" height="20" fill="rgba(79, 172, 254, 0.2)" stroke="var(--accent-blue)" strokeWidth="1" />
          <text x="150" y="44" fill="var(--accent-blue)" fontSize="8" textAnchor="middle">Polysilicon Gate</text>

          {/* Conducting Channel */}
          <line x1="105" y1="62" x2="195" y2="62" stroke="var(--accent-teal)" strokeWidth="3" strokeDasharray="3,3" />
          <text x="150" y="75" fill="var(--accent-teal)" fontSize="7" textAnchor="middle" fontWeight="bold">Induced N-Channel</text>

          {/* Terminals */}
          <line x1="150" y1="15" x2="150" y2="32" stroke="var(--text-primary)" strokeWidth="1.5" />
          <text x="150" y="12" fill="var(--text-primary)" fontSize="8" textAnchor="middle">Gate (G)</text>

          <line x1="87" y1="40" x2="87" y2="60" stroke="var(--text-primary)" strokeWidth="1.5" />
          <text x="87" y="35" fill="var(--text-primary)" fontSize="8" textAnchor="middle">Source (S)</text>

          <line x1="212" y1="40" x2="212" y2="60" stroke="var(--text-primary)" strokeWidth="1.5" />
          <text x="212" y="35" fill="var(--text-primary)" fontSize="8" textAnchor="middle">Drain (D)</text>
        </svg>
      );
    case "cmos-inverter":
      return (
        <svg className={styles.diagramSvg} viewBox="0 0 300 130">
          {/* CMOS Inverter Logic Symbol & Schematic overview */}
          {/* Left: Schematic symbol */}
          <path d="M 60 40 L 60 90 L 105 65 Z" fill="none" stroke="var(--accent-blue)" strokeWidth="2" />
          <circle cx="111" cy="65" r="5" fill="var(--bg-primary)" stroke="var(--accent-blue)" strokeWidth="2" />
          <line x1="35" y1="65" x2="60" y2="65" stroke="var(--accent-cyan)" strokeWidth="2" />
          <text x="25" y="68" fill="var(--accent-cyan)" fontSize="8" fontWeight="bold">Vin</text>
          <line x1="116" y1="65" x2="140" y2="65" stroke="var(--accent-amber)" strokeWidth="2" />
          <text x="150" y="68" fill="var(--accent-amber)" fontSize="8" fontWeight="bold">Vout</text>

          {/* Right: Small symmetrical VTC curve mockup */}
          <rect x="190" y="25" width="80" height="80" fill="none" stroke="var(--text-muted)" strokeWidth="1" />
          <path d="M 190 30 L 220 30 C 230 30, 230 100, 240 100 L 270 100" fill="none" stroke="var(--accent-teal)" strokeWidth="2" />
          <text x="230" y="20" fill="var(--text-muted)" fontSize="7" textAnchor="middle">Inverter VTC</text>
        </svg>
      );
    case "combinational-sequential":
      return (
        <svg className={styles.diagramSvg} viewBox="0 0 300 120">
          {/* Combinational Logic Cloud vs Flip-Flop */}
          {/* D FF */}
          <rect x="180" y="30" width="60" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="2" />
          <text x="210" y="65" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">D-FF</text>
          {/* Pins */}
          <line x1="150" y1="45" x2="180" y2="45" stroke="var(--accent-cyan)" strokeWidth="1.5" />
          <text x="185" y="48" fill="var(--accent-cyan)" fontSize="7">D</text>
          <line x1="240" y1="60" x2="270" y2="60" stroke="var(--accent-amber)" strokeWidth="1.5" />
          <text x="232" y="63" fill="var(--accent-amber)" fontSize="7">Q</text>
          {/* Clock indicator */}
          <path d="M 180 75 L 190 80 L 180 85" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" />
          <line x1="160" y1="80" x2="180" y2="80" stroke="var(--text-primary)" strokeWidth="1.5" />
          <text x="150" y="83" fill="var(--text-muted)" fontSize="7">CLK</text>

          {/* Comb Cloud */}
          <path d="M 50 50 C 40 30, 80 20, 100 40 C 120 30, 140 50, 130 70 C 140 90, 110 100, 90 90 C 70 100, 40 80, 50 50 Z" fill="rgba(0, 242, 254, 0.05)" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="90" y="62" fill="var(--accent-cyan)" fontSize="8" fontWeight="bold" textAnchor="middle">Combinational</text>
          <text x="90" y="72" fill="var(--accent-cyan)" fontSize="8" fontWeight="bold" textAnchor="middle">Logic Cloud</text>
          <line x1="130" y1="60" x2="150" y2="60" stroke="var(--text-primary)" strokeWidth="1.5" />
        </svg>
      );
    case "static-timing-analysis":
      return (
        <svg className={styles.diagramSvg} viewBox="0 0 300 120">
          {/* Timing Path: Reg1 -> Cloud -> Reg2 */}
          {/* Reg1 */}
          <rect x="25" y="35" width="40" height="50" rx="3" fill="var(--bg-secondary)" stroke="var(--text-primary)" strokeWidth="1.5" />
          <text x="45" y="65" fill="var(--text-primary)" fontSize="8" textAnchor="middle">Reg Launch</text>
          
          {/* Reg2 */}
          <rect x="235" y="35" width="40" height="50" rx="3" fill="var(--bg-secondary)" stroke="var(--text-primary)" strokeWidth="1.5" />
          <text x="255" y="65" fill="var(--text-primary)" fontSize="8" textAnchor="middle">Reg Capture</text>

          {/* Logic Cloud */}
          <path d="M 110 50 C 105 35, 140 25, 160 40 C 180 30, 195 50, 185 70 C 195 85, 170 95, 150 85 C 130 95, 105 80, 110 50 Z" fill="rgba(79, 172, 254, 0.05)" stroke="var(--accent-blue)" strokeWidth="1.5" />
          <text x="148" y="64" fill="var(--accent-blue)" fontSize="8" fontWeight="bold" textAnchor="middle">Logic (Tcomb)</text>

          {/* Connections */}
          <line x1="65" y1="60" x2="110" y2="60" stroke="var(--accent-cyan)" strokeWidth="1.5" />
          <text x="87" y="54" fill="var(--accent-cyan)" fontSize="7" textAnchor="middle">Tcq</text>
          <line x1="185" y1="60" x2="235" y2="60" stroke="var(--accent-cyan)" strokeWidth="1.5" />

          {/* Clock Skew Lines */}
          <line x1="45" y1="110" x2="45" y2="85" stroke="var(--accent-teal)" strokeWidth="1.5" />
          <line x1="255" y1="110" x2="255" y2="85" stroke="var(--accent-teal)" strokeWidth="1.5" />
          <line x1="45" y1="110" x2="255" y2="110" stroke="var(--accent-teal)" strokeWidth="1.5" />
          <text x="150" y="105" fill="var(--accent-teal)" fontSize="7" textAnchor="middle">Clock Tree (Skew check)</text>
        </svg>
      );
    case "physical-design":
      return (
        <svg className={styles.diagramSvg} viewBox="0 0 300 120">
          {/* Flow Blocks */}
          {/* RTL */}
          <rect x="10" y="45" width="40" height="30" rx="3" fill="var(--bg-secondary)" stroke="var(--text-primary)" strokeWidth="1" />
          <text x="30" y="63" fill="var(--text-primary)" fontSize="8" textAnchor="middle">RTL Code</text>
          <path d="M 50 60 L 65 60" stroke="var(--accent-cyan)" strokeWidth="1.5" />

          {/* Synthesis */}
          <rect x="65" y="45" width="45" height="30" rx="3" fill="var(--bg-secondary)" stroke="var(--accent-cyan)" strokeWidth="1" />
          <text x="87" y="63" fill="var(--accent-cyan)" fontSize="8" textAnchor="middle">Synthesis</text>
          <path d="M 110 60 L 125 60" stroke="var(--accent-cyan)" strokeWidth="1.5" />

          {/* Floorplan */}
          <rect x="125" y="45" width="45" height="30" rx="3" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
          <text x="147" y="63" fill="var(--accent-blue)" fontSize="8" textAnchor="middle">Floorplan</text>
          <path d="M 170 60 L 185 60" stroke="var(--accent-cyan)" strokeWidth="1.5" />

          {/* Place & Route */}
          <rect x="185" y="45" width="45" height="30" rx="3" fill="var(--bg-secondary)" stroke="var(--accent-teal)" strokeWidth="1" />
          <text x="207" y="63" fill="var(--accent-teal)" fontSize="7" textAnchor="middle">Place & Route</text>
          <path d="M 230 60 L 245 60" stroke="var(--accent-cyan)" strokeWidth="1.5" />

          {/* Signoff */}
          <rect x="245" y="45" width="45" height="30" rx="3" fill="var(--bg-secondary)" stroke="var(--accent-amber)" strokeWidth="1" />
          <text x="267" y="63" fill="var(--accent-amber)" fontSize="8" textAnchor="middle">Signoff</text>
        </svg>
      );
    case "fabrication":
      return (
        <svg className={styles.diagramSvg} viewBox="0 0 300 120">
          {/* Photolithography Layers diagram */}
          {/* Silicon substrate */}
          <rect x="80" y="80" width="140" height="20" fill="#3b4252" stroke="#4c566a" strokeWidth="1" />
          <text x="150" y="92" fill="#d8dee9" fontSize="7" textAnchor="middle">Silicon Wafer Substrate</text>

          {/* Silicon Dioxide layer */}
          <rect x="80" y="70" width="140" height="10" fill="var(--accent-blue)" fillOpacity="0.3" stroke="var(--accent-blue)" strokeWidth="1" />
          <text x="150" y="77" fill="var(--accent-blue)" fontSize="6" textAnchor="middle">SiO2 Thin Film</text>

          {/* Photoresist */}
          <rect x="100" y="55" width="40" height="15" fill="var(--accent-amber)" fillOpacity="0.4" stroke="var(--accent-amber)" strokeWidth="1" />
          <rect x="160" y="55" width="40" height="15" fill="var(--accent-amber)" fillOpacity="0.4" stroke="var(--accent-amber)" strokeWidth="1" />
          <text x="150" y="50" fill="var(--accent-amber)" fontSize="6" textAnchor="middle">Photoresist Mask Pattern</text>

          {/* Light Exposure lines */}
          <line x1="120" y1="20" x2="120" y2="55" stroke="var(--accent-cyan)" strokeDasharray="2,2" strokeWidth="1" />
          <line x1="180" y1="20" x2="180" y2="55" stroke="var(--accent-cyan)" strokeDasharray="2,2" strokeWidth="1" />
          <text x="150" y="30" fill="var(--accent-cyan)" fontSize="7" textAnchor="middle">Ultraviolet / EUV Light</text>
        </svg>
      );
    default:
      return null;
  }
}

export default function TopicsPage() {
  const [activeTopicId, setActiveTopicId] = useState<string>("intro-to-vlsi");

  // Sync state with URL parameter if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTopic = params.get("topic");
    if (urlTopic) {
      if (urlTopic === "final-quiz" || vlsiTopics.some((t) => t.id === urlTopic)) {
        setActiveTopicId(urlTopic);
      }
    }
  }, []);

  const handleTopicSelect = (id: string) => {
    setActiveTopicId(id);
    // Update the URL search parameter without reloading the page
    const newUrl = `${window.location.pathname}?topic=${id}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    // Scroll reader pane into view on mobile
    if (window.innerWidth <= 900) {
      document.getElementById("reader-pane")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeTopic = vlsiTopics.find((t) => t.id === activeTopicId);

  // Group topics by category
  const categories: { name: string; list: Topic[] }[] = [
    {
      name: "Fundamentals",
      list: vlsiTopics.filter((t) => t.category === "Fundamentals"),
    },
    {
      name: "Circuit Design",
      list: vlsiTopics.filter((t) => t.category === "Circuit Design"),
    },
    {
      name: "Timing & Analysis",
      list: vlsiTopics.filter((t) => t.category === "Timing & Analysis"),
    },
    {
      name: "Backend & Mfg",
      list: vlsiTopics.filter((t) => t.category === "Backend & Mfg"),
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={`${styles.mainContent} bg-grid`}>
        {/* Sidebar Directory */}
        <aside className={`${styles.sidebar} glass`}>
          <h2 className={styles.sidebarTitle}>VLSI Courseware</h2>
          
          <nav style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {categories.map((cat) => (
              <div key={cat.name} className={styles.categoryGroup}>
                <span className={styles.categoryName}>{cat.name}</span>
                <ul className={styles.topicList}>
                  {cat.list.map((topic) => (
                    <li key={topic.id}>
                      <button
                        onClick={() => handleTopicSelect(topic.id)}
                        className={`${styles.topicItem} ${
                          activeTopicId === topic.id ? styles.activeTopic : ""
                        }`}
                      >
                        <span>{topic.title.split(". ")[1]}</span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>→</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className={styles.quizLinkItem}>
              <button
                onClick={() => handleTopicSelect("final-quiz")}
                className={`${styles.quizButton} ${
                  activeTopicId === "final-quiz" ? styles.activeTopic : ""
                }`}
              >
                🏆 Final Exam Quiz
              </button>
            </div>
          </nav>
        </aside>

        {/* Reader Pane */}
        <section id="reader-pane" className={`${styles.reader} glass`}>
          {activeTopicId === "final-quiz" ? (
            <div>
              <h2 className={styles.topicTitleText} style={{ marginBottom: "1.5rem" }}>
                WaferWise Course Final Examination
              </h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
                Test your knowledge across all 7 modules. Correct answers will be explained in
                detail, drawing connections between semiconductor physics, transistor circuit design,
                timing constraints, and cleanroom fabrication.
              </p>
              <Quiz />
            </div>
          ) : activeTopic ? (
            <>
              {/* Header */}
              <div className={styles.header}>
                <span className={styles.categoryTag}>{activeTopic.category}</span>
                <h1 className={styles.topicTitleText}>{activeTopic.title}</h1>
                <p className={styles.topicSubtitle}>{activeTopic.subtitle}</p>
              </div>

              {/* Analogy Box */}
              <div className={styles.analogyCard}>
                <span className={styles.analogyIcon}>💡</span>
                <div>
                  <h4 className={styles.analogyTitle}>Concept Analogy</h4>
                  <p className={styles.analogyBody}>{activeTopic.analogy}</p>
                </div>
              </div>

              {/* Main text explanation */}
              <article className={styles.articleBody}>{activeTopic.content}</article>

              {/* Dynamic Diagram */}
              <div className={styles.diagramWrapper}>
                <TopicDiagram topicId={activeTopic.id} />
                <span className={styles.diagramCaption}>
                  Fig {activeTopic.title.split(".")[0]}.1: Schematic diagram for {activeTopic.title.split(". ")[1]}
                </span>
              </div>

              {/* Key Concepts Grid */}
              <div className={styles.conceptsSection}>
                <h3 className={styles.sectionHeading}>Key Concepts</h3>
                <div className={styles.conceptsGrid}>
                  {activeTopic.keyConcepts.map((concept, index) => (
                    <div key={index} className={styles.conceptCard}>
                      <h4 className={styles.conceptTitle}>{concept.title}</h4>
                      <p className={styles.conceptDesc}>{concept.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulas */}
              <div className={styles.formulasSection}>
                <h3 className={styles.sectionHeading}>Governing Equations</h3>
                {activeTopic.formulas.map((formula, idx) => (
                  <div key={idx} className="formula">
                    {formula}
                  </div>
                ))}
              </div>

              {/* Verilog Code Block */}
              {activeTopic.verilogCode && (
                <div>
                  <h3 className={styles.sectionHeading}>Hardware Description (HDL)</h3>
                  <div className={styles.codeHeader}>
                    <span>Verilog Syntax</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeTopic.verilogCode || "");
                        alert("Copied code to clipboard!");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent-cyan)",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre className="code-block">
                    <code>{activeTopic.verilogCode}</code>
                  </pre>
                </div>
              )}

              {/* Interactive Playgrounds Mounting */}
              {activeTopic.id === "cmos-inverter" && (
                <div className={styles.simSection}>
                  <h3 className={styles.sectionHeading}>Interactive VTC Sandbox</h3>
                  <CmosVtcSim />
                </div>
              )}

              {activeTopic.id === "static-timing-analysis" && (
                <div className={styles.simSection}>
                  <h3 className={styles.sectionHeading}>Interactive Timing Slack Sandbox</h3>
                  <TimingSim />
                </div>
              )}

              {/* Topic review quiz */}
              <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "2rem", marginTop: "1rem" }}>
                <h3 className={styles.sectionHeading} style={{ marginBottom: "1rem" }}>
                  Quick Check: Test Your Knowledge
                </h3>
                <QuizSingleQuestion
                  reviewData={activeTopic.quickReview}
                  key={activeTopic.id} // force remount on topic change
                />
              </div>
            </>
          ) : (
            <div>Topic not found</div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Subcomponent to render a single review question inline under each topic
function QuizSingleQuestion({
  reviewData,
}: {
  reviewData: {
    question: string;
    options: string[];
    answerIdx: number;
    explanation: string;
  };
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{reviewData.question}</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {reviewData.options.map((opt, idx) => {
          let btnStyle: React.CSSProperties = {
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            border: "1px solid var(--border-glass)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            textAlign: "left",
            fontSize: "0.9rem",
            cursor: answered ? "default" : "pointer",
            transition: "all 0.2s",
          };

          if (answered) {
            if (idx === reviewData.answerIdx) {
              btnStyle.borderColor = "var(--accent-teal)";
              btnStyle.backgroundColor = "rgba(5, 230, 193, 0.08)";
              btnStyle.color = "#a7f3d0";
            } else if (idx === selectedIdx) {
              btnStyle.borderColor = "var(--accent-rose)";
              btnStyle.backgroundColor = "rgba(244, 63, 94, 0.08)";
              btnStyle.color = "#fca5a5";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              style={btnStyle}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "6px",
            borderLeft: "3.5px solid var(--accent-blue)",
            backgroundColor: "var(--bg-primary)",
            fontSize: "0.85rem",
            lineHeight: "1.5",
            color: "var(--text-secondary)",
          }}
        >
          <strong>
            {selectedIdx === reviewData.answerIdx ? "✓ Correct!" : "✗ Incorrect"}
          </strong>
          <p style={{ marginTop: "0.25rem" }}>{reviewData.explanation}</p>
        </div>
      )}
    </div>
  );
}
