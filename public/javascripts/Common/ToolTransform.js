/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.TransformTool = {
};

REAL3D.TransformTool.TransformType = {
    TRANSLATE: 0,
    ROTATE: 1,
    SCALE: 2
};

REAL3D.TransformTool.RefFrame = function () {
    "use strict";
    this.refSize = null;
    this.transformMatrix = null;
    this.curTransform = null;
    this.curTransformType = null;
    this.drawParent = null;
    this.drawObject = null;
};

REAL3D.TransformTool.RefFrame.prototype.initPosition = function (pos, yDir, xDir, refSize) {
    "use strict";
    //construct this.transformMatrix

    //
    this.refSize = refSize;
};

REAL3D.TransformTool.RefFrame.prototype.setDrawParent = function (drawParent) {
    "use strict";
    this.drawParent = drawParent;
};

REAL3D.TransformTool.RefFrame.prototype.draw = function () {
    "use strict";
    if (this.drawParent !== null) {
        if (this.drawObject !== null) {
            this.drawParent.remove(this.drawObject);
        }
        this.drawObject = new THREE.Object3D();
        this.drawParent.add(this.drawObject);

        var centerBallSize, sideBallSize, axisTopRadius, axisDownRadius, arrowRadius, material, geometry, mesh, scalePos, rotatePos, halfAxisLen, rotateQ, halfArrowLen, rotateLen, halfRotatePos, halfScalePos, rotateDir;
        //draw ref object
        scalePos = 0.4 * this.refSize;
        rotatePos = 0.35 * this.refSize;
        halfAxisLen = this.refSize * 0.4;
        halfArrowLen = this.refSize * 0.1;
        centerBallSize = this.refSize * 0.05;
        sideBallSize = this.refSize * 0.035;
        axisTopRadius = this.refSize * 0.0075;
        axisDownRadius = this.refSize * 0.01;
        arrowRadius = this.refSize * 0.05;

        material = new THREE.MeshPhongMaterial({color: 0xeebbbb, specular: 0x101010, shininess: 10});
        geometry = new THREE.SphereGeometry(centerBallSize, 8, 8);
        mesh = new THREE.Mesh(geometry, material);
        this.drawObject.add(mesh);

        material = new THREE.MeshPhongMaterial({color: 0xeeee2b, specular: 0x101010, shininess: 10});
        geometry = new THREE.SphereGeometry(sideBallSize, 8, 8);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(scalePos, 0, 0);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, scalePos, 0);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, scalePos);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(rotatePos, rotatePos, 0);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, rotatePos, rotatePos);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(rotatePos, 0, rotatePos);
        this.drawObject.add(mesh);

        material = new THREE.MeshPhongMaterial({color: 0xddeded, specular: 0x101010, shininess: 10});

        geometry = new THREE.CylinderGeometry(axisTopRadius, axisDownRadius, halfAxisLen * 2, 8);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateY(halfAxisLen);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateX(halfAxisLen);
        rotateQ = new THREE.Quaternion();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateZ(halfAxisLen);
        rotateQ = new THREE.Quaternion();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);

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
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateY(halfRotatePos);
        mesh.translateX(halfScalePos + halfRotatePos);
        rotateQ = new THREE.Quaternion();
        rotateDir = new THREE.Vector3(rotatePos - scalePos, rotatePos, 0);
        rotateDir.normalize();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);

        mesh = new THREE.Mesh(geometry, material);
        mesh.translateY(halfRotatePos);
        mesh.translateZ(halfScalePos + halfRotatePos);
        rotateQ = new THREE.Quaternion();
        rotateDir = new THREE.Vector3(0, rotatePos, rotatePos - scalePos);
        rotateDir.normalize();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateZ(halfRotatePos);
        mesh.translateY(halfScalePos + halfRotatePos);
        rotateQ = new THREE.Quaternion();
        rotateDir = new THREE.Vector3(0, rotatePos - scalePos, rotatePos);
        rotateDir.normalize();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);

        mesh = new THREE.Mesh(geometry, material);
        mesh.translateZ(halfRotatePos);
        mesh.translateX(halfScalePos + halfRotatePos);
        rotateQ = new THREE.Quaternion();
        rotateDir = new THREE.Vector3(rotatePos - scalePos, 0, rotatePos);
        rotateDir.normalize();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateX(halfRotatePos);
        mesh.translateZ(halfScalePos + halfRotatePos);
        rotateQ = new THREE.Quaternion();
        rotateDir = new THREE.Vector3(rotatePos, 0, rotatePos - scalePos);
        rotateDir.normalize();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotateDir);
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);

        material = new THREE.MeshPhongMaterial({color: 0x8bab6b, specular: 0x101010, shininess: 10});
        geometry = new THREE.CylinderGeometry(0, arrowRadius, halfArrowLen * 2, 8);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateY(halfAxisLen * 2 + halfArrowLen);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateX(halfAxisLen * 2 + halfArrowLen);
        rotateQ = new THREE.Quaternion();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);
        mesh = new THREE.Mesh(geometry, material);
        mesh.translateZ(halfAxisLen * 2 + halfArrowLen);
        rotateQ = new THREE.Quaternion();
        rotateQ.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
        mesh.setRotationFromQuaternion(rotateQ);
        this.drawObject.add(mesh);
    }
};

REAL3D.TransformTool.RefFrame.prototype.mouseDown = function () {
    "use strict";
};

REAL3D.TransformTool.RefFrame.prototype.mouseMove = function () {
    "use strict";
};

REAL3D.TransformTool.RefFrame.prototype.mouseUp = function () {
    "use strict";
};
