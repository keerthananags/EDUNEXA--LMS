import React from "react";
import { Search, Bell, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopNavBar({ title = "Overview" }) {
  const { user } = useAuth();

  return (
    <header className="w-full sticky top-0 z-40 bg-[#060e20] bg-gradient-to-b from-[#091328] to-transparent flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, students..."
            className="w-64 bg-white/5 border-none rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#060e20]"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.name || "Guest"}</p>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">
              {user?.role === "admin" ? "Admin Principal" : "Student"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || "G"}
          </div>
        </div>
      </div>
    </header>
  );
}
