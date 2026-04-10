import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Calendar, 
  FolderOpen, 
  HelpCircle, 
  LogOut,
  GraduationCap
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/students", icon: Users, label: "Students" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/resources", icon: FolderOpen, label: "Resources" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#000000] border-r border-white/5 flex flex-col py-8 z-50 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
      {/* Logo */}
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-indigo-400 leading-tight">Nocturnal</h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Learning Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 transition-all text-sm font-medium ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border-r-4 border-indigo-500"
                  : "text-slate-500 hover:text-slate-300 hover:bg-indigo-500/5 hover:translate-x-1"
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Button */}
      <div className="px-6 mb-8">
        <button className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
          Upgrade Plan
        </button>
      </div>

      {/* Bottom Links */}
      <div className="border-t border-white/5 pt-6">
        <NavLink
          to="/support"
          className="text-slate-500 hover:text-slate-300 flex items-center px-6 py-3 transition-all hover:bg-indigo-500/5 text-sm"
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          Support
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full text-left text-slate-500 hover:text-slate-300 flex items-center px-6 py-3 transition-all hover:bg-indigo-500/5 text-sm"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
