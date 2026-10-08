import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';

export default function Scene() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        
        <Sphere args={[1, 100, 200]} scale={2.5}>
          <MeshDistortMaterial
            color="#ff4500"
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
