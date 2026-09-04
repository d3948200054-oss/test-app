import {
  Exam,
  ExamAttempt,
  StudyBook,
  StudentProfile,
  LeaderboardEntry,
  PhoneHistoryEntry,
  Notice,
  AdminCandidateRecord
} from "../types";

export const INITIAL_EXAMS: Exam[] = [
  {
    id: "exam_jee_grand_2026",
    title: "JEE Advanced Grand All-India Mock (Paper 1)",
    description: "National standard full-syllabus test strictly replicating standard competitive exam patterns with timed sections and automated AI proctoring.",
    category: "JEE Mock",
    allottedCourse: "JEE Advanced (Target 2026)",
    durationMinutes: 45,
    totalMarks: 120,
    passingMarks: 45,
    negativeMarking: true,
    isLive: true,
    proctoringEnabled: true,
    scheduledAt: "Live Now (Instant Evaluation)",
    createdAt: "2026-08-15T10:00:00Z",
    sections: [
      { name: "Physics", questionIds: ["q_p1", "q_p2", "q_p3", "q_p4"] },
      { name: "Chemistry", questionIds: ["q_c1", "q_c2", "q_c3"] },
      { name: "Mathematics", questionIds: ["q_m1", "q_m2", "q_m3"] }
    ],
    questions: [
      {
        id: "q_p1",
        subject: "Physics",
        topic: "Rotational Dynamics & Rolling",
        difficulty: "Hard",
        questionType: "single_choice",
        questionText: "A solid cylinder of mass M and radius R rolls without slipping down an inclined plane of angle θ. What is the acceleration of the center of mass of the cylinder along the incline?",
        options: [
          { id: "opt_1", text: "g sin(θ)" },
          { id: "opt_2", text: "(2/3) g sin(θ)" },
          { id: "opt_3", text: "(1/2) g sin(θ)" },
          { id: "opt_4", text: "(3/4) g sin(θ)" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "For rolling without slipping on an incline: a = g sin(θ) / (1 + I_cm/(M R²)). For a solid cylinder, I_cm = (1/2) M R². Therefore, a = g sin(θ) / (1 + 1/2) = (2/3) g sin(θ).",
        hint: "Use torque equation about instantaneous center of rotation or standard rolling acceleration formula."
      },
      {
        id: "q_p2",
        subject: "Physics",
        topic: "Electromagnetic Induction & Circuits",
        difficulty: "Medium",
        questionType: "single_choice",
        questionText: "An inductor of inductance L = 2.0 H and resistance R = 10 Ω is connected across an ideal DC voltage source of V = 50 V at t = 0. Find the energy stored in the magnetic field at steady state.",
        options: [
          { id: "opt_1", text: "12.5 Joules" },
          { id: "opt_2", text: "25.0 Joules" },
          { id: "opt_3", text: "50.0 Joules" },
          { id: "opt_4", text: "100.0 Joules" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "At steady state (t -> ∞), the inductor behaves like a short circuit. Steady-state current I_0 = V / R = 50 / 10 = 5.0 A. Energy stored U = (1/2) L (I_0)² = 0.5 * 2.0 * (5.0)² = 25.0 J.",
        hint: "At steady state, dI/dt = 0, so the inductor offers zero inductive reactance."
      },
      {
        id: "q_p3",
        subject: "Physics",
        topic: "Modern Physics & Photoelectric Effect",
        difficulty: "Medium",
        questionType: "single_choice",
        questionText: "Monochromatic light of wavelength λ falls on a metal surface of work function Φ = 2.4 eV. If the stopping potential measured is 1.6 V, what is the energy of the incident photons?",
        options: [
          { id: "opt_1", text: "0.8 eV" },
          { id: "opt_2", text: "2.4 eV" },
          { id: "opt_3", text: "4.0 eV" },
          { id: "opt_4", text: "5.6 eV" }
        ],
        correctOptionIndex: 2,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "By Einstein's Photoelectric equation: E = Φ + K_max = Φ + e*V_s = 2.4 eV + 1.6 eV = 4.0 eV.",
        hint: "Stopping potential in volts corresponds directly to maximum kinetic energy in electron-volts (eV)."
      },
      {
        id: "q_p4",
        subject: "Physics",
        topic: "Wave Optics (Young's Double Slit)",
        difficulty: "Easy",
        questionType: "single_choice",
        questionText: "In Young's Double Slit Experiment, the slit separation is doubled while screen distance is halved. What happens to the fringe width β?",
        options: [
          { id: "opt_1", text: "Remains unchanged" },
          { id: "opt_2", text: "Doubled" },
          { id: "opt_3", text: "Becomes one-fourth (β/4)" },
          { id: "opt_4", text: "Becomes half (β/2)" }
        ],
        correctOptionIndex: 2,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "Fringe width β = λ D / d. When D' = D/2 and d' = 2d, β' = λ (D/2) / (2d) = (1/4) (λ D / d) = β / 4.",
        hint: "β is directly proportional to D and inversely proportional to d."
      },
      {
        id: "q_c1",
        subject: "Chemistry",
        topic: "Chemical Thermodynamics & Gibbs Energy",
        difficulty: "Hard",
        questionType: "single_choice",
        questionText: "For a given reaction at 300 K, ΔH = -60 kJ/mol and ΔS = -100 J/(K·mol). Calculate the Gibbs Free Energy change ΔG and determine spontaneity.",
        options: [
          { id: "opt_1", text: "ΔG = -30 kJ/mol, Spontaneous" },
          { id: "opt_2", text: "ΔG = +30 kJ/mol, Non-spontaneous" },
          { id: "opt_3", text: "ΔG = -90 kJ/mol, Spontaneous" },
          { id: "opt_4", text: "ΔG = 0 kJ/mol, Equilibrium" }
        ],
        correctOptionIndex: 0,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "ΔG = ΔH - TΔS = (-60,000 J) - (300 K * -100 J/K) = -60,000 + 30,000 = -30,000 J = -30 kJ/mol. Since ΔG < 0, the reaction is spontaneous at 300 K.",
        hint: "Careful with unit conversions: ΔH is in kJ, while ΔS is in J/K."
      },
      {
        id: "q_c2",
        subject: "Chemistry",
        topic: "Coordination Compounds & Crystal Field Theory",
        difficulty: "Hard",
        questionType: "single_choice",
        questionText: "Which of the following octahedral complex ions is diamagnetic (zero unpaired electrons) under strong crystal field splitting?",
        options: [
          { id: "opt_1", text: "[Fe(CN)6]³⁻ (low spin d⁵)" },
          { id: "opt_2", text: "[Co(NH3)6]³⁺ (low spin d⁶)" },
          { id: "opt_3", text: "[FeF6]³⁻ (high spin d⁵)" },
          { id: "opt_4", text: "[Cr(H2O)6]³⁺ (d³)" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "Co³⁺ has 3d⁶ configuration. In the presence of strong field ligand NH3 (low spin), all 6 electrons completely pair up in t2g orbital: (t2g)⁶ (eg)⁰, yielding n = 0 unpaired electrons and diamagnetic behavior.",
        hint: "Calculate oxidation state of Co in [Co(NH3)6]³⁺ and fill t2g orbitals first."
      },
      {
        id: "q_c3",
        subject: "Chemistry",
        topic: "Electrochemistry & Nernst Equation",
        difficulty: "Medium",
        questionType: "single_choice",
        questionText: "For the cell Zn|Zn²⁺(0.01 M) || Cu²⁺(1.0 M)|Cu with E°_cell = 1.10 V at 298 K, find E_cell using (2.303 RT/F = 0.0591).",
        options: [
          { id: "opt_1", text: "1.04 V" },
          { id: "opt_2", text: "1.10 V" },
          { id: "opt_3", text: "1.16 V" },
          { id: "opt_4", text: "1.22 V" }
        ],
        correctOptionIndex: 2,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "E_cell = E° - (0.0591/2) * log10([Zn²⁺]/[Cu²⁺]) = 1.10 - 0.02955 * log10(10⁻²) = 1.10 - 0.02955 * (-2) = 1.10 + 0.0591 = 1.1591 V ≈ 1.16 V.",
        hint: "Log of 10^-2 equals -2. The negative signs cancel to increase cell potential."
      },
      {
        id: "q_m1",
        subject: "Mathematics",
        topic: "Definite Integrals & Symmetry Properties",
        difficulty: "Hard",
        questionType: "single_choice",
        questionText: "Evaluate the definite integral I = ∫[0 to π/2] (sin⁴(x)) / (sin⁴(x) + cos⁴(x)) dx.",
        options: [
          { id: "opt_1", text: "π / 2" },
          { id: "opt_2", text: "π / 4" },
          { id: "opt_3", text: "π / 8" },
          { id: "opt_4", text: "1" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "By King's property: I = ∫[0 to π/2] cos⁴(x) / (cos⁴(x) + sin⁴(x)) dx. Adding the two integrals: 2I = ∫[0 to π/2] 1 dx = [x] from 0 to π/2 = π/2 => I = π/4.",
        hint: "Apply King's property: ∫[0 to a] f(x)dx = ∫[0 to a] f(a-x)dx, then sum both integrals."
      },
      {
        id: "q_m2",
        subject: "Mathematics",
        topic: "Differential Equations (Integrating Factor)",
        difficulty: "Medium",
        questionType: "single_choice",
        questionText: "What is the integrating factor (IF) for the linear first-order differential equation: (dy/dx) + (2x / (1 + x²)) y = x³?",
        options: [
          { id: "opt_1", text: "e^(x²)" },
          { id: "opt_2", text: "1 + x²" },
          { id: "opt_3", text: "ln(1 + x²)" },
          { id: "opt_4", text: "(1 + x²)²" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "P(x) = 2x / (1 + x²). IF = exp(∫ P(x) dx) = exp(ln(1 + x²)) = 1 + x².",
        hint: "The derivative of (1 + x²) is exactly 2x in the numerator."
      },
      {
        id: "q_m3",
        subject: "Mathematics",
        topic: "Vectors & 3D Geometry",
        difficulty: "Medium",
        questionType: "single_choice",
        questionText: "Find the shortest distance between the skew lines r = (i + 2j + k) + λ(2i - j + k) and r = (2i - j - k) + μ(3i - 5j + 2k).",
        options: [
          { id: "opt_1", text: "10 / √59" },
          { id: "opt_2", text: "9 / √59" },
          { id: "opt_3", text: "14 / √59" },
          { id: "opt_4", text: "0 (Intersecting)" }
        ],
        correctOptionIndex: 0,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "Shortest distance d = |(a2 - a1) · (b1 × b2)| / |b1 × b2|. Here b1 × b2 = (3i - j - 7k) with magnitude √59. Dot product with (a2 - a1) gives |-10| = 10. Distance = 10 / √59.",
        hint: "Use vector triple product formula for skew lines shortest distance."
      }
    ]
  },
  {
    id: "exam_neet_super30_mock",
    title: "NEET Medical Super-30 All-India Grand Mock Test",
    description: "Full NCERT pattern test covering Genetics, Human Physiology, Organic Reactions, and Ray Optics with strict +4/-1 grading.",
    category: "NEET Mock",
    allottedCourse: "NEET Medical (Super-30)",
    durationMinutes: 45,
    totalMarks: 120,
    passingMarks: 40,
    negativeMarking: true,
    isLive: true,
    proctoringEnabled: true,
    scheduledAt: "Live Now (All India Rank)",
    createdAt: "2026-08-16T12:00:00Z",
    sections: [
      { name: "Biology (Botany & Zoology)", questionIds: ["q_bio1", "q_bio2"] },
      { name: "Chemistry", questionIds: ["q_c1", "q_c2"] },
      { name: "Physics", questionIds: ["q_p3", "q_p4"] }
    ],
    questions: [
      {
        id: "q_bio1",
        subject: "Biology",
        topic: "Molecular Basis of Inheritance (DNA Replication)",
        difficulty: "Medium",
        questionType: "single_choice",
        questionText: "During semi-conservative DNA replication in prokaryotes, which enzyme removes RNA primers and fills the gaps with complementary deoxyribonucleotides?",
        options: [
          { id: "opt_1", text: "DNA Polymerase III" },
          { id: "opt_2", text: "DNA Polymerase I (Kornberg enzyme)" },
          { id: "opt_3", text: "DNA Ligase" },
          { id: "opt_4", text: "DNA Helicase" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "DNA Polymerase I has 5' -> 3' exonuclease activity which removes RNA primer ribonucleotides and synthesizes DNA in the vacated gap.",
        hint: "DNA Polymerase I has 5'->3' exonuclease activity specifically for primer excision."
      },
      {
        id: "q_bio2",
        subject: "Biology",
        topic: "Human Physiology (Nephron & Osmoregulation)",
        difficulty: "Hard",
        questionType: "single_choice",
        questionText: "Which segment of the loop of Henle is permeable to water but impermeable to electrolytes?",
        options: [
          { id: "opt_1", text: "Ascending limb of Henle" },
          { id: "opt_2", text: "Descending limb of Henle" },
          { id: "opt_3", text: "Distal Convoluted Tubule (DCT)" },
          { id: "opt_4", text: "Collecting Duct only" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 1,
        solutionExplanation: "The thin descending limb of the loop of Henle is permeable to water (aquaporins present) but almost completely impermeable to salts and urea.",
        hint: "Descending limb concentrates urine by passive water efflux."
      }
    ]
  },
  {
    id: "exam_cbse_12_pcm",
    title: "Class 12 CBSE Board Term Assessment (PCM)",
    description: "Board blueprint mock paper focusing on standard NCERT derivations, wave optics, electrochemistry, and matrices.",
    category: "School Board",
    allottedCourse: "Class 12 CBSE Board (PCM)",
    durationMinutes: 40,
    totalMarks: 80,
    passingMarks: 27,
    negativeMarking: false,
    isLive: true,
    proctoringEnabled: true,
    scheduledAt: "Available for Batch PCM",
    createdAt: "2026-08-17T09:00:00Z",
    sections: [
      { name: "Physics & Chemistry", questionIds: ["q_p2", "q_c3"] },
      { name: "Mathematics", questionIds: ["q_m1", "q_m2"] }
    ],
    questions: [
      {
        id: "q_p2",
        subject: "Physics",
        topic: "Electromagnetic Induction & Circuits",
        difficulty: "Medium",
        questionType: "single_choice",
        questionText: "An inductor of inductance L = 2.0 H and resistance R = 10 Ω is connected across an ideal DC voltage source of V = 50 V at t = 0. Find the energy stored in the magnetic field at steady state.",
        options: [
          { id: "opt_1", text: "12.5 Joules" },
          { id: "opt_2", text: "25.0 Joules" },
          { id: "opt_3", text: "50.0 Joules" },
          { id: "opt_4", text: "100.0 Joules" }
        ],
        correctOptionIndex: 1,
        marks: 4,
        negativeMarks: 0,
        solutionExplanation: "Energy stored U = (1/2) L (I_0)² = 0.5 * 2.0 * (5.0)² = 25.0 J.",
        hint: "At steady state, current = V / R."
      }
    ]
  }
];

export const INITIAL_BOOKS: StudyBook[] = [
  {
    id: "book_mechanics_adv",
    title: "Principles of Classical Mechanics & Rotational Motion",
    author: "Prof. H. C. Verma & I. E. Irodov",
    subject: "Physics",
    gradeLevel: "Competitive STEM / JEE Advanced",
    allottedCourse: "JEE Advanced (Target 2026)",
    coverGradient: "from-amber-700 via-amber-900 to-stone-950",
    totalChapters: 4,
    description: "Comprehensive analytical guide to rigid body dynamics, non-inertial frames of reference, central forces, and conservation principles.",
    uploadedAt: "2026-08-10",
    chapters: [
      {
        id: "ch_mech_1",
        title: "Chapter 1: Moment of Inertia & Parallel Axis Theorem",
        summary: "Rigorous derivation of rotational inertia for symmetric and composite rigid bodies.",
        readTimeMinutes: 12,
        keyFormulas: ["I = ∫ r² dm", "I_total = I_cm + M d²", "I_z = I_x + I_y (planar laminar bodies)"],
        contentMarkdown: `## 1.1 Rotational Inertia Formulation

The moment of inertia $I$ of a continuous mass distribution measures resistance to rotational acceleration:

$$I = \\int r^2 \\, dm = \\int \\rho(r) r^2 \\, dV$$

### 1.2 Parallel Axis Theorem (Steiner's Theorem)
For any rigid body of mass $M$, the moment of inertia about an arbitrary axis parallel to an axis passing through the center of mass ($I_{cm}$) separated by distance $d$:

$$I_{axis} = I_{cm} + M d^2$$

> **Crucial Rule:** The baseline axis MUST pass through the exact Center of Mass ($I_{cm}$). You cannot shift directly between two non-CM parallel axes.`
      }
    ]
  },
  {
    id: "book_calculus_adv",
    title: "Advanced Integral Calculus & Differential Equations",
    author: "Prof. S. L. Loney & I. A. Maron",
    subject: "Mathematics",
    gradeLevel: "Advanced STEM & Engineering",
    allottedCourse: "JEE Advanced (Target 2026)",
    coverGradient: "from-emerald-600 via-teal-700 to-slate-900",
    totalChapters: 3,
    description: "Rigorous guide to definite integration techniques, Leibniz rule of differentiation under the integral sign, and first-order differential equations.",
    uploadedAt: "2026-08-12",
    chapters: [
      {
        id: "ch_calc_1",
        title: "Chapter 1: Definite Integrals & King's Property",
        summary: "Mastering symmetry integrals, periodic properties, and reduction formulas.",
        readTimeMinutes: 10,
        keyFormulas: ["∫[0 to a] f(x) dx = ∫[0 to a] f(a-x) dx", "d/dx ∫[u(x) to v(x)] f(t) dt = f(v(x))v'(x) - f(u(x))u'(x)"],
        contentMarkdown: `## 1.1 The Fundamental King's Property

One of the most frequently applied tools in competitive calculus is King's Theorem:

$$\\int_{a}^{b} f(x) \\, dx = \\int_{a}^{b} f(a + b - x) \\, dx$$`
      }
    ]
  },
  {
    id: "book_organic_mastery",
    title: "Organic Chemistry: Reaction Mechanisms & Pathways",
    author: "Prof. Paula Y. Bruice & Morrison Boyd",
    subject: "Chemistry",
    gradeLevel: "Pre-Medical & Engineering",
    allottedCourse: "All Courses",
    coverGradient: "from-rose-600 via-pink-700 to-slate-900",
    totalChapters: 3,
    description: "Detailed reaction coordinate diagrams, electrophilic aromatic substitution, aldol condensations, and stereochemistry.",
    uploadedAt: "2026-08-14",
    chapters: [
      {
        id: "ch_org_1",
        title: "Chapter 1: Nucleophilic Substitution (SN1 vs SN2)",
        summary: "Carbocation intermediates, backside attack, inversion of configuration, and solvent effects.",
        readTimeMinutes: 14,
        keyFormulas: ["Rate(SN2) = k [Substrate][Nu]", "Rate(SN1) = k [Substrate]"],
        contentMarkdown: `## 1.1 The SN2 Reaction (Substitution Nucleophilic Bimolecular)

- **Mechanism**: Concerted, single-step reaction.
- **Kinetics**: Second order overall.
- **Stereochemistry**: Complete inversion of stereocenter (**Walden Inversion**).
- **Substrate Reactivity**: Methyl > 1° > 2° >> 3° (due to steric hindrance).`
      }
    ]
  },
  {
    id: "book_neet_biology_handbook",
    title: "NEET High-Yield Human Physiology & Genetics Handbook",
    author: "NCERT Biology Editorial Board",
    subject: "Biology",
    gradeLevel: "Pre-Medical Standard",
    allottedCourse: "NEET Medical (Super-30)",
    coverGradient: "from-teal-700 via-emerald-800 to-stone-950",
    totalChapters: 4,
    description: "Complete NCERT line-by-line summary, diagram labeling for nephrons, cardiac cycles, Mendel genetics, and lac operon regulation.",
    uploadedAt: "2026-08-16",
    chapters: [
      {
        id: "ch_bio_1",
        title: "Chapter 1: Molecular Genetics & Operon Concept",
        summary: "Lac operon negative regulation, inducer mechanics, and transcription factors.",
        readTimeMinutes: 15,
        contentMarkdown: `## 1.1 The Lac Operon in E. Coli
- The **lac operon** consists of one regulatory gene (i gene) and three structural genes (z, y, and a).
- **z gene**: codes for beta-galactosidase (converts lactose to glucose + galactose).
- **y gene**: codes for permease (increases cell permeability to beta-galactosides).
- **a gene**: codes for transacetylase.
- Lactose functions as the **inducer** binding to the repressor protein.`
      }
    ]
  }
];

export const INITIAL_PHONE_HISTORY: PhoneHistoryEntry[] = [
  { appName: "Instagram Reels & Shorts", category: "Distraction / Reels", minutesUsed: 48, icon: "Film" },
  { appName: "YouTube Entertainment", category: "Distraction / Reels", minutesUsed: 32, icon: "Play" },
  { appName: "WhatsApp Chats", category: "Social Media", minutesUsed: 22, icon: "MessageSquare" },
  { appName: "Examplus JEE Test & Notes", category: "Productive", minutesUsed: 115, icon: "BookOpen" },
  { appName: "Calculator & Formulas", category: "Productive", minutesUsed: 25, icon: "Cpu" }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, studentId: "s1", studentName: "Aarav Sharma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", course: "JEE Advanced (Target 2026)", score: 116, accuracy: 96.8, timeTakenMinutes: 38, percentile: 99.94, badge: "AIR 1" },
  { rank: 2, studentId: "s2", studentName: "Diya Venkatesh", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", course: "JEE Advanced (Target 2026)", score: 112, accuracy: 94.2, timeTakenMinutes: 41, percentile: 99.82, badge: "AIR 2" },
  { rank: 3, studentId: "s3", studentName: "Rohan Mukherjee", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", course: "JEE Advanced (Target 2026)", score: 108, accuracy: 92.5, timeTakenMinutes: 44, percentile: 99.45, badge: "AIR 3" },
  { rank: 4, studentId: "s4", studentName: "Ananya Iyer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", course: "JEE Advanced (Target 2026)", score: 104, accuracy: 91.0, timeTakenMinutes: 42, percentile: 98.90 },
  { rank: 5, studentId: "s5", studentName: "Kabir Patel", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", course: "NEET Medical (Super-30)", score: 98, accuracy: 88.4, timeTakenMinutes: 45, percentile: 97.80 }
];

export const INITIAL_PROFILE: StudentProfile = {
  id: "student_aryankumar",
  name: "Aryan Kumar",
  email: "aryankumar05012008@gmail.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  targetExam: "JEE Advanced & National Olympiads",
  enrolledCourse: "JEE Advanced (Target 2026)",
  batchCode: "APEX-2026-ALPHA",
  currentRankAvg: 4,
  overallPercentileAvg: 98.5,
  totalTestsTaken: 12,
  totalStudyHours: 46.5,
  studyStreakDays: 9,
  weakTopics: [
    { topic: "Rotational Dynamics (Rolling Incline)", subject: "Physics", accuracy: 58 },
    { topic: "Coordination Compounds (CFT Low Spin)", subject: "Chemistry", accuracy: 64 },
    { topic: "Bayes Conditional Probability", subject: "Mathematics", accuracy: 68 }
  ],
  strongTopics: [
    { topic: "Work-Energy Theorem", subject: "Physics", accuracy: 94 },
    { topic: "Chemical Kinetics & Half-Life", subject: "Chemistry", accuracy: 96 },
    { topic: "Definite Integrals (King's Rule)", subject: "Mathematics", accuracy: 92 }
  ],
  recentAttempts: []
};

export const SAMPLE_ATTEMPT: ExamAttempt = {
  id: "att_sample_01",
  examId: "exam_jee_grand_2026",
  examTitle: "JEE Advanced Grand All-India Mock (Paper 1)",
  studentId: "student_aryankumar",
  studentName: "Aryan Kumar",
  enrolledCourse: "JEE Advanced (Target 2026)",
  startedAt: "2026-08-18T06:40:00Z",
  submittedAt: "2026-08-18T07:25:00Z",
  totalScore: 32,
  maxScore: 40,
  accuracyPercentage: 88.9,
  percentile: 98.6,
  rank: 4,
  totalParticipants: 450,
  responses: {
    q_p1: { questionId: "q_p1", selectedOptionIndex: 1, status: "answered", timeSpentSeconds: 120, isCorrect: true, marksAwarded: 4 },
    q_p2: { questionId: "q_p2", selectedOptionIndex: 1, status: "answered", timeSpentSeconds: 95, isCorrect: true, marksAwarded: 4 },
    q_p3: { questionId: "q_p3", selectedOptionIndex: 1, status: "answered", timeSpentSeconds: 80, isCorrect: true, marksAwarded: 4 },
    q_p4: { questionId: "q_p4", selectedOptionIndex: 1, status: "answered", timeSpentSeconds: 70, isCorrect: true, marksAwarded: 4 },
    q_c1: { questionId: "q_c1", selectedOptionIndex: 2, status: "answered", timeSpentSeconds: 65, isCorrect: true, marksAwarded: 4 },
    q_c2: { questionId: "q_c2", selectedOptionIndex: 0, status: "answered", timeSpentSeconds: 110, isCorrect: false, marksAwarded: -1 },
    q_c3: { questionId: "q_c3", selectedOptionIndex: 1, status: "answered", timeSpentSeconds: 75, isCorrect: true, marksAwarded: 4 },
    q_m1: { questionId: "q_m1", selectedOptionIndex: 1, status: "answered", timeSpentSeconds: 130, isCorrect: true, marksAwarded: 4 },
    q_m2: { questionId: "q_m2", selectedOptionIndex: 2, status: "answered", timeSpentSeconds: 90, isCorrect: true, marksAwarded: 4 },
    q_m3: { questionId: "q_m3", status: "not_answered", timeSpentSeconds: 30, marksAwarded: 0 }
  },
  proctorFlags: [
    {
      id: "pf_1",
      timestamp: "10:18:22",
      type: "looking_away",
      description: "Candidate looked away from screen for 4 seconds",
      severity: "low"
    }
  ],
  integrityScore: 98,
  subjectBreakdown: [
    { subject: "Physics", score: 16, maxScore: 16, correct: 4, incorrect: 0, unattempted: 0, accuracy: 100 },
    { subject: "Chemistry", score: 7, maxScore: 12, correct: 2, incorrect: 1, unattempted: 0, accuracy: 66.7 },
    { subject: "Mathematics", score: 8, maxScore: 12, correct: 2, incorrect: 0, unattempted: 1, accuracy: 100 }
  ]
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "notif_1",
    title: "JEE Advanced 2026 All-India Grand Mock Test Series Schedule",
    content: "The National Standard Grand Mock Exam is now active for enrolled JEE Advanced batches. Candidates are advised to review the +4 / -1 marking scheme and ensure web camera permissions are active for AI Proctoring.",
    category: "Exam Alert",
    priority: "urgent",
    allottedCourse: "JEE Advanced (Target 2026)",
    publishedAt: "Today at 08:30 AM",
    author: "Academic Director",
    pinned: true
  },
  {
    id: "notif_2",
    title: "NEET Medical Super-30 Anatomy & Genetics Modules Released",
    content: "High-yield summary notes with interactive formula sheets and margin annotations have been allocated to the NEET Medical batch study library.",
    category: "Syllabus",
    priority: "high",
    allottedCourse: "NEET Medical (Super-30)",
    publishedAt: "Yesterday at 04:15 PM",
    author: "Department of Biological Sciences",
    pinned: true
  },
  {
    id: "notif_3",
    title: "AI Camera Proctoring & Multi-Emotion Attention Tracking Guidelines",
    content: "Anti-cheat protocols are active. The study camera now tracks emotional states (fatigue, boredom, frustration, eye closure, and phone detection) to help optimize cognitive pacing and verify exam integrity.",
    category: "Important",
    priority: "normal",
    allottedCourse: "All Courses",
    publishedAt: "Aug 16, 2026",
    author: "Head Proctor",
    pinned: false
  }
];

export const INITIAL_CANDIDATES: AdminCandidateRecord[] = [
  {
    id: "cand_1",
    name: "Aryan Kumar",
    email: "aryankumar05012008@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    enrolledCourse: "JEE Advanced (Target 2026)",
    totalTestsTaken: 14,
    avgScore: 108,
    avgPercentile: 98.6,
    highestRank: 4,
    proctorViolationsCount: 1,
    status: "Active",
    lastActive: "Just now"
  },
  {
    id: "cand_2",
    name: "Devvrat Sharma",
    email: "devvrat.sharma@aims.edu",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    enrolledCourse: "JEE Advanced (Target 2026)",
    totalTestsTaken: 16,
    avgScore: 114,
    avgPercentile: 99.8,
    highestRank: 1,
    proctorViolationsCount: 0,
    status: "Active",
    lastActive: "12m ago"
  },
  {
    id: "cand_3",
    name: "Ananya Iyer",
    email: "ananya.iyer@prep.in",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    enrolledCourse: "NEET Medical (Super-30)",
    totalTestsTaken: 12,
    avgScore: 104,
    avgPercentile: 97.4,
    highestRank: 8,
    proctorViolationsCount: 2,
    status: "Active",
    lastActive: "1h ago"
  },
  {
    id: "cand_4",
    name: "Rohan Varma",
    email: "rohan.v@institute.org",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    enrolledCourse: "Class 12 CBSE Board (PCM)",
    totalTestsTaken: 9,
    avgScore: 82,
    avgPercentile: 89.1,
    highestRank: 42,
    proctorViolationsCount: 5,
    status: "Flagged",
    lastActive: "4h ago"
  }
];

export const INITIAL_TODOS = [
  {
    id: "todo_1",
    title: "Solve 25 Advanced Rotational Dynamics PYQs (Incline & Rolling)",
    category: "Physics" as const,
    priority: "high" as const,
    dueDate: "Today, 5:00 PM",
    estimatedMinutes: 60,
    isCompleted: true,
    completedAt: "Today at 03:45 PM",
    verificationStatus: "verified_proof" as const,
    credibilityScore: 98,
    proofNotes: "Derived moment of inertia of hollow cone and solved 25 rolling problems with friction constraint equations.",
    questionsSolvedCount: 25,
    minutesActuallySpent: 55,
    proofAttachmentName: "Rotational_Dynamics_Rough_Sheet_Scan.jpg",
    aiVerificationFeedback: "Authentic proof verified! Solid mathematical steps and detailed derivation ledger.",
    scoreBonusAwarded: 25
  },
  {
    id: "todo_2",
    title: "Review NCERT Coordination Chemistry CFT Splitting & Isomerism",
    category: "Chemistry" as const,
    priority: "high" as const,
    dueDate: "Today, 7:00 PM",
    estimatedMinutes: 45,
    isCompleted: false,
    verificationStatus: "unverified" as const
  },
  {
    id: "todo_3",
    title: "Definite Integrals: Master King's Rule & Leibniz Derivative under Integral",
    category: "Mathematics" as const,
    priority: "medium" as const,
    dueDate: "Tomorrow, 10:00 AM",
    estimatedMinutes: 50,
    isCompleted: false,
    verificationStatus: "unverified" as const
  },
  {
    id: "todo_4",
    title: "Attempt All-India Grand Mock Test Paper 1",
    category: "Mock Test" as const,
    priority: "high" as const,
    dueDate: "Today, 9:00 PM",
    estimatedMinutes: 45,
    isCompleted: true,
    completedAt: "Today at 07:25 AM",
    verificationStatus: "verified_proof" as const,
    credibilityScore: 100,
    proofNotes: "Attempted live mock test under webcam proctoring. Scored 32/40 with 88.9% accuracy.",
    questionsSolvedCount: 10,
    minutesActuallySpent: 45,
    proofAttachmentName: "Test_Attempt_att_sample_01.pdf",
    aiVerificationFeedback: "Proctored Exam submission linked with 98% integrity audit.",
    scoreBonusAwarded: 50
  }
];
