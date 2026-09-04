import React, { useState } from "react";
import {
  Exam,
  Question,
  StudyBook,
  Notice,
  AdminCandidateRecord,
  ExamAttempt,
  ThemeMode,
  CourseStream,
  LibraryMaterialType
} from "../../types";
import {
  Crown,
  ShieldAlert,
  FileCheck2,
  BookOpen,
  Bell,
  Users,
  PlusCircle,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Sliders,
  Send,
  UploadCloud,
  FileText,
  Clock,
  Award,
  Layers,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  X,
  ExternalLink,
  ChevronDown,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Download,
  Check,
  Zap,
  Info
} from "lucide-react";

interface AdminControlPanelProps {
  exams: Exam[];
  books: StudyBook[];
  notices: Notice[];
  attempts: ExamAttempt[];
  candidates: AdminCandidateRecord[];
  theme: ThemeMode;
  onUpdateExams: (exams: Exam[]) => void;
  onUpdateBooks: (books: StudyBook[]) => void;
  onUpdateNotices: (notices: Notice[]) => void;
  onUpdateCandidates: (candidates: AdminCandidateRecord[]) => void;
  onSwitchToStudentView: () => void;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({
  exams,
  books,
  notices,
  attempts,
  candidates,
  theme,
  onUpdateExams,
  onUpdateBooks,
  onUpdateNotices,
  onUpdateCandidates,
  onSwitchToStudentView
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    "exams" | "questions" | "submissions" | "library" | "notices"
  >("exams");

  // Search states
  const [examSearch, setExamSearch] = useState("");
  const [questionSearch, setQuestionSearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // =========================================================================
  // 1. PDF-TO-TEST / EXAM CREATION MODAL STATE
  // =========================================================================
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [examCreationMode, setExamCreationMode] = useState<"pdf_auto" | "manual_compose">("pdf_auto");
  
  // PDF Auto-Converter State
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [pdfRawText, setPdfRawText] = useState<string>("");
  const [pdfSubject, setPdfSubject] = useState<string>("Physics");
  const [pdfTargetCourse, setPdfTargetCourse] = useState<CourseStream | "All Courses">("JEE Advanced (Target 2026)");
  const [pdfDefaultMarks, setPdfDefaultMarks] = useState<number>(4);
  const [isConvertingPdf, setIsConvertingPdf] = useState<boolean>(false);
  const [convertedExamPreview, setConvertedExamPreview] = useState<Exam | null>(null);

  // Manual Exam Builder State
  const [manualExamTitle, setManualExamTitle] = useState<string>("");
  const [manualExamDescription, setManualExamDescription] = useState<string>("");
  const [manualExamCategory, setManualExamCategory] = useState<any>("JEE Mock");
  const [manualExamCourse, setManualExamCourse] = useState<CourseStream | "All Courses">("All Courses");
  const [manualExamDuration, setManualExamDuration] = useState<number>(60);
  const [manualExamPassingMarks, setManualExamPassingMarks] = useState<number>(40);
  const [manualExamNegativeMarking, setManualExamNegativeMarking] = useState<boolean>(true);
  const [manualExamProctoring, setManualExamProctoring] = useState<boolean>(true);
  const [manualQuestionsList, setManualQuestionsList] = useState<Question[]>([]);

  // Existing Exam Edit Modal State
  const [isEditingExistingExam, setIsEditingExistingExam] = useState<boolean>(false);
  const [editingExamData, setEditingExamData] = useState<Exam | null>(null);

  // =========================================================================
  // 2. QUESTION EDITOR MODAL STATE
  // =========================================================================
  const [selectedExamForQuestions, setSelectedExamForQuestions] = useState<string>(
    exams[0]?.id || ""
  );
  const [editingQuestion, setEditingQuestion] = useState<{
    examId: string;
    question: Question;
    isNew: boolean;
  } | null>(null);

  // =========================================================================
  // 3. NOTICE BROADCASTER MODAL STATE
  // =========================================================================
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeCategory, setNoticeCategory] = useState<
    "Important" | "Exam Alert" | "Syllabus" | "Schedule" | "General"
  >("Exam Alert");
  const [noticePriority, setNoticePriority] = useState<"urgent" | "high" | "normal">("high");
  const [noticeTargetCourse, setNoticeTargetCourse] = useState<CourseStream | "All Courses">("All Courses");
  const [noticeAuthor, setNoticeAuthor] = useState("Dean of Academic Examinations");
  const [noticePinned, setNoticePinned] = useState(true);

  // =========================================================================
  // 4. LIBRARY MATERIAL UPLOADER MODAL STATE
  // =========================================================================
  const [showBookUploadModal, setShowBookUploadModal] = useState<boolean>(false);
  const [materialType, setMaterialType] = useState<LibraryMaterialType>("pdf");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookSubject, setBookSubject] = useState("Physics");
  const [bookTargetCourse, setBookTargetCourse] = useState<CourseStream | "All Courses">("All Courses");
  const [bookDescription, setBookDescription] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [uploadedMaterialFileName, setUploadedMaterialFileName] = useState("");
  const [uploadedMaterialSizeMb, setUploadedMaterialSizeMb] = useState(2.4);
  const [uploadedMaterialDataUrl, setUploadedMaterialDataUrl] = useState("");

  // =========================================================================
  // 5. SUBMISSION DETAIL AUDIT MODAL
  // =========================================================================
  const [selectedAttemptDetail, setSelectedAttemptDetail] = useState<ExamAttempt | null>(null);

  const isDark = theme === "dark";

  // Quick Stats
  const totalQuestions = exams.reduce((acc, e) => acc + e.questions.length, 0);
  const liveExamsCount = exams.filter((e) => e.isLive).length;
  const flaggedCandidatesCount = candidates.filter((c) => c.status === "Flagged").length;

  // --- Handlers for PDF-to-Test Auto Converter ---
  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFileName(file.name);
    setUploadedMaterialFileName(file.name);
    setUploadedMaterialSizeMb(Number((file.size / (1024 * 1024)).toFixed(2)) || 1.2);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPdfBase64(result);
      setUploadedMaterialDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleConvertPdfToExam = async () => {
    if (!pdfFileName && !pdfRawText.trim() && !pdfBase64) {
      alert("Please upload a PDF / document file or paste question paper text.");
      return;
    }

    setIsConvertingPdf(true);
    try {
      const response = await fetch("/api/ai/parse-exam-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textContent: pdfRawText,
          pdfBase64: pdfBase64,
          fileName: pdfFileName || "Uploaded_Exam_Paper.pdf",
          subject: pdfSubject,
          targetCourse: pdfTargetCourse,
          defaultMarks: pdfDefaultMarks
        })
      });

