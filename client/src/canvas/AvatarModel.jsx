import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function AvatarModel({
  modelPath,
  height = 170,
  weight = 65,
  skinColor = '#ffddb3',
  hairType = 'straight',
  onCenterChange,
}) {
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
      // Load FBX lazily so it doesn't bloat the initial bundle
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
      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          console.log('✅ GLTF/GLB loaded successfully!');
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
          console.error('❌ GLTF/GLB load error:', err);
        },
      );
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

    // Normalise the avatar so its total height in world units is stable,
    // and then apply user height as a simple multiplier.
    const originalHeight = size.y || 1;
    const baseTargetHeight = 2.0; // world-space height for a 170cm avatar
    const heightAdjustment = height / 170;
    const targetHeight = baseTargetHeight * heightAdjustment;
    const scaleFactor = targetHeight / originalHeight;

    clonedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    clonedModel.updateMatrixWorld(true);

    // Recalculate box after final scaling
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
      finalScale: scaleFactor.toFixed(6),
    });

    console.log('✅ Model positioned and scaled:', {
      originalSize: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
      finalSize: { x: finalSize.x.toFixed(2), y: finalSize.y.toFixed(2), z: finalSize.z.toFixed(2) },
      position: {
        x: clonedModel.position.x.toFixed(2),
        y: clonedModel.position.y.toFixed(2),
        z: clonedModel.position.z.toFixed(2),
      },
      scale: scaleFactor.toFixed(6),
      shouldFitOnScreen: finalSize.y < 3.5 ? '✅ YES' : '❌ NO - too large',
    });

    // Apply customizations
    customizeModel(clonedModel, height, weight, skinColor, hairType);

    groupRef.current.add(clonedModel);

    // After positioning, compute the world‑space box so we can expose
    // a stable tracking point (ideally the hip area) to the camera/controls.
    clonedModel.updateMatrixWorld(true);

    // Try to find a specific hip / pelvis / spine mesh or bone to track.
    let hipNode = null;
    clonedModel.traverse((child) => {
      if (!child.name) return;
      const name = child.name.toLowerCase();
      if (
        name.includes('hip') ||
        name.includes('pelvis') ||
        name.includes('spine')
      ) {
        // Prefer nodes that explicitly contain "hip" in the name.
        if (!hipNode || name.includes('hip')) {
          hipNode = child;
        }
      }
    });

    // First pass: measure current world bounds / hip height
    let worldBox = new THREE.Box3().setFromObject(clonedModel);
    let worldCenter = worldBox.getCenter(new THREE.Vector3());

    let hipPos = new THREE.Vector3();
    if (hipNode) {
      hipNode.getWorldPosition(hipPos);
    } else {
      // Approximate hips as a point partway between feet and head.
      const hipY =
        worldBox.min.y + (worldBox.max.y - worldBox.min.y) * 0.45;
      hipPos.set(worldCenter.x, hipY, worldCenter.z);
    }

    // Shift the whole avatar so that the hip point becomes the world origin (0, 0, 0).
    // This moves the feet into the negative Y side of world space as requested.
    clonedModel.position.y += -hipPos.y;
    clonedModel.updateMatrixWorld(true);

    // Recompute world data after shifting so we have an accurate tracking target.
    worldBox = new THREE.Box3().setFromObject(clonedModel);
    worldCenter = worldBox.getCenter(new THREE.Vector3());

    if (hipNode) {
      hipNode.getWorldPosition(hipPos);
    } else {
      // Re-estimate hip after the shift (should now be around Y = 0).
      const hipY =
        worldBox.min.y + (worldBox.max.y - worldBox.min.y) * 0.45;
      hipPos.set(worldCenter.x, hipY, worldCenter.z);
    }

    const trackingTarget = [hipPos.x, hipPos.y, hipPos.z];

    if (typeof onCenterChange === 'function') {
      onCenterChange(trackingTarget);
    }

    console.log('✅ Model positioned:', {
      position: clonedModel.position,
      scale: clonedModel.scale,
      size: size,
      trackingTarget,
      worldBox,
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

