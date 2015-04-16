uniform vec3 lightPos;
varying vec3 normalInterp;
varying vec3 vertPos;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specColor;
uniform float specular;
uniform int mode;

void main()
{
    vec3 normal = normalize(normalInterp);
    vec3 lightDir = normalize(lightPos - vertPos);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specularF = 0.0;
    if (lambertian > 0.0)
    {
        vec3 viewDir = normalize(-vertPos);
        vec3 halfDir = normalize(lightDir + viewDir);
        float specAngle = max(dot(halfDir, normal), 0.0);
        specularF = pow(specAngle, specular);

        // phong material
        if (mode == 2)  {
            vec3 reflectDir = reflect(-lightDir, normal);
            specAngle = max(dot(reflectDir, viewDir), 0.0);
            specularF = pow(specAngle, specular);
        }
    }
    gl_FragColor = vec4(ambientColor + lambertian * diffuseColor + specularF * specColor, 1.0);
}