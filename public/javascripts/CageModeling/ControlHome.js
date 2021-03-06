/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.CageModeling.HomeControl = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    viewMode: null,
    isMouseDown: null,
    mouseMovePos: null,
    refFrame: null
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
    // if (this.refFrame === null) {
    //     this.refFrame = new REAL3D.TransformTool.RefFrame();
    //     this.refFrame.init(new REAL3D.Vector3(0, 0, 0), new REAL3D.Vector3(0, 1, 0), new REAL3D.Vector3(1, 0, 0), 200, REAL3D.RenderManager.scene);
    // }
    this.isMouseDown = false;
    this.mouseMovePos = new THREE.Vector2(0, 0);
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.CageModeling.HomeControl.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY, mouseNormPosX, mouseNormPosY, projectMatrix, cameraMatrix, cameraProjectMatrix;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    mouseNormPosX = curPosX * 2 / this.winW - 1;
    mouseNormPosY = 1 - curPosY * 2 / this.winH;
    this.isMouseDown = true;
    if (this.refFrame !== null) {
        projectMatrix = this.camera.projectionMatrix;
        cameraMatrix = this.camera.matrixWorld;
        cameraProjectMatrix = new THREE.Matrix4();
        cameraProjectMatrix.multiplyMatrices(projectMatrix, cameraProjectMatrix.getInverse(cameraMatrix));
        this.refFrame.mouseDown(mouseNormPosX, mouseNormPosY, cameraProjectMatrix);
    }
    this.mouseMovePos.set(curPosX, curPosY);
};

REAL3D.CageModeling.HomeControl.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY, worldDeltaX, worldDeltaY, handled;
        handled = false;
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.refFrame !== null) {
            worldDeltaX = curPosX - this.mouseMovePos.x;
            worldDeltaY = this.mouseMovePos.y - curPosY;
            if (this.refFrame.mouseMove(worldDeltaX, worldDeltaY) !== null) {
                handled = true;
            }
        }
        if (!handled) {
            if (this.viewMode === REAL3D.CageModeling.ViewMode.TRANSLATE) {
                this.translateCamera(curPosX, curPosY);
            } else if (this.viewMode === REAL3D.CageModeling.ViewMode.ROTATE) {
                this.rotateScene(curPosX, curPosY);
            } else if (this.viewMode === REAL3D.CageModeling.ViewMode.SCALE) {
                this.zoomCamera(curPosX, curPosY);
            }
        }
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.CageModeling.HomeControl.mouseUp = function (e) {
    "use strict";
    this.isMouseDown = false;
};

REAL3D.CageModeling.HomeControl.keyPress = function (e) {
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

REAL3D.CageModeling.HomeControl.switchViewMode = function (viewMode) {
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
