'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageTitle: string;
  imageSrc: string;
  imageSlug: string;
}

export default function DownloadModal({ 
  isOpen, 
  onClose, 
  imageTitle, 
  imageSrc, 
  imageSlug 
}: DownloadModalProps) {
  const [showThankYou, setShowThankYou] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDirectDownload = async () => {
    try {
      setDownloadStarted(true);
      
      // Fetch the image and create download
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageSlug}-high-quality.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => {
        onClose();
        setDownloadStarted(false);
      }, 1500);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStarted(false);
    }
  };

  const handleSupportDownload = () => {
    // Open Buy Me A Coffee in new tab
    window.open('https://buymeacoffee.com/heretheregone', '_blank');
    setShowThankYou(true);
    
    // Auto-trigger download after 2 seconds
    setTimeout(() => {
      handleDirectDownload();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-warm-white/95 backdrop-blur-xl border border-warm-white/60 
                     rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-dark/10 hover:bg-dark/20 
                       rounded-full flex items-center justify-center transition-all duration-200 z-10"
          >
            <XMarkIcon className="w-4 h-4 text-dark/70" />
          </button>

          {/* Content */}
          <div className="p-8">
            {!showThankYou ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 
                               rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <ArrowDownTrayIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-dark mb-2">
                    Download &quot;{imageTitle}&quot;
                  </h2>
                  <p className="text-dark/60 text-sm">
                    Hochauflösende Version in bester Qualität
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {/* Support Option */}
                  <motion.button
                    onClick={handleSupportDownload}
                    className="w-full p-4 bg-gradient-to-r from-orange-500 to-pink-500 
                               hover:from-orange-600 hover:to-pink-600 rounded-2xl 
                               transition-all duration-300 group relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <HeartSolidIcon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Mit Unterstützung</div>
                          <div className="text-xs opacity-90">Buy me a coffee ☕</div>
                        </div>
                      </div>
                      <div className="text-xs opacity-75">Empfohlen</div>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent 
                                    via-white/10 to-transparent -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000" />
                  </motion.button>

                  {/* Free Option */}
                  <motion.button
                    onClick={handleDirectDownload}
                    disabled={downloadStarted}
                    className="w-full p-4 bg-dark/5 hover:bg-dark/10 border border-dark/10 
                               rounded-2xl transition-all duration-300 group disabled:opacity-50"
                    whileHover={{ scale: downloadStarted ? 1 : 1.02 }}
                    whileTap={{ scale: downloadStarted ? 1 : 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-dark/10 rounded-full flex items-center justify-center">
                          {downloadStarted ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full"
                            />
                          ) : (
                            <ArrowDownTrayIcon className="w-5 h-5 text-dark/70" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-dark">
                            {downloadStarted ? 'Download läuft...' : 'Kostenlos'}
                          </div>
                          <div className="text-xs text-dark/60">Ohne Unterstützung</div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-dark/10">
                  <p className="text-xs text-dark/50 text-center leading-relaxed">
                    Deine Unterstützung hilft mir, weiterhin kostenlose 
                    hochwertige Fotos zu teilen. Vielen Dank! 🙏
                  </p>
                </div>
              </>
            ) : (
              /* Thank You State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 
                             rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <HeartSolidIcon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-dark mb-2">
                  Vielen Dank! 🙏
                </h2>
                <p className="text-dark/60 text-sm mb-4">
                  Deine Unterstützung bedeutet mir sehr viel!
                </p>
                <div className="text-xs text-dark/50">
                  Download startet automatisch...
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}