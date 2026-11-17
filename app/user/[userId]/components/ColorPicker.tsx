"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Palette, X } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  restricted?: boolean;
  presetColorsOnly?: string[];
}

const presetColors = [
  '#3E47A8', '#9B7ED8', '#EF4444', '#F59E0B',
  '#10B981', '#06B6D4', '#6366F1', '#8B5CF6',
  '#EC4899', '#F43F5E', '#64748B', '#000000'
];

export default function ColorPicker({ value, onChange, label, restricted, presetColorsOnly }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: 200 }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('ColorPicker button clicked for:', label, 'current isOpen:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors cursor-pointer relative z-10"
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm">{label}</span>
        <div
          className="w-6 h-6 rounded border-2 border-white/50"
          style={{ backgroundColor: value }}
        />
      </button>

      {isOpen && (
        <div className={`absolute bottom-full mb-2 bg-white rounded-lg shadow-xl border border-black/10 p-4 z-[200] w-64 ${
          label === 'Text' || label === 'Icon' ? 'left-0 -translate-x-[60%]' : 'left-1/2 -translate-x-1/2'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="mb-3">
            {!restricted && (
              <>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full mt-2 px-3 py-1 border border-black/20 rounded text-sm"
                  placeholder="#000000"
                />
              </>
            )}
            {restricted && (
              <p className="text-xs text-slate-500">Upgrade to PRO for custom colors</p>
            )}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {(presetColorsOnly || presetColors).map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Preset color clicked:', color);
                  onChange(color);
                }}
                className="w-8 h-8 rounded border-2 border-black/10 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
