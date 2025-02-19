'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center" style={{ minHeight: "calc(100vh - 65px)" }}>
      {/* Blurred Gradient Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-700 opacity-30 rounded-full blur-3xl"></div>

      {/* Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Admin Access
        </h2>
        <p className="text-sm text-white/70 text-center mb-6">
          Please sign in to access your dashboard.
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            prefetch={false}
            href="/admin"
            className="block text-center py-3 px-4 rounded-md bg-blue-800 text-white hover:bg-blue-900 transition-all duration-300 shadow-md"
          >
            Go to Dashboard
          </Link>
          <Link
            prefetch={false}
            href={`${process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL}`}
            className="block text-center py-3 px-4 rounded-md bg-white/20 text-white hover:bg-white/30 transition-all duration-300 shadow-md"
          >
            Main Website
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
