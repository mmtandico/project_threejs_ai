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
  const isShapeLayer = layer.type === 'shape';

  // Base texture for image-based layers (logo/full). For text and shapes we will instead
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

  // Generate a shape texture for shape layers
  const shapeTexture = useMemo(() => {
    if (!isShapeLayer || !layer.shapeType) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.4;

    ctx.fillStyle = layer.shapeColor || '#ff0000';
    ctx.strokeStyle = layer.shapeBorderColor || 'transparent';
    ctx.lineWidth = layer.shapeBorderWidth || 0;

    // Draw different shapes based on shapeType
    switch (layer.shapeType) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        if (layer.shapeBorderWidth > 0) ctx.stroke();
        ctx.fill();
        break;

      case 'square':
        const squareSize = size * 0.7;
        ctx.fillRect(centerX - squareSize / 2, centerY - squareSize / 2, squareSize, squareSize);
        if (layer.shapeBorderWidth > 0) {
          ctx.strokeRect(centerX - squareSize / 2, centerY - squareSize / 2, squareSize, squareSize);
        }
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size / 2);
        ctx.lineTo(centerX - size / 2, centerY + size / 2);
        ctx.lineTo(centerX + size / 2, centerY + size / 2);
        ctx.closePath();
        if (layer.shapeBorderWidth > 0) ctx.stroke();
        ctx.fill();
        break;

      case 'star':
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = size / 2;
        const innerRadius = outerRadius * 0.4;
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        if (layer.shapeBorderWidth > 0) ctx.stroke();
        ctx.fill();
        break;

      case 'heart':
        ctx.beginPath();
        const heartSize = size * 0.6;
        ctx.moveTo(centerX, centerY + heartSize * 0.3);
        ctx.bezierCurveTo(
          centerX, centerY,
          centerX - heartSize * 0.5, centerY,
          centerX - heartSize * 0.5, centerY + heartSize * 0.2
        );
        ctx.bezierCurveTo(
          centerX - heartSize * 0.5, centerY + heartSize * 0.5,
          centerX, centerY + heartSize * 0.7,
          centerX, centerY + heartSize
        );
        ctx.bezierCurveTo(
          centerX, centerY + heartSize * 0.7,
          centerX + heartSize * 0.5, centerY + heartSize * 0.5,
          centerX + heartSize * 0.5, centerY + heartSize * 0.2
        );
        ctx.bezierCurveTo(
          centerX + heartSize * 0.5, centerY,
          centerX, centerY,
          centerX, centerY + heartSize * 0.3
        );
        ctx.closePath();
        if (layer.shapeBorderWidth > 0) ctx.stroke();
        ctx.fill();
        break;

      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size / 2);
        ctx.lineTo(centerX + size / 2, centerY);
        ctx.lineTo(centerX, centerY + size / 2);
        ctx.lineTo(centerX - size / 2, centerY);
        ctx.closePath();
        if (layer.shapeBorderWidth > 0) ctx.stroke();
        ctx.fill();
        break;

      case 'hexagon':
        ctx.beginPath();
        const hexSize = size / 2;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = centerX + hexSize * Math.cos(angle);
          const y = centerY + hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        if (layer.shapeBorderWidth > 0) ctx.stroke();
        ctx.fill();
        break;

      default:
        // Default to circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        if (layer.shapeBorderWidth > 0) ctx.stroke();
        ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.anisotropy = 8;
    return tex;
  }, [
    isShapeLayer,
    layer.shapeType,
    layer.shapeColor,
    layer.shapeBorderColor,
    layer.shapeBorderWidth,
  ]);

  // Compute a base position and orientation based on placement area.
  const placement = layer.placement || 'front';
  const offsetX = layer.offsetX || 0;
  const offsetY = layer.offsetY || 0;

  let basePos = { x: 0, y: 0.04, z: 0.15 }; // front center
  let rotY = 0;

  if (placement === 'back') {
    basePos = { x: 0, y: 0.04, z: -0.15 };
    rotY = Math.PI;
  } else if (placement === 'leftShoulder') {
    basePos = { x: -0.22, y: 0.22, z: 0.02 };
    rotY = Math.PI / 2;
  } else if (placement === 'rightShoulder') {
    basePos = { x: 0.22, y: 0.22, z: 0.02 };
    rotY = -Math.PI / 2;
  }

  // Apply user offsets in a local way so X moves across the area and Y moves up/down.
  let posX = basePos.x;
  let posY = basePos.y + offsetY;
  let posZ = basePos.z;

  if (placement === 'leftShoulder' || placement === 'rightShoulder') {
    // For shoulders, move along the seam using Z instead of X.
    posZ += offsetX;
  } else {
    posX += offsetX;
  }

  const userRotZ = ((layer.rotation || 0) * Math.PI) / 180;
  const rotation = [0, rotY, userRotZ];

  // Text layer rendered as a decal using the generated texture.
  if (isTextLayer) {
    if (!layer.visible || !layer.text || !textTexture) return null;

    return (
      <Decal
        position={[
          posX,
          posY,
          posZ,
        ]}
        rotation={rotation}
        scale={layer.size || 0.2}
        map={textTexture}
        anisotropy={16}
        depthTest={false}
        depthWrite={true}
      />
    );
  }

  // Shape layer rendered as a decal using the generated texture.
  if (isShapeLayer) {
    if (!layer.visible || !layer.shapeType || !shapeTexture) return null;

    return (
      <Decal
        position={[
          posX,
          posY,
          posZ,
        ]}
        rotation={rotation}
        scale={layer.size || 0.15}
        map={shapeTexture}
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
        posX,
        posY,
        posZ,
      ]}
      rotation={rotation}
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