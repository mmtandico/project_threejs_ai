import React, { useEffect, useState } from 'react';

import { PresetDesigns } from '../config/constants';
import MiniShirtPreview from './MiniShirtPreview';

const ModelLibrary = ({ onSelectPreset }) => {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'my'
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (preset) => {
    if (typeof onSelectPreset === 'function') {
      onSelectPreset(preset);
    }
  };

  const fetchSavedDesigns = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/v1/designs');
      const data = await res.json();
      setSavedDesigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load saved designs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my' && savedDesigns.length === 0) {
      fetchSavedDesigns();
    }
  }, [activeTab]);

  const renderGrid = () => {
    if (activeTab === 'library') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {PresetDesigns.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset)}
              className="w-full rounded-xl bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md border border-white/80 overflow-hidden flex flex-col items-center focus:outline-none"
            >
              <div className="w-full aspect-square bg-slate-900/95 flex items-center justify-center">
                <MiniShirtPreview preset={preset} />
              </div>
              <div className="w-full px-2 py-1.5 flex flex-col items-start gap-0.5">
                <span className="text-[10px] font-semibold text-gray-800 truncate w-full">
                  {preset.name}
                </span>
                <span className="text-[9px] text-gray-500">T‑shirt</span>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-[11px] text-gray-500">
          Loading your designs...
        </div>
      );
    }

    if (!savedDesigns.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 text-[11px] text-gray-500 gap-1.5">
          <span className="font-semibold text-gray-700">No saved designs yet</span>
          <span>Use “Save design” in the studio to store your favorite looks.</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {savedDesigns.map((design) => {
          const mappedPreset = {
            id: design._id,
            name: design.name || 'Saved design',
            color: design.color,
            logoDecal: design.logoUrl,
            fullDecal: design.textureUrl,
            isLogoTexture: design.isLogoTexture,
            isFullTexture: design.isFullTexture,
          };

          return (
            <button
              key={design._id}
              type="button"
              onClick={() => handleSelect(mappedPreset)}
              className="w-full rounded-xl bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md border border-white/80 overflow-hidden flex flex-col items-center focus:outline-none"
            >
              <div className="w-full aspect-square bg-slate-900/95 flex items-center justify-center">
                <MiniShirtPreview preset={mappedPreset} />
              </div>
              <div className="w-full px-2 py-1.5 flex flex-col items-start gap-0.5">
                <span className="text-[10px] font-semibold text-gray-800 truncate w-full">
                  {mappedPreset.name}
                </span>
                <span className="text-[9px] text-gray-500">Saved</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glassmorphism rounded-2xl w-64 h-[80vh] flex flex-col shadow-xl overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-white/70 bg-white/30 backdrop-blur-md flex items-center justify-between">
        <div className="inline-flex rounded-full bg-gray-100/80 p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1 rounded-full font-semibold text-[11px] ${
              activeTab === 'library'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`px-3 py-1 rounded-full font-medium ${
              activeTab === 'my' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            My
          </button>
        </div>
      </div>

      <div className="px-4 pt-2 pb-3 border-b border-white/70 bg-white/20">
        <div className="w-full h-8 rounded-full bg-white/80 flex items-center px-3 text-[11px] text-gray-400">
          Try 4+ words to describe...
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px]">
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
            Apparel
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            Devices
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            Prints
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
        <div className="mb-2">
          <h3 className="text-[11px] font-semibold text-gray-800 mb-1">
            {activeTab === 'library' ? 'Shirts' : 'My saved designs'}
          </h3>
        </div>

        {renderGrid()}
      </div>
    </div>
  );
};

export default ModelLibrary;
