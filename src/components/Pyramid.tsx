import { useMemo } from "react";
import * as THREE from "three";
import ShapeViewer from "@/components/ShapeViewer";

const BASE_HALF_SIZE = 1.25;
const APEX_HEIGHT = 1.5;
const GRID_DIVISIONS = 5;

export default function Pyramid() {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const base = [
            new THREE.Vector3(-BASE_HALF_SIZE, -1.2, -BASE_HALF_SIZE),
            new THREE.Vector3(BASE_HALF_SIZE, -1.2, -BASE_HALF_SIZE),
            new THREE.Vector3(BASE_HALF_SIZE, -1.2, BASE_HALF_SIZE),
            new THREE.Vector3(-BASE_HALF_SIZE, -1.2, BASE_HALF_SIZE),
        ];
        const apex = new THREE.Vector3(0, APEX_HEIGHT, 0);
        const addSegment = (start: THREE.Vector3, end: THREE.Vector3) => {
            positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
        };

        for (let index = 0; index < base.length; index++) {
            const next = (index + 1) % base.length;
            addSegment(base[index], base[next]);
            addSegment(base[index], apex);
        }

        for (let division = 1; division < GRID_DIVISIONS; division++) {
            const fraction = division / GRID_DIVISIONS;
            for (let side = 0; side < base.length; side++) {
                const first = base[side].clone().lerp(apex, fraction);
                const second = base[(side + 1) % base.length].clone().lerp(apex, fraction);
                addSegment(first, second);
            }
        }

        const result = new THREE.BufferGeometry();
        result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return result;
    }, []);

    return (
        <ShapeViewer
            title="Pyramid"
            geometry={geometry}
            hitArea={<coneGeometry args={[BASE_HALF_SIZE * Math.SQRT2, APEX_HEIGHT + 1.2, 4]} />}
            minDistance={1.8}
        />
    );
}
