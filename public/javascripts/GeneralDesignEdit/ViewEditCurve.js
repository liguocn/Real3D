/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.GeneralDesignEdit.EditCurveView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null
};

REAL3D.GeneralDesignEdit.EditCurveView.init = function (canvasOffset, winW, winH) {
    "use strict";
    console.log("EditCurveView init");
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 2000);
        this.camera.position.set(0, 0, 1000);

        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
    }
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.GeneralDesignEdit.EditCurveView.update = function (timestamp) {
    "use strict";
};

REAL3D.GeneralDesignEdit.EditCurveView.mouseDown = function (e) {
    "use strict";
};

REAL3D.GeneralDesignEdit.EditCurveView.mouseMove = function (e) {
    "use strict";
};

REAL3D.GeneralDesignEdit.EditCurveView.mouseUp = function (e) {
    "use strict";
};
