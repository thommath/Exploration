import { Geometry, Vector3, Face3, Object3D, Mesh, Material, MeshBasicMaterial, Camera, SphereGeometry, MeshPhongMaterial } from "three";
import { EnhanceableGeometry } from './EnhanceableGeometry';

export class Planet {
  pos: Vector3;
  color: string;
  seed: number;

  enhanceableGeometry: EnhanceableGeometry;

  detailLevel: number = 0;
  size: number = 1;

  constructor(parent: Object3D, { size, pos, color, seed, geometry, material }: {pos: Vector3, size?: number, color?: string | number, seed?: number, geometry?: Geometry, material?: Material}) {
    [this.pos, this.seed, this.size] = [pos, seed, size];

    if (!geometry) {
      geometry = new SphereGeometry(this.size, 6, 6);
      geometry.translate(this.pos.x, this.pos.y, this.pos.z)
    }

    this.enhanceableGeometry = new EnhanceableGeometry(parent, geometry, material || new MeshPhongMaterial({ color: color || 0x00ff00 }));

    parent.add(this.enhanceableGeometry);

  }

  setRes(n: number) {
    this.enhanceableGeometry.geometry = new SphereGeometry(this.size, n, n);
    this.enhanceableGeometry.geometry.translate(this.pos.x, this.pos.y, this.pos.z)
    this.enhanceableGeometry.update(this.pos);
  }
  
  update(camera: Camera) {
    const d = camera.position.distanceTo(this.pos);

    const maxDist = 30;

    this.setRes(Math.max(Math.min(Math.floor(maxDist-(d)), maxDist), 1));
  }
}