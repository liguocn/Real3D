/*jslint plusplus: true */
/*global REAL3D, THREE, console, document, $ */

REAL3D.InnerSpaceDesignState = function(winW, winH) {
    "use strict";
    REAL3D.StateBase.call(this);
    this.stateName = "InnerSpaceDesignState";
    this.isMouseDown = false;
    this.canvasOffset = null;
    this.winW = winW;
    this.winH = winH;
    this.cameraOrtho = null;
    this.cameraOrthoName = "CameraOrtho";
    this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    this.userUIData = new REAL3D.InnerSpaceDesignState.UserTree();
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesignState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.InnerSpaceDesignState.prototype.init = function(canvasElement) {
    "use strict";
    var that = this;
    canvasElement.addEventListener("mousedown", function(e) { that.mouseDown(e); }, false);
    canvasElement.addEventListener("mouseup", function(e) { that.mouseUp(e); }, false);
    canvasElement.addEventListener("mousemove", function(e) { that.mouseMove(e); }, false);
    // canvasElement.addEventListener("keypress", function(e) { that.keyPress(e); }, false);
    // canvasElement.setAttribute("tabindex", 1);
    // canvasElement.focus();
    // canvasElement.style.outline = "none";
};

REAL3D.InnerSpaceDesignState.prototype.enter = function() {
    "use strict";
    console.log("Enter InnerSpaceDesignState");
    if (REAL3D.RenderManager.getCamera(this.cameraOrthoName) === undefined) {
        console.log("Win size: ", this.winW, this.winH);
        var cameraOrthographic = new THREE.OrthographicCamera(this.winW / (-2), this.winW / 2, this.winH / 2, this.winH / (-2), 1, 2000);
        cameraOrthographic.position.set(0, 0, 1000);
        REAL3D.RenderManager.addCamera(this.cameraOrthoName, cameraOrthographic);
    }
    this.cameraOrtho = REAL3D.RenderManager.getCamera(this.cameraOrthoName);
    REAL3D.RenderManager.switchCamera(this.cameraOrthoName);
    this.canvasOffset = $(REAL3D.RenderManager.renderer.domElement).offset();
    console.log("Canvas Offset: ", this.canvasOffset.left, this.canvasOffset.top);
};

REAL3D.InnerSpaceDesignState.prototype.update = function() {
    "use strict";
    REAL3D.RenderManager.update();
};

REAL3D.InnerSpaceDesignState.prototype.exit = function() {
    "use strict";
    console.log("Exit InnerSpaceDesignState");
};

REAL3D.InnerSpaceDesignState.prototype.mouseDown = function(e) {
    "use strict";
    console.log("---------------------------------------------mousedown: ", this.mouseState, "stateName: ", this.stateName);
    var mouseDownDist, curPosX, curPosY, isHittingTheSamePos, newUserPointIndex;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    console.log("mousePos: ", this.mouseDownPos.x, this.mouseDownPos.y, curPosX, curPosY);
    mouseDownDist = (curPosX - this.mouseDownPos.x) * (curPosX - this.mouseDownPos.x) + (curPosY - this.mouseDownPos.y) * (curPosY - this.mouseDownPos.y);
    console.log("mouseDownDist: ", mouseDownDist);
    isHittingTheSamePos = (mouseDownDist < REAL3D.InnerSpaceDesignState.HITRADIUS);
    this.hitUserPointIndex = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    console.log("hit the same point: ", isHittingTheSamePos, "  hit index: ", this.hitUserPointIndex);
    if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.NONE) {
        if (this.hitUserPointIndex === -1) {
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS;
            console.log("state: NONE -> HITCANVAS");
        } else {
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT;
            console.log("state: NONE -> HITUSERPOINT");
        }
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
            console.log("state: CREATINGUSERPOINT -> NONE, hit the same point, finishCreatingNewUserPoint");
        } else {
            if (this.hitUserPointIndex === -1) {
                newUserPointIndex = this.createNewUserPoint(curPosX, curPosY);
                console.log("createNewUserPoint: ", this.lastCreatedPointIndex, newUserPointIndex);
                this.connectUserPoint(this.lastCreatedPointIndex, newUserPointIndex);
                this.lastCreatedPointIndex = newUserPointIndex;
            } else {
                this.connectUserPoint(this.hitUserPointIndex, this.lastCreatedPointIndex);
                this.lastCreatedPointIndex = this.hitUserPointIndex;
                console.log("connectUserPoint to exist point: ", this.hitUserPointIndex);
            }
        }
    }
    this.mouseDownPos.set(curPosX, curPosY);
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
    console.log("Mouse state: ", this.mouseState);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignState.prototype.mouseMove = function(e) {
    "use strict";
    var curPosX, curPosY;
    if (this.isMouseDown) {
        //console.log("---------------------------------------------mousemove: ", this.mouseState);
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT;
                this.draggingUserPoint(curPosX, curPosY);
                console.log("state: HITUSERPOINT -> DRAGGINGUSERPOINT");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT) {
            this.draggingUserPoint(curPosX, curPosY);
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS;
                this.draggingCanvas(curPosX, curPosY);
                console.log("state: HITCANVAS -> DRAGGINGCANVAS");
            }
        } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS) {
            this.draggingCanvas(curPosX, curPosY);
        }

        this.mouseMovePos.set(curPosX, curPosY);
        // console.log("Mouse state: ", this.mouseState);
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    }
};

