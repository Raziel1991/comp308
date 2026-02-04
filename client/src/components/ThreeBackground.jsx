import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Prevent duplicate canvases (React StrictMode mounts twice in dev)
    while (mount.firstChild) mount.removeChild(mount.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 3000; i++) {
      vertices.push(THREE.MathUtils.randFloatSpread(1500));
      vertices.push(THREE.MathUtils.randFloatSpread(1500));
      vertices.push(THREE.MathUtils.randFloatSpread(1500));
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 2,
      transparent: true,
      opacity: 0.4
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Stardust / Sparks layer (smaller set of bright twinkling points) ---
    const sparkGeo = new THREE.BufferGeometry();
    const sparkCount = 140;
    const sparkVertices = new Float32Array(sparkCount * 3);
    const sparkPhases = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      sparkVertices[i * 3] = THREE.MathUtils.randFloatSpread(1500);
      sparkVertices[i * 3 + 1] = THREE.MathUtils.randFloatSpread(1500);
      sparkVertices[i * 3 + 2] = THREE.MathUtils.randFloatSpread(1500);
      sparkPhases[i] = Math.random() * Math.PI * 2;
    }
    sparkGeo.setAttribute('position', new THREE.Float32BufferAttribute(sparkVertices, 3));
    sparkGeo.setAttribute('phase', new THREE.Float32BufferAttribute(sparkPhases, 1));

    const sparkMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        size: { value: 6.0 },
        color: { value: new THREE.Color(0xfff4d6) }
      },
      vertexShader: `attribute float phase;
        uniform float time;
        uniform float size;
        varying float vF;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // simple per-point flicker
          vF = 0.5 + 0.5 * sin(time * 4.0 + phase);
          // scale with depth so size feels consistent
          gl_PointSize = size * (1.0 + 1.2 * vF) * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }`,
      fragmentShader: `uniform vec3 color;
        varying float vF;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          // soft circular falloff
          float alpha = smoothstep(0.5, 0.0, d);
          // make twinkle depend on vF
          alpha *= (0.5 + 0.5 * vF);
          gl_FragColor = vec4(color, alpha);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const sparks = new THREE.Points(sparkGeo, sparkMaterial);
    scene.add(sparks);

    camera.position.z = 200;

    // Respect reduced-motion preference and use a clock for smooth time updates
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // subtle rotations
      points.rotation.y += 0.0003;
      points.rotation.x += 0.0001;

      // spark twinkle animation (skip or minimize for reduced motion)
      if (!reduceMotion) {
        const t = clock.getElapsedTime();
        sparkMaterial.uniforms.time.value = t;
        sparks.rotation.y += 0.0006;
      } else {
        sparkMaterial.uniforms.time.value = 0;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);

      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);

      // Remove and dispose spark resources
      scene.remove(sparks);
      sparkGeo.dispose();
      sparkMaterial.dispose();

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // z-0 and pointer-events-none so it never blocks clicks
  return <div ref={mountRef} className="fixed inset-0 z-0 bg-slate-950 pointer-events-none" />;
}
