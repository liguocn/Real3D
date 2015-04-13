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
    editState: null,
    transformRefFrame: null
};

REAL3D.CageModeling.EditCageControl.init = function (canvasOffset, winW, winH) {
    "use strict";
    console.log("HomeControl init");
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 10000);
        this.camera.position.set(0, 0, 750);

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
    var curPosX, curPosY, mouseNormPosX, mouseNormPosY, handled;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = true;
    this.mouseMovePos.set(curPosX, curPosY);
    mouseNormPosX = curPosX * 2 / this.winW - 1;
    mouseNormPosY = 1 - curPosY * 2 / this.winH;
    handled = false;
    if (this.editMode === REAL3D.CageModeling.EditMode.EDIT) {
        handled = this.editPreMouseDown(mouseNormPosX, mouseNormPosY);
    }
    if (!handled) {
        this.hitDetection(mouseNormPosX, mouseNormPosY);
        if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
            this.extrudeMouseDown();
        } else if (this.editMode === REAL3D.CageModeling.EditMode.DELETE) {
            this.deleteMouseDown();
        } else if (this.editMode === REAL3D.CageModeling.EditMode.EDIT) {
            this.editMouseDown();
        } else if (this.editMode === REAL3D.CageModeling.EditMode.SPLIT) {
            this.splitMouseDown();
        }
    }
};

REAL3D.CageModeling.EditCageControl.mouseMove = function (e) {
    "use strict";
    if (this.isMouseDown) {
        var curPosX, curPosY, handled;
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        handled = false;
        if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
            handled = this.extrudeMouseMove(curPosY);
        } else if (this.editMode === REAL3D.CageModeling.EditMode.EDIT) {
            handled = this.editMouseMove(curPosX, curPosY);
        }
        if (!handled) {
            this.viewControlMouseMove(curPosX, curPosY);
        }
        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.CageModeling.EditCageControl.mouseUp = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.isMouseDown = false;
    if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
        this.extrudeMouseMove(curPosY);
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
    if (this.editState === REAL3D.CageModeling.EditState.NONE) {
        if (this.transformRefFrame !== null) {
            this.transformRefFrame.releaseData();
            this.transformRefFrame = null;
        }
    }
};

