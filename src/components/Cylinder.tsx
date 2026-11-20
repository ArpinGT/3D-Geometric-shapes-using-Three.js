import { useMemo } from "react";
import * as THREE from "three";
import ShapeViewer from "@/components/ShapeViewer";

const RADIUS = 1.25;
const HALF_HEIGHT = 1.4;
const SEGMENTS = 96;

export default function Cylinder() {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const addSegment = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
            positions.push(x1, y1, z1, x2, y2, z2);
        };

        for (let ring = 0; ring <= 7; ring++) {
            const y = -HALF_HEIGHT + (ring / 7) * HALF_HEIGHT * 2;
            for (let segment = 0; segment < SEGMENTS; segment++) {
                const start = (segment / SEGMENTS) * Math.PI * 2;
                const end = ((segment + 1) / SEGMENTS) * Math.PI * 2;
                addSegment(
                    RADIUS * Math.cos(start), y, RADIUS * Math.sin(start),
                    RADIUS * Math.cos(end), y, RADIUS * Math.sin(end)
                );
            }
        }

        for (let meridian = 0; meridian < 12; meridian++) {
            const angle = (meridian / 12) * Math.PI * 2;
            addSegment(
                RADIUS * Math.cos(angle), -HALF_HEIGHT, RADIUS * Math.sin(angle),
                RADIUS * Math.cos(angle), HALF_HEIGHT, RADIUS * Math.sin(angle)
            );
        }

        const result = new THREE.BufferGeometry();
        result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return result;
    }, []);

    return (
        <ShapeViewer
            title="Cylinder"
            geometry={geometry}
            hitArea={<cylinderGeometry args={[RADIUS, RADIUS, HALF_HEIGHT * 2, 32]} />}
            minDistance={1.6}
        />
    );
}
