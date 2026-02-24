import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // While on the intro/landing view, gently move the camera into place.
    // In the customizer view we let OrbitControls fully manage the camera
    // so rotation does not snap back.
    if (!snap.intro) return;

    let targetPosition = [-0.4, 0, 2];
    if (isBreakpoint) targetPosition = [0, 0, 2];
    if (isMobile) targetPosition = [0, 0.2, 2.5];

    easing.damp3(state.camera.position, targetPosition, 0.25, delta)
  })


  return <group ref={group}>{children}</group>
}

export default CameraRig