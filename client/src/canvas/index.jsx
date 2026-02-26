import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';

import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import StudioShirt from './StudioShirt';
import AvatarModel from './AvatarModel';
import maleAvatar1Url from './MaleAvatar1.fbx';
import state from '../store';

const CanvasModel = () => {
  const snap = useSnapshot(state);

  // Use a different camera setup for avatar vs shirt.
  // For avatar, aim the camera squarely at the belly/torso area so it stays centered.
  // For avatar, pull the camera even farther back and slightly narrow the FOV
  // so the whole body fits comfortably in view.
  const cameraConfig = snap.viewMode === 'avatar'
    ? { position: [0, 6.0, 30], fov: 40 }
    : { position: [0, 0, 0], fov: 25 };

  return (
    <Canvas
      shadows
      camera={cameraConfig}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        // Allow zoom in both modes; avatar has its own distance limits below.
        enableZoom={true}
        // For avatar: no minimum distance limit so you can zoom in as much as you like.
        // For shirt: keep the original flexible range.
        minDistance={snap.viewMode === 'avatar' ? 0 : 2}
        maxDistance={snap.viewMode === 'avatar' ? 45 : 3}
        // Aim the orbit pivot even higher above the avatar (around y ≈ 5.8),
        // while shirt mode still targets the belly area of the shirt.
        target={snap.viewMode === 'avatar' ? [0, 5.8, 0] : [0.15, -0.1, 0]}
        enableDamping={true}
        dampingFactor={0.15}
        rotateSpeed={0.7}
        // Extra smooth, easy scroll zoom in/out (shirt only, since avatar zoom is disabled)
        zoomSpeed={0.35}
        // Avatar: lock vertical angle so it only rotates horizontally 360°.
        // Shirt: keep previous limited vertical tilt.
        minPolarAngle={snap.viewMode === 'avatar' ? Math.PI / 2 : Math.PI / 4}
        maxPolarAngle={snap.viewMode === 'avatar' ? Math.PI / 2 : (3 * Math.PI) / 4}
      />

      <CameraRig>
        <Backdrop />
        <Suspense fallback={null}>
          {snap.viewMode === 'avatar' ? (
            // Avatar view: lower the avatar/platform more
            // so the whole body sits closer to the vertical center of the screen.
            <group position={[0, -1.8, 0]}>
              <AvatarModel
                modelPath={maleAvatar1Url}
                height={170}
                weight={65}
                skinColor="#ffddb3"
                hairType="straight"
              />
            </group>
          ) : (
            // Shirt view: show the shirt model like before
            <StudioShirt />
          )}
        </Suspense>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel