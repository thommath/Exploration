import * as Comlink from "comlink";
import { Vector3 } from "three";
import { Icosphere, GenerationConfig } from "../Icosphere";

async function remoteFunction(
  detailLevel: number,
  generateVerts: boolean,
  startSeed: Vector3 = new Vector3(0, 0, 0),
  generationConfiguration: GenerationConfig,
  cb: any
) {
  console.log(startSeed)
  const ico = Icosphere.createGeometry(detailLevel, generateVerts, new Vector3(startSeed.x, startSeed.y, startSeed.z), generationConfiguration);
  cb(ico.vertices, ico.faces);
}

Comlink.expose(remoteFunction);
