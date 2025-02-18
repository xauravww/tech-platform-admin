// app/not-found.tsx

'use client';

import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6">
            {/* Blurred Gradient Background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-700 opacity-30 rounded-full blur-3xl"></div>
            <div className="max-w-7xl mx-auto w-full text-center">
                <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                    404 - Page Not Found
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Oops! The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link href="/" className="text-lg text-blue-400 hover:text-blue-600 transition duration-300">
                    Go Back to Home
                </Link>
            </div>
        </main>
    );
}
