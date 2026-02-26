import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AvatarModel({ modelPath, height = 170, weight = 65, skinColor = '#ffddb3', hairType = 'straight' }) {
  const groupRef = useRef();
  const mixerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [animations, setAnimations] = useState([]);

  const fileExtension = modelPath?.toLowerCase().split('.').pop();
  const isFBX = fileExtension === 'fbx';
  const isGLTF = fileExtension === 'gltf' || fileExtension === 'glb';

  // Load model
  useEffect(() => {
    if (!modelPath) return;

    if (isFBX) {
      // Load FBX
      import('three/examples/jsm/loaders/FBXLoader.js').then(({ FBXLoader }) => {
        const loader = new FBXLoader();
        loader.load(
          modelPath,
          (fbx) => {
            console.log('✅ FBX loaded successfully!');
            console.log('FBX info:', {
              children: fbx.children.length,
              animations: fbx.animations?.length || 0,
            });
            setModel(fbx);
            setAnimations(fbx.animations || []);
          },
          (progress) => {
            if (progress.total > 0) {
              console.log('📥 Loading:', ((progress.loaded / progress.total) * 100).toFixed(1) + '%');
            }
          },
          (err) => {
            console.error('❌ FBX load error:', err);
          },
        );
      });
    } else if (isGLTF) {
      // Load GLTF/GLB
      import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
        const loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf) => {
            console.log('✅ GLTF loaded successfully!');
            console.log('GLTF info:', {
              scene: gltf.scene,
              animations: gltf.animations?.length || 0,
            });
            setModel(gltf.scene);
            setAnimations(gltf.animations || []);
          },
          (progress) => {
            if (progress.total > 0) {
              console.log('📥 Loading:', ((progress.loaded / progress.total) * 100).toFixed(1) + '%');
            }
          },
          (err) => {
            console.error('❌ GLTF load error:', err);
          },
        );
      });
    }
  }, [modelPath, isFBX, isGLTF]);

  // Set up animations
  useEffect(() => {
    if (!model || animations.length === 0 || mixerRef.current) return;

    const mixer = new THREE.AnimationMixer(model);
    mixerRef.current = mixer;

    animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
      console.log(`🎬 Playing animation: ${clip.name}`);
    });

    console.log(`✅ ${animations.length} animation(s) playing`);

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [model, animations]);

  // Update animation mixer
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    if (groupRef.current && !mixerRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Scale, position, and customize model
  useEffect(() => {
    if (!model || !groupRef.current) return;

    // Remove old model if exists
    while (groupRef.current.children.length > 0) {
      const child = groupRef.current.children[0];
      groupRef.current.remove(child);
      // Dispose of geometries and materials
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    const clonedModel = model.clone();

    // Enable shadows
    clonedModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Calculate scale and position using the ORIGINAL model (before animations)
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('📏 Original model size (rest pose):', size);

    // Use a fixed, very small scale to handle large meshes
    const fixedScale = 0.0005;
    clonedModel.scale.set(fixedScale, fixedScale, fixedScale);
    clonedModel.updateMatrixWorld(true);

    // Recalculate box after initial scaling
    const scaledBox = new THREE.Box3().setFromObject(clonedModel);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    const scaledSize = scaledBox.getSize(new THREE.Vector3());

    // Apply user height adjustment on top of fixed scale
    const heightAdjustment = height / 170;
    const finalScaleValue = fixedScale * heightAdjustment;

    clonedModel.scale.set(finalScaleValue, finalScaleValue, finalScaleValue);
    clonedModel.updateMatrixWorld(true);

    // Recalculate again with final scale
    const finalBox = new THREE.Box3().setFromObject(clonedModel);
    const finalCenter = finalBox.getCenter(new THREE.Vector3());
    const finalSize = finalBox.getSize(new THREE.Vector3());

    // Reset position first
    clonedModel.position.set(0, 0, 0);

    // Center the model horizontally (X and Z) using final box
    clonedModel.position.x = -finalCenter.x;
    clonedModel.position.z = -finalCenter.z;

    // Position model so its feet are at y=0 (ground level)
    clonedModel.position.y = -finalBox.min.y;

    console.log('📍 Model positioning:', {
      originalSize: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
      finalSize: { x: finalSize.x.toFixed(2), y: finalSize.y.toFixed(2), z: finalSize.z.toFixed(2) },
      finalCenter: { x: finalCenter.x.toFixed(2), y: finalCenter.y.toFixed(2), z: finalCenter.z.toFixed(2) },
      finalPosition: {
        x: clonedModel.position.x.toFixed(2),
        y: clonedModel.position.y.toFixed(2),
        z: clonedModel.position.z.toFixed(2),
      },
      modelBottom: finalBox.min.y.toFixed(2),
      modelTop: finalBox.max.y.toFixed(2),
      finalScale: finalScaleValue.toFixed(6),
    });

    console.log('✅ Model positioned and scaled:', {
      originalSize: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
      finalSize: { x: finalSize.x.toFixed(2), y: finalSize.y.toFixed(2), z: finalSize.z.toFixed(2) },
      position: {
        x: clonedModel.position.x.toFixed(2),
        y: clonedModel.position.y.toFixed(2),
        z: clonedModel.position.z.toFixed(2),
      },
      scale: finalScaleValue.toFixed(6),
      shouldFitOnScreen: finalSize.y < 0.5 ? '✅ YES' : '❌ NO - too large',
      cameraDistance: 22.0,
      recommendation: finalSize.y >= 0.5 ? 'Model still too large - reducing scale further' : 'Model should fit on screen',
    });

    // Apply customizations
    customizeModel(clonedModel, height, weight, skinColor, hairType);

    groupRef.current.add(clonedModel);

    console.log('✅ Model positioned:', {
      position: clonedModel.position,
      scale: clonedModel.scale,
      size: size,
    });
  }, [model, height, weight, skinColor, hairType]);

  if (!modelPath || !model) {
    return null; // Loading - Suspense will handle
  }

  return <group ref={groupRef} />;
}

// Customize model materials
function customizeModel(model, currentHeight, currentWeight, currentSkinColor, currentHairType) {
  if (!model) return;

  const bmi = currentWeight / ((currentHeight / 100) ** 2);
  const bodyScale = 1 + (bmi - 22) * 0.02;

  model.traverse((child) => {
    if (child.isMesh) {
      // Customize skin color
      if (
        child.name.toLowerCase().includes('skin') ||
        child.name.toLowerCase().includes('body') ||
        child.name.toLowerCase().includes('head') ||
        child.name.toLowerCase().includes('arm') ||
        child.name.toLowerCase().includes('leg') ||
        child.name.toLowerCase().includes('hand') ||
        child.name.toLowerCase().includes('foot')
      ) {
        if (child.material) {
          const material = Array.isArray(child.material) ? child.material[0] : child.material;
          if (material.isMeshStandardMaterial || material.isMeshPhongMaterial) {
            material.color.setHex(currentSkinColor.replace('#', '0x'));
            material.needsUpdate = true;
          }
        }
      }

      // Customize hair
      if (child.name.toLowerCase().includes('hair')) {
        if (currentHairType === 'bald') {
          child.visible = false;
        } else {
          child.visible = true;
          if (child.material) {
            const material = Array.isArray(child.material) ? child.material[0] : child.material;
            if (material.isMeshStandardMaterial || material.isMeshPhongMaterial) {
              const hairColor = currentHairType === 'curly' ? 0x4a3728 : 0x2c1810;
              material.color.setHex(hairColor);
              material.needsUpdate = true;
            }
          }
        }
      }

      // Scale body parts based on weight
      if (
        child.name.toLowerCase().includes('body') ||
        child.name.toLowerCase().includes('torso') ||
        child.name.toLowerCase().includes('chest')
      ) {
        child.scale.x = bodyScale;
        child.scale.z = bodyScale;
      }
    }
  });
}

export default AvatarModel;

