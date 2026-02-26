import React, { useRef, useMemo } from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import state from '../store';

// Component to render a single layer
const LayerDecal = ({ layer }) => {
  const isTextLayer = layer.type === 'text';

  // Base texture for image-based layers (logo/full). For text we will instead
  // generate a CanvasTexture below.
  const texture = useTexture(layer.image || '/XillaLogo.png');

  // Generate a text texture for text layers so we can project it as a decal
  // that conforms to the shirt surface instead of floating geometry.
  const textTexture = useMemo(() => {
    if (!isTextLayer || !layer.text) return null;

    const canvas = document.createElement('canvas');
    // Wider canvas so long words don't get clipped
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background transparent
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const baseFontSizePx = 260;
    const fontWeight = layer.fontWeight || 'normal';
    const fontStyle = layer.fontStyle || 'normal';
    const fontFamily = layer.fontFamily || 'sans-serif';

    // First measure at base size to see how wide the text is
    ctx.font = `${fontStyle} ${fontWeight} ${baseFontSizePx}px '${fontFamily}'`;
    let textWidth = ctx.measureText(layer.text).width;
    const maxWidth = canvas.width * 0.8; // keep 10% padding on each side

    let finalFontSizePx = baseFontSizePx;
    if (textWidth > maxWidth && textWidth > 0) {
      const scale = maxWidth / textWidth;
      finalFontSizePx = baseFontSizePx * scale;
    }

    // Apply final font size and re-measure
    ctx.font = `${fontStyle} ${fontWeight} ${finalFontSizePx}px '${fontFamily}'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Optional outline for readability
    if (layer.outlineEnabled) {
      ctx.lineWidth = 14 * (finalFontSizePx / baseFontSizePx);
      ctx.strokeStyle = 'black';
      ctx.strokeText(layer.text, x, y);
    }

    ctx.fillStyle = layer.textColor || '#ffffff';
    ctx.fillText(layer.text, x, y);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.anisotropy = 8;
    return tex;
  }, [
    isTextLayer,
    layer.text,
    layer.textColor,
    layer.fontWeight,
    layer.fontStyle,
    layer.fontFamily,
    layer.outlineEnabled,
  ]);

  // Text layer rendered as a decal using the generated texture.
  if (isTextLayer) {
    if (!layer.visible || !layer.text || !textTexture) return null;

    return (
      <Decal
        position={[
          layer.offsetX || 0,
          0.04 + (layer.offsetY || 0),
          0.15,
        ]}
        rotation={[0, 0, ((layer.rotation || 0) * Math.PI) / 180]}
        scale={layer.size || 0.2}
        map={textTexture}
        anisotropy={16}
        depthTest={false}
        depthWrite={true}
      />
    );
  }

  if (!layer.visible || !layer.image) return null;

  if (layer.type === 'full') {
    return (
      <Decal
        position={[0, 0, 0]}
        rotation={[0, 0, (layer.rotation * Math.PI) / 180]}
        scale={1}
        map={texture}
      />
    );
  }

  // Logo type (positioned decal)
  return (
    <Decal
      position={[
        layer.offsetX || 0,
        0.04 + (layer.offsetY || 0),
        0.15,
      ]}
      rotation={[0, 0, ((layer.rotation || 0) * Math.PI) / 180]}
      scale={layer.size || 0.1}
      map={texture}
      anisotropy={16}
      depthTest={false}
      depthWrite={true}
    />
  );
};

const Shirt = ({
  colorOverride,
  logoDecalOverride,
  fullDecalOverride,
  isLogoTextureOverride,
  isFullTextureOverride,
  logoSizeOverride,
  // When true, ignore the global layered design state so previews
  // don't change when editing the main studio shirt.
  disableLayers = false,
}) => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  const meshRef = useRef();

  const appliedColor = colorOverride || snap.color;

  // Legacy support
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

  // Use new layers system if available, otherwise fall back to legacy.
  // For places like library/landing previews we can explicitly disable this
  // so those shirts stay fixed while the main studio shirt is edited.
  const useLayersSystem = !disableLayers && snap.layers && snap.layers.length > 0;

  return (
    <group>
      <mesh
        ref={meshRef}
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
      >
        <meshStandardMaterial color={appliedColor} roughness={1} />

        {useLayersSystem ? (
          // New multi-layer system
          snap.layers.map((layer) => (
            <LayerDecal key={layer.id} layer={layer} />
          ))
        ) : (
          // Legacy system (backward compatibility)
          <>
            {appliedIsFullTexture && (
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
          </>
        )}
      </mesh>
    </group>
  )
}

export default Shirt