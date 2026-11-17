"use client";

import Link from 'next/link';
import { Instagram, Youtube, MessageCircle, HelpCircle, Mail, FileText, Shield } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const ryseeGradient = "from-[#8B5CF6] via-[#D946EF] to-[#FBBF24]";

const WHATSAPP_LINK = "https://chat.whatsapp.com/LUABEZndu8w0hOMTf7iLvp?mode=gi_t";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Platform */}
          <div>
            <h3 className="text-xs font-medium text-[#18181B] mb-4 tracking-wider uppercase">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/affstore" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/#introduction" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Support */}
          <div>
            <h3 className="text-xs font-medium text-[#18181B] mb-4 tracking-wider uppercase">Community</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp Community
                </a>
              </li>
              <li>
                <Link href="/help" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
                  <HelpCircle className="w-3 h-3" />
                  Help
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3 h-3" />
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-medium text-[#18181B] mb-4 tracking-wider uppercase">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ketentuan-layanan" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="text-xs text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xs font-medium text-[#18181B] mb-4 tracking-wider uppercase">Follow Us</h3>
            <div className="flex gap-3">
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#F9F9FB] flex items-center justify-center text-[#A1A1AA] hover:text-[#8B5CF6] hover:bg-white transition-all"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#F9F9FB] flex items-center justify-center text-[#A1A1AA] hover:text-[#8B5CF6] hover:bg-white transition-all"
              >
                <Youtube className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-12 pt-8 border-t border-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#FBBF24] bg-clip-text text-transparent mb-1">Rysee</h4>
              <p className="text-xs text-[#A1A1AA]">Platform affiliate modern untuk Indonesia</p>
            </div>
            <p className="text-[10px] text-[#A1A1AA] tracking-wider">
              © 2026 Rysee. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
