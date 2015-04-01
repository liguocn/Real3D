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
    mouseState: null,
    editState: null
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
    this.editState = REAL3D.CageModeling.EditState.NONE;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.CageModeling.EditCageControl.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY, mouseNormPosX, mouseNormPosY, pickTool, curOp;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = true;
    this.mouseMovePos.set(curPosX, curPosY);
    mouseNormPosX = curPosX * 2 / this.winW - 1;
    mouseNormPosY = 1 - curPosY * 2 / this.winH;
    //console.log(" mousePos: ", curPosX, curPosY, " winW: ", this.winW, this.winH, " NormMousePos: ", mouseNormPosX, mouseNormPosY);
    this.hitDetection(mouseNormPosX, mouseNormPosY);
    pickTool = REAL3D.CageModeling.CageData.pickTool;
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITCANVAS) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {
        if (this.editState === REAL3D.CageModeling.EditState.NONE) {
            //console.log("      Create New Operation");
            this.editState = REAL3D.CageModeling.EditState.EDITTING;
            if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
                REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Extrude(pickTool.getPickedFace()[0],
                    pickTool.getMesh(), REAL3D.MeshModel.ElementType.FACE, 0));
                REAL3D.CageModeling.CageData.previewOperation();
            }
        } else if (this.editState === REAL3D.CageModeling.EditState.EDITTING) {
            if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
                //console.log("     Edit Operation");
                curOp = REAL3D.CageModeling.CageData.getCurOperation();
                if (curOp.previewElemIndex !== pickTool.getPickedFace()[0]) {
                    //console.log("      Create New Operation");
                    //generate new operation
                    REAL3D.CageModeling.CageData.generateOperation(true);
                    REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Extrude(pickTool.getPickedFace()[0],
                        pickTool.getMesh(), REAL3D.MeshModel.ElementType.FACE, 0));
                    REAL3D.CageModeling.CageData.previewOperation();
                    //update UI
                    REAL3D.CageModeling.EditCageUI.setExtrudeDistance(0);
                }
            }
        }

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.VERTEX) {

    }
};

REAL3D.CageModeling.EditCageControl.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY, mouseDeltaY, curOp;
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
            if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
                //change extrude distance
                mouseDeltaY = this.mouseMovePos.y - curPosY;
                curOp = REAL3D.CageModeling.CageData.getCurOperation();
                curOp.addDistance(mouseDeltaY);
                REAL3D.CageModeling.CageData.previewOperation();
                //update UI
                REAL3D.CageModeling.EditCageUI.setExtrudeDistance(curOp.distance);
            }

        } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {

        } else if (this.mouseState === REAL3D.CageModeling.MouseState.VERTEX) {

        }
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.CageModeling.EditCageControl.mouseUp = function (e) {
    "use strict";
    var curPosX, curPosY, mouseDeltaY, curOp;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = false;
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITCANVAS) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {
        if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
            mouseDeltaY = this.mouseMovePos.y - curPosY;
            curOp = REAL3D.CageModeling.CageData.getCurOperation();
            curOp.addDistance(mouseDeltaY);
            REAL3D.CageModeling.CageData.previewOperation();
            //update UI
            REAL3D.CageModeling.EditCageUI.setExtrudeDistance(curOp.distance);
        }
    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.VERTEX) {

    }
    this.mouseMovePos.set(curPosX, curPosY);
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
    this.editState = REAL3D.CageModeling.EditState.NONE;
};

REAL3D.CageModeling.EditCageControl.switchEditState = function (editState) {
    "use strict";
    this.editState = editState;
};

REAL3D.CageModeling.EditCageControl.hitDetection = function (mouseNormPosX, mouseNormPosY) {
    "use strict";
    //console.log("hitDetection");
    var worldMatrix, projectMatrix, cameraMatrix, cameraProjectMatrix, needVertexPick, needEdgePick, needFacePick;
    worldMatrix = REAL3D.RenderManager.scene.matrixWorld;
    projectMatrix = this.camera.projectionMatrix;
    cameraMatrix = this.camera.matrixWorld;
    cameraProjectMatrix = new THREE.Matrix4();
    cameraProjectMatrix.multiplyMatrices(projectMatrix, cameraProjectMatrix.getInverse(cameraMatrix));
    needVertexPick = true;
    needEdgePick = true;
    needFacePick = true;
    this.mouseState = REAL3D.CageModeling.MouseState.NONE;
    if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
        needVertexPick = false;
    }

    if (needVertexPick) {
        if (REAL3D.CageModeling.CageData.pickVertex(worldMatrix, cameraProjectMatrix, mouseNormPosX, mouseNormPosY)) {
            this.mouseState = REAL3D.CageModeling.MouseState.HITVERTEX;
        }
    }
    if (needEdgePick && this.mouseState === REAL3D.CageModeling.MouseState.NONE) {
        if (REAL3D.CageModeling.CageData.pickEdge(worldMatrix, cameraProjectMatrix, mouseNormPosX, mouseNormPosY)) {
            this.mouseState = REAL3D.CageModeling.MouseState.HITEDGE;
        }
    }
    if (needFacePick && this.mouseState === REAL3D.CageModeling.MouseState.NONE) {
        if (REAL3D.CageModeling.CageData.pickFace(worldMatrix, cameraProjectMatrix, mouseNormPosX, mouseNormPosY)) {
            this.mouseState = REAL3D.CageModeling.MouseState.HITFACE;
        }
    }
    if (this.mouseState === REAL3D.CageModeling.MouseState.NONE) {
        this.mouseState = REAL3D.CageModeling.MouseState.HITCANVAS;
    }
};
