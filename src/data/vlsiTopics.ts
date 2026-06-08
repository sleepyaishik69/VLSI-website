export interface Topic {
  id: string;
  title: string;
  category: "Fundamentals" | "Circuit Design" | "Timing & Analysis" | "Backend & Mfg";
  subtitle: string;
  analogy: string;
  content: string;
  keyConcepts: { title: string; desc: string }[];
  formulas: string[];
  verilogCode?: string;
  quickReview: {
    question: string;
    options: string[];
    answerIdx: number;
    explanation: string;
  };
}

export const vlsiTopics: Topic[] = [
  {
    id: "intro-to-vlsi",
    title: "1. Introduction to VLSI",
    category: "Fundamentals",
    subtitle: "How billions of switches fit onto a single sliver of silicon.",
    analogy: "Think of an old mainframe computer as a giant city where you have to travel miles between buildings. VLSI is like shrinking that entire city—skyscrapers, roads, power lines—down so it fits inside a single microscopic block.",
    content: "Very Large Scale Integration (VLSI) is the process of creating an integrated circuit (IC) by combining millions or billions of MOS transistors onto a single chip. It started in the 1970s as semiconductor manufacturing advanced, moving from Small Scale Integration (SSI, tens of transistors) to Medium (MSI, hundreds), Large (LSI, thousands), and finally VLSI (millions/billions).\n\nAt the heart of VLSI is Moore's Law, an empirical observation made by Intel co-founder Gordon Moore. It states that the number of transistors on a microchip doubles approximately every two years, while the cost of computers is halved. This exponential scaling drove the digital revolution, enabling everything from smartphones to artificial intelligence accelerators.",
    keyConcepts: [
      {
        title: "Integrated Circuit (IC)",
        desc: "A small semiconductor wafer on which thousands or millions of tiny resistors, capacitors, and transistors are fabricated."
      },
      {
        title: "Moore's Law",
        desc: "Observation that transistor density doubles every 18-24 months. Although physical limits of silicon are slowing it down, advanced packaging (3D ICs) keeps it alive."
      },
      {
        title: "Scaling Effects",
        desc: "As transistors get smaller, they become faster, consume less dynamic power, and cost less per transistor, but leak more static current (leakage power)."
      }
    ],
    formulas: [
      "Moore's Law Density: N(t) = N_0 * 2^(t / d), where d ≈ 1.5 to 2 years",
      "Scaling Factor (S): Reductions in transistor dimensions by 1/S (e.g., 0.7x) reduce cell area by ~0.5x."
    ],
    quickReview: {
      question: "Which of the following is NOT a direct benefit of transistor scaling?",
      options: [
        "Increased switching speed",
        "Reduced manufacturing cost per transistor",
        "Increased subthreshold leakage current (static power)",
        "Zero power dissipation at higher clock speeds"
      ],
      answerIdx: 3,
      explanation: "Scaling reduces dynamic power per transistor, but operating at higher clock speeds and scaling limits actually increases power density and subthreshold leakage, making power dissipation a critical bottleneck."
    }
  },
  {
    id: "mosfet-physics",
    title: "2. MOSFET Physics",
    category: "Fundamentals",
    subtitle: "The microscopic valve that controls the flow of electricity.",
    analogy: "Imagine a water pipe (the Channel) with a valve (the Gate) controlling the flow from the faucet (Source) to the drain (Drain). Turning the valve opens or closes the flow of water. In a MOSFET, the gate voltage creates an electric field that opens or closes the channel for electrons.",
    content: "The Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET) is the basic building block of modern digital circuits. It is a three-terminal (or four-terminal if we count the Bulk/Body) device where voltage applied to the Gate controls current flow between the Source and the Drain.\n\nFor an n-channel MOSFET (NMOS), the bulk is p-type silicon and the source/drain are n+ diffusions. When a positive voltage ($V_{gs}$) exceeding the threshold voltage ($V_{th}$) is applied to the Gate, it repels positive holes from the channel area and attracts negative electrons, forming an n-type inversion channel. Current can then flow from Drain to Source if a drain-source voltage ($V_{ds}$) is applied.",
    keyConcepts: [
      {
        title: "Threshold Voltage (Vth)",
        desc: "The minimum gate-to-source voltage required to create a conducting channel between source and drain."
      },
      {
        title: "Cutoff Region (Vgs < Vth)",
        desc: "The transistor is off. No channel is formed, and only a tiny subthreshold leakage current flows."
      },
      {
        title: "Linear/Triode Region (Vgs >= Vth, Vds < Vgs - Vth)",
        desc: "The channel acts like a voltage-controlled resistor. Current increases linearly with drain voltage."
      },
      {
        title: "Saturation Region (Vgs >= Vth, Vds >= Vgs - Vth)",
        desc: "The channel 'pinches off' near the drain. Current saturates and remains relatively constant regardless of higher drain voltages."
      }
    ],
    formulas: [
      "Linear Current: I_d = μ * C_ox * (W/L) * [ (V_gs - V_th)*V_ds - 0.5 * V_ds^2 ]",
      "Saturation Current: I_d = 0.5 * μ * C_ox * (W/L) * (V_gs - V_th)^2 * (1 + λ * V_ds)",
      "Threshold Voltage: V_th = V_th0 + γ * [ sqrt(2*Φ_f + V_sb) - sqrt(2*Φ_f) ] (Body Effect)"
    ],
    quickReview: {
      question: "What happens when Vds is increased beyond (Vgs - Vth) in a MOSFET?",
      options: [
        "The current drops to zero.",
        "The conducting channel pinches off at the drain end, and current saturates.",
        "The transistor immediately burns out due to latchup.",
        "The channel becomes twice as wide."
      ],
      answerIdx: 1,
      explanation: "When Vds >= Vgs - Vth, the channel pinches off at the drain side, causing the drain current (Id) to saturate (flatten out) and become independent of further increases in Vds."
    }
  },
  {
    id: "cmos-inverter",
    title: "3. CMOS Inverter",
    category: "Circuit Design",
    subtitle: "The fundamental gate: converting ones to zeros and zeros to ones.",
    analogy: "Think of a CMOS inverter like a two-valve system on a tank. The upper valve (PMOS) connects the tank to a water supply (VDD). The lower valve (NMOS) connects the tank to a drain (GND). A single lever (Input) controls both. When you pull the lever up (High input), the water supply closes and the drain opens, emptying the tank (Low output). When you push it down (Low input), the drain closes and the supply opens, filling the tank (High output).",
    content: "Complementary MOS (CMOS) technology pairs NMOS and PMOS transistors. A CMOS inverter consists of a PMOS pull-up network connected to $V_{DD}$ and an NMOS pull-down network connected to Ground (GND), both sharing the same input Gate.\n\nCMOS is preferred over load-resistor NMOS because it consumes virtually **zero static power**. In either state (Input High or Low), one of the transistors is completely off, blocking any direct path from $V_{DD}$ to Ground. Power is only dissipated during switching (dynamic power) when load capacitances are charged and discharged.",
    keyConcepts: [
      {
        title: "Voltage Transfer Characteristics (VTC)",
        desc: "A plot of Vout vs Vin. It shows five regions of operation and determines the logic threshold voltage (Vm, where Vin = Vout)."
      },
      {
        title: "Noise Margins (NMH & NML)",
        desc: "The measure of a gate's tolerance to electrical noise. NMH = VOH - VIH, and NML = VIL - VOL."
      },
      {
        title: "Dynamic Power Dissipation",
        desc: "Power consumed during switching due to capacitive charging/discharging: P = C * Vdd^2 * f."
      },
      {
        title: "Short-Circuit Power",
        desc: "A brief spike in current when both PMOS and NMOS are partially on simultaneously during an input transition."
      }
    ],
    formulas: [
      "Dynamic Power: P_dynamic = α * C_L * V_dd^2 * f_clk (α is the switching activity)",
      "Logic Threshold (V_m): V_m ≈ (V_dd - |V_thp| + V_thn * sqrt(β_n / β_p)) / (1 + sqrt(β_n / β_p))",
      "Symmetrical Inverter Condition: β_n = β_p  =>  (W/L)_p ≈ 2.5 * (W/L)_n (since holes are slower than electrons)"
    ],
    quickReview: {
      question: "Why does a symmetrical CMOS inverter require the PMOS width (Wp) to be larger than the NMOS width (Wn)?",
      options: [
        "PMOS transistors leak more current.",
        "PMOS has higher threshold voltage.",
        "Holes (PMOS carriers) have lower mobility than electrons (NMOS carriers).",
        "PMOS is placed at the bottom near ground."
      ],
      answerIdx: 2,
      explanation: "Hole mobility in silicon is roughly 2 to 3 times lower than electron mobility. To match the drive currents and achieve a symmetrical delay, the width of the PMOS (Wp) must be sized larger than NMOS (Wn) by that same ratio."
    }
  },
  {
    id: "combinational-sequential",
    title: "4. Combinational & Sequential Circuits",
    category: "Circuit Design",
    subtitle: "Building logic networks and memory elements.",
    analogy: "Combinational circuits are like a calculator: you press '5 + 3' and immediately get '8'—it doesn't care about what you calculated yesterday. Sequential circuits are like a stopwatch: the output ('9 seconds') depends not only on pressing the start button, but also on the current time value stored in its memory.",
    content: "Digital design is split into combinational and sequential logic. Combinational circuits have outputs that depend *only* on the current inputs (e.g., NAND gates, multiplexers, decoders). Sequential circuits have outputs that depend on both current inputs and the history of inputs (stored memory). They require memory elements like Latches and Flip-Flops controlled by a clock signal.\n\nDesigning CMOS gates involves making a pull-up network of PMOS (which conduct when input is '0') and a pull-down network of NMOS (which conduct when input is '1'). Due to de Morgan's laws, PMOS in parallel act as an AND gate, while NMOS in series act as an AND gate, resulting in naturally inverting logic (NAND, NOR, Inverters).",
    keyConcepts: [
      {
        title: "Pull-Up vs Pull-Down",
        desc: "PMOS transistors pull the output to VDD (1). NMOS transistors pull the output to GND (0)."
      },
      {
        title: "Latch vs Flip-Flop",
        desc: "A latch is level-sensitive (opens and closes while clock is high/low). A flip-flop is edge-sensitive (updates only on the clock edge, e.g. rising edge)."
      },
      {
        title: "Setup Time (Tsu)",
        desc: "The minimum time that data must be stable *before* the clock active edge arrives at a flip-flop."
      },
      {
        title: "Hold Time (Th)",
        desc: "The minimum time that data must remain stable *after* the clock active edge has passed."
      }
    ],
    formulas: [
      "Combinational Delay: T_delay = Σ T_gate_delay (along the critical path)",
      "Setup Constraint: T_clk >= T_cq + T_comb + T_su - T_skew",
      "Hold Constraint: T_cq + T_comb >= T_h + T_skew"
    ],
    verilogCode: `// Example of an Edge-Triggered D Flip-Flop with Active-Low Reset
module d_ff (
    input wire clk,
    input wire rst_n,
    input wire d,
    output reg q
);
    // Triggered only on the positive edge of clock or negative edge of reset
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            q <= 1'b0; // Reset Q to 0
        end else begin
            q <= d;    // Capture input D
        end
    end
endmodule`,
    quickReview: {
      question: "What happens if the data signal changes within the Setup and Hold time window?",
      options: [
        "The output changes immediately.",
        "The flip-flop enters a metastable state, oscillating between 0 and 1, causing timing failure.",
        "The clock frequency increases automatically.",
        "The reset signal is automatically triggered."
      ],
      answerIdx: 1,
      explanation: "If data transitions inside the setup-hold window, the internal feedback loop cannot resolve to a stable 1 or 0 quickly, entering a state called 'metastability' which can propagate errors."
    }
  },
  {
    id: "static-timing-analysis",
    title: "5. Static Timing Analysis (STA)",
    category: "Timing & Analysis",
    subtitle: "Making sure the chip ticks at the right speed without crashes.",
    analogy: "Imagine a relay race. The runner (Data) must pass the baton to the next runner (Flip-Flop) before the referee blows the whistle (Clock edge). If the runner is too slow (Setup violation), they miss the pass. If the runner takes off too early before the previous pass is stable (Hold violation), they drop the baton.",
    content: "Static Timing Analysis (STA) is a method of validating the timing performance of a design by checking all possible paths for timing violations under worst-case and best-case conditions. Unlike dynamic simulation, STA doesn't require input test vectors; it calculates delays mathematically along every timing path.\n\nEvery timing path consists of: a Startpoint (clock pin of launch register), a Combinational Data Path, and an Endpoint (data input pin of capture register). STA ensures two critical constraints: Setup Slack (checking if the slowest data arrives in time) and Hold Slack (checking if the fastest data doesn't overwrite data too early).",
    keyConcepts: [
      {
        title: "Timing Path Types",
        desc: "Reg-to-Reg (most common), Input-to-Reg, Reg-to-Output, and Input-to-Output paths."
      },
      {
        title: "Clock Skew",
        desc: "The difference in clock arrival times at the launch and capture registers due to varying wire lengths."
      },
      {
        title: "Clock Jitter",
        desc: "The short-term variation of a clock transition edge from its ideal position, reducing available setup margin."
      },
      {
        title: "Slack",
        desc: "The difference between Required Time and Arrival Time. Positive slack is good; negative slack indicates a timing violation."
      }
    ],
    formulas: [
      "Data Arrival Time (Setup) = T_clk1_arrival + T_cq + T_comb_max",
      "Data Required Time (Setup) = T_clk_period + T_clk2_arrival - T_su - T_jitter",
      "Setup Slack = Data Required Time - Data Arrival Time",
      "Hold Slack = (T_cq + T_comb_min) - (T_h + T_skew)"
    ],
    quickReview: {
      question: "Which timing violation is independent of the clock period (frequency)?",
      options: [
        "Setup violation",
        "Hold violation",
        "Both Setup and Hold violations",
        "Neither"
      ],
      answerIdx: 1,
      explanation: "Hold violations are independent of clock period because the hold check compares the data delay of the current cycle against the clock edge of the same cycle. Speeding up or slowing down the clock does not fix a hold violation."
    }
  },
  {
    id: "physical-design",
    title: "6. VLSI Physical Design Flow",
    category: "Backend & Mfg",
    subtitle: "Transforming code (Verilog) into physical blueprints of metal and silicon.",
    analogy: "Think of this as city planning. First, you list what buildings you need (Synthesis). Next, you draw the city limits and block zones (Floorplanning). You place the heavy power generators and water pipes (Power Planning). Then, you build the houses (Placement) and construct a synchronized transit network (Clock Tree Synthesis). Finally, you pave the streets between houses (Routing) and check zoning laws (DRC/LVS).",
    content: "Physical Design is the backend phase of the VLSI design flow. It converts the Gate-Level Netlist (generated by synthesis from RTL codes like Verilog) into a physical layout in GDSII format, which is sent to the foundry (tape-out) for manufacturing.\n\nThe layout process must respect strict design rules (width, spacing of layers) and electrical requirements (timing, electromigration, voltage drop). The flow is highly iterative, using automated Electronic Design Automation (EDA) tools.",
    keyConcepts: [
      {
        title: "Synthesis",
        desc: "Translating human-readable RTL code (Verilog/VHDL) into logic gates based on a technology library."
      },
      {
        title: "Floorplanning",
        desc: "Defining the chip size, aspect ratio, IO pad placements, and grouping blocks to optimize area and signal flow."
      },
      {
        title: "Placement",
        desc: "Determining the exact coordinates of every standard logic cell (NAND, NOR, flip-flop) to minimize wire length."
      },
      {
        title: "Clock Tree Synthesis (CTS)",
        desc: "Creating an optimized distribution network (typically using an H-tree buffer network) to deliver the clock signal to all registers simultaneously, minimizing skew."
      },
      {
        title: "Routing",
        desc: "Paving metal wires to connect the placed cells according to the netlist. Split into Global Routing and Detail Routing."
      },
      {
        title: "Signoff Verification",
        desc: "Checking Design Rule Checks (DRC - physical limits) and Layout Versus Schematic (LVS - comparison against the netlist)."
      }
    ],
    formulas: [
      "Congestion Rate: Connected nets / available routing tracks. High congestion causes routing failures.",
      "IR Drop: V_drop = I * R. Voltage drop in the power grid due to wire resistance, slowing down logic."
    ],
    quickReview: {
      question: "What is the primary goal of Clock Tree Synthesis (CTS)?",
      options: [
        "To maximize clock frequency",
        "To distribute the clock signal to all flip-flops with minimum skew and delay",
        "To route the data signals faster",
        "To perform logic synthesis"
      ],
      answerIdx: 1,
      explanation: "CTS aims to distribute the clock signal uniformly to all registers, ensuring that the clock reaches all registers at the exact same instant to minimize clock skew."
    }
  },
  {
    id: "fabrication",
    title: "7. Fabrication Steps",
    category: "Backend & Mfg",
    subtitle: "Printing features smaller than a virus onto silicon disks.",
    analogy: "Imagine making a giant multi-layered stencil painting. You coat a canvas with paint (Oxidation/Deposition), place a stencil over it, shine light on it to harden certain parts (Photolithography), wash away the unhardened parts (Etching), and spray another color (Doping/Metallization). Repeat this 50-80 times to build a complex, three-dimensional structure.",
    content: "Semiconductor fabrication is a series of chemical and physical processes performed on thin circular slices of silicon called wafers. This takes place inside specialized ultra-clean cleanrooms (Class 1 or Class 10) to prevent dust particles from ruining microscopic features.\n\nModern transistors have channel dimensions measured in nanometers (e.g., 5nm, 3nm). Building these requires advanced Extreme Ultraviolet (EUV) photolithography, using light wavelengths of 13.5nm to print nanoscopic designs.",
    keyConcepts: [
      {
        title: "Wafer Preparation",
        desc: "Growing a single-crystal silicon ingot (boule) and slicing it into thin wafers."
      },
      {
        title: "Photolithography",
        desc: "The primary printing process. A photosensitive chemical (photoresist) is coated, exposed to UV light through a photomask, and developed to expose patterns."
      },
      {
        title: "Etching",
        desc: "Removing unwanted materials. Wet etching uses liquid chemicals; dry (plasma) etching is directional and used for sub-micron features."
      },
      {
        title: "Doping (Ion Implantation)",
        desc: "Shooting high-energy dopant ions (Boron for p-type, Phosphorus/Arsenic for n-type) into silicon to modify electrical conductivity."
      },
      {
        title: "Chemical Mechanical Planarization (CMP)",
        desc: "Polishing and flattening the wafer surface after each deposition step to ensure lithographic focus on subsequent layers."
      }
    ],
    formulas: [
      "Lithographic Resolution limit: CD = k_1 * λ / NA, where λ is light wavelength, NA is Numerical Aperture, and k_1 is a process factor.",
      "Wafer Yield: Yield = (1 + D*A/N)^(-N) (Murphy's yield model, where D is defect density, A is chip area)."
    ],
    quickReview: {
      question: "Which wavelength of light is used in modern EUV (Extreme Ultraviolet) lithography machines?",
      options: [
        "193 nm",
        "248 nm",
        "13.5 nm",
        "365 nm"
      ],
      answerIdx: 2,
      explanation: "EUV lithography uses a wavelength of 13.5 nm, which allows foundries to print much smaller features without resorting to complex multi-patterning techniques."
    }
  }
];
