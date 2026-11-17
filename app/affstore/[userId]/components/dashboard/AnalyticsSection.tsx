"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, MousePointer2, ShoppingBag, ChevronDown, Eye, Lock } from 'lucide-react';

interface AnalyticsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  analytics: {
    totalClicks: number;
    totalProducts: number;
    clicksByProduct: any[];
    recentClicks: any[];
    totalStoreVisits?: number;
    storeVisitsLast7Days?: number;
    storeVisitsLast30Days?: number;
    plan?: string;
    canViewAdvancedAnalytics?: boolean;
  };
  isLoading: boolean;
}

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const textGradient = {
  background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const getPlanBadgeColor = (plan?: string) => {
  switch (plan?.toLowerCase()) {
    case 'pro':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    default:
      return 'bg-gray-400';
  }
};

const getPlanBadgeText = (plan?: string) => {
  switch (plan?.toLowerCase()) {
    case 'pro':
      return 'PRO';
    default:
      return 'FREE';
  }
};

export default function AnalyticsSection({ isOpen, onToggle, analytics, isLoading }: AnalyticsSectionProps) {
  return (
    <div className="mx-4 md:mx-8 border-y border-gray-50 bg-white transition-all">
      <button 
        onClick={onToggle}
        className="w-full py-5 px-4 md:px-0 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider font-light text-[#A1A1AA] group-hover:text-[#18181B] transition-colors flex items-center gap-3">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            Store Analytics
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[#A1A1AA]"
        >
          <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pb-10 pt-2 px-4 md:px-0">
              {isLoading ? (
                <div className="col-span-3 flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Basic Analytics - Available for all plans */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-purple-500/10 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                        <MousePointer2 className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1">total clicks</p>
                    <p className="text-2xl md:text-3xl font-light tracking-tighter" style={textGradient}>{analytics.totalClicks}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-purple-500/10 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                        <ShoppingBag className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1">total products</p>
                    <p className="text-2xl md:text-3xl font-light tracking-tighter" style={textGradient}>{analytics.totalProducts}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-purple-500/10 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                        <TrendingUp className="w-4 h-4 text-[#D946EF]" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1">avg clicks/product</p>
                    <p className="text-2xl md:text-3xl font-light tracking-tighter" style={textGradient}>
                      {analytics.totalProducts > 0 ? (analytics.totalClicks / analytics.totalProducts).toFixed(1) : '0'}
                    </p>
                  </div>

                  {/* Advanced Analytics - Only for PRO */}
                  {analytics.canViewAdvancedAnalytics ? (
                    <>
                      <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-purple-500/10 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                          <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                            <Eye className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1">total store visits</p>
                        <p className="text-2xl md:text-3xl font-light tracking-tighter" style={textGradient}>{analytics.totalStoreVisits || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-purple-500/10 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                          <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                            <TrendingUp className="w-4 h-4 text-[#D946EF]" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1">visits (7 days)</p>
                        <p className="text-2xl md:text-3xl font-light tracking-tighter" style={textGradient}>{analytics.storeVisitsLast7Days || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-purple-500/10 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                          <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                            <TrendingUp className="w-4 h-4 text-[#EC4899]" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1">visits (30 days)</p>
                        <p className="text-2xl md:text-3xl font-light tracking-tighter" style={textGradient}>{analytics.storeVisitsLast30Days || 0}</p>
                      </div>
                    </>
                  ) : (
                    /* Locked Advanced Analytics for FREE users */
                    <>
                      <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <Lock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                            <p className="text-[10px] text-gray-500 font-medium">Upgrade to PRO</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 opacity-30">
                          <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                            <Eye className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1 opacity-30">total store visits</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <Lock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                            <p className="text-[10px] text-gray-500 font-medium">Upgrade to PRO</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 opacity-30">
                          <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                            <TrendingUp className="w-4 h-4 text-[#D946EF]" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1 opacity-30">visits (7 days)</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <Lock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                            <p className="text-[10px] text-gray-500 font-medium">Upgrade to PRO</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 opacity-30">
                          <div className={`p-2 bg-gradient-to-r ${accentGradient} opacity-10 rounded-full`}>
                            <TrendingUp className="w-4 h-4 text-[#EC4899]" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-light mb-1 opacity-30">visits (30 days)</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
