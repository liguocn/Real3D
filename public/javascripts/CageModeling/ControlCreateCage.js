/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.CageModeling.CreateCageControl = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    transformMode: null,
    isMouseDown: null,
    mouseMovePos: null
};

REAL3D.CageModeling.CreateCageControl.init = function (canvasOffset, winW, winH) {
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

REAL3D.CageModeling.CreateCageControl.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = true;
    this.mouseMovePos.set(curPosX, curPosY);
};

REAL3D.CageModeling.CreateCageControl.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY;
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.transformMode === REAL3D.CageModeling.TransformMode.TRANSLATE) {
            this.translateCamera(curPosX, curPosY);
        } else if (this.transformMode === REAL3D.CageModeling.TransformMode.ROTATE) {
            this.rotateScene(curPosX, curPosY);
        } else if (this.transformMode === REAL3D.CageModeling.TransformMode.SCALE) {
            this.zoomCamera(curPosX, curPosY);
        }
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.CageModeling.CreateCageControl.mouseUp = function (e) {
    "use strict";
    this.isMouseDown = false;
};

REAL3D.CageModeling.CreateCageControl.switchTransformMode = function (transformMode) {
    "use strict";
    this.transformMode = transformMode;
};

REAL3D.CageModeling.CreateCageControl.translateCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateX(worldDifX);
    this.camera.translateY(worldDifY);
};

REAL3D.CageModeling.CreateCageControl.rotateScene = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    REAL3D.RenderManager.scene.rotateYGlobal(worldDifX * -0.003);
    REAL3D.RenderManager.scene.rotateXGlobal(worldDifY * 0.003);
};

REAL3D.CageModeling.CreateCageControl.zoomCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifY;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateZ(worldDifY * 5);
};

REAL3D.CageModeling.CreateCageControl.resetView = function () {
    "use strict";
    this.camera.position.set(0, 0, 1000);
    REAL3D.RenderManager.scene.setRotationFromMatrix(new THREE.Matrix4());
};
