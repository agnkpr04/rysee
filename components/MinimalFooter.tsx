"use client";

import Link from 'next/link';
import { FileText, Shield, HelpCircle } from 'lucide-react';


export default function MinimalFooter() {
  return (
    <footer className="bg-white border-t border-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Legal Links */}
          <div className="flex gap-6">
            <Link href="/ketentuan-layanan" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Terms
            </Link>
            <Link href="/kebijakan-privasi" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Privacy
            </Link>
          </div>

          {/* Support Links */}
          <div className="flex gap-6">
            <Link href="/help" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
              <HelpCircle className="w-3 h-3" />
              Help
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-[#A1A1AA] tracking-wider">
            © 2026 <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#FBBF24] bg-clip-text text-transparent">Rysee</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
