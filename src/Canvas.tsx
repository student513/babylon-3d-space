import { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import { styled } from "@stitches/react";

const canvas = document.createElement("canvas");
const engine = new BABYLON.Engine(canvas, true, undefined, false);
const scene = new BABYLON.Scene(engine);
scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
scene.collisionsEnabled = true;
const camera = new BABYLON.FreeCamera(
  "personCamera",
  new BABYLON.Vector3(0, 3, 0)
);

export const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [xAxis, setXAxis] = useState(0);
  const [zAxis, setZAxis] = useState(0);

  useEffect(() => {
    engine.runRenderLoop(() => scene.render());
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.appendChild(canvas);
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
  }, []);

  // light
  useEffect(() => {
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 0, 1),
      scene
    );
    const a = new BABYLON.PointLight(
      "pointLight",
      new BABYLON.Vector3(1, 10, 1),
      scene
    );
  }, []);

  // camera
  useEffect(() => {
    const cameraPosition = new BABYLON.Vector3(xAxis, 3, zAxis);
    camera.position = cameraPosition;
  }, [scene, xAxis, zAxis]);

  useEffect(() => {
    const box = BABYLON.MeshBuilder.CreateBox("crate", { size: 2 }, scene);
    const mat = new BABYLON.StandardMaterial("groundMaterial", scene);
    mat.diffuseColor = new BABYLON.Color3(1, 0, 1);
    mat.backFaceCulling = false;
    box.material = mat;
    box.checkCollisions = true;

    const boxNb = 6;
    let theta = 0;
    const radius = 30;
    box.position = new BABYLON.Vector3(
      (radius + randomNumber(-0.5 * radius, 0.5 * radius)) *
        Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)),
      1,
      (radius + randomNumber(-0.5 * radius, 0.5 * radius)) *
        Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta))
    );

    const boxes = [box];
    for (let i = 1; i < boxNb; i++) {
      theta += (2 * Math.PI) / boxNb;
      const newBox = box.clone("box" + i);
      boxes.push(newBox);
      newBox.position = new BABYLON.Vector3(
        (radius + randomNumber(-0.5 * radius, 0.5 * radius)) *
          Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)),
        1,
        (radius + randomNumber(-0.5 * radius, 0.5 * radius)) *
          Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta))
      );
    }
  }, []);

  // camera position
  useEffect(() => {
    window.addEventListener("keydown", moveCamera);

    function moveCamera(event: KeyboardEvent) {
      switch (event.key) {
        case "w":
          setZAxis((prev) => prev + 0.3);
          break;
        case "s":
          setZAxis((prev) => prev - 0.3);
          break;
        case "d":
          setXAxis((prev) => prev + 0.3);
          break;
        case "a":
          setXAxis((prev) => prev - 0.3);
          break;
      }
    }
  }, []);

  // ground
  useEffect(() => {
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100, subdivisions: 4 },
      scene
    );
    const groundMaterial = new BABYLON.StandardMaterial(
      "groundMaterial",
      scene
    );
    groundMaterial.diffuseColor = new BABYLON.Color3(0.35, 0.9, 0.22);

    ground.material = groundMaterial;
  }, []);

  // sky
  //   useEffect(() => {
  //     const skybox = BABYLON.MeshBuilder.CreateBox(
  //       "skyBox",
  //       { size: 100.0 },
  //       scene
  //     );
  //     const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  //     skyboxMaterial.backFaceCulling = false;
  //     skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
  //       "textures/skybox",
  //       scene
  //     );
  //     skyboxMaterial.reflectionTexture.coordinatesMode =
  //       BABYLON.Texture.SKYBOX_MODE;
  //     skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  //     skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  //     skybox.material = skyboxMaterial;
  //   }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Container ref={containerRef} />
    </div>
  );
};

const Container = styled("div", {
  width: "100%",
  height: "100%",
});

function randomNumber(min: number, max: number) {
  if (min == max) {
    return min;
  }
  const random = Math.random();
  return random * (max - min) + min;
}
