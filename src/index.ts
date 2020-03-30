import {Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Clock, MeshPhongMaterial, DirectionalLight, MeshDepthMaterial, ShaderLib } from 'three';
import { PlanetSystem } from './PlanetSystem';
import { FlyControls } from './FlyControls';

var scene = new Scene();
var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//var directionalLight = new DirectionalLight( 0xffffff, 0.5 );
//scene.add( directionalLight )

const planetsystem = new PlanetSystem();

scene.add(planetsystem);

camera.position.z = 3;

var clock = new Clock();

let res = 1;

const keysPressed: any = {};
window.addEventListener('keydown', (event) => {
  keysPressed[event.key] = true;
});
window.addEventListener('keyup', (event) => {
  keysPressed[event.key] = false;
});

const controls = new FlyControls( camera, renderer.domElement );
controls.movementSpeed = 10;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 6;
controls.autoForward = false;
controls.dragToLook = false;

// Only upadte controls if window is in focus

let isTabActive: boolean = true;

window.onfocus = function () { 
  isTabActive = true; 
}; 

window.onblur = function () { 
  isTabActive = false; 
}; 

// test
setInterval(function () { 
  console.log(isTabActive ? 'active' : 'inactive'); 
}, 1000);


var animate = function () {
  requestAnimationFrame( animate );

  if (!isTabActive) {
    
    if (clock.running) {
      clock.stop();
    }

    return;
  } else if (!clock.running) {
    clock.start();
  }
  
  var delta = clock.getDelta();
  //planet.mesh.rotation.x += 0.01;
  //planet.mesh.rotation.y += 0.01;
  
  
  
  controls.update( delta );
  planetsystem.update(camera);

  renderer.render( scene, camera );
};

animate();

