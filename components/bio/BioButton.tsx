"use client";

interface BioButtonProps {
  label: string;
  href: string;
  accentColor?: string;
  textColor?: string;
}

export default function BioButton({
  label,
  href,
  accentColor = "#3E47A8",
  textColor = "#ffffff",
}: BioButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.97]"
      style={{
        background: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #EC4899 100%)",
        color: "#ffffff",
        boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
      }}
    >
      {label}
    </a>
  );
}
