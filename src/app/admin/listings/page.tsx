"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Search, Eye, EyeOff, RefreshCw, Tag } from "lucide-react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";

interface Listing {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  ownerId?: string;
  ownerName?: string;
  status?: "active" | "hidden" | "completed";
  createdAt?: { seconds: number };
}

const MOCK_LISTINGS: Listing[] = [
  { id: "m1", title: "Mutfak tesisat arızası", description: "Lavabonun altındaki boru sızıyor.", category: "Tesisat", ownerName: "Ahmet Y.", status: "active" },
  { id: "m2", title: "Salon boyası", description: "25m² salon tavan dahil boyanacak.", category: "Boya/Badana", ownerName: "Fatma Ç.", status: "active" },
  { id: "m3", title: "Kapı kilidi değişimi", description: "3 kapı kilidi değiştirilecek.", category: "Çilingir", ownerName: "Ali K.", status: "hidden" },
  { id: "m4", title: "Elektrik priz montajı", description: "5 adet priz takılacak.", category: "Elektrik", ownerName: "Mehmet U.", status: "completed" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Tesisat": "bg-blue-500/15 text-blue-400",
  "Boya/Badana": "bg-yellow-500/15 text-yellow-400",
  "Elektrik": "bg-orange-500/15 text-orange-400",
  "Çilingir": "bg-purple-500/15 text-purple-400",
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden" | "completed">("all");
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (snap.empty) {
        setListings(MOCK_LISTINGS);
        setFiltered(MOCK_LISTINGS);
        setIsMock(true);
      } else {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Listing));
        setListings(data);
        setFiltered(data);
        setIsMock(false);
      }
    } catch {
      setListings(MOCK_LISTINGS);
      setFiltered(MOCK_LISTINGS);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  useEffect(() => {
    let result = listings;
    if (statusFilter !== "all") result = result.filter((l) => l.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(s) ||
          l.category?.toLowerCase().includes(s) ||
          l.ownerName?.toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, listings]);

  const toggleVisibility = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "hidden" : "active";
    if (isMock) {
      setListings((prev) =>
        prev.map((l) => l.id === listingId ? { ...l, status: newStatus as Listing["status"] } : l)
      );
      return;
    }
    setTogglingId(listingId);
    try {
      await updateDoc(doc(db, "listings", listingId), { status: newStatus });
      setListings((prev) =>
        prev.map((l) => l.id === listingId ? { ...l, status: newStatus as Listing["status"] } : l)
      );
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (ts?: { seconds: number }) => {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("tr-TR");
  };

  const statusConfig = {
    active: { label: "Aktif", cls: "bg-green-500/15 text-green-400" },
    hidden: { label: "Gizli", cls: "bg-red-500/15 text-red-400" },
    completed: { label: "Tamamlandı", cls: "bg-blue-500/15 text-blue-400" },
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-brand-orange" />
            İlan Moderasyonu
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {isMock
              ? "⚠️ Örnek veri gösteriliyor — Firestore'da listings koleksiyonu bulunamadı"
              : `${listings.length} ilan bulundu`}
          </p>
        </div>
        <button
          onClick={fetchListings}
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
            id="listings-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık, kategori veya usta ara..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-brand-orange/40 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "hidden", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === s
                  ? "bg-brand-orange text-white"
                  : "bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              {s === "all" ? "Tümü" : s === "active" ? "Aktif" : s === "hidden" ? "Gizli" : "Bitti"}
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
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">İlan</th>
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Kategori</th>
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">İlan Sahibi</th>
                <th className="text-left px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Tarih</th>
                <th className="text-center px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">Durum</th>
                <th className="text-center px-6 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/30 text-sm">
                    İlan bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((listing, i) => {
                  const sc = statusConfig[listing.status || "active"];
                  const catColor = CATEGORY_COLORS[listing.category || ""] || "bg-white/10 text-white/50";
                  return (
                    <motion.tr
                      key={listing.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">{listing.title || "Başlıksız"}</p>
                        <p className="text-white/40 text-xs mt-0.5 max-w-[200px] truncate">{listing.description}</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${catColor}`}>
                          <Tag className="w-3 h-3" />
                          {listing.category || "Diğer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/50 text-sm hidden lg:table-cell">
                        {listing.ownerName || listing.ownerId?.slice(0, 8) || "—"}
                      </td>
                      <td className="px-6 py-4 text-white/50 text-sm hidden lg:table-cell">
                        {formatDate(listing.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.cls}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {listing.status !== "completed" && (
                          <button
                            id={`toggle-listing-${listing.id}`}
                            onClick={() => toggleVisibility(listing.id, listing.status || "active")}
                            disabled={togglingId === listing.id}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
                              listing.status === "active"
                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            }`}
                          >
                            {togglingId === listing.id ? (
                              <div className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
                            ) : listing.status === "active" ? (
                              <><EyeOff className="w-3 h-3" /> Gizle</>
                            ) : (
                              <><Eye className="w-3 h-3" /> Yayınla</>
                            )}
                          </button>
                        )}
                        {listing.status === "completed" && (
                          <span className="text-white/20 text-xs">Tamamlandı</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
