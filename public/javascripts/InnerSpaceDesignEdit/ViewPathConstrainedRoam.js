/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    moveSpeed: null,
    turnSpeed: null,
    timeStamp: null,
    isMouseDown: null,
    mouseMovePos: null,
    vMoveState: null,
    pathEdge: null
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 2000);
        this.camera.position.set(0, 0, 100);
        this.camera.rotateX(1.570796326794897);
        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
        this.moveSpeed = 0.2;
        this.turnSpeed = 0.003;
        this.pathEdge = REAL3D.InnerSpaceDesignEdit.ViewPathData.pathTree.pathEdges[0];
        this.camera.position.set(this.pathEdge.pathPoints[0].userPoint.pos.getX(),
            this.pathEdge.pathPoints[0].userPoint.pos.getY(), 100);
    }
    this.timeStamp = 0;
    this.isMouseDown = false;
    this.mouseMovePos = new REAL3D.Vector2(0, 0);
    this.vMoveState = REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.NONE;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.update = function (timestamp) {
    "use strict";
    var deltaTime, cameraDir, moveDir, moveLen;
    if (this.vMoveState !== REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.NONE) {
        deltaTime = timestamp - this.timeStamp;
        cameraDir = this.camera.getWorldDirection();
        if (this.vMoveState === REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.BACK) {
            cameraDir.multiplyScalar(-1);
            console.log("move back");
        }
        moveDir = new REAL3D.Vector2(cameraDir.x, cameraDir.y);
        moveLen = this.moveSpeed * deltaTime;
        this.moveCamera(moveDir, moveLen);
    }
    this.timeStamp = timestamp;
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.mouseDown = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = true;
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.mouseMove = function (e) {
    "use strict";
    var curPosX, curPosY, angle;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    if (this.isMouseDown) {
        angle = this.mouseMovePos.x - curPosX;
        this.camera.rotateY(this.turnSpeed * angle);
    }
    this.mouseMovePos.set(curPosX, curPosY);
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.mouseUp = function (e) {
    "use strict";
    var curPosX, curPosY;
    curPosX = e.pageX - this.canvasOffset.left;
    curPosY = e.pageY - this.canvasOffset.top;
    this.mouseMovePos.set(curPosX, curPosY);
    this.isMouseDown = false;
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.keyDown = function (e) {
    "use strict";
    if (e.which === 87) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.FORWARD;
    } else if (e.which === 83) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.BACK;
    }
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.keyUp = function (e) {
    "use strict";
    if (e.which === 87 && this.vMoveState === REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.FORWARD) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.NONE;
    } else if (e.which === 83 && this.vMoveState === REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.BACK) {
        this.vMoveState = REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.NONE;
    }
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.moveCamera = function (cameraDir, moveLen) {
    "use strict";
    //console.log("moveCamera: ", cameraDir.x, cameraDir.y, moveLen);
    var pathNode0, pathNode1, pathDir, moveDir, endNode, startPathPoint, endPathPoint, cameraPos, pathLeftLen, nextEdgeLen;
    pathNode0 = this.pathEdge.pathPoints[0].userPoint.pos;
    pathNode1 = this.pathEdge.pathPoints[1].userPoint.pos;
    pathDir = REAL3D.Vector2.sub(pathNode1, pathNode0);
    moveDir = pathDir.copyTo();
    moveDir.unify();
    if (REAL3D.Vector2.dotProduct(pathDir, cameraDir) > 0) {
        endNode = pathNode1;
        startPathPoint = this.pathEdge.pathPoints[0];
        endPathPoint = this.pathEdge.pathPoints[1];
    } else {
        endNode = pathNode0;
        startPathPoint = this.pathEdge.pathPoints[1];
        endPathPoint = this.pathEdge.pathPoints[0];
        moveDir.multiply(-1);
    }
    cameraPos = new REAL3D.Vector2(this.camera.position.x, this.camera.position.y);
    pathLeftLen = REAL3D.Vector2.sub(cameraPos, endNode).length();
    if (pathLeftLen > moveLen) {
        cameraPos.addVector(moveDir.multiply(moveLen));
        this.camera.position.set(cameraPos.getX(), cameraPos.getY(), 100);
        console.log("move stop");
    } else {
        moveLen = moveLen - pathLeftLen;
        nextEdgeLen = endPathPoint.edges.length;
        if (nextEdgeLen === 2) {
            if (endPathPoint.edges[0].pathPoints[0] === startPathPoint || endPathPoint.edges[0].pathPoints[1] === startPathPoint) {
                this.pathEdge = endPathPoint.edges[1];
            } else {
                this.pathEdge = endPathPoint.edges[0];
            }
            console.log("move on");
            this.moveCamera(cameraDir, moveLen);
        } else if (nextEdgeLen > 2) {
            console.log("nextEdgeLen: ", nextEdgeLen);
        } else {
            console.log("error: ", nextEdgeLen);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState = {
    NONE: 0,
    FORWARD: 1,
    BACK: 2
};
