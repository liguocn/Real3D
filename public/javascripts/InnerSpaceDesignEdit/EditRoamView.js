/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.InnerSpaceDesignEdit.EditRoamView = {
    mouseState: null,
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null
};

REAL3D.InnerSpaceDesignEdit.EditRoamView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.OrthographicCamera(winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 2000);
        this.camera.position.set(0, 0, 1000);
        //first time init
        this.mouseState = REAL3D.InnerSpaceDesignEdit.MouseState.NONE;
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
    }
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.EditRoamView.update = function (timestamp) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamView.mouseDown = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamView.mouseMove = function (e) {
    "use strict";
};

REAL3D.InnerSpaceDesignEdit.EditRoamView.mouseUp = function (e) {
    "use strict";
};

