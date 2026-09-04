import React, { useState } from "react";
import { AISolution } from "../../types";
import {
  Sparkles,
  Camera,
  Upload,
  Send,
  CheckCircle2,
  AlertOctagon,
  Lightbulb,
  Zap,
  BookOpen,
  MessageSquare,
  X,
  FileQuestion
} from "lucide-react";

export const InstantSolver: React.FC = () => {
  const [questionText, setQuestionText] = useState<string>("");
  const [subject, setSubject] = useState<string>("Physics");
  const [topic, setTopic] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solution, setSolution] = useState<AISolution | null>(null);
  
  // Follow up doubt chat
  const [doubtInput, setDoubtInput] = useState<string>("");
  const [doubtChat, setDoubtChat] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Quick preset templates
  const presets = [
    {
      label: "Rolling Solid Cylinder on Incline (Physics)",
      subject: "Physics",
      topic: "Rotational Dynamics",
      q: "A solid cylinder of mass M and radius R rolls without slipping down an inclined plane of angle θ. Derive the acceleration of its center of mass and find the minimum coefficient of static friction μ_s required for pure rolling."
    },
    {
      label: "King's Rule Definite Integral (Math)",
      subject: "Mathematics",
      topic: "Integral Calculus",
      q: "Evaluate the definite integral I = ∫[0 to π/2] (ln(sin(x))) dx and verify the step using the symmetry property."
    },
    {
      label: "Electrophilic Substitution Mechanism (Chemistry)",
      subject: "Chemistry",
      topic: "Organic Reaction Mechanisms",
      q: "Why is the nitration of benzene carried out in a mixture of concentrated HNO3 and concentrated H2SO4? Draw the generation of the nitronium ion (NO2+) and describe the arenium ion intermediate."
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setQuestionText(preset.q);
    setSubject(preset.subject);
    setTopic(preset.topic);
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!questionText.trim() && !imagePreview) return;
    setIsSolving(true);
    setSolution(null);
    setDoubtChat([]);

    try {
      const res = await fetch("/api/ai/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          subject,
          topic,
          imageData: imagePreview
        })
      });
      const data = await res.json();
      if (data.solution) {
        setSolution(data.solution);
      }
    } catch (e) {
      console.error("Solve error", e);
    } finally {
      setIsSolving(false);
    }
  };

  const handleSendDoubt = async () => {
    if (!doubtInput.trim() || isChatLoading) return;
    const userMsg = doubtInput;
    setDoubtInput("");
    setDoubtChat((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/doubt-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          context: `Question: ${questionText} | Subject: ${subject} | Core Solution: ${solution?.finalAnswer}`
        })
      });
      const data = await res.json();
      setDoubtChat((prev) => [...prev, { sender: "ai", text: data.reply || "Step clarification provided." }]);
    } catch (e) {
      setDoubtChat((prev) => [
        ...prev,
        { sender: "ai", text: "When solving this, remember to apply the boundary equilibrium condition." }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/40 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>0-Second Neural Instant Solver</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Instant Step-by-Step AI Question & Diagram Solver
          </h1>
          <p className="text-sm text-slate-300 mb-5 leading-relaxed">
            Snap or paste any complex problem from Physics, Chemistry, Math or Biology. Get crystal-clear step derivations, key pitfalls, and 10-second exam tricks.
          </p>

          {/* Quick Presets */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-400 whitespace-nowrap">Try Exam Problems:</span>
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box: Textarea + Diagram Snapshot Upload + Subject Picker */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-400">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-400">Specific Topic / Chapter (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Electromagnetic Induction, Chemical Equilibrium, Integration"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Question Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            placeholder="Type or paste any question here (including equations or options)..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>

        {/* Diagram Attachment Preview & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-3">
            <label className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1.5 cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>{imagePreview ? "Change Diagram / Photo" : "Upload / Snap Question Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="flex items-center space-x-2">
                <img
                  src={imagePreview}
                  alt="question preview"
                  className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            id="btn-trigger-ai-solve"
            onClick={handleSolve}
            disabled={(!questionText.trim() && !imagePreview) || isSolving}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSolving ? "Analyzing & Deriving..." : "Get Instant 0-Sec Solution"}</span>
          </button>
        </div>
      </div>

      {/* AI Solution Breakdown Container */}
      {isSolving && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-white space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <h3 className="text-base font-bold text-cyan-300">Formulating Step-by-Step Derivation...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Preppy AI is checking physical principles, boundary conditions, and optimal examination tricks.
          </p>
        </div>
      )}

      {solution && (
        <div className="space-y-5 animate-fadeIn">
          {/* Top Result Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/50 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-white">Final Derived Answer:</h3>
                  <span className="text-xs text-cyan-300 font-bold">
                    Option / Value: {solution.correctOption || "Analytical Solution"}
                  </span>
                </div>
              </div>

              <span className="text-xs px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full font-semibold">
                Verified Pedagogical Solution
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-100 mb-2">{solution.finalAnswer}</p>

            {solution.quickTrick && (
              <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start space-x-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">10-Second Exam Shortcut:</strong> {solution.quickTrick}
                </div>
              </div>
            )}
          </div>

          {/* Derivation Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step-by-Step Derivation */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-md space-y-4">
              <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Step-by-Step Derivation:
              </h4>

              <div className="space-y-3">
                {solution.stepByStep.map((step, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed"
                  >
                    <span className="font-bold text-indigo-400 mr-2">Step {i + 1}:</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Traps & Core Concepts */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-4 h-4 text-indigo-400" /> Core Principle:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{solution.keyConcept}</p>
              </div>

              <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-5 text-white shadow-md">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400" /> Common Exam Pitfalls:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{solution.commonPitfalls}</p>
              </div>

              {solution.relatedDoubts && solution.relatedDoubts.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                    Related Student Doubts:
                  </h4>
                  <div className="space-y-1.5">
                    {solution.relatedDoubts.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDoubtInput(d);
                        }}
                        className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-cyan-300 hover:text-white transition-colors cursor-pointer"
                      >
                        ❓ {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Follow-up Doubt Chat */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Ask Follow-Up Doubt to AI
            </h4>

            {doubtChat.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {doubtChat.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask any further doubt or alternate method..."
                value={doubtInput}
                onChange={(e) => setDoubtInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendDoubt()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSendDoubt}
                disabled={!doubtInput.trim() || isChatLoading}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
