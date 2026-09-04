import React, { useState } from "react";
import { Notice, ThemeMode } from "../../types";
import {
  Bell,
  Pin,
  Calendar,
  UserCheck,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2
} from "lucide-react";

interface StudentNoticeBoardProps {
  notices: Notice[];
  theme: ThemeMode;
}

export const StudentNoticeBoard: React.FC<StudentNoticeBoardProps> = ({
  notices,
  theme
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isDark = theme === "dark";
  const categories = ["All", "Exam Alert", "Important", "Syllabus", "Schedule", "General"];

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Royal Header Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-lg relative overflow-hidden transition-colors ${
          isDark
            ? "bg-gradient-to-r from-[#0d182e] via-[#091325] to-[#060b14] border-amber-500/30 text-stone-100"
            : "bg-gradient-to-r from-[#0f1d38] via-[#16274a] to-[#1e345e] border-amber-600/40 text-white"
        }`}
      >
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Bell className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Official Academic Bulletin</span>
          </div>
          <h1 className="font-classic-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Institutional Notices & Examination Alerts
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Real-time updates, schedule releases, syllabus revisions, and exam guidelines broadcasted directly by the Institutional Administrative Authority.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
          isDark
            ? "bg-[#0f1b33] border-stone-800 text-stone-200"
            : "bg-white border-[#e5dec9] text-stone-800 shadow-sm"
        }`}
      >
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-stone-500 dark:text-stone-400 ml-1 mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? isDark
                    ? "bg-amber-500 text-stone-950 font-bold"
                    : "bg-[#0f1d38] text-amber-300 font-bold"
                  : "text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-500 dark:text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bulletins & alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-1.5 rounded-lg text-xs border focus:outline-none transition-colors ${
              isDark
                ? "bg-[#091325] border-stone-700 text-white placeholder-stone-400"
                : "bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-500 font-medium"
            }`}
          />
        </div>
      </div>

      {/* Notice Feed */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0f1b33] rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
            <Bell className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">No announcements match your search.</p>
          </div>
        ) : (
          filteredNotices.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-2xl p-5 sm:p-6 border transition-all ${
                isDark
                  ? "bg-[#0f1b33] border-stone-800 text-stone-100 hover:border-amber-500/40"
                  : "bg-white border-[#e5dec9] text-stone-900 shadow-sm hover:border-amber-600/50"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      notif.priority === "urgent"
                        ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                        : notif.priority === "high"
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {notif.priority}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {notif.category}
                  </span>
                  {notif.pinned && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Pin className="w-3 h-3 fill-current" /> Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>{notif.publishedAt}</span>
                </div>
              </div>

              <h3 className="font-classic-serif font-bold text-lg mb-2 leading-snug text-stone-900 dark:text-stone-100">
                {notif.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {notif.content}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                <div className="flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Official Signatory: <strong className="text-stone-900 dark:text-stone-200">{notif.author}</strong></span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Release
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
