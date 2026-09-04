import React, { useState } from "react";
import { Exam, ExamAttempt, ThemeMode, CourseStream } from "../../types";
import {
  Clock,
  Award,
  Play,
  Search,
  Filter,
  FileQuestion,
  Users,
  ShieldCheck,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  History,
  FileCheck2
} from "lucide-react";

interface ExamListProps {
  exams: Exam[];
  onStartExam: (exam: Exam) => void;
  isAdmin?: boolean;
  theme: ThemeMode;
  onOpenAdminPanel?: () => void;
  studentCourse?: CourseStream;
  attempts?: ExamAttempt[];
  onReviewAttempt?: (attempt: ExamAttempt, exam: Exam) => void;
}

export const ExamList: React.FC<ExamListProps> = ({
  exams,
  onStartExam,
  isAdmin = false,
  theme,
  onOpenAdminPanel,
  studentCourse = "JEE Advanced (Target 2026)",
  attempts = [],
  onReviewAttempt
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"available_tests" | "my_results">("available_tests");
  const [filterStream, setFilterStream] = useState<string>("allotted");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isDark = theme === "dark";

  const filteredExams = exams.filter((exam) => {
    const matchesCourse =
      filterStream === "all" ||
      (filterStream === "allotted" &&
        (exam.allottedCourse === studentCourse || exam.allottedCourse === "All Courses")) ||
      exam.allottedCourse === filterStream;

    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCourse && matchesSearch;
  });

  const latestAttempt = attempts.length > 0 ? attempts[0] : null;

  return (
    <div className="space-y-5">
      {/* App Header Bar with Sub-Tab Switcher */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
          isDark
            ? "bg-[#0f1b33] border-stone-800 text-stone-100"
            : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-classic-serif text-lg font-bold tracking-tight">
                Institutional Testing Arena & Results Vault
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Course: <strong className="text-amber-500">{studentCourse}</strong> • Automated Evaluation & Instant Scorecards
              </p>
            </div>
          </div>

          {/* Sub-tab Switcher right in Tests bar */}
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center">
              <button
                onClick={() => setActiveSubTab("available_tests")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeSubTab === "available_tests"
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white"
                }`}
              >
                <FileQuestion className="w-3.5 h-3.5" />
                <span>Available Tests ({filteredExams.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab("my_results")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeSubTab === "my_results"
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>My Test Results & Scorecards ({attempts.length})</span>
              </button>
            </div>

            {isAdmin && onOpenAdminPanel && (
              <button
                id="btn-admin-manage-tests"
                onClick={onOpenAdminPanel}
                className="px-3.5 py-2 bg-stone-900/90 hover:bg-stone-800 text-amber-400 font-bold rounded-xl text-xs transition-colors border border-amber-500/40 flex items-center space-x-2 cursor-pointer shrink-0"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Admin Test Studio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QUICK HIGHLIGHT BANNER: If student has a recent evaluated test */}
      {latestAttempt && activeSubTab === "available_tests" && (
        <div
          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDark
              ? "bg-linear-to-r from-amber-500/10 via-[#0f1b33] to-[#0f1b33] border-amber-500/30 text-stone-100"
              : "bg-linear-to-r from-amber-50 via-white to-amber-50/50 border-amber-300/80 text-stone-900 shadow-xs"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
              AIR #{latestAttempt.rank}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  Latest Scorecard Ready
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {latestAttempt.submittedAt ? new Date(latestAttempt.submittedAt).toLocaleDateString() : "Recent"}
                </span>
              </div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-white mt-0.5">
                {latestAttempt.examTitle}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Score: <strong className="text-amber-500 font-bold">{latestAttempt.totalScore} / {latestAttempt.maxScore}</strong> •
                Percentile: <strong className="text-emerald-500 font-bold">{latestAttempt.percentile}%</strong> •
                Accuracy: <strong className="text-blue-500 font-bold">{latestAttempt.accuracyPercentage}%</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const ex = exams.find((e) => e.id === latestAttempt.examId) || exams[0];
              if (onReviewAttempt) {
                onReviewAttempt(latestAttempt, ex);
              } else {
                setActiveSubTab("my_results");
              }
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <span>View Full Scorecard & Solutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: AVAILABLE TESTS & MOCKS */}
      {/* ========================================================================= */}
      {activeSubTab === "available_tests" && (
        <>
          {/* Filter and Search */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
              isDark
                ? "bg-[#0f1b33] border-stone-800 text-stone-200"
                : "bg-white border-[#e5dec9] text-stone-800 shadow-sm"
            }`}
          >
            {/* Stream Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 ml-1 mr-1 hidden sm:block" />
              <button
                onClick={() => setFilterStream("allotted")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filterStream === "allotted"
                    ? isDark
                      ? "bg-amber-500 text-stone-950 font-bold shadow-xs"
                      : "bg-[#0f1d38] text-amber-300 font-bold shadow-xs"
                    : "text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
                }`}
              >
                My Allotted Course Papers
              </button>
              <button
                onClick={() => setFilterStream("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filterStream === "all"
                    ? isDark
                      ? "bg-amber-500 text-stone-950 font-bold shadow-xs"
                      : "bg-[#0f1d38] text-amber-300 font-bold shadow-xs"
                    : "text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
                }`}
              >
                All Stream Tests
              </button>
            </div>

            {/* Search Field */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search allocated papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-[#091325] border-stone-700 text-white placeholder-stone-400"
                    : "bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-500 font-medium"
                }`}
              />
            </div>
          </div>

          {/* Exam Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isDark
                    ? "bg-[#0f1b33] border-stone-800 hover:border-amber-500/40 text-stone-100 shadow-md"
                    : "bg-white border-[#e5dec9] hover:border-amber-600/50 text-stone-900 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {exam.allottedCourse || exam.category}
                    </span>

                    {exam.isLive ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live Test</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-600 dark:text-stone-400 font-mono font-medium">
                        {exam.scheduledAt || "Scheduled"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-classic-serif text-base font-bold tracking-tight mb-1.5 line-clamp-2 leading-snug text-stone-900 dark:text-stone-100">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-2 mb-3 leading-relaxed">
                    {exam.description}
                  </p>

                  {/* Sections */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {exam.sections.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                      >
                        {sec.name} ({sec.questionIds.length}Q)
                      </span>
                    ))}
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-stone-200 dark:border-stone-800 text-center text-xs mb-3">
                    <div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">Duration</div>
                      <span className="font-bold text-stone-900 dark:text-stone-100">{exam.durationMinutes}m</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">Questions</div>
                      <span className="font-bold text-stone-900 dark:text-stone-100">{exam.questions.length}</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">Max Marks</div>
                      <span className="font-bold text-stone-900 dark:text-stone-100">{exam.totalMarks}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 px-1 font-medium">
                    <span>Marking: <strong className="text-stone-900 dark:text-stone-200">+4 / -1</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {exam.proctoringEnabled ? "AI Proctored" : "Self Paced"}
                    </span>
                  </div>

                  <button
                    id={`btn-start-exam-${exam.id}`}
                    onClick={() => onStartExam(exam)}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Examination</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MY TEST RESULTS & SCORECARDS VAULT */}
      {/* ========================================================================= */}
      {activeSubTab === "my_results" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-classic-serif text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Evaluated Examination Results & Historical Scorecards</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              {attempts.length} Completed Test Evaluation(s)
            </span>
          </div>

          {attempts.length === 0 ? (
            <div
              className={`p-12 text-center rounded-2xl border ${
                isDark ? "bg-[#0f1b33] border-stone-800 text-stone-400" : "bg-white border-[#e5dec9] text-stone-600"
              }`}
            >
              <FileQuestion className="w-10 h-10 mx-auto mb-3 text-stone-400" />
              <h4 className="text-base font-bold text-stone-800 dark:text-stone-200">No Test Attempts Recorded Yet</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Once you complete an examination mock paper, your instant score, national percentile rank, and detailed question solutions will appear here.
              </p>
              <button
                onClick={() => setActiveSubTab("available_tests")}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Browse & Start Mock Tests
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((att, idx) => {
                const matchedExam = exams.find((e) => e.id === att.examId) || exams[0];
                return (
                  <div
                    key={att.id || idx}
                    className={`rounded-2xl p-5 border transition-all ${
                      isDark
                        ? "bg-[#0f1b33] border-stone-800 hover:border-amber-500/30 text-stone-100"
                        : "bg-white border-[#e5dec9] hover:border-amber-500/40 text-stone-900 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                      <div>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Attempt #{attempts.length - idx}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">
                            Submitted on {new Date(att.submittedAt).toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            Proctor Integrity: {att.integrityScore || 98}%
                          </span>
                        </div>
                        <h4 className="font-classic-serif text-lg font-bold text-stone-900 dark:text-white">
                          {att.examTitle}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Candidate: <strong className="text-stone-800 dark:text-stone-200">{att.studentName}</strong> • {att.enrolledCourse || "JEE Advanced"}
                        </p>
                      </div>

                      {/* Key Score Highlights */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                        <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                          <span className="text-[10px] text-stone-500 uppercase font-bold block">Final Score</span>
                          <span className="font-mono text-base font-bold text-amber-500">
                            {att.totalScore} / {att.maxScore}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                          <span className="text-[10px] text-stone-500 uppercase font-bold block">Percentile</span>
                          <span className="font-mono text-base font-bold text-emerald-500">
                            {att.percentile}%
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                          <span className="text-[10px] text-stone-500 uppercase font-bold block">National Rank</span>
                          <span className="font-mono text-base font-bold text-blue-500">
                            AIR #{att.rank}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                          <span className="text-[10px] text-stone-500 uppercase font-bold block">Accuracy</span>
                          <span className="font-mono text-base font-bold text-purple-500">
                            {att.accuracyPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subject Breakdown & Action Button */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {(att.subjectBreakdown || []).map((sb, sIdx) => (
                          <div
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs flex items-center space-x-1.5"
                          >
                            <span className="font-bold text-stone-700 dark:text-stone-300">{sb.subject}:</span>
                            <span className="font-bold text-amber-500">{sb.score}/{sb.maxScore} pts</span>
                            <span className="text-[10px] text-stone-400">({sb.accuracy}% acc)</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (onReviewAttempt) {
                            onReviewAttempt(att, matchedExam);
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs transition-colors self-stretch sm:self-auto"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Open Solutions & Detailed Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

