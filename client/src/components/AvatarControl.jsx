import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const AvatarControl = () => {
  const snap = useSnapshot(state);

  const bodyTypes = [
    { value: 'slim', label: 'Slim' },
    { value: 'athletic', label: 'Athletic' },
    { value: 'average', label: 'Average' },
    { value: 'muscular', label: 'Muscular' },
    { value: 'curvy', label: 'Curvy' },
  ];

  const hairTypes = [
    { value: 'straight', label: 'Straight' },
    { value: 'curly', label: 'Curly' },
    { value: 'bald', label: 'Bald' },
  ];

  const calculateBMI = () => {
    if (!snap.avatarHeight || !snap.avatarWeight) return 'N/A';
    const bmi = (snap.avatarWeight / ((snap.avatarHeight / 100) ** 2)).toFixed(1);
    return bmi;
  };

  return (
    <div className="space-y-4">
      {/* Body Type Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span className="font-semibold uppercase tracking-wide">Body Composition</span>
        </div>
        <select
          value={snap.avatarBodyType || 'athletic'}
          onChange={(e) => (state.avatarBodyType = e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {bodyTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Height Control */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Height</span>
          <span className="font-mono text-slate-200">
            {snap.avatarHeight || 170} <span className="text-[10px] text-slate-400">cm</span>
          </span>
        </div>
        <input
          type="range"
          min="140"
          max="220"
          step="1"
          value={snap.avatarHeight || 170}
          onChange={(e) => (state.avatarHeight = parseInt(e.target.value))}
          className="w-full accent-sky-400"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>140 cm</span>
          <span>220 cm</span>
        </div>
      </div>

      {/* Weight Control */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Weight</span>
          <span className="font-mono text-slate-200">
            {snap.avatarWeight || 65} <span className="text-[10px] text-slate-400">kg</span>
          </span>
        </div>
        <input
          type="range"
          min="40"
          max="150"
          step="1"
          value={snap.avatarWeight || 65}
          onChange={(e) => (state.avatarWeight = parseInt(e.target.value))}
          className="w-full accent-sky-400"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>40 kg</span>
          <span>150 kg</span>
        </div>
      </div>

      {/* BMI Display */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-md p-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300">BMI</span>
          <span className="font-semibold text-sky-300">{calculateBMI()}</span>
        </div>
      </div>

      {/* Optional Measurements Section */}
      <div className="border-t border-slate-800 pt-3 space-y-3">
        <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
          Optional Measurements
        </p>
        <p className="text-[10px] text-slate-500 mb-2">
          Additional body measurements for more precise customization.
        </p>

        {/* Waist Line */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Waist Line (cm)</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarWaistLine || 80);
                  state.avatarWaistLine = Math.max(60, current - 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                -
              </button>
              <input
                type="number"
                min="60"
                max="150"
                step="1"
                value={snap.avatarWaistLine || 80}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 80;
                  state.avatarWaistLine = Math.max(60, Math.min(150, val));
                }}
                className="w-16 rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-[10px] text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarWaistLine || 80);
                  state.avatarWaistLine = Math.min(150, current + 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Chest Circumference */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Chest / Bust (cm)</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarChestCircumference || 95);
                  state.avatarChestCircumference = Math.max(70, current - 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                -
              </button>
              <input
                type="number"
                min="70"
                max="150"
                step="1"
                value={snap.avatarChestCircumference || 95}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 95;
                  state.avatarChestCircumference = Math.max(70, Math.min(150, val));
                }}
                className="w-16 rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-[10px] text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarChestCircumference || 95);
                  state.avatarChestCircumference = Math.min(150, current + 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Hip Circumference */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Hip Circumference (cm)</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarHipCircumference || 90);
                  state.avatarHipCircumference = Math.max(70, current - 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                -
              </button>
              <input
                type="number"
                min="70"
                max="150"
                step="1"
                value={snap.avatarHipCircumference || 90}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 90;
                  state.avatarHipCircumference = Math.max(70, Math.min(150, val));
                }}
                className="w-16 rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-[10px] text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarHipCircumference || 90);
                  state.avatarHipCircumference = Math.min(150, current + 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Shoulder Width */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Shoulder Width (cm)</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarShoulderWidth || 42);
                  state.avatarShoulderWidth = Math.max(30, current - 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                -
              </button>
              <input
                type="number"
                min="30"
                max="60"
                step="1"
                value={snap.avatarShoulderWidth || 42}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 42;
                  state.avatarShoulderWidth = Math.max(30, Math.min(60, val));
                }}
                className="w-16 rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-[10px] text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(snap.avatarShoulderWidth || 42);
                  state.avatarShoulderWidth = Math.min(60, current + 1);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800 text-[10px]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="border-t border-slate-800 pt-3 space-y-3">
        <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
          Appearance
        </p>

        {/* Skin Color */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Skin Color</span>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex w-4 h-4 rounded-full border border-slate-600"
                style={{ backgroundColor: snap.avatarSkinColor || '#ffddb3' }}
              />
            </div>
          </div>
          <input
            type="color"
            value={snap.avatarSkinColor || '#ffddb3'}
            onChange={(e) => (state.avatarSkinColor = e.target.value)}
            className="w-full h-8 bg-transparent border border-slate-600 rounded cursor-pointer"
          />
        </div>

        {/* Hair Type */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Hair Type</span>
          </div>
          <select
            value={snap.avatarHairType || 'straight'}
            onChange={(e) => (state.avatarHairType = e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {hairTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AvatarControl;
