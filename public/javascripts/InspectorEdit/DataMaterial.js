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
    //textureMap: null,
    //vertexShader: '',
    //fragmentShader: '',
    materialThree: null
};

REAL3D.Inspector.MaterialParams = {
    color: 0,
    wireframe: false,
    side: 0,
    blending: 0,
    shading: 0,
    overdraw: 0.0,
    vertexShader: null,
    fragmentShader: null
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
    var materials, materialNames, uniforms, vertexShader, fragmentShader, ii;
    uniforms = {
        time: { type: "f", value: 1.0},
        resolution: { type: "v2", value: new THREE.Vector2() }
    };

    vertexShader = {
        src: 'void main() { gl_Position = vec4(position, 1.0); }'
    };

    fragmentShader = {
        src: ''
    };

    materials = [
        new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, side: THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( { color: 0xff0000, blending: THREE.AdditiveBlending } ),
        new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } ),
        new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ),
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
        'MeshDepthMaterial',
        'MeshNormalMaterial',
        'MeshMaterialWithTexture',
        'MeshMaterialWithEnvTexture'
    ];

    for (ii = 0; ii < materials.length; ++ii) {
        this.addMaterial(new REAL3D.Inspector.MaterialData(materialNames[ii], materials[ii]));
    }

    this.currentName = materialNames[2];
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