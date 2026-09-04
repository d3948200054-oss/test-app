import React, { useState } from "react";
import { Exam, Question, QuestionOption, CourseStream } from "../../types";
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Save,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  UploadCloud
} from "lucide-react";

interface ExamCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExam: (newExam: Exam) => void;
}

export const ExamCreatorModal: React.FC<ExamCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveExam
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<Exam["category"]>("Custom / Teacher");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [proctoringEnabled, setProctoringEnabled] = useState<boolean>(true);

  // AI Generator Form
  const [aiTopic, setAiTopic] = useState<string>("Thermodynamics & Carnot Cycle");
  const [aiSubject, setAiSubject] = useState<Question["subject"]>("Physics");
  const [aiDifficulty, setAiDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Advanced">("Medium");
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState<boolean>(false);

  // Questions State
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q_${Date.now()}_1`,
      questionText: "Sample Question: What is the rate of change of momentum of a body equal to?",
      subject: "Physics",
      topic: "Laws of Motion",
      difficulty: "Easy",
      questionType: "single_choice",
      options: [
        { id: "o1", text: "Net Applied External Force" },
        { id: "o2", text: "Total Mechanical Energy" },
        { id: "o3", text: "Gravitational Acceleration" },
        { id: "o4", text: "Inertial Moment of Mass" }
      ],
      correctOptionIndex: 0,
      marks: 4,
      negativeMarks: 1,
      solutionExplanation: "According to Newton's Second Law of Motion: F_net = dp/dt."
    }
  ]);

  if (!isOpen) return null;

  // Add Empty Question
  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      questionText: "",
      subject: "Physics",
      topic: "Core Concept",
      difficulty: "Medium",
      questionType: "single_choice",
      options: [
        { id: "o1", text: "Option A" },
        { id: "o2", text: "Option B" },
        { id: "o3", text: "Option C" },
        { id: "o4", text: "Option D" }
      ],
      correctOptionIndex: 0,
      marks: 4,
      negativeMarks: 1,
      solutionExplanation: ""
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  // Remove Question
  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update Question Field
  const handleUpdateQuestion = (idx: number, updates: Partial<Question>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...updates };
      return copy;
    });
  };

  // Update Option Text
  const handleUpdateOption = (qIdx: number, optIdx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const targetOptions = [...copy[qIdx].options];
      targetOptions[optIdx] = { ...targetOptions[optIdx], text };
      copy[qIdx] = { ...copy[qIdx], options: targetOptions };
      return copy;
    });
  };

  // Handle Diagram / Image Upload
  const handleImageUpload = (qIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      handleUpdateQuestion(qIdx, { imageUrl: base64Url });
    };
    reader.readAsDataURL(file);
  };

  // AI Auto-Question Generator
  const handleAiGenerateQuestions = async () => {
    setIsGeneratingWithAi(true);
    try {
      const res = await fetch("/api/ai/generate-test-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          subject: aiSubject,
          difficulty: aiDifficulty,
          count: 3
        })
      });
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        const formatted: Question[] = data.questions.map((q: any, i: number) => ({
          id: `q_ai_${Date.now()}_${i}`,
          questionText: q.question,
          subject: aiSubject,
          topic: aiTopic,
          difficulty: aiDifficulty,
          questionType: "single_choice",
          options: (q.options || ["A", "B", "C", "D"]).map((optText: string, oIdx: number) => ({
            id: `opt_${oIdx}`,
            text: optText
          })),
          correctOptionIndex: q.correctAnswer ?? 0,
          marks: q.marks ?? 4,
          negativeMarks: q.negativeMarks ?? 1,
          solutionExplanation: q.explanation || "Derived using fundamental formulas."
        }));

        setQuestions((prev) => [...prev, ...formatted]);
      }
    } catch (e) {
      console.error("AI question generation error", e);
    } finally {
      setIsGeneratingWithAi(false);
    }
  };

  // Save Complete Exam
  const handleSave = () => {
    if (!title.trim()) {
      alert("Please provide a title for the exam.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    // Auto-organize sections by subject
    const subjectMap: Record<string, string[]> = {};
    questions.forEach((q) => {
      if (!subjectMap[q.subject]) subjectMap[q.subject] = [];
      subjectMap[q.subject].push(q.id);
    });

    const sections = Object.entries(subjectMap).map(([name, questionIds]) => ({
      name,
      questionIds
    }));

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    const newExam: Exam = {
      id: `exam_custom_${Date.now()}`,
      title,
      description: description || "Custom assessment with automated grading and instant solutions.",
      category,
      allottedCourse: (category.includes("NEET") ? "NEET Medical (Super-30)" : "JEE Advanced (Target 2026)") as CourseStream,
      durationMinutes,
      totalMarks,
      passingMarks: Math.round(totalMarks * 0.4),
      negativeMarking: true,
      isLive: true,
      proctoringEnabled,
      sections,
      questions,
      createdAt: new Date().toISOString()
    };

    onSaveExam(newExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Test / Upload Questions</h2>
              <p className="text-xs text-slate-400">Configure exam patterns, diagram attachments & AI questions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Exam Basics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Exam Title *</label>
              <input
                type="text"
                placeholder="e.g. Physics Chapterwise Mechanics & Rolling Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Exam Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="JEE Mock">JEE Mock</option>
                <option value="NEET Mock">NEET Mock</option>
                <option value="SAT / College Board">SAT / College Board</option>
                <option value="Custom / Teacher">Custom / Teacher</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Instructions / Description</label>
              <input
                type="text"
                placeholder="Real exam marking pattern (+4/-1). Live proctoring active."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* AI Automated Question Generator Panel */}
          <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/40 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Instant AI Question Generator
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] text-slate-400">Topic / Concept / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Definite Integrals, Photosynthesis C4, Newton's Laws"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Subject</label>
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <button
                onClick={handleAiGenerateQuestions}
                disabled={isGeneratingWithAi}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer h-[34px]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingWithAi ? "Generating Qs..." : "AI Generate (3 Qs)"}</span>
              </button>
            </div>
          </div>

          {/* Question List Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Questions ({questions.length})
              </h3>
              <button
                onClick={handleAddQuestion}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 border border-slate-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question Manually</span>
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-cyan-400">
                    Question #{qIdx + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <select
                      value={q.subject}
                      onChange={(e) => handleUpdateQuestion(qIdx, { subject: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-[11px] text-white"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>

                    <button
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <textarea
                  rows={2}
                  placeholder="Enter the full question text with formulas or context..."
                  value={q.questionText}
                  onChange={(e) => handleUpdateQuestion(qIdx, { questionText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />

                {/* Image/Diagram Attachment */}
                <div className="flex items-center space-x-3">
                  <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{q.imageUrl ? "Replace Diagram" : "Upload Picture / Diagram"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(qIdx, e)}
                    />
                  </label>
                  {q.imageUrl && (
                    <div className="flex items-center space-x-2">
                      <img src={q.imageUrl} alt="preview" className="w-8 h-8 rounded object-cover border border-slate-700" />
                      <button
                        onClick={() => handleUpdateQuestion(qIdx, { imageUrl: undefined })}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Options Builder */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Options (Select radio button for the correct key answer):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={opt.id}
                        className={`flex items-center space-x-2 p-2 rounded-xl border ${
                          q.correctOptionIndex === optIdx
                            ? "bg-emerald-950/40 border-emerald-500/50"
                            : "bg-slate-900 border-slate-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_${q.id}`}
                          checked={q.correctOptionIndex === optIdx}
                          onChange={() => handleUpdateQuestion(qIdx, { correctOptionIndex: optIdx })}
                          className="accent-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solution Explanation */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Step-by-Step Solution / Answer Key:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter complete derivation and reason for this answer..."
                    value={q.solutionExplanation}
                    onChange={(e) => handleUpdateQuestion(qIdx, { solutionExplanation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="btn-save-created-exam"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish & Save Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
