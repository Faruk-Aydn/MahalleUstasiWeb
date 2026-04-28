"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ClipboardList, CheckCircle, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, getCountFromServer } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  sub: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stat[]>([
    { label: "Toplam Kullanıcı", value: "—", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", sub: "Firestore'dan yükleniyor..." },
    { label: "Toplam İlan", value: "—", icon: ClipboardList, color: "text-brand-orange", bg: "bg-orange-500/10", sub: "Firestore'dan yükleniyor..." },
    { label: "Tamamlanan İş", value: "—", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", sub: "Firestore'dan yükleniyor..." },
    { label: "Bekleyen Şikayet", value: "—", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", sub: "Firestore'dan yükleniyor..." },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, listingsSnap] = await Promise.all([
          getCountFromServer(collection(db, "users")),
          getCountFromServer(collection(db, "listings")),
        ]);

        setStats([
          {
            label: "Toplam Kullanıcı",
            value: usersSnap.data().count.toString(),
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            sub: "Kayıtlı kullanıcı",
          },
          {
            label: "Toplam İlan",
            value: listingsSnap.data().count.toString(),
            icon: ClipboardList,
            color: "text-brand-orange",
            bg: "bg-orange-500/10",
            sub: "Aktif ilan",
          },
          {
            label: "Tamamlanan İş",
            value: "—",
            icon: CheckCircle,
            color: "text-green-400",
            bg: "bg-green-500/10",
            sub: "Yakında aktif",
          },
          {
            label: "Bekleyen Şikayet",
            value: "0",
            icon: AlertTriangle,
            color: "text-red-400",
            bg: "bg-red-500/10",
            sub: "İnceleme bekliyor",
          },
        ]);
      } catch {
        // Firestore henüz koleksiyon yoksa 0 göster
        setStats((prev) =>
          prev.map((s) => ({ ...s, value: "0", sub: "Henüz veri yok" }))
        );
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          Hoş Geldin 👋
        </motion.h1>
        <p className="text-white/40 mt-2 text-sm">{user?.email} · Yönetici Paneli</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-colors"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
            <p className="text-white/30 text-xs mt-2">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Info Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-orange" />
            <h2 className="font-semibold text-white">Platform Durumu</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Firebase Auth", status: "Bağlı", ok: true },
              { label: "Firestore DB", status: "Aktif", ok: true },
              { label: "Firebase Storage", status: "Yapılandırılmadı", ok: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-white/60 text-sm">{item.label}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.ok ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-brand-orange" />
            <h2 className="font-semibold text-white">Haftalık Hedefler</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Admin Panel", progress: 60 },
              { label: "Kullanıcı Yönetimi", progress: 40 },
              { label: "İlan Moderasyonu", progress: 30 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-white/60 text-sm">{item.label}</span>
                  <span className="text-white/40 text-xs">%{item.progress}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-brand-orange rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
