import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';

import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import StudioShirt from './StudioShirt';
import AvatarModel from './AvatarModel';
import maleAvatar1Url from './MaleAvatar1.fbx';
import femaleAvatarUrl from './FemaleAvatar.fbx';
import state from '../store';

const CanvasModel = () => {
  const snap = useSnapshot(state);

  // Choose which avatar model to show based on the current gender toggle.
  const avatarModelPath =
    snap.avatarGender === 'female' ? femaleAvatarUrl : maleAvatar1Url;

  // Use a different camera setup for avatar vs shirt.
  // Reset to a simple, stable avatar framing: full body, centered,
  // at a fixed distance so size stays constant.
  const cameraConfig = snap.viewMode === 'avatar'
    // Pull the camera further back so the avatar looks more zoomed out.
    ? { position: [0, 25.0, 30], fov: 40 }
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

      {/* Extra lighting so the avatar has depth and doesn't look flat */}
      {snap.viewMode === 'avatar' && (
        <>
          {/* Key light from front‑left */}
          <directionalLight
            position={[6, 8, 6]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          {/* Soft fill from back‑right to lift the shadows */}
          <directionalLight position={[-4, 6, -4]} intensity={0.5} />
          {/* Gentle sky/ground light for subtle rim highlights */}
          <hemisphereLight
            skyColor="#ffffff"
            groundColor="#555555"
            intensity={0.5}
          />
        </>
      )}
      <OrbitControls
        enablePan={false}
        // Disable zoom for avatar so its size stays constant; allow zoom for shirt view.
        enableZoom={snap.viewMode === 'avatar' ? false : true}
        // For avatar: lock distance (matching the camera Z) so size stays constant.
        // For shirt: keep the original flexible range.
        minDistance={snap.viewMode === 'avatar' ? 30 : 2}
        maxDistance={snap.viewMode === 'avatar' ? 30 : 3}
        // Aim the orbit pivot slightly higher to keep the avatar in the middle.
        target={snap.viewMode === 'avatar' ? [0, 5.5, 0] : [0.15, -0.1, 0]}
        enableDamping={true}
        dampingFactor={0.15}
        rotateSpeed={0.7}
        // Extra smooth, easy scroll zoom in/out
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
            // Avatar view: small downward offset so the feet sit closer
            // to the lower part of the frame.
            <group position={[0, -0.8, 0]}>
              <AvatarModel
                modelPath={avatarModelPath}
                height={snap.avatarHeight || 170}
                weight={snap.avatarWeight || 65}
                skinColor={snap.avatarSkinColor || '#ffddb3'}
                hairType={snap.avatarHairType || 'straight'}
                bodyType={snap.avatarBodyType || 'athletic'}
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