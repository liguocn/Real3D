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

        this.controlObject.position.set(0, 0, this.controlObjectHeight);
        this.controlObject.rotateX(1.570796326794897);
        this.controlObject.up = new THREE.Vector3(0, 0, 1);

        //first time init
        this.canvasOffset = canvasOffset;
        this.winW = winW;
        this.winH = winH;
        this.moveSpeed = 0.15;
        this.turnSpeed = 0.003;
    }
    this.startPathPoint = null;
    this.pathEdge = null;
    if (REAL3D.InnerSpaceDesignEdit.ViewPathData.smoothPathTree !== null) {
        if (REAL3D.InnerSpaceDesignEdit.ViewPathData.smoothPathTree.pathPoints.length > 1) {
            this.startPathPoint = REAL3D.InnerSpaceDesignEdit.ViewPathData.smoothPathTree.pathPoints[0];
            this.pathEdge = this.startPathPoint.edges[0];
            this.controlObject.position.set(this.startPathPoint.userPoint.pos.getX(), this.startPathPoint.userPoint.pos.getY(), this.controlObjectHeight);
            this.moveControlObject(0);
        }
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
        // this.frameTime += deltaTime;
        // this.frameCount++;
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
        //console.log("frame rate: ", this.frameCount / this.frameTime, " count: ", this.frameCount, " time:", this.frameTime);
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
    if (this.startPathPoint !== null && this.pathEdge !== null) {
        var endPathPoint, controlPos, pathLeftLen, moveDir, newControlPos;
        if (this.pathEdge.pathPoints[0] === this.startPathPoint) {
            endPathPoint = this.pathEdge.pathPoints[1];
        } else {
            endPathPoint = this.pathEdge.pathPoints[0];
        }
        controlPos = new REAL3D.Vector2(this.controlObject.position.x, this.controlObject.position.y);
        if (moveLen >= 0) {
            pathLeftLen = REAL3D.Vector2.sub(endPathPoint.userPoint.pos, controlPos).length();
            if (moveLen < pathLeftLen) {
                moveDir = new REAL3D.Vector2.sub(endPathPoint.userPoint.pos, this.startPathPoint.userPoint.pos);
                moveDir.unify();
                newControlPos = REAL3D.Vector2.add(controlPos, REAL3D.Vector2.scale(moveDir, moveLen));
                this.controlObject.position.set(newControlPos.getX(), newControlPos.getY(), this.controlObjectHeight);
            } else {
                moveLen = moveLen - pathLeftLen;
                this.controlObject.position.set(endPathPoint.userPoint.pos.getX(), endPathPoint.userPoint.pos.getY(), this.controlObjectHeight);
                if (endPathPoint.edges.length === 2) {
                    this.startPathPoint = endPathPoint;
                    if (endPathPoint.edges[0] === this.pathEdge) {
                        this.pathEdge = endPathPoint.edges[1];
                    } else {
                        this.pathEdge = endPathPoint.edges[0];
                    }
                    this.moveControlObject(moveLen);
                }
            }
        } else {
            pathLeftLen = REAL3D.Vector2.sub(this.startPathPoint.userPoint.pos, controlPos).length();
            moveLen = moveLen * (-1);
            if (moveLen < pathLeftLen) {
                moveDir = new REAL3D.Vector2.sub(this.startPathPoint.userPoint.pos, endPathPoint.userPoint.pos);
                moveDir.unify();
                newControlPos = REAL3D.Vector2.add(controlPos, REAL3D.Vector2.scale(moveDir, moveLen));
                this.controlObject.position.set(newControlPos.getX(), newControlPos.getY(), this.controlObjectHeight);
            } else {
                moveLen = moveLen - pathLeftLen;
                this.controlObject.position.set(this.startPathPoint.userPoint.pos.getX(), this.startPathPoint.userPoint.pos.getY(), this.controlObjectHeight);
                if (this.startPathPoint.edges.length === 2) {
                    if (this.startPathPoint.edges[0] === this.pathEdge) {
                        this.pathEdge = this.startPathPoint.edges[1];
                    } else {
                        this.pathEdge = this.startPathPoint.edges[0];
                    }
                    if (this.pathEdge.pathPoints[0] === this.startPathPoint) {
                        this.startPathPoint = this.pathEdge.pathPoints[1];
                    } else {
                        this.startPathPoint = this.pathEdge.pathPoints[0];
                    }
                    this.moveControlObject(moveLen * (-1));
                }
            }
        }
    }
};

REAL3D.InnerSpaceDesignEdit.PathConstrainedRoamView.MoveState = {
    NONE: 0,
    FORWARD: 1,
    BACK: 2
};
