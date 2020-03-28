uniform vec3 diffuse;
varying vec3 vPos;
varying vec3 vNormal;

struct ColorConfig
{
  vec3 color;
  float area;
  float offset;
  float smoothness;
};

const int ColorConfigElements = 5;

uniform float time;
uniform vec3 pos;
uniform float size;
uniform ColorConfig colorConfig[ColorConfigElements];
uniform vec3 baseColor;


struct PointLight {
  vec3 position;
  vec3 color;
};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

void main() {

  float distanceFromCenter = length(vPos - pos);
  float diffFromNormal = distanceFromCenter - 2. * size;

  float normalisedDiff = diffFromNormal;
  
  vec3 color;

  vec3 addedLights = vec3(0.1, 0.1, 0.1);
  for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
    vec3 adjustedLight = pointLights[l].position + cameraPosition;
    vec3 lightDirection = normalize(vPos - adjustedLight);
    addedLights += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[l].color;
  }
  addedLights = clamp(addedLights, 0., 1.);

  if (normalisedDiff < -2.) {
      color = vec3(0.3, 0.3, 8);
  } else {


      /** How to calculate color

        We start with a curve, 1-x^2
        This has the highest value at 0 where the value is 1
        It's value is decreasing slowly on both sides
        If we set red to be this value it is red at x=0 and slowly decreasing on both sides. 
        By combining these values with colors we can get some smooth colors that change depending on x

        We use x = difference from a normal sphere with size = size. 

        Let's increase the complexity a bit and add more parameters

        area - (x - offset)^(2 * smoothness)

        area is default 1, the higher this value is the more values of x is 1 or more, basically more color
        offset is where this color is at it's peak, where it's value is the highest
        smoothness is how slow the value decays, <0.5, 10> is okay values. The lower, the more smooth are the ends

      */

      vec3 beachLevel = vec3(0.6, 0.6, 0.4);

      vec3 grassLevel = vec3(0, 0.7, 0);

      vec3 mountainLevel = vec3(0.4, 0.4, 0.4);

      vec3 topLevel = vec3(0.9, 0.9, 0.9);

      ColorConfig beach = ColorConfig(
        vec3(0.6, 0.6, 0.4),
        1.,
        -2.,
        0.4
      );
      ColorConfig grass = ColorConfig(
        vec3(0, 0.7, 0),
        1.3,
        -1.,
        1.
      );
      ColorConfig mountain = ColorConfig(
        vec3(0.4, 0.4, 0.4),
        1.6,
        0.,
        1.
      );
      ColorConfig top = ColorConfig(
        vec3(0.9, 0.9, 0.9),
        7.6,
        3.5,
        1.
      );


      color = 
        clamp(beach.color * clamp(beach.area - pow(normalisedDiff - beach.offset, 2. * beach.smoothness), 0., 1.), 0., 1.) + 
        clamp(grass.color * clamp(grass.area - pow(normalisedDiff - grass.offset, 2. * grass.smoothness), 0., 1.), 0., 1.) +
        clamp(mountain.color * clamp(mountain.area - pow(normalisedDiff - mountain.offset, 2. * mountain.smoothness), 0., 1.), 0., 1.) +
        clamp(top.color * clamp(top.area - pow(normalisedDiff - top.offset, 2. * top.smoothness), 0., 1.), 0., 1.);

      color = vec3(baseColor) * 0.3;
      for(int i = 0; i < ColorConfigElements; i++) {
        color += 
          clamp(colorConfig[i].color * clamp(colorConfig[i].area - pow(normalisedDiff - colorConfig[i].offset, 2. * colorConfig[i].smoothness), 0., 1.), 0., 1.);
      }

    /*
      color = // Color * max(0, -pow(( y + heightPos) * howWide, 2) + 1)
          
          beachLevel * clamp( pow((normalisedDiff + 5.5)*2., 2.), 0., 1. ) +
          
          grassLevel * clamp( pow((normalisedDiff + 5.5)*2., 2.), 0., 1. ) +

          mountainLevel * clamp( pow((normalisedDiff + 5.5)*2., 2.), 0., 1. );
*/
      // * restColor, // Lighter the higher up you are

//        color = vec4((vec3(restColor, 0.7, restColor) + vec3(restColor, restColor, restColor) * (+pos.y + 4.5) ) / 2, 1);
  }

  gl_FragColor = vec4( clamp(color * addedLights, 0., 1.), 1.0 );

}
