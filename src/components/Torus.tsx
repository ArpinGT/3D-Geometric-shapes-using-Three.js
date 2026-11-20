import { useMemo } from "react";
import * as THREE from "three";
import ShapeViewer from "@/components/ShapeViewer";

const MAJOR_RADIUS = 1;
const TUBE_RADIUS = 0.45;
const SEGMENTS = 96;

export default function Torus() {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const point = (majorAngle: number, tubeAngle: number) => {
            const radius = MAJOR_RADIUS + TUBE_RADIUS * Math.cos(tubeAngle);
            return [
                radius * Math.cos(majorAngle),
                TUBE_RADIUS * Math.sin(tubeAngle),
                radius * Math.sin(majorAngle),
            ];
        };
        const addSegment = (start: number[], end: number[]) => {
            positions.push(...start, ...end);
        };

        for (let tubeLine = 0; tubeLine < 12; tubeLine++) {
            const tubeAngle = (tubeLine / 12) * Math.PI * 2;
            for (let segment = 0; segment < SEGMENTS; segment++) {
                const start = point((segment / SEGMENTS) * Math.PI * 2, tubeAngle);
                const end = point(((segment + 1) / SEGMENTS) * Math.PI * 2, tubeAngle);
                addSegment(start, end);
            }
        }

        for (let majorLine = 0; majorLine < 8; majorLine++) {
            const majorAngle = (majorLine / 8) * Math.PI * 2;
            for (let segment = 0; segment < SEGMENTS; segment++) {
                const start = point(majorAngle, (segment / SEGMENTS) * Math.PI * 2);
                const end = point(majorAngle, ((segment + 1) / SEGMENTS) * Math.PI * 2);
                addSegment(start, end);
            }
        }

        const result = new THREE.BufferGeometry();
        result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return result;
    }, []);

    return (
        <ShapeViewer
            title="Torus"
            geometry={geometry}
            hitArea={<sphereGeometry args={[MAJOR_RADIUS + TUBE_RADIUS, 24, 16]} />}
            minDistance={1.6}
        />
    );
}
