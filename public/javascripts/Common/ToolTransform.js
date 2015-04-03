/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.TransformTool = {
};

REAL3D.TransformTool.TransformType = {
    NONE: 0,
    TRANSLATEX: 1,
    TRANSLATEY: 2,
    TRANSLATEZ: 3,
    ROTATEX: 4,
    ROTATEY: 5,
    ROTATEZ: 6,
    SCALEX: 7,
    SCALEY: 8,
    SCALEZ: 9
};

REAL3D.TransformTool.HITVERTEXRADIUS = 0.0005;

REAL3D.TransformTool.RefFrame = function () {
    "use strict";
    this.refSize = null;
    this.curTransform = null;
    this.ctlPointsTranslate = null;
    this.ctlPointsRotate = null;
    this.ctlPointsScale = null;
    this.centerPoint = null;
    this.axes = null;
    this.drawParent = null;
    this.drawObject = null;
    this.mouseMovePos = null;
    this.mouseState = null;
};

REAL3D.TransformTool.RefFrame.prototype.init = function (centerPos, yDir, xDir, refSize, drawParent) {
    "use strict";
    this.refSize = refSize;
    this.curTransform = {
        type: REAL3D.TransformTool.TransformType.NONE,
        value: 0
    };
    this.drawParent = drawParent;
    this.drawObject = new THREE.Object3D();
    this.drawParent.add(this.drawObject);
    //update this.drawObject world matrix

    this.draw();
    this.mouseMovePos = new REAL3D.Vector2(0, 0);
    this.mouseState = REAL3D.TransformTool.TransformType.NONE;
};

REAL3D.TransformTool.RefFrame.prototype.mouseDown = function (mouseNormPosX, mouseNormPosY, worldMatrix, cameraProjectMatrix) {
    "use strict";
    //hit detection
    if (this.hitDetection(mouseNormPosX, mouseNormPosY, worldMatrix, cameraProjectMatrix)) {
        this.curTransform.type = this.mouseState;
        //judge control direction
        this.draw();
        return true;
    }
    return false;
};

REAL3D.TransformTool.RefFrame.prototype.mouseMove = function (mouseNormPosX, mouseNormPosY) {
    "use strict";
    return false;
};

REAL3D.TransformTool.RefFrame.prototype.mouseUp = function (mouseNormPosX, mouseNormPosY) {
    "use strict";
    return false;
};

REAL3D.TransformTool.RefFrame.prototype.hitDetection = function (mouseNormPosX, mouseNormPosY, cameraProjectMatrix) {
    "use strict";
    var pid, worldPos, vDist, minDist;
    this.drawObject.updateMatrixWorld();
    minDist = 1;
    if (this.ctlPointsTranslate !== null) {
        for (pid = 0; pid < this.ctlPointsTranslate.length; pid++) {
            worldPos = this.ctlPointsTranslate[pid].getWorldPosition();
            worldPos.applyProjection(cameraProjectMatrix);
            vDist = (mouseNormPosX - worldPos.x) * (mouseNormPosX - worldPos.x) + (mouseNormPosY - worldPos.y) * (mouseNormPosY - worldPos.y);
            vDist = vDist / 2;
            if (vDist < minDist) {
                this.mouseState = REAL3D.TransformTool.TransformType.TRANSLATEX + pid;
                minDist = vDist;
            }
        }
    }
    if (this.ctlPointsRotate !== null) {
        for (pid = 0; pid < this.ctlPointsRotate.length; pid++) {
            worldPos = this.ctlPointsRotate[pid].getWorldPosition();
            worldPos.applyProjection(cameraProjectMatrix);
            vDist = (mouseNormPosX - worldPos.x) * (mouseNormPosX - worldPos.x) + (mouseNormPosY - worldPos.y) * (mouseNormPosY - worldPos.y);
            if (vDist < minDist) {
                this.mouseState = REAL3D.TransformTool.TransformType.ROTATEX + pid;
                minDist = vDist;
            }
        }
    }
    if (this.ctlPointsScale !== null) {
        for (pid = 0; pid < this.ctlPointsScale.length; pid++) {
            worldPos = this.ctlPointsScale[pid].getWorldPosition();
            worldPos.applyProjection(cameraProjectMatrix);
            vDist = (mouseNormPosX - worldPos.x) * (mouseNormPosX - worldPos.x) + (mouseNormPosY - worldPos.y) * (mouseNormPosY - worldPos.y);
            if (vDist < minDist) {
                this.mouseState = REAL3D.TransformTool.TransformType.SCALEX + pid;
                minDist = vDist;
            }
        }
    }
    if (minDist < REAL3D.TransformTool.HITVERTEXRADIUS) {
        return true;
    } else {
        this.mouseState = REAL3D.TransformTool.TransformType.NONE;
        return false;
    }
};

