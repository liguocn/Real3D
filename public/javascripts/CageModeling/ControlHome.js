/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.CageModeling.HomeControl = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    viewMode: null,
    isMouseDown: null,
    mouseMovePos: null
};

REAL3D.CageModeling.HomeControl.init = function (canvasOffset, winW, winH) {
    "use strict";
    console.log("HomeControl init");
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 10000);
        this.camera.position.set(0, 0, 1000);

        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
    }
    this.isMouseDown = false;
    this.mouseMovePos = new THREE.Vector2(0, 0);
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.CageModeling.HomeControl.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = true;
    this.mouseMovePos.set(curPosX, curPosY);
};

REAL3D.CageModeling.HomeControl.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY;
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.viewMode === REAL3D.CageModeling.ViewMode.TRANSLATE) {
            this.translateCamera(curPosX, curPosY);
        } else if (this.viewMode === REAL3D.CageModeling.ViewMode.ROTATE) {
            this.rotateScene(curPosX, curPosY);
        } else if (this.viewMode === REAL3D.CageModeling.ViewMode.SCALE) {
            this.zoomCamera(curPosX, curPosY);
        }
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.CageModeling.HomeControl.mouseUp = function (e) {
    "use strict";
    this.isMouseDown = false;
};

REAL3D.CageModeling.HomeControl.switchTransformMode = function (viewMode) {
    "use strict";
    this.viewMode = viewMode;
};

REAL3D.CageModeling.HomeControl.translateCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateX(worldDifX);
    this.camera.translateY(worldDifY);
};

REAL3D.CageModeling.HomeControl.rotateScene = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    REAL3D.RenderManager.scene.rotateYGlobal(worldDifX * -0.003);
    REAL3D.RenderManager.scene.rotateXGlobal(worldDifY * 0.003);
};

REAL3D.CageModeling.HomeControl.zoomCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifY;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateZ(worldDifY * 5);
};

REAL3D.CageModeling.HomeControl.resetView = function () {
    "use strict";
    this.camera.position.set(0, 0, 1000);
    REAL3D.RenderManager.scene.setRotationFromMatrix(new THREE.Matrix4());
};
