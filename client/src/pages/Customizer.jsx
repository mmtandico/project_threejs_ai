import React, { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { download, swatch, fileIcon, gear } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { ColorPicker, CustomButton, FilePicker, Tab, LogoSizePicker, ModelLibrary, LayersManager } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [leftPanel, setLeftPanel] = useState('library'); // 'library' | 'uploads'
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  const [selectedLayer, setSelectedLayer] = useState(null);

  // Auto-select first layer on mount
  useEffect(() => {
    if (snap.layers && snap.layers.length > 0 && !selectedLayer) {
      setSelectedLayer(snap.layers[0]);
    }
  }, [snap.layers, selectedLayer]);

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "logosizepicker":
        return <LogoSizePicker />;
      default:
        return null;
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    if (!file) return;

    reader(file).then((result) => {
      // Add as a new layer instead of replacing
      const newLayer = {
        id: `layer-${Date.now()}`,
        name: `Image ${state.layers.length + 1}`,
        image: result,
        visible: true,
        size: 0.1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        type: 'logo',
      };
      state.layers = [...state.layers, newLayer];
      setSelectedLayer(newLayer); // Auto-select the new layer

      // Remember this upload so it can be reused later
      const imageEntry = {
        id: Date.now(),
        src: result,
        name: 'Image', // Don't rename, just use "Image"
      };
      state.uploadedImages = [imageEntry, ...(state.uploadedImages || [])];

      setActiveEditorTab('');
    });
  };

  const applyUploadedImage = (target, src) => {
    if (!src) return;
    // Add as a new layer
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: `Image ${state.layers.length + 1}`,
      image: src,
      visible: true,
      size: 0.1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      type: 'logo',
    };
    state.layers = [...state.layers, newLayer];
    setSelectedLayer(newLayer); // Auto-select the new layer
    setActiveEditorTab('');
  };

  const applyPreset = (preset) => {
    if (!preset) return;

    // Update global customization state
    state.color = preset.color || state.color;
    state.logoDecal = preset.logoDecal || state.logoDecal;
    state.fullDecal = preset.fullDecal || state.fullDecal;
    state.isLogoTexture = typeof preset.isLogoTexture === 'boolean' ? preset.isLogoTexture : state.isLogoTexture;
    state.isFullTexture = typeof preset.isFullTexture === 'boolean' ? preset.isFullTexture : state.isFullTexture;

    if (typeof preset.logoSize === 'number') {
      state.logoSize = preset.logoSize;
    }

    // Keep the filter tab UI in sync with the underlying state
    setActiveFilterTab({
      logoShirt: state.isLogoTexture,
      stylishShirt: state.isFullTexture,
    });
  }

  const handleSaveDesign = async () => {
    try {
      const payload = {
        name: 'Saved design',
        description: 'Saved from XillaFit Studio',
        prompt: snap.prompt || '',
        color: state.color,
        isLogoTexture: state.isLogoTexture,
        isFullTexture: state.isFullTexture,
        logoUrl: state.logoDecal || '',
        textureUrl: state.fullDecal || '',
        userId: null,
      };

      await fetch('http://localhost:8080/api/v1/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // You could add a toast here later
    } catch (error) {
      console.error('Failed to save design', error);
    }
  };

  if (snap.intro) return null;

  return (
    <section
      className="fixed inset-0 z-20 flex flex-col text-white overflow-y-auto pointer-events-none"
    >
      {/* Top bar */}
      <header className="h-12 flex items-center justify-between px-5 sm:px-8 border-b border-slate-800 bg-slate-950/95 pointer-events-auto">
        <div className="flex items-center gap-3">
          <img
            src="./XillaLogo.png"
            alt="Xillogo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-100">
            XillaFit Studio
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle: Shirt vs 3D Avatar */}
          <div className="hidden sm:inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 text-[10px] overflow-hidden">
            <button
              type="button"
              onClick={() => (state.viewMode = 'shirt')}
              className={`px-3 py-1.5 font-semibold transition-colors ${snap.viewMode === 'shirt'
                ? 'bg-sky-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
                }`}
            >
              Shirt view
            </button>
            <button
              type="button"
              onClick={() => (state.viewMode = 'avatar')}
              className={`px-3 py-1.5 font-semibold border-l border-slate-700/80 transition-colors ${snap.viewMode === 'avatar'
                ? 'bg-sky-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
                }`}
            >
              3D Avatar
            </button>
          </div>

          {/* Avatar gender toggle – only relevant when 3D Avatar is active */}
          {snap.viewMode === 'avatar' && (
            <div className="hidden sm:inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700 text-[10px] overflow-hidden">
              <button
                type="button"
                onClick={() => (state.avatarGender = 'male')}
                className={`px-3 py-1.5 font-semibold transition-colors ${snap.avatarGender === 'male'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => (state.avatarGender = 'female')}
                className={`px-3 py-1.5 font-semibold border-l border-slate-700/80 transition-colors ${snap.avatarGender === 'female'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                Female
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={downloadCanvasToImage}
            className="hidden sm:inline-flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-800/80"
          >
            <img src={download} alt="Download" className="w-3 h-3" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={handleSaveDesign}
            className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/70 bg-emerald-500/20 px-3 py-1.5 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-500/30"
          >
            <span>Save design</span>
          </button>
          <CustomButton
            type="fixed"
            title="Back to home"
            handleClick={() => (state.intro = true)}
            // Fixed brand color (no hover/focus color change) so it stays consistent
            customStyles="w-fit px-4 py-2.5 font-bold text-xs sm:text-sm bg-amber-400 text-slate-900"
          />
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex flex-row items-stretch gap-4 px-4 sm:px-6 py-4 pointer-events-none">
        {/* Left rail + library */}
        <aside className="flex flex-row gap-3 w-[280px] max-w-xs shrink-0 pointer-events-auto">
          {/* Vertical tool rail */}
          <div className="hidden sm:flex flex-col items-center gap-2 w-12 rounded-2xl bg-slate-900/90 border border-slate-800 py-3">
            <span className="text-[9px] font-semibold text-slate-400 tracking-[0.2em]">
              T
            </span>
            {[
              {
                id: 'edit',
                icon: swatch,
                label: 'Edit',
                action: () => {
                  setLeftPanel('library');
                  setActiveEditorTab('colorpicker');
                },
              },
              {
                id: 'uploads',
                icon: fileIcon,
                label: 'Uploads',
                action: () => {
                  setLeftPanel('uploads');
                  setActiveEditorTab('');
                },
              },
              {
                id: 'layout',
                icon: gear,
                label: 'Layout',
                action: () => {
                  setLeftPanel('library');
                  setActiveEditorTab('logosizepicker');
                },
              },
            ].map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={tool.action}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <img src={tool.icon} alt={tool.label} className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Left main panel: presets library or uploads library */}
          <div className="flex-1 h-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl p-3 sm:p-4 flex flex-col">
            <h2 className="text-xs font-semibold text-slate-100 tracking-wide uppercase mb-2">
              {leftPanel === 'uploads' ? 'Uploads' : 'Library'}
            </h2>
            <div className="flex-1 min-h-0">
              {leftPanel === 'uploads' ? (
                <FilePicker
                  file={file}
                  setFile={setFile}
                  readFile={readFile}
                  uploadedImages={snap.uploadedImages || []}
                  applyUploadedImage={applyUploadedImage}
                />
              ) : (
                <ModelLibrary onSelectPreset={applyPreset} />
              )}
            </div>
          </div>
        </aside>

        {/* Center area: transparent so the base canvas with the shirt shows through */}
        <div className="relative flex-1 min-w-[480px]" />

        {/* Controls panel */}
        <aside className="w-[260px] max-w-xs shrink-0 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl p-3 sm:p-4 flex flex-col gap-3 pointer-events-auto">
          <h2 className="text-sm font-semibold text-slate-100 tracking-wide uppercase">
            Design controls
          </h2>

          {/* Active editor content (only show when a tool is selected) */}
          {activeEditorTab && (
            <div className="mt-3">
              {generateTabContent()}
            </div>
          )}

          {/* Layers panel – draggable multi-layer system */}
          <div className="mt-1 border-t border-slate-800 pt-2">
            <LayersManager onSelectLayer={setSelectedLayer} />
          </div>

          {/* Layer properties - show when a layer is selected */}
          {selectedLayer && snap.layers.find((l) => l.id === selectedLayer.id) && (
            <div className="mt-2 border-t border-slate-800 pt-2 space-y-2">
              <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
                Layer: {selectedLayer.name}
              </p>

              {(() => {
                const liveLayer = snap.layers.find((l) => l.id === selectedLayer.id);
                if (!liveLayer) return null;

                return (
                  <>
                    {/* Text content & style for text layers */}
                    {liveLayer.type === 'text' && (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Text content</span>
                          </div>
                          <input
                            type="text"
                            value={liveLayer.text || ''}
                            onChange={(e) => {
                              const layer = state.layers.find((l) => l.id === selectedLayer.id);
                              if (layer) {
                                layer.text = e.target.value;
                                setSelectedLayer({ ...layer });
                              }
                            }}
                            className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            placeholder="Add your design text..."
                          />
                        </div>

                        {/* Text color */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Text color</span>
                            <span className="inline-flex items-center gap-1">
                              <span
                                className="inline-flex w-3 h-3 rounded-full border border-slate-600"
                                style={{ backgroundColor: liveLayer.textColor || '#ffffff' }}
                              />
                            </span>
                          </div>
                          <input
                            type="color"
                            value={liveLayer.textColor || '#ffffff'}
                            onChange={(e) => {
                              const layer = state.layers.find((l) => l.id === selectedLayer.id);
                              if (layer) {
                                layer.textColor = e.target.value;
                                setSelectedLayer({ ...layer });
                              }
                            }}
                            className="w-10 h-5 bg-transparent border border-slate-600 rounded cursor-pointer"
                          />
                        </div>

                        {/* Font family */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Font family</span>
                          </div>
                          <select
                            value={liveLayer.fontFamily || 'sans-serif'}
                            onChange={(e) => {
                              const layer = state.layers.find((l) => l.id === selectedLayer.id);
                              if (layer) {
                                layer.fontFamily = e.target.value;
                                setSelectedLayer({ ...layer });
                              }
                            }}
                            className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Tahoma">Tahoma</option>
                            <option value="Trebuchet MS">Trebuchet MS</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Lato">Lato</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Garamond">Garamond</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Comic Sans MS">Comic Sans MS</option>
                            <option value="Impact">Impact</option>
                            <option value="monospace">Generic monospace</option>
                            <option value="serif">Generic serif</option>
                            <option value="sans-serif">Generic sans-serif</option>
                          </select>
                        </div>

                        {/* Font style: bold / italic toggles */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Font style</span>
                          </div>
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const layer = state.layers.find((l) => l.id === selectedLayer.id);
                                if (layer) {
                                  layer.fontWeight =
                                    (layer.fontWeight || 'normal') === 'bold' ? 'normal' : 'bold';
                                  setSelectedLayer({ ...layer });
                                }
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] border ${(liveLayer.fontWeight || 'normal') === 'bold'
                                ? 'bg-sky-500/30 border-sky-400 text-sky-100'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300'
                                }`}
                            >
                              Bold
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const layer = state.layers.find((l) => l.id === selectedLayer.id);
                                if (layer) {
                                  layer.fontStyle =
                                    (layer.fontStyle || 'normal') === 'italic' ? 'normal' : 'italic';
                                  setSelectedLayer({ ...layer });
                                }
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] border ${(liveLayer.fontStyle || 'normal') === 'italic'
                                ? 'bg-sky-500/30 border-sky-400 text-sky-100'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300'
                                }`}
                            >
                              Italic
                            </button>
                          </div>
                        </div>

                        {/* Outline toggle */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Outline</span>
                            <button
                              type="button"
                              onClick={() => {
                                const layer = state.layers.find((l) => l.id === selectedLayer.id);
                                if (layer) {
                                  layer.outlineEnabled = !layer.outlineEnabled;
                                  setSelectedLayer({ ...layer });
                                }
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] border ${liveLayer.outlineEnabled
                                ? 'bg-sky-500/30 border-sky-400 text-sky-100'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300'
                                }`}
                            >
                              {liveLayer.outlineEnabled ? 'On' : 'Off'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Layer size */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>Size</span>
                        <span className="font-mono text-slate-200">
                          {Math.round((liveLayer.size || 0.1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.5"
                        step="0.01"
                        value={liveLayer.size || 0.1}
                        onChange={(e) => {
                          const layer = state.layers.find((l) => l.id === selectedLayer.id);
                          if (layer) {
                            layer.size = parseFloat(e.target.value);
                            setSelectedLayer({ ...layer }); // Update local state
                          }
                        }}
                        className="w-full accent-sky-400"
                      />
                    </div>

                    {/* Layer position */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>Position</span>
                        <span className="text-[10px] text-slate-500">X / Y / Rotate</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span className="w-4 text-slate-400">X</span>
                          <input
                            type="range"
                            min="-0.2"
                            max="0.2"
                            step="0.005"
                            value={liveLayer.offsetX ?? 0}
                            onChange={(e) => {
                              const layer = state.layers.find((l) => l.id === selectedLayer.id);
                              if (layer) {
                                layer.offsetX = parseFloat(e.target.value);
                                setSelectedLayer({ ...layer });
                              }
                            }}
                            className="flex-1 accent-sky-400"
                          />
                          <span className="w-10 text-right font-mono text-slate-400">
                            {(liveLayer.offsetX ?? 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span className="w-4 text-slate-400">Y</span>
                          <input
                            type="range"
                            min="-0.15"
                            max="0.15"
                            step="0.005"
                            value={liveLayer.offsetY ?? 0}
                            onChange={(e) => {
                              const layer = state.layers.find((l) => l.id === selectedLayer.id);
                              if (layer) {
                                layer.offsetY = parseFloat(e.target.value);
                                setSelectedLayer({ ...layer });
                              }
                            }}
                            className="flex-1 accent-sky-400"
                          />
                          <span className="w-10 text-right font-mono text-slate-400">
                            {(liveLayer.offsetY ?? 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span className="w-4 text-slate-400">R</span>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            step="1"
                            value={liveLayer.rotation ?? 0}
                            onChange={(e) => {
                              const layer = state.layers.find((l) => l.id === selectedLayer.id);
                              if (layer) {
                                layer.rotation = parseFloat(e.target.value);
                                setSelectedLayer({ ...layer });
                              }
                            }}
                            className="flex-1 accent-sky-400"
                          />
                          <span className="w-10 text-right font-mono text-slate-400">
                            {Math.round(liveLayer.rotation ?? 0)}°
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Properties panel */}
          <div className="mt-2 border-t border-slate-800 pt-2 space-y-3">
            <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
              Properties
            </p>

            {/* Base color – live swatch + color picker */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Base color</span>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex w-4 h-4 rounded-full border border-slate-600"
                    style={{ backgroundColor: snap.color }}
                  />
                  <span className="font-mono text-slate-200">{snap.color}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="color"
                  value={snap.color}
                  onChange={(e) => (state.color = e.target.value)}
                  className="w-9 h-5 bg-transparent border border-slate-600 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">
                  Quick color adjust
                </span>
              </div>
            </div>

            {/* Layer state summary */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Front logo</span>
                <span className={snap.isLogoTexture ? 'text-emerald-300' : 'text-slate-500'}>
                  {snap.isLogoTexture ? 'On' : 'Off'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Full print</span>
                <span className={snap.isFullTexture ? 'text-emerald-300' : 'text-slate-500'}>
                  {snap.isFullTexture ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Customizer