"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Shield, Wrench, Ban, CheckCircle2, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";

interface AppUser {
  id: string;
  displayName?: string;
  email?: string;
  role?: "customer" | "usta";
  isActive?: boolean;
  createdAt?: { seconds: number };
  phone?: string;
}

// Firestore'da veri yoksa gösterilecek örnek kullanıcılar
const MOCK_USERS: AppUser[] = [
  { id: "mock1", displayName: "Ahmet Yılmaz", email: "ahmet@example.com", role: "customer", isActive: true, phone: "0532 111 22 33" },
  { id: "mock2", displayName: "Mehmet Usta", email: "mehmet@example.com", role: "usta", isActive: true, phone: "0533 444 55 66" },
  { id: "mock3", displayName: "Fatma Çelik", email: "fatma@example.com", role: "customer", isActive: false, phone: "0534 777 88 99" },
  { id: "mock4", displayName: "Ali Kaya", email: "ali@example.com", role: "usta", isActive: true, phone: "0535 000 11 22" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filtered, setFiltered] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "usta">("all");
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (snap.empty) {
        setUsers(MOCK_USERS);
        setFiltered(MOCK_USERS);
        setIsMock(true);
      } else {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppUser));
        setUsers(data);
        setFiltered(data);
        setIsMock(false);
      }
    } catch {
      setUsers(MOCK_USERS);
      setFiltered(MOCK_USERS);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Arama + filtre
  useEffect(() => {
    let result = users;
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.displayName?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [search, roleFilter, users]);

  const toggleActive = async (userId: string, current: boolean) => {
    if (isMock) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: !current } : u));
      return;
    }
    setTogglingId(userId);
    try {
      await updateDoc(doc(db, "users", userId), { isActive: !current });
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, isActive: !current } : u)
      );
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (ts?: { seconds: number }) => {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("tr-TR");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-brand-orange" />
            Kullanıcı Yönetimi
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {isMock ? "⚠️ Örnek veri gösteriliyor — Firestore'da users koleksiyonu bulunamadı" : `${users.length} kayıtlı kullanıcı`}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Yenile
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            id="users-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim veya e-posta ara..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-brand-orange/40 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "customer", "usta"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                roleFilter === r
                  ? "bg-brand-orange text-white"
                  : "bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              {r === "all" ? "Tümü" : r === "customer" ? "Müşteri" : "Usta"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-white/10 border-t-brand-orange rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">Kullanıcı</th>
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">Rol</th>
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Telefon</th>
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Kayıt Tarihi</th>
                <th className="text-center px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">Durum</th>
                <th className="text-center px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/30 text-sm">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-sm shrink-0">
                          {(user.displayName || user.email || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.displayName || "İsimsiz"}</p>
                          <p className="text-white/40 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        user.role === "usta"
                          ? "bg-purple-500/15 text-purple-400"
                          : "bg-blue-500/15 text-blue-400"
                      }`}>
                        {user.role === "usta" ? <Wrench className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role === "usta" ? "Usta" : "Müşteri"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/50 text-sm hidden md:table-cell">
                      {user.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-white/50 text-sm hidden lg:table-cell">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        user.isActive !== false
                          ? "bg-green-500/15 text-green-400"
                          : "bg-red-500/15 text-red-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? "bg-green-400" : "bg-red-400"}`} />
                        {user.isActive !== false ? "Aktif" : "Askıda"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        id={`toggle-user-${user.id}`}
                        onClick={() => toggleActive(user.id, user.isActive !== false)}
                        disabled={togglingId === user.id}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
                          user.isActive !== false
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        }`}
                      >
                        {togglingId === user.id ? (
                          <div className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
                        ) : user.isActive !== false ? (
                          <><Ban className="w-3 h-3" /> Askıya Al</>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3" /> Aktifleştir</>
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
