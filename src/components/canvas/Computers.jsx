import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";
import { useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./robot_playground/scene.gltf");
  const { actions } = useAnimations(computer.animations, computer.scene);

  useEffect(() => {
    if (actions) {
      const firstAction = Object.keys(actions)[0];
      actions[firstAction].play(); // Play the first animation clip
      actions[firstAction].setLoop(THREE.LoopRepeat); // Ensure the animation loops
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (actions) {
      const firstAction = Object.keys(actions)[0];
      const mixer = actions[firstAction]?.getMixer();
      if (mixer) {
        mixer.update(delta); // Update animation frame
      }
    }
  });

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 1.5 : 2}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='always' // Update to 'always' for continuous rendering
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
