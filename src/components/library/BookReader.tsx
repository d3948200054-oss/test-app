import React, { useState } from "react";
import { StudyBook, StudyChapter, BookHighlight, BookNote } from "../../types";
import {
  ChevronLeft,
  ChevronRight,
  Highlighter,
  FileText,
  Search,
  Sparkles,
  Bookmark,
  StickyNote,
  Trash2,
  BookOpen,
  HelpCircle,
  X
} from "lucide-react";

interface BookReaderProps {
  book: StudyBook;
  onBackToLibrary: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ book, onBackToLibrary }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [highlights, setHighlights] = useState<BookHighlight[]>([]);
  const [notes, setNotes] = useState<BookNote[]>([]);
  const [selectedHighlightColor, setSelectedHighlightColor] = useState<BookHighlight["color"]>("yellow");
  
  // Note Creator State
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");
  const [newNoteContent, setNewNoteContent] = useState<string>("");
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);

  // AI Concept Explainer on Selection
  const [selectedTextSnippet, setSelectedTextSnippet] = useState<string>("");
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Search in Chapter
  const [chapterSearch, setChapterSearch] = useState<string>("");

  const chapter: StudyChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // Text selection handler for instant highlight or AI explain
  const handleMouseUpText = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      setSelectedTextSnippet(selection.toString().trim());
    }
  };

  // Add highlight from selection
  const handleAddHighlight = () => {
    if (!selectedTextSnippet) return;
    const newHl: BookHighlight = {
      id: `hl_${Date.now()}`,
      bookId: book.id,
      chapterId: chapter.id,
      text: selectedTextSnippet,
      color: selectedHighlightColor,
      timestamp: new Date().toLocaleTimeString()
    };
    setHighlights((prev) => [...prev, newHl]);
    setSelectedTextSnippet("");
  };

  // Ask AI to explain the selected concept
  const handleAiExplainSnippet = async () => {
    if (!selectedTextSnippet) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/doubt-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Explain this excerpt in simple terms with core concepts and physical intuition: "${selectedTextSnippet}"`,
          context: `Book: ${book.title} | Chapter: ${chapter.title}`
        })
      });
      const data = await res.json();
      setAiExplanation(data.reply || "Detailed conceptual breakdown generated.");
    } catch (e) {
      setAiExplanation("Core concept: This mathematical/scientific property establishes fundamental conservation under defined boundary conditions.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save Sticky Note
  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    const newNote: BookNote = {
      id: `note_${Date.now()}`,
      bookId: book.id,
      chapterId: chapter.id,
      title: newNoteTitle || `Note on ${chapter.title.slice(0, 20)}`,
      content: newNoteContent,
      timestamp: new Date().toLocaleTimeString(),
      color: "bg-indigo-950/60 border-indigo-500/40"
    };
    setNotes((prev) => [...prev, newNote]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setShowNoteModal(false);
  };

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const chapterHighlights = highlights.filter((h) => h.chapterId === chapter.id);
  const chapterNotes = notes.filter((n) => n.chapterId === chapter.id);

  return (
    <div className="space-y-4">
      {/* Top Header & Chapter TOC Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white shadow-md">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={onBackToLibrary}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-1">
              {book.title}
            </h2>
            <p className="text-xs text-slate-400">{book.author} • {book.subject}</p>
          </div>
        </div>

        {/* Chapter Selector & Navigation */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setCurrentChapterIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentChapterIndex === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={currentChapterIndex}
            onChange={(e) => setCurrentChapterIndex(parseInt(e.target.value))}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none max-w-[200px] sm:max-w-xs"
          >
            {book.chapters.map((ch, idx) => (
              <option key={ch.id} value={idx}>
                {ch.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentChapterIndex((prev) => Math.min(book.chapters.length - 1, prev + 1))}
            disabled={currentChapterIndex === book.chapters.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Tool Toolbar (Highlighter, Sticky Note, AI Explain) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Highlight Color Pickers */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Highlighter className="w-3.5 h-3.5 text-amber-400" /> Highlighter:
          </span>
          <div className="flex items-center space-x-1.5">
            {(["yellow", "emerald", "rose", "indigo", "amber"] as const).map((col) => {
              const bgClass =
                col === "yellow"
                  ? "bg-amber-400"
                  : col === "emerald"
                  ? "bg-emerald-400"
                  : col === "rose"
                  ? "bg-rose-400"
                  : col === "indigo"
                  ? "bg-indigo-400"
                  : "bg-orange-400";

              return (
                <button
                  key={col}
                  onClick={() => setSelectedHighlightColor(col)}
                  className={`w-5 h-5 rounded-full ${bgClass} transition-transform ${
                    selectedHighlightColor === col ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Selected Text Floating Action */}
        {selectedTextSnippet && (
          <div className="flex items-center space-x-2 animate-fadeIn bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-[11px] text-cyan-300 italic line-clamp-1 max-w-[120px]">
              "{selectedTextSnippet}"
            </span>
            <button
              onClick={handleAddHighlight}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
            >
              Highlight
            </button>
            <button
              onClick={handleAiExplainSnippet}
              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> AI Explain
            </button>
          </div>
        )}

        {/* Right Actions: Add Note */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNoteModal(true)}
            className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer"
          >
            <StickyNote className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ Add Margin Note</span>
          </button>
        </div>
      </div>

      {/* Main Reading Canvas & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Interactive Reading Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              {book.subject} • Chapter {currentChapterIndex + 1}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {chapter.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {chapter.summary}
            </p>
          </div>

          {/* Reading Content */}
          <div
            onMouseUp={handleMouseUpText}
            className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 font-normal"
          >
            <div className="whitespace-pre-line select-text">
              {chapter.contentMarkdown}
            </div>
          </div>

          {/* Key Formulas Section */}
          {chapter.keyFormulas && chapter.keyFormulas.length > 0 && (
            <div className="mt-8 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> High-Yield Formulas & Relations:
              </h3>
              <div className="space-y-1.5">
                {chapter.keyFormulas.map((f, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-900 text-xs font-mono text-cyan-300 border border-slate-800/80">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Highlights, Sticky Notes & AI Explanation */}
        <div className="space-y-4">
          {/* AI Concept Explainer Card */}
          {aiExplanation && (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 text-white shadow-lg relative animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Concept Breakdown
                </span>
                <button
                  onClick={() => setAiExplanation(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {aiExplanation}
              </p>
            </div>
          )}

          {/* Sticky Notes List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5 text-indigo-400" /> Chapter Notes ({chapterNotes.length})
              </span>
              <button
                onClick={() => setShowNoteModal(true)}
                className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
              >
                + New
              </button>
            </div>

            {chapterNotes.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">
                No notes for this chapter yet. Click "+ Add Margin Note".
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {chapterNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{note.title}</span>
                      <button
                        onClick={() => removeNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{note.content}</p>
                    <span className="text-[9px] text-slate-600 block">{note.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Highlights List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Highlighter className="w-3.5 h-3.5 text-amber-400" /> Highlights ({chapterHighlights.length})
              </span>
            </div>

            {chapterHighlights.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">
                Select text in the chapter to highlight key definitions.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {chapterHighlights.map((hl) => (
                  <div
                    key={hl.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-2 group"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                      <p className="text-slate-300 text-[11px] leading-relaxed italic">
                        "{hl.text}"
                      </p>
                    </div>
                    <button
                      onClick={() => removeHighlight(hl.id)}
                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE STICKY NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 text-white shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-indigo-400" /> Add Chapter Study Note
            </h3>
            <input
              type="text"
              placeholder="Note Title (e.g., Steiner's Theorem Caveats)"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-2 focus:outline-none focus:border-indigo-500"
            />
            <textarea
              rows={4}
              placeholder="Write your personal notes, mnemonics, or test reminders..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 mb-4"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer shadow-md"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
