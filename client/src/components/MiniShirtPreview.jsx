import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';

import Shirt from '../canvas/Shirt';

const MiniShirtPreview = ({ preset }) => {
  const overrides = {
    colorOverride: preset?.color,
    logoDecalOverride: preset?.logoDecal,
    fullDecalOverride: preset?.fullDecal,
    isLogoTextureOverride: preset?.isLogoTexture,
    isFullTextureOverride: preset?.isFullTexture,
    logoSizeOverride: preset?.logoSize,
  };

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
          {/* Disable global layer system so library/landing previews
              don't change when editing the main studio shirt. */}
          <Shirt disableLayers {...overrides} />
        </Suspense>
      </Center>
    </Canvas>
  );
};

export default MiniShirtPreview;
