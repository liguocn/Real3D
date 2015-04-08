/*global REAL3D */

REAL3D.Inspector.MaterialDataType = {
    Undefined: "Undefined",
    MaterialLambert: "MaterialLambert",
    MaterialNormal:  "MaterialNormal",
    MaterialDepth:   "MaterialDept", 
    MaterialBasic:   "MaterialBasic",
    MaterialPhong:   "MaterialPhong",
    MaterialShader:  "MaterialShader",
    MaterialFace:    "MaterialFace"
};

REAL3D.Inspector.MaterialData = {
    name: '',
    type: "Undefined",
    materialParams: null,
    materialParamsExt: null,
    //textureMap: null,
    //vertexShader: '',
    //fragmentShader: '',
    materialThree: null
};

REAL3D.Inspector.MaterialParams = {
    color: 0,
    opacity: 0,
    transparent: false,
    overdraw: 0.0,
    visible: true,
    side: 0,
    needsUpdate: false,

    wireframe: false,
    blending: 0,
    blendsrc: null,
    blenddst: null,
    blendingequation: null,

    depthTest: false,
    alphaTest: 0,
    shading: 0,
    vertexShader: null,
    fragmentShader: null
};

REAL3D.Inspector.MaterialParamsExt = {
    emissive: 0,
    specular: 0,
    shininess: 30,
    fog: false,
    fragmentShaderUrl: '',
    vertexShaderUrl: '',
    fragmentShader: null,
    vertexShader: null
};

REAL3D.Inspector.VertexShader = {
    src: ''
};

REAL3D.Inspector.FragmentShader = {
    src: ''
};

REAL3D.Inspector.MaterialDataManager = {
    materials: [],
    currentName: ''
};

REAL3D.Inspector.MaterialData = function (name, materialData) {
    "use strict";
    this.name = name;
    if (materialData === undefined || materialData === null)
        return;

    if (materialData instanceof THREE.MeshBasicMaterial) {
        this.type = REAL3D.Inspector.MaterialDataType.MaterialBasic;
        this.materialThree = materialData;
    } else if (materialData instanceof THREE.MeshLambertMaterial) {
        this.type = REAL3D.Inspector.MaterialDataType.MaterialLambert;
        this.materialThree = materialData;
    } else if (materialData instanceof THREE.MeshDepthMaterial) {
        this.type = REAL3D.Inspector.MaterialDataType.MaterialDepth;
        this.materialThree = materialData;
    } else if (materialData instanceof THREE.MeshNormalMaterial) {
        this.type = REAL3D.Inspector.MaterialDataType.MaterialNormal;
        this.materialThree = materialData;
    } else if (materialData instanceof THREE.MeshPhongMaterial) {
        this.type = REAL3D.Inspector.MaterialDataType.MaterialPhong;
        this.materialThree = materialData;
    } else if (materialData instanceof THREE.ShaderMaterial) {
        this.type = REAL3D.Inspector.MaterialDataType.MaterialShader;
        this.materialThree = materialData;
    } else if (materialData instanceof REAL3D.Inspector.MaterialParams) {
        this.initFromMaterialParam(name, materialData);
    } else {
        this.type = REAL3D.Inspector.MaterialDataType.Undefined;
        this.materialThree = null;
    }
};

REAL3D.Inspector.MaterialData.prototype.parseThreeToMaterialParams = function () {
    "use strict";
};

REAL3D.Inspector.MaterialData.prototype.initFromMaterialParam = function(name, materialParams) {
    "use strict";
    this.name = name;
};

REAL3D.Inspector.MaterialData.prototype.init = function () {
    "use strict";
};

REAL3D.Inspector.MaterialData.prototype.updateShaders = function (vertexShader, fragmentShader) {
    "use strict";
};

REAL3D.Inspector.MaterialDataManager.init = function () {
    "use strict";
    var materials, materialNames, uniforms, vertShader, fragShader, ii;
    uniforms = {
        time: { type: "f", value: 1.0},
        resolution: { type: "v2", value: new THREE.Vector2() }
    };

    vertShader = {
        src: 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}'
    };

    fragShader = {
        src: 'void main() {gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);}'
    };

    materials = [
        new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, side: THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( { color: 0xff0000, blending: THREE.AdditiveBlending } ),
        new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } ),
        new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ),
        new THREE.MeshPhongMaterial( { color: 0xffffff } ),
        new THREE.MeshDepthMaterial( { overdraw: 0.5 } ),
        new THREE.MeshNormalMaterial( { overdraw: 0.5 } ),
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('../images/logo.jpg') } ),
        new THREE.MeshBasicMaterial( { envMap: THREE.ImageUtils.loadTexture('../images/FurnitureDesign.jpg', THREE.ShpericalReflectionMapping), overdraw: 0.5} )
    ];

    materialNames = [
        'MeshBasicMaterial1',
        'MeshBasicMaterial2',
        'MeshLambertMaterial1',
        'MeshLambertMaterial2',
        'MeshPhongMaterial',
        'MeshDepthMaterial',
        'MeshNormalMaterial',
        'MeshMaterialWithTexture',
        'MeshMaterialWithEnvTexture'
    ];

    for (ii = 0; ii < materials.length; ++ii) {
        this.addMaterial(new REAL3D.Inspector.MaterialData(materialNames[ii], materials[ii]));
    }

    var shaderMaterialThree = new THREE.ShaderMaterial({uniforms: {}, attributes: {}, vertexShader: vertShader.src, fragmentShader: fragShader.src, transparent: true});
    this.addMaterial(new REAL3D.Inspector.MaterialData("MaterialShader", shaderMaterialThree));

    //this.currentName = materialNames[4];
    this.currentName = "MaterialShader";
};

REAL3D.Inspector.MaterialDataManager.addMaterial = function (materialData) {
    "use strict";
    this.materials.push(materialData);
};

REAL3D.Inspector.MaterialDataManager.removeMaterial = function (materialData) {
    "use strict";
    var iFind = this.materials.indexOf(materialData);
    if (iFind >= 0) {
        this.materials.splice(iFind, 1);
    }
};

REAL3D.Inspector.MaterialDataManager.getCurrentMaterialName = function () {
    "use strict";
    return this.currentName;
}

REAL3D.Inspector.MaterialDataManager.setCurrentMaterialName = function (materialName) {
    "use strict";
    this.currentName = materialName;
}

REAL3D.Inspector.MaterialDataManager.getMaterial = function (materialName) {
    "use strict";
    var ii, queryName;
    if ((materialName === '' || materialName === undefined) 
        && this.currentName !== '' && this.currentName !== null) {
        queryName = this.currentName;
    } else {
        queryName = materialName;
    }

    for (ii in this.materials) {
        if (this.materials[ii].name == queryName) {
            this.currentName = queryName;
            return this.materials[ii].materialThree;
        }
    }
    return null;
};

REAL3D.Inspector.MaterialDataManager.getAllMaterials = function () {
    "use strict";
    var materials= [], ii, oneMaterial;
    for (ii in this.materials) {
        oneMaterial = {
            name: this.materials[ii].name,
            type: this.materials[ii].materialThree.type,
            isCurrent: this.materials[ii].name === this.currentName
        };
        materials.push(oneMaterial);
    }
    return materials;
}