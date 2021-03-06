REAL3D.Inspector.ShaderChunk = {
};

REAL3D.Inspector.ShaderChunk['vertex'] = [
    "void main() {",
    "   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
].join('\n');

REAL3D.Inspector.ShaderChunk['fragment'] = [
    "void main() {",
    "   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
    "}"
].join('\n');

REAL3D.Inspector.ShaderChunk['cartoon_v'] = [
    "uniform vec3 lightPos; ",
    "varying float intensity; ",
    "",
    "void main() ",
    "{ ",
    "    vec3 lightDir = normalize(vec3(lightPos));", 
    "    intensity = dot(lightDir, normal); ",
    "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "} "
].join('\n');

REAL3D.Inspector.ShaderChunk['cartoon_f'] = [
    "varying float intensity; ",
    "",
    "void main() ",
    "{ ",
    "    vec4 color; ",
    "    if (intensity > 0.95) ",
    "        color = vec4(1.0, 0.5, 0.5, 1.0); ",
    "    else if (intensity > 0.5) ",
    "        color = vec4(0.6, 0.3, 0.3, 1.0); ",
    "    else if (intensity > 0.25) ",
    "        color = vec4(0.4, 0.2, 0.2, 1.0); ",
    "    else ",
    "        color = vec4(0.2, 0.1, 0.1, 1.0); ",
    "    gl_FragColor = color;",
    "}",
].join('\n');

REAL3D.Inspector.ShaderChunk['blinnPhong_v'] = [
    "uniform vec3 lightPos;",
    "varying vec3 normalInterp;",
    "varying vec3 vertPos;",
    "",
    "void main()",
    "{",
    "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "    vec4 vertPos4 = modelViewMatrix * vec4( position, 1.0 );",
    "    vertPos = vec3(vertPos4) / vertPos4.w;",
    "    normalInterp = normalMatrix * normal;",
    "}"
].join('\n');

REAL3D.Inspector.ShaderChunk['blinnPhong_f'] = [
    "uniform vec3 lightPos;",
    "varying vec3 normalInterp;",
    "varying vec3 vertPos;",
    "",
    "uniform vec3 ambientColor;",
    "uniform vec3 diffuseColor;",
    "uniform vec3 specColor;",
    "uniform float specular;",
    "uniform int mode;",
    "",
    "void main()",
    "{",
    "    vec3 normal = normalize(normalInterp);",
    "    vec3 lightDir = normalize(lightPos - vertPos);",
    "",
    "    float lambertian = max(dot(lightDir, normal), 0.0);",
    "    float specularF = 0.0;",
    "    if (lambertian > 0.0)",
    "    {",
    "        vec3 viewDir = normalize(-vertPos);",
    "        vec3 halfDir = normalize(lightDir + viewDir);",
    "        float specAngle = max(dot(halfDir, normal), 0.0);",
    "        specularF = pow(specAngle, specular);",
    "        // phong material",
    "        if (mode == 2)  {",
    "           vec3 reflectDir = reflect(-lightDir, normal);",
    "           specAngle = max(dot(reflectDir, viewDir), 0.0);",
    "           specularF = pow(specAngle, specular);",
    "        }",
    "    }",
    "    gl_FragColor = vec4(ambientColor + lambertian * diffuseColor + specularF * specColor, 1.0);",
    "}"
].join('\n');

REAL3D.Inspector.ShaderChunk['cookTorrance_v'] = REAL3D.Inspector.ShaderChunk['blinnPhong_v'];

REAL3D.Inspector.ShaderChunk['cookTorrance_f'] = [
    "varying vec3 vertPos;",
    "varying vec3 normalInterp;",
    "",
    "uniform float roughness;",
    "uniform vec3 lightPos;",
    "",
    "uniform vec3 ambientColor;",
    "uniform vec3 diffuseColor;",
    "uniform vec3 specColor;",
    "uniform float lambda;",

    "const float thepi = 3.14159265;",
    "",
    "void main()",
    "{",
    "    vec3 viewDir = normalize(-vertPos);",
    "    vec3 lightDir = normalize(lightPos - vertPos);",
    "    vec3 normal = normalize(normalInterp);",
    "    vec3 halfDir = normalize(viewDir + lightDir);",
    "    float cosNH = dot(normal, halfDir);",
    "    float cosNH2 = cosNH * cosNH;",
    "    float m2 =  roughness * roughness;",
    "",
    "    float D = exp((cosNH2-1.0)/cosNH2/m2)/thepi/m2/cosNH2/cosNH2;",
    "",
    "    float VH = dot(viewDir, halfDir);",
    "    float F = pow((1.0 + VH), lambda);",
    "",
    "    float HN = dot(halfDir, normal);",
    "    float VN = dot(viewDir, normal);",
    "    float LN = dot(lightDir, normal);",
    "    float G = min(HN*VN/VH, HN*LN/VH);",
    "    G = min(1.0, G*2.0);",
    "",
    "    float specularF = D * F * G / 4.0 / VN / LN;",
    "    float lambertian = max(LN, 0.0);",
    "",
    "    gl_FragColor = vec4(ambientColor + lambertian * diffuseColor + specularF * specColor, 1.0);",
    "}",
].join('\n');