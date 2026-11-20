# 3D Geometry

An interactive collection of 3D geometric shapes built with React, TypeScript, Three.js, and React Three Fiber. The gallery presents each shape as a wireframe that you can rotate by dragging.

## Components

- **Cylinder** — circular cross-sections connected by vertical lines.
- **Torus** — a ring-shaped surface with loops around its body and tube.
- **Cone** — horizontal circular sections tapering to an apex.
- **Cube** — a wireframe cube showing its twelve edges.
- **Diamond** — an octahedron-style gemstone with a central equator.
- **Pyramid** — a square-based pyramid with subdivided triangular faces.
- **Hyperboloid** — a one-sheet hyperboloid drawn with horizontal rings and curved meridians.
- **Sphere** — an additional sphere component with latitude and longitude lines.

The gallery is assembled in `src/App.tsx`. Each shape is a component in `src/components/`; most use `ShapeViewer` to share the canvas, title, pointer interaction, and trackball controls.

## How it works

Shape components generate line-segment positions from the shape's geometry and store them in a Three.js `BufferGeometry`. React Three Fiber renders the geometry in a Three.js canvas. An invisible mesh receives pointer events, enabling trackball rotation when the pointer is over the shape; momentum continues after dragging ends.

## Development

```bash
npm install
npm run dev
```

Run the production build and linter with:

```bash
npm run build
npm run lint
```
