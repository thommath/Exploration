import { Geometry, Vector3, Face3, Object3D, Mesh, Material, MeshBasicMaterial, Camera, SphereGeometry, MeshPhongMaterial } from "three";
import * as SimplexNoise from 'simplex-noise';
import { Icosphere, GenerationConfig } from './Icosphere';


export type PlanetConfig = {
  pos: Vector3;
  size?: number;
  color?: Vector3;
  seed?: number;
  geometry?: Geometry;
  material?: Material;
  generationConfig: GenerationConfig;
};

export class Planet extends Mesh{
  config: PlanetConfig;

  detailLevel: number = 0;

  lastRes: number = 0;

  constructor(parent: Object3D, config: PlanetConfig) {
    super(config.geometry, config.material);

    this.config = config;

    // Set material
    this.material = config.material || new MeshPhongMaterial({ color: 0x00ff00 });
    // Set geometry
    this.setRes(1);

    parent.add(this);

    window.addEventListener("keypress", (e) => {
      if (Number(e.key)) this.setRes(Number(e.key));
    })
  }

  setRes(detailLevel: number) {

    if (detailLevel === this.lastRes) {
      return;
    } else {
      this.lastRes = detailLevel;
    }
    console.log('New res!', detailLevel);
    /*
    this.geometry = new SphereGeometry(this.config.size, Math.max(16, detailLevel), Math.max(16, detailLevel));
    this.geometry.translate(this.config.pos.x, this.config.pos.y, this.config.pos.z)
    
    const geometry = (<Geometry> this.geometry);
    geometry.vertices.map(v => {
      const norm = v.clone().sub(this.config.pos).normalize();
      
      for (let n = 1; n <= this.config.size; n++s) {
        v.add(norm.multiplyScalar(randomVector(v.clone().multiplyScalar(n))).multiplyScalar(1/n))
      }
      //        .add(norm.multiplyScalar(randomVector(v.clone().multiplyScalar(3))).multiplyScalar(0.3));
    });
    this.geometry = new SphereGeometry(1, Math.max(16, detailLevel), Math.max(16, detailLevel));
    */
    this.geometry = Icosphere.createGeometry(detailLevel, this.config.pos, this.config.generationConfig);

    this.geometry.scale(this.config.size || 1, this.config.size || 1, this.config.size || 1);
    this.geometry.translate(this.config.pos.x, this.config.pos.y, this.config.pos.z)
  }
  
  update(camera: Camera) {
    const d = camera.position.distanceTo(this.config.pos) - this.config.size;

    const maxDist = 120;
    const divideBy = 4;

    const maxDetailLevel = 5;

    /*
      Let's do some math again

      We have a distance d to the planet's core

      when we are far away we want no details, = 1
      when we are close we want lot's of details, = 7

      Sooo let's try linear approach

      y = - x*dx + 7

      when x = 0 we are at 7
      and when x grows y is lower

      when dx is bigger it is steeper and y goes negative quicker, which means less planets with good resolution
    */

    /**
     
      Did not work well, let's try exponential

     */
    const dx = 0.001;
    const y = - Math.pow(d, 2) * dx + maxDetailLevel;

    const res = Math.round(Math.max(Math.min(y,  maxDetailLevel), 1));
    this.setRes(res);
    //    this.setRes(Math.max(Math.min(Math.floor((maxDist-d)/divideBy), maxDist/divideBy), 1));
  }
}