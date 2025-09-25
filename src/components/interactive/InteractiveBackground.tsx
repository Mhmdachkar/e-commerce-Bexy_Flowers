import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Particle {
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
  life: number;
  maxLife: number;
}

const ParticleField: React.FC<{ mouse: { x: number; y: number } }> = ({ mouse }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleCount = 50;

  useEffect(() => {
    const initialParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        velocity: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ],
        size: Math.random() * 0.1 + 0.05,
        life: Math.random() * 100,
        maxLife: 100
      });
    }
    setParticles(initialParticles);
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        // Mouse attraction
        const mouseForceX = (mouse.x * 10 - particle.position[0]) * 0.0001;
        const mouseForceY = (-mouse.y * 10 - particle.position[1]) * 0.0001;

        // Update velocity with mouse attraction
        const newVelocity: [number, number, number] = [
          particle.velocity[0] + mouseForceX,
          particle.velocity[1] + mouseForceY,
          particle.velocity[2]
        ];

        // Apply damping
        newVelocity[0] *= 0.99;
        newVelocity[1] *= 0.99;
        newVelocity[2] *= 0.99;

        // Update position
        const newPosition: [number, number, number] = [
          particle.position[0] + newVelocity[0],
          particle.position[1] + newVelocity[1],
          particle.position[2] + newVelocity[2]
        ];

        // Boundary check
        if (Math.abs(newPosition[0]) > 10) newVelocity[0] *= -0.5;
        if (Math.abs(newPosition[1]) > 10) newVelocity[1] *= -0.5;
        if (Math.abs(newPosition[2]) > 10) newVelocity[2] *= -0.5;

        // Update life
        let newLife = particle.life + 1;
        if (newLife > particle.maxLife) {
          newLife = 0;
          newPosition[0] = (Math.random() - 0.5) * 20;
          newPosition[1] = (Math.random() - 0.5) * 20;
          newPosition[2] = (Math.random() - 0.5) * 20;
        }

        return {
          ...particle,
          position: newPosition,
          velocity: newVelocity,
          life: newLife
        };
      });
    });

    // Update points geometry
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position[0];
      positions[i * 3 + 1] = particle.position[1];
      positions[i * 3 + 2] = particle.position[2];

      // Gold color with varying opacity based on life
      const alpha = 1 - (particle.life / particle.maxLife);
      colors[i * 3] = 1; // R
      colors[i * 3 + 1] = 0.84; // G
      colors[i * 3 + 2] = 0; // B

      sizes[i] = particle.size * alpha;
    });

    if (pointsRef.current.geometry.attributes.position) {
      (pointsRef.current.geometry.attributes.position.array as Float32Array).set(positions);
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (pointsRef.current.geometry.attributes.color) {
      (pointsRef.current.geometry.attributes.color.array as Float32Array).set(colors);
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
    if (pointsRef.current.geometry.attributes.size) {
      (pointsRef.current.geometry.attributes.size.array as Float32Array).set(sizes);
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef}>
      <PointMaterial
        transparent
        vertexColors
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const FloatingPetals: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    groupRef.current.children.forEach((child, index) => {
      child.position.y = Math.sin(clock.getElapsedTime() + index) * 0.5;
      child.rotation.z = clock.getElapsedTime() * 0.2 + index;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh
          key={index}
          position={[
            Math.cos(index * Math.PI * 2 / 8) * 5,
            Math.random() * 10 - 5,
            Math.sin(index * Math.PI * 2 / 8) * 5
          ]}
        >
          <planeGeometry args={[0.5, 0.8]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

const InteractiveBackground: React.FC = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate background color based on scroll and time
  const getBackgroundColor = () => {
    const time = Date.now() * 0.0001;
    const scrollFactor = Math.min(scrollY / 1000, 1);
    
    // Time-based color shifting
    const hue = (time * 10) % 360;
    const saturation = 10 + scrollFactor * 5; // Very subtle saturation
    const lightness = 3 + Math.sin(time) * 1; // Very dark, subtle variation
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: getBackgroundColor(),
        transition: 'background 2s ease-in-out'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <ParticleField mouse={mouse} />
        <FloatingPetals />
      </Canvas>
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mouse.x * 50 + 50}% ${-mouse.y * 50 + 50}%, 
            hsl(var(--primary) / 0.1) 0%, 
            transparent 50%)`
        }}
      />
    </div>
  );
};

export default InteractiveBackground;