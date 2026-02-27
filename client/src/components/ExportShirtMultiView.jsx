import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';

import Shirt from '../canvas/Shirt';

// Off‑screen canvas used only for export/download.
// Renders three simultaneous views of the current shirt design:
// back, front, and side.
const ExportShirtMultiView = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.4], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.7} />
      <Environment preset="city" />
      <Center>
        <Suspense fallback={null}>
          {/* Back view */}
          <group position={[-0.9, 0, 0]} rotation={[0, Math.PI, 0]}>
            <Shirt />
          </group>

          {/* Front view */}
          <group position={[0, 0, 0]}>
            <Shirt />
          </group>

          {/* Side view */}
          <group position={[0.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Shirt />
          </group>
        </Suspense>
      </Center>
    </Canvas>
  );
};

export default ExportShirtMultiView;
