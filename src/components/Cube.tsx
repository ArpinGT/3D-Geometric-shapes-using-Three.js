import { useMemo } from "react";
import * as THREE from "three";
import ShapeViewer from "@/components/ShapeViewer";

const HALF_SIZE = 1.2;

export default function Cube() {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const addSegment = (start: THREE.Vector3, end: THREE.Vector3) => {
            positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
        };
        const corners = [
            new THREE.Vector3(-HALF_SIZE, -HALF_SIZE, -HALF_SIZE),
            new THREE.Vector3(HALF_SIZE, -HALF_SIZE, -HALF_SIZE),
            new THREE.Vector3(HALF_SIZE, HALF_SIZE, -HALF_SIZE),
            new THREE.Vector3(-HALF_SIZE, HALF_SIZE, -HALF_SIZE),
            new THREE.Vector3(-HALF_SIZE, -HALF_SIZE, HALF_SIZE),
            new THREE.Vector3(HALF_SIZE, -HALF_SIZE, HALF_SIZE),
            new THREE.Vector3(HALF_SIZE, HALF_SIZE, HALF_SIZE),
            new THREE.Vector3(-HALF_SIZE, HALF_SIZE, HALF_SIZE),
        ];
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        for (const [start, end] of edges) {
            addSegment(corners[start], corners[end]);
        }

        const result = new THREE.BufferGeometry();
        result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return result;
    }, []);

    return (
        <ShapeViewer
            title="Cube"
            geometry={geometry}
            hitArea={<boxGeometry args={[HALF_SIZE * 2, HALF_SIZE * 2, HALF_SIZE * 2]} />}
            minDistance={1.6}
        />
    );
}
