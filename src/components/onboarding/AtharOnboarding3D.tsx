"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { AtharButton, AtharLogo } from "@/components/ui/DesignSystem";

interface AtharOnboarding3DProps {
  username: string;
  onFinish: (skipped: boolean) => Promise<void> | void;
}

const SCENES = [
  {
    id: 1,
    tag: "SCENE 01 — THE AWAKENING",
    title: "ATHAR | أَثَر",
    subtitle: "«كل بداية جميلة تترك أثرًا»",
    description: "بداية رحلتك داخل عالم رقمي إسلامي يجمع بين الطمأنينة والجمال والتنظيم الحديث.",
    accent: "#D4AF37",
  },
  {
    id: 2,
    tag: "SCENE 02 — THE PORTAL",
    title: "بوابة عالم أَثَر",
    subtitle: "هندسة إسلامية تفتح لك آفاق الخير",
    description: "نقوش هندسية متناغمة تقودك نحو منظومة متكاملة للعبادة والأثر والعمل الصالح.",
    accent: "#10B981",
  },
  {
    id: 3,
    tag: "SCENE 03 — THE QURAN",
    title: "القرآن الكريم",
    subtitle: "«ابدأ رحلتك مع القرآن الكريم»",
    description: "قراءة هادئة، تلاوات مختارة، خطط ختم، وعلامات مرجعية تحفظ موضعك بدقة.",
    accent: "#F2D98D",
  },
  {
    id: 4,
    tag: "SCENE 04 — THE REMEMBRANCE",
    title: "الذكر — الطمأنينة — الاستمرار",
    subtitle: "«اجعل للذكر أثرًا في يومك»",
    description: "مسبحة إلكترونية راقية ومكتبة أذكار وأدعية موثقة تبعث السكينة في يومك.",
    accent: "#34D399",
  },
  {
    id: 5,
    tag: "SCENE 05 — THE COMMUNITY",
    title: "شبكة الخير المترابطة",
    subtitle: "«أثرٌ يمتد، وخيرٌ يجمعنا»",
    description: "دعوات راقية، حملات جماعية، ومجتمعات هادفة تحفظ الخصوصية وتنشر النفع.",
    accent: "#E5C158",
  },
  {
    id: 6,
    tag: "SCENE 06 — YOUR NEW BEGINNING",
    title: "مرحبًا بك في ATHAR",
    subtitle: "«اترك أثرًا يبقى بعدك»",
    description: "عالمك الرقمي الإسلامي جاهز الآن — ابدأ رحلتك بثبات واطمئنان.",
    accent: "#D4AF37",
  },
] as const;

