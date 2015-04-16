uniform vec3 lightPos; 
varying float intensity; 

void main() 
{ 
    vec3 lightDir = normalize(vec3(lightPos)); 
    intensity = dot(lightDir, normal); 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}