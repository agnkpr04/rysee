"use client";

import { useState } from "react";
import { ImageIcon, Type, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QuotaCard, ImageGenerator, CaptionGenerator } from "./components";

const accentBg = "bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

type Tab = "image" | "caption";

export default function AIGeneratorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("image");

  return (
    <div className="min-h-screen bg-[#F9F9FB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition text-[#71717A]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-light text-[#18181B]">AI Generator</h1>
            <p className="text-sm text-[#A1A1AA] font-light">
              Generate template & caption otomatis dengan AI
            </p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100 text-yellow-700 text-xs font-light">
            Dev Mode — Hidden
          </span>
        </div>

        {/* Quota */}
        <QuotaCard imageUsed={2} imageTotal={10} captionUsed={5} captionTotal={50} />

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-50 shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-gray-50">
            <button
              onClick={() => setActiveTab("image")}
              className={`flex-1 px-6 py-4 text-sm font-light flex items-center justify-center gap-2 transition border-b-2 ${
                activeTab === "image"
                  ? "border-[#D946EF] text-[#8B5CF6]"
                  : "border-transparent text-[#A1A1AA] hover:text-[#71717A]"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Image Template
            </button>
            <button
              onClick={() => setActiveTab("caption")}
              className={`flex-1 px-6 py-4 text-sm font-light flex items-center justify-center gap-2 transition border-b-2 ${
                activeTab === "caption"
                  ? "border-[#D946EF] text-[#8B5CF6]"
                  : "border-transparent text-[#A1A1AA] hover:text-[#71717A]"
              }`}
            >
              <Type className="w-4 h-4" />
              Caption Generator
            </button>
          </div>

          <div className="p-6">
            {activeTab === "image" ? <ImageGenerator /> : <CaptionGenerator />}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-[#A1A1AA] font-light py-4">
          AI Generator — Rysee Dev Build · Fitur ini belum tersedia untuk publik
        </div>
      </div>
    </div>
  );
}
