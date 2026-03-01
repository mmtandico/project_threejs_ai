import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';

import state from '../store';
import { getStorageUrl } from '../config/supabase';

/**
 * Full‑body 3D Avatar preview.
 * This version keeps the whole character in frame (head‑to‑toe)
 * for a clean front view similar to a character sheet.
 */
const AvatarPreviewFullBody = () => {
    const snap = useSnapshot(state);
    const groupRef = useRef();
    const fallbackBodyRef = useRef();

    // Get avatar model URLs from Supabase Storage
    const maleAvatarUrl = useMemo(() => getStorageUrl('MaleAvatar1.fbx'), []);
    const femaleAvatarUrl = useMemo(() => getStorageUrl('FemaleAvatar.fbx'), []);

    // Load both avatars so we can easily swap later
    const maleScene = useLoader(FBXLoader, maleAvatarUrl);
    const femaleScene = useLoader(FBXLoader, femaleAvatarUrl);

    // Choose which avatar to show based on global gender selection
    const avatarScene = useMemo(() => {
        if (snap.avatarGender === 'female') return femaleScene || maleScene;
        return maleScene || femaleScene;
    }, [snap.avatarGender, maleScene, femaleScene]);

    // Normalise scale & orientation so the full body fits nicely in view
    useEffect(() => {
        if (!avatarScene) return;

        avatarScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.roughness = Math.min(0.8, child.material.roughness ?? 0.8);
                }
            }
        });

        // Reset transform so we don't accumulate scaling when switching avatars.
        avatarScene.scale.set(1, 1, 1);
        avatarScene.position.set(0, 0, 0);

        const box = new THREE.Box3().setFromObject(avatarScene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        // Slightly larger targetHeight => bigger avatar on screen,
        // still keeping the full body in frame.
        const targetHeight = 0.16;
        const scale = targetHeight / maxAxis;

        avatarScene.scale.setScalar(scale);

        // Center model, then push slightly down so feet are close to the bottom
        avatarScene.position.sub(center);
        avatarScene.position.y -= 0.15;
    }, [avatarScene]);

    // Slow idle turn so the avatar feels alive
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.25;
        } else if (fallbackBodyRef.current) {
            fallbackBodyRef.current.rotation.y += delta * 0.25;
        }
    });

    return (
        // Keep the group at origin; framing is handled by the camera config in the Canvas.
        <group>
            {avatarScene ? (
                <group ref={groupRef}>
                    <primitive object={avatarScene} />
                </group>
            ) : (
                <mesh ref={fallbackBodyRef} castShadow receiveShadow>
                    <boxGeometry args={[0.4, 1.6, 0.35]} />
                    <meshStandardMaterial color="#8ab4ff" metalness={0.1} roughness={0.4} />
                </mesh>
            )}
        </group>
    );
};

export default AvatarPreviewFullBody;

