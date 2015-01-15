/*jslint plusplus: true */
/*global REAL3D, THREE, console */

/*properties LayoutDesignState, stateName, mousePos, isMouseDown, canvasOffset, winW, winH, cameraOrtho, cameraOrthoName, mouseState, mouseDownPos, mouseMovePos, userUIData */
/*properties hitUserPointIndex, lastCreatedPointIndex */
/*properties MouseState, NONE, CREATINGUSERPOINT, DRAGGINGUSERPOINT, DRAGGINGCANVAS, HITUSERPOINT, HITCANVAS, LayoutDesignState*/
/*properties UserTree, points, curLastId, addNewPoint, connectPoints, deletePoint, deleteEdge, selectPoint */
/*properties StateBase, call, Vector2, RenderManager, windowWidth, windowHeight */
REAL3D.LayoutDesignState = function() {
    "use strict";
    REAL3D.StateBase.call(this);
    this.stateName = "LayoutDesignState";
    this.mousePos = new THREE.Vector2(0, 0);
    this.isMouseDown = false;
    //
    this.canvasOffset = null;
    this.winW = REAL3D.RenderManager.windowWidth;
    this.winH = REAL3D.RenderManager.windowHeight;
    this.cameraOrtho = null;
    this.cameraOrthoName = "CameraOrtho";
    this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    //user data
    this.userUIData = new REAL3D.LayoutDesignState.UserTree();
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
};

/*properties create, prototype */
REAL3D.LayoutDesignState.prototype = Object.create(REAL3D.StateBase.prototype);

/*properties updateUserUIDataDisplay, hitDetection, connectUserPoint, createNewUserPoint, finishCreatingNewUserPoint, isMouseMoved, draggingUserPoint, draggingCanvas */
/*properties log, enter, exit, mouseDown, mouseMove, mouseUp, getCamera, OrthographicCamera, position, set, addCamera, renderer, domElement, offset, pageX, pageY, left, top, switchCamera */
REAL3D.LayoutDesignState.prototype.enter = function() {
    "use strict";
    console.log("Enter LayoutDesignState");
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

REAL3D.LayoutDesignState.prototype.exit = function() {
    "use strict";
    console.log("Exit LayoutDesignState");
};

/*properties x, y, connectUserPoint, DISTANCETHRESHOLD */
REAL3D.LayoutDesignState.prototype.mouseDown = function(e) {
    "use strict";
    console.log("---------------------------------------------mousedown: ", this.mouseState);
    var mouseDownDist, curPosX, curPosY, isHittingTheSamePos, newUserPointIndex;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    mouseDownDist = (curPosX - this.mouseDownPos.x) * (curPosX - this.mouseDownPos.x) + (curPosY - this.mouseDownPos.y) + (curPosY - this.mouseDownPos.y);
    isHittingTheSamePos = (mouseDownDist < REAL3D.LayoutDesignState.DISTANCETHRESHOLD);
    this.hitUserPointIndex = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    console.log("hit the same point: ", isHittingTheSamePos, "  hit index: ", this.hitUserPointIndex);
    if (this.mouseState === REAL3D.LayoutDesignState.MouseState.NONE) {
        if (this.hitUserPointIndex === -1) {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.HITCANVAS;
            console.log("state: NONE -> HITCANVAS");
        } else {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.HITUSERPOINT;
            console.log("state: NONE -> HITUSERPOINT");
        }
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
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
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

/*properties scene, getObjectByName, rotateXGlobal, rotateYGlobal */
REAL3D.LayoutDesignState.prototype.mouseMove = function(e) {
    "use strict";
    var curPosX, curPosY;
    if (this.isMouseDown) {
        curPosX = e.pageX - this.canvasOffset.left;
        curPosY = e.pageY - this.canvasOffset.top;
        if (this.mouseState === REAL3D.LayoutDesignState.MouseState.HITUSERPOINT) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT;
                this.draggingUserPoint(curPosX, curPosY);
                console.log("state: HITUSERPOINT -> DRAGGINGUSERPOINT");
            }
        } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT) {
            this.draggingUserPoint(curPosX, curPosY);
        } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.HITCANVAS) {
            if (this.isMouseMoved(curPosX, curPosY)) {
                this.mouseState = REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS;
                this.draggingCanvas(curPosX, curPosY);
                console.log("state: HITCANVAS -> DRAGGINGCANVAS");
            }
        } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS) {
            this.draggingCanvas(curPosX, curPosY);
        }

        this.mouseMovePos.set(curPosX, curPosY);
    }
};

REAL3D.LayoutDesignState.prototype.mouseUp = function(e) {
    "use strict";
    console.log("---------------------------------------------mouseup: ", this.mouseState);
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
        console.log("state: DRAGGINGUSERPOINT -> NONE");
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas(curPosX, curPosY);
        this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
        console.log("state: DRAGGINGCANVAS -> NONE");
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.HITUSERPOINT) {
        this.connectUserPoint(this.lastCreatedPointIndex, this.hitUserPointIndex);
        this.lastCreatedPointIndex = this.hitUserPointIndex;
        this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
        console.log("state: HITUSERPOINT -> CREATINGUSERPOINT, connectUserPoint to exist point");
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.HITCANVAS) {
        console.log("state: HITCANVAS -> CREATINGUSERPOINT, createNewUserPoint");
        this.lastCreatedPointIndex = this.createNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
        console.log("createNewUserPoint: ", this.lastCreatedPointIndex);
    }
    this.isMouseDown = false;
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
};

