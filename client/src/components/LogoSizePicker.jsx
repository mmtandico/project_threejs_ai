import React from 'react'
import { useSnapshot } from 'valtio'

import state from '../store';

const LogoSizePicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className="absolute left-full ml-3 glassmorphism p-4 w-[195px] rounded-md flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Logo Size</label>
        <input
          type="range"
          min="0.05"
          max="0.5"
          step="0.01"
          value={snap.logoSize || 0.2}
          onChange={(e) => state.logoSize = parseFloat(e.target.value)}
          className="w-full"
        />
        <div className="text-xs text-gray-600 text-center">
          {((snap.logoSize || 0.2) * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  )
}

export default LogoSizePicker
