import React, { useState, useEffect } from "react";
import {
  Exam,
  ExamAttempt,
  StudyBook,
  StudentProfile,
  PhoneHistoryEntry,
  Notice,
  AdminCandidateRecord,
  ThemeMode,
  UserRole,
  CourseStream
} from "./types";
import {
  INITIAL_EXAMS,
  INITIAL_BOOKS,
  INITIAL_PROFILE,
  INITIAL_PHONE_HISTORY,
  SAMPLE_ATTEMPT,
  INITIAL_NOTICES,
  INITIAL_CANDIDATES
} from "./data/mockData";
import { Navbar, NavTab } from "./components/Navbar";
import { ExamList } from "./components/exam/ExamList";
import { ExamTakingRoom } from "./components/exam/ExamTakingRoom";
import { ExamResultsView } from "./components/exam/ExamResultsView";
import { StudyLibrary } from "./components/library/StudyLibrary";
import { InstantSolver } from "./components/ai-solver/InstantSolver";
import { FocusTracker } from "./components/focus-tracker/FocusTracker";
import { StudentProfileView } from "./components/profile/StudentProfileView";
import { StudentNoticeBoard } from "./components/notices/StudentNoticeBoard";
import { AdminControlPanel } from "./components/admin/AdminControlPanel";

export default function App() {
  // Theme & Role State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem("preppy_theme") as ThemeMode) || "light";
  });
  const [userRole, setUserRole] = useState<UserRole>("student");

  // Global Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>("exams");

  // Exams State
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [currentTakingExam, setCurrentTakingExam] = useState<Exam | null>(null);
  const [isExamInProgress, setIsExamInProgress] = useState<boolean>(false);

  // Attempts State
  const [attempts, setAttempts] = useState<ExamAttempt[]>([SAMPLE_ATTEMPT]);
  const [latestAttempt, setLatestAttempt] = useState<ExamAttempt | null>(SAMPLE_ATTEMPT);
  const [reviewExam, setReviewExam] = useState<Exam>(INITIAL_EXAMS[0]);

  // Books / PDF Library State
  const [books, setBooks] = useState<StudyBook[]>(INITIAL_BOOKS);

  // Notices & Announcements State
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);

  // Candidates / Proctor State
  const [candidates, setCandidates] = useState<AdminCandidateRecord[]>(INITIAL_CANDIDATES);

  // Student Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [phoneHistory, setPhoneHistory] = useState<PhoneHistoryEntry[]>(INITIAL_PHONE_HISTORY);

  // Synchronize theme to document root
  useEffect(() => {
    localStorage.setItem("preppy_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Handle Exam Start
  const handleStartExam = (exam: Exam) => {
    setCurrentTakingExam(exam);
    setIsExamInProgress(true);
  };

  // Handle Exam Submission
  const handleSubmitExam = (attempt: ExamAttempt) => {
    setAttempts((prev) => [attempt, ...prev]);
    setLatestAttempt(attempt);
    if (currentTakingExam) {
      setReviewExam(currentTakingExam);
    }
    setCurrentTakingExam(null);
    setIsExamInProgress(false);
    setActiveTab("results");

    // Update Student Profile stats dynamically
    setStudentProfile((prev) => ({
      ...prev,
      totalTestsTaken: prev.totalTestsTaken + 1,
      overallPercentileAvg: Math.round(
        (prev.overallPercentileAvg * prev.totalTestsTaken + attempt.percentile) /
          (prev.totalTestsTaken + 1)
      ),
      recentAttempts: [attempt, ...prev.recentAttempts]
    }));
  };

  // Handle Exam Exit / Cancel
  const handleExitExam = () => {
    setCurrentTakingExam(null);
    setIsExamInProgress(false);
  };

  // Retake exam from results view
  const handleRetakeExam = () => {
    if (reviewExam) {
      handleStartExam(reviewExam);
    } else if (exams[0]) {
      handleStartExam(exams[0]);
    }
  };

  // Review specific past attempt
  const handleReviewSpecificAttempt = (att: ExamAttempt, exam: Exam) => {
    setLatestAttempt(att);
    setReviewExam(exam);
    setActiveTab("results");
  };

  // Explore topic from profile weak areas
  const handleExploreTopicFromProfile = (topicName: string) => {
    setActiveTab("ai_solver");
  };

  // Handle Student Course Stream Switch
  const handleUpdateCourse = (newCourse: CourseStream) => {
    setStudentProfile((prev) => ({
      ...prev,
      enrolledCourse: newCourse
    }));
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500/30 selection:text-amber-800 dark:selection:text-amber-300 ${
        isDark ? "bg-[#060b14] text-stone-100" : "bg-[#f8f5ee] text-stone-900"
      }`}
    >
      {/* Top Royal App Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (!isExamInProgress) setActiveTab(tab);
        }}
        userRole={userRole}
        onSwitchRole={setUserRole}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isExamInProgress={isExamInProgress}
        studyStreakDays={studentProfile.studyStreakDays}
        unreadNoticesCount={notices.length}
        studentCourse={studentProfile.enrolledCourse}
      />

      {/* Main Content Arena with mobile bottom padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        {/* VIEW 1: ACTIVE EXAM ROOM (FULL FOCUS / PROCTORING) */}
        {isExamInProgress && currentTakingExam ? (
          <ExamTakingRoom
            exam={currentTakingExam}
            studentName={studentProfile.name}
            onSubmitExam={handleSubmitExam}
            onExitExam={handleExitExam}
          />
        ) : (
          <>
            {/* VIEW 2: MASTER ADMIN ACCESS PANEL */}
            {activeTab === "admin" && userRole === "admin" && (
              <AdminControlPanel
                exams={exams}
                books={books}
                notices={notices}
                attempts={attempts}
                candidates={candidates}
                theme={theme}
                onUpdateExams={setExams}
                onUpdateBooks={setBooks}
                onUpdateNotices={setNotices}
                onUpdateCandidates={setCandidates}
                onSwitchToStudentView={() => {
                  setUserRole("student");
                  setActiveTab("exams");
                }}
              />
            )}

            {/* VIEW 3: ALLOCATED EXAMS & MOCK PAPERS */}
            {activeTab === "exams" && (
              <ExamList
                exams={exams}
                onStartExam={handleStartExam}
                isAdmin={userRole === "admin"}
                theme={theme}
                onOpenAdminPanel={() => setActiveTab("admin")}
                studentCourse={studentProfile.enrolledCourse}
              />
            )}

            {/* VIEW 4: OFFICIAL NOTICES & ANNOUNCEMENTS */}
            {activeTab === "notices" && (
              <StudentNoticeBoard
                notices={notices}
                theme={theme}
                studentCourse={studentProfile.enrolledCourse}
              />
            )}

            {/* VIEW 5: AUTOMATED RESULTS & STEP-BY-STEP SOLUTIONS */}
            {activeTab === "results" && latestAttempt && (
              <ExamResultsView
                attempt={latestAttempt}
                exam={reviewExam}
                onRetakeExam={handleRetakeExam}
                onExploreStudyMaterial={() => setActiveTab("library")}
              />
            )}

            {/* VIEW 6: STUDY MATERIAL & HANDBOOK LIBRARY */}
            {activeTab === "library" && (
              <StudyLibrary
                books={books}
                isAdmin={userRole === "admin"}
                theme={theme}
                onOpenAdminPanel={() => setActiveTab("admin")}
                studentCourse={studentProfile.enrolledCourse}
              />
            )}

            {/* VIEW 7: AI QUESTION & DIAGRAM SOLVER */}
            {activeTab === "ai_solver" && <InstantSolver />}

            {/* VIEW 8: COGNITIVE EMOTION & FOCUS CAM */}
            {activeTab === "focus_tracker" && (
              <FocusTracker
                phoneHistory={phoneHistory}
                studyStreakDays={studentProfile.studyStreakDays}
                theme={theme}
              />
            )}

            {/* VIEW 9: STUDENT PROFILE & COURSE ALLOTMENT */}
            {activeTab === "profile" && (
              <StudentProfileView
                profile={studentProfile}
                attempts={attempts}
                exams={exams}
                theme={theme}
                onReviewAttempt={handleReviewSpecificAttempt}
                onExploreTopic={handleExploreTopicFromProfile}
                onUpdateCourse={handleUpdateCourse}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
