/*global REAL3D */

REAL3D.Inspector.MaterialDataType = {
    Undefined: 0,
    MeshThreeMaterial: 1,
    MeshShaderMaterial: 2
};

REAL3D.Inspector.MaterialData = {
    name: '',
    type: 0,
    textureMap: null,
    vertexShader: [],
    fragmentShader: [],
    materialThree: null
};

REAL3D.Inspector.VertexShader = {
    src: ''
};

REAL3D.Inspector.FragmentShader = {
    src: ''
};

REAL3D.Inspector.MaterialDataManager = {
    materials: []
};

REAL3D.Inspector.MaterialData = function (name, threeMaterial) {
    "use strict";
    this.name = name;
    if (threeMaterial === undefined || threeMaterial === null)
        return;
    if (typeof threeMaterial === "object") {
        if ( threeMaterial.type === "MeshBasicMaterial" || threeMaterial.type === "MeshLambertMaterial" 
            || threeMaterial.type === "MeshDepthMaterial" || threeMaterial.type === "MeshNormalMaterial" ) {
            this.type = REAL3D.Inspector.MaterialDataType.MeshThreeMaterial;
            this.materialThree = threeMaterial;
        }
        else if ( threeMaterial.type === THREE.ShaderMaterial ) {
            this.type = REAL3D.Inspector.MaterialDataType.MeshShaderMaterial;
            this.materialThree = threeMaterial;
        }
        else {
            this.type = REAL3D.Inspector.MaterialDataType.Undefined;
            this.materialThree = null;
        }
    }
    else {
        this.type = REAL3D.Inspector.MaterialDataType.Undefined;
        this.materialThree = null;
    }
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
        new THREE.MeshBasicMaterial( { color: 0xff0000, blending: THREE.AdditiveBlending} ),
        new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: 0.5} ),
        new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading, overdraw: 0.5 } ),
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
    var ii;
    for (ii in this.materials) {
        if (this.materials[ii].name == materialName) {
            return this.materials[ii].materialThree;
        }
    }
};
