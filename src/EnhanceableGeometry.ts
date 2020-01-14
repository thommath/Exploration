import { Geometry, Vector3, Face3, Scene, Mesh, Material, MeshBasicMaterial, Camera, Object3D } from "three";
import * as SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise('heya');

const randomVector = (p: Vector3): number => 
  simplex.noise3D(p.x, p.y, p.z);

const avg = (a: Vector3, b: Vector3) => {
    var dir = b.clone().sub(a);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len*.5);
    return a.clone().add(dir);
};


export class EnhanceableGeometry extends Mesh {

  parent: Object3D;

  children: EnhanceableGeometry[];

  constructor(parent: Object3D, geometry: Geometry, material: Material | Material[]) {
    super(geometry, material);
    this.parent = parent;
  }

  split() {
    console.log('splitting')
    
    const geometry = (<Geometry> this.geometry);
    const tempGeometry = new Geometry();
    
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();


    geometry.faces.forEach((face: Face3, index) => {

      const points = [
        geometry.vertices[face.a],
        geometry.vertices[face.b],
        geometry.vertices[face.c],
      ];

      const getPoint = (n: number, n2: number) => {
        const p = avg(points[n], points[n2]);
        const norm = avg(face.vertexNormals[0], face.vertexNormals[1]);
        return p.add(norm.multiplyScalar(randomVector(p)).normalize().multiplyScalar(0.1));
      }

      const newPoints = [
        getPoint(0, 1),
        getPoint(1, 2),
        getPoint(2, 0),
      ];

      tempGeometry.vertices.push(
        points[0],newPoints[0],
        points[1],newPoints[1],
        points[2],newPoints[2],
      );

      console.log(tempGeometry.vertices)

      const i = index * 6;

      tempGeometry.faces.push(
        new Face3(i + 5, i + 0, i + 1),
        new Face3(i + 1, i + 2, i + 3),
        new Face3(i + 3, i + 4, i + 5),
        new Face3(i + 1, i + 3, i + 5),
      );
/*
      tempGeometry.faces.push(
        new Face3(0, 2, 4),
      );
*/

      tempGeometry.computeBoundingSphere();

      
      console.log('split', index);
      
    });
    this.geometry = tempGeometry;
    
    console.log('done');
  }

  update(center: Vector3) {
    const geometry = (<Geometry> this.geometry);
    geometry.vertices.map((v, i) => {
      const norm = v.clone().sub(center).normalize();
      v
        .add(norm.multiplyScalar(randomVector(v)).multiplyScalar(0.2))
        .add(norm.multiplyScalar(randomVector(v.clone().multiplyScalar(3))).multiplyScalar(0.3));
    });

  }

}