
import Sphere from "@/components/Sphere";

function App() {
  return <>
    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center min-h-screen bg-slate-950">
      <div className="w-full h-screen border border-white/50">
        <Sphere />
      </div>
      <div className="w-full h-screen border border-white/50">
        <Sphere />
      </div>
      <div className="w-full h-screen border border-white/50">
        <Sphere />
      </div>
      <div className="w-full h-screen border border-white/50">
        <Sphere />
      </div>
    </div>  </>;
}

export default App;
