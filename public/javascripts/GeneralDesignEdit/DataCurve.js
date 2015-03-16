/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.GeneralDesignEdit.CurveData = {
    drawObject: null
};

REAL3D.GeneralDesignEdit.CurveData.init = function (curveData) {
    "use strict";
    this.releaseData();
    //init data
    if (curveData !== null) {
    }
    //
    this.draw();
};

REAL3D.GeneralDesignEdit.CurveData.draw = function () {
    "use strict";
    this.releaseDraw();
    this.drawObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.drawObject);
    //draw
};

REAL3D.GeneralDesignEdit.CurveData.hideDraw = function () {
    "use strict";
    //publish hide message
};

REAL3D.GeneralDesignEdit.CurveData.releaseDraw = function () {
    "use strict";
    //publish remove message

    if (this.drawObject !== null) {
        REAL3D.RenderManager.scene.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.GeneralDesignEdit.CurveData.loadData = function () {
    "use strict";
};

REAL3D.GeneralDesignEdit.CurveData.releaseData = function () {
    "use strict";
    this.releaseDraw();
    this.drawObject = null;
};

REAL3D.GeneralDesignEdit.CurveData.saveData = function () {
    "use strict";
};
