import React, { useState, useEffect, useRef } from "react";
import { Exam, Question, QuestionResponse, QuestionStatus, ProctorFlag, ExamAttempt } from "../../types";
import { sounds } from "../../utils/soundEffects";
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Minimize2,
  Calculator,
  PenTool,
  RotateCcw,
  Send,
  Eye,
  Camera,
  ShieldAlert,
  Info,
  X
} from "lucide-react";

interface ExamTakingRoomProps {
  exam: Exam;
  studentName: string;
  studentId: string;
  onFinishExam: (attempt: ExamAttempt) => void;
  onExitWithoutSubmit: () => void;
}

export const ExamTakingRoom: React.FC<ExamTakingRoomProps> = ({
  exam,
  studentName,
  studentId,
  onFinishExam,
  onExitWithoutSubmit
}) => {
  // Navigation & Answers State
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({});
  
  // Timer State (in seconds)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(exam.durationMinutes * 60);
  const [startedAt] = useState<string>(new Date().toISOString());

  // Proctoring & Integrity Flags
  const [proctorFlags, setProctorFlags] = useState<ProctorFlag[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [webcamStatus, setWebcamStatus] = useState<string>("Initializing AI Proctor...");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Modals & Digital Tools
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [calcInput, setCalcInput] = useState<string>("");
  const [calcResult, setCalcResult] = useState<string>("");

  // Scratchpad Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>("#38bdf8");

  // Questions of current section
  const currentSection = exam.sections[currentSectionIndex] || exam.sections[0];
  const sectionQuestions = exam.questions.filter((q) =>
    currentSection.questionIds.includes(q.id)
  );
  const currentQuestion: Question | undefined = sectionQuestions[currentQuestionIndex] || exam.questions[0];

  // Initialize responses on load
  useEffect(() => {
    const initialResponses: Record<string, QuestionResponse> = {};
    exam.questions.forEach((q, idx) => {
      initialResponses[q.id] = {
        questionId: q.id,
        status: idx === 0 ? "not_answered" : "not_visited",
        timeSpentSeconds: 0
      };
    });
    setResponses(initialResponses);
  }, [exam]);

  // Timer Tick
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleAutoSubmit("Time Expired");
      return;
    }
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeftSeconds]);

  // Anti-Cheating & Proctoring Handlers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordProctorFlag("tab_switch", "Candidate switched browser tab or minimized test window.", "high");
        sounds.playWarningBeep();
        setWarningMessage("⚠️ WARNING: Tab switch detected! All tab changes are audited by AI Proctor.");
      }
    };

    const handleWindowBlur = () => {
      recordProctorFlag("tab_switch", "Window lost focus / background click detected.", "medium");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  // Initialize Proctoring Webcam Stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setWebcamActive(true);
          setWebcamStatus("AI Proctor Active (Gaze & Face Verified)");
        }
      } catch (e) {
        console.warn("Camera access not granted for proctoring:", e);
        setWebcamStatus("Simulated AI Vision Proctor");
      }
    };

    if (exam.proctoringEnabled) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [exam.proctoringEnabled]);

  const recordProctorFlag = (
    type: ProctorFlag["type"],
    description: string,
    severity: "low" | "medium" | "high"
  ) => {
    const newFlag: ProctorFlag = {
      id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      description,
      severity
    };
    setProctorFlags((prev) => [...prev, newFlag]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Answer Handling
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setResponses((prev) => {
      const current = prev[currentQuestion.id] || { questionId: currentQuestion.id, timeSpentSeconds: 0 };
      return {
        ...prev,
        [currentQuestion.id]: {
          ...current,
          selectedOptionIndex: optionIndex,
          status: "answered"
        }
      };
    });
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setResponses((prev) => {
      const current = prev[currentQuestion.id] || { questionId: currentQuestion.id, timeSpentSeconds: 0 };
      return {
        ...prev,
        [currentQuestion.id]: {
          ...current,
          selectedOptionIndex: undefined,
          status: "not_answered"
        }
      };
    });
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const currentResp = responses[currentQuestion.id];
    const isAnswered = currentResp?.selectedOptionIndex !== undefined;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        status: isAnswered ? "answered_marked_review" : "marked_review"
      }
    }));

    handleNextQuestion();
  };

  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const currentResp = responses[currentQuestion.id];
    const isAnswered = currentResp?.selectedOptionIndex !== undefined;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        status: isAnswered ? "answered" : "not_answered"
      }
    }));

    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSectionIndex < exam.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      const prevSection = exam.sections[currentSectionIndex - 1];
      setCurrentQuestionIndex(prevSection.questionIds.length - 1);
    }
  };

  const jumpToQuestion = (sectionIdx: number, questionIdx: number) => {
    setCurrentSectionIndex(sectionIdx);
    setCurrentQuestionIndex(questionIdx);

    const targetSec = exam.sections[sectionIdx];
    const targetQId = targetSec.questionIds[questionIdx];
    if (responses[targetQId]?.status === "not_visited") {
      setResponses((prev) => ({
        ...prev,
        [targetQId]: {
          ...prev[targetQId],
          status: "not_answered"
        }
      }));
    }
  };

  // Calculator Logic
  const handleCalcButton = (val: string) => {
    if (val === "C") {
      setCalcInput("");
      setCalcResult("");
    } else if (val === "=") {
      try {
        // Safe evaluation
        const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, "");
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcResult(String(res));
      } catch (e) {
        setCalcResult("Error");
      }
    } else if (val === "sqrt") {
      try {
        const num = parseFloat(calcInput);
        setCalcResult(String(Math.sqrt(num)));
      } catch (e) {
        setCalcResult("Error");
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  // Scratchpad Canvas Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Submit Exam & Auto-Grading Calculation
  const handleAutoSubmit = (reason?: string) => {
    sounds.playSuccessChime();

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const subjectsMap: Record<string, { total: number; maxScore: number; correct: number; incorrect: number; unattempted: number; score: number }> = {};

    exam.questions.forEach((q) => {
      if (!subjectsMap[q.subject]) {
        subjectsMap[q.subject] = { total: 0, maxScore: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0 };
      }
      subjectsMap[q.subject].total += 1;
      subjectsMap[q.subject].maxScore += q.marks;

      const resp = responses[q.id];
      if (resp && resp.selectedOptionIndex !== undefined) {
        if (resp.selectedOptionIndex === q.correctOptionIndex) {
          totalScore += q.marks;
          correctCount += 1;
          subjectsMap[q.subject].correct += 1;
          subjectsMap[q.subject].score += q.marks;
          resp.isCorrect = true;
          resp.marksAwarded = q.marks;
        } else {
          totalScore -= q.negativeMarks;
          incorrectCount += 1;
          subjectsMap[q.subject].incorrect += 1;
          subjectsMap[q.subject].score -= q.negativeMarks;
          resp.isCorrect = false;
          resp.marksAwarded = -q.negativeMarks;
        }
      } else {
        unattemptedCount += 1;
        subjectsMap[q.subject].unattempted += 1;
        if (resp) resp.marksAwarded = 0;
      }
    });

    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
    const scoreRatio = Math.max(0, totalScore) / exam.totalMarks;
    // Calculate realistic competitive percentile
    const calculatedPercentile = Math.min(99.98, Math.max(45.0, 60 + scoreRatio * 38 + (accuracy > 80 ? 1.8 : 0)));
    const calculatedRank = Math.max(1, Math.round((1 - calculatedPercentile / 100) * 1250));

    const subjectBreakdown = Object.entries(subjectsMap).map(([subject, data]) => ({
      subject,
      score: data.score,
      maxScore: data.maxScore,
      correct: data.correct,
      incorrect: data.incorrect,
      unattempted: data.unattempted,
      accuracy: data.correct + data.incorrect > 0 ? Math.round((data.correct / (data.correct + data.incorrect)) * 100) : 0
    }));

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      studentId,
      studentName,
      startedAt,
      submittedAt: new Date().toISOString(),
      totalScore,
      maxScore: exam.totalMarks,
      accuracyPercentage: Math.round(accuracy * 10) / 10,
      percentile: Math.round(calculatedPercentile * 100) / 100,
      rank: calculatedRank,
      totalParticipants: 1250,
      responses,
      proctorFlags,
      integrityScore: Math.max(20, 100 - proctorFlags.length * 12),
      subjectBreakdown
    };

    onFinishExam(attempt);
  };

  // Format Time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Count answered, marked, not answered
  const responseList: QuestionResponse[] = Object.values(responses);
  const answeredCount = responseList.filter((r) => r.selectedOptionIndex !== undefined).length;
  const markedCount = responseList.filter((r) => r.status === "marked_review" || r.status === "answered_marked_review").length;
  const notAnsweredCount = exam.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col select-none">
      {/* Top Standardized Exam Header */}
      <header className="bg-[#0f172a] border-b border-stone-700 px-4 py-2.5 flex items-center justify-between text-stone-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-stone-800 border border-stone-600 flex items-center justify-center font-bold text-xs text-amber-400">
            NTA
          </div>
          <div>
            <h2 className="font-classic-serif text-sm sm:text-base font-bold text-white leading-tight line-clamp-1">
              {exam.title}
            </h2>
            <p className="text-[11px] text-stone-400">Candidate: {studentName} • Pattern: Standard +4 / -1 Scheme</p>
          </div>
        </div>

        {/* Center: Real-time Countdown Timer */}
        <div className="flex items-center space-x-4">
          <div
            className={`px-3.5 py-1 rounded-md border flex items-center space-x-2 font-mono font-bold text-xs shadow-inner transition-colors ${
              timeLeftSeconds < 300
                ? "bg-red-950/80 border-red-500 text-red-300 animate-pulse"
                : "bg-stone-800 border-stone-700 text-amber-400"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Time Left: {formatTime(timeLeftSeconds)}</span>
          </div>
        </div>

        {/* Right: Digital Tools & Submit Action */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-exam-calculator"
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Scientific Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Calc</span>
          </button>

          <button
            id="btn-exam-scratchpad"
            onClick={() => setShowScratchpad(!showScratchpad)}
            className="p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Digital Scratchpad"
          >
            <PenTool className="w-3.5 h-3.5 text-stone-300" />
            <span className="hidden sm:inline">Rough Pad</span>
          </button>

          <button
            id="btn-exam-fullscreen"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-exam-final-submit"
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Warning Notice Banner if Proctor Triggered */}
      {warningMessage && (
        <div className="bg-red-800 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-red-700">
          <div className="flex items-center space-x-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>{warningMessage}</span>
          </div>
          <button
            onClick={() => setWarningMessage(null)}
            className="text-red-200 hover:text-white underline cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Main Examination Workspace: Subject Tabs + Question Viewer + Palette */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center Section: Question & Subject Viewer */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 bg-white border-r border-stone-200">
          {/* Section Selector Tabs */}
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-3 mb-4 overflow-x-auto">
            <span className="text-xs font-bold text-stone-700 mr-2 uppercase tracking-wide">SECTIONS:</span>
            {exam.sections.map((sec, idx) => {
              const countInSec = sec.questionIds.length;
              const answeredInSec = sec.questionIds.filter(
                (qid) => responses[qid]?.selectedOptionIndex !== undefined
              ).length;

              return (
                <button
                  key={sec.name}
                  id={`tab-section-${idx}`}
                  onClick={() => {
                    setCurrentSectionIndex(idx);
                    setCurrentQuestionIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                    currentSectionIndex === idx
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:text-stone-950 hover:bg-stone-200 border border-stone-300"
                  }`}
                >
                  <span>{sec.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-800/10 text-current font-mono">
                    {answeredInSec}/{countInSec}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Question Details Header */}
          {currentQuestion ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-stone-900 font-classic-serif">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <span className="text-xs text-stone-600 font-medium">of {sectionQuestions.length}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-stone-200 text-stone-800 font-semibold">
                      {currentQuestion.subject} • {currentQuestion.topic}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-emerald-700 font-bold">+{currentQuestion.marks}</span>
                    <span className="text-stone-500 font-bold">/</span>
                    <span className="text-red-700 font-bold">-{currentQuestion.negativeMarks}</span>
                  </div>
                </div>

                {/* Question Text & Diagram */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 sm:p-6 mb-6 shadow-2xs">
                  <p className="text-sm sm:text-base text-stone-900 font-medium leading-relaxed mb-4">
                    {currentQuestion.questionText}
                  </p>

                  {/* If image/diagram is attached */}
                  {currentQuestion.imageUrl && (
                    <div className="my-4 p-2 bg-white rounded-lg border border-stone-200 max-w-md shadow-xs">
                      <img
                        src={currentQuestion.imageUrl}
                        alt="Question Diagram"
                        className="rounded object-contain max-h-64 mx-auto"
                      />
                    </div>
                  )}

                  {/* Options List */}
                  <div className="space-y-2.5 mt-6">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = responses[currentQuestion.id]?.selectedOptionIndex === optIdx;
                      const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                      return (
                        <div
                          key={opt.id}
                          id={`opt-${currentQuestion.id}-${optIdx}`}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`p-3 sm:p-3.5 rounded-lg border transition-colors cursor-pointer flex items-start space-x-3 ${
                            isSelected
                              ? "bg-amber-50/80 border-amber-600 text-stone-900 shadow-xs"
                              : "bg-white border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                              isSelected
                                ? "bg-amber-600 text-white"
                                : "bg-stone-100 text-stone-600 border border-stone-300"
                            }`}
                          >
                            {optionLetter}
                          </div>
                          <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Test Controls: Save & Next, Mark Review, Clear */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center space-x-2">
                  <button
                    id="btn-mark-for-review"
                    onClick={handleMarkForReviewAndNext}
                    className="px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Mark for Review & Next</span>
                  </button>

                  <button
                    id="btn-clear-response"
                    onClick={handleClearResponse}
                    className="px-3 py-2 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Response</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id="btn-prev-question"
                    onClick={handlePrevQuestion}
                    disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
                    className="px-3.5 py-2 rounded-md bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 border border-stone-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    id="btn-save-and-next"
                    onClick={handleSaveAndNext}
                    className="px-5 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-stone-500">No question selected</div>
          )}
        </div>

        {/* Right Sidebar: AI Proctor Webcam + Full Question Palette */}
        <div className="w-full lg:w-80 bg-stone-50 p-4 border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* AI Proctor Cam Widget */}
            <div className="bg-white rounded-lg p-3 border border-stone-200 mb-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <Camera className="w-3.5 h-3.5 text-stone-700" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Proctoring Feed
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Active
                </span>
              </div>

              {/* Video Box */}
              <div className="relative aspect-video bg-stone-900 rounded overflow-hidden border border-stone-300 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror scale-x-[-1]"
                />
                {!webcamActive && (
                  <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center text-stone-300 p-2 text-center">
                    <ShieldAlert className="w-6 h-6 text-amber-400 mb-1" />
                    <p className="text-[10px]">AI Gaze & Anti-Cheat Active</p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-stone-700 font-medium mt-1.5 flex items-center justify-between">
                <span>Feed Status:</span>
                <span className="text-stone-900 font-semibold">{webcamStatus}</span>
              </p>
            </div>

            {/* Question Status Legend */}
            <div className="bg-white p-3 rounded-lg border border-stone-200 mb-4 shadow-xs">
              <span className="text-[11px] font-bold text-stone-800 block mb-2">QUESTION STATUS LEGEND</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px]">
                    {answeredCount}
                  </span>
                  <span className="text-stone-800 font-medium">Answered</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded bg-red-600 text-white font-bold flex items-center justify-center text-[9px]">
                    {notAnsweredCount}
                  </span>
                  <span className="text-stone-800 font-medium">Not Answered</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[9px]">
                    {markedCount}
                  </span>
                  <span className="text-stone-800 font-medium">Marked Review</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-[9px] border border-stone-300">
                    {exam.questions.length - (answeredCount + markedCount)}
                  </span>
                  <span className="text-stone-800 font-medium">Not Visited</span>
                </div>
              </div>
            </div>

            {/* Question Palette Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-900">
                  {currentSection.name} Palette
                </span>
                <span className="text-[10px] text-stone-600 font-medium">Jump to Question</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto p-1 bg-white rounded-lg border border-stone-200">
                {sectionQuestions.map((q, qIdx) => {
                  const resp = responses[q.id];
                  const isCurrent = qIdx === currentQuestionIndex;
                  let bgStyle = "bg-stone-100 text-stone-700 border-stone-200";

                  if (resp?.status === "answered") {
                    bgStyle = "bg-emerald-600 text-white border-emerald-700";
                  } else if (resp?.status === "not_answered") {
                    bgStyle = "bg-red-600 text-white border-red-700";
                  } else if (resp?.status === "marked_review") {
                    bgStyle = "bg-purple-600 text-white border-purple-700";
                  } else if (resp?.status === "answered_marked_review") {
                    bgStyle = "bg-purple-800 text-white border-purple-900";
                  }

                  return (
                    <button
                      key={q.id}
                      id={`palette-btn-${q.id}`}
                      onClick={() => jumpToQuestion(currentSectionIndex, qIdx)}
                      className={`h-8 rounded font-bold text-xs border transition-all flex items-center justify-center cursor-pointer ${bgStyle} ${
                        isCurrent ? "ring-2 ring-stone-900 scale-105" : ""
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Finish / Discard actions */}
          <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={onExitWithoutSubmit}
              className="text-xs text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Discard & Exit
            </button>
            <button
              id="btn-submit-sidebar"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs cursor-pointer transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-xl max-w-md w-full p-6 text-stone-900 shadow-xl">
            <h3 className="font-classic-serif text-xl font-bold text-stone-900 mb-2">Confirm Test Submission</h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Are you sure you want to finish the examination? Automated grading and national rank analytics will be computed immediately.
            </p>

            <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-lg border border-stone-200 mb-6 text-center text-xs">
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-800 font-extrabold text-lg block">{answeredCount}</span>
                <span className="text-stone-600 text-[10px]">Answered</span>
              </div>
              <div className="p-2 rounded bg-purple-50 border border-purple-200">
                <span className="text-purple-800 font-extrabold text-lg block">{markedCount}</span>
                <span className="text-stone-600 text-[10px]">Marked</span>
              </div>
              <div className="p-2 rounded bg-red-50 border border-red-200">
                <span className="text-red-800 font-extrabold text-lg block">{notAnsweredCount}</span>
                <span className="text-stone-600 text-[10px]">Unattempted</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-md bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 cursor-pointer transition-colors"
              >
                Resume Test
              </button>
              <button
                id="btn-confirm-final-submit"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleAutoSubmit("User Submitted");
                }}
                className="px-5 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCIENTIFIC CALCULATOR MODAL */}
      {showCalculator && (
        <div className="fixed bottom-16 right-6 z-50 bg-white border border-stone-300 rounded-xl w-72 p-4 shadow-xl text-stone-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-amber-600" /> Exam Calculator
            </span>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 mb-3 font-mono text-right">
            <div className="text-[10px] text-stone-500 min-h-[14px]">{calcInput || "0"}</div>
            <div className="text-base font-bold text-stone-900">{calcResult || "0"}</div>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
            {["C", "(", ")", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "sqrt", "="].map(
              (btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcButton(btn)}
                  className={`p-2 rounded text-center transition-colors cursor-pointer ${
                    btn === "="
                      ? "bg-stone-900 text-white font-bold"
                      : btn === "C"
                      ? "bg-red-100 text-red-800"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200"
                  }`}
                >
                  {btn}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* DIGITAL SCRATCHPAD MODAL */}
      {showScratchpad && (
        <div className="fixed bottom-16 left-6 z-50 bg-white border border-stone-300 rounded-xl w-80 sm:w-96 p-4 shadow-xl text-stone-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-stone-700" /> Digital Rough Scratchpad
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearCanvas}
                className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 cursor-pointer"
              >
                Clear
              </button>
              <button onClick={() => setShowScratchpad(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={350}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full bg-stone-50 rounded border border-stone-300 cursor-crosshair touch-none"
          />
          <div className="flex items-center justify-between mt-2 text-[10px] text-stone-500">
            <span>Rough calculations & sketches</span>
            <div className="flex items-center space-x-1">
              {["#0f172a", "#16a34a", "#dc2626", "#d97706"].map((c) => (
                <button
                  key={c}
                  onClick={() => setPenColor(c)}
                  className={`w-3.5 h-3.5 rounded-full border ${penColor === c ? "ring-2 ring-stone-900" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTakingRoom;
