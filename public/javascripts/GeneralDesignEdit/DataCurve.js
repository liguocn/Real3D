/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.GeneralDesignEdit.CurveData = {
    userPointTree: null,
    smoothValues: null,
    curveTree: null,
    subdCurveTree: null,
    drawObject: null,
    subdTime: null
};

REAL3D.GeneralDesignEdit.CurveData.init = function (curveData) {
    "use strict";
    this.releaseData();
    this.subdTime = 5;
    //init data
    if (curveData !== null) {
    } else {
        this.userPointTree = new REAL3D.CommonModel.UserPointTree();
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
    this.curveTree = REAL3D.CurveModel.constructCurveTree(this.userPointTree, this.smoothValues, this.drawObject, this.drawObject);
    this.subdCurveTree = REAL3D.CurveModel.subdivideCurveTree(this.curveTree, this.subdTime, null, this.drawObject);
};

REAL3D.GeneralDesignEdit.CurveData.hideDraw = function () {
    "use strict";
    //publish hide message
    if (this.curveTree !== null) {
        this.curveTree.publish("hideDraw");
    }
    if (this.subdCurveTree !== null) {
        this.subdCurveTree.publish("hideDraw");
    }
};

REAL3D.GeneralDesignEdit.CurveData.releaseDraw = function () {
    "use strict";
    //publish remove message
    if (this.curveTree !== null) {
        this.curveTree.publish("remove");
        this.curveTree = new REAL3D.CurveModel.CurveTree();
    }
    if (this.subdCurveTree !== null) {
        this.subdCurveTree.publish("remove");
        this.subdCurveTree = null;
    }
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
    this.userPointTree = null;
    this.smoothValues = null;
    this.curveTree = null;
    this.subdCurveTree = null;
    this.drawObject = null;
    this.subdTime = null;
};

REAL3D.GeneralDesignEdit.CurveData.saveData = function () {
    "use strict";
};

REAL3D.GeneralDesignEdit.CurveData.selectUserPoint = function (worldPosX, worldPosY) {
    "use strict";
};

REAL3D.GeneralDesignEdit.CurveData.connectUserPoint = function (index1, index2) {
    "use strict";
};

REAL3D.GeneralDesignEdit.CurveData.createUserPoint = function (worldPosX, worldPosY, smoothValue) {
    "use strict";
};

REAL3D.GeneralDesignEdit.CurveData.dragUserPoint = function (index, worldPosX, worldPosY) {
    "use strict";
};

REAL3D.GeneralDesignEdit.CurveData.removeUserPoint = function (index) {
    "use strict";
};
