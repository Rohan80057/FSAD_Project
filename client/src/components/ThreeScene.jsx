import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

const ParticleGlobe = ({ color = "#8b5cf6" }) => {
    const ref = useRef();
    const sphere = random.inSphere(new Float32Array(5000), { radius: 1.5 });

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const ThreeScene = ({ color }) => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
            <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <ambientLight intensity={0.5} />
                <ParticleGlobe color={color} />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
