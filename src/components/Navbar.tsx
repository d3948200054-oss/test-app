import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Timer,
  User,
  FileCheck2,
  CheckCircle2,
  Flame,
  Crown,
  Bell,
  Sun,
  Moon,
  Key,
  ShieldCheck,
  LogOut,
  X,
  Layers,
  HeartPulse
} from "lucide-react";
import { ThemeMode, UserRole, CourseStream } from "../types";

export type NavTab =
  | "exams"
  | "results"
  | "library"
  | "ai_solver"
  | "focus_tracker"
  | "profile"
  | "notices"
  | "admin";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isExamInProgress: boolean;
  studyStreakDays: number;
  unreadNoticesCount?: number;
  studentCourse?: CourseStream;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  onSwitchRole,
  theme,
  onToggleTheme,
  isExamInProgress,
  studyStreakDays,
  unreadNoticesCount = 0,
  studentCourse = "JEE Advanced (Target 2026)"
}) => {
  const [showAdminPinModal, setShowAdminPinModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  const isDark = theme === "dark";
  const isAdmin = userRole === "admin";

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === "admin123" || enteredPin === "2026" || enteredPin === "") {
      onSwitchRole("admin");
      onTabChange("admin");
      setShowAdminPinModal(false);
      setEnteredPin("");
      setPinError("");
    } else {
      setPinError("Invalid Admin Passcode. Try 'admin123' or press Quick Demo Access.");
    }
  };

  return (
    <>
      {/* Top Application Header Bar */}
      <header
        className={`sticky top-0 z-40 border-b transition-colors ${
          isDark
            ? "bg-[#060b14]/95 border-amber-500/20 text-stone-100 backdrop-blur-md"
            : "bg-[#0f1d38] border-amber-600/30 text-white backdrop-blur-md shadow-md"
        }`}
      >
        {/* Top Admin Privilege Alert Bar if Admin active */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-stone-950 px-4 py-1 text-xs font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>FACULTY & INSTITUTIONAL CONTROL MODE • Question Studio, Grading, Materials & Notices</span>
            </div>
            <button
              onClick={() => {
                onSwitchRole("student");
                onTabChange("exams");
              }}
              className="px-2 py-0.5 rounded bg-stone-950 text-amber-300 hover:bg-stone-900 text-[11px] font-bold cursor-pointer transition-colors"
            >
              Exit Admin / View as Student
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & App Brand with Enrolled Course Pill */}
            <div
              className="flex items-center space-x-3 cursor-pointer select-none"
              onClick={() => onTabChange(isAdmin ? "admin" : "exams")}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all ${
                  isDark
                    ? "bg-gradient-to-br from-amber-500/30 to-amber-700/20 border border-amber-400/40 text-amber-300"
                    : "bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 border border-amber-300"
                }`}
              >
                <Crown className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                    ExamPulse
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full tracking-wide">
                    {isAdmin ? "Admin Suite" : "App"}
                  </span>
                </div>
                {!isAdmin && (
                  <p className="text-[11px] text-amber-300 font-semibold truncate max-w-[180px] sm:max-w-xs">
                    {studentCourse}
                  </p>
                )}
              </div>
            </div>

            {/* Desktop Navigation Items */}
            {!isExamInProgress ? (
              <nav className="hidden lg:flex items-center space-x-1.5">
                {isAdmin && (
                  <button
                    id="nav-tab-admin-hub"
                    onClick={() => onTabChange("admin")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                      activeTab === "admin"
                        ? "bg-amber-500 text-stone-950 shadow-md font-bold"
                        : "text-stone-200 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Crown className="w-4 h-4 text-amber-400 fill-current" />
                    <span>Admin Control Center</span>
                  </button>
                )}

                <button
                  id="nav-tab-exams"
                  onClick={() => onTabChange("exams")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "exams"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Tests & Mocks</span>
                </button>

                <button
                  id="nav-tab-notices"
                  onClick={() => onTabChange("notices")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer relative ${
                    activeTab === "notices"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notices</span>
                  {unreadNoticesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse absolute top-1.5 right-1.5" />
                  )}
                </button>

                <button
                  id="nav-tab-results"
                  onClick={() => onTabChange("results")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "results"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Solutions</span>
                </button>

                <button
                  id="nav-tab-library"
                  onClick={() => onTabChange("library")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "library"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Library</span>
                </button>

                <button
                  id="nav-tab-ai-solver"
                  onClick={() => onTabChange("ai_solver")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "ai_solver"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Doubt Solver</span>
                </button>

                <button
                  id="nav-tab-focus"
                  onClick={() => onTabChange("focus_tracker")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "focus_tracker"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  <span>Study Cam</span>
                </button>

                <button
                  id="nav-tab-profile"
                  onClick={() => onTabChange("profile")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </nav>
            ) : (
              <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-stone-950 border border-red-500/60 text-red-400 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>EXAM IN PROGRESS • PROCTORING ACTIVE</span>
              </div>
            )}

            {/* Right Action Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Study Streak Badge (for students) */}
              {!isAdmin && (
                <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-stone-800/80 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{studyStreakDays}d</span>
                </div>
              )}

              {/* Theme Toggle (Light / Dark) */}
              <button
                id="btn-theme-toggle"
                onClick={onToggleTheme}
                className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-300 border border-amber-500/20 transition-colors cursor-pointer"
                title={`Switch to ${isDark ? "Light" : "Dark"} Royal Theme`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Admin Access / Switch Button */}
              {!isExamInProgress && (
                <>
                  {isAdmin ? (
                    <button
                      id="btn-nav-exit-admin"
                      onClick={() => {
                        onSwitchRole("student");
                        onTabChange("exams");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Student View</span>
                    </button>
                  ) : (
                    <button
                      id="btn-nav-admin-portal"
                      onClick={() => setShowAdminPinModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                      title="Access Admin Control Suite"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Admin Portal</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM APP NAVIGATION BAR (Native App Feel) */}
      {!isExamInProgress && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t px-2 py-1.5 flex items-center justify-around backdrop-blur-lg transition-colors ${
            isDark
              ? "bg-[#060b14]/95 border-stone-800 text-stone-300"
              : "bg-[#0f1d38]/95 border-amber-600/30 text-stone-200 shadow-2xl"
          }`}
        >
          {isAdmin ? (
            <button
              onClick={() => onTabChange("admin")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
                activeTab === "admin" ? "text-amber-400 scale-105" : "text-stone-400"
              }`}
            >
              <Crown className="w-5 h-5 mb-0.5 fill-current" />
              <span>Admin</span>
            </button>
          ) : null}

          <button
            onClick={() => onTabChange("exams")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === "exams" ? "text-amber-400 scale-105" : "text-stone-400"
            }`}
          >
            <FileCheck2 className="w-5 h-5 mb-0.5" />
            <span>Tests</span>
          </button>

          <button
            onClick={() => onTabChange("notices")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all relative ${
              activeTab === "notices" ? "text-amber-400 scale-105" : "text-stone-400"
            }`}
          >
            <Bell className="w-5 h-5 mb-0.5" />
            <span>Notices</span>
            {unreadNoticesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-3" />
            )}
          </button>

          <button
            onClick={() => onTabChange("ai_solver")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === "ai_solver" ? "text-amber-400 scale-105" : "text-stone-400"
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span>AI Solver</span>
          </button>

          <button
            onClick={() => onTabChange("library")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === "library" ? "text-amber-400 scale-105" : "text-stone-400"
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span>Library</span>
          </button>

          <button
            onClick={() => onTabChange("focus_tracker")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === "focus_tracker" ? "text-rose-400 scale-105" : "text-stone-400"
            }`}
          >
            <HeartPulse className="w-5 h-5 mb-0.5" />
            <span>Cam</span>
          </button>

          <button
            onClick={() => onTabChange("profile")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === "profile" ? "text-amber-400 scale-105" : "text-stone-400"
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </button>
        </div>
      )}

      {/* Admin Passcode Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-sm w-full p-6 border shadow-2xl transition-colors ${
              isDark ? "bg-[#091325] border-amber-500/40 text-white" : "bg-white border-[#e5dec9] text-stone-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-400 fill-current" />
                <h3 className="font-classic-serif font-bold text-base">Admin Access Portal</h3>
              </div>
              <button
                onClick={() => setShowAdminPinModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyAdminPin} className="space-y-4">
              <p className="text-xs text-stone-400 leading-relaxed">
                Enter your institutional faculty security passcode (Default: <code className="text-amber-400 font-bold">admin123</code>) to access test composition, question vault, candidate proctoring, and notice broadcasting.
              </p>

              <div>
                <label className="text-xs font-bold block mb-1">Passcode</label>
                <input
                  type="password"
                  placeholder="Enter 'admin123' or leave blank"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  autoFocus
                  className="w-full p-2.5 rounded-xl border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-xs focus:outline-none"
                />
                {pinError && <p className="text-[11px] text-red-500 mt-1 font-semibold">{pinError}</p>}
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Unlock Admin Control Panel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSwitchRole("admin");
                    onTabChange("admin");
                    setShowAdminPinModal(false);
                  }}
                  className="w-full py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Quick Demo Access (1-Click)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
