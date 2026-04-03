'use client';

import { motion, useScroll } from 'motion/react';
import { useRef, Suspense } from 'react';
import { Rocket, BatteryCharging, Globe, ChevronDown, Hammer, Stethoscope, Home, Scissors } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Moon() {
  const { scrollYProgress } = useScroll();
  const moonRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Use a reliable public domain moon texture
  const [colorMap] = useTexture(['https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg']);

  useFrame((state, delta) => {
    const offset = scrollYProgress.get();

    let targetX = 0;
    let targetY = 0;
    let targetScale = 2.5;

    // Define breakpoints based on 5 sections
    if (offset < 0.2) {
      const t = offset / 0.2;
      targetX = THREE.MathUtils.lerp(0, 2.5, t);
      targetScale = THREE.MathUtils.lerp(2.5, 1.5, t);
      targetY = 0;
    } else if (offset < 0.4) {
      const t = (offset - 0.2) / 0.2;
      targetX = THREE.MathUtils.lerp(2.5, -2.5, t);
      targetScale = 1.5;
      targetY = 0;
    } else if (offset < 0.6) {
      const t = (offset - 0.4) / 0.2;
      targetX = THREE.MathUtils.lerp(-2.5, 0, t);
      targetScale = THREE.MathUtils.lerp(1.5, 2.5, t);
      targetY = THREE.MathUtils.lerp(0, -1, t);
    } else if (offset < 0.8) {
      const t = (offset - 0.6) / 0.2;
      targetX = 0;
      targetScale = THREE.MathUtils.lerp(2.5, 1.5, t);
      targetY = THREE.MathUtils.lerp(-1, 2.5, t);
    } else {
      targetX = 0;
      targetScale = 1.5;
      targetY = 2.5;
    }

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 4, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 4, delta);
      groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta));
    }

    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05;
      moonRef.current.rotation.x = offset * Math.PI * 2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh ref={moonRef}>
          {/* Increased geometry resolution for displacement map */}
          <sphereGeometry args={[1, 128, 128]} />
          <meshStandardMaterial
            map={colorMap}
            roughness={0.9}
            bumpMap={colorMap}
            bumpScale={0.02}
            displacementMap={colorMap}
            displacementScale={0.03}
            metalness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Drill() {
  const { scrollYProgress } = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const drillBitRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const offset = scrollYProgress.get();

    let targetX = 5;
    let targetY = 0;
    let targetScale = 0;
    let targetRotZ = 0;
    let targetRotY = 0;

    if (offset < 0.2) {
      const t = offset / 0.2;
      targetX = THREE.MathUtils.lerp(5, 2.5, t);
      targetScale = THREE.MathUtils.lerp(0, 1.5, t);
      targetY = 0;
      targetRotZ = THREE.MathUtils.lerp(Math.PI, Math.PI / 4, t);
    } else if (offset < 0.4) {
      const t = (offset - 0.2) / 0.2;
      targetX = 2.5;
      targetScale = 1.5;
      targetY = THREE.MathUtils.lerp(0, 1, t);
      targetRotZ = Math.PI / 4;
      targetRotY = THREE.MathUtils.lerp(0, -Math.PI / 2, t);
    } else if (offset < 0.6) {
      const t = (offset - 0.4) / 0.2;
      targetX = THREE.MathUtils.lerp(2.5, 0, t);
      targetScale = THREE.MathUtils.lerp(1.5, 2.5, t);
      targetY = THREE.MathUtils.lerp(1, 1.5, t);
      targetRotZ = THREE.MathUtils.lerp(Math.PI / 4, 0, t);
      targetRotY = -Math.PI / 2;
    } else if (offset < 0.8) {
      const t = (offset - 0.6) / 0.2;
      targetX = 0;
      targetScale = THREE.MathUtils.lerp(2.5, 1.5, t);
      targetY = THREE.MathUtils.lerp(1.5, -1.5, t);
      targetRotZ = THREE.MathUtils.lerp(0, -Math.PI / 4, t);
      targetRotY = THREE.MathUtils.lerp(-Math.PI / 2, 0, t);
    } else {
      const t = (offset - 0.8) / 0.2;
      targetX = THREE.MathUtils.lerp(0, -2.5, t);
      targetScale = 1.5;
      targetY = THREE.MathUtils.lerp(-1.5, 0, t);
      targetRotZ = -Math.PI / 4;
      targetRotY = 0;
    }

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 4, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 4, delta);
      groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta));
      
      // Smoothly rotate the whole drill assembly
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 4, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
      
      // Add a continuous floating bob/sway
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    if (drillBitRef.current) {
      // Spin the drill bit continuously!
      drillBitRef.current.rotation.y += delta * 20;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group rotation={[0, -Math.PI / 4, 0]}>
          {/* Body pointing forward along Z */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 1.2, 32]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Handle pointing down along Y */}
          <mesh position={[0, -0.5, -0.3]} rotation={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
            <meshStandardMaterial color="#222" roughness={0.8} />
          </mesh>
          {/* Battery at bottom of handle */}
          <mesh position={[0, -0.9, -0.35]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.35, 0.25, 0.5]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
          {/* Trigger */}
          <mesh position={[0, -0.3, -0.15]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.1]} />
            <meshStandardMaterial color="#ef4444" roughness={0.6} />
          </mesh>
          {/* Chuck at front of body (Z axis) */}
          <mesh position={[0, 0, 0.7]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.25, 0.3, 32]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Drill Bit at front of chuck */}
          <mesh ref={drillBitRef} position={[0, 0, 1.1]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Accents / Details */}
          <mesh position={[0, 0.25, -0.2]} rotation={[Math.PI/2, 0, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Asteroids() {
  const { scrollYProgress } = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = scrollYProgress.get() * 15;
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 40 }).map((_, i) => {
        const position = [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 40 - 10,
          (Math.random() - 0.5) * 15 - 5
        ];
        const scale = Math.random() * 0.4 + 0.05;
        return (
          <Float key={i} speed={Math.random() * 2} rotationIntensity={Math.random() * 2}>
            <mesh position={position as any} scale={scale}>
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#444" roughness={0.9} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#4466ff" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Suspense fallback={null}>
        <Moon />
        <Drill />
      </Suspense>
      <Asteroids />
    </>
  );
}

export default function Story() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="bg-black text-white min-h-[500vh] relative selection:bg-amber-500/30 font-sans">
      {/* 3D Background - Removed pointer-events-none so tooltips work */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#030305']} />
          <Scene />
        </Canvas>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-yellow-400 origin-left z-50 pointer-events-none"
        style={{ scaleX: scrollYProgress }}
      />

      {/* HTML Content Overlay - pointer-events-none on container, auto on children */}
      <div className="relative z-10 w-full pointer-events-none">
        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto backdrop-blur-sm bg-black/20 p-8 rounded-3xl border border-white/5 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm mb-8 text-amber-300">
              <Rocket className="w-4 h-4" />
              <span className="font-medium tracking-wide uppercase text-xs">Spin-offs Assignment Research</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white drop-shadow-2xl">
              Cordless Tools
            </h1>
            <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-light tracking-tight drop-shadow-lg">
              Originally the Apollo Lunar Surface Drill
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-12 text-slate-500 pointer-events-none"
          >
            <ChevronDown className="w-8 h-8 opacity-50" />
          </motion.div>
        </section>

        {/* Section 1: The Space Problem */}
        <section className="h-screen flex items-center px-6 md:px-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="max-w-xl backdrop-blur-md bg-black/40 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
              <BatteryCharging className="w-8 h-8 text-red-400" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">Why was it needed in space?</h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-6 font-light">
              Astronauts needed a cordless drill to extract rock samples from the moon.
            </p>
            <p className="text-xl text-slate-400 leading-relaxed font-light">
              Power cords were a massive hazard in the zero-gravity and harsh lunar environment. Furthermore, storing and transmitting power via traditional means was incredibly difficult. They needed something completely untethered.
            </p>
          </motion.div>
        </section>

        {/* Section 2: The Invention */}
        <section className="h-screen flex items-center justify-end px-6 md:px-24">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="max-w-xl backdrop-blur-md bg-black/40 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl pointer-events-auto"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-8 font-medium tracking-wide">
              1961 — The Breakthrough
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">The Apollo Lunar Surface Drill</h2>
            <div className="space-y-8 text-lg text-slate-300">
              <div>
                <strong className="font-display text-white block mb-2 text-2xl">What is it?</strong>
                <p className="text-lg font-light leading-relaxed text-slate-400">A specialized battery-powered drill designed to operate in the vacuum of space, specifically engineered to extract core samples from the lunar surface.</p>
              </div>
              <div>
                <strong className="font-display text-white block mb-2 text-2xl">Who created it?</strong>
                <p className="text-lg font-light leading-relaxed text-slate-400">Black & Decker invented the first cordless tool in 1961. However, NASA recruited them to meet the extreme requirements of space travel. This collaboration led to massive leaps in technology that solidified cordless tools in the modern world.</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 3: Earth Adaptation */}
        <section className="h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center backdrop-blur-xl bg-black/50 p-12 rounded-[3rem] border border-white/10 shadow-2xl pointer-events-auto"
          >
            <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20">
              <Globe className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-8">Bringing it back to Earth</h2>
            <p className="text-2xl text-slate-300 leading-relaxed mb-10 font-light">
              Black & Decker developed a unique computer program to optimize the drill's motor, ensuring maximum power efficiency and minimal power consumption.
            </p>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 text-emerald-100 text-xl font-light leading-relaxed">
              The company used this technological advancement to make drills vastly lighter, cheaper, and more practical for everyday consumers.
            </div>
          </motion.div>
        </section>

        {/* Section 4: Daily Life */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 backdrop-blur-sm bg-black/20 p-8 rounded-3xl border border-white/5 pointer-events-auto"
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">Everyday Impact</h2>
            <p className="text-xl text-slate-400 font-light">How this space technology shapes our daily lives</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full pointer-events-auto">
            {[
              { icon: Hammer, title: "Construction", desc: "Building homes and infrastructure without being tethered to power outlets." },
              { icon: Scissors, title: "Lawn Care", desc: "Battery-powered trimmers, mowers, and blowers for easier yard maintenance." },
              { icon: Stethoscope, title: "Medical Field", desc: "Precision cordless surgical tools used in operating rooms worldwide." },
              { icon: Home, title: "Household Fixes", desc: "Everyday DIY repairs, assembling furniture, and quick home improvements." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-[2rem] backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/10 text-center text-slate-500 backdrop-blur-xl bg-black/80 pointer-events-auto">
          <div className="max-w-4xl mx-auto">
            <h4 className="font-display text-white font-semibold mb-6 text-xl">Sources & References</h4>
            <ul className="space-y-4 text-lg font-light flex flex-col items-center">
              <li>
                <a href="https://www.blackanddecker.com/pages/milestones" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors underline decoration-white/20 underline-offset-4">
                  Black & Decker Milestones
                </a>
              </li>
              <li>
                <a href="https://spinoff.nasa.gov/Spinoff2004/er_1.html" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors underline decoration-white/20 underline-offset-4">
                  NASA Spinoff 2004: Cordless Tools
                </a>
              </li>
              <li>
                <a href="https://nasa.gov" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors underline decoration-white/20 underline-offset-4">
                  NASA.gov
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