REAL3D.CageModeling.EditCageControl.hitDetection = function (mouseNormPosX, mouseNormPosY) {
    "use strict";
    //console.log("hitDetection");
    var worldMatrix, projectMatrix, cameraMatrix, cameraProjectMatrix, needVertexPick, needEdgePick, needFacePick, onlyBoundary;
    worldMatrix = REAL3D.RenderManager.scene.matrixWorld;
    projectMatrix = this.camera.projectionMatrix;
    cameraMatrix = this.camera.matrixWorld;
    cameraProjectMatrix = new THREE.Matrix4();
    cameraProjectMatrix.multiplyMatrices(projectMatrix, cameraProjectMatrix.getInverse(cameraMatrix));
    needVertexPick = true;
    needEdgePick = true;
    needFacePick = true;
    onlyBoundary = false;
    this.mouseState = REAL3D.CageModeling.MouseState.NONE;
    if (this.editMode === REAL3D.CageModeling.EditMode.EXTRUDE) {
        needVertexPick = false;
        onlyBoundary = true;
    } else if (this.editMode === REAL3D.CageModeling.EditMode.DELETE) {
        needVertexPick = false;
        needEdgePick = false;
    }

    if (needVertexPick) {
        if (REAL3D.CageModeling.CageData.pickVertex(worldMatrix, cameraProjectMatrix, mouseNormPosX, mouseNormPosY)) {
            this.mouseState = REAL3D.CageModeling.MouseState.HITVERTEX;
        }
    }
    if (needEdgePick && this.mouseState === REAL3D.CageModeling.MouseState.NONE) {
        if (REAL3D.CageModeling.CageData.pickEdge(worldMatrix, cameraProjectMatrix, mouseNormPosX, mouseNormPosY, onlyBoundary)) {
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

REAL3D.CageModeling.EditCageControl.viewControlMouseMove = function (mousePosX, mousePosY) {
    "use strict";
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITCANVAS) {
        if (this.viewMode === REAL3D.CageModeling.ViewMode.TRANSLATE) {
            this.translateCamera(mousePosX, mousePosY);
        } else if (this.viewMode === REAL3D.CageModeling.ViewMode.ROTATE) {
            this.rotateScene(mousePosX, mousePosY);
        } else if (this.viewMode === REAL3D.CageModeling.ViewMode.SCALE) {
            this.zoomCamera(mousePosX, mousePosY);
        }
    }
};

REAL3D.CageModeling.EditCageControl.extrudeMouseDown = function () {
    "use strict";
    var pickTool, curOp;
    pickTool = REAL3D.CageModeling.CageData.pickTool;
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {
        if (this.editState === REAL3D.CageModeling.EditState.NONE) {
            //console.log("  Create new extrude: none");
            this.editState = REAL3D.CageModeling.EditState.EDITTING;
            REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Extrude(pickTool.getPickedFace()[0],
                pickTool.getMesh(), REAL3D.MeshModel.ElementType.FACE, 0));
            REAL3D.CageModeling.CageData.previewOperation();
        } else if (this.editState === REAL3D.CageModeling.EditState.EDITTING) {
            curOp = REAL3D.CageModeling.CageData.getCurOperation();
            if (curOp.elemType !== REAL3D.MeshModel.ElementType.FACE || curOp.previewElemIndex !== pickTool.getPickedFace()[0]) {
                //generate new operation
                if (REAL3D.CageModeling.CageData.generateOperation(true)) {
                    REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Extrude(pickTool.getPickedFace()[0],
                        pickTool.getMesh(), REAL3D.MeshModel.ElementType.FACE, 0));
                    REAL3D.CageModeling.CageData.previewOperation();
                } else {
                    this.editState = REAL3D.CageModeling.EditState.NONE;
                }
                //update UI
                REAL3D.CageModeling.EditCageUI.setExtrudeDistance(0);
            }
        }
    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {
        if (this.editState === REAL3D.CageModeling.EditState.NONE) {
            this.editState = REAL3D.CageModeling.EditState.EDITTING;
            REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Extrude(pickTool.getPickedEdge()[0],
                pickTool.getMesh(), REAL3D.MeshModel.ElementType.EDGE, 0));
            REAL3D.CageModeling.CageData.previewOperation();
        } else if (this.editState === REAL3D.CageModeling.EditState.EDITTING) {
            curOp = REAL3D.CageModeling.CageData.getCurOperation();
            if (curOp.elemType !== REAL3D.MeshModel.ElementType.EDGE || curOp.previewElemIndex !== pickTool.getPickedEdge()[0]) {
                //generate new operation
                if (REAL3D.CageModeling.CageData.generateOperation(true)) {
                    REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Extrude(pickTool.getPickedEdge()[0],
                        pickTool.getMesh(), REAL3D.MeshModel.ElementType.EDGE, 0));
                    REAL3D.CageModeling.CageData.previewOperation();
                } else {
                    this.editState = REAL3D.CageModeling.EditState.NONE;
                }
                //update UI
                REAL3D.CageModeling.EditCageUI.setExtrudeDistance(0);
            }
        }
    }
};

REAL3D.CageModeling.EditCageControl.extrudeMouseMove = function (mousePosY) {
    "use strict";
    if (this.editState === REAL3D.CageModeling.EditState.EDITTING && (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE || this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE)) {
        var mouseDeltaY, curOp;
        mouseDeltaY = this.mouseMovePos.y - mousePosY;
        curOp = REAL3D.CageModeling.CageData.getCurOperation();
        curOp.addDistance(mouseDeltaY);
        REAL3D.CageModeling.CageData.previewOperation();
        //update UI
        REAL3D.CageModeling.EditCageUI.setExtrudeDistance(curOp.distance);
        return true;
    }
    return false;
};

REAL3D.CageModeling.EditCageControl.deleteMouseDown = function () {
    "use strict";
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {
        var pickTool = REAL3D.CageModeling.CageData.pickTool;
        REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Delete(pickTool.getPickedFace()[0],
            pickTool.getMesh(), REAL3D.MeshModel.ElementType.FACE));
        REAL3D.CageModeling.CageData.generateOperation(false);
    }
};

