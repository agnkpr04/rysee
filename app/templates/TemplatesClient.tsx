'use client';

import { useEffect, useState } from 'react';
import { MasterTemplate } from '@/lib/templates/types';
import { supabase } from '@/lib/supabase';
import TemplateCard from '@/components/templates/TemplateCard';
import TemplateDetailModal from '@/components/TemplateDetailModal';
import GlobalNavbar from '@/components/GlobalNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Search, ChevronDown } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function TemplatesClient({ initialTemplates }: { initialTemplates: MasterTemplate[] }) {
  const [templates] = useState<MasterTemplate[]>(initialTemplates);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedStatusFilter, setAddedStatusFilter] = useState<'all' | 'added' | 'not_added'>('all');
  const [user, setUser] = useState<any>(null);
  const [userTemplates, setUserTemplates] = useState<any[]>([]);
  const [userTemplateIds, setUserTemplateIds] = useState<Set<string>>(new Set());
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MasterTemplate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const categories = [
    { value: '', label: 'All' },
    { value: 'landing-page', label: 'Landing Page' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'blog', label: 'Blog' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' },
  ];

  // Dynamic: Get unique categories that have templates
  const availableCategories = [...new Set(templates.map(t => t.category))].filter(Boolean);

  // Filter categories to only show available categories
  const filteredCategories = categories.filter(opt =>
    opt.value === '' || availableCategories.includes(opt.value)
  );

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserTemplates();
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserTemplates();
      } else {
        setUserTemplates([]);
        setUserTemplateIds(new Set());
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === '' || template.category === selectedCategory;
    const matchesSearch = searchQuery === '' || template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAddedStatus = addedStatusFilter === 'all' ||
      (addedStatusFilter === 'added' && userTemplateIds.has(template.id)) ||
      (addedStatusFilter === 'not_added' && !userTemplateIds.has(template.id));
    return matchesCategory && matchesSearch && matchesAddedStatus;
  });

  const fetchUserTemplates = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUserTemplates([]);
        setUserTemplateIds(new Set());
        return;
      }

      const res = await fetch('/api/user-templates', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const templates = data.userTemplates || [];
        setUserTemplates(templates);
        setUserTemplateIds(new Set(templates.map((t: any) => t.masterTemplateId)));
      } else {
        setUserTemplates([]);
        setUserTemplateIds(new Set());
      }
    } catch (err) {
      console.error("Failed to load user templates", err);
      setUserTemplates([]);
      setUserTemplateIds(new Set());
    }
  };

  const handleAddTemplate = async (templateId: string) => {
    if (!user) {
      alert('Please login to add templates to your store');
      return;
    }

    if (userTemplateIds.has(templateId)) {
      alert('Template already added to your store');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/user-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ masterTemplateId: templateId }),
      });

      if (response.ok) {
        alert('Template added to your store!');
        fetchUserTemplates();
      } else {
        const error = await response.json();
        // Check if error is about premium requirement
        if (response.status === 403 && error.error?.toLowerCase().includes('premium')) {
          setShowPremiumPopup(true);
        } else {
          alert(error.error || 'Failed to add template');
        }
      }
    } catch (error) {
      console.error('Error adding template:', error);
      alert('Failed to add template');
    }
  };

  const handleTemplateClick = (template: MasterTemplate) => {
    setSelectedTemplate(template);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <GlobalNavbar />
      {/* Category Filter + Search - Inside container to align with product grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-4 flex flex-col gap-4 border-b border-gray-50 bg-white/80 backdrop-blur-md z-40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          {/* Category Filter - Mobile Dropdown / Desktop Buttons */}
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            {/* Mobile: Dropdown */}
            <div className="md:hidden w-full relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-[#F9F9FB] border border-gray-200 rounded-lg py-2.5 px-4 text-[12px] outline-none focus:border-[#8B5CF6] transition-all font-light text-[#18181B]"
              >
                {filteredCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" strokeWidth={1.5} />
            </div>
            {/* Desktop: Horizontal Buttons */}
            <div className="hidden md:flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
                    selectedCategory === cat.value ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text" placeholder="Search" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-black/10 rounded-lg py-2 px-5 text-[12px] outline-none focus:border-[#8B5CF6] transition-all font-light placeholder:text-[#A1A1AA]"
            />
            <Search className="absolute right-4 top-2.5 w-3.5 h-3.5 text-[#A1A1AA]" strokeWidth={1.5} />
          </div>
        </div>
        {/* Added Status Filter */}
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setAddedStatusFilter('all')}
            className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
              addedStatusFilter === 'all' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setAddedStatusFilter('added')}
            className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
              addedStatusFilter === 'added' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            Added
          </button>
          <button
            onClick={() => setAddedStatusFilter('not_added')}
            className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
              addedStatusFilter === 'not_added' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            Not Added
          </button>
        </div>
      </div>

      {/* Template Grid - Inside container */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-12 pb-24 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isAdded={userTemplateIds.has(template.id)}
                onAdd={() => handleAddTemplate(template.id)}
                onClick={() => handleTemplateClick(template)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-[#A1A1AA] mt-8 text-xs font-light">
              No templates found.
            </div>
          )}
        </div>
      </div>

      {/* Premium Required Popup */}
      <AnimatePresence>
        {showPremiumPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPremiumPopup(false)} className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-50 p-8 relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6]/10 via-[#D946EF]/10 to-[#EC4899]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-[#D946EF]" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-light text-[#18181B] mb-2">Template Premium Only</h2>
              <p className="text-[12px] text-[#A1A1AA] mb-6 font-light">Template website hanya tersedia untuk member Premium. Upgrade sekarang untuk akses unlimited!</p>
              <div className="space-y-3">
                <button onClick={() => { setShowPremiumPopup(false); window.location.href = '/#pricing'; }} className="w-full py-3 rounded-xl text-xs font-medium bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white hover:opacity-90 transition-all">
                  Upgrade ke Premium
                </button>
                <button onClick={() => setShowPremiumPopup(false)} className="w-full py-3 rounded-xl text-xs font-medium bg-[#F9F9FB] text-[#18181B] hover:bg-[#F0F0F2] transition-all">
                  Nanti Saja
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onAddToStore={handleAddTemplate}
          isAdded={userTemplateIds.has(selectedTemplate.id)}
          showAddButton={true}
        />
      )}
    </div>
  );
}
