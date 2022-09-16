import "./styles.css";
import * as BABYLON from "babylonjs";
import { Canvas } from "./Canvas";

export default function App() {
  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <Canvas />
    </div>
  );
}
