
import { useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";

const RADIUS = 1.5;
const SEGMENTS = 128;

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

function SphereGrid() {
    const geometry = useMemo(() => {
        const positions: number[] = [];

        // Generate a complete circular line
        function addCircle(
            getPoint: (angle: number) => THREE.Vector3
        ) {
            for (let i = 0; i < SEGMENTS; i++) {
                const a = (i / SEGMENTS) * Math.PI * 2;
                const b = ((i + 1) / SEGMENTS) * Math.PI * 2;

                const p1 = getPoint(a);
                const p2 = getPoint(b);

                positions.push(
                    p1.x, p1.y, p1.z,
                    p2.x, p2.y, p2.z
                );
            }
        }

        // LATITUDE: Complete horizontal circles
        const latitudeCount = 8;

        for (let i = 1; i < latitudeCount; i++) {
            const phi =
                -Math.PI / 2 + (i / latitudeCount) * Math.PI;

            const circleRadius = RADIUS * Math.cos(phi);
            const y = RADIUS * Math.sin(phi);

            addCircle((angle) =>
                new THREE.Vector3(
                    circleRadius * Math.cos(angle),
                    y,
                    circleRadius * Math.sin(angle)
                )
            );
        }

        // LONGITUDE: Complete vertical great circles
        const longitudeCount = 6;

        for (let i = 0; i < longitudeCount; i++) {
            const longitude =
                (i / longitudeCount) * Math.PI;

            addCircle((angle) =>
                new THREE.Vector3(
                    RADIUS * Math.cos(angle) * Math.cos(longitude),
                    RADIUS * Math.sin(angle),
                    RADIUS * Math.cos(angle) * Math.sin(longitude)
                )
            );
        }

        const geo = new THREE.BufferGeometry();

        geo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );

        return geo;
    }, []);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial
                color="#cbd5e1"
                transparent
                opacity={0.45}
            />
        </lineSegments>
    );
}

export default function Sphere() {
    const [isPointerOverSphere, setIsPointerOverSphere] = useState(false);
    const [isDraggingSphere, setIsDraggingSphere] = useState(false);
    const controlsRef = useRef<TrackballControlsImpl>(null);
    const controlsEnabled = isPointerOverSphere || isDraggingSphere;

    return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-slate-950">

            <h1 className="absolute top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-3xl font-bold text-white">
                3D Sphere
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
                <SphereGrid />
                <mesh
                    onPointerEnter={() => setIsPointerOverSphere(true)}
                    onPointerLeave={() => setIsPointerOverSphere(false)}
                    onPointerDown={() => setIsDraggingSphere(true)}
                >
                    <sphereGeometry args={[RADIUS, 32, 32]} />
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
                    onEnd={() => setIsDraggingSphere(false)}
                    target={[0, 0, 0]}
                    rotateSpeed={3.0}
                    staticMoving={false}
                    dynamicDampingFactor={0.08}
                    cursorZoom={false}
                    zoomSpeed={0.7}
                    minDistance={1.55}
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