REAL3D.InnerSpaceDesignState.prototype.mouseUp = function(e) {
    "use strict";
    console.log("---------------------------------------------mouseup: ", this.mouseState, "stateName: ", this.stateName);
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
        console.log("state: DRAGGINGUSERPOINT -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.NONE;
        console.log("state: DRAGGINGCANVAS -> NONE");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITUSERPOINT) {
        this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
        this.lastCreatedPointIndex = this.hitUserPointIndex;
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT;
        console.log("state: HITUSERPOINT -> CREATINGUSERPOINT, connectUserPoint to exist point");
    } else if (this.mouseState === REAL3D.InnerSpaceDesignState.MouseState.HITCANVAS) {
        console.log("state: HITCANVAS -> CREATINGUSERPOINT, createNewUserPoint");
        this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.InnerSpaceDesignState.MouseState.CREATINGUSERPOINT;
        console.log("createNewUserPoint: ", this.lastCreatedPointIndex);
    }
    this.isMouseDown = false;
    console.log("Mouse state: ", this.mouseState);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.InnerSpaceDesignState.prototype.hitDetection = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return this.userUIData.selectPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignState.prototype.connectUserPoint = function(index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        this.userUIData.connectPoints(index1, index2);
    }
};

REAL3D.InnerSpaceDesignState.prototype.createNewUserPoint = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return this.userUIData.addNewPoint(worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignState.prototype.finishCreatingNewUserPoint = function() {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.InnerSpaceDesignState.prototype.isMouseMoved = function(mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseDownPos.x) * (mousePosX - this.mouseDownPos.x) + (mousePosY - this.mouseDownPos.y) * (mousePosY - this.mouseDownPos.y);
    console.log("isMouseMoved: dist = ", dist, mousePosX, mousePosY, this.mouseDownPos.x, this.mouseDownPos.y);
    if (dist > REAL3D.InnerSpaceDesignState.MOVERADIUS) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

REAL3D.InnerSpaceDesignState.prototype.draggingUserPoint = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    this.userUIData.dragPoint(this.hitUserPointIndex, worldPosX, worldPosY);
};

REAL3D.InnerSpaceDesignState.prototype.draggingCanvas = function(mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.cameraOrtho.translateX(worldDifX);
    this.cameraOrtho.translateY(worldDifY);
};


REAL3D.InnerSpaceDesignState.MouseState = {
    NONE : 0,
    CREATINGUSERPOINT : 1,
    DRAGGINGUSERPOINT : 2,
    DRAGGINGCANVAS: 3,
    HITUSERPOINT : 4,
    HITCANVAS : 5
};

REAL3D.InnerSpaceDesignState.HITRADIUS = 250;
REAL3D.InnerSpaceDesignState.MOVERADIUS = 100;
REAL3D.InnerSpaceDesignState.SELECTRADIUS = 200;

REAL3D.InnerSpaceDesignState.UserPoint = function(posX, posY) {
    "use strict";
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
};

REAL3D.InnerSpaceDesignState.UserTree = function() {
    "use strict";
    this.points = [];
    this.uiData = [];
    this.uiLineRoot = null;
    this.refFrame = null;
    //temp geometry
    var geometryCenter, materialCenter;
    geometryCenter = new THREE.BoxGeometry(10, 10, 10);
    materialCenter = new THREE.MeshBasicMaterial({color: 0xfcfcfc});
    this.refFrame = new THREE.Mesh(geometryCenter, materialCenter);
    this.refFrame.name = "refFrame";
    this.refFrame.position.set(0, 0, 0);
    REAL3D.RenderManager.scene.add(this.refFrame);
};

REAL3D.InnerSpaceDesignState.UserTree.prototype = {
    addNewPoint : function(worldPosX, worldPosY) {
        "use strict";
        console.log("addNewPoint: stateName: ", this.stateName);
        var newUserPoint, geometry, material, newUIData;
        newUserPoint = new REAL3D.InnerSpaceDesignState.UserPoint(worldPosX, worldPosY);
        this.points.push(newUserPoint);
        geometry = new THREE.SphereGeometry(5, 32, 32);
        material = new THREE.MeshBasicMaterial({color: 0x0e0efe});
        newUIData = new THREE.Mesh(geometry, material);
        newUIData.position.set(worldPosX, worldPosY, 0);
        this.uiData.push(newUIData);
        this.refFrame.add(newUIData);
        console.log("UserTree.points.length: ", this.points.length);
        return (this.points.length - 1);
    },

    connectPoints : function(index1, index2) {
        "use strict";
        var point1, point2;
        point1 = this.points[index1];
        point2 = this.points[index2];
        point1.neighbors.push(point2);
        point2.neighbors.push(point1);
        this.updateUiConnection();
        console.log("add line");
    },

    selectPoint : function(worldPosX, worldPosY) {
        "use strict";
        var pid, dist, curPoint, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            curPoint = this.points[pid];
            if (curPoint !== undefined && curPoint !== null) {
                dist = (worldPosX - curPoint.posX) * (worldPosX - curPoint.posX) + (worldPosY - curPoint.posY) * (worldPosY - curPoint.posY);
                if (dist < REAL3D.InnerSpaceDesignState.SELECTRADIUS) {
                    return pid;
                }
            }
        }
        return -1;
    },

    dragPoint : function(index, worldPosX, worldPosY) {
        "use strict";
        this.points[index].posX = worldPosX;
        this.points[index].posY = worldPosY;
        this.uiData[index].position.set(worldPosX, worldPosY, 0);
        this.updateUiConnection();
    },

    updateUiConnection : function() {
        "use strict";
        var point, neigPoint, pointLen, neighborLen, pid, nid, lineMaterial, lineGeometry, lineObj;
        if (this.uiLineRoot === null) {
            this.uiLineRoot = new THREE.Object3D();
            this.refFrame.add(this.uiLineRoot);
            //REAL3D.RenderManager.center.add(this.uiLineRoot);
        } else {
            this.refFrame.remove(this.uiLineRoot);
            this.uiLineRoot = new THREE.Object3D();
            this.refFrame.add(this.uiLineRoot);
        }
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            point = this.points[pid];
            neighborLen = point.neighbors.length;
            for (nid = 0; nid < neighborLen; nid++) {
                neigPoint = point.neighbors[nid];
                lineMaterial = new THREE.LineBasicMaterial({color: 0xae0e1e});
                lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(new THREE.Vector3(point.posX, point.posY, 0),
                    new THREE.Vector3(neigPoint.posX, neigPoint.posY, 0));
                lineObj = new THREE.Line(lineGeometry, lineMaterial);
                this.uiLineRoot.add(lineObj);
            }
        }
    }
};


function enterInnerSpaceDesignState(winW, winH, containerId) {
    "use strict";
    var InnerSpaceDesignState, canvasElement, canvContainer;
    canvasElement = REAL3D.RenderManager.init(winW, winH);
    InnerSpaceDesignState = new REAL3D.InnerSpaceDesignState(winW, winH);
    InnerSpaceDesignState.init(canvasElement);
    canvContainer = document.getElementById(containerId);
    canvContainer.appendChild(canvasElement);
    REAL3D.StateManager.enterState(InnerSpaceDesignState);
}

function newWorkSpace() {
    "use strict";
    console.log("New Work Space");
}

function saveWorkSpace() {
    "use strict";
    console.log("Save Work Space");
}
