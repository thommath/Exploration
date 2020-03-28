import {
  Geometry,
  Vector3,
  Face3,
  Object3D,
  Mesh,
  Material,
  MeshBasicMaterial,
  Camera,
  SphereGeometry,
  MeshPhongMaterial,
  Vector2
} from "three";
import * as SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise('heya');

const randomVector = (p: Vector3): number => 
  simplex.noise3D(startSeed + p.x * noise, startSeed + p.y * noise, startSeed + p.z * noise);

const randomNumber = (p: Vector2): number => 
  simplex.noise2D(startSeed + p.x * noise, startSeed + p.y * noise);

const startSeed = 20;
const noise = 1;

export class Icosphere {


  static calculateNoisedPosition(pos: Vector3, startSeed: Vector3 = new Vector3(0, 0, 0)): Vector3 {
    const randomZeroToOne = (1 + randomVector(pos))/2;
    const newPos = pos.clone();
    //newPos.divideScalar((newPos.length() / 1.9));
    
    for (let i = 0; i < 10; i++) {
      const randomOnePlusMinusALittle = 1 + randomVector(startSeed.clone().add(newPos).multiplyScalar(i+1)) * (.1 / Math.pow(i+1, 1.2));
      //const randomOnePlusMinusALittle = 1 + randomVector(startSeed.clone().add(newVertex)) * 0.1;
      newPos.multiplyScalar(randomOnePlusMinusALittle);
    }
    return newPos;

  }

  static createGeometry(recursionLevel: number = 1, startSeed: Vector3 = new Vector3(0, 0, 0)): Geometry {
    // http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
    const geometry = new Geometry();

    // Create the initial 12 vertices
    var t = (1.0 + Math.sqrt(5.0)) / 2.0;

    const vertices: Vector3[] = [
      new Vector3(-1, t, 0),
      new Vector3(1, t, 0),
      new Vector3(-1, -t, 0),
      new Vector3(1, -t, 0),

      new Vector3(0, -1, t),
      new Vector3(0, 1, t),
      new Vector3(0, -1, -t),
      new Vector3(0, 1, -t),

      new Vector3(t, 0, -1),
      new Vector3(t, 0, 1),
      new Vector3(-t, 0, -1),
      new Vector3(-t, 0, 1)
    ].map(p => Icosphere.calculateNoisedPosition(p, startSeed));

    let indices: Face3[] = [
      new Face3(0, 11, 5),
      new Face3(0, 5, 1),
      new Face3(0, 1, 7),
      new Face3(0, 7, 10),
      new Face3(0, 10, 11),

      new Face3(1, 5, 9),
      new Face3(5, 11, 4),
      new Face3(11, 10, 2),
      new Face3(10, 7, 6),
      new Face3(7, 1, 8),

      new Face3(3, 9, 4),
      new Face3(3, 4, 2),
      new Face3(3, 2, 6),
      new Face3(3, 6, 8),
      new Face3(3, 8, 9),

      new Face3(4, 9, 5),
      new Face3(2, 4, 11),
      new Face3(6, 2, 10),
      new Face3(8, 6, 7),
      new Face3(9, 8, 1)
    ];

    const pointCache: any = {};

    const logging: any = {};
    

    const getMiddlePointIndex = (i1: number, i2: number, recursionIndex: number) => {
      // Check the cache

      // Key with higher number first
      const key = i1 > i2 ? i1 + "-" + i2 : i2 + "-" + i1;

      // If not cached
      if (!pointCache[key]) {
        // Create a new verticy in the middle between the two points
        const newVertex = vertices[i1].clone().add(vertices[i2]).divideScalar(2);

        newVertex.divideScalar((newVertex.length() / 1.9));
              
        const newLength = vertices.push(
          Icosphere.calculateNoisedPosition(newVertex, startSeed)
        );
        // Map the key to the newly added index
        pointCache[key] = newLength - 1;
      }
      // Return the index of the
      return pointCache[key];
    };

    // Refine trangles
    for (let i = 0; i < recursionLevel; i++) {
      const refinedIndices: Face3[] = [];
      indices.forEach((face: Face3) => {
        // Replace with four faces

        const a = getMiddlePointIndex(face.a, face.b, i);
        const b = getMiddlePointIndex(face.b, face.c, i);
        const c = getMiddlePointIndex(face.c, face.a, i);

        refinedIndices.push(new Face3(face.a, a, c));
        refinedIndices.push(new Face3(face.b, b, a));
        refinedIndices.push(new Face3(face.c, c, b));
        refinedIndices.push(new Face3(a, b, c));
      });
      indices = refinedIndices;
    }

    console.log(logging);

    geometry.faces = indices;
    geometry.vertices = vertices;
    geometry.elementsNeedUpdate = true;
    geometry.verticesNeedUpdate = true;

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
  }
}
