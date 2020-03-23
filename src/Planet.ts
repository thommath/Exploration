import { Geometry, Vector3, Face3, Object3D, Mesh, Material, MeshBasicMaterial, Camera, SphereGeometry, MeshPhongMaterial } from "three";
import * as SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise('heya');

const randomVector = (p: Vector3): number => 
  simplex.noise3D(p.x, p.y, p.z);

export class Planet extends Mesh{
  config: {pos: Vector3, size?: number, color?: string | number, seed?: number, geometry?: Geometry, material?: Material};

  detailLevel: number = 0;

  constructor(parent: Object3D, config: {pos: Vector3, size?: number, color?: string | number, seed?: number, geometry?: Geometry, material?: Material}) {
    super(config.geometry, config.material);

    this.config = config;

    // Set material
    this.material = config.material || new MeshPhongMaterial({ color: config.color || 0x00ff00 });
    // Set geometry
    this.setRes(1);

    parent.add(this);
  }

  setRes(detailLevel: number) {
    this.geometry = new SphereGeometry(this.config.size, Math.max(16, detailLevel), Math.max(16, detailLevel));
    this.geometry.translate(this.config.pos.x, this.config.pos.y, this.config.pos.z)

    const geometry = (<Geometry> this.geometry);
    geometry.vertices.map(v => {
      const norm = v.clone().sub(this.config.pos).normalize();

      for (let n = 1; n <= this.config.size; n++) {
        v.add(norm.multiplyScalar(randomVector(v.clone().multiplyScalar(n))).multiplyScalar(1/n))
      }
//        .add(norm.multiplyScalar(randomVector(v.clone().multiplyScalar(3))).multiplyScalar(0.3));
    });

  }
  
  update(camera: Camera) {
    const d = camera.position.distanceTo(this.config.pos);

    const maxDist = 120;
    const divideBy = 4;

    this.setRes(Math.max(Math.min(Math.floor((maxDist-d)/divideBy), maxDist/divideBy), 1));
  }
}