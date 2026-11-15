"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function HeroCrescent3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallback2D, setFallback2D] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFallback2D(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFallback2D(true);
      return;
    }

    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / Math.max(1, el.clientHeight), 0.1, 100);
    camera.position.set(0, 0, 6.4);

    scene.add(new THREE.AmbientLight(0xd4af37, 0.7));
    const goldLight = new THREE.PointLight(0xfae29c, 4.5, 25);
    goldLight.position.set(3, 3, 4);
    scene.add(goldLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.6, 20);
    emeraldLight.position.set(-3, -2, 3);
    scene.add(emeraldLight);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x3b2c06,
      emissiveIntensity: 0.35,
    });

    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1.55, 0.36, Math.PI * 2 - 0.36, false);
    shape.absarc(0.5, 0.08, 1.26, Math.PI * 2 - 0.62, 0.62, true);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.07,
      bevelThickness: 0.07,
    });
    geo.center();

    const group = new THREE.Group();
    group.add(new THREE.Mesh(geo, goldMat));

    // Delicate geometric halo ring
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.025, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.55 })
    );
    group.add(halo);

    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), goldMat);
    star.position.set(0.95, 0.65, 0.12);
    group.add(star);

    scene.add(group);

    // Subtle floating gold particles
    const count = isMobile ? 60 : 140;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0xf4dc8b, size: 0.045, transparent: true, opacity: 0.72 })
    );
    scene.add(particles);

    let raf = 0;
    let paused = false;
    const clock = new THREE.Clock();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (paused) return;
      const t = clock.getElapsedTime();
      group.rotation.y = Math.sin(t * 0.55) * 0.38;
      group.position.y = Math.sin(t * 0.9) * 0.12;
      halo.rotation.z = t * 0.14;
      particles.rotation.y = t * 0.05;
      renderer.render(scene, camera);
    };
    loop();

    const onVis = () => {
      paused = document.hidden;
    };
    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / Math.max(1, el.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  if (fallback2D) {
    return (
      <div className="w-full h-64 sm:h-80 flex items-center justify-center relative">
        <div className="w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl absolute" />
        <svg viewBox="0 0 200 200" className="w-48 h-48 relative drop-shadow-[0_0_24px_rgba(212,175,55,0.45)]">
          <defs>
            <linearGradient id="heroGoldFallback" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F9E7A8" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8E6A12" />
            </linearGradient>
          </defs>
          <polygon
            points="100,14 125,39 161,39 161,75 186,100 161,125 161,161 125,161 100,186 75,161 39,161 39,125 14,100 39,75 39,39 75,39"
            fill="none"
            stroke="#10B981"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <path
            d="M112 36C75 38 48 69 48 106C48 144 79 175 117 175C138 175 157 166 170 151C159 156 147 159 134 159C97 159 68 130 68 93C68 68 82 47 102 35C105 35 109 35 112 36Z"
            fill="url(#heroGoldFallback)"
          />
        </svg>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-64 sm:h-80 lg:h-96" aria-hidden="true" />;
}