REAL3D.CageModeling.EditCageControl.editPreMouseDown = function (mouseNormPosX, mouseNormPosY) {
    "use strict";
    var handled, pickTool, projectMatrix, cameraMatrix, cameraProjectMatrix, refRes, elemType, elemIndex;
    handled = false;
    pickTool = REAL3D.CageModeling.CageData.pickTool;
    if (this.transformRefFrame !== null) {
        projectMatrix = this.camera.projectionMatrix;
        cameraMatrix = this.camera.matrixWorld;
        cameraProjectMatrix = new THREE.Matrix4();
        cameraProjectMatrix.multiplyMatrices(projectMatrix, cameraProjectMatrix.getInverse(cameraMatrix));
        refRes = this.transformRefFrame.mouseDown(mouseNormPosX, mouseNormPosY, cameraProjectMatrix);
        if (refRes !== null) {
            if (refRes.mouseState === REAL3D.TransformTool.MouseDownState.CREATE) {
                REAL3D.CageModeling.CageData.generateOperation(true);
                //update UI
                REAL3D.CageModeling.EditCageUI.setTranslateValue(0);
                REAL3D.CageModeling.EditCageUI.setScaleValue(1);
                //
                this.editState = REAL3D.CageModeling.EditState.EDITTING;
                elemType = pickTool.currentElementType;
                if (pickTool.currentElementType === REAL3D.MeshModel.ElementType.VERTEX) {
                    elemIndex = pickTool.getPickedVertex()[0];
                } else if (pickTool.currentElementType === REAL3D.MeshModel.ElementType.EDGE) {
                    elemIndex = pickTool.getPickedEdge()[0];
                } else if (pickTool.currentElementType === REAL3D.MeshModel.ElementType.FACE) {
                    elemIndex = pickTool.getPickedFace()[0];
                }
                if (refRes.transformType === REAL3D.TransformTool.TransformType.TRANSLATEX || refRes.transformType === REAL3D.TransformTool.TransformType.TRANSLATEY || refRes.transformType === REAL3D.TransformTool.TransformType.TRANSLATEZ) {
                    REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Translate(elemIndex, pickTool.getMesh(), elemType, refRes.dir, refRes.value));
                    REAL3D.CageModeling.CageData.previewOperation();
                    REAL3D.CageModeling.EditCageUI.configTransformUI(false, true);
                } else if ((refRes.transformType === REAL3D.TransformTool.TransformType.SCALEX || refRes.transformType === REAL3D.TransformTool.TransformType.SCALEY || refRes.transformType === REAL3D.TransformTool.TransformType.SCALEZ) && pickTool.currentElementType !== REAL3D.MeshModel.ElementType.VERTEX) {
                    REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.Scale(elemIndex, pickTool.getMesh(), elemType, refRes.dir, refRes.value));
                    REAL3D.CageModeling.CageData.previewOperation();
                    REAL3D.CageModeling.EditCageUI.configTransformUI(true, false);
                } else {
                    REAL3D.CageModeling.EditCageUI.configTransformUI(true, true);
                }
            }
            handled = true;
        }
    }
    return handled;
};

