"use client";

interface BioHeaderProps {
  avatarUrl?: string | null;
  storeName?: string | null;
  bioDescription?: string | null;
  themeColor?: string;
  textColor?: string;
  profileFrameType?: string;
  frameThickness?: number;
}

export default function BioHeader({
  avatarUrl,
  storeName,
  bioDescription,
  themeColor = "#D1D1D4",
  textColor = "#1e293b",
  profileFrameType = "none",
  frameThickness = 3,
}: BioHeaderProps) {
  const displayName = storeName || "My Store";

  const getFrameStyle = () => {
    if (profileFrameType === "none" || !profileFrameType) return {};

    const thickness = frameThickness || 5;
    const baseStyle: React.CSSProperties = {
      padding: `${thickness}px`,
      borderRadius: "50%",
    };

    switch (profileFrameType) {
      case "pro":
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
        };
      case "elite":
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
        };
      case "elite-yellow":
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
        };
      case "elite-orange":
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #FB923C, #EA580C)",
        };
      case "elite-pink":
        return {
          ...baseStyle,
          background: "linear-gradient(135deg, #F472B6, #DB2777)",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="flex flex-col items-center text-center mb-8">
      {avatarUrl ? (
        <div style={getFrameStyle()} className="mb-4">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-24 h-24 rounded-full object-cover bg-gray-100"
          />
        </div>
      ) : (
        <div
          className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
          style={{ border: `3px solid ${themeColor}` }}
        >
          <span className="text-3xl font-light text-gray-300">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <h1
        className="text-xl font-light mb-2"
        style={{ color: textColor, fontFamily: "Poppins, sans-serif" }}
      >
        {displayName}
      </h1>

      {bioDescription && (
        <p
          className="text-sm font-light max-w-md leading-relaxed"
          style={{ color: textColor, opacity: 0.7 }}
        >
          {bioDescription}
        </p>
      )}
    </div>
  );
}
