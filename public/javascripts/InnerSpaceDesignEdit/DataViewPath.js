/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.InnerSpaceDesignEdit.ViewPathData = {
    userPointTree: null,
    pathTree: null,
    drawObject: null
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.init = function (viewPathData) {
    "use strict";
    this.releaseData();
    this.userPointTree = new REAL3D.CommonModel.UserPointTree();
    this.pathTree = new REAL3D.ViewPath.PathTree();
    if (viewPathData !== null) {
        this.userPointTree = viewPathData.userPointTree;
    }
    this.draw();
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.draw = function () {
    "use strict";
    this.releaseDraw();
    this.drawObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.drawObject);
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.updateDraw = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.releaseDraw = function () {
    "use strict";
    if (this.drawObject !== null) {
        REAL3D.RenderManager.scene.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.loadData = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.releaseData = function () {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.ViewPathData.saveData = function () {
    "use strict";
};
