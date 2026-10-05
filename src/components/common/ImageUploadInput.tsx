import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Check } from 'lucide-react';
import { alertDialog } from '../../lib/dialog';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  className?: string;
  helperText?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = '',
  helperText,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alertDialog('Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WEBP vb.)');
      return;
    }

    // Shrink before storing: images are saved inside the site content on the server, which has a size limit.
    const reader = new FileReader();
    reader.onload = (event) => {
      const original = event.target?.result as string;
      if (!original) return;
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        onChange(original);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const keepAlpha = file.type === 'image/png' || file.type === 'image/webp';
        const MAX = keepAlpha ? 800 : 1000;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          onChange(original);
          return;
        }
        if (!keepAlpha) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = keepAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.8);
        onChange(compressed.length < original.length ? compressed : original);
      };
      img.onerror = () => onChange(original);
      img.src = original;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* Toggle between Upload File and URL */}
        <div className="flex bg-slate-100 p-0.5 rounded-md text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>Dosya Yükle</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>Link / URL</span>
          </button>
        </div>
      </div>

      {/* Main input & Preview box */}
      <div className="space-y-2">
        {activeMode === 'upload' ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragOver 
                  ? 'border-[#C8B273] bg-[#F7F5EC]' 
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-2 bg-white rounded-full shadow-xs border">
                  <Upload className="h-4 w-4 text-[#163A4A]" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-xs font-bold text-slate-800">
                    Cihazınızdan fotoğraf seçin veya buraya sürükleyin
                  </p>
                  <p className="text-[10px] text-slate-400">
                    PNG, JPG, WEBP, GIF desteklenir
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border rounded-xl font-mono text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#C8B273]"
            />
          </div>
        )}

        {/* Image Preview if value exists */}
        {value && (
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border bg-white shrink-0 shadow-xs">
              <img
                src={value}
                alt="Seçilen fotoğraf"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback on broken image
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 text-left rtl:text-right">
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-700">
                <Check className="h-3.5 w-3.5" />
                <span>Fotoğraf hazır</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                {value.startsWith('data:') ? 'Yerel Dosya (Base64 Data Image)' : value}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white cursor-pointer transition-colors"
              title="Fotoğrafı Kaldır"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[10px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
