import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../utils/sound';
import { Usb, ArrowRight, Eye, Sparkles } from 'lucide-react';

interface Room3DCutsceneProps {
  onComplete: () => void;
}

type CutscenePhase =
  | 'pullback'
  | 'turn_around'
  | 'monster_revealed'
  | 'taking_usb'
  | 'turn_to_pc'
  | 'plugging_usb'
  | 'done';

export const Room3DCutscene: React.FC<Room3DCutsceneProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<CutscenePhase>('pullback');
  const [isShaking, setIsShaking] = useState(false);
  const [canClickUsb, setCanClickUsb] = useState(false);
  const [interactionHint, setInteractionHint] = useState<string>('Компьютер poopOS заблокирован... Оглядываемся назад!');

  const phaseRef = useRef<CutscenePhase>('pullback');
  const startTimeRef = useRef<number>(performance.now());
  const hasCompletedRef = useRef<boolean>(false);
  const mouseLookRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Start background horror music for the 3D cutscene
  useEffect(() => {
    sound.playBgm('horror');
    return () => {
      // Don't kill audio on unmount, App.tsx will switch track
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth || 1280;
    const height = containerRef.current.clientHeight || window.innerHeight || 720;

    // --- 3D SCENE SETUP ---
    const scene = new THREE.Scene();
    // Stylish deep midnight blue with visible depth
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.04);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 0.5);
    camera.lookAt(0, 1.3, -0.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    containerRef.current.appendChild(renderer.domElement);

    // --- PROCEDURAL TEXTURES (High visibility & detail!) ---
    // 1. Wood Floor Texture
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const fctx = floorCanvas.getContext('2d')!;
    fctx.fillStyle = '#1e293b';
    fctx.fillRect(0, 0, 512, 512);
    fctx.strokeStyle = '#334155';
    fctx.lineWidth = 4;
    for (let i = 0; i < 512; i += 64) {
      fctx.strokeRect(0, i, 512, 64);
      fctx.fillStyle = i % 128 === 0 ? '#1e293b' : '#273549';
      fctx.fillRect(0, i, 512, 60);
    }
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);

    // 2. Monitor Screen Texture (Big Red Skull Warning)
    const monitorCanvas = document.createElement('canvas');
    monitorCanvas.width = 512;
    monitorCanvas.height = 288;
    const mctx = monitorCanvas.getContext('2d')!;
    mctx.fillStyle = '#0f172a';
    mctx.fillRect(0, 0, 512, 288);
    mctx.fillStyle = '#ef4444';
    mctx.font = 'bold 36px monospace';
    mctx.textAlign = 'center';
    mctx.fillText('🧅 ONION.EXE V1.0', 256, 70);
    mctx.font = 'bold 24px monospace';
    mctx.fillStyle = '#ffffff';
    mctx.fillText('СИСТЕМА ЗАБЛОКИРОВАНА', 256, 130);
    mctx.font = '18px monospace';
    mctx.fillStyle = '#f87171';
    mctx.fillText('ОБЕРНИСЬ НАЗАД...', 256, 180);
    mctx.fillText('КЛЮЧ РЯДОМ С ТОБОЙ', 256, 215);
    const monitorTexture = new THREE.CanvasTexture(monitorCanvas);

    // 3. Wall Poster Texture
    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = 256;
    posterCanvas.height = 340;
    const pctx = posterCanvas.getContext('2d')!;
    pctx.fillStyle = '#0284c7';
    pctx.fillRect(0, 0, 256, 340);
    pctx.fillStyle = '#ffffff';
    pctx.font = 'bold 28px sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText('poopOS', 128, 60);
    pctx.font = '16px sans-serif';
    pctx.fillText('Liquid Glass 2026', 128, 90);
    pctx.fillStyle = '#fde047';
    pctx.font = 'bold 48px sans-serif';
    pctx.fillText('✨🍎✨', 128, 170);
    pctx.fillStyle = '#e0f2fe';
    pctx.font = '14px sans-serif';
    pctx.fillText('Think Different. Think Poop.', 128, 230);
    const posterTexture = new THREE.CanvasTexture(posterCanvas);

    // --- BRIGHT ATMOSPHERIC LIGHTING (NO BLACK SCREENS!) ---
    // Warm ambient light filling the entire room
    const ambientLight = new THREE.AmbientLight(0xcfd8dc, 1.8);
    scene.add(ambientLight);

    // Ceiling fluorescent light fixture
    const ceilingLight = new THREE.PointLight(0xe0f2fe, 3.0, 16);
    ceilingLight.position.set(0, 3.5, 0.5);
    scene.add(ceilingLight);

    // Warm Desk Lamp Light
    const deskLamp = new THREE.PointLight(0xfbbf24, 3.8, 6);
    deskLamp.position.set(-0.8, 1.6, -0.6);
    scene.add(deskLamp);

    // Glowing Red Monitor Screen Light
    const monitorGlow = new THREE.PointLight(0xef4444, 4.5, 5);
    monitorGlow.position.set(0, 1.3, -0.3);
    scene.add(monitorGlow);

    // Doorway Blue Warning Backlight
    const doorwayLight = new THREE.PointLight(0x38bdf8, 5.0, 15);
    doorwayLight.position.set(0, 2.4, 4.5);
    scene.add(doorwayLight);

    // --- ROOM ARCHITECTURE ---
    // Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.4,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(16, 16);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4.0;
    scene.add(ceiling);

    // Back Wall (Behind Computer Desk)
    const wallBackGeo = new THREE.PlaneGeometry(16, 6);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const wallBack = new THREE.Mesh(wallBackGeo, wallMat);
    wallBack.position.set(0, 2, -2.5);
    scene.add(wallBack);

    // Left Wall
    const wallLeft = new THREE.Mesh(wallBackGeo, wallMat);
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-4.5, 2, 0);
    scene.add(wallLeft);

    // Right Wall
    const wallRight = new THREE.Mesh(wallBackGeo, wallMat);
    wallRight.rotation.y = -Math.PI / 2;
    wallRight.position.set(4.5, 2, 0);
    scene.add(wallRight);

    // Front Wall (Behind Player with Open Doorway)
    const wallFrontLeft = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), wallMat);
    wallFrontLeft.rotation.y = Math.PI;
    wallFrontLeft.position.set(-3.5, 2, 4.5);
    scene.add(wallFrontLeft);

    const wallFrontRight = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), wallMat);
    wallFrontRight.rotation.y = Math.PI;
    wallFrontRight.position.set(3.5, 2, 4.5);
    scene.add(wallFrontRight);

    // Door Frame
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.4), doorFrameMat);
    doorLintel.position.set(0, 3.1, 4.5);
    scene.add(doorLintel);

    const doorPostLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 0.4), doorFrameMat);
    doorPostLeft.position.set(-1.1, 1.6, 4.5);
    scene.add(doorPostLeft);

    const doorPostRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 0.4), doorFrameMat);
    doorPostRight.position.set(1.1, 1.6, 4.5);
    scene.add(doorPostRight);

    // Poster on the wall
    const posterMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 1.6),
      new THREE.MeshBasicMaterial({ map: posterTexture })
    );
    posterMesh.position.set(1.8, 2.2, -2.48);
    scene.add(posterMesh);

    // --- COMPUTER DESK SETUP ---
    const deskGroup = new THREE.Group();

    // Wooden Desk Top
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.08, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 })
    );
    deskTop.position.set(0, 0.85, -0.6);
    deskGroup.add(deskTop);

    // Desk Metal Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    [-1.05, 1.05].forEach((x) => {
      [-0.95, -0.25].forEach((z) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85), legMat);
        leg.position.set(x, 0.425, z);
        deskGroup.add(leg);
      });
    });

    // Monitor Stand & Bezel
    const monitorBezel = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.85, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    monitorBezel.position.set(0, 1.4, -0.8);
    deskGroup.add(monitorBezel);

    const monitorScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.32, 0.77),
      new THREE.MeshBasicMaterial({ map: monitorTexture })
    );
    monitorScreen.position.set(0, 1.4, -0.768);
    deskGroup.add(monitorScreen);

    const monitorPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5), legMat);
    monitorPole.position.set(0, 1.05, -0.85);
    deskGroup.add(monitorPole);

    // 3D Keyboard with Glowing Cyan Backlight
    const keyboardBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.03, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    keyboardBase.position.set(0, 0.9, -0.35);
    deskGroup.add(keyboardBase);

    const keyCapMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const keyRows = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.02, 0.22), keyCapMat);
    keyRows.position.set(0, 0.92, -0.35);
    deskGroup.add(keyRows);

    // Mouse
    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.04, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    mouse.position.set(0.5, 0.9, -0.35);
    deskGroup.add(mouse);

    // Desk Lamp
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04), legMat);
    lampBase.position.set(-0.8, 0.9, -0.6);
    deskGroup.add(lampBase);
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7), legMat);
    lampArm.position.set(-0.8, 1.25, -0.6);
    deskGroup.add(lampArm);
    const lampHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.22, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 })
    );
    lampHead.rotation.x = Math.PI / 4;
    lampHead.position.set(-0.8, 1.55, -0.55);
    deskGroup.add(lampHead);

    // PC Gaming Tower on desk with RGB light
    const pcCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.65, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.6, roughness: 0.3 })
    );
    pcCase.position.set(1.0, 1.2, -0.6);
    deskGroup.add(pcCase);

    const pcFan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    pcFan.rotation.x = Math.PI / 2;
    pcFan.position.set(1.0, 1.2, -0.29);
    deskGroup.add(pcFan);

    scene.add(deskGroup);

    // Gaming Chair
    const chairGroup = new THREE.Group();
    const chairSeat = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.1, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 })
    );
    chairSeat.position.set(0, 0.55, 0.2);
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.85, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5 })
    );
    chairBack.position.set(0, 1.0, 0.5);
    chairGroup.add(chairBack);
    scene.add(chairGroup);

    // --- 3D ONION ENTITY CHARACTER IN DOORWAY ---
    const entityGroup = new THREE.Group();
    entityGroup.position.set(0, 0, 4.2);

    // Body / Trenchcoat
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.55, 1.6, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 1.0, 0);
    entityGroup.add(body);

    // Onion Head (Sphere with golden-amber skin)
    const onionHeadGeo = new THREE.SphereGeometry(0.45, 24, 24);
    const onionHeadMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.1,
    });
    const onionHead = new THREE.Mesh(onionHeadGeo, onionHeadMat);
    onionHead.scale.set(1.0, 1.2, 1.0);
    onionHead.position.set(0, 2.1, 0);
    entityGroup.add(onionHead);

    // Green Onion Sprouts on Top
    const sproutMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3 });
    [-0.08, 0, 0.08].forEach((xOffset, idx) => {
      const sprout = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.35 + idx * 0.06, 8), sproutMat);
      sprout.position.set(xOffset, 2.65, 0);
      sprout.rotation.z = (idx - 1) * 0.25;
      entityGroup.add(sprout);
    });

    // Glowing Red/Yellow Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), eyeMat);
    eyeLeft.position.set(-0.16, 2.15, -0.4);
    entityGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), eyeMat);
    eyeRight.position.set(0.16, 2.15, -0.4);
    entityGroup.add(eyeRight);

    // Left Arm Extended Forward Holding the USB Drive!
    const armGroup = new THREE.Group();
    armGroup.position.set(-0.45, 1.5, 0);
    const armMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.07, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    armMesh.rotation.x = Math.PI / 2;
    armMesh.position.set(0, 0, -0.5);
    armGroup.add(armMesh);

    // Glowing 3D USB Flash Drive
    const usbGroup = new THREE.Group();
    usbGroup.position.set(0, 0, -1.1);

    const usbBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.06, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.8, roughness: 0.2 })
    );
    usbGroup.add(usbBody);

    const usbConnector = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.04, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 })
    );
    usbConnector.position.set(0, 0, -0.18);
    usbGroup.add(usbConnector);

    // Glowing cyan aura ring around USB
    const usbLight = new THREE.PointLight(0x38bdf8, 3.5, 4);
    usbLight.position.set(0, 0.1, 0);
    usbGroup.add(usbLight);

    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.02, 16, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    haloRing.rotation.x = Math.PI / 2;
    usbGroup.add(haloRing);

    armGroup.add(usbGroup);
    entityGroup.add(armGroup);
    scene.add(entityGroup);

    // Floating Atmospheric Dust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 8;
      dustPositions[i + 1] = Math.random() * 3.5;
      dustPositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // Mouse movement interaction to look around 3D room
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseLookRef.current = { x: normX * 0.35, y: normY * 0.2 };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION LOOP ---
    let reqId: number;

    const animate = (time: number) => {
      reqId = requestAnimationFrame(animate);

      const elapsed = (time - startTimeRef.current) / 1000;
      const currentPhase = phaseRef.current;

      // Animate dust & fan
      pcFan.rotation.z += 0.1;
      haloRing.rotation.z += 0.05;
      haloRing.scale.setScalar(1 + Math.sin(time * 0.006) * 0.15);

      // Subtle entity breathing & head tilt
      entityGroup.position.y = Math.sin(time * 0.003) * 0.05;
      onionHead.rotation.y = Math.sin(time * 0.002) * 0.15;

      // Flicker monitor light
      monitorGlow.intensity = 4.0 + Math.sin(time * 0.02) * 1.5;

      // STAGE 1: PULL BACK FROM COMPUTER
      if (currentPhase === 'pullback') {
        const progress = Math.min(1, elapsed / 2.5);
        camera.position.x = mouseLookRef.current.x * 0.2;
        camera.position.y = THREE.MathUtils.lerp(1.4, 1.5, progress);
        camera.position.z = THREE.MathUtils.lerp(0.5, 1.2, progress);
        camera.lookAt(0, 1.3 + mouseLookRef.current.y, -0.7);

        if (progress >= 1) {
          phaseRef.current = 'turn_around';
          startTimeRef.current = performance.now();
          setPhase('turn_around');
          setInteractionHint('Сзади послышался шорох... Камера поворачивается к двери!');
          sound.playMonsterReveal();
        }
      }
      // STAGE 2: TURN 180° TO THE DOORWAY
      else if (currentPhase === 'turn_around') {
        const turnElapsed = (performance.now() - startTimeRef.current) / 1000;
        const progress = Math.min(1, turnElapsed / 2.8);
        const ease = 1 - Math.pow(1 - progress, 3);

        camera.position.set(
          mouseLookRef.current.x * 0.3,
          1.55 + Math.sin(turnElapsed * 4) * 0.02,
          1.2
        );

        // Turn from looking at desk (-0.7 z) to looking at door (+4.5 z)
        const targetZ = THREE.MathUtils.lerp(-0.7, 4.5, ease);
        camera.lookAt(mouseLookRef.current.x * 0.5, 1.8 + mouseLookRef.current.y * 0.4, targetZ);

        if (progress >= 1) {
          phaseRef.current = 'monster_revealed';
          startTimeRef.current = performance.now();
          setPhase('monster_revealed');
          setCanClickUsb(true);
          setInteractionHint('В дверях стоит Сущность и держит USB-флешку с 3-м ключом! ВЫХВАТИ ЕЁ!');
          sound.playBouncePing();
        }
      }
      // STAGE 3: MONSTER REVEALED - AWAITING PLAYER ACTION
      else if (currentPhase === 'monster_revealed') {
        camera.position.set(mouseLookRef.current.x * 0.4, 1.55, 1.2);
        camera.lookAt(mouseLookRef.current.x * 0.5, 1.8 + mouseLookRef.current.y * 0.4, 4.5);
      }
      // STAGE 4: TAKING THE USB
      else if (currentPhase === 'taking_usb') {
        const takeElapsed = (performance.now() - startTimeRef.current) / 1000;
        const progress = Math.min(1, takeElapsed / 1.5);

        // USB flies towards camera
        usbGroup.position.z = THREE.MathUtils.lerp(-1.1, 1.8, progress);
        usbGroup.position.y = THREE.MathUtils.lerp(0, -0.3, progress);
        usbGroup.rotation.y += 0.1;

        if (progress >= 1) {
          phaseRef.current = 'turn_to_pc';
          startTimeRef.current = performance.now();
          setPhase('turn_to_pc');
          setInteractionHint('Флешка выхвачена! Скорее возвращаемся к компьютеру poopOS!');
          sound.playFoundBitcoin();
        }
      }
      // STAGE 5: TURN BACK TO PC
      else if (currentPhase === 'turn_to_pc') {
        const returnElapsed = (performance.now() - startTimeRef.current) / 1000;
        const progress = Math.min(1, returnElapsed / 2.0);
        const ease = 1 - Math.pow(1 - progress, 3);

        const targetZ = THREE.MathUtils.lerp(4.5, -0.7, ease);
        camera.lookAt(0, 1.35, targetZ);
        camera.position.z = THREE.MathUtils.lerp(1.2, 0.4, ease);

        if (progress >= 1) {
          phaseRef.current = 'plugging_usb';
          startTimeRef.current = performance.now();
          setPhase('plugging_usb');
          setInteractionHint('Подключаем флешку к USB-порту poopOS...');
          sound.playUsbPlugChime();
        }
      }
      // STAGE 6: PLUGGING IN & COMPLETE
      else if (currentPhase === 'plugging_usb') {
        const plugElapsed = (performance.now() - startTimeRef.current) / 1000;
        const progress = Math.min(1, plugElapsed / 1.4);

        camera.position.set(0, 1.35, THREE.MathUtils.lerp(0.4, 0.1, progress));
        camera.lookAt(0.5, 1.2, -0.6); // Look towards PC case

        if (progress >= 1 && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          phaseRef.current = 'done';
          setPhase('done');
          onComplete();
        }
      }

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onComplete]);

  // Click handler to grab the USB drive
  const handleGrabUsb = () => {
    if (phaseRef.current !== 'monster_revealed') return;
    sound.playClick();
    sound.playBouncePing();
    phaseRef.current = 'taking_usb';
    startTimeRef.current = performance.now();
    setPhase('taking_usb');
    setCanClickUsb(false);
    setInteractionHint('Забираем флешку из рук Сущности...');
  };

  // Skip button emergency fallback
  const handleSkipCutscene = () => {
    sound.playClick();
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      sound.playUsbPlugChime();
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 select-none overflow-hidden flex flex-col items-center justify-between">
      {/* Three.js 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-move" />

      {/* Cinematic CRT Scanline & Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/20 to-black/70" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Top HUD Bar */}
      <div className="relative z-20 w-full p-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 shadow-xl">
          <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>3D РЕАЛЬНОСТЬ // КОМНАТА ПОЛЬЗОВАТЕЛЯ</span>
        </div>

        <button
          onClick={handleSkipCutscene}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer border border-red-400/40"
        >
          <span>Пропустить в poopOS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Interactive USB Grab Action */}
      {canClickUsb && phase === 'monster_revealed' && (
        <div className="relative z-30 flex flex-col items-center animate-bounce duration-1000 mb-8 pointer-events-auto">
          <button
            onClick={handleGrabUsb}
            className="group flex items-center space-x-3 px-7 py-4 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-base shadow-2xl shadow-blue-500/50 border-2 border-cyan-300/80 active:scale-95 transition-all cursor-pointer ring-4 ring-blue-500/30 tracking-wide"
          >
            <Usb className="w-6 h-6 text-cyan-200 group-hover:rotate-12 transition-transform animate-pulse" />
            <span>👉 ВЫХВАТИТЬ ФЛЕШКУ С 3-М КЛЮЧОМ!</span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
          </button>
          <span className="text-xs font-mono font-bold text-yellow-300 drop-shadow-md mt-2 bg-black/80 px-4 py-1.5 rounded-full border border-yellow-400/40">
            ⚡ Нажми эту кнопку, чтобы выхватить флешку с последним биткоин-ключом!
          </span>
        </div>
      )}

      {/* Bottom Subtitle Caption */}
      <div className="relative z-20 mb-8 max-w-xl text-center px-6 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-none">
        <p className="text-sm font-semibold text-cyan-300 drop-shadow-md tracking-wide">
          {interactionHint}
        </p>
        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
          🖱️ Двигай мышью, чтобы осматривать 3D комнату
        </span>
      </div>
    </div>
  );
};
