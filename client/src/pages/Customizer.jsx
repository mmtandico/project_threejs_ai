import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { download, swatch, fileIcon, gear } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { ColorPicker, CustomButton, FilePicker, Tab, LogoSizePicker, ModelLibrary } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [leftPanel, setLeftPanel] = useState('library'); // 'library' | 'uploads'
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })

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
      // Apply to the current decal slot
      handleDecals(type, result);

      // Remember this upload so it can be reused later
      const imageEntry = {
        id: Date.now(),
        src: result,
        name: file.name || 'Upload',
      };
      state.uploadedImages = [imageEntry, ...(state.uploadedImages || [])];

      setActiveEditorTab('');
    });
  };

  const applyUploadedImage = (target, src) => {
    if (!src) return;
    handleDecals(target, src);
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
            alt="XILLAFIT logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-100">
            XILLAFIT Studio
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadCanvasToImage}
            className="hidden sm:inline-flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-800/80"
          >
            <img src={download} alt="Download" className="w-3 h-3" />
            <span>Download</span>
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

          {/* Layers panel – styled closer to a layers/overlap UI */}
          <div className="mt-1 border-t border-slate-800 pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <div className="inline-flex rounded-full bg-slate-800/80 p-0.5">
                <button
                  type="button"
                  className="px-3 py-1 rounded-full bg-slate-900 text-slate-100 font-semibold"
                >
                  Layers
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded-full text-slate-500 font-medium"
                >
                  Arrange
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {FilterTabs.map((tab) => {
                const active = activeFilterTab[tab.name];
                const label =
                  tab.name === 'logoShirt'
                    ? 'Front logo'
                    : tab.name === 'stylishShirt'
                      ? 'Full print'
                      : tab.name;

                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => handleActiveFilterTab(tab.name)}
                    className={`w-full flex items-center gap-2 rounded-xl border px-2 py-1.5 text-[11px] transition-colors ${active
                      ? 'bg-slate-100 text-slate-900 border-slate-300'
                      : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                  >
                    {/* Drag handle mimic */}
                    <span className="flex flex-col justify-center items-center text-slate-500 text-[10px] mr-1">
                      ⋮⋮
                    </span>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <img src={tab.icon} alt={tab.name} className="w-3.5 h-3.5" />
                        <span className="font-semibold">{label}</span>
                      </span>
                      <span
                        className={`text-[10px] ${active ? 'text-emerald-500' : 'text-slate-500'
                          }`}
                      >
                        {active ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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

            {/* Logo size – adjustable bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Logo size</span>
                <span className="font-mono text-slate-200">
                  {Math.round((snap.logoSize || 0.1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={snap.logoSize || 0.1}
                onChange={(e) => (state.logoSize = parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            {/* Logo position & rotation – like simple X/Y/rotate controls */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Logo position</span>
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
                    value={snap.logoOffsetX ?? 0}
                    onChange={(e) => (state.logoOffsetX = parseFloat(e.target.value))}
                    className="flex-1 accent-sky-400"
                  />
                  <span className="w-10 text-right font-mono text-slate-400">
                    {snap.logoOffsetX?.toFixed(2) ?? '0.00'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-300">
                  <span className="w-4 text-slate-400">Y</span>
                  <input
                    type="range"
                    min="-0.15"
                    max="0.15"
                    step="0.005"
                    value={snap.logoOffsetY ?? 0}
                    onChange={(e) => (state.logoOffsetY = parseFloat(e.target.value))}
                    className="flex-1 accent-sky-400"
                  />
                  <span className="w-10 text-right font-mono text-slate-400">
                    {snap.logoOffsetY?.toFixed(2) ?? '0.00'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-300">
                  <span className="w-4 text-slate-400">R</span>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={snap.logoRotation ?? 0}
                    onChange={(e) => (state.logoRotation = parseFloat(e.target.value))}
                    className="flex-1 accent-sky-400"
                  />
                  <span className="w-10 text-right font-mono text-slate-400">
                    {Math.round(snap.logoRotation ?? 0)}°
                  </span>
                </div>
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