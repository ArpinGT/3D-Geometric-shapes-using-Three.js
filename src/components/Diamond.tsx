import { useMemo } from "react";
import * as THREE from "three";
import ShapeViewer from "@/components/ShapeViewer";

const EQUATOR_RADIUS = 1.25;
const HALF_HEIGHT = 1.65;

export default function Diamond() {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const equator = [
            new THREE.Vector3(EQUATOR_RADIUS, 0, 0),
            new THREE.Vector3(0, 0, EQUATOR_RADIUS),
            new THREE.Vector3(-EQUATOR_RADIUS, 0, 0),
            new THREE.Vector3(0, 0, -EQUATOR_RADIUS),
        ];
        const top = new THREE.Vector3(0, HALF_HEIGHT, 0);
        const bottom = new THREE.Vector3(0, -HALF_HEIGHT, 0);
        const addSegment = (start: THREE.Vector3, end: THREE.Vector3) => {
            positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
        };

        for (let index = 0; index < equator.length; index++) {
            const next = (index + 1) % equator.length;
            addSegment(equator[index], equator[next]);
            addSegment(top, equator[index]);
            addSegment(bottom, equator[index]);
        }

        const result = new THREE.BufferGeometry();
        result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return result;
    }, []);

    return (
        <ShapeViewer
            title="Diamond"
            geometry={geometry}
            hitArea={<octahedronGeometry args={[HALF_HEIGHT, 0]} />}
            minDistance={1.7}
        />
    );
}
