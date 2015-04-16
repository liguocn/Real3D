/*global REAL3D, THREE, window*/

REAL3D.InspectorEdit.StateMaterial = {
    light: null,
    materials: null,
    currentMaterial: [],
    materialSphere: null
};

REAL3D.InspectorEdit.StateMaterial.enter = function () {
    "use strict";
    console.log("enter StateMaterial");
    REAL3D.InspectorEdit.EditMaterialUI.enter();
    REAL3D.InspectorEdit.switchControlState(REAL3D.InspectorEdit.InspectorView);

    // setup light
    this.setupLight();

    // setup material
    this.setupMaterials();

    this.createMaterialSphere();
};

REAL3D.InspectorEdit.StateMaterial.exit = function () {
    "use strict";
    console.log("exit StateMaterial");
    this.releaseLight();
};

REAL3D.InspectorEdit.StateMaterial.setupLight = function () {
    "use strict";
    this.releaseLight();
    REAL3D.Inspector.LightDataManager.init();
    REAL3D.Inspector.LightDataManager.addAllToScene(REAL3D.RenderManager.scene);
};

REAL3D.InspectorEdit.StateMaterial.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};

REAL3D.InspectorEdit.StateMaterial.setupMaterials = function () {
    "use strict";
    REAL3D.Inspector.MaterialDataManager.init();
};

REAL3D.InspectorEdit.StateMaterial.releaseMaterialSphere = function () {
    "use strict";
    if (this.materialSphere !== null)
    {
        REAL3D.RenderManager.scene.remove(this.materialSphere);
        this.materialSphere = null;
    }
};

REAL3D.InspectorEdit.StateMaterial.createMaterialSphere = function () {
    "use strict";
    this.releaseMaterialSphere();
    var geometry, material, radius, winW, winH;
    winW = REAL3D.InspectorEdit.winW;
    winH = REAL3D.InspectorEdit.winH;
    radius = winW > winH ? winH/3.0 : winW/3.0;
    //geometry = new THREE.SphereGeometry(radius, 32, 32);
    geometry = new THREE.TorusKnotGeometry( radius/3*2, 30, 100, 16 );
    //material = new THREE.MeshPhongMaterial({color:0xffff00, wireframe:false});
    //material = new THREE.LineBasicMaterial({color: 0x00FFFF});
    material = REAL3D.Inspector.MaterialDataManager.getMaterial();
    this.materialSphere = new THREE.Mesh(geometry);
    this.materialSphere.material = material;
    //this.materialSphere.material = REAL3D.Inspector.MaterialDataManager.getMaterial("MeshMaterialWithTexture");
    REAL3D.RenderManager.scene.add(this.materialSphere);
};

REAL3D.InspectorEdit.StateMaterial.switchMaterial = function (newMaterialName) {
    if (newMaterialName === undefined || newMaterialName === null)
        return ;
    var newMaterial = REAL3D.Inspector.MaterialDataManager.getMaterial(newMaterialName);
    if (newMaterial !== null) {
        this.materialSphere.material = newMaterial;
        this.materialSphere.material.needsUpdate = true;
        this.materialSphere.geometry.verticesNeedUpdate = true;
        this.materialSphere.geometry.normalNeedUpdate = true;
        this.materialSphere.geometry.colorsNeedUpdate = true;
    }
    else
        console.log("The material does not exist: " + newMaterialName);
};