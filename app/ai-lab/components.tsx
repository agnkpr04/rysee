"use client";

import { useState } from "react";
import {
  ImageIcon, Type, Wand2, Download, RefreshCw, Copy, Check, Sparkles,
  Palette, Layout, MessageSquare, Hash, AlertTriangle, ChevronRight,
  Instagram, Youtube, Clapperboard, Globe, Layers,
} from "lucide-react";

export const accentBg = "bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

/* ─── Dummy Data ─── */
const DUMMY_IMAGE_HISTORY = [
  { id: "1", prompt: "Minimalist coffee shop Instagram post", platform: "Instagram", style: "Minimalist", createdAt: "2 menit yang lalu", url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop" },
  { id: "2", prompt: "Vintage aesthetic story template", platform: "Instagram Story", style: "Vintage", createdAt: "1 jam yang lalu", url: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&h=400&fit=crop" },
];

const DUMMY_CAPTION_HISTORY = [
  { id: "1", platform: "Instagram", tone: "Casual", text: "Ngopi sambil mikirin cara jadi miliarder. Step 1: Start dari sekarang ✨☕ #motivasihidup", createdAt: "5 menit yang lalu" },
  { id: "2", platform: "TikTok", tone: "Professional", text: "3 Strategi konten yang bikin engagement naik 200% di 2025. Swipe up! 🚀", createdAt: "30 menit yang lalu" },
];

const PLATFORMS = [
  { label: "Instagram Post", icon: Instagram, value: "instagram-post" },
  { label: "Instagram Story", icon: Layers, value: "instagram-story" },
  { label: "YouTube Thumb", icon: Youtube, value: "youtube-thumbnail" },
  { label: "TikTok Overlay", icon: Clapperboard, value: "tiktok-overlay" },
  { label: "Twitter/X", icon: Globe, value: "twitter-header" },
  { label: "LinkedIn", icon: Globe, value: "linkedin-banner" },
];

const STYLES = ["Minimalist", "Vintage", "Modern", "Nature", "Urban", "Gradient", "Dark Mode", "Pastel"];
const COLORS = [
  { name: "Monochrome", hex: ["#1a1a1a", "#f5f5f5", "#888888"] },
  { name: "Warm Earth", hex: ["#8B5CF6", "#D946EF", "#EC4899"] },
  { name: "Ocean Blue", hex: ["#0ea5e9", "#6366f1", "#a855f7"] },
  { name: "Sunset", hex: ["#f97316", "#ef4444", "#db2777"] },
  { name: "Forest", hex: ["#22c55e", "#16a34a", "#15803d"] },
  { name: "Pastel", hex: ["#f9a8d4", "#c4b5fd", "#93c5fd"] },
];
const TONES = ["Formal", "Casual", "Professional", "Humor", "Inspirational", "Salesy"];

/* ─── Confirm Dialog ─── */
function ConfirmDialog({ open, quotaLabel, onCancel, onConfirm }: {
  open: boolean; quotaLabel: string; onCancel: () => void; onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-50 rounded-full"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>
          <h3 className="text-lg font-medium text-[#18181B]">Konfirmasi Generate</h3>
        </div>
        <p className="text-sm text-[#71717A] font-light mb-6">
          Generate akan menghabiskan <span className="font-medium text-[#18181B]">1 {quotaLabel}</span>. Lanjutkan?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition text-sm font-light">Batal</button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2 ${accentBg} text-white rounded-lg hover:opacity-90 transition text-sm font-light`}>Lanjutkan</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Quota Card ─── */
export function QuotaCard({ imageUsed, imageTotal, captionUsed, captionTotal }: {
  imageUsed: number; imageTotal: number; captionUsed: number; captionTotal: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {[
        { label: "Image Quota", used: imageUsed, total: imageTotal, icon: ImageIcon },
        { label: "Caption Quota", used: captionUsed, total: captionTotal, icon: Type },
      ].map((q) => (
        <div key={q.label} className="bg-white p-5 rounded-xl border border-gray-50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${accentBg}`}><q.icon className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-sm text-[#A1A1AA] font-light">{q.label}</p>
              <p className="text-lg font-light text-[#18181B]"><span className="font-medium">{q.total - q.used}</span> / {q.total} tersisa</p>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${accentBg}`} style={{ width: `${(q.used / q.total) * 100}%` }} />
          </div>
          <p className="text-xs text-[#A1A1AA] font-light mt-2">{q.used} digunakan bulan ini</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Image Generator ─── */
export function ImageGenerator() {
  const [platform, setPlatform] = useState("instagram-post");
  const [style, setStyle] = useState("Minimalist");
  const [color, setColor] = useState("Monochrome");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState(DUMMY_IMAGE_HISTORY);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleGenerate = () => { if (prompt.trim()) setShowConfirm(true); };
  const confirmGenerate = () => {
    setShowConfirm(false); setIsGenerating(true); setPreviewUrl(null);
    setTimeout(() => {
      const url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1024&h=1024&fit=crop";
      setIsGenerating(false); setPreviewUrl(url);
      setHistory(p => [{ id: Date.now().toString(), prompt, platform, style, createdAt: "Baru saja", url }, ...p]);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog open={showConfirm} quotaLabel="Image Quota" onCancel={() => setShowConfirm(false)} onConfirm={confirmGenerate} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
            <h3 className="text-base font-medium text-[#18181B] mb-5 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#D946EF]" />Template Settings</h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#18181B] mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => (
                  <button key={p.value} onClick={() => setPlatform(p.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-light transition ${
                      platform === p.value ? "border-[#D946EF] bg-purple-50 text-[#8B5CF6]" : "border-gray-100 hover:border-gray-200 text-[#71717A]"
                    }`}>
                    <p.icon className="w-4 h-4" />{p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-[#18181B] mb-2 flex items-center gap-2"><Layout className="w-4 h-4" /> Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button key={s} onClick={() => setStyle(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-light border transition ${
                      style === s ? "border-[#D946EF] bg-purple-50 text-[#8B5CF6]" : "border-gray-100 hover:border-gray-200 text-[#71717A]"
                    }`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-[#18181B] mb-2 flex items-center gap-2"><Palette className="w-4 h-4" /> Color Palette</label>
              <div className="grid grid-cols-3 gap-2">
                {COLORS.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)}
                    className={`p-2 rounded-lg border text-xs font-light transition text-center ${
                      color === c.name ? "border-[#D946EF] bg-purple-50 text-[#8B5CF6]" : "border-gray-100 hover:border-gray-200 text-[#71717A]"
                    }`}>
                    <div className="flex justify-center gap-1 mb-1.5">
                      {c.hex.map((h, i) => <div key={i} className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: h }} />)}
                    </div>{c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#18181B] mb-2">Prompt / Deskripsi</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Contoh: Minimalist coffee shop Instagram post dengan tone hangat..."
                className="w-full px-4 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#D946EF]/20 focus:border-[#D946EF] outline-none text-sm font-light resize-none" rows={4} />
              <p className="text-xs text-[#A1A1AA] font-light mt-1">{prompt.length}/500 karakter</p>
            </div>

            <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}
              className={`w-full py-3 rounded-lg text-white font-light text-sm flex items-center justify-center gap-2 transition ${
                !prompt.trim() || isGenerating ? "bg-gray-300 cursor-not-allowed" : `${accentBg} hover:opacity-90`
              }`}>
              {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4" /> Generate Template</>}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm min-h-[400px]">
            <h3 className="text-base font-medium text-[#18181B] mb-5 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-[#8B5CF6]" /> Preview</h3>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16 mb-4">
                  <div className={`absolute inset-0 rounded-full ${accentBg} opacity-20 animate-ping`} />
                  <div className={`relative w-16 h-16 rounded-full ${accentBg} flex items-center justify-center`}>
                    <Wand2 className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>
                <p className="text-sm text-[#71717A] font-light">AI sedang membuat template...</p>
                <p className="text-xs text-[#A1A1AA] font-light mt-1">Estimasi 2-5 detik</p>
              </div>
            ) : previewUrl ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-[#F9F9FB]">
                  <img src={previewUrl} alt="Generated template" className="w-full h-auto object-cover" />
                </div>
                <div className="flex gap-3">
                  <button className={`flex-1 py-2.5 rounded-lg ${accentBg} text-white text-sm font-light hover:opacity-90 transition flex items-center justify-center gap-2`}>
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button className="px-4 py-2.5 border border-gray-100 rounded-lg text-sm font-light text-[#71717A] hover:bg-gray-50 transition flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#F9F9FB] flex items-center justify-center mb-4"><ImageIcon className="w-8 h-8 text-[#A1A1AA]" /></div>
                <p className="text-sm text-[#71717A] font-light">Belum ada hasil generate</p>
                <p className="text-xs text-[#A1A1AA] font-light mt-1">Isi form dan klik Generate untuk melihat preview</p>
              </div>
            )}
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
            <h3 className="text-sm font-medium text-[#18181B] mb-4">Riwayat Generate</h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-[#F9F9FB] hover:bg-gray-50 transition cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#18181B] font-light truncate">{item.prompt}</p>
                    <p className="text-xs text-[#A1A1AA] font-light">{item.platform} · {item.style} · {item.createdAt}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Caption Generator ─── */
export function CaptionGenerator() {
  const [platform, setPlatform] = useState("instagram-post");
  const [tone, setTone] = useState("Casual");
  const [topic, setTopic] = useState("");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(DUMMY_CAPTION_HISTORY);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleGenerate = () => { if (topic.trim()) setShowConfirm(true); };
  const confirmGenerate = () => {
    setShowConfirm(false); setIsGenerating(true); setResult(null);
    setTimeout(() => {
      const text = includeHashtags
        ? `${topic} adalah kunci untuk membangun personal branding yang kuat. Jangan takut untuk mulai dari langkah kecil, karena konsistensi akan membawamu ke hasil yang besar. ✨\n\n#personalbranding #digitalmarketing #contentcreator #motivasi #tipsbisnis`
        : `${topic} adalah kunci untuk membangun personal branding yang kuat. Jangan takut untuk mulai dari langkah kecil, karena konsistensi akan membawamu ke hasil yang besar. ✨`;
      setIsGenerating(false); setResult(text);
      setHistory(p => [{ id: Date.now().toString(), platform, tone, text, createdAt: "Baru saja" }, ...p]);
    }, 1500);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog open={showConfirm} quotaLabel="Caption Quota" onCancel={() => setShowConfirm(false)} onConfirm={confirmGenerate} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
            <h3 className="text-base font-medium text-[#18181B] mb-5 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#D946EF]" /> Caption Settings</h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#18181B] mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.slice(0, 4).map((p) => (
                  <button key={p.value} onClick={() => setPlatform(p.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-light transition ${
                      platform === p.value ? "border-[#D946EF] bg-purple-50 text-[#8B5CF6]" : "border-gray-100 hover:border-gray-200 text-[#71717A]"
                    }`}>
                    <p.icon className="w-4 h-4" />{p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-[#18181B] mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Tone of Voice</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button key={t} onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-light border transition ${
                      tone === t ? "border-[#D946EF] bg-purple-50 text-[#8B5CF6]" : "border-gray-100 hover:border-gray-200 text-[#71717A]"
                    }`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#18181B] mb-2">Topik / Konteks</label>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="Contoh: Tips memulai bisnis online untuk pemula di 2025..."
                className="w-full px-4 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#D946EF]/20 focus:border-[#D946EF] outline-none text-sm font-light resize-none" rows={4} />
              <p className="text-xs text-[#A1A1AA] font-light mt-1">{topic.length}/500 karakter</p>
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[#F9F9FB]">
              <Hash className="w-4 h-4 text-[#8B5CF6]" />
              <div className="flex-1">
                <p className="text-sm text-[#18181B] font-light">Sertakan hashtag</p>
                <p className="text-xs text-[#A1A1AA] font-light">AI akan otomatis generate hashtag relevan</p>
              </div>
              <button onClick={() => setIncludeHashtags(!includeHashtags)} className={`relative w-11 h-6 rounded-full transition ${includeHashtags ? accentBg : "bg-gray-200"}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${includeHashtags ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <button onClick={handleGenerate} disabled={!topic.trim() || isGenerating}
              className={`w-full py-3 rounded-lg text-white font-light text-sm flex items-center justify-center gap-2 transition ${
                !topic.trim() || isGenerating ? "bg-gray-300 cursor-not-allowed" : `${accentBg} hover:opacity-90`
              }`}>
              {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4" /> Generate Caption</>}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm min-h-[400px]">
            <h3 className="text-base font-medium text-[#18181B] mb-5 flex items-center gap-2"><Type className="w-4 h-4 text-[#8B5CF6]" /> Hasil Caption</h3>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16 mb-4">
                  <div className={`absolute inset-0 rounded-full ${accentBg} opacity-20 animate-ping`} />
                  <div className={`relative w-16 h-16 rounded-full ${accentBg} flex items-center justify-center`}>
                    <Wand2 className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>
                <p className="text-sm text-[#71717A] font-light">AI sedang menulis caption...</p>
                <p className="text-xs text-[#A1A1AA] font-light mt-1">Estimasi 1-3 detik</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-[#F9F9FB] border border-gray-100">
                  <p className="text-sm text-[#18181B] font-light whitespace-pre-wrap leading-relaxed">{result}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCopy}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-light transition flex items-center justify-center gap-2 ${
                      copied ? "bg-green-50 text-green-700 border border-green-100" : `${accentBg} text-white hover:opacity-90`
                    }`}>
                    {copied ? <><Check className="w-4 h-4" /> Tersalin!</> : <><Copy className="w-4 h-4" /> Salin Caption</>}
                  </button>
                  <button className="px-4 py-2.5 border border-gray-100 rounded-lg text-sm font-light text-[#71717A] hover:bg-gray-50 transition flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#F9F9FB] flex items-center justify-center mb-4"><Type className="w-8 h-8 text-[#A1A1AA]" /></div>
                <p className="text-sm text-[#71717A] font-light">Belum ada hasil generate</p>
                <p className="text-xs text-[#A1A1AA] font-light mt-1">Isi form dan klik Generate untuk melihat preview</p>
              </div>
            )}
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
            <h3 className="text-sm font-medium text-[#18181B] mb-4">Riwayat Caption</h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg bg-[#F9F9FB] hover:bg-gray-50 transition cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Type className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#18181B] font-light line-clamp-2">{item.text}</p>
                    <p className="text-xs text-[#A1A1AA] font-light mt-0.5">{item.platform} · {item.tone} · {item.createdAt}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
