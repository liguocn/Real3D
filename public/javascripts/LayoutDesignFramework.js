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

/*properties updateUserUIDataDisplay, hitDetection, addHittedUserPointNeighbor, createNewUserPoint, finishCreatingNewUserPoint, isMouseMoved, draggingUserPoint, draggingCanvas */
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

/*properties x, y */
REAL3D.LayoutDesignState.prototype.mouseDown = function(e) {
    "use strict";
    var curPosX, curPosY, isHittingTheSamePos, isHitted;
    //test    
    this.mousePos.set(e.pageX - this.canvasOffset.left, e.pageY - this.canvasOffset.top);
    this.isMouseDown = true;
    console.log("LayoutDesignState MouseDown: ", e.pageX - this.canvasOffset.left, e.pageY - this.canvasOffset.top);
    //
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    isHittingTheSamePos = (curPosX === this.mouseDownPos.x && curPosY === this.mouseDownPos.y);
    isHitted = this.hitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    if (this.mouseState === REAL3D.LayoutDesignState.MouseState.NONE) {
        if (isHitted) {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.HITUSERPOINT;
        } else {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.HITCANVAS;
        }
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT) {
        if (isHittingTheSamePos) {
            this.finishCreatingNewUserPoint();
            this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
        } else {
            if (isHitted) {
                this.addHittedUserPointNeighbor();
            } else {
                this.createNewUserPoint(curPosX, curPosY);
            }
        }
    }
    this.mouseDownPos.set(curPosX, curPosY);
    this.mouseMovePos.set(curPosX, curPosY);
};

/*properties scene, getObjectByName, rotateXGlobal, rotateYGlobal */
REAL3D.LayoutDesignState.prototype.mouseMove = function(e) {
    "use strict";
    var offset, eltx, elty, mouseDifX, mouseDifY, rotateObj, curPosX, curPosY;
    //test
    if (this.isMouseDown) {
        offset = $(REAL3D.RenderManager.renderer.domElement).offset();
        eltx = e.pageX - offset.left;
        elty = e.pageY - offset.top;
        mouseDifX = eltx - this.mousePos.x;
        mouseDifY = elty - this.mousePos.y;
        rotateObj = REAL3D.RenderManager.scene.getObjectByName("root", true);
        rotateObj.rotateXGlobal(mouseDifY / 300);
        rotateObj.rotateYGlobal(mouseDifX / 300);
        this.mousePos.set(eltx, elty);
    }
    //

    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.LayoutDesignState.MouseState.HITUSERPOINT) {
        if (this.isMouseMoved(curPosX, curPosY)) {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT;
            this.draggingUserPoint();
        }
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint();
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.HITCANVAS) {
        if (this.isMouseMoved(curPosX, curPosY)) {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS;
            this.draggingCanvas();
        }
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas();
    }

    this.mouseMovePos.set(curPosX, curPosY);
};

REAL3D.LayoutDesignState.prototype.mouseUp = function(e) {
    "use strict";
    var curPosX, curPosY;
    //test
    this.isMouseDown = false;
    //

    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT) {
        this.draggingUserPoint();
        this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS) {
        this.draggingCanvas();
        this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
    } else if (this.mouseState === REAL3D.LayoutDesignState.MouseState.HITUSERPOINT) {
        this.addHittedUserPointNeighbor();
        this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
    } else if (this.MouseState === REAL3D.LayoutDesignState.MouseState.HITCANVAS) {
        this.createNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
    }
};

REAL3D.LayoutDesignState.prototype.updateUserUIDataDisplay = function() {
    "use strict";
};

REAL3D.LayoutDesignState.prototype.hitDetection = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, isHitted;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    this.hitUserPointIndex = this.userUIData.selectPoint(worldPosX, worldPosY);
    if (this.hitUserPointIndex > -1) {
        isHitted = true;
    } else {
        isHitted = false;
    }
    return isHitted;
};

REAL3D.LayoutDesignState.prototype.addHittedUserPointNeighbor = function() {
    "use strict";
    if (this.lastCreatedPointIndex > -1) {
        this.userUIData.connectPoints(this.lastCreatedPointIndex, this.hitUserPointIndex);
    }
    this.lastCreatedPointIndex = this.hitUserPointIndex;
};

REAL3D.LayoutDesignState.prototype.createNewUserPoint = function(mousePosX, mousePosY) {
    "use strict";
    var cameraPos, worldPosX, worldPosY, newPointId;
    mousePosY = this.winH - mousePosY;
    cameraPos = this.cameraOrtho.position;
    worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    newPointId = this.userUIData.addNewPoint(worldPosX, worldPosY);
    this.userUIData.connectPoints(this.lastCreatedPointIndex, newPointId);
    this.lastCreatedPointIndex = newPointId;
};

REAL3D.LayoutDesignState.prototype.finishCreatingNewUserPoint = function() {
    "use strict";
    this.lastCreatedPointIndex = -1;
};

REAL3D.LayoutDesignState.prototype.isMouseMoved = function(mousePosX, mousePosY) {
    "use strict";
    return false;
};

REAL3D.LayoutDesignState.prototype.draggingUserPoint = function() {
    "use strict";
};

REAL3D.LayoutDesignState.prototype.draggingCanvas = function() {
    "use strict";
};


REAL3D.LayoutDesignState.MouseState = {
    NONE : 0,
    CREATINGUSERPOINT : 1,
    DRAGGINGUSERPOINT : 2,
    DRAGGINGCANVAS: 3,
    HITUSERPOINT : 4,
    HITCANVAS : 5
};

/*properties prototype, DISTANCETHRESHOLD */
REAL3D.LayoutDesignState.prototype.DISTANCETHRESHOLD = 10;

/*properties UserPoint, posX, posY, neighbors */
REAL3D.LayoutDesignState.UserPoint = function(posX, posY) {
    "use strict";
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
};


/*properties push */
REAL3D.LayoutDesignState.UserTree = function() {
    "use strict";
    this.points = [];
    this.curLastId = -1;
};

REAL3D.LayoutDesignState.UserTree.prototype = {
    addNewPoint : function(userPoint) {
        "use strict";
        this.curLastId++;
        this.points.push(userPoint);
        return this.curLastId;
    },

    connectPoints : function(index1, index2) {
        "use strict";
        this.points[index1].neighbors.push(this.points[index2]);
        this.points[index2].neighbors.push(this.points[index1]);
    },

    deletePoint : function(index) {
        "use strict";
    },

    deleteEdge : function(index1, index2) {
        "use strict";
    },

    selectPoint : function(posX, posY) {
        "use strict";
        var pid, dist, curPoint;
        for (pid = 0; pid < this.curLastId; pid++) {
            curPoint = this.points[pid];
            if (curPoint !== undefined && curPoint !== null) {
                dist = (posX - curPoint.posX) * (posX - curPoint.posX) + (posY - curPoint.posY) * (posY - curPoint.posY);
                if (dist < REAL3D.LayoutDesignState.DISTANCETHRESHOLD) {
                    return pid;
                }
            }
        }
        return -1;
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