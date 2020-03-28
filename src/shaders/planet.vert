varying vec3 vPos; 
varying vec3 vNormal; 

void main() {
  vPos = position;
  vNormal = normal;

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
