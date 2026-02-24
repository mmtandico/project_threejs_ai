import React, { useRef } from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = ({
  colorOverride,
  logoDecalOverride,
  fullDecalOverride,
  isLogoTextureOverride,
  isFullTextureOverride,
  logoSizeOverride,
}) => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  const meshRef = useRef();

  const appliedColor = colorOverride || snap.color;
  const appliedLogoDecal = logoDecalOverride || snap.logoDecal || '/threejs.png';
  const appliedFullDecal = fullDecalOverride || snap.fullDecal || '/threejs.png';
  const appliedIsLogoTexture =
    typeof isLogoTextureOverride === 'boolean' ? isLogoTextureOverride : snap.isLogoTexture;
  const appliedIsFullTexture =
    typeof isFullTextureOverride === 'boolean' ? isFullTextureOverride : snap.isFullTexture;
  const appliedLogoSize = typeof logoSizeOverride === 'number' ? logoSizeOverride : snap.logoSize || 0.1;

  const logoTexture = useTexture(appliedLogoDecal);
  const fullTexture = useTexture(appliedFullDecal);

  useFrame((state, delta) => {
    if (meshRef.current && meshRef.current.material) {
      easing.dampC(meshRef.current.material.color, appliedColor, 0.25, delta);
    }
  });

  if (!nodes?.T_Shirt_male) return null;

  return (
    // Base shirt model with no positional offset so previews (like on the
    // home page) stay nicely centered. Any pivot adjustments for the studio
    // view are handled in StudioShirt instead.
    <group>
      <mesh
        ref={meshRef}
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
      >
        <meshStandardMaterial color={appliedColor} roughness={1} />

        {/* Temporarily disabled full texture to test color changing */}
        {false && appliedIsFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {appliedIsLogoTexture && (
          <Decal
            position={[
              (snap.logoOffsetX || 0),
              0.04 + (snap.logoOffsetY || 0),
              0.15,
            ]}
            rotation={[0, 0, ((snap.logoRotation || 0) * Math.PI) / 180]}
            scale={appliedLogoSize}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt