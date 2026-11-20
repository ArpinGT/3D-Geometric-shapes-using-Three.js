import { useMemo } from "react";
import * as THREE from "three";
import ShapeViewer from "@/components/ShapeViewer";

const RADIUS = 1.35;
const HALF_HEIGHT = 1.4;
const SEGMENTS = 96;
const MERIDIANS = 12;

export default function Cone() {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const addSegment = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
            positions.push(x1, y1, z1, x2, y2, z2);
        };

        for (let ring = 0; ring <= 7; ring++) {
            const fraction = ring / 7;
            const y = -HALF_HEIGHT + fraction * HALF_HEIGHT * 2;
            const ringRadius = RADIUS * (1 - fraction);
            for (let segment = 0; segment < SEGMENTS; segment++) {
                const start = (segment / SEGMENTS) * Math.PI * 2;
                const end = ((segment + 1) / SEGMENTS) * Math.PI * 2;
                addSegment(
                    ringRadius * Math.cos(start), y, ringRadius * Math.sin(start),
                    ringRadius * Math.cos(end), y, ringRadius * Math.sin(end)
                );
            }
        }

        for (let meridian = 0; meridian < MERIDIANS; meridian++) {
            const angle = (meridian / MERIDIANS) * Math.PI * 2;
            addSegment(
                RADIUS * Math.cos(angle), -HALF_HEIGHT, RADIUS * Math.sin(angle),
                0, HALF_HEIGHT, 0
            );
        }

        const result = new THREE.BufferGeometry();
        result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return result;
    }, []);

    return (
        <ShapeViewer
            title="Cone"
            geometry={geometry}
            hitArea={<coneGeometry args={[RADIUS, HALF_HEIGHT * 2, 32]} />}
            minDistance={1.6}
        />
    );
}
