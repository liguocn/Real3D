/*jslint plusplus: true */
/*global REAL3D, THREE, console, window, document, $ */

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView = {
    canvasOffset: null,
    winW: null,
    winH: null,
    camera: null,
    controlObject: null,
    controlObjectHeight: null,
    moveSpeed: null,
    turnSpeed: null,
    timeStamp: null,
    isMouseDown: null,
    mouseMovePos: null,
    vMoveState: null,
    pathEdge: null,
    startPathPoint: null
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.PerspectiveCamera(45, winW / winH, 1, 2000);
        this.controlObject = new THREE.Object3D();
        this.controlObjectHeight = 100;
        this.controlObject.add(this.camera);
        REAL3D.RenderManager.scene.add(this.controlObject);

        this.startPathPoint = REAL3D.InnerSpaceDesignEdit.ViewPathData.pathTree.pathPoints[0];
        this.controlObject.position.set(this.startPathPoint.userPoint.pos.getX(), this.startPathPoint.userPoint.pos.getY(), this.controlObjectHeight);
        this.controlObject.rotateX(1.570796326794897);
        this.controlObject.up = new THREE.Vector3(0, 0, 1);

        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
        this.moveSpeed = 0.2;
        this.turnSpeed = 0.003;
        this.pathEdge = this.startPathPoint.edges[0];

        this.moveControlObject(0);
    }
    this.timeStamp = 0;
    this.isMouseDown = false;
    this.mouseMovePos = new REAL3D.Vector2(0, 0);
    this.vMoveState = REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.NONE;
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.update = function (timestamp) {
    "use strict";
    if (this.vMoveState !== REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.NONE) {
        var deltaTime, moveLen;
        deltaTime = timestamp - this.timeStamp;
        moveLen = this.moveSpeed * deltaTime;
        if (this.vMoveState === REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState.BACK) {
            moveLen = moveLen * (-1);
        }
        this.moveControlObject(moveLen);
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

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.calControlDir = function () {
    "use strict";
    var endPathPoint, controlDir;
    if (this.pathEdge.pathPoints[0] === this.startPathPoint) {
        endPathPoint = this.pathEdge.pathPoints[1];
    } else {
        endPathPoint = this.pathEdge.pathPoints[0];
    }
    controlDir = new REAL3D.Vector2.sub(endPathPoint.userPoint.pos, this.startPathPoint.userPoint.pos);
    controlDir.unify();
    return controlDir;
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.moveControlObject = function (moveLen) {
    "use strict";
    // var controlDir = this.calControlDir();
    // var lookatPos = new THREE.Vector3(this.controlObject.position.x, this.controlObject.position.y, this.controlObject.position.z);
    // lookatPos.sub(new THREE.Vector3(controlDir.getX(), controlDir.getY(), 0));
    // this.controlObject.lookAt(lookatPos);
    var endPathPoint, controlPos, pathLeftLen, moveDir, newControlPos, lookatPos;
    if (this.pathEdge.pathPoints[0] === this.startPathPoint) {
        endPathPoint = this.pathEdge.pathPoints[1];
    } else {
        endPathPoint = this.pathEdge.pathPoints[0];
    }
    controlPos = new REAL3D.Vector2(this.controlObject.position.x, this.controlObject.position.y);
    if (moveLen >= 0) {
        pathLeftLen = REAL3D.Vector2.sub(endPathPoint.userPoint.pos, controlPos).length();
        console.log("pathLeftLen: ", pathLeftLen);
        if (moveLen < pathLeftLen) {
            moveDir = new REAL3D.Vector2.sub(endPathPoint.userPoint.pos, this.startPathPoint.userPoint.pos);
            moveDir.unify();
            console.log("moveDir: ", moveDir.getX(), moveDir.getY());
            newControlPos = REAL3D.Vector2.add(controlPos, moveDir.multiply(moveLen));
            console.log("newControlPos: ", newControlPos.getX(), newControlPos.getY());
            lookatPos = new THREE.Vector3(newControlPos.getX(), newControlPos.getY(), this.controlObjectHeight);
            console.log("lookatPos: ", lookatPos.x, lookatPos.y, lookatPos.z);
            lookatPos.sub(new THREE.Vector3(moveDir.getX(), moveDir.getY(), 0));
            console.log("lookatPos: ", lookatPos.x, lookatPos.y, lookatPos.z);
            this.controlObject.position.set(newControlPos.getX(), newControlPos.getY(), this.controlObjectHeight);
            this.controlObject.lookAt(lookatPos);
        } else {

        }
    } else {

    }
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.moveCamera = function (cameraDir, moveLen) {
    "use strict";
    //console.log("moveCamera: ", cameraDir.x, cameraDir.y, moveLen);
    var pathNode0, pathNode1, pathDir, moveDir, endNode, startPathPoint, endPathPoint, cameraPos, pathLeftLen, nextEdgeLen, lookatPos, nextPathPoint;
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
        lookatPos = new THREE.Vector3(cameraPos.getX(), cameraPos.getY(), 100);
        lookatPos.add(new THREE.Vector3(moveDir.getX(), moveDir.getY(), 0));
        this.camera.lookAt(lookatPos);
        console.log("move stop: ", pathLeftLen, moveLen);
    } else {
        moveLen = moveLen - pathLeftLen;
        nextEdgeLen = endPathPoint.edges.length;
        if (nextEdgeLen === 2) {
            this.camera.position.set(endPathPoint.userPoint.pos.getX(), endPathPoint.userPoint.pos.getY(), 100);
            if (endPathPoint.edges[0].pathPoints[0] === startPathPoint || endPathPoint.edges[0].pathPoints[1] === startPathPoint) {
                this.pathEdge = endPathPoint.edges[1];
            } else {
                this.pathEdge = endPathPoint.edges[0];
            }
            if (this.pathEdge.pathPoints[0] === endPathPoint) {
                nextPathPoint = this.pathEdge.pathPoints[1];
            } else {
                nextPathPoint = this.pathEdge.pathPoints[0];
            }
            moveDir = REAL3D.Vector2.sub(nextPathPoint.userPoint.pos, endPathPoint.userPoint.pos);
            moveDir.unify();
            lookatPos = new THREE.Vector3(cameraPos.getX(), cameraPos.getY(), 100);
            lookatPos.add(new THREE.Vector3(moveDir.getX(), moveDir.getY(), 0));
            this.camera.lookAt(lookatPos);
            console.log("move on");
            this.moveCamera(cameraDir, moveLen);
        } else if (nextEdgeLen > 2) {
            console.log("nextEdgeLen: ", nextEdgeLen);
        } else {
            //console.log("error: ", nextEdgeLen);
        }
    }
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState = {
    NONE: 0,
    FORWARD: 1,
    BACK: 2
};