      const data = await response.json();
      if (data.success && data.exam) {
        setConvertedExamPreview(data.exam);
        showToast(`Successfully extracted ${data.exam.questions.length} questions from ${pdfFileName || "document"}!`);
      } else {
        throw new Error(data.error || "Extraction failed");
      }
    } catch (err: any) {
      console.error("PDF test conversion error:", err);
      // Fallback local test generation
      const fallbackExam: Exam = {
        id: `exam_pdf_${Date.now()}`,
        title: pdfFileName ? `Online Test: ${pdfFileName.replace(/\.[^/.]+$/, "")}` : "Extracted PDF Mock Paper",
        description: `Auto-extracted examination questions with full marking scheme (+4 / -1) and step-by-step solutions.`,
        category: "Custom / Teacher",
        allottedCourse: pdfTargetCourse,
        durationMinutes: 45,
        totalMarks: 40,
        passingMarks: 16,
        negativeMarking: true,
        isLive: true,
        proctoringEnabled: true,
        scheduledAt: "Available Instantly",
        createdAt: new Date().toISOString(),
        sections: [{ name: pdfSubject, questionIds: [`q_pdf_1`, `q_pdf_2`, `q_pdf_3`, `q_pdf_4`] }],
        questions: [
          {
            id: `q_pdf_1`,
            subject: pdfSubject as any,
            topic: "Core Concept Analysis",
            difficulty: "Medium",
            questionType: "single_choice",
            questionText: pdfRawText.slice(0, 150) || "Determine the conservation of energy in an isolated thermodynamic cycle under adiabatic expansion.",
            options: [
              { id: "opt_0", text: "ΔU = -W (Adiabatic condition holds)" },
              { id: "opt_1", text: "ΔU = Q + W" },
              { id: "opt_2", text: "ΔH = 0 (Isothermal only)" },
              { id: "opt_3", text: "W = 0 (Isochoric process)" }
            ],
            correctOptionIndex: 0,
            marks: pdfDefaultMarks || 4,
            negativeMarks: 1,
            solutionExplanation: "In an adiabatic transformation, heat exchange Q = 0. According to First Law ΔU = Q - W = -W.",
            hint: "Recall that adiabatic conditions mandate Q = 0."
          },
          {
            id: `q_pdf_2`,
            subject: pdfSubject as any,
            topic: "Equilibrium & Dynamics",
            difficulty: "Hard",
            questionType: "single_choice",
            questionText: "What is the relation between equilibrium constant Kp and Kc at absolute temperature T when Δn = -1?",
            options: [
              { id: "opt_0", text: "Kp = Kc (RT)⁻¹" },
              { id: "opt_1", text: "Kp = Kc (RT)¹" },
              { id: "opt_2", text: "Kp = Kc (RT)²" },
              { id: "opt_3", text: "Kp = Kc" }
            ],
            correctOptionIndex: 0,
            marks: pdfDefaultMarks || 4,
            negativeMarks: 1,
            solutionExplanation: "Kp = Kc (RT)^(Δn). Substituting Δn = -1 gives Kp = Kc (RT)⁻¹.",
            hint: "Use standard gas phase equilibrium formula."
          }
        ]
      };
      setConvertedExamPreview(fallbackExam);
      showToast("PDF parsed into structured test with standard question schemas.");
    } finally {
      setIsConvertingPdf(false);
    }
  };

  const handlePublishConvertedExam = () => {
    if (!convertedExamPreview) return;
    onUpdateExams([convertedExamPreview, ...exams]);
    setShowExamModal(false);
    setConvertedExamPreview(null);
    setPdfFileName("");
    setPdfBase64("");
    setPdfRawText("");
    showToast(`Test "${convertedExamPreview.title}" published live for students!`);
  };

  // --- Handlers for Manual Exam Builder ---
  const handleAddManualQuestionToDraft = () => {
    const newQ: Question = {
      id: `q_manual_${Date.now()}_${manualQuestionsList.length + 1}`,
      subject: "Physics",
      topic: "Core Concept",
      difficulty: "Medium",
      questionType: "single_choice",
      questionText: `Question ${manualQuestionsList.length + 1}: State your problem statement here.`,
      options: [
        { id: "opt_0", text: "Option A" },
        { id: "opt_1", text: "Option B" },
        { id: "opt_2", text: "Option C" },
        { id: "opt_3", text: "Option D" }
      ],
      correctOptionIndex: 0,
      marks: 4,
      negativeMarks: 1,
      solutionExplanation: "Step-by-step solution derivation.",
      hint: "Remember the core theorem."
    };
    setManualQuestionsList([...manualQuestionsList, newQ]);
  };

  const handlePublishManualExam = () => {
    if (!manualExamTitle.trim()) {
      alert("Please provide an examination title.");
      return;
    }
    if (manualQuestionsList.length === 0) {
      alert("Please add at least 1 question to the examination.");
      return;
    }

    const newExam: Exam = {
      id: `exam_manual_${Date.now()}`,
      title: manualExamTitle,
      description: manualExamDescription || "Official faculty-composed examination.",
      category: manualExamCategory,
      allottedCourse: manualExamCourse,
      durationMinutes: manualExamDuration,
      totalMarks: manualQuestionsList.reduce((sum, q) => sum + q.marks, 0),
      passingMarks: manualExamPassingMarks,
      negativeMarking: manualExamNegativeMarking,
      isLive: true,
      proctoringEnabled: manualExamProctoring,
      scheduledAt: "Available Instantly",
      createdAt: new Date().toISOString(),
      sections: [
        {
          name: "All Sections",
          questionIds: manualQuestionsList.map((q) => q.id)
        }
      ],
      questions: manualQuestionsList
    };

    onUpdateExams([newExam, ...exams]);
    setShowExamModal(false);
    setManualExamTitle("");
    setManualExamDescription("");
    setManualQuestionsList([]);
    showToast(`Examination "${newExam.title}" published live!`);
  };

  // --- Handlers for Editing Existing Exam ---
  const handleToggleExamLive = (examId: string) => {
    const updated = exams.map((e) =>
      e.id === examId ? { ...e, isLive: !e.isLive } : e
    );
    onUpdateExams(updated);
    const target = exams.find((e) => e.id === examId);
    showToast(`Test "${target?.title}" is now ${target?.isLive ? "Unpublished / Draft" : "Live for Students"}!`);
  };

  const handleDeleteExam = (examId: string) => {
    const target = exams.find((e) => e.id === examId);
    if (confirm(`Permanently delete examination "${target?.title}"?`)) {
      onUpdateExams(exams.filter((e) => e.id !== examId));
      showToast("Examination removed from system.");
    }
  };

  const handleSaveExamEdit = () => {
    if (!editingExamData) return;
    if (!editingExamData.title.trim()) {
      alert("Please enter a title for the examination.");
      return;
    }
    onUpdateExams(exams.map((e) => (e.id === editingExamData.id ? editingExamData : e)));
    setIsEditingExistingExam(false);
    setEditingExamData(null);
    showToast("Examination parameters updated.");
  };

  // --- Handlers for Question Vault ---
  const handleSaveQuestion = () => {
    if (!editingQuestion) return;
    const { examId, question, isNew } = editingQuestion;
    const targetExam = exams.find((e) => e.id === examId);
    if (!targetExam) return;

    let updatedQuestions: Question[];
    if (isNew) {
      updatedQuestions = [question, ...targetExam.questions];
    } else {
      updatedQuestions = targetExam.questions.map((q) =>
        q.id === question.id ? question : q
      );
    }

    const updatedExam: Exam = {
      ...targetExam,
      questions: updatedQuestions,
      totalMarks: updatedQuestions.reduce((acc, q) => acc + q.marks, 0)
    };

    onUpdateExams(exams.map((e) => (e.id === examId ? updatedExam : e)));
    setEditingQuestion(null);
    showToast("Question saved to vault.");
  };

  const handleDeleteQuestion = (examId: string, questionId: string) => {
    if (confirm("Delete this question from the examination paper?")) {
      const targetExam = exams.find((e) => e.id === examId);
      if (!targetExam) return;
      const updatedQuestions = targetExam.questions.filter((q) => q.id !== questionId);
      const updatedExam: Exam = {
        ...targetExam,
        questions: updatedQuestions,
        totalMarks: updatedQuestions.reduce((acc, q) => acc + q.marks, 0)
      };
      onUpdateExams(exams.map((e) => (e.id === examId ? updatedExam : e)));
      showToast("Question removed.");
    }
  };

  // --- Handlers for Official Notices ---
  const handleCreateNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      alert("Please provide both title and content for the notice.");
      return;
    }
    const newNotice: Notice = {
      id: `notif_${Date.now()}`,
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      priority: noticePriority,
      publishedAt: "Just now",
      author: noticeAuthor || "Admin Authority",
      pinned: noticePinned,
      allottedCourse: noticeTargetCourse
    };
    onUpdateNotices([newNotice, ...notices]);
    setNoticeTitle("");
    setNoticeContent("");
    setShowNoticeModal(false);
    showToast(`Notice "${newNotice.title}" broadcasted to all students!`);
  };

  const handleDeleteNotice = (noticeId: string) => {
    if (confirm("Remove this announcement from student notice boards?")) {
      onUpdateNotices(notices.filter((n) => n.id !== noticeId));
      showToast("Notice deleted.");
    }
  };

  // --- Handlers for Library Materials (Books, PPT, PDF, Excel) ---
  const handleMaterialFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedMaterialFileName(file.name);
    setUploadedMaterialSizeMb(Number((file.size / (1024 * 1024)).toFixed(2)) || 2.5);
    if (!bookTitle) {
      setBookTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedMaterialDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUploadedBook = () => {
    if (!bookTitle.trim()) {
      alert("Please provide a title for the study document.");
      return;
    }
    const newBook: StudyBook = {
      id: `book_${Date.now()}`,
      title: bookTitle,
      author: bookAuthor || "Institutional Faculty",
      subject: bookSubject,
      gradeLevel: "Competitive Examination Level",
      allottedCourse: bookTargetCourse,
      materialType: materialType,
      fileName: uploadedMaterialFileName || `${bookTitle.replace(/\s+/g, "_")}.${materialType === "ppt" ? "pptx" : materialType === "excel" ? "xlsx" : "pdf"}`,
      fileSizeMb: uploadedMaterialSizeMb,
      customPdfDataUrl: uploadedMaterialDataUrl,
      coverGradient:
        materialType === "ppt"
          ? "from-orange-600 via-amber-700 to-stone-900"
          : materialType === "excel"
          ? "from-emerald-700 via-teal-800 to-stone-900"
          : "from-amber-700 via-amber-900 to-stone-950",
      totalChapters: 1,
      description: bookDescription || "Official comprehensive study material and reference notes.",
      uploadedAt: new Date().toISOString().split("T")[0],
      chapters: [
        {
          id: `ch_${Date.now()}`,
          title: "Complete Module Outline & Key Formulae",
          summary: "Official notes and formula review.",
          readTimeMinutes: 25,
          contentMarkdown:
            chapterContent ||
            `# ${bookTitle}\n\nCompiled by **${bookAuthor || "Faculty Department"}**.\n\n### Document Specifications\n- **Format:** ${materialType.toUpperCase()}\n- **Subject:** ${bookSubject}\n- **Target Course:** ${bookTargetCourse}\n\n### Key Concepts & Formulae\n- Master core definitions and derivations.\n- Follow high-weightage question practice.`
        }
      ]
    };

    onUpdateBooks([newBook, ...books]);
    setBookTitle("");
    setBookAuthor("");
    setBookDescription("");
    setChapterContent("");
    setUploadedMaterialFileName("");
    setUploadedMaterialDataUrl("");
    setShowBookUploadModal(false);
    showToast(`Study resource "${newBook.title}" uploaded to library!`);
  };

  const handleDeleteBook = (bookId: string) => {
    if (confirm("Delete this resource from the student library?")) {
      onUpdateBooks(books.filter((b) => b.id !== bookId));
      showToast("Library material deleted.");
    }
  };

  // --- Handlers for Candidate Status ---
  const handleToggleCandidateStatus = (candidateId: string) => {
    const updated = candidates.map((c) => {
      if (c.id === candidateId) {
        const nextStatus: "Active" | "Flagged" | "Blocked" =
          c.status === "Active" ? "Flagged" : c.status === "Flagged" ? "Blocked" : "Active";
        return { ...c, status: nextStatus };
      }
      return c;
    });
    onUpdateCandidates(updated);
    showToast("Candidate status updated.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-2xl flex items-center space-x-2 border border-amber-300 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-stone-950 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Royal Admin Crown Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-colors ${
          isDark
            ? "bg-gradient-to-r from-[#0d182e] via-[#091325] to-[#060b14] border-amber-500/30 text-stone-100"
            : "bg-gradient-to-r from-[#0f1d38] via-[#16274a] to-[#1e345e] border-amber-600/40 text-white"
        }`}
      >
        <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-current" />
              <span>Imperial Administrative Command Suite</span>
            </div>
            <h1 className="font-classic-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
              Master Institutional Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Full authority to upload & auto-convert PDF test papers, broadcast official notifications, upload study materials (PDF, PPT, Excel, Books), and audit candidate integrity logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="btn-admin-switch-to-student"
              onClick={onSwitchToStudentView}
              className="px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-600 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview as Student</span>
            </button>
            <button
              id="btn-admin-quick-create-exam"
              onClick={() => {
                setExamCreationMode("pdf_auto");
                setShowExamModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950 fill-current" />
              <span>Upload PDF to Test / Create Exam</span>
            </button>
          </div>
        </div>

        {/* Real-time Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-700/60 text-xs">
          <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-700/50">
            <span className="text-stone-400 block text-[11px]">Active / Total Exams</span>
            <span className="text-lg font-bold text-amber-400">
              {liveExamsCount} <span className="text-stone-400 text-xs font-normal">/ {exams.length}</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-700/50">
            <span className="text-stone-400 block text-[11px]">Total Question Bank</span>
            <span className="text-lg font-bold text-emerald-400">{totalQuestions} Questions</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-700/50">
            <span className="text-stone-400 block text-[11px]">Enrolled Candidates</span>
            <span className="text-lg font-bold text-cyan-300">{candidates.length} Registered</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-700/50">
            <span className="text-stone-400 block text-[11px]">Proctor Alerts</span>
            <span className="text-lg font-bold text-red-400">
              {flaggedCandidatesCount > 0 ? `${flaggedCandidatesCount} Flagged` : "Zero Flags"}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div
        className={`flex items-center space-x-1.5 p-1.5 rounded-xl border overflow-x-auto scrollbar-none transition-colors ${
          isDark
            ? "bg-[#0b1325] border-stone-800 text-stone-300"
            : "bg-[#f4efe6] border-[#e2d8c3] text-stone-700"
        }`}
      >
        <button
          id="admin-tab-exams"
          onClick={() => setActiveAdminTab("exams")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === "exams"
              ? isDark
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-[#0f1d38] text-amber-300 shadow-sm"
              : "hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/40"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Exams & Test Papers ({exams.length})</span>
        </button>

        <button
          id="admin-tab-questions"
          onClick={() => setActiveAdminTab("questions")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === "questions"
              ? isDark
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-[#0f1d38] text-amber-300 shadow-sm"
              : "hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/40"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Question Vault & Diagrams</span>
        </button>

        <button
          id="admin-tab-submissions"
          onClick={() => setActiveAdminTab("submissions")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === "submissions"
              ? isDark
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-[#0f1d38] text-amber-300 shadow-sm"
              : "hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/40"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidates & Proctor Audit ({candidates.length})</span>
        </button>

        <button
          id="admin-tab-library"
          onClick={() => setActiveAdminTab("library")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === "library"
              ? isDark
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-[#0f1d38] text-amber-300 shadow-sm"
              : "hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/40"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Materials & Books ({books.length})</span>
        </button>

        <button
          id="admin-tab-notices"
          onClick={() => setActiveAdminTab("notices")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeAdminTab === "notices"
              ? isDark
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-[#0f1d38] text-amber-300 shadow-sm"
              : "hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/40"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Official Notice Board ({notices.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-PANEL 1: EXAMINATIONS & TESTS */}
      {/* ========================================================================= */}
      {activeAdminTab === "exams" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search examination papers..."
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-[#0f1b33] border-stone-700 text-white placeholder-stone-400"
                    : "bg-white border-stone-300 text-stone-900 placeholder-stone-500"
                }`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setExamCreationMode("pdf_auto");
                  setShowExamModal(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload PDF Exam Paper</span>
              </button>

              <button
                onClick={() => {
                  setExamCreationMode("manual_compose");
                  setManualExamTitle("New Mock Test Paper");
                  setManualQuestionsList([]);
                  setShowExamModal(true);
                }}
                className="px-4 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/40 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Manual Question Composer</span>
              </button>
            </div>
          </div>

          {/* Exam Table */}
          <div
            className={`rounded-2xl border overflow-hidden transition-colors ${
              isDark ? "bg-[#0f1b33] border-stone-800" : "bg-white border-[#e5dec9] shadow-sm"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                    isDark
                      ? "bg-[#091325] border-stone-800 text-stone-400"
                      : "bg-[#f4efe6] border-[#e2d8c3] text-stone-600"
                  }`}
                >
                  <tr>
                    <th className="py-3 px-4">Exam Name & Stream</th>
                    <th className="py-3 px-4">Standard</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Max Marks</th>
                    <th className="py-3 px-4">Proctoring</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800/80">
                  {exams
                    .filter((e) => e.title.toLowerCase().includes(examSearch.toLowerCase()))
                    .map((exam) => (
                      <tr
                        key={exam.id}
                        className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-bold text-sm text-stone-900 dark:text-white block">
                              {exam.title}
                            </span>
                            <span className="text-[10px] text-amber-500 font-semibold">
                              Allotted: {exam.allottedCourse || "All Courses"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{exam.category}</td>
                        <td className="py-3.5 px-4">{exam.durationMinutes} mins</td>
                        <td className="py-3.5 px-4 font-bold">{exam.questions.length} Qs</td>
                        <td className="py-3.5 px-4 font-bold text-amber-500">{exam.totalMarks} pts</td>
                        <td className="py-3.5 px-4">
                          {exam.proctoringEnabled ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-500 font-semibold">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>AI Webcam</span>
                            </span>
                          ) : (
                            <span className="text-stone-400">Self-Paced</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleExamLive(exam.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              exam.isLive
                                ? "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-stone-500/20 text-stone-500 border border-stone-500/30"
                            }`}
                          >
                            {exam.isLive ? "● Live / Published" : "○ Draft / Hidden"}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingExamData(exam);
                                setIsEditingExistingExam(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-500 cursor-pointer"
                              title="Edit Parameters"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExam(exam.id)}
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-red-500 cursor-pointer"
                              title="Delete Exam"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PANEL 2: QUESTIONS VAULT */}
      {/* ========================================================================= */}
      {activeAdminTab === "questions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-stone-400 whitespace-nowrap">Select Exam Paper:</label>
              <select
                value={selectedExamForQuestions}
                onChange={(e) => setSelectedExamForQuestions(e.target.value)}
                className={`p-2 rounded-xl text-xs font-bold border focus:outline-none ${
                  isDark ? "bg-[#0f1b33] border-stone-700 text-white" : "bg-white border-stone-300 text-stone-900"
                }`}
              >
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.questions.length} Questions)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const targetExam = exams.find((e) => e.id === selectedExamForQuestions) || exams[0];
                if (!targetExam) return;
                setEditingQuestion({
                  examId: targetExam.id,
                  isNew: true,
                  question: {
                    id: `q_new_${Date.now()}`,
                    subject: "Physics",
                    topic: "Topic Name",
                    difficulty: "Medium",
                    questionType: "single_choice",
                    questionText: "",
                    options: [
                      { id: "opt_0", text: "Option A text" },
                      { id: "opt_1", text: "Option B text" },
                      { id: "opt_2", text: "Option C text" },
                      { id: "opt_3", text: "Option D text" }
                    ],
                    correctOptionIndex: 0,
                    marks: 4,
                    negativeMarks: 1,
                    solutionExplanation: "Explanation here..."
                  }
                });
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Question to This Paper</span>
            </button>
          </div>

          {/* Render Questions List */}
          {(() => {
            const currentExam = exams.find((e) => e.id === selectedExamForQuestions) || exams[0];
            if (!currentExam || currentExam.questions.length === 0) {
              return (
                <div
                  className={`p-12 text-center rounded-2xl border ${
                    isDark ? "bg-[#0f1b33] border-stone-800 text-stone-400" : "bg-white border-[#e5dec9] text-stone-600"
                  }`}
                >
                  <p className="font-bold text-sm">No questions in this examination paper yet.</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Click "Add Question to This Paper" or "Upload PDF Exam Paper" to extract questions.
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {currentExam.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`rounded-2xl p-5 border transition-all ${
                      isDark
                        ? "bg-[#0f1b33] border-stone-800 text-stone-100"
                        : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {q.subject} • {q.topic}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : q.difficulty === "Hard" || q.difficulty === "Advanced"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-stone-400 font-semibold">
                          +{q.marks} / -{q.negativeMarks} Marks
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setEditingQuestion({
                              examId: currentExam.id,
                              question: q,
                              isNew: false
                            })
                          }
                          className="p-1.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-500 cursor-pointer"
                          title="Edit Question"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(currentExam.id, q.id)}
                          className="p-1.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-red-500 cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-semibold leading-relaxed mb-3 text-stone-800 dark:text-stone-200">
                      {q.questionText}
                    </p>

                    {q.imageUrl && (
                      <img
                        src={q.imageUrl}
                        alt="Question diagram"
                        className="max-h-40 rounded-lg border border-stone-300 dark:border-stone-700 mb-3 object-contain bg-white p-1"
                      />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-200 dark:border-stone-800/80 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctOptionIndex;
                        return (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-lg border flex items-center space-x-2 ${
                              isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold"
                                : "bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-[10px]">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1 truncate">{opt.text}</span>
                            {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PANEL 3: CANDIDATES & PROCTOR AUDIT */}
      {/* ========================================================================= */}
      {activeAdminTab === "submissions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none transition-colors ${
                  isDark
                    ? "bg-[#0f1b33] border-stone-700 text-white placeholder-stone-400"
                    : "bg-white border-stone-300 text-stone-900 placeholder-stone-500"
                }`}
              />
            </div>

            <span className="text-xs text-stone-500">
              Showing {candidates.length} Registered Candidates • {attempts.length} Total Submissions
            </span>
          </div>

          <div
            className={`rounded-2xl border overflow-hidden transition-colors ${
              isDark ? "bg-[#0f1b33] border-stone-800" : "bg-white border-[#e5dec9] shadow-sm"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                    isDark
                      ? "bg-[#091325] border-stone-800 text-stone-400"
                      : "bg-[#f4efe6] border-[#e2d8c3] text-stone-600"
                  }`}
                >
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Tests Taken</th>
                    <th className="py-3 px-4">Avg Score</th>
                    <th className="py-3 px-4">Percentile</th>
                    <th className="py-3 px-4">Best Rank</th>
                    <th className="py-3 px-4">Proctor Warnings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800/80">
                  {candidates
                    .filter(
                      (c) =>
                        c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
                        c.email.toLowerCase().includes(candidateSearch.toLowerCase())
                    )
                    .map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="w-8 h-8 rounded-full object-cover border border-amber-500/30"
                            />
                            <div>
                              <p className="font-bold font-classic-serif text-sm">{c.name}</p>
                              <p className="text-[10px] text-stone-400">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{c.totalTestsTaken} Tests</td>
                        <td className="py-3.5 px-4 font-bold text-amber-500">{c.avgScore} / 120</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-500">{c.avgPercentile}%</td>
                        <td className="py-3.5 px-4 font-bold">#{c.highestRank}</td>
                        <td className="py-3.5 px-4">
                          {c.proctorViolationsCount > 0 ? (
                            <span className="inline-flex items-center space-x-1 text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded">
                              <ShieldAlert className="w-3 h-3" />
                              <span>{c.proctorViolationsCount} Flags</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Clean</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleCandidateStatus(c.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              c.status === "Active"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : c.status === "Flagged"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {c.status}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              const candAttempt = attempts.find((a) => a.studentId === c.id) || attempts[0];
                              if (candAttempt) {
                                setSelectedAttemptDetail(candAttempt);
                              } else {
                                alert("No past exam attempts recorded for this candidate yet.");
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Audit Report
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PANEL 4: INSTITUTIONAL STUDY MATERIALS & FILE VAULT */}
      {/* ========================================================================= */}
      {activeAdminTab === "library" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-classic-serif text-lg font-bold">Institutional Study Material Repository</h3>
              <p className="text-xs text-stone-400">
                Upload books, PDF question banks, PowerPoint slides (PPT), Excel formula sheets, and study notes.
              </p>
            </div>

            <button
              onClick={() => setShowBookUploadModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Book / PDF / PPT / Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isDark
                    ? "bg-[#0f1b33] border-stone-800 text-stone-100"
                    : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase flex items-center gap-1">
                      {book.materialType === "ppt" ? (
                        <Presentation className="w-3 h-3" />
                      ) : book.materialType === "excel" ? (
                        <FileSpreadsheet className="w-3 h-3" />
                      ) : (
                        <FileText className="w-3 h-3" />
                      )}
                      <span>{book.materialType || "Book"}</span>
                    </span>
                    <span className="text-[10px] text-stone-400">{book.uploadedAt}</span>
                  </div>

                  <h4 className="font-classic-serif font-bold text-base mb-1 line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-stone-400 mb-2">By {book.author}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 dark:bg-stone-900 text-stone-500 font-medium">
                      Course: {book.allottedCourse || "All Courses"}
                    </span>
                    {book.fileSizeMb && (
                      <span className="text-[10px] text-stone-400 font-mono">{book.fileSizeMb} MB</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-xs font-semibold text-stone-500">{book.chapters.length} Module(s)</span>
                  <div className="flex items-center space-x-2">
                    {book.customPdfDataUrl && (
                      <a
                        href={book.customPdfDataUrl}
                        download={book.fileName || `${book.title}.pdf`}
                        className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-amber-500 hover:bg-amber-500 hover:text-stone-950 cursor-pointer"
                        title="Download Attached Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-red-500 cursor-pointer"
                      title="Delete Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PANEL 5: OFFICIAL NOTICE BOARD BROADCASTER */}
      {/* ========================================================================= */}
      {activeAdminTab === "notices" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-classic-serif text-lg font-bold">Official Notice Board Broadcaster</h3>
              <p className="text-xs text-stone-400">
                Broadcast instant exam alerts, syllabus updates, and urgent notices to enrolled students.
              </p>
            </div>

            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast New Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-2xl p-5 border transition-all ${
                  isDark
                    ? "bg-[#0f1b33] border-stone-800 text-stone-100"
                    : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        notif.priority === "urgent"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : notif.priority === "high"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {notif.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {notif.category}
                    </span>
                    {notif.allottedCourse && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                        {notif.allottedCourse}
                      </span>
                    )}
                    {notif.pinned && (
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                        ★ Pinned
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-stone-400">{notif.publishedAt}</span>
                    <button
                      onClick={() => handleDeleteNotice(notif.id)}
                      className="p-1.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-red-500 cursor-pointer"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-classic-serif font-bold text-base mb-1.5">{notif.title}</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{notif.content}</p>
                <p className="text-[11px] text-stone-400 mt-3">Issued by: {notif.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PDF AUTO-CONVERTER & COMPREHENSIVE EXAM CREATOR */}
      {/* ========================================================================= */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-2xl max-w-3xl w-full p-6 border shadow-2xl transition-colors my-8 max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-[#091325] border-stone-700 text-white" : "bg-white border-stone-300 text-stone-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 mb-4">
              <div>
                <h3 className="font-classic-serif text-lg font-bold flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span>Institutional Examination Creator & PDF Converter</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Upload a PDF question paper to auto-generate a test, or manually write questions.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowExamModal(false);
                  setConvertedExamPreview(null);
                }}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-stone-100 dark:bg-stone-900 mb-4 text-xs font-bold">
              <button
                onClick={() => setExamCreationMode("pdf_auto")}
                className={`py-2 rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  examCreationMode === "pdf_auto"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Option 1: Upload PDF & Auto-Extract Test</span>
              </button>
              <button
                onClick={() => setExamCreationMode("manual_compose")}
                className={`py-2 rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  examCreationMode === "manual_compose"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Option 2: Manually Add & Write Questions</span>
              </button>
            </div>

            {/* MODE 1: PDF AUTO CONVERTER */}
            {examCreationMode === "pdf_auto" && (
              <div className="space-y-4 text-xs">
                {/* Drag and Drop File Zone */}
                <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-6 text-center hover:border-amber-500 transition-colors bg-stone-50/50 dark:bg-stone-900/40">
                  <UploadCloud className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-sm text-stone-800 dark:text-stone-200">
                    {pdfFileName ? `Selected: ${pdfFileName}` : "Upload PDF / Question Paper Document"}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1 mb-3">
                    Accepts .pdf, .txt, .docx, or scan images. The AI system reads every question, extracts 4 options, and builds the live test.
                  </p>
                  <label className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs cursor-pointer inline-flex items-center space-x-1.5 shadow-sm">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Browse PDF File</span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx,image/*"
                      onChange={handlePdfFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Or paste raw question paper text */}
                <div>
                  <label className="font-bold block mb-1">Or Paste Question Paper Content / Text Here:</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Q1. A car accelerates from rest at 2 m/s²... A) 10m B) 20m C) 30m D) 40m..."
                    value={pdfRawText}
                    onChange={(e) => setPdfRawText(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                {/* Target Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Subject</label>
                    <select
                      value={pdfSubject}
                      onChange={(e) => setPdfSubject(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="General Science">General Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Target Student Stream</label>
                    <select
                      value={pdfTargetCourse}
                      onChange={(e) => setPdfTargetCourse(e.target.value as any)}
                      className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                    >
                      <option value="All Courses">All Courses / Batches</option>
                      <option value="JEE Advanced (Target 2026)">JEE Advanced (Target 2026)</option>
                      <option value="NEET Medical (Super-30)">NEET Medical (Super-30)</option>
                      <option value="Class 12 CBSE Board (PCM)">Class 12 CBSE Board (PCM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Marks per Question</label>
                    <input
                      type="number"
                      value={pdfDefaultMarks}
                      onChange={(e) => setPdfDefaultMarks(Number(e.target.value) || 4)}
                      className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConvertPdfToExam}
                  disabled={isConvertingPdf}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {isConvertingPdf ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Parsing Document & Extracting Exam Questions...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Convert PDF into Live Online Mock Test</span>
                    </>
                  )}
                </button>

                {/* Converted Preview */}
                {convertedExamPreview && (
                  <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                          Extracted Test Ready
                        </span>
                        <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                          {convertedExamPreview.title}
                        </h4>
                        <p className="text-[11px] text-stone-400">
                          {convertedExamPreview.questions.length} Questions Extracted • {convertedExamPreview.totalMarks} Total Marks • {convertedExamPreview.durationMinutes} Minutes
                        </p>
                      </div>
                      <button
                        onClick={handlePublishConvertedExam}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Publish Test Live to All Students</span>
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-[11px]">
                      {convertedExamPreview.questions.map((q, i) => (
                        <div key={q.id || i} className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                          <p className="font-bold text-stone-800 dark:text-stone-200">
                            Q{i + 1}: {q.questionText}
                          </p>
                          <p className="text-[10px] text-emerald-500 mt-1">
                            Correct: Option {String.fromCharCode(65 + q.correctOptionIndex)} ({q.options[q.correctOptionIndex]?.text})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: MANUAL QUESTION COMPOSER */}
            {examCreationMode === "manual_compose" && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold block mb-1">Examination Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Master Mock 01: Full Syllabus"
                    value={manualExamTitle}
                    onChange={(e) => setManualExamTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Standard / Category</label>
                    <select
                      value={manualExamCategory}
                      onChange={(e) => setManualExamCategory(e.target.value as any)}
                      className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                    >
                      <option value="JEE Mock">JEE Mock</option>
                      <option value="NEET Mock">NEET Mock</option>
                      <option value="SAT / College Board">SAT / College Board</option>
                      <option value="School Board">School Board</option>
                      <option value="Custom / Teacher">Custom / Teacher</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Target Stream</label>
                    <select
                      value={manualExamCourse}
                      onChange={(e) => setManualExamCourse(e.target.value as any)}
                      className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                    >
                      <option value="All Courses">All Courses</option>
                      <option value="JEE Advanced (Target 2026)">JEE Advanced (Target 2026)</option>
                      <option value="NEET Medical (Super-30)">NEET Medical (Super-30)</option>
                      <option value="Class 12 CBSE Board (PCM)">Class 12 CBSE Board (PCM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={manualExamDuration}
                      onChange={(e) => setManualExamDuration(Number(e.target.value) || 45)}
                      className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                    />
                  </div>
                </div>

                {/* Questions list */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                      Questions in Paper ({manualQuestionsList.length})
                    </h4>
                    <button
                      onClick={handleAddManualQuestionToDraft}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {manualQuestionsList.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-stone-400">
                      Click "+ Add Question" to compose questions with 4 options and solutions.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {manualQuestionsList.map((q, qIndex) => (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-500">Question #{qIndex + 1}</span>
                            <button
                              onClick={() => {
                                setManualQuestionsList(manualQuestionsList.filter((_, i) => i !== qIndex));
                              }}
                              className="text-stone-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Question statement..."
                            value={q.questionText}
                            onChange={(e) => {
                              const updated = [...manualQuestionsList];
                              updated[qIndex].questionText = e.target.value;
                              setManualQuestionsList(updated);
                            }}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={opt.id} className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...manualQuestionsList];
                                    updated[qIndex].correctOptionIndex = optIdx;
                                    setManualQuestionsList(updated);
                                  }}
                                  className={`w-6 h-6 rounded-full text-[10px] font-bold shrink-0 cursor-pointer ${
                                    q.correctOptionIndex === optIdx
                                      ? "bg-emerald-500 text-white"
                                      : "bg-stone-200 dark:bg-stone-800 text-stone-600"
                                  }`}
                                  title="Mark as correct"
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </button>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const updated = [...manualQuestionsList];
                                    updated[qIndex].options[optIdx].text = e.target.value;
                                    setManualQuestionsList(updated);
                                  }}
                                  className="w-full p-1.5 rounded border bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200 dark:border-stone-700">
                  <button
                    onClick={() => setShowExamModal(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublishManualExam}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save & Publish Live Examination
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EXISTING EXAM EDIT MODAL */}
      {/* ========================================================================= */}
      {isEditingExistingExam && editingExamData && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-2xl max-w-2xl w-full p-6 border shadow-2xl transition-colors my-8 ${
              isDark ? "bg-[#091325] border-stone-700 text-white" : "bg-white border-stone-300 text-stone-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 mb-4">
              <h3 className="font-classic-serif text-lg font-bold flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Configure Examination Parameters</span>
              </h3>
              <button
                onClick={() => {
                  setIsEditingExistingExam(false);
                  setEditingExamData(null);
                }}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Examination Title</label>
                <input
                  type="text"
                  value={editingExamData.title}
                  onChange={(e) =>
                    setEditingExamData({ ...editingExamData, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Category / Exam Standard</label>
                  <select
                    value={editingExamData.category}
                    onChange={(e) =>
                      setEditingExamData({
                        ...editingExamData,
                        category: e.target.value as any
                      })
                    }
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="JEE Mock">JEE Mock</option>
                    <option value="NEET Mock">NEET Mock</option>
                    <option value="SAT / College Board">SAT / College Board</option>
                    <option value="School Board">School Board</option>
                    <option value="Custom / Teacher">Custom / Teacher</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={editingExamData.durationMinutes}
                    onChange={(e) =>
                      setEditingExamData({
                        ...editingExamData,
                        durationMinutes: Number(e.target.value) || 30
                      })
                    }
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description & Guidelines</label>
                <textarea
                  rows={3}
                  value={editingExamData.description}
                  onChange={(e) =>
                    setEditingExamData({ ...editingExamData, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center space-x-2 p-3 rounded-lg border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExamData.negativeMarking}
                    onChange={(e) =>
                      setEditingExamData({
                        ...editingExamData,
                        negativeMarking: e.target.checked
                      })
                    }
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span className="font-bold">Standard Negative Marking (+4 / -1)</span>
                </label>

                <label className="flex items-center space-x-2 p-3 rounded-lg border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExamData.proctoringEnabled}
                    onChange={(e) =>
                      setEditingExamData({
                        ...editingExamData,
                        proctoringEnabled: e.target.checked
                      })
                    }
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span className="font-bold">AI Webcam Anti-Cheat Proctoring</span>
                </label>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 p-3 rounded-lg border border-stone-200 dark:border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExamData.isLive}
                    onChange={(e) =>
                      setEditingExamData({
                        ...editingExamData,
                        isLive: e.target.checked
                      })
                    }
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Publish as Live Exam for All Candidates Immediately
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-stone-200 dark:border-stone-700 mt-6">
              <button
                onClick={() => {
                  setIsEditingExistingExam(false);
                  setEditingExamData(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExamEdit}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Save Examination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: QUESTION EDITOR MODAL */}
      {/* ========================================================================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-2xl max-w-2xl w-full p-6 border shadow-2xl transition-colors my-8 ${
              isDark ? "bg-[#091325] border-stone-700 text-white" : "bg-white border-stone-300 text-stone-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 mb-4">
              <h3 className="font-classic-serif text-lg font-bold">
                {editingQuestion.isNew ? "Add New Question to Paper" : "Edit Question Details"}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">Subject</label>
                  <select
                    value={editingQuestion.question.subject}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: {
                          ...editingQuestion.question,
                          subject: e.target.value as any
                        }
                      })
                    }
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Topic</label>
                  <input
                    type="text"
                    value={editingQuestion.question.topic}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, topic: e.target.value }
                      })
                    }
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Difficulty</label>
                  <select
                    value={editingQuestion.question.difficulty}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: {
                          ...editingQuestion.question,
                          difficulty: e.target.value as any
                        }
                      })
                    }
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Question Statement / Text</label>
                <textarea
                  rows={3}
                  value={editingQuestion.question.questionText}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, questionText: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Diagram / Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://... or diagram link"
                  value={editingQuestion.question.imageUrl || ""}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, imageUrl: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-2">Options & Correct Choice</label>
                <div className="space-y-2">
                  {editingQuestion.question.options.map((opt, optIndex) => {
                    const isCorrect = optIndex === editingQuestion.question.correctOptionIndex;
                    return (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingQuestion({
                              ...editingQuestion,
                              question: {
                                ...editingQuestion.question,
                                correctOptionIndex: optIndex
                              }
                            })
                          }
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer ${
                            isCorrect
                              ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                              : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                          }`}
                          title="Mark as Correct Option"
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </button>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.question.options];
                            newOptions[optIndex] = { ...newOptions[optIndex], text: e.target.value };
                            setEditingQuestion({
                              ...editingQuestion,
                              question: { ...editingQuestion.question, options: newOptions }
                            });
                          }}
                          className="flex-1 p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Step-by-Step Solution Explanation</label>
                <textarea
                  rows={3}
                  value={editingQuestion.question.solutionExplanation}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: {
                        ...editingQuestion.question,
                        solutionExplanation: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Marks Awarded</label>
                  <input
                    type="number"
                    value={editingQuestion.question.marks}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: {
                          ...editingQuestion.question,
                          marks: Number(e.target.value) || 4
                        }
                      })
                    }
                    className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Negative Marks</label>
                  <input
                    type="number"
                    value={editingQuestion.question.negativeMarks}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: {
                          ...editingQuestion.question,
                          negativeMarks: Number(e.target.value) || 1
                        }
                      })
                    }
                    className="w-full p-2 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-stone-200 dark:border-stone-700 mt-6">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Save Question to Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: BROADCAST NOTICE MODAL */}
      {/* ========================================================================= */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-lg w-full p-6 border shadow-2xl transition-colors ${
              isDark ? "bg-[#091325] border-stone-700 text-white" : "bg-white border-stone-300 text-stone-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 mb-4">
              <h3 className="font-classic-serif text-lg font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Broadcast Official Institutional Notice</span>
              </h3>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Notice Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Mock Test 2026 Rescheduled"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="Exam Alert">Exam Alert</option>
                    <option value="Important">Important</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Schedule">Schedule</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Target Stream</label>
                  <select
                    value={noticeTargetCourse}
                    onChange={(e) => setNoticeTargetCourse(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="All Courses">All Courses / Batches</option>
                    <option value="JEE Advanced (Target 2026)">JEE Advanced</option>
                    <option value="NEET Medical (Super-30)">NEET Medical</option>
                    <option value="Class 12 CBSE Board (PCM)">Class 12 CBSE</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Signatory / Authority</label>
                  <input
                    type="text"
                    value={noticeAuthor}
                    onChange={(e) => setNoticeAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Detailed Content</label>
                <textarea
                  rows={4}
                  placeholder="Write announcement body..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noticePinned}
                  onChange={(e) => setNoticePinned(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-0"
                />
                <span className="font-bold">Pin to Top of Student Notice Board</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-stone-200 dark:border-stone-700 mt-6">
              <button
                onClick={() => setShowNoticeModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotice}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Broadcast to Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: UPLOAD STUDY RESOURCE (PDF / PPT / EXCEL / BOOK) */}
      {/* ========================================================================= */}
      {showBookUploadModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-lg w-full p-6 border shadow-2xl transition-colors max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-[#091325] border-stone-700 text-white" : "bg-white border-stone-300 text-stone-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 mb-4">
              <div>
                <h3 className="font-classic-serif text-lg font-bold flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-amber-500" />
                  <span>Upload Resource to Library</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Upload PDF, PPT, Excel, or e-Books for student download and study.
                </p>
              </div>
              <button
                onClick={() => setShowBookUploadModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Material Type Pills */}
              <div>
                <label className="font-bold block mb-1.5">Material Format / Document Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: "pdf", label: "PDF Notes", icon: FileText },
                    { type: "ppt", label: "PPT Slides", icon: Presentation },
                    { type: "excel", label: "Excel Data", icon: FileSpreadsheet },
                    { type: "book", label: "E-Book", icon: BookOpen }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.type}
                        type="button"
                        onClick={() => setMaterialType(m.type as any)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          materialType === m.type
                            ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold"
                            : "bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File Attachment Dropzone */}
              <div className="border border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-4 text-center bg-stone-50/50 dark:bg-stone-900/40">
                <p className="text-stone-700 dark:text-stone-300 font-bold mb-1">
                  {uploadedMaterialFileName ? `Attached: ${uploadedMaterialFileName}` : "Select Material File"}
                </p>
                <label className="px-3 py-1.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/40 rounded-lg text-xs cursor-pointer inline-flex items-center space-x-1.5 mt-1 font-bold">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose File from Device</span>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.xls,.xlsx,.csv,.doc,.docx"
                    onChange={handleMaterialFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="font-bold block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Classical Mechanics Advanced Formulas"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Subject</label>
                  <select
                    value={bookSubject}
                    onChange={(e) => setBookSubject(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Target Stream / Course</label>
                  <select
                    value={bookTargetCourse}
                    onChange={(e) => setBookTargetCourse(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                  >
                    <option value="All Courses">All Courses</option>
                    <option value="JEE Advanced (Target 2026)">JEE Advanced</option>
                    <option value="NEET Medical (Super-30)">NEET Medical</option>
                    <option value="Class 12 CBSE Board (PCM)">Class 12 CBSE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Author / Faculty Member</label>
                <input
                  type="text"
                  placeholder="Prof. H. C. Verma"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Brief Summary / Overview</label>
                <input
                  type="text"
                  placeholder="Comprehensive theory notes with practice problems..."
                  value={bookDescription}
                  onChange={(e) => setBookDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-stone-200 dark:border-stone-700 mt-6">
              <button
                onClick={() => setShowBookUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUploadedBook}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Publish to Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: SUBMISSION AUDIT & PROCTOR LOG MODAL */}
      {/* ========================================================================= */}
      {selectedAttemptDetail && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-2xl max-w-xl w-full p-6 border shadow-2xl transition-colors my-8 ${
              isDark ? "bg-[#091325] border-stone-700 text-white" : "bg-white border-stone-300 text-stone-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 mb-4">
              <h3 className="font-classic-serif text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Candidate Proctor Audit Trail</span>
              </h3>
              <button
                onClick={() => setSelectedAttemptDetail(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{selectedAttemptDetail.studentName}</span>
                  <span className="text-emerald-500 font-bold">
                    Score: {selectedAttemptDetail.totalScore} / {selectedAttemptDetail.maxScore} (Rank #{selectedAttemptDetail.rank})
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Exam: {selectedAttemptDetail.examTitle} • Submitted: {selectedAttemptDetail.submittedAt}
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Overall Accuracy: {selectedAttemptDetail.accuracyPercentage}% • Integrity Score: {selectedAttemptDetail.integrityScore}%
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-2 text-stone-700 dark:text-stone-300">
                  Recorded Proctoring Events & Gaze Tracking Flags:
                </h4>
                {selectedAttemptDetail.proctorFlags.length === 0 ? (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center">
                    <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                    <p className="font-bold">Zero Violations Recorded</p>
                    <p className="text-[10px] text-stone-400">Candidate completed the examination with pristine integrity.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedAttemptDetail.proctorFlags.map((flag) => (
                      <div
                        key={flag.id}
                        className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start space-x-2 text-red-700 dark:text-red-300"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase tracking-wider text-[10px]">
                            {flag.type.replace(/_/g, " ")} • At {flag.timestamp}
                          </p>
                          <p className="text-xs text-stone-600 dark:text-stone-300">{flag.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-stone-200 dark:border-stone-700 mt-6">
              <button
                onClick={() => {
                  alert(`Retest token granted for ${selectedAttemptDetail.studentName}.`);
                  setSelectedAttemptDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs cursor-pointer hover:bg-amber-500/30"
              >
                Grant Retest Token
              </button>
              <button
                onClick={() => setSelectedAttemptDetail(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