//1. Hit mesh element: a) the same element: not do anything; b) a new element: generate current operation and generate a new refFrame
//2. Hit refFrame: a) EDIT: do nothing; b) CREATE: generate current operation and generate a new operation
//3. Hit Canvas: view control 
REAL3D.CageModeling.EditCageControl.editMouseDown = function () {
    "use strict";
    var pickTool, curOp, isGenerateNew;
    pickTool = REAL3D.CageModeling.CageData.pickTool;
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {
        //update smoooth value in UI
        //REAL3D.CageModeling.EditCageUI.setSmoothValue(pickTool.getMesh().get);
        if (this.editState === REAL3D.CageModeling.EditState.NONE) {
            this.constructRefFrameFromFace(pickTool.getMesh().getFace(pickTool.getPickedFace()[0]));
            REAL3D.CageModeling.EditCageUI.configTransformUI(true, true);
        } else if (this.editState === REAL3D.CageModeling.EditState.EDITTING) {
            isGenerateNew = false;
            curOp = REAL3D.CageModeling.CageData.getCurOperation();
            if (curOp === null) {
                isGenerateNew = true;
            } else if (curOp.elemType !== REAL3D.MeshModel.ElementType.FACE || curOp.elemIndex !== pickTool.getPickedFace()[0]) {
                isGenerateNew = true;
            }
            if (isGenerateNew) {
                //generate current operation and generate a new refFrame
                REAL3D.CageModeling.CageData.generateOperation(true);
                this.constructRefFrameFromFace(pickTool.getMesh().getFace(pickTool.getPickedFace()[0]));
                //update UI
                REAL3D.CageModeling.EditCageUI.setTranslateValue(0);
                REAL3D.CageModeling.EditCageUI.setScaleValue(1);
                REAL3D.CageModeling.EditCageUI.configTransformUI(true, true);
            }
        }
    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {
        //update smoooth value in UI
        REAL3D.CageModeling.EditCageUI.setSmoothValue(pickTool.getMesh().getEdge(pickTool.getPickedEdge()[0]).getSmoothValue());

        if (this.editState === REAL3D.CageModeling.EditState.NONE) {
            this.constructRefFrameFromEdge(pickTool.getMesh().getEdge(pickTool.getPickedEdge()[0]));
            REAL3D.CageModeling.EditCageUI.configTransformUI(true, true);
        } else if (this.editState === REAL3D.CageModeling.EditState.EDITTING) {
            isGenerateNew = false;
            curOp = REAL3D.CageModeling.CageData.getCurOperation();
            if (curOp === null) {
                isGenerateNew = true;
            } else if (curOp.elemType !== REAL3D.MeshModel.ElementType.EDGE || curOp.elemIndex !== pickTool.getPickedEdge()[0]) {
                isGenerateNew = true;
            }
            if (isGenerateNew) {
                //generate current operation and generate a new refFrame
                REAL3D.CageModeling.CageData.generateOperation(true);
                this.constructRefFrameFromEdge(pickTool.getMesh().getEdge(pickTool.getPickedEdge()[0]));
                //update UI
                REAL3D.CageModeling.EditCageUI.setTranslateValue(0);
                REAL3D.CageModeling.EditCageUI.setScaleValue(1);
                REAL3D.CageModeling.EditCageUI.configTransformUI(true, true);
            }
        }
    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITVERTEX) {
        //update smoooth value in UI
        REAL3D.CageModeling.EditCageUI.setSmoothValue(pickTool.getMesh().getVertex(pickTool.getPickedVertex()[0]).getSmoothValue());

        if (this.editState === REAL3D.CageModeling.EditState.NONE) {
            this.constructRefFrameFromVertex(pickTool.getMesh().getVertex(pickTool.getPickedVertex()[0]));
            REAL3D.CageModeling.EditCageUI.configTransformUI(true, true);
        } else if (this.editState === REAL3D.CageModeling.EditState.EDITTING) {
            isGenerateNew = false;
            curOp = REAL3D.CageModeling.CageData.getCurOperation();
            if (curOp === null) {
                isGenerateNew = true;
            } else if (curOp.elemType !== REAL3D.MeshModel.ElementType.VERTEX || curOp.elemIndex !== pickTool.getPickedVertex()[0]) {
                isGenerateNew = true;
            }
            if (isGenerateNew) {
                //generate current operation and generate a new refFrame
                REAL3D.CageModeling.CageData.generateOperation(true);
                this.constructRefFrameFromVertex(pickTool.getMesh().getVertex(pickTool.getPickedVertex()[0]));
                //update UI
                REAL3D.CageModeling.EditCageUI.setTranslateValue(0);
                REAL3D.CageModeling.EditCageUI.setScaleValue(1);
                REAL3D.CageModeling.EditCageUI.configTransformUI(true, true);
            }
        }
    }
};

//change parameter of operation
REAL3D.CageModeling.EditCageControl.editMouseMove = function (mousePosX, mousePosY) {
    "use strict";
    if (this.editState === REAL3D.CageModeling.EditState.EDITTING && this.transformRefFrame !== null) {
        var worldDeltaX, worldDeltaY, refRes, curOp;
        worldDeltaX = mousePosX - this.mouseMovePos.x;
        worldDeltaY = this.mouseMovePos.y - mousePosY;
        refRes = this.transformRefFrame.mouseMove(worldDeltaX, worldDeltaY);
        if (refRes !== null) {
            curOp = REAL3D.CageModeling.CageData.getCurOperation();
            if (curOp !== null) {
                curOp.addValue(refRes.value);
            }
            //update UI
            if (refRes.type === REAL3D.TransformTool.TransformType.TRANSLATEX || refRes.type === REAL3D.TransformTool.TransformType.TRANSLATEY || refRes.type === REAL3D.TransformTool.TransformType.TRANSLATEZ) {
                REAL3D.CageModeling.EditCageUI.setTranslateValue(curOp.value);
                REAL3D.CageModeling.CageData.previewOperation();
            } else if ((refRes.type === REAL3D.TransformTool.TransformType.SCALEX || refRes.type === REAL3D.TransformTool.TransformType.SCALEY || refRes.type === REAL3D.TransformTool.TransformType.SCALEZ) && REAL3D.CageModeling.CageData.pickTool.currentElementType !== REAL3D.MeshModel.ElementType.VERTEX) {
                REAL3D.CageModeling.EditCageUI.setScaleValue(curOp.scaleValue);
                REAL3D.CageModeling.CageData.previewOperation();
            }
            return true;
        }
    }
    return false;
};

REAL3D.CageModeling.EditCageControl.constructRefFrameFromFace = function (face) {
    "use strict";
    var startEdge, curEdge, centerPos, vertexCount, xDir, cameraPos, cameraVec, worldMatrix, worldCenterPos, refSize;
    startEdge = face.getEdge();
    curEdge = startEdge;
    centerPos = new REAL3D.Vector3(0, 0, 0);
    vertexCount = 0;
    do {
        centerPos.addVector(curEdge.getVertex().getPosition());
        vertexCount++;
        curEdge = curEdge.getNext();
    } while (curEdge !== startEdge);
    xDir = REAL3D.Vector3.sub(startEdge.getVertex().getPosition(), startEdge.getPair().getVertex().getPosition());
    xDir.unify();
    centerPos.multiply(1 / vertexCount);
    worldMatrix = REAL3D.RenderManager.scene.matrixWorld;
    worldCenterPos = new THREE.Vector3(centerPos.x, centerPos.y, centerPos.z);
    worldCenterPos.applyProjection(worldMatrix);
    cameraPos = this.camera.getWorldPosition();
    cameraVec = new REAL3D.Vector3(cameraPos.x - worldCenterPos.x, cameraPos.y - worldCenterPos.y, cameraPos.z - worldCenterPos.z);
    refSize = cameraVec.length() * 0.15;
    if (this.transformRefFrame !== null) {
        this.transformRefFrame.releaseData();
    }
    this.transformRefFrame = new REAL3D.TransformTool.RefFrame();
    this.transformRefFrame.init(centerPos, face.getNormal(), xDir, refSize, REAL3D.RenderManager.scene);
};

REAL3D.CageModeling.EditCageControl.constructRefFrameFromEdge = function (edge) {
    "use strict";
    var yDir, xDir, centerPos, cameraPos, cameraVec, worldMatrix, worldCenterPos, refSize;
    centerPos = REAL3D.Vector3.add(edge.getVertex().getPosition(), edge.getPair().getVertex().getPosition());
    centerPos.multiply(0.5);
    yDir = REAL3D.Vector3.sub(edge.getVertex().getPosition(), edge.getPair().getVertex().getPosition());
    yDir.unify();
    xDir = null;
    worldMatrix = REAL3D.RenderManager.scene.matrixWorld;
    worldCenterPos = new THREE.Vector3(centerPos.x, centerPos.y, centerPos.z);
    worldCenterPos.applyProjection(worldMatrix);
    cameraPos = this.camera.getWorldPosition();
    cameraVec = new REAL3D.Vector3(cameraPos.x - worldCenterPos.x, cameraPos.y - worldCenterPos.y, cameraPos.z - worldCenterPos.z);
    refSize = cameraVec.length() * 0.15;
    if (this.transformRefFrame !== null) {
        this.transformRefFrame.releaseData();
    }
    this.transformRefFrame = new REAL3D.TransformTool.RefFrame();
    this.transformRefFrame.init(centerPos, yDir, xDir, refSize, REAL3D.RenderManager.scene);
};

REAL3D.CageModeling.EditCageControl.constructRefFrameFromVertex = function (vertex) {
    "use strict";
    var yDir, xDir, centerPos, cameraPos, cameraVec, worldMatrix, worldCenterPos, refSize;
    centerPos = vertex.getPosition();
    yDir = REAL3D.Vector3.sub(vertex.getPosition(), vertex.getEdge().getVertex().getPosition());
    yDir.unify();
    xDir = null;
    worldMatrix = REAL3D.RenderManager.scene.matrixWorld;
    worldCenterPos = new THREE.Vector3(centerPos.x, centerPos.y, centerPos.z);
    worldCenterPos.applyProjection(worldMatrix);
    cameraPos = this.camera.getWorldPosition();
    cameraVec = new REAL3D.Vector3(cameraPos.x - worldCenterPos.x, cameraPos.y - worldCenterPos.y, cameraPos.z - worldCenterPos.z);
    refSize = cameraVec.length() * 0.15;
    if (this.transformRefFrame !== null) {
        this.transformRefFrame.releaseData();
    }
    this.transformRefFrame = new REAL3D.TransformTool.RefFrame();
    this.transformRefFrame.init(centerPos, yDir, xDir, refSize, REAL3D.RenderManager.scene);
};

REAL3D.CageModeling.EditCageControl.updateTransformRefFramePosition = function () {
    "use strict";
    if (this.transformRefFrame !== null) {
        var pickTool, pickMesh, pickEdge, centerPos, startEdge, curEdge, vertexCount;
        pickTool = REAL3D.CageModeling.CageData.pickTool;
        pickMesh = pickTool.getMesh();
        if (pickTool.currentElementType === REAL3D.MeshModel.ElementType.VERTEX) {
            this.transformRefFrame.updateDrawObjectPosition(pickMesh.getVertex(pickTool.getPickedVertex()[0]).getPosition());
        } else if (pickTool.currentElementType === REAL3D.MeshModel.ElementType.EDGE) {
            pickEdge = pickMesh.getEdge(pickTool.getPickedEdge()[0]);
            centerPos = REAL3D.Vector3.add(pickEdge.getVertex().getPosition(), pickEdge.getPair().getVertex().getPosition());
            centerPos.multiply(0.5);
            this.transformRefFrame.updateDrawObjectPosition(centerPos);
        } else if (pickTool.currentElementType === REAL3D.MeshModel.ElementType.FACE) {
            startEdge = pickMesh.getFace(pickTool.getPickedFace()[0]).getEdge();
            curEdge = startEdge;
            centerPos = new REAL3D.Vector3(0, 0, 0);
            vertexCount = 0;
            do {
                centerPos.addVector(curEdge.getVertex().getPosition());
                vertexCount++;
                curEdge = curEdge.getNext();
            } while (curEdge !== startEdge);
            centerPos.multiply(1 / vertexCount);
            this.transformRefFrame.updateDrawObjectPosition(centerPos);
        }
        this.transformRefFrame.draw();
    }
};

REAL3D.CageModeling.EditCageControl.splitMouseDown = function () {
    "use strict";
    var pickTool;
    pickTool = REAL3D.CageModeling.CageData.pickTool;
    if (this.mouseState === REAL3D.CageModeling.MouseState.HITFACE) {
        if (this.editState === REAL3D.CageModeling.EditState.NONE) {
            this.editState = REAL3D.CageModeling.EditState.EDITTING;
            REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.SubdivideFace(pickTool.getPickedFace()[0],
                pickTool.getMesh(), REAL3D.CageModeling.EditCageState.splitWeight));
            REAL3D.CageModeling.CageData.previewOperation();
        } else if (this.editState === REAL3D.CageModeling.EditState.EDITTING) {
            if (REAL3D.CageModeling.CageData.generateOperation(true)) {
                REAL3D.CageModeling.CageData.setCurOperation(new REAL3D.MeshModel.SubdivideFace(pickTool.getPickedFace()[0],
                    pickTool.getMesh(), REAL3D.CageModeling.EditCageState.splitWeight));
                REAL3D.CageModeling.CageData.previewOperation();
            } else {
                this.editState = REAL3D.CageModeling.EditState.NONE;
            }
        }
    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITEDGE) {

    } else if (this.mouseState === REAL3D.CageModeling.MouseState.HITVERTEX) {

    }
};
