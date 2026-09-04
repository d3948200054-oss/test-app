export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  imageUrl?: string;
  diagramSvg?: string;
  subject: "Physics" | "Chemistry" | "Mathematics" | "Biology" | "Computer Science" | "General";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Advanced";
  options: QuestionOption[];
  correctOptionIndex: number;
  marks: number;
  negativeMarks: number;
  solutionExplanation: string;
  hint?: string;
  questionType: "single_choice" | "multiple_choice" | "numerical";
}

export type CourseStream =
  | "JEE Advanced (Target 2026)"
  | "NEET Medical (Super-30)"
  | "Class 12 CBSE Board (PCM)"
  | "Class 12 CBSE Board (PCB)"
  | "Foundation Olympiad (9th-10th)";

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: "JEE Mock" | "NEET Mock" | "SAT / College Board" | "School Board" | "Custom / Teacher";
  allottedCourse: CourseStream | "All Courses";
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  scheduledAt?: string;
  isLive: boolean;
  proctoringEnabled: boolean;
  sections: {
    name: string;
    questionIds: string[];
  }[];
  questions: Question[];
  createdAt: string;
}

export type QuestionStatus = "not_visited" | "not_answered" | "answered" | "marked_review" | "answered_marked_review";

export interface QuestionResponse {
  questionId: string;
  selectedOptionIndex?: number;
  numericalValue?: string;
  status: QuestionStatus;
  timeSpentSeconds: number;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export interface ProctorFlag {
  id: string;
  timestamp: string;
  type: "tab_switch" | "fullscreen_exit" | "face_not_detected" | "multiple_faces" | "phone_detected" | "looking_away" | "extreme_fatigue_or_sleeping";
  description: string;
  severity: "low" | "medium" | "high";
  screenshotData?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  enrolledCourse?: CourseStream;
  startedAt: string;
  submittedAt: string;
  totalScore: number;
  maxScore: number;
  accuracyPercentage: number;
  percentile: number;
  rank: number;
  totalParticipants: number;
  responses: Record<string, QuestionResponse>;
  proctorFlags: ProctorFlag[];
  integrityScore: number;
  subjectBreakdown: {
    subject: string;
    score: number;
    maxScore: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    accuracy: number;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatar: string;
  course: CourseStream;
  score: number;
  accuracy: number;
  timeTakenMinutes: number;
  percentile: number;
  badge?: string;
}

export interface BookHighlight {
  id: string;
  bookId: string;
  chapterId: string;
  text: string;
  color: "yellow" | "emerald" | "rose" | "indigo" | "amber";
  timestamp: string;
  note?: string;
}

export interface BookNote {
  id: string;
  bookId: string;
  chapterId: string;
  title: string;
  content: string;
  timestamp: string;
  color?: string;
}

export interface StudyChapter {
  id: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  keyFormulas?: string[];
  readTimeMinutes: number;
}

export type LibraryMaterialType = "book" | "pdf" | "ppt" | "excel" | "notes";

export interface StudyBook {
  id: string;
  title: string;
  author: string;
  subject: string;
  gradeLevel: string;
  allottedCourse: CourseStream | "All Courses";
  materialType?: LibraryMaterialType;
  fileName?: string;
  fileDownloadUrl?: string;
  coverGradient: string;
  totalChapters: number;
  description: string;
  fileSizeMb?: number;
  uploadedAt: string;
  chapters: StudyChapter[];
  customPdfDataUrl?: string;
  tags?: string[];
}

export interface AISolution {
  correctOption?: string;
  finalAnswer: string;
  stepByStep: string[];
  keyConcept: string;
  commonPitfalls: string;
  quickTrick?: string;
  relatedDoubts: string[];
}

export type DetailedEmotion =
  | "deep_focus"
  | "angry"
  | "frustrated"
  | "bored"
  | "tired"
  | "confused"
  | "calm"
  | "distracted"
  | "absent";

export interface EmotionScoreMap {
  deep_focus: number;
  calm: number;
  bored: number;
  tired: number;
  angry: number;
  frustrated: number;
  confused: number;
  distracted: number;
}

export interface FacialEmotionAnalysis {
  faceDetected: boolean;
  primaryEmotion: DetailedEmotion;
  primaryEmotionLabel: string;
  moodDescription: string;
  emotionScores: EmotionScoreMap;
  fatigueLevel: "low" | "moderate" | "high" | "critical";
  boredomIndex: number;
  frustrationIndex: number;
  focusScore: number;
  isPhoneOrReelSuspected: boolean;
  postureQuality: "good" | "slouching" | "head_tilt";
  smartAdvice: string;
  recoveryAction?: string;
}

export interface PhoneHistoryEntry {
  appName: string;
  category: "Productive" | "Distraction / Reels" | "Social Media" | "Entertainment";
  minutesUsed: number;
  icon: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  targetMinutes: number;
  completedMinutes: number;
  isCompleted: boolean;
}

export type TodoVerificationStatus =
  | "unverified"
  | "verified_proof"
  | "flagged_effort"
  | "self_checked";

export interface StudentTodo {
  id: string;
  title: string;
  category: "Physics" | "Chemistry" | "Mathematics" | "Biology" | "Mock Test" | "Revision" | "General";
  priority: "high" | "medium" | "low";
  dueDate?: string;
  estimatedMinutes?: number;
  isCompleted: boolean;
  completedAt?: string;
  verificationStatus: TodoVerificationStatus;
  credibilityScore?: number; // 0 to 100
  proofNotes?: string;
  questionsSolvedCount?: number;
  minutesActuallySpent?: number;
  proofAttachmentName?: string;
  proofAttachmentUrl?: string; // base64 / data URL
  aiVerificationFeedback?: string;
  scoreBonusAwarded?: number;
  isFakeTickSuspected?: boolean;
}

export interface DailyAccountability {
  dayRating: string;
  productivityPercent: number;
  verdictHeadline: string;
  roastOrPraise: string;
  tomorrowActionPlan: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  targetExam: string;
  enrolledCourse: CourseStream;
  batchCode: string;
  currentRankAvg: number;
  overallPercentileAvg: number;
  totalTestsTaken: number;
  totalStudyHours: number;
  studyStreakDays: number;
  weakTopics: { topic: string; subject: string; accuracy: number }[];
  strongTopics: { topic: string; subject: string; accuracy: number }[];
  recentAttempts: ExamAttempt[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "Important" | "Exam Alert" | "Syllabus" | "Schedule" | "General";
  priority: "urgent" | "high" | "normal";
  allottedCourse?: CourseStream | "All Courses";
  publishedAt: string;
  author: string;
  targetAudience?: string;
  pinned?: boolean;
}

export type ThemeMode = "light" | "dark";
export type UserRole = "student" | "admin";

export interface AdminCandidateRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourse: CourseStream;
  totalTestsTaken: number;
  avgScore: number;
  avgPercentile: number;
  highestRank: number;
  proctorViolationsCount: number;
  status: "Active" | "Flagged" | "Blocked";
  lastActive: string;
}
