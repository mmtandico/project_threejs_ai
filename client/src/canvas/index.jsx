import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import StudioShirt from './StudioShirt';

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={3}
        // Aim the orbit pivot at the belly area of the studio shirt
        target={[0.15, -0.1, 0]}
        enableDamping={true}
        dampingFactor={0.15}
        rotateSpeed={0.7}
        // Extra smooth, easy scroll zoom in/out
        zoomSpeed={0.35}
        // Blender‑like turntable feel: full 360° around, limited vertical tilt
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />

      <CameraRig>
        <Backdrop />
        <Suspense fallback={null}>
          <StudioShirt />
        </Suspense>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel