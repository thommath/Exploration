import { Planet, PlanetConfig } from './Planet';
import { Group, Vector3, Material, Geometry, MeshPhongMaterial, Camera, PointLight, MeshDistanceMaterial, MeshDepthMaterial, MeshNormalMaterial, Vector2, ShaderMaterial } from 'three';
import { GenerationConfig } from './Icosphere';

import planetVert from 'raw-loader!./shaders/planet.vert';
import planetFrag from 'raw-loader!./shaders/planet.frag';

type ColorMaterialConfig = {
  color: Vector3;
  area: number;
  offset: number;
  smoothness: number;
}


export class PlanetSystem extends Group {


  areaSize = 15;
  planetSize = 10;
  
  planets: Planet[] = [];

  material = new MeshPhongMaterial( { color: 0x00ff0a } );
  sunMaterial = new MeshPhongMaterial( { color: 0xffa000, emissive: 0xff0000, emissiveIntensity: 1 } );

  sunConfig = {
    material: this.sunMaterial,
    size: Math.random()*this.planetSize*2,
  }

  constructor(numberOfPlanets: number = 20) {
    super();

    const vShader = planetVert.substr(16, planetVert.length-20).replace(/\\n/g, "\n");//.replace(/([^a-z0-9A-Z;\.,{}\+\-\*\/ = \[\]_\n()]+)/gi, '');
    const fShader = planetFrag.substr(16, planetFrag.length-20).replace(/\\n/g, "\n");//.replace(/([^a-z0-9A-Z;\.,{}\+\-\*\/ = \[\]_\n()]+)/gi, '');

    console.log(vShader, fShader);


    const pos = new Vector3(0, 0, -this.planetSize*5);
    const size = this.planetSize;

    let colorPatternConfig: (ColorMaterialConfig | 0)[] = [];
    colorPatternConfig.length = 5;
    colorPatternConfig.fill(0);
    colorPatternConfig = colorPatternConfig.map(this.getRandomColorConfig)
    console.log(colorPatternConfig);

    const material = new ShaderMaterial( {
      uniforms: {
        pos: { value: pos },
        size: { value: size },
        colorConfig: { value: colorPatternConfig }
      },
      vertexShader: vShader,
      fragmentShader: fShader
    
    } );

    this.planets.push(new Planet(this, {
      material,
      pos,
      size,
      generationConfig: this.getRandomGenerationConfig()
    }));

    const light = new PointLight(0xffffff, 1, 100, 2);
    light.position.set(0, 0, -this.planetSize*5);
    this.planets[0].add(light)
    return;

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

  getRandomPlanetConfig(): PlanetConfig {

    return {
      pos: new Vector3(Math.random()*this.areaSize-this.areaSize/2, Math.random()*this.areaSize-this.areaSize/2, Math.random()*this.areaSize-this.areaSize/2),
      size: Math.random()*this.planetSize,
      color: Math.floor(Math.random()*16777215),
      generationConfig: this.getRandomGenerationConfig(),
    };
  }

  getRandomGenerationConfig(): GenerationConfig {
    return {
      amplitudeMultiplier: Math.random() * 3,
      numberOfIterations: Math.round(Math.random() * 15),
      noisemultiplier: Math.random() * 3,
    }
  }

  getRandomColorConfig(): ColorMaterialConfig {
    return {
      area: 1 + Math.random() * 10,
      color: new Vector3(Math.random(),Math.random(),Math.random()),
      offset: Math.random()*10 - 5,
      smoothness: 0.5 + Math.random(),
    }
  }
}