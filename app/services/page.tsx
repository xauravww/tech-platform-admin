'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Technology {
  name: string;
}

interface SubService {
  name: string;
  technologies?: string[];
  description: string;
}

interface Service {
  category: string;
  description: string;
  sub_services: SubService[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data?.services ?? []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -1 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Our Services
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shimmer placeholders */}
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
              >
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="bg-gray-300 h-6 rounded-md w-3/4"></div>
                    <div className="bg-gray-300 h-4 rounded-md w-5/6"></div>
                    <div className="space-y-2">
                      {[...Array(2)].map((_, subIndex) => (
                        <div
                          key={subIndex}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="bg-gray-300 h-5 rounded-md w-1/2"></div>
                          <div className="bg-gray-300 h-4 rounded-md w-3/4 mt-1"></div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {[...Array(3)].map((_, techIndex) => (
                              <div
                                key={techIndex}
                                className="bg-gray-300 h-5 w-12 rounded-full"
                              ></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
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
          Our Services
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services && services.length>0 && services.map((service, index) => (
            <motion.div
              key={service.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {service.category}
                </h2>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="space-y-4">
                  {service.sub_services.map((subService) => (
                    <motion.div
                      key={subService.name}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {subService.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{subService.description}</p>
                      {subService.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {subService.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