export default function AtharOnboarding3D({ username, onFinish }: AtharOnboarding3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [webglReady, setWebglReady] = useState(true);
  const sceneGroupRefs = useRef<{
    crescent?: THREE.Group;
    portal?: THREE.Group;
    mushaf?: THREE.Group;
    tasbih?: THREE.Group;
    network?: THREE.Group;
    camera?: THREE.PerspectiveCamera;
    emeraldLight?: THREE.PointLight;
  }>({});

  // Build WebGL 3D Scene (with mobile particle optimization, reduced motion, visibility pause & 2D fallback)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setWebglReady(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setWebglReady(false);
      return;
    }

    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040908, 0.045);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.set(0, 0.2, 8);

    const ambient = new THREE.AmbientLight(0xd4af37, 0.55);
    scene.add(ambient);

    const goldLight = new THREE.PointLight(0xf6df92, 4.2, 30);
    goldLight.position.set(3, 4, 5);
    scene.add(goldLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.4, 28);
    emeraldLight.position.set(-4, -2, 4);
    scene.add(emeraldLight);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.82,
      roughness: 0.22,
      emissive: 0x3b2c06,
      emissiveIntensity: 0.35,
    });

    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x0e6b4f,
      metalness: 0.55,
      roughness: 0.28,
      emissive: 0x063827,
      emissiveIntensity: 0.45,
    });

    // Floating Gold Particles (reduced count on mobile)
    const particleCount = isMobile ? 140 : 340;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf4d984,
      size: isMobile ? 0.07 : 0.055,
      transparent: true,
      opacity: 0.78,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 1. Sculpted 3D Golden Crescent Group
    const crescentGroup = new THREE.Group();
    const outerShape = new THREE.Shape();
    outerShape.absarc(0, 0, 1.8, 0.35, Math.PI * 2 - 0.35, false);
    outerShape.absarc(0.58, 0.08, 1.48, Math.PI * 2 - 0.62, 0.62, true);
    const crescentGeo = new THREE.ExtrudeGeometry(outerShape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    crescentGeo.center();
    const crescentMesh = new THREE.Mesh(crescentGeo, goldMat);
    crescentGroup.add(crescentMesh);

    const starMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), goldMat);
    starMesh.position.set(1.15, 0.72, 0.12);
    crescentGroup.add(starMesh);
    scene.add(crescentGroup);

    // 2. Islamic Geometric Portal Group (Octagonal Rings)
    const portalGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.1 + i * 0.55, 0.045, 10, 8),
        i % 2 === 0 ? goldMat : emeraldMat
      );
      ring.rotation.z = (i * Math.PI) / 8;
      ring.position.z = -i * 0.9;
      portalGroup.add(ring);
    }
    portalGroup.visible = false;
    scene.add(portalGroup);

    // 3. Open 3D Mushaf Group
    const mushafGroup = new THREE.Group();
    const leftPage = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.2, 0.1), goldMat);
    leftPage.position.set(-0.9, 0, 0);
    leftPage.rotation.y = 0.35;
    const rightPage = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.2, 0.1), goldMat);
    rightPage.position.set(0.9, 0, 0);
    rightPage.rotation.y = -0.35;
    const coverLeft = new THREE.Mesh(new THREE.BoxGeometry(1.78, 2.32, 0.06), emeraldMat);
    coverLeft.position.set(-0.92, 0, -0.09);
    coverLeft.rotation.y = 0.35;
    const coverRight = new THREE.Mesh(new THREE.BoxGeometry(1.78, 2.32, 0.06), emeraldMat);
    coverRight.position.set(0.92, 0, -0.09);
    coverRight.rotation.y = -0.35;
    mushafGroup.add(leftPage, rightPage, coverLeft, coverRight);
    mushafGroup.rotation.x = 0.22;
    mushafGroup.visible = false;
    scene.add(mushafGroup);

    // 4. 3D Tasbih Beads Ring Group
    const tasbihGroup = new THREE.Group();
    const beadCount = 33;
    const beadGeo = new THREE.SphereGeometry(0.16, 16, 16);
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const bead = new THREE.Mesh(beadGeo, i % 11 === 0 ? goldMat : emeraldMat);
      bead.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, Math.sin(angle * 2) * 0.25);
      tasbihGroup.add(bead);
    }
    tasbihGroup.rotation.x = 0.4;
    tasbihGroup.visible = false;
    scene.add(tasbihGroup);

    // 5. Community Golden Constellation Network Group
    const networkGroup = new THREE.Group();
    const nodePositions: THREE.Vector3[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.11, 12, 12);
    for (let i = 0; i < 18; i++) {
      const phi = Math.acos(-1 + (2 * i) / 18);
      const theta = Math.sqrt(18 * Math.PI) * phi;
      const v = new THREE.Vector3(
        2.3 * Math.cos(theta) * Math.sin(phi),
        2.0 * Math.sin(theta) * Math.sin(phi),
        2.0 * Math.cos(phi)
      );
      nodePositions.push(v);
      const node = new THREE.Mesh(nodeGeo, i % 3 === 0 ? goldMat : emeraldMat);
      node.position.copy(v);
      networkGroup.add(node);
    }
    const linePts: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 2.2) {
          linePts.push(
            nodePositions[i].x,
            nodePositions[i].y,
            nodePositions[i].z,
            nodePositions[j].x,
            nodePositions[j].y,
            nodePositions[j].z
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.45 })
    );
    networkGroup.add(lines);
    networkGroup.visible = false;
    scene.add(networkGroup);

    sceneGroupRefs.current = {
      crescent: crescentGroup,
      portal: portalGroup,
      mushaf: mushafGroup,
      tasbih: tasbihGroup,
      network: networkGroup,
      camera,
      emeraldLight,
    };

    let rafId = 0;
    let paused = false;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (paused) return;
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.04;
      crescentGroup.rotation.y = Math.sin(t * 0.6) * 0.35;
      crescentGroup.position.y = Math.sin(t * 0.9) * 0.14;
      portalGroup.rotation.z = t * 0.18;
      mushafGroup.rotation.y = Math.sin(t * 0.5) * 0.25;
      tasbihGroup.rotation.z = t * 0.22;
      tasbihGroup.rotation.y = Math.sin(t * 0.4) * 0.3;
      networkGroup.rotation.y = t * 0.22;
      networkGroup.rotation.x = Math.sin(t * 0.3) * 0.15;
      renderer.render(scene, camera);
    };
    animate();

    const onVisibility = () => {
      paused = document.hidden;
    };
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // GSAP Camera & Object Choreography between the 6 Scenes
  useEffect(() => {
    const refs = sceneGroupRefs.current;
    if (!refs.camera) return;

    const groups = [refs.crescent, refs.portal, refs.mushaf, refs.tasbih, refs.network];
    groups.forEach((g) => {
      if (g) g.visible = false;
    });

    if (sceneIndex === 0 || sceneIndex === 5) {
      if (refs.crescent) {
        refs.crescent.visible = true;
        gsap.fromTo(refs.crescent.scale, { x: 0.7, y: 0.7, z: 0.7 }, { x: 1, y: 1, z: 1, duration: 1.1, ease: "power3.out" });
      }
      gsap.to(refs.camera.position, { x: 0, y: 0.2, z: sceneIndex === 5 ? 7.2 : 8, duration: 1.2, ease: "power2.out" });
    } else if (sceneIndex === 1 && refs.portal) {
      refs.portal.visible = true;
      gsap.fromTo(refs.camera.position, { z: 9.5 }, { z: 5.5, duration: 1.3, ease: "power3.out" });
    } else if (sceneIndex === 2 && refs.mushaf) {
      refs.mushaf.visible = true;
      gsap.fromTo(refs.mushaf.scale, { x: 0.75, y: 0.75, z: 0.75 }, { x: 1.05, y: 1.05, z: 1.05, duration: 1.1, ease: "power2.out" });
      gsap.to(refs.camera.position, { x: 0, y: 0.4, z: 7.4, duration: 1.1 });
    } else if (sceneIndex === 3 && refs.tasbih) {
      refs.tasbih.visible = true;
      gsap.to(refs.camera.position, { x: 0, y: 0, z: 7.5, duration: 1.1 });
    } else if (sceneIndex === 4 && refs.network) {
      refs.network.visible = true;
      gsap.to(refs.camera.position, { x: 0, y: 0.1, z: 8.2, duration: 1.1 });
    }
  }, [sceneIndex]);

  const current = SCENES[sceneIndex];

  const handleComplete = async (skipped: boolean) => {
    setSaving(true);
    try {
      await onFinish(skipped);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#040807] text-[#F5F3EC] flex flex-col justify-between overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="ATHAR JOURNEY — رحلة الترحيب السينمائية"
    >
      {/* 3D WebGL Canvas or 2D Luxury Fallback */}
      {webglReady ? (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
      ) : (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center athar-geo-pattern">
          <div className="w-72 h-72 rounded-full bg-gradient-to-br from-[#0E4B38]/40 via-[#D4AF37]/20 to-transparent blur-3xl animate-pulse" />
        </div>
      )}

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040807]/80 via-transparent to-[#040807]/95 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 pt-6">
        <AtharLogo size={34} />
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[11px] tracking-[0.2em] text-[#D4AF37]/80 font-mono">
            {current.tag}
          </span>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleComplete(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D4AF37]/30 bg-black/40 text-xs text-[#F0D788] hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            تخطي الرحلة
          </button>
        </div>
      </div>

      {/* Center / Lower Narrative Stage */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center mt-auto pb-8 sm:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[11px] font-semibold text-[#F0D788]">
              <Sparkles className="w-3.5 h-3.5" />
              مشهد {current.id} من {SCENES.length}
            </div>

            {sceneIndex === 5 && (
              <p className="text-sm font-semibold text-emerald-300">أهلًا بك يا {username}</p>
            )}

            <h2 className="font-display text-3xl sm:text-5xl font-bold athar-gold-text leading-tight">
              {current.title}
            </h2>
            <p className="text-lg sm:text-xl font-medium text-[#F5F3EC]">{current.subtitle}</p>
            <p className="text-sm text-[#9EB0A8] max-w-lg mx-auto leading-relaxed">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 my-6">
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              aria-label={`الانتقال إلى المشهد ${s.id}`}
              onClick={() => setSceneIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === sceneIndex ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-3">
          {sceneIndex > 0 && (
            <AtharButton
              variant="outline"
              size="md"
              onClick={() => setSceneIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </AtharButton>
          )}

          {sceneIndex < SCENES.length - 1 ? (
            <AtharButton
              variant="primary"
              size="lg"
              onClick={() => setSceneIndex((i) => Math.min(SCENES.length - 1, i + 1))}
            >
              المشهد التالي
              <ChevronLeft className="w-4 h-4" />
            </AtharButton>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <AtharButton
                variant="primary"
                size="lg"
                loading={saving}
                onClick={() => handleComplete(false)}
              >
                ابدأ رحلتك
              </AtharButton>
              <AtharButton
                variant="outline"
                size="lg"
                disabled={saving}
                onClick={() => handleComplete(true)}
              >
                تخطي الرحلة
              </AtharButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
