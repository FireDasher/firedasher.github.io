const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
	const scene = new BABYLON.Scene(engine);

	const camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 5, -10), scene);
	camera.attachControl(canvas, true);
	camera.fov = Math.PI / 2;
	camera.minZ = 0.1;

	camera.speed = 0.5;
	camera.keysUp.push(87);    // W
	camera.keysDown.push(83);  // S
	camera.keysLeft.push(65);  // A
	camera.keysRight.push(68); // D
	camera.keysUpward.push(32); // Space
	camera.keysDownward.push(16); // Shift

	scene.onPointerDown = ()=>{
		engine.enterPointerlock();
	};

	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 1), scene);
	light.intensity = 1.0;

	return scene;
};

let scene = createScene();

engine.runRenderLoop(()=>{
	scene.render();
});

window.addEventListener("resize", ()=>{
    engine.resize();
});

const fileUpload = document.getElementById("file-upload");

fileUpload.addEventListener("change", ()=>{
	scene = createScene();
	const file = fileUpload.files[0];
	BABYLON.SceneLoader.Append("", file, scene, null, null, null, "." + file.name.split(".", 2)[1]);
});