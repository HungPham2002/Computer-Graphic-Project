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
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

camera.position.set(0, 0, 3) ; // Pull the camera back a bit, if not you cannot see

scene.add(camera);

/// spot light at astronaut
const spotLight_0 = new THREE.PointLight(0xffffff, 12, 10);
spotLight_0.position.set(5, 5, 5);
scene.add(spotLight_0);

/// spot light at back astronaut
const spotLight_1 = new THREE.SpotLight( 0xe65c00, 20, 10 );
spotLight_1.position.set( 0, 9, -5 );

scene.add( spotLight_1 );

/// spot light at left astronaut
const spotLight_2 = new THREE.SpotLight( 0xff751a , 15, 15);
spotLight_2.position.set( -13, 0, 5 );
scene.add( spotLight_2 );

// Spot Light Space Station_1

const spotLight_3 = new THREE.SpotLight( 0x1a53ff, 60 , 40); // color : intensity : distance
spotLight_3.position.set( -28, 40 , -28);

scene.add( spotLight_3 );

// Spot Light Space Station_2

const spotLight_4 = new THREE.SpotLight( 0xff1a1a, 10 , 40); // color : intensity : distance
spotLight_4.position.set( -28, 35 , -28);

// Spot Light Space Station_3

const spotLight_5 = new THREE.SpotLight( 0xffffff, 2 , 40); // color : intensity : distance
spotLight_5.position.set( -35, 30 , -35);

scene.add( spotLight_5 );

// Spot Light at Mars
const spotLight_6 = new THREE.SpotLight( 0xffffff, 2 ); // color : intensity : distance
spotLight_6.position.set( 0, 40 , -20);

scene.add( spotLight_6 );

// star reflection
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRndIntegerZ(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
//

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
// Star particles

const particlesCount = 5500; // Increased number of particles
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;
  const distanceFromMars = Math.random() * 10000 + 30000;
  const angle = Math.random() * Math.PI * 2;
  const separation = 1000; // Adjust this value for the desired separation distance

  const x = Math.cos(angle) * distanceFromMars;
  const y = Math.sin(angle) * distanceFromMars;
  const z = (Math.random() - 0.5) * separation;

  positions[i3] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1,
  sizeAttenuation: true,
  map: new THREE.TextureLoader().load('/textures/particles/star.png'),
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const starParticles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(starParticles);

const vertices = new Float32Array(particlesCount); // Float32Array is an array of 32-bit floats. This is used to represent an array of vertices. (we have 3 values for each vertex - coordinates x, y, z)

// Loop through all the vertices and set their random position
for (let i = 0; i < particlesCount; i++) {
  vertices[i] = (Math.random() - 0.5) * 300; // -0.5 to get the range from -0.5 to 0.5 than * 100 to get a range from -50 to 50
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3) // 3 values for each vertex (x, y, z)
);

const stars = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(stars);

/////////////////// IMPORT //////////////////////////////
//Import 3D Mars
let loadedModelMars;
const marsLoader = new GLTFLoader();
marsLoader.load('/mars.glb', (gltf) => {
  console.log('MARS HERE', gltf);
  const mars = gltf.scene;
  loadedModelMars = mars;
  mars.position.set(0, -30, -50);
  mars.scale.set(15, 15, 15);
  scene.add(mars);
});


//Import Deimos Model
let loadedModelDeimos;
const deimosLoader = new GLTFLoader();
deimosLoader.load('/deimos.glb', (gltf) => {
  const deimos = gltf.scene;
  loadedModelDeimos = deimos;
  deimos.scale.set(0.001, 0.001, 0.001); // Adjust the scale of Deimos
  scene.add(deimos);
  // Set initial position of Deimos relative to Mars
  const radius = 100; // Increase the radius to make the orbit larger
  const angle = Math.random() * Math.PI * 2; // Randomize the initial angle

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  deimos.position.set(x, 0, z);
});
// Import the astronaut 3D model
let mixer;
const gltfLoader = new GLTFLoader(); // Create a loader
gltfLoader.load('/scene.glb', (gltf) => {
  console.log('success');
  console.log('ASTRONAULT HERE', gltf);

  const astronault = gltf.scene;
  astronault.position.set(0, 0, 0);
  astronault.scale.set(1 , 1, 1);
  astronault.rotation.set(0.5,0,-0.1);
  scene.add(astronault);
  mixer = new THREE.AnimationMixer(astronault);
  const clips_astronaut = gltf.animations;
  // play certain the animation
  // const clip = THREE.AnimationClip.findByName(clips, 'moon_walk');
  // const action = mixer.clipAction(clip);
  // action.play();
  
  // play all animations
  clips_astronaut.forEach(function(clip) {
  const action_astronaut = mixer.clipAction(clip);
  action_astronaut.play();
  });
}, undefined, function(error) {
      console.error(error);
});


// Import Space Station Model 
const SpaceStationLoader = new GLTFLoader(); // Create a loader
SpaceStationLoader.load('/space_station.glb', (gltf) => {
  console.log('success');
  console.log('SPACE STATION HERE', gltf);

  const SpaceStation = gltf.scene;
  SpaceStation.position.set(-28, 20 , -21);
  SpaceStation.scale.set(1.7, 1.7, 1.7);
  // SpaceStation.rotation.set(0.5,0,-0.1);
  scene.add(SpaceStation);
})

// Import Butterfly 1 Model 
let mixer_butterfly1;
let loadedModelbutterfly1;
const ButterflyLoader1 = new GLTFLoader(); // Create a loader
ButterflyLoader1.load('/butterfly.glb', (gltf) => {
  console.log('success');
  console.log('BUTTERFLY1 HERE', gltf);

  const Butterfly1 = gltf.scene;
  loadedModelbutterfly1 = Butterfly1;
  Butterfly1.position.set(0.5, 1.3 , 1.3);
  Butterfly1.scale.set(0.002, 0.002, 0.002);
  Butterfly1.rotation.set(0, 1.5, 0);
  scene.add(Butterfly1);

  mixer_butterfly1 = new THREE.AnimationMixer(Butterfly1);
  const clips_butterfly1 = gltf.animations;
  const clip_butterfly1 = THREE.AnimationClip.findByName(clips_butterfly1,'Take 01');
  const action_butterfly1 = mixer_butterfly1.clipAction(clip_butterfly1);
  action_butterfly1.play();
}, undefined, function(error) {
  console.error(error);
})

 // Import Butterfly 2 Model 
let mixer_butterfly2;
const ButterflyLoader2 = new GLTFLoader(); // Create a loader
ButterflyLoader2.load('/butterfly.glb', (gltf) => {
  console.log('success');
  console.log('BUTTERFLY1 HERE', gltf);

  const Butterfly2 = gltf.scene;
  Butterfly2.position.set(1, 1.4 , 1.3);
  Butterfly2.scale.set(0.002, 0.002, 0.002);
  scene.add(Butterfly2);

  mixer_butterfly2 = new THREE.AnimationMixer(Butterfly2);
  const clips_butterfly2 = gltf.animations;
  const clip_butterfly2 = THREE.AnimationClip.findByName(clips_butterfly2,'Take 01');
  const action_butterfly2 = mixer_butterfly2.clipAction(clip_butterfly2);
  action_butterfly2.play();
}, undefined, function(error) {
  console.error(error);
})

// // Import Butterfly 3 Model 
// let mixer_butterfly3;
// const ButterflyLoader3 = new GLTFLoader(); // Create a loader
// ButterflyLoader3.load('/butterfly.glb', (gltf) => {
//   console.log('success');
//   console.log('BUTTERFLY3 HERE', gltf);

//   const Butterfly3 = gltf.scene;
//   Butterfly3.position.set(0.5, 1.2 , 1.1);
//   Butterfly3.scale.set(0.002, 0.002, 0.002);
//   scene.add(Butterfly3);

//   mixer_butterfly3 = new THREE.AnimationMixer(Butterfly3);
//   const clips_butterfly3 = gltf.animations;
//   const clip_butterfly3 = THREE.AnimationClip.findByName(clips_butterfly3,'Take 01');
//   const action_butterfly3 = mixer_butterfly3.clipAction(clip_butterfly3);
//   action_butterfly3.play();
// }, undefined, function(error) {
//   console.error(error);
// })

// // Import Butterfly 4 Model 
// let mixer_butterfly4;
// const ButterflyLoader4 = new GLTFLoader(); // Create a loader
// ButterflyLoader4.load('/butterfly.glb', (gltf) => {
//   console.log('success');
//   console.log('BUTTERFLY4 HERE', gltf);

//   const Butterfly4 = gltf.scene;
//   Butterfly4.position.set(-0.1, 1.2 , 1.4);
//   Butterfly4.scale.set(0.002, 0.002, 0.002);
//   Butterfly4.rotation.set(0, 1.5, 0);
//   scene.add(Butterfly4);

//   mixer_butterfly4 = new THREE.AnimationMixer(Butterfly4);
//   const clips_butterfly4 = gltf.animations;
//   const clip_butterfly4 = THREE.AnimationClip.findByName(clips_butterfly4,'Take 01');
//   const action_butterfly4 = mixer_butterfly4.clipAction(clip_butterfly4);
//   action_butterfly4.play();
// }, undefined, function(error) {
//   console.error(error);
// })

