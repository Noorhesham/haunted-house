import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { houseData } from "./constant.js";
/*
 * Base
 */
// Debug used to debug and add a debugger for different vals on it
const gui = new GUI();

// Canvas to render the 3d models on it and it comes from the html
const canvas = document.querySelector("canvas.webgl");

// Scene i have to specifiy it in the begining
const scene = new THREE.Scene();
//Textures
const textureLoader = new THREE.TextureLoader();
//Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");
const floorColorTexture = textureLoader.load("./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg");
const floorARMTexture = textureLoader.load("./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg");
const floorNormalTexture = textureLoader.load("./floor/coast_sand_rocks_02_nor_gl_1k.jpg");
const floorDisplacementTexture = textureLoader.load("./floor/coast_sand_rocks_02_disp_1k.jpg");
floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
/*
 * House
 */
//creating any model in 3 js means that you will create a mesh and pass a geometry and material to it
// // Temporary sphere
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial({ roughness: 0.7 }));
// scene.add(sphere);

//Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    displacementMap: floorDisplacementTexture,
   
  })
);
floor.rotation.x = -Math.PI * 0.5; // rotate by half a circle

scene.add(floor);
// if u did not create the material in its own variable and pass it to the mesh first arg ..
// we can simply access it via floor.material (cause material is already assinged to the mesh )
//we need to rotate the floor
// gui.add(floor.rotation, "x").min(-10).max(2).step(0.01); control with gui

//we will create a group for the house !
const house = new THREE.Group();
scene.add(house);
//from now on we will treat the house as the scene for the house so we will add to the group not the scene so that
//we can move the house around togather as 1 component
//2.5 refers to placed 2.5 units above the ground or origin on the Y-axis.

const { wallsData, roofData, bush } = houseData;
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallsData.w, wallsData.h, wallsData.d),
  new THREE.MeshStandardMaterial()
);
house.add(walls);
walls.position.y += wallsData.h / 2; // the house has 2.5 height unit and u want to lift it up the half cause already the upper
//half is lifted so i will divide 2.5/2 1.25 and add it to y axis
//second lego piece is the roof pyramid but not pyramid so we are gonna use cone twisted to pyramid
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(roofData.radius, roofData.h, roofData.segments),
  new THREE.MeshStandardMaterial()
);
house.add(roof);
//move the pyramid up
roof.position.y = wallsData.h + roofData.h / 2;
//we need to rotate it the right way it is like placing a stick inside of it and moving that stick
roof.rotation.y = Math.PI / 2 / 2;
gui.add(roof.rotation, "y").min(0).max(10).step(0.01);
//door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({
    color: "red",
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01; // we want it to move into z to got over the wall that is 4 depth so it will be half
//z fighting bug is gonna happen here
//two faces are mathematically at the same spot  .. gpu does not know  which one is in front of the other

house.add(door);
//bushes
const bushGeometry = new THREE.SphereGeometry(bush.radius, bush.segments, bush.segments);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "green",
});
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

//graves
const graveGerometery = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "gray" });
const graves = new THREE.Group();
for (let i = 0; i < 31; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;

  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGerometery, graveMaterial);
  grave.position.x = x;
  grave.position.y = Math.random() * 0.3;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.position.z = z;
  //add to group
  graves.add(grave);
  // we need to randomize the position of the graves and circular positioning
}
scene.add(graves);
/*
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5); //color + intensity
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5); // color +intensity
directionalLight.position.set(3, 2, -8); // setting the position like x y z
scene.add(directionalLight);

/*
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/*
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/*
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
