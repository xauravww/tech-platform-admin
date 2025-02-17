'use client';
import React, { useEffect, useState } from 'react';

interface MobileWarningProps {
  children: React.ReactNode;
}

export default function MobileWarning({ children }: MobileWarningProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check viewport width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial width
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If on mobile, show a full-screen message
  if (isMobile) {
    return (
      <div className="min-h-screen px-4 flex items-center justify-center bg-gradient-to-br from-blue-800 to-gray-900">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Mobile Not Supported</h2>
          <p className="text-sm text-gray-600">
            Please open in desktop only.
          </p>
        </div>
      </div>
    );
  }

  // Otherwise, render the children normally
  return <>{children}</>;
}
