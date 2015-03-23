/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.CageModeling.HomeControl = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null
};

REAL3D.CageModeling.HomeControl.init = function (canvasOffset, winW, winH) {
    "use strict";
    console.log("HomeControl init");
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 2000);
        this.camera.position.set(0, 0, 100);
        this.camera.rotateX(1.570796326794897);
        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
    }
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.CageModeling.HomeControl.mouseDown = function (e) {
    "use strict";
    //console.log("FreeWalkView mouseDown");
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
};

REAL3D.CageModeling.HomeControl.mouseMove = function (e) {
    "use strict";
    //console.log("FreeWalkView mouseMove");
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
};

REAL3D.CageModeling.HomeControl.mouseUp = function (e) {
    "use strict";
    //console.log("FreeWalkView mouseUp");
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
};
