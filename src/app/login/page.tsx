"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hammer, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { loginAdmin } from "@/lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      // Firebase hata kodlarını Türkçeye çevir
      if (message.includes("invalid-credential") || message.includes("wrong-password") || message.includes("user-not-found")) {
        setError("E-posta veya şifre hatalı.");
      } else if (message.includes("yönetici yetkisi")) {
        setError("Bu hesabın yönetici yetkisi bulunmuyor.");
      } else if (message.includes("too-many-requests")) {
        setError("Çok fazla başarısız deneme. Lütfen bekleyin.");
      } else {
        setError("Giriş yapılırken bir hata oluştu. Tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-green/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-dark p-12 rounded-[32px] border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
            <Hammer className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Yönetici Girişi</h1>
          <p className="text-white/60">Sadece yetkili personel erişebilir.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">E-posta</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-orange transition-colors" />
              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all text-white placeholder-white/30"
                placeholder="admin@mahalleustasi.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Şifre</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-orange transition-colors" />
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all text-white placeholder-white/30"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Hata mesajı */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <button
            id="login-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Giriş Yap</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-white/40 hover:text-white transition-colors">
            ← Ana Sayfaya Dön
          </a>
        </div>
      </motion.div>
    </main>
  );
}
