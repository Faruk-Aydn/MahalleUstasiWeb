"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hammer,
  LayoutDashboard,
  Users,
  ClipboardList,
  MessageSquareWarning,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logoutAdmin } from "@/lib/firebase/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
  { href: "/admin/listings", label: "İlanlar", icon: ClipboardList },
  { href: "/admin/disputes", label: "Şikayetler", icon: MessageSquareWarning },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutAdmin();
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-screen bg-[#0f0f0f] border-r border-white/[0.06] flex flex-col shrink-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] shrink-0">
        <div className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
          <Hammer className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 font-bold text-white text-sm whitespace-nowrap overflow-hidden"
            >
              Mahalle Ustası
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                isActive
                  ? "bg-brand-orange/15 text-brand-orange"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-brand-orange/15 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon className="w-5 h-5 shrink-0 relative z-10" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap relative z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          {loggingOut ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin shrink-0" />
          ) : (
            <LogOut className="w-5 h-5 shrink-0" />
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Çıkış Yap
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#1a1a1a] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors shadow-lg"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}
