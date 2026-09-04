import React, { useState } from "react";
import { StudentProfile, ExamAttempt, Exam, ThemeMode, CourseStream } from "../../types";
import {
  User,
  Award,
  Flame,
  Target,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
  BarChart3,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";

interface StudentProfileViewProps {
  profile: StudentProfile;
  attempts: ExamAttempt[];
  exams: Exam[];
  theme?: ThemeMode;
  onReviewAttempt: (attempt: ExamAttempt, exam: Exam) => void;
  onExploreTopic: (topicName: string) => void;
  onUpdateCourse?: (course: CourseStream) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  profile,
  attempts,
  exams,
  theme = "light",
  onReviewAttempt,
  onExploreTopic,
  onUpdateCourse
}) => {
  const isDark = theme === "dark";
  const [isChangingCourse, setIsChangingCourse] = useState<boolean>(false);

  const availableCourses: CourseStream[] = [
    "JEE Advanced (Target 2026)",
    "NEET Medical (Super-30)",
    "Class 12 CBSE Board (PCM)",
    "Class 12 CBSE Board (PCB)",
    "Foundation Olympiad (9th-10th)"
  ];

  // Tests allotted to this student's course
  const courseExams = exams.filter(
    (e) => e.allottedCourse === profile.enrolledCourse || e.allottedCourse === "All Courses"
  );

  return (
    <div className="space-y-6">
      {/* Royal Profile App Card */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-colors ${
          isDark
            ? "bg-gradient-to-r from-[#0d182e] via-[#091325] to-[#060b14] border-amber-500/30 text-stone-100"
            : "bg-gradient-to-r from-[#0f1d38] via-[#16274a] to-[#1e345e] border-amber-600/40 text-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 p-1 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#060b14] rounded-xl flex items-center justify-center text-amber-400 text-2xl font-bold font-classic-serif">
                {profile.name.charAt(0)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Enrolled: {profile.enrolledCourse}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-800/80 text-[10px] text-stone-300 border border-stone-700 font-mono">
                  Batch: {profile.batchCode}
                </span>
              </div>

              <h1 className="font-classic-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {profile.name}
              </h1>
              <p className="text-xs text-stone-300 font-mono">
                {profile.email} • Candidate ID: {profile.id}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-2.5">
            <div className="bg-stone-950/70 border border-amber-500/30 p-3 rounded-xl text-center min-w-[85px] shadow-sm">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Rank Avg</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                #{profile.currentRankAvg}
              </div>
            </div>

            <div className="bg-stone-950/70 border border-amber-500/30 p-3 rounded-xl text-center min-w-[85px] shadow-sm">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Percentile</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {profile.overallPercentileAvg}%
              </div>
            </div>

            <div className="bg-stone-950/70 border border-amber-500/30 p-3 rounded-xl text-center min-w-[85px] shadow-sm">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Streak</span>
              <div className="text-xl font-bold font-mono text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-4 h-4 fill-current" />
                <span>{profile.studyStreakDays}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Allotment Switcher Drawer Toggle */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-stone-300 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>
              Allotted Academic Curriculum: <strong>{courseExams.length} Mock Tests & Handbooks Assigned</strong>
            </span>
          </div>

          <button
            onClick={() => setIsChangingCourse(!isChangingCourse)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-semibold text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            {isChangingCourse ? "Close Course Switcher" : "Switch Enrolled Course / Stream"}
          </button>
        </div>

        {/* Change Course Stream Selector */}
        {isChangingCourse && (
          <div className="mt-4 p-4 rounded-xl bg-[#060b14]/90 border border-amber-500/40 space-y-3">
            <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider">
              Select Your Target Examination Stream:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableCourses.map((course) => (
                <button
                  key={course}
                  onClick={() => {
                    if (onUpdateCourse) onUpdateCourse(course);
                    setIsChangingCourse(false);
                  }}
                  className={`p-3 rounded-lg text-left text-xs font-semibold border transition-all cursor-pointer ${
                    profile.enrolledCourse === course
                      ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md"
                      : "bg-[#0f1b33] text-stone-300 border-stone-800 hover:border-amber-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{course}</span>
                    {profile.enrolledCourse === course && <CheckCircle2 className="w-4 h-4 text-stone-950" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weak Topics vs Mastered Topics Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strong Topics */}
        <div
          className={`rounded-2xl p-6 border transition-colors ${
            isDark ? "bg-[#0f1b33] border-stone-800 text-stone-100" : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-classic-serif font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Strong Mastered Topics
            </h3>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">&gt;85% Accuracy</span>
          </div>

          <div className="space-y-2.5">
            {profile.strongTopics.map((topic, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? "bg-[#091325] border-stone-800" : "bg-stone-50 border-stone-200"
                }`}
              >
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">{topic.topic}</span>
                  <span className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">{topic.subject}</span>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{topic.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Focus & Improvement Areas */}
        <div
          className={`rounded-2xl p-6 border transition-colors ${
            isDark ? "bg-[#0f1b33] border-stone-800 text-stone-100" : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-classic-serif font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Priority Improvement Areas
            </h3>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">&lt;70% Accuracy</span>
          </div>

          <div className="space-y-2.5">
            {profile.weakTopics.map((topic, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? "bg-[#091325] border-stone-800" : "bg-stone-50 border-stone-200"
                }`}
              >
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">{topic.topic}</span>
                  <span className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">{topic.subject}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{topic.accuracy}%</span>
                  <button
                    onClick={() => onExploreTopic(topic.topic)}
                    className="p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors cursor-pointer"
                    title="Solve in AI Solver"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Exam Attempts & Performance Audit */}
      <div
        className={`rounded-2xl p-6 border transition-colors ${
          isDark ? "bg-[#0f1b33] border-stone-800 text-stone-100" : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-classic-serif font-bold text-sm flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <BarChart3 className="w-4 h-4 text-amber-500" /> Recent Standard Examination Attempts
          </h3>
          <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Total Attempts: {attempts.length}</span>
        </div>

        <div className="space-y-3">
          {attempts.map((att) => {
            const correspondingExam = exams.find((e) => e.id === att.examId) || exams[0];
            return (
              <div
                key={att.id}
                onClick={() => correspondingExam && onReviewAttempt(att, correspondingExam)}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer transition-all hover:border-amber-500/40 ${
                  isDark ? "bg-[#091325] border-stone-800" : "bg-stone-50 border-stone-200 hover:bg-stone-100/60"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-stone-900 dark:text-white">{att.examTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                      Rank #{att.rank} of {att.totalParticipants}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                    Completed on {new Date(att.submittedAt).toLocaleDateString()} • Integrity: {att.integrityScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 block font-medium">Score</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {att.totalScore} / {att.maxScore}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 block font-medium">Percentile</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {att.percentile}%
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
