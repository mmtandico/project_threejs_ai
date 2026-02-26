import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';
import { useSnapshot } from 'valtio';

import Shirt from '../canvas/Shirt';
import state from '../store';

const MiniShirtPreview = ({ preset }) => {
  const snap = useSnapshot(state);

  const overrides = {
    colorOverride: preset?.color,
    logoDecalOverride: preset?.logoDecal,
    fullDecalOverride: preset?.fullDecal,
    isLogoTextureOverride: preset?.isLogoTexture,
    isFullTextureOverride: preset?.isFullTexture,
    logoSizeOverride: preset?.logoSize,
  };

  // Use preset layers if available
  const previewLayers = useMemo(() => {
    if (preset?.layers && Array.isArray(preset.layers) && preset.layers.length > 0) {
      return preset.layers;
    }
    return [];
  }, [preset?.layers]);

  // Temporarily override global layers for this preview only
  useEffect(() => {
    if (previewLayers.length > 0) {
      const originalLayers = state.layers;
      state.layers = previewLayers;
      return () => {
        // Restore original layers when component unmounts
        state.layers = originalLayers;
      };
    }
  }, [previewLayers]);

  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.7} />
      <Environment preset="city" />
      <Center>
        <Suspense fallback={null}>
          {/* If preset has layers, they'll be used via global state override */}
          <Shirt disableLayers={previewLayers.length === 0} {...overrides} />
        </Suspense>
      </Center>
    </Canvas>
  );
};

export default MiniShirtPreview;
