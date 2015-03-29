REAL3D.InspectorEdit.StateMaterial = {
    light: null,
    refObject: null
};

REAL3D.InspectorEdit.StateMaterial.enter = function () {
    "use strict";
    console.log("enter StateMaterial");
    REAL3D.InspectorEdit.switchControlState(REAL3D.InspectorEdit.InspectorView);

    // setup light
    this.setupLight();
};

REAL3D.InspectorEdit.StateMaterial.exit = function () {
    "use strict";
    console.log("exit StateMaterial");
    this.releaseLight();
};

REAL3D.InspectorEdit.StateMaterial.setupLight = function () {
    "use strict";
    this.releaseLight();
    this.light = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.light);
    var ambientLight = new THREE.AmbientLight(0x2b2b2b);
    this.light.add(ambientLight);
};

REAL3D.InspectorEdit.StateMaterial.releaseLight = function () {
    "use strict";
    if (this.light !== null) {
        REAL3D.RenderManager.scene.remove(this.light);
        this.light = null;
    }
};
