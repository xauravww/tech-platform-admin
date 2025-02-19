'use client'
import { FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/authContext';
import Link from 'next/link';

export const Navbar = () => {
    const { token, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref for dropdown menu

    const handleLogout = () => {
        logout().then(() => {
            window.location.href = '/login';
        });
    };

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gray-900 shadow-md h-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link prefetch={false} href="/" className="text-xl font-bold text-gray-200 hover:text-white transition-colors duration-200">
                                TechPlatform
                            </Link>
                        </div>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-300 hover:text-white inline-flex items-center p-2 transition-colors duration-200"
                        >
                            <FiUser size={24} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                F         {token ? (
                                    <>
                                        <Link
                                            prefetch={false}
                                            href="/admin"
                                            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        prefetch={false}
                                        href="/login"
                                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
