import { Geometry, Vector3, Face3, Object3D, Mesh, Material, MeshBasicMaterial, Camera, SphereGeometry, MeshPhongMaterial } from "three";
import * as SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise('heya');

const randomVector = (p: Vector3): number => 
  simplex.noise3D(p.x, p.y, p.z);

export class Planet extends Mesh{
  pos: Vector3;
  color: string;
  seed: number;

  detailLevel: number = 0;
  size: number = 1;

  constructor(parent: Object3D, { size, pos, color, seed, geometry, material }: {pos: Vector3, size?: number, color?: string | number, seed?: number, geometry?: Geometry, material?: Material}) {
    super(geometry, material);

    [this.pos, this.seed, this.size] = [pos, seed, size];
    
    // Set material
    this.material = material || new MeshPhongMaterial({ color: color || 0x00ff00 });
    // Set geometry
    this.setRes(1);

    parent.add(this);
  }

  setRes(n: number) {
    this.geometry = new SphereGeometry(this.size, n, n);
    this.geometry.translate(this.pos.x, this.pos.y, this.pos.z)

    const geometry = (<Geometry> this.geometry);
    geometry.vertices.map(v => {
      const norm = v.clone().sub(this.pos).normalize();
      v
        .add(norm.multiplyScalar(randomVector(v)).multiplyScalar(0.2))
        .add(norm.multiplyScalar(randomVector(v.clone().multiplyScalar(3))).multiplyScalar(0.3));
    });

  }
  
  update(camera: Camera) {
    const d = camera.position.distanceTo(this.pos);

    const maxDist = 30;

    this.setRes(Math.max(Math.min(Math.floor(maxDist-(d)), maxDist), 1));
  }
}