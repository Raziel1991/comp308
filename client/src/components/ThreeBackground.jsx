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

    camera.position.z = 200;

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      points.rotation.y += 0.0003;
      points.rotation.x += 0.0001;
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

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // z-0 and pointer-events-none so it never blocks clicks
  return <div ref={mountRef} className="fixed inset-0 z-0 bg-slate-950 pointer-events-none" />;
}