/////////////////////////// IMPORT /////////////////////////

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, // canvas is the canvas element from the html
});
const renderer_1 = new THREE.WebGLRenderer({ // astronaut
  canvas: canvas, // canvas is the canvas element from the html
});

const renderer_2 = new THREE.WebGLRenderer({ // butterfly 1
  canvas: canvas, // canvas is the canvas element from the html
});

const renderer_3 = new THREE.WebGLRenderer({ // butterfly 2
  canvas: canvas, // canvas is the canvas element from the html
});

// const renderer_4 = new THREE.WebGLRenderer({ // butterfly 3
//   canvas: canvas, // canvas is the canvas element from the html
// });

// const renderer_5 = new THREE.WebGLRenderer({ // butterfly 4
//   canvas: canvas, // canvas is the canvas element from the html
// });
// render animation astronaut
const clock = new THREE.Clock();
function animated_astronaut(){
  if(mixer)
    mixer.update(clock.getDelta());
  renderer_1.render(scene, camera);
}
renderer_1.setAnimationLoop(animated_astronaut)

// render animation butterfly 1
const clock_1 = new THREE.Clock();
function animated_butterfly1(){
  if (mixer_butterfly1)
    mixer_butterfly1.update(clock_1.getDelta());
  renderer_2.render(scene,camera);
}
renderer_2.setAnimationLoop(animated_butterfly1);

// render animation butterfly 2
const clock_2 = new THREE.Clock();
function animated_butterfly2(){
  if (mixer_butterfly2)
    mixer_butterfly2.update(clock_2.getDelta());
  renderer_3.render(scene,camera);
}
renderer_3.setAnimationLoop(animated_butterfly2);

// render animation butterfly 3
// const clock_3 = new THREE.Clock();
// function animated_butterfly3(){
//   if (mixer_butterfly3)
//     mixer_butterfly3.update(clock_3.getDelta());
//   renderer_4.render(scene,camera);
// }
// renderer_4.setAnimationLoop(animated_butterfly3);

// render animation butterfly 4
// const clock_4 = new THREE.Clock();
// function animated_butterfly4(){
//   if (mixer_butterfly4)
//     mixer_butterfly4.update(clock_4.getDelta());
//   renderer_5.render(scene,camera);
// }
// renderer_5.setAnimationLoop(animated_butterfly4);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // to avoid picelation on high resolution screenss

///////////////// ROTATION ANIMATION ///////////////////////
// Animation function for Mars rotation and Deimos orbit
const orbitRadius = 20;
const animate_planet = () => {
  if (loadedModelMars) {
    loadedModelMars.rotation.y += 0.001; // Adjust the rotation speed of Mars
  }

  if (loadedModelDeimos && loadedModelMars) {
    const speed = 0.06; // Adjust the speed of Deimos' rotation

    const angle = speed * Date.now() * 0.001; // Calculate the angle based on time

    // Calculate the new position of Deimos based on the angle and orbit radius
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;

    loadedModelDeimos.position.x = loadedModelMars.position.x + x;
    loadedModelDeimos.position.z = loadedModelMars.position.z + z;
    loadedModelDeimos.rotation.y = -angle + Math.PI / 2; // Adjust the rotation to align Deimos with the orbit
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate_planet);
};

animate_planet();

// Animate Rotation Astronaut
// const animate_Astronaut = () => {
//   if (loadedModelAstronaut) {
//     loadedModelAstronaut.rotation.x += 0.00;
//     loadedModelAstronaut.rotation.y += 0.00;
//     loadedModelAstronaut.rotation.z += 0.00;
//   }
//   requestAnimationFrame(animate_Astronaut);
// };
// animate_Astronaut();

const animate_pos_butterfly1 = () => {
  if (loadedModelbutterfly1){
    loadedModelbutterfly1.position.x -= 0.0007;
    loadedModelbutterfly1.position.y += 0.0005;
  }
  requestAnimationFrame(animate_pos_butterfly1);
};
animate_pos_butterfly1();

const animate_pos_butterfly2 = () => {
  if (loadedModelbutterfly2){
    loadedModelbutterfly2.position.x -= 0.0005;
    loadedModelbutterfly2.position.y += 0.0004;
  }
  requestAnimationFrame(animate_pos_butterfly2);
};
animate_pos_butterfly2();

// Animate Rotation star
// const animate = () => {
//   // Update the controls
//   controls.update();
//   // Rotate a bit the stars
//   stars.rotation.y += -0.0002;
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(animate);
// };
// animate();

