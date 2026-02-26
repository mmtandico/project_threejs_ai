import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    // Position the camera at a good viewing distance/height
    camera.position.set(0, 1.5, 4);
    // Look at the avatar's torso/belly area (feet at y = 0)
    camera.lookAt(0, 1.0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

export default CameraController;

