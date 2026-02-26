import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

import AvatarModel from './AvatarModel';
import ProceduralAvatar from './ProceduralAvatar';
import CameraController from './CameraController';

function AvatarScene({ modelPath, height, weight, skinColor, hairType }) {
  const hasModel = !!modelPath;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 4], fov: 40 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="city" />

      <CameraController />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 1.0, 0]}
      />

      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {hasModel ? (
        <AvatarModel
          modelPath={modelPath}
          height={height}
          weight={weight}
          skinColor={skinColor}
          hairType={hairType}
        />
      ) : (
        <ProceduralAvatar
          height={height}
          weight={weight}
          skinColor={skinColor}
          hairType={hairType}
        />
      )}
    </Canvas>
  );
}

export default AvatarScene;

