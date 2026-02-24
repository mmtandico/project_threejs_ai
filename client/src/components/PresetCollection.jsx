import React from 'react';

import { PresetDesigns } from '../config/constants';

const PresetCollection = ({ onApplyPreset }) => {
  const handleClick = (preset) => {
    if (typeof onApplyPreset === 'function') {
      onApplyPreset(preset);
    }
  };

  return (
    <div className="glassmorphism rounded-xl p-4 w-72 max-h-[70vh] flex flex-col gap-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Preset collections
          </span>
          <span className="text-sm font-bold text-gray-900">
            Professional shirt designs
          </span>
        </div>
      </div>

      <div className="mt-1 text-[11px] text-gray-600 leading-snug">
        Tap a card to instantly apply a curated color, logo and layout to your shirt.
      </div>

      <div className="mt-2 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
        {PresetDesigns.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleClick(preset)}
            className="w-full flex items-center gap-3 rounded-lg border border-white/60 bg-white/60 hover:bg-white transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            <div className="w-14 h-14 flex-shrink-0 rounded-l-lg overflow-hidden flex items-center justify-center bg-gray-100">
              <img
                src={preset.thumbnail}
                alt={preset.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 py-2 pr-3 flex flex-col gap-1 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-900">
                  {preset.name}
                </span>
                {preset.badge && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                    {preset.badge}
                  </span>
                )}
              </div>

              <p className="text-[10px] text-gray-600 line-clamp-2">
                {preset.description}
              </p>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-wide text-gray-400">
                    Base
                  </span>
                  <span
                    className="inline-flex h-3.5 w-3.5 rounded-full border border-gray-200"
                    style={{ backgroundColor: preset.color }}
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                  {preset.isLogoTexture && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100">
                      Logo
                    </span>
                  )}
                  {preset.isFullTexture && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100">
                      Full
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetCollection;
