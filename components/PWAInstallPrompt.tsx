"use client";

import { useEffect, useState } from 'react';
import { Download, X, Share, ArrowUp, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    console.log('PWAInstallPrompt useEffect started');
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    setIsStandalone(standalone);
    console.log('Standalone check:', standalone);

    if (standalone) return;

    // Check if dismissed before (session only)
    const wasDismissed = sessionStorage.getItem('pwa-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      console.log('Already dismissed this session');
      return;
    }

    // Detect iOS - more robust detection
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                  /Macintosh/.test(ua) && 'ontouchend' in document;
    setIsIOS(isiOS);
    console.log('iOS detection:', isiOS, 'UA:', ua, 'Platform:', navigator.platform, 'Touch points:', navigator.maxTouchPoints);

    if (isiOS) {
      // iOS: show prompt immediately (no delay)
      console.log('iOS detected, showing prompt immediately');
      setShowPrompt(true);
      return;
    }

    // Chrome/Android: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    console.log('handleInstall called', { isIOS, deferredPrompt });
    if (isIOS) {
      console.log('Showing iOS guide');
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDismissed(true);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  const handleUnhide = () => {
    setDismissed(false);
    setShowPrompt(true);
    sessionStorage.removeItem('pwa-dismissed');
  };

  if (isStandalone) return null;

  return (
    <>
      {/* iOS Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end justify-center"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-t-2xl p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-[#18181B]">Install Rysee App</h3>
                <button onClick={handleDismiss} className="text-[#A1A1AA] hover:text-[#18181B] transition-colors">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-[#8B5CF6]">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#18181B]">Tap tombol Share</p>
                    <p className="text-xs text-[#A1A1AA] mt-1">Ketuk ikon <Share className="w-3 h-3 inline text-[#8B5CF6]" /> di bagian bawah browser Safari</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#D946EF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-[#D946EF]">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#18181B]">Scroll ke bawah</p>
                    <p className="text-xs text-[#A1A1AA] mt-1">Cari opsi &quot;Add to Home Screen&quot; atau &quot;Tambah ke Layar Utama&quot;</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EC4899]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-[#EC4899]">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#18181B]">Tap &quot;Add&quot;</p>
                    <p className="text-xs text-[#A1A1AA] mt-1">Rysee akan terinstall di home screen Anda seperti aplikasi native</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <ArrowUp className="w-5 h-5 text-[#A1A1AA] animate-bounce" strokeWidth={1.5} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!showIOSGuide && showPrompt && !dismissed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-20 md:bottom-8 right-4 z-50"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-[#F9F9FB] transition-all text-[#A1A1AA] hover:text-[#18181B]"
              title="Hide"
            >
              <EyeOff className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Unhide Button */}
      {!showIOSGuide && dismissed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleUnhide}
          className="fixed bottom-20 md:bottom-8 right-4 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-[#F9F9FB] transition-all text-[#8B5CF6]"
          title="Show Install Button"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
        </motion.button>
      )}
    </>
  );
}
