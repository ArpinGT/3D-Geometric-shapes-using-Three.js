import { useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";

const HALF_HEIGHT = 1.5;
const SEGMENTS = 128;
const RING_COUNT = 10;
const MERIDIAN_COUNT = 12;

function TrackballMomentum({
    controlsRef,
    controlsEnabled,
}: {
    controlsRef: RefObject<TrackballControlsImpl | null>;
    controlsEnabled: boolean;
}) {
    useFrame(() => {
        if (!controlsEnabled) {
            controlsRef.current?.update();
        }
    });

    return null;
}

function HyperboloidGrid() {
    const geometry = useMemo(() => {
        const positions: number[] = [];

        function addSegment(start: THREE.Vector3, end: THREE.Vector3) {
            positions.push(
                start.x, start.y, start.z,
                end.x, end.y, end.z
            );
        }

        for (let ring = 1; ring <= RING_COUNT; ring++) {
            const y = -HALF_HEIGHT + (ring / (RING_COUNT + 1)) * 2 * HALF_HEIGHT;
            const radius = Math.sqrt(1 + y * y);

            for (let segment = 0; segment < SEGMENTS; segment++) {
                const startAngle = (segment / SEGMENTS) * Math.PI * 2;
                const endAngle = ((segment + 1) / SEGMENTS) * Math.PI * 2;

                addSegment(
                    new THREE.Vector3(radius * Math.cos(startAngle), y, radius * Math.sin(startAngle)),
                    new THREE.Vector3(radius * Math.cos(endAngle), y, radius * Math.sin(endAngle))
                );
            }
        }

        for (let meridian = 0; meridian < MERIDIAN_COUNT; meridian++) {
            const angle = (meridian / MERIDIAN_COUNT) * Math.PI * 2;

            for (let segment = 0; segment < SEGMENTS; segment++) {
                const startY = -HALF_HEIGHT + (segment / SEGMENTS) * 2 * HALF_HEIGHT;
                const endY = -HALF_HEIGHT + ((segment + 1) / SEGMENTS) * 2 * HALF_HEIGHT;
                const startRadius = Math.sqrt(1 + startY * startY);
                const endRadius = Math.sqrt(1 + endY * endY);

                addSegment(
                    new THREE.Vector3(startRadius * Math.cos(angle), startY, startRadius * Math.sin(angle)),
                    new THREE.Vector3(endRadius * Math.cos(angle), endY, endRadius * Math.sin(angle))
                );
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

        return geo;
    }, []);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="#cbd5e1" transparent opacity={0.55} />
        </lineSegments>
    );
}

export default function Hyperboloid() {
    const [isPointerOverShape, setIsPointerOverShape] = useState(false);
    const [isDraggingShape, setIsDraggingShape] = useState(false);
    const controlsRef = useRef<TrackballControlsImpl>(null);
    const controlsEnabled = isPointerOverShape || isDraggingShape;

    return (
        <div className="relative h-full w-full bg-slate-950">
            <h1 className="absolute top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-3xl font-bold text-white">
                3D Hyperboloid
            </h1>

            <Canvas
                camera={{
                    position: [0, 0, 6],
                    fov: 50,
                    near: 0.001,
                    far: 1000,
                }}
                gl={{ antialias: true }}
            >
                <HyperboloidGrid />
                <mesh
                    onPointerEnter={() => setIsPointerOverShape(true)}
                    onPointerLeave={() => setIsPointerOverShape(false)}
                    onPointerDown={() => setIsDraggingShape(true)}
                >
                    <cylinderGeometry args={[1.81, 1.81, HALF_HEIGHT * 2, 32]} />
                    <meshBasicMaterial
                        transparent
                        opacity={0}
                        colorWrite={false}
                        depthWrite={false}
                    />
                </mesh>

                <TrackballControls
                    ref={controlsRef}
                    makeDefault
                    enabled={controlsEnabled}
                    onEnd={() => setIsDraggingShape(false)}
                    target={[0, 0, 0]}
                    rotateSpeed={3}
                    staticMoving={false}
                    dynamicDampingFactor={0.08}
                    cursorZoom={false}
                    zoomSpeed={0.7}
                    minDistance={1.9}
                    maxDistance={30}
                    noPan
                />
                <TrackballMomentum
                    controlsRef={controlsRef}
                    controlsEnabled={controlsEnabled}
                />
            </Canvas>
        </div>
    );
}
