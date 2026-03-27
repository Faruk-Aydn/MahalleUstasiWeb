"use client";

import { motion } from "framer-motion";
import { Hammer, Search, CheckCircle, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark text-white selection:bg-brand-orange selection:text-white overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-green/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-orange/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 md:pt-40 md:pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-brand-orange text-sm font-medium mb-8"
        >
          <Hammer className="w-4 h-4" />
          <span>Yeni Lansman: Sürüm 1.0 Yayında!</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          Mahallendeki Ustayı Bul, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-500">
            Ek Gelir Yarat.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-white/60 mb-12"
        >
          Evinizdeki her türlü tamir, tadilat ve montaj işleri için güvenilir ustaları bulun. 
          Ya da yeteneklerinizi kazanca dönüştürün.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-lg shadow-orange-500/20 flex items-center gap-2 group">
            <Smartphone className="w-5 h-5 group-hover:animate-bounce" />
            Uygulamayı İndir
          </button>
          <button className="px-8 py-4 glass-dark hover:bg-white/10 text-white rounded-2xl font-semibold text-lg transition-all border border-white/10">
            Nasıl Çalışır?
          </button>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="px-6 py-24 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Search,
              title: "Kolayca Bul",
              desc: "İhtiyacın olan hizmeti seç, çevrendeki ustalardan teklif al."
            },
            {
              icon: CheckCircle,
              title: "Güvenle Öde",
              desc: "İş bitmeden ödeme onaylanmaz. Paranız bizde güvende."
            },
            {
              icon: Hammer,
              title: "Hemen Başla",
              desc: "Usta mısın? Profilini oluştur ve dakikalar içinde iş al."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl glass border border-white/10 hover:border-brand-orange/50 transition-colors group"
            >
              <div className="w-14 h-14 bg-brand-green/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-brand-orange" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-white/60 leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Client-only script to fix layout shifts */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang = 'tr'` }} />
    </main>
  );
}
