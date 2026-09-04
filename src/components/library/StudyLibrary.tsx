import React, { useState } from "react";
import { StudyBook, ThemeMode, CourseStream } from "../../types";
import { BookReader } from "./BookReader";
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Highlighter,
  GraduationCap,
  Sparkles,
  BookmarkCheck,
  Layers,
  ArrowRight
} from "lucide-react";

interface StudyLibraryProps {
  books: StudyBook[];
  onUploadCustomBook?: (newBook: StudyBook) => void;
  isAdmin?: boolean;
  theme: ThemeMode;
  onOpenAdminPanel?: () => void;
  studentCourse?: CourseStream;
}

export const StudyLibrary: React.FC<StudyLibraryProps> = ({
  books,
  isAdmin = false,
  theme,
  onOpenAdminPanel,
  studentCourse = "JEE Advanced (Target 2026)"
}) => {
  const [selectedBook, setSelectedBook] = useState<StudyBook | null>(null);
  const [filterStream, setFilterStream] = useState<string>("allotted");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isDark = theme === "dark";
  const subjects = ["All", "Physics", "Chemistry", "Mathematics", "Biology"];

  const filteredBooks = books.filter((b) => {
    const matchesCourse =
      filterStream === "all" ||
      (filterStream === "allotted" &&
        (b.allottedCourse === studentCourse || b.allottedCourse === "All Courses" || !b.allottedCourse));

    const matchesSubject = selectedSubject === "All" || b.subject === selectedSubject;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCourse && matchesSubject && matchesSearch;
  });

  if (selectedBook) {
    return (
      <BookReader
        book={selectedBook}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* App Bar */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
          isDark
            ? "bg-[#0f1b33] border-stone-800 text-stone-100"
            : "bg-white border-[#e5dec9] text-stone-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-classic-serif text-lg font-bold tracking-tight">
                Allocated Study Material & Handbooks
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Course: <strong className="text-amber-500">{studentCourse}</strong> • Interactive Highlighting & Sticky Notes
              </p>
            </div>
          </div>

          {isAdmin && onOpenAdminPanel && (
            <button
              onClick={onOpenAdminPanel}
              className="px-3.5 py-1.5 bg-stone-900/90 hover:bg-stone-800 text-amber-400 font-bold rounded-xl text-xs transition-colors border border-amber-500/40 flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Admin Material Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
          isDark
            ? "bg-[#0f1b33] border-stone-800 text-stone-200"
            : "bg-white border-[#e5dec9] text-stone-800 shadow-sm"
        }`}
      >
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
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
            My Course Handbooks
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
            All Handbooks
          </button>

          <div className="h-4 w-[1px] bg-stone-300 dark:bg-stone-700 mx-1" />

          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSubject === subj
                  ? isDark
                    ? "bg-stone-800 text-amber-400 font-bold"
                    : "bg-stone-200 text-stone-900 font-bold"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search handbooks..."
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

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              isDark
                ? "bg-[#0f1b33] border-stone-800 hover:border-amber-500/40 text-stone-100 shadow-md"
                : "bg-white border-[#e5dec9] hover:border-amber-600/50 text-stone-900 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {book.subject}
                </span>
                <span className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">{book.gradeLevel}</span>
              </div>

              <h3 className="font-classic-serif text-base font-bold tracking-tight mb-1 line-clamp-2 text-stone-900 dark:text-stone-100">
                {book.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-2.5 font-medium">By {book.author}</p>

              <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-3 leading-relaxed mb-3">
                {book.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-stone-200 dark:border-stone-800/80">
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-medium">
                <span className="flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{book.chapters.length} Chapters</span>
                </span>
                <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Highlighter className="w-3.5 h-3.5" />
                  <span>Interactive Notes</span>
                </span>
              </div>

              <button
                onClick={() => setSelectedBook(book)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read & Annotate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