REAL3D.TransformTool.RefFrame.prototype.draw = function () {
    "use strict";
    this.releaseDraw();
    this.ctlPointsScale = [];
    this.ctlPointsRotate = [];
    this.ctlPointsTranslate = [];
    this.axes = [];

    var selectedMaterial, centerBallSize, sideBallSize, axisTopRadius, axisDownRadius, arrowRadius, material, materialX, materialY, materialZ, geometry, mesh, scalePos, rotatePos, halfAxisLen, rotateQ, halfArrowLen, rotateLen, halfRotatePos, halfScalePos, rotateDir;
    //draw ref object
    scalePos = 0.4 * this.refSize;
    rotatePos = 0.35 * this.refSize;
    halfAxisLen = 0.4 * this.refSize;
    halfArrowLen = 0.1 * this.refSize;
    centerBallSize = this.refSize * 0.05;
    sideBallSize = this.refSize * 0.035;
    axisTopRadius = this.refSize * 0.0075;
    axisDownRadius = this.refSize * 0.01;
    arrowRadius = this.refSize * 0.05;

    material = new THREE.MeshPhongMaterial({color: 0xeeee2b, specular: 0x101010, shininess: 10});
    geometry = new THREE.SphereGeometry(centerBallSize, 8, 8);
    this.centerPoint = new THREE.Mesh(geometry, material);
    this.drawObject.add(this.centerPoint);

    selectedMaterial = new THREE.MeshPhongMaterial({color: 0x2b2b2b, specular: 0x101010, shininess: 10});
    materialX = new THREE.MeshPhongMaterial({color: 0xee2b8b, specular: 0x101010, shininess: 10});
    materialY = new THREE.MeshPhongMaterial({color: 0x8bee2b, specular: 0x101010, shininess: 10});
    materialZ = new THREE.MeshPhongMaterial({color: 0x2b8bee, specular: 0x101010, shininess: 10});
    geometry = new THREE.SphereGeometry(sideBallSize, 8, 8);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.SCALEX) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialX);
    }
    mesh.position.set(scalePos, 0, 0);
    this.drawObject.add(mesh);
    this.ctlPointsScale.push(mesh);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.SCALEY) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialY);
    }
    mesh.position.set(0, scalePos, 0);
    this.drawObject.add(mesh);
    this.ctlPointsScale.push(mesh);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.SCALEZ) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialZ);
    }
    mesh.position.set(0, 0, scalePos);
    this.drawObject.add(mesh);
    this.ctlPointsScale.push(mesh);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.ROTATEX) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialX);
    }
    mesh.position.set(0, rotatePos, rotatePos);
    this.drawObject.add(mesh);
    this.ctlPointsRotate.push(mesh);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.ROTATEY) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialY);
    }
    mesh.position.set(rotatePos, 0, rotatePos);
    this.drawObject.add(mesh);
    this.ctlPointsRotate.push(mesh);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.ROTATEZ) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialZ);
    }
    mesh.position.set(rotatePos, rotatePos, 0);
    this.drawObject.add(mesh);
    this.ctlPointsRotate.push(mesh);

    material = new THREE.MeshPhongMaterial({color: 0xddeded, specular: 0x101010, shininess: 10});
    geometry = new THREE.CylinderGeometry(axisTopRadius, axisDownRadius, halfAxisLen * 2, 8);

    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(halfAxisLen);
    this.drawObject.add(mesh);
    this.axes.push(mesh);
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateX(halfAxisLen);
    rotateQ = new THREE.Quaternion();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateZ(halfAxisLen);
    rotateQ = new THREE.Quaternion();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);

    rotateLen = Math.sqrt(rotatePos * rotatePos + (rotatePos - scalePos) * (rotatePos - scalePos));
    geometry = new THREE.CylinderGeometry(axisTopRadius, axisDownRadius, rotateLen, 8);
    halfRotatePos = rotatePos / 2;
    halfScalePos = scalePos / 2;
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateX(halfRotatePos);
    mesh.translateY(halfScalePos + halfRotatePos);
    rotateQ = new THREE.Quaternion();
    rotateDir = new THREE.Vector3(rotatePos, rotatePos - scalePos, 0);
    rotateDir.normalize();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(halfRotatePos);
    mesh.translateX(halfScalePos + halfRotatePos);
    rotateQ = new THREE.Quaternion();
    rotateDir = new THREE.Vector3(rotatePos - scalePos, rotatePos, 0);
    rotateDir.normalize();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(halfRotatePos);
    mesh.translateZ(halfScalePos + halfRotatePos);
    rotateQ = new THREE.Quaternion();
    rotateDir = new THREE.Vector3(0, rotatePos, rotatePos - scalePos);
    rotateDir.normalize();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateZ(halfRotatePos);
    mesh.translateY(halfScalePos + halfRotatePos);
    rotateQ = new THREE.Quaternion();
    rotateDir = new THREE.Vector3(0, rotatePos - scalePos, rotatePos);
    rotateDir.normalize();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.translateZ(halfRotatePos);
    mesh.translateX(halfScalePos + halfRotatePos);
    rotateQ = new THREE.Quaternion();
    rotateDir = new THREE.Vector3(rotatePos - scalePos, 0, rotatePos);
    rotateDir.normalize();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateX(halfRotatePos);
    mesh.translateZ(halfScalePos + halfRotatePos);
    rotateQ = new THREE.Quaternion();
    rotateDir = new THREE.Vector3(rotatePos, 0, rotatePos - scalePos);
    rotateDir.normalize();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.axes.push(mesh);

    geometry = new THREE.CylinderGeometry(0, arrowRadius, halfArrowLen * 2, 8);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.TRANSLATEX) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialX);
    }
    mesh.translateX(halfAxisLen * 2 + halfArrowLen);
    rotateQ = new THREE.Quaternion();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.ctlPointsTranslate.push(mesh);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.TRANSLATEY) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialY);
    }
    mesh.translateY(halfAxisLen * 2 + halfArrowLen);
    this.drawObject.add(mesh);
    this.ctlPointsTranslate.push(mesh);

    if (this.curTransform.type === REAL3D.TransformTool.TransformType.TRANSLATEZ) {
        mesh = new THREE.Mesh(geometry, selectedMaterial);
    } else {
        mesh = new THREE.Mesh(geometry, materialZ);
    }
    mesh.translateZ(halfAxisLen * 2 + halfArrowLen);
    rotateQ = new THREE.Quaternion();
    rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
    mesh.setRotationFromQuaternion(rotateQ);
    this.drawObject.add(mesh);
    this.ctlPointsTranslate.push(mesh);
};

REAL3D.TransformTool.RefFrame.prototype.releaseDraw = function () {
    "use strict";
    var objectId;
    if (this.ctlPointsTranslate !== null) {
        for (objectId = 0; objectId < this.ctlPointsTranslate.length; objectId++) {
            this.drawObject.remove(this.ctlPointsTranslate[objectId]);
        }
        this.ctlPointsTranslate = null;
    }
    if (this.ctlPointsRotate !== null) {
        for (objectId = 0; objectId < this.ctlPointsRotate.length; objectId++) {
            this.drawObject.remove(this.ctlPointsRotate[objectId]);
        }
        this.ctlPointsRotate = null;
    }
    if (this.ctlPointsScale !== null) {
        for (objectId = 0; objectId < this.ctlPointsScale.length; objectId++) {
            this.drawObject.remove(this.ctlPointsScale[objectId]);
        }
        this.ctlPointsScale = null;
    }
    if (this.centerPoint !== null) {
        this.drawObject.remove(this.centerPoint);
        this.centerPoint = null;
    }
    if (this.axes !== null) {
        for (objectId = 0; objectId < this.axes.length; objectId++) {
            this.drawObject.remove(this.axes[objectId]);
        }
        this.axes = null;
    }
};
