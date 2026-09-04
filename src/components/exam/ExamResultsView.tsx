import React, { useState, useEffect } from "react";
import { ExamAttempt, Exam, Question } from "../../types";
import confetti from "canvas-confetti";
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  RotateCcw,
  BookOpen
} from "lucide-react";

interface ExamResultsViewProps {
  attempt: ExamAttempt;
  exam: Exam;
  onRetakeExam: () => void;
  onExploreStudyMaterial: () => void;
  theme?: "dark" | "light";
}

export const ExamResultsView: React.FC<ExamResultsViewProps> = ({
  attempt,
  exam,
  onRetakeExam,
  onExploreStudyMaterial,
  theme = "dark"
}) => {
  const isDark = theme === "dark";
  const [filterType, setFilterType] = useState<"all" | "correct" | "incorrect" | "unattempted">("all");
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  
  // AI Doubt Clearance Drawer State
  const [activeDoubtQId, setActiveDoubtQId] = useState<string | null>(null);
  const [doubtMessages, setDoubtMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [userDoubtInput, setUserDoubtInput] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Trigger celebration on load if score is passing
  useEffect(() => {
    if (attempt.totalScore >= exam.passingMarks) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [attempt, exam]);

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleOpenDoubtChat = (q: Question) => {
    setActiveDoubtQId(q.id);
    setDoubtMessages([
      {
        sender: "ai",
        text: `Hello ${attempt.studentName}! I am your AI Exam Mentor. I see you want to discuss Question: "${q.questionText.slice(0, 80)}...". What specific step or concept would you like me to explain?`
      }
    ]);
  };

  const handleSendDoubt = async () => {
    if (!userDoubtInput.trim() || isAiLoading) return;
    const msg = userDoubtInput;
    setUserDoubtInput("");
    setDoubtMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setIsAiLoading(true);

    const questionObj = exam.questions.find((q) => q.id === activeDoubtQId);

    try {
      const res = await fetch("/api/ai/doubt-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          context: `Exam: ${exam.title} | Subject: ${questionObj?.subject} | Topic: ${questionObj?.topic} | Question: ${questionObj?.questionText} | Solution: ${questionObj?.solutionExplanation}`
        })
      });
      const data = await res.json();
      setDoubtMessages((prev) => [...prev, { sender: "ai", text: data.reply || "Let me break that down for you..." }]);
    } catch (e) {
      setDoubtMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "When analyzing this step, recall the underlying fundamental theorem. The negative derivative directly indicates the restorative direction of the force."
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredQuestions = exam.questions.filter((q) => {
    const resp = attempt.responses[q.id];
    if (filterType === "correct") return resp?.isCorrect === true;
    if (filterType === "incorrect") return resp?.selectedOptionIndex !== undefined && resp?.isCorrect === false;
    if (filterType === "unattempted") return resp?.selectedOptionIndex === undefined;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Score, Rank & Percentile */}
      <div
        className={`border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-colors ${
          isDark
            ? "bg-gradient-to-r from-[#0a1428] via-[#0d1c3a] to-[#0a1428] border-amber-500/30 text-white"
            : "bg-gradient-to-r from-[#1c2942] via-[#233554] to-[#1c2942] border-amber-600/40 text-white shadow-xl"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Summary */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Automated Evaluation Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-classic-serif">
              {exam.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300">
              Candidate: <span className="font-semibold text-white">{attempt.studentName}</span> • Submitted: {new Date(attempt.submittedAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Right Metrics Bento Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            {/* Score */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">Score</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
                {attempt.totalScore}
                <span className="text-xs font-medium text-stone-400">/{attempt.maxScore}</span>
              </div>
              <span className="text-[10px] text-stone-300">
                {attempt.totalScore >= exam.passingMarks ? "Passed ✅" : "Needs Review"}
              </span>
            </div>

            {/* Rank */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">Live Rank</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">
                #{attempt.rank}
              </div>
              <span className="text-[10px] text-stone-300">of {attempt.totalParticipants} students</span>
            </div>

            {/* Percentile */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">Percentile</span>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 font-mono">
                {attempt.percentile}%
              </div>
              <span className="text-[10px] text-stone-300">Top Tier Performance</span>
            </div>

            {/* Accuracy */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">Accuracy</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-300 mt-1 font-mono">
                {attempt.accuracyPercentage}%
              </div>
              <span className="text-[10px] text-stone-300">Precision Rate</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-stone-200">
              Integrity Score: <strong className="text-emerald-400">{attempt.integrityScore}%</strong> ({attempt.proctorFlags.length} proctor flags recorded)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRetakeExam}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={onExploreStudyMaterial}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study Weak Topics in Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {attempt.subjectBreakdown.map((sub) => (
          <div
            key={sub.subject}
            className={`rounded-2xl p-5 border transition-colors ${
              isDark
                ? "bg-[#0f1b33] border-stone-800 text-white"
                : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-classic-serif">{sub.subject}</h3>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                {sub.score}/{sub.maxScore} pts
              </span>
            </div>

            <div className="w-full bg-stone-200 dark:bg-stone-900 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full"
                style={{ width: `${Math.max(5, (sub.score / (sub.maxScore || 1)) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className={`p-2 rounded-lg border ${isDark ? "bg-[#091325] border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block text-xs">{sub.correct}</span>
                <span className="text-stone-600 dark:text-stone-400 font-medium">Correct</span>
              </div>
              <div className={`p-2 rounded-lg border ${isDark ? "bg-[#091325] border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                <span className="text-rose-600 dark:text-rose-400 font-bold block text-xs">{sub.incorrect}</span>
                <span className="text-stone-600 dark:text-stone-400 font-medium">Wrong</span>
              </div>
              <div className={`p-2 rounded-lg border ${isDark ? "bg-[#091325] border-stone-800" : "bg-stone-50 border-stone-200"}`}>
                <span className="text-amber-600 dark:text-amber-400 font-bold block text-xs">{sub.unattempted}</span>
                <span className="text-stone-600 dark:text-stone-400 font-medium">Skipped</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Question Review & Step-by-Step Solutions Section */}
      <div
        className={`rounded-2xl p-5 md:p-6 border transition-colors ${
          isDark
            ? "bg-[#0f1b33] border-stone-800 text-stone-100"
            : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2 font-classic-serif">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Detailed Solutions & Answers
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              Review every derivation, examine your choice vs answer key, and chat with AI for instant doubts.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-stone-100 dark:bg-[#091325] border border-stone-200 dark:border-stone-800">
            {(["all", "incorrect", "correct", "unattempted"] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterType === ft
                    ? "bg-amber-500 text-stone-950 font-bold shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const resp = attempt.responses[q.id];
            const isCorrect = resp?.isCorrect === true;
            const isIncorrect = resp?.selectedOptionIndex !== undefined && !isCorrect;
            const isUnattempted = resp?.selectedOptionIndex === undefined;
            const isExpanded = expandedSolutions[q.id] || false;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all p-5 ${
                  isCorrect
                    ? isDark ? "bg-emerald-950/20 border-emerald-500/30" : "bg-emerald-50/60 border-emerald-200"
                    : isIncorrect
                    ? isDark ? "bg-rose-950/20 border-rose-500/30" : "bg-rose-50/60 border-rose-200"
                    : isDark ? "bg-[#091325] border-stone-800" : "bg-stone-50 border-stone-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-stone-200 dark:bg-stone-800 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      {q.subject} • {q.topic}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{q.marks})
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-300 dark:border-rose-500/40">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (-{q.negativeMarks})
                      </span>
                    )}
                    {isUnattempted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 dark:text-stone-400 bg-stone-200 dark:bg-stone-800 px-2.5 py-1 rounded-full">
                        Skipped (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm text-stone-900 dark:text-stone-100 font-medium leading-relaxed mb-4">
                  {q.questionText}
                </p>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isCandidateChoice = resp?.selectedOptionIndex === optIdx;
                    const isCorrectAnswer = q.correctOptionIndex === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    let cardStyle = isDark
                      ? "bg-[#060b14] border-stone-800 text-stone-300"
                      : "bg-white border-stone-200 text-stone-700";

                    if (isCorrectAnswer) {
                      cardStyle = isDark
                        ? "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold"
                        : "bg-emerald-100/90 border-emerald-400 text-emerald-900 font-semibold";
                    } else if (isCandidateChoice && !isCorrectAnswer) {
                      cardStyle = isDark
                        ? "bg-rose-950/70 border-rose-500 text-rose-200"
                        : "bg-rose-100/90 border-rose-400 text-rose-900 font-semibold";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${cardStyle}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{letter}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-200/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                            Key Answer
                          </span>
                        )}
                        {isCandidateChoice && !isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-200/80 dark:bg-rose-900/60 px-1.5 py-0.5 rounded">
                            Your Pick
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Solution Toggle & AI Doubt Trigger */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isExpanded ? "Hide Step-by-Step Solution" : "View Step-by-Step Solution"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleOpenDoubtChat(q)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ask AI Doubt on This Q</span>
                  </button>
                </div>

                {/* Expanded Mathematical Explanation */}
                {isExpanded && (
                  <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed space-y-2 animate-fadeIn ${
                    isDark ? "bg-[#060b14] border-stone-800 text-stone-300" : "bg-white border-stone-200 text-stone-800"
                  }`}>
                    <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-classic-serif">
                      <BookOpen className="w-3.5 h-3.5" /> Detailed Mathematical Derivation & Concept:
                    </div>
                    <p className="whitespace-pre-line text-stone-800 dark:text-stone-200 font-sans">{q.solutionExplanation}</p>
                    {q.hint && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 pt-1 border-t border-stone-200 dark:border-stone-800">
                        💡 <strong>Key Examination Tip:</strong> {q.hint}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI DOUBT CHAT DRAWER / MODAL */}
      {activeDoubtQId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className={`border rounded-t-3xl sm:rounded-3xl max-w-xl w-full h-[80vh] flex flex-col shadow-2xl transition-colors ${
              isDark
                ? "bg-[#0f1b33] border-stone-800 text-stone-100"
                : "bg-white border-[#e5dec9] text-stone-900 shadow-2xl"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-classic-serif text-stone-900 dark:text-white">24/7 AI Doubt Resolution</h3>
                  <p className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">Instant step clarification powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDoubtQId(null)}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {doubtMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-amber-500 text-stone-950 font-medium rounded-br-none"
                        : isDark
                        ? "bg-[#091325] border border-stone-800 text-stone-200 rounded-bl-none"
                        : "bg-stone-100 border border-stone-200 text-stone-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl rounded-bl-none text-xs text-amber-600 dark:text-amber-400 flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>AI Professor is formulating the step-by-step intuition...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#091325]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ask any doubt (e.g. why did we use conservation of momentum here?)..."
                  value={userDoubtInput}
                  onChange={(e) => setUserDoubtInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendDoubt()}
                  className="flex-1 rounded-xl px-4 py-2.5 text-xs bg-white dark:bg-[#060b14] border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSendDoubt}
                  disabled={!userDoubtInput.trim() || isAiLoading}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
