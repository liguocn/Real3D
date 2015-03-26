/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.CageModeling.EditCageControl = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    viewMode: null,
    editMode: null,
    isMouseDown: null,
    mouseMovePos: null,
    mouseState: null
};

REAL3D.CageModeling.EditCageControl.init = function (canvasOffset, winW, winH) {
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
    this.mouseState = REAL3D.CageModeling.MouseState.NONE;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.CageModeling.EditCageControl.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = true;
    this.mouseMovePos.set(curPosX, curPosY);
    this.hitDetection(curPosX, curPosY);
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITCANVAS) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.VERTEX) {

    }
};

REAL3D.CageModeling.EditCageControl.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY;
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.mouseState === REAL3D.CageModeling.MouseState.HITCANVAS) {
            if (this.viewMode === REAL3D.CageModeling.ViewMode.TRANSLATE) {
                this.translateCamera(curPosX, curPosY);
            } else if (this.viewMode === REAL3D.CageModeling.ViewMode.ROTATE) {
                this.rotateScene(curPosX, curPosY);
            } else if (this.viewMode === REAL3D.CageModeling.ViewMode.SCALE) {
                this.zoomCamera(curPosX, curPosY);
            }
        } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {

        } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {

        } else if (this.mouseState === REAL3D.CageModeling.MouseState.VERTEX) {

        }
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.CageModeling.EditCageControl.mouseUp = function (e) {
    "use strict";
    this.isMouseDown = false;
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITCANVAS) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.VERTEX) {

    }
};

REAL3D.CageModeling.EditCageControl.keyPress = function (e) {
    "use strict";
    if (e.which === 116 || e.which === 84) {
        this.switchViewMode(REAL3D.CageModeling.ViewMode.TRANSLATE);
    } else if (e.which === 114 || e.which === 82) {
        this.switchViewMode(REAL3D.CageModeling.ViewMode.ROTATE);
    } else if (e.which === 115 || e.which === 83) {
        this.switchViewMode(REAL3D.CageModeling.ViewMode.SCALE);
    } else if (e.which === 110 || e.which === 78) {
        this.resetView();
    }
};

REAL3D.CageModeling.EditCageControl.switchViewMode = function (viewMode) {
    "use strict";
    this.viewMode = viewMode;
};

REAL3D.CageModeling.EditCageControl.translateCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateX(worldDifX);
    this.camera.translateY(worldDifY);
};

REAL3D.CageModeling.EditCageControl.rotateScene = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    REAL3D.RenderManager.scene.rotateYGlobal(worldDifX * -0.003);
    REAL3D.RenderManager.scene.rotateXGlobal(worldDifY * 0.003);
};

REAL3D.CageModeling.EditCageControl.zoomCamera = function (mousePosX, mousePosY) {
    "use strict";
    var worldDifY;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.camera.translateZ(worldDifY * 2);
};

REAL3D.CageModeling.EditCageControl.resetView = function () {
    "use strict";
    this.camera.position.set(0, 0, 1000);
    REAL3D.RenderManager.scene.setRotationFromMatrix(new THREE.Matrix4());
};

REAL3D.CageModeling.EditCageControl.switchEditMode = function (editMode) {
    "use strict";
    this.editMode = editMode;
};

REAL3D.CageModeling.EditCageControl.hitDetection = function (mousePosX, mousePosY) {
    "use strict";
    if (REAL3D.CageModeling.CageData.pickVertex(mousePosX, mousePosY)) {
        this.mouseState = REAL3D.CageModeling.MouseState.HITVERTEX;
    } else if (REAL3D.CageModeling.CageData.pickEdge(mousePosX, mousePosY)) {
        this.mouseState = REAL3D.CageModeling.MouseState.HITEDGE;
    } else if (REAL3D.CageModeling.CageData.pickFace(mousePosX, mousePosY)) {
        this.mouseState = REAL3D.CageModeling.MouseState.HITFACE;
    } else {
        this.mouseState = REAL3D.CageModeling.MouseState.HITCANVAS;
    }
};
