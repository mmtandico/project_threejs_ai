import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const LayersManager = ({ onSelectLayer }) => {
  const snap = useSnapshot(state);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [selectedLayerId, setSelectedLayerId] = useState(snap.layers[0]?.id || null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newLayers = [...state.layers];
    const draggedLayer = newLayers[draggedIndex];
    newLayers.splice(draggedIndex, 1);
    newLayers.splice(dropIndex, 0, draggedLayer);
    state.layers = newLayers;

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleAddLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: `Text layer ${state.layers.length + 1}`,
      // Start empty so it doesn't override the live shirt until the user adds content.
      image: '',
      visible: true,
      size: 0.1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      type: 'text', // text-only layer; content stored in layer.text
      text: '',
      textColor: '#ffffff',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontFamily: 'sans-serif',
      outlineEnabled: false,
    };
    state.layers = [...state.layers, newLayer];
  };

  const handleRemoveLayer = (layerId) => {
    if (state.layers.length <= 1) return; // Keep at least one layer
    state.layers = state.layers.filter((layer) => layer.id !== layerId);
  };

  const handleToggleVisibility = (layerId) => {
    const layer = state.layers.find((l) => l.id === layerId);
    if (layer) {
      layer.visible = !layer.visible;
    }
  };

  const handleUpdateLayer = (layerId, updates) => {
    const layer = state.layers.find((l) => l.id === layerId);
    if (layer) {
      Object.assign(layer, updates);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-300 mb-2">
        <div className="inline-flex rounded-full bg-slate-800/80 p-0.5">
          <button
            type="button"
            className="px-3 py-1 rounded-full bg-slate-900 text-slate-100 font-semibold"
          >
            Layers
          </button>
        </div>
        <button
          type="button"
          onClick={handleAddLayer}
          className="px-2 py-1 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-semibold hover:bg-sky-500/30 border border-sky-500/50"
        >
          + Add
        </button>
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
        {snap.layers.map((layer, index) => (
          <div
            key={layer.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative flex items-center gap-2 rounded-xl border px-2 py-1.5 text-[11px] transition-colors cursor-move ${
              dragOverIndex === index
                ? 'bg-sky-500/20 border-sky-400'
                : selectedLayerId === layer.id
                  ? 'bg-sky-500/30 border-sky-400'
                  : layer.visible
                    ? 'bg-slate-100 text-slate-900 border-slate-300'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {/* Drag handle */}
            <span className="flex flex-col justify-center items-center text-slate-500 text-[10px] cursor-grab active:cursor-grabbing">
              ⋮⋮
            </span>

            {/* Layer preview thumbnail */}
            <div className="w-8 h-8 rounded border border-slate-300 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/60">
              {layer.type === 'text' ? (
                <span className="text-[10px] font-bold text-slate-700">T</span>
              ) : (
                <img
                  src={layer.image}
                  alt={layer.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 flex items-center justify-between min-w-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedLayerId(layer.id);
                  onSelectLayer?.(layer);
                }}
                className="font-semibold truncate text-left hover:underline flex-1"
              >
                {layer.name}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(layer.id)}
                  className={`text-[10px] ${
                    layer.visible ? 'text-emerald-500' : 'text-slate-500'
                  }`}
                >
                  {layer.visible ? 'Visible' : 'Hidden'}
                </button>
                {snap.layers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLayer(layer.id)}
                    className="text-red-400 hover:text-red-300 text-[10px] px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayersManager;