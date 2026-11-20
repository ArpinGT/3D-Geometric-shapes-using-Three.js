
import Cone from "@/components/Cone";
import Cube from "@/components/Cube";
import Cylinder from "@/components/Cylinder";
import Diamond from "@/components/Diamond";
import Hyperboloid from "@/components/Hyperboloid";
import Pyramid from "@/components/Pyramid";
import Torus from "@/components/Torus";
import Sphere from "@/components/Sphere";

function App() {
  const shapes = [
    { name: "sphere", component: <Sphere /> },
    { name: "cylinder", component: <Cylinder /> },
    { name: "torus", component: <Torus /> },
    { name: "cone", component: <Cone /> },
    { name: "cube", component: <Cube /> },
    { name: "diamond", component: <Diamond /> },
    { name: "pyramid", component: <Pyramid /> },
    { name: "hyperboloid", component: <Hyperboloid /> },
  ];

  return <>
    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center min-h-screen bg-slate-950">
      {shapes.map(({ name, component }) => (
        <div key={name} className="w-full h-screen border border-white/50">
          {component}
        </div>
      ))}
    </div>  </>;
}

export default App;
