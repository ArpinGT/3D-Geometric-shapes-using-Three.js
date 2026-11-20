import { useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";

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

export default function ShapeViewer({
    title,
    geometry,
    hitArea,
    minDistance = 1.8,
}: {
    title: string;
    geometry: THREE.BufferGeometry;
    hitArea: ReactNode;
    minDistance?: number;
}) {
    const [isPointerOverShape, setIsPointerOverShape] = useState(false);
    const [isDraggingShape, setIsDraggingShape] = useState(false);
    const controlsRef = useRef<TrackballControlsImpl>(null);
    const controlsEnabled = isPointerOverShape || isDraggingShape;

    return (
        <div className="relative h-full w-full bg-slate-950">
            <h1 className="absolute top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-3xl font-bold text-white">
                3D {title}
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
                <lineSegments geometry={geometry}>
                    <lineBasicMaterial color="#cbd5e1" transparent opacity={0.55} />
                </lineSegments>
                <mesh
                    onPointerEnter={() => setIsPointerOverShape(true)}
                    onPointerLeave={() => setIsPointerOverShape(false)}
                    onPointerDown={() => setIsDraggingShape(true)}
                >
                    {hitArea}
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
                    minDistance={minDistance}
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
