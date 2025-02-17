'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Research {
  title: string;
  year: number;
  type: string;
  description: string;
  doi: string;
}

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research');
        const data = await response.json();
        // console.log("research data: " + JSON.stringify(data))
        setResearch(data?.researches ?? []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching research:', error);
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Research Contributions
          </motion.h1>

          <div className="space-y-8">
            {/* Shimmer placeholders */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="p-6 space-y-3">
                  <div className="bg-gray-300 h-6 rounded-md w-3/4"></div> {/* Title */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="bg-gray-300 h-5 rounded-full w-16"></span> {/* Year */}
                      <span className="bg-gray-300 h-5 rounded-full w-24"></span> {/* Type */}
                    </div>
                  </div>
                  <div className="bg-gray-300 h-4 rounded-md w-full"></div> {/* Description Line 1 */}
                  <div className="bg-gray-300 h-4 rounded-md w-full"></div> {/* Description Line 2 */}
                  <div className="bg-gray-300 h-10 rounded-md w-1/2"></div> {/* Button */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 text-gray-900"
        >
          Research Contributions
        </motion.h1>

        <div className="space-y-8">
          {research && research.length>0 && research.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 flex-1 mr-4">
                    {item.title}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {item.year}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {item.type}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <a
                  href={item.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-blue-300 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                >
                  View Publication
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
