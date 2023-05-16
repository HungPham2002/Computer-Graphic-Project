import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Canvas
const canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // FOV - Field of view
  window.innerHeight / window.innerHeight, // Aspect Ratio
  0.1, // Near
  1000 // Far
);
camera.position.z = 3; // Pull the camera back a bit, if not you cannot see
scene.add(camera);

// Lights
/// ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 2);
// ambientLight.position.set(0, 0, 0);
// scene.add(ambientLight);

/// point light
const pointLight = new THREE.PointLight(0xffffff, 2.55);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

/// spot light at back
const spotLight_1 = new THREE.SpotLight( 0xff66ff, 1 );
spotLight_1.position.set( 10, 40, -30 );

spotLight_1.castShadow = false;

spotLight_1.shadow.mapSize.width = 1024;
spotLight_1.shadow.mapSize.height = 1024;

spotLight_1.shadow.camera.near = 500;
spotLight_1.shadow.camera.far = 4000;
spotLight_1.shadow.camera.fov = 30;

scene.add( spotLight_1 );

/// spot light at left
const spotLight_2 = new THREE.SpotLight( 0x00e6b8 , 0.5);
spotLight_2.position.set( -15, -5, 5 );

spotLight_2.castShadow = false;

spotLight_2.shadow.mapSize.width = 720;
spotLight_2.shadow.mapSize.height = 720;

spotLight_2.shadow.camera.near = 500;
spotLight_2.shadow.camera.far = 4000;
spotLight_2.shadow.camera.fov = 30;

scene.add( spotLight_2 );

// star reflection
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRndIntegerZ(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function returnFloatAOrB(a, b, condition) {
  if (condition) {
      return a;
  } else {
      return b;
  }
}

for (let i = 0; i < 10; i++) {
  const isTrue = i % 2 === 1; // isTrue lần lượt là true, false, true, false, ...
  const pointLight = new THREE.PointLight(0xffffff, returnFloatAOrB(0.001, 0.0003, isTrue));
  pointLight.position.set(getRndInteger(-50, 50), getRndInteger(-50, 50), getRndIntegerZ(5,30));
  scene.add(pointLight);
}


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Set to true is used to give a sense of weight to the controls

// Particles
const particlesGeometry = new THREE.BufferGeometry(); // Geometry for the stars
const particlesCount = 15000; // number of particles to be created

const vertices = new Float32Array(particlesCount); // Float32Array is an array of 32-bit floats. This is used to represent an array of vertices. (we have 3 values for each vertex - coordinates x, y, z)

// Loop through all the vertices and set their random position
for (let i = 0; i < particlesCount; i++) {
  vertices[i] = (Math.random() - 0.5) * 100; // -0.5 to get the range from -0.5 to 0.5 than * 100 to get a range from -50 to 50
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3) // 3 values for each vertex (x, y, z)
  // Check the documentation for more info about this.
);

// Texture
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/star.png'); // Add a texture to the particles

// Material
const particlesMaterial = new THREE.PointsMaterial({
  map: particleTexture, // Texture
  size: 0.5, // Size of the particles
  sizeAttenuation: true, // size of the particle will be smaller as it gets further away from the camera, and if it's closer to the camera, it will be bigger
});

const stars = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(stars);

// Import the astronaut 3D model
let loadedModelAstronaut;
let mixer;
const gltfLoader = new GLTFLoader(); // Create a loader
gltfLoader.load('/scene.glb', (gltf) => {
  console.log('success');
  console.log('ASTRONAULT HERE', gltf);

  const astronault = gltf.scene;
  loadedModelAstronaut = astronault;
  astronault.position.set(0, 0, 0);
  astronault.scale.set(1 , 2, 1);

  scene.add(astronault);
  mixer = new THREE.AnimationMixer(astronault);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, 'floating');
  const action = mixer.clipAction(clip);
  action.play();
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, // canvas is the canvas element from the html
});

const clock = new THREE.Clock();
function animated_astronaut(){
  if(mixer)
    mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animated_astronaut)

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // to avoid picelation on high resolution screenss

// Animate Astronaut
const animate_Astronaut = () => {
  if (loadedModelAstronaut) {
    loadedModelAstronaut.rotation.x += 0.00;
    loadedModelAstronaut.rotation.y += 0.00;
    loadedModelAstronaut.rotation.z += 0.00;
  }
  requestAnimationFrame(animate_Astronaut);
};
animate_Astronaut();


// Animate
const animate = () => {
  // Update the controls
  controls.update();

  // Rotate a bit the stars
  stars.rotation.y += -0.0005;

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
