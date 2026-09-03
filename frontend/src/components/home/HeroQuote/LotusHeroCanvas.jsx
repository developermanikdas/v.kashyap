import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from "react";
import * as THREE from "three";
import styles from "./LotusHeroCanvas.module.css";

const TOTAL_FRAMES = 73;
const BLOOM_DURATION_MS = 2200;

const LotusHeroCanvas = forwardRef(({ onBloomComplete, onLotusClick }, ref) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation & state refs
  const stateRef = useRef({
    frames: [],
    currentFrameIndex: 0,
    isAnimating: false,
    startTime: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    particles: null,
    particlePositions: null,
    particleVelocities: null,
    renderer: null,
    scene: null,
    camera: null,
    lotusMesh: null,
    auraMesh: null,
    canvasTexture: null,
    drawCanvas: null,
    drawCtx: null,
  });

  // Preload all 73 WebP frames
  useEffect(() => {
    let loadedCount = 0;
    const frames = new Array(TOTAL_FRAMES);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/lotus-frames/frame_${frameNum}.webp`;

      img.onload = () => {
        frames[i] = img;
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          stateRef.current.frames = frames;
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          stateRef.current.frames = frames;
          setIsLoaded(true);
        }
      };
    }
  }, []);

  // Trigger bloom animation
  const triggerBloom = useCallback(() => {
    const s = stateRef.current;
    s.isAnimating = true;
    s.startTime = performance.now();
    s.currentFrameIndex = 0;
  }, []);

  useImperativeHandle(ref, () => ({
    triggerBloom,
  }));

  // Setup Three.js Scene and Render Loop
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const s = stateRef.current;

    const size = container.clientWidth || 96;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    s.scene = scene;
    s.camera = camera;
    s.renderer = renderer;

    // 2D Canvas for drawing frames dynamically onto Three.js texture
    const drawCanvas = document.createElement("canvas");
    drawCanvas.width = 512;
    drawCanvas.height = 512;
    const drawCtx = drawCanvas.getContext("2d");
    s.drawCanvas = drawCanvas;
    s.drawCtx = drawCtx;

    // Initial draw
    const initialImg = s.frames[s.currentFrameIndex] || s.frames[0];
    if (initialImg) {
      drawCtx.drawImage(initialImg, 0, 0, 512, 512);
    }

    const canvasTexture = new THREE.CanvasTexture(drawCanvas);
    canvasTexture.minFilter = THREE.LinearFilter;
    canvasTexture.magFilter = THREE.LinearFilter;
    canvasTexture.generateMipmaps = false;
    s.canvasTexture = canvasTexture;

    // Lotus Mesh Plane
    const lotusGeometry = new THREE.PlaneGeometry(2.3, 2.3);
    const lotusMaterial = new THREE.MeshBasicMaterial({
      map: canvasTexture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const lotusMesh = new THREE.Mesh(lotusGeometry, lotusMaterial);
    lotusMesh.position.y = 0.04;
    scene.add(lotusMesh);
    s.lotusMesh = lotusMesh;

    // Soft Ambient Aura Glow
    const createAuraTexture = () => {
      const auraCanv = document.createElement("canvas");
      auraCanv.width = 256;
      auraCanv.height = 256;
      const ctx = auraCanv.getContext("2d");
      const grad = ctx.createRadialGradient(128, 128, 15, 128, 128, 128);
      grad.addColorStop(0, "rgba(255, 225, 190, 0.6)");
      grad.addColorStop(0.35, "rgba(240, 130, 160, 0.25)");
      grad.addColorStop(0.7, "rgba(250, 235, 215, 0.08)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(auraCanv);
    };

    const auraGeo = new THREE.PlaneGeometry(3.0, 3.0);
    const auraMat = new THREE.MeshBasicMaterial({
      map: createAuraTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.z = -0.12;
    auraMesh.position.y = 0.04;
    scene.add(auraMesh);
    s.auraMesh = auraMesh;

    // Delicate Golden & Rose Micro-Sparkle Particles
    const particleCount = 35;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.5 + Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.7;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) + 0.05;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi) * 0.4;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = 0.001 + Math.random() * 0.0025;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      if (Math.random() > 0.4) {
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.82;
        colors[i * 3 + 2] = 0.45;
      } else {
        colors[i * 3] = 0.94;
        colors[i * 3 + 1] = 0.48;
        colors[i * 3 + 2] = 0.65;
      }
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const createSparkleTexture = () => {
      const pCanv = document.createElement("canvas");
      pCanv.width = 64;
      pCanv.height = 64;
      const pCtx = pCanv.getContext("2d");
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 240, 200, 0.8)");
      grad.addColorStop(0.7, "rgba(255, 180, 180, 0.25)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanv);
    };

    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      map: createSparkleTexture(),
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    s.particles = particles;
    s.particlePositions = positions;
    s.particleVelocities = velocities;

    // Trigger initial bloom on mount
    triggerBloom();

    // Mouse Movement Tracking
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      s.targetMouseX = Math.max(-1, Math.min(1, x));
      s.targetMouseY = Math.max(-1, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      s.targetMouseX = 0;
      s.targetMouseY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    let lastTime = performance.now();
    let frameNeedsRedraw = true;

    const animate = (time) => {
      animationFrameId.current = requestAnimationFrame(animate);
      lastTime = time;

      // 1. Frame sequence animation logic
      if (s.isAnimating) {
        const elapsed = time - s.startTime;
        const progress = Math.min(elapsed / BLOOM_DURATION_MS, 1);

        const eased = 1 - Math.pow(1 - progress, 2.4);
        const targetFrame = Math.min(Math.floor(eased * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

        if (targetFrame !== s.currentFrameIndex) {
          s.currentFrameIndex = targetFrame;
          frameNeedsRedraw = true;
        }

        if (progress >= 1) {
          s.isAnimating = false;
          if (onBloomComplete) onBloomComplete();
        }
      }

      // Draw current frame to canvas texture
      if (frameNeedsRedraw && s.frames[s.currentFrameIndex] && s.drawCtx) {
        s.drawCtx.clearRect(0, 0, 512, 512);
        s.drawCtx.drawImage(s.frames[s.currentFrameIndex], 0, 0, 512, 512);
        s.canvasTexture.needsUpdate = true;
        frameNeedsRedraw = false;
      }

      // 2. Smooth Micro 3D Parallax & Idle Sway
      s.currentMouseX += (s.targetMouseX - s.currentMouseX) * 0.08;
      s.currentMouseY += (s.targetMouseY - s.currentMouseY) * 0.08;

      const idleSwayX = Math.sin(time * 0.001) * 0.03;
      const idleSwayY = Math.cos(time * 0.0013) * 0.02;
      const idleFloat = Math.sin(time * 0.0015) * 0.02;

      if (lotusMesh) {
        lotusMesh.rotation.y = s.currentMouseX * 0.25 + idleSwayX;
        lotusMesh.rotation.x = -s.currentMouseY * 0.2 + idleSwayY;
        lotusMesh.position.y = 0.04 + idleFloat;

        if (s.isAnimating) {
          const bloomScale = 1.0 + Math.sin((time - s.startTime) * 0.003) * 0.035;
          lotusMesh.scale.set(bloomScale, bloomScale, 1);
        } else {
          lotusMesh.scale.set(1, 1, 1);
        }
      }

      // 3. Aura Breathing
      if (auraMesh) {
        const auraBreath = 0.8 + Math.sin(time * 0.002) * 0.12;
        auraMesh.material.opacity = s.isAnimating ? 0.95 : auraBreath;
      }

      // 4. Sparkle Particles Drift
      if (s.particles && s.particlePositions) {
        const pos = s.particlePositions;
        const vel = s.particleVelocities;

        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] += vel[i * 3] + Math.sin(time * 0.002 + i) * 0.0006;
          pos[i * 3 + 1] += vel[i * 3 + 1];
          pos[i * 3 + 2] += vel[i * 3 + 2];

          if (pos[i * 3 + 1] > 1.3) {
            pos[i * 3 + 1] = -1.0;
            pos[i * 3] = (Math.random() - 0.5) * 1.8;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
          }
        }
        s.particles.geometry.attributes.position.needsUpdate = true;
        s.particles.rotation.y = time * 0.0004 + s.currentMouseX * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);

      renderer.dispose();
      lotusGeometry.dispose();
      lotusMaterial.dispose();
      canvasTexture.dispose();
      auraGeo.dispose();
      auraMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isLoaded, onBloomComplete, triggerBloom]);

  const handleClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    triggerBloom();
    if (onLotusClick) onLotusClick();
  };

  return (
    <div
      ref={containerRef}
      className={styles.lotusContainer}
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => {
        // Prevent mobile text selection / tap highlight
        if (e.target && e.target.blur) e.target.blur();
      }}
      onContextMenu={(e) => e.preventDefault()}
      role="button"
      tabIndex={0}
      aria-label="Interactive lotus emblem. Click or tap to refresh reflection."
      title="Click or tap to refresh reflection"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      <canvas ref={canvasRef} className={styles.webglCanvas} />
    </div>
  );
});

LotusHeroCanvas.displayName = "LotusHeroCanvas";

export default LotusHeroCanvas;
