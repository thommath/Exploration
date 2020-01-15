import { Planet } from './Planet';
import { Group, Vector3, Material, Geometry, MeshPhongMaterial, Camera, PointLight } from 'three';

export class PlanetSystem extends Group {


  areaSize = 150;
  planetSize = 4;
  
  planets: Planet[] = [];

  material = new MeshPhongMaterial( { color: 0x00ff0a } );
  sunMaterial = new MeshPhongMaterial( { color: 0xffa000, emissive: 0xff0000, emissiveIntensity: 1 } );

  sunConfig = {
    material: this.sunMaterial,
    size: Math.random()*this.planetSize*2,
  }

  constructor(numberOfPlanets: number = 50) {
    super();
    for(let n = 0; n < numberOfPlanets; n++) {

      if (Math.random() < 0.2) { // Make a sun

        const config = {...this.getRandomPlanetConfig(), ...this.sunConfig };
        const sun = new Planet(this, config)
        const light = new PointLight(0xffffff, 1, 100, 2);
        light.position.set(config.pos.x, config.pos.y, config.pos.z);
        sun.add(light)
        this.planets.push(sun);
        
      } else {
        this.planets.push(new Planet(this, this.getRandomPlanetConfig()));
      }
    }
  }

  update(camera: Camera) {
    this.planets.forEach(p => p.update(camera));
  }

  getRandomPlanetConfig(): {pos: Vector3, size?: number, color?: number, seed?: number, geometry?: Geometry, material?: Material} {

    return {
      pos: new Vector3(Math.random()*this.areaSize-this.areaSize/2, Math.random()*this.areaSize-this.areaSize/2, Math.random()*this.areaSize-this.areaSize/2),
      size: Math.random()*this.planetSize,
      color: Math.floor(Math.random()*16777215),
    };
  }
}