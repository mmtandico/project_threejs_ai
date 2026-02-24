import React from 'react';

import { PresetDesigns } from '../config/constants';

const PresetCarousel = () => {
  // Duplicate the presets so the row feels longer and more continuous
  const displayPresets = [...PresetDesigns, ...PresetDesigns];

  return (
    <div className="pointer-events-auto w-full flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-end justify-center gap-6 overflow-x-auto pb-1 custom-scrollbar snap-x snap-mandatory">
          {displayPresets.map((preset, index) => (
            <div
              key={preset.id}
              className="flex-shrink-0 snap-center"
              style={{ width: 170 }}
            >
              <div className="relative w-full aspect-[3/4] flex items-center justify-center transition-transform duration-200 hover:scale-105">
                <img
                  src={preset.thumbnail}
                  alt={`${preset.name}-${index}`}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresetCarousel;