REAL3D.LayoutDesignState.prototype.updateUserUIDataDisplay = function() {
    "use strict";
};

REAL3D.LayoutDesignState.prototype.hitDetection = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return this.userUIData.selectPoint(worldPosX, worldPosY);
};

REAL3D.LayoutDesignState.prototype.connectUserPoint = function(index1, index2) {
    "use strict";
    if (index1 !== -1 && index2 !== -1) {
        this.userUIData.connectPoints(index1, index2);
    }
};

REAL3D.LayoutDesignState.prototype.createNewUserPoint = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    return this.userUIData.addNewPoint(worldPosX, worldPosY);
};

REAL3D.LayoutDesignState.prototype.finishCreatingNewUserPoint = function() {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

/*properties prototype */
REAL3D.LayoutDesignState.prototype.isMouseMoved = function(mousePosX, mousePosY) {
    "use strict";
    var dist, isMoved;
    dist = (mousePosX - this.mouseMovePos.x) * (mousePosX - this.mouseMovePos.x) + (mousePosY - this.mouseMovePos.y) * (mousePosY - this.mouseMovePos.y);
    if (dist < REAL3D.LayoutDesignState.DISTANCETHRESHOLD) {
        isMoved = true;
    } else {
        isMoved = false;
    }
    return isMoved;
};

/*properties dragPoint, translateX, translateY  */
REAL3D.LayoutDesignState.prototype.draggingUserPoint = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    this.userUIData.dragPoint(this.hitUserPointIndex, worldPosX, worldPosY);
};

REAL3D.LayoutDesignState.prototype.draggingCanvas = function(mousePosX, mousePosY) {
    "use strict";
    var worldDifX, worldDifY;
    worldDifX = this.mouseMovePos.x - mousePosX;
    worldDifY = mousePosY - this.mouseMovePos.y;
    this.cameraOrtho.translateX(worldDifX);
    this.cameraOrtho.translateY(worldDifY);
};


REAL3D.LayoutDesignState.MouseState = {
    NONE : 0,
    CREATINGUSERPOINT : 1,
    DRAGGINGUSERPOINT : 2,
    DRAGGINGCANVAS: 3,
    HITUSERPOINT : 4,
    HITCANVAS : 5
};

REAL3D.LayoutDesignState.DISTANCETHRESHOLD = 225;

/*properties UserPoint, posX, posY, neighbors */
REAL3D.LayoutDesignState.UserPoint = function(posX, posY) {
    "use strict";
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
};


/*properties push, uiData, length, uiLineRoot */
REAL3D.LayoutDesignState.UserTree = function() {
    "use strict";
    this.points = [];
    this.uiData = [];
    this.uiLineRoot = null;
};

/*properties SphereGeometry, MeshBasicMaterial, color, Mesh, center, add, remove, LineBasicMaterial, Geometry, Object3D, vertices, Vector3, Line, updateUiConnection*/
REAL3D.LayoutDesignState.UserTree.prototype = {
    addNewPoint : function(worldPosX, worldPosY) {
        "use strict";
        var newUserPoint, geometry, material, newUIData;
        newUserPoint = new REAL3D.LayoutDesignState.UserPoint(worldPosX, worldPosY);
        this.points.push(newUserPoint);
        geometry = new THREE.SphereGeometry(5, 32, 32);
        material = new THREE.MeshBasicMaterial({color: 0x0e0efe});
        newUIData = new THREE.Mesh(geometry, material);
        newUIData.position.set(worldPosX, worldPosY, 0);
        this.uiData.push(newUIData);
        REAL3D.RenderManager.center.add(newUIData);
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

    deletePoint : function(index) {
        "use strict";
    },

    deleteEdge : function(index1, index2) {
        "use strict";
    },

    selectPoint : function(worldPosX, worldPosY) {
        "use strict";
        var pid, dist, curPoint, pointLen;
        pointLen = this.points.length;
        for (pid = 0; pid < pointLen; pid++) {
            curPoint = this.points[pid];
            if (curPoint !== undefined && curPoint !== null) {
                dist = (worldPosX - curPoint.posX) * (worldPosX - curPoint.posX) + (worldPosY - curPoint.posY) * (worldPosY - curPoint.posY);
                if (dist < REAL3D.LayoutDesignState.DISTANCETHRESHOLD) {
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
            REAL3D.RenderManager.center.add(this.uiLineRoot);
        } else {
            REAL3D.RenderManager.center.remove(this.uiLineRoot);
            this.uiLineRoot = new THREE.Object3D();
            REAL3D.RenderManager.center.add(this.uiLineRoot);
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




///////////////////////////////////////////////////////////////////////////////
/*properties StateManager, enterState, switchCurrentState */
function enterDesignSpaceState() {
    "use strict";
    var layoutDesignState = new REAL3D.LayoutDesignState();
    REAL3D.StateManager.enterState(layoutDesignState);
}

function switchToHelloState() {
    "use strict";
    REAL3D.StateManager.switchCurrentState("HelloState");
}

function switchToDesignSpaceState() {
    "use strict";
    REAL3D.StateManager.switchCurrentState("LayoutDesignState");
}