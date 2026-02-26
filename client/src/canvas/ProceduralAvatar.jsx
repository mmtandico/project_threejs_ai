import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function ProceduralAvatar({ height, weight, skinColor, hairType }) {
  const groupRef = useRef();

  // Calculate proportions
  const heightScale = height / 170;
  const bmi = weight / ((height / 100) ** 2);
  const bodyWidth = 0.45 + (bmi - 22) * 0.025;
  const bodyWidthClamped = Math.max(0.4, Math.min(0.65, bodyWidth));
  const headSize = 0.3 * heightScale;

  // Rotate avatar
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const getHairGeometry = (type, scale) => {
    switch (type) {
      case 'short':
        return <sphereGeometry args={[0.32 * scale, 32, 32]} />;
      case 'medium':
        return <cylinderGeometry args={[0.32 * scale, 0.3 * scale, 0.2 * scale, 32]} />;
      case 'long':
        return <cylinderGeometry args={[0.32 * scale, 0.3 * scale, 0.4 * scale, 32]} />;
      default:
        return <sphereGeometry args={[0.32 * scale, 32, 32]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.4 * heightScale, 0]} castShadow>
        <sphereGeometry args={[headSize, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Facial Features - Eyes */}
      <mesh position={[-0.1 * heightScale, 1.45 * heightScale, 0.25 * heightScale]}>
        <sphereGeometry args={[0.08 * heightScale, 16, 16]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
      <mesh position={[-0.1 * heightScale, 1.45 * heightScale, 0.28 * heightScale]}>
        <sphereGeometry args={[0.04 * heightScale, 16, 16]} />
        <meshStandardMaterial color={0x000000} />
      </mesh>
      <mesh position={[0.1 * heightScale, 1.45 * heightScale, 0.25 * heightScale]}>
        <sphereGeometry args={[0.08 * heightScale, 16, 16]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
      <mesh position={[0.1 * heightScale, 1.45 * heightScale, 0.28 * heightScale]}>
        <sphereGeometry args={[0.04 * heightScale, 16, 16]} />
        <meshStandardMaterial color={0x000000} />
      </mesh>

      {/* Mouth */}
      <mesh
        position={[0, 1.3 * heightScale, 0.25 * heightScale]}
        rotation={[Math.PI, 0, 0]}
        castShadow
      >
        <torusGeometry args={[0.06 * heightScale, 0.02 * heightScale, 8, 16, Math.PI]} />
        <meshStandardMaterial color={0xff6b6b} />
      </mesh>

      {/* Hair */}
      {hairType !== 'bald' && (
        <>
          {hairType === 'curly' ? (
            <group position={[0, 1.4 * heightScale, 0]}>
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 0.25 * heightScale;
                return (
                  <mesh
                    key={i}
                    position={[
                      Math.cos(angle) * radius,
                      0.15 * heightScale,
                      Math.sin(angle) * radius,
                    ]}
                    castShadow
                  >
                    <sphereGeometry args={[0.06 * heightScale, 16, 16]} />
                    <meshStandardMaterial color="#4A3728" />
                  </mesh>
                );
              })}
            </group>
          ) : (
            <mesh position={[0, 1.4 * heightScale, 0]} castShadow>
              {getHairGeometry(hairType, heightScale)}
              <meshStandardMaterial color="#2C1810" />
            </mesh>
          )}
        </>
      )}

      {/* Neck */}
      <mesh position={[0, 1.2 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.12 * heightScale, 0.12 * heightScale, 0.15 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.7 * heightScale, 0]} castShadow>
        <cylinderGeometry
          args={[bodyWidthClamped * 0.5, bodyWidthClamped * 0.6, 0.9 * heightScale, 16]}
        />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-bodyWidthClamped * 0.35, 1.0 * heightScale, 0]} castShadow>
        <sphereGeometry args={[0.15 * heightScale, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[bodyWidthClamped * 0.35, 1.0 * heightScale, 0]} castShadow>
        <sphereGeometry args={[0.15 * heightScale, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Upper Arms */}
      <mesh
        position={[-bodyWidthClamped * 0.35 - 0.05 * heightScale, 0.75 * heightScale, 0]}
        rotation={[0, 0, 0.15]}
        castShadow
      >
        <cylinderGeometry args={[0.1 * heightScale, 0.1 * heightScale, 0.35 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh
        position={[bodyWidthClamped * 0.35 + 0.05 * heightScale, 0.75 * heightScale, 0]}
        rotation={[0, 0, -0.15]}
        castShadow
      >
        <cylinderGeometry args={[0.1 * heightScale, 0.1 * heightScale, 0.35 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Lower Arms */}
      <mesh
        position={[
          -bodyWidthClamped * 0.35 - 0.05 * heightScale - 0.2 * heightScale,
          0.5 * heightScale,
          0,
        ]}
        rotation={[0, 0, 0.25]}
        castShadow
      >
        <cylinderGeometry args={[0.09 * heightScale, 0.08 * heightScale, 0.3 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh
        position={[
          bodyWidthClamped * 0.35 + 0.05 * heightScale + 0.2 * heightScale,
          0.5 * heightScale,
          0,
        ]}
        rotation={[0, 0, -0.25]}
        castShadow
      >
        <cylinderGeometry args={[0.09 * heightScale, 0.08 * heightScale, 0.3 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Hands */}
      <mesh
        position={[
          -bodyWidthClamped * 0.35 - 0.05 * heightScale - 0.35 * heightScale,
          0.35 * heightScale,
          0,
        ]}
        castShadow
      >
        <sphereGeometry args={[0.1 * heightScale, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh
        position={[
          bodyWidthClamped * 0.35 + 0.05 * heightScale + 0.35 * heightScale,
          0.35 * heightScale,
          0,
        ]}
        castShadow
      >
        <sphereGeometry args={[0.1 * heightScale, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Upper Legs */}
      <mesh position={[-0.12 * heightScale, 0.15 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.12 * heightScale, 0.13 * heightScale, 0.4 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.12 * heightScale, 0.15 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.12 * heightScale, 0.13 * heightScale, 0.4 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Lower Legs */}
      <mesh position={[-0.12 * heightScale, -0.2 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.1 * heightScale, 0.11 * heightScale, 0.35 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.12 * heightScale, -0.2 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.1 * heightScale, 0.11 * heightScale, 0.35 * heightScale, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.12 * heightScale, -0.45 * heightScale, 0.1 * heightScale]} castShadow>
        <boxGeometry args={[0.15 * heightScale, 0.08 * heightScale, 0.2 * heightScale]} />
        <meshStandardMaterial color={0x333333} />
      </mesh>
      <mesh position={[0.12 * heightScale, -0.45 * heightScale, 0.1 * heightScale]} castShadow>
        <boxGeometry args={[0.15 * heightScale, 0.08 * heightScale, 0.2 * heightScale]} />
        <meshStandardMaterial color={0x333333} />
      </mesh>
    </group>
  );
}

export default ProceduralAvatar;

