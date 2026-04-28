"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/login");
      }
    }
  }, [user, isAdmin, loading, router]);

  // Yüklenirken tam ekran spinner göster
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-brand-orange rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Yetki kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Yetkisizse boş render (redirect zaten tetiklendi)
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
