/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.CageModeling.CageData = {
    cageMesh: null,
    pickTool: null,
    cageModel: null,
    drawObject: null,
    pickedObject: null
};

REAL3D.CageModeling.CageData.init = function (cageData) {
    "use strict";
    this.releaseData();
    //init data
    if (cageData !== null) {
    } else {
        this.cageMesh = new REAL3D.MeshModel.HMesh();
    }
    //
    if (this.pickTool === null) {
        this.pickTool = new REAL3D.PickTool.PickHMesh();
    }
    this.pickTool.setMesh(this.cageMesh);
    this.draw();
};

REAL3D.CageModeling.CageData.draw = function () {
    "use strict";
    this.releaseDraw();
    this.drawObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.drawObject);
    //draw
    if (this.cageMesh !== null) {
        this.cageModel = new REAL3D.CageModel.Cage(this.cageMesh, this.drawObject);
    }
};

REAL3D.CageModeling.CageData.drawPickedObject = function () {
    "use strict";
    this.releaseDrawPickedObject();
    this.pickedObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.pickedObject);
    //draw picked objects
    var pickedVertex, material, geometry, ball, pid, vPos;
    if (this.pickTool !== null) {
        pickedVertex = this.pickTool.getPickedVertex();
        material = new THREE.MeshBasicMaterial({color: 0xbb6b6b});
        for (pid = 0; pid < pickedVertex.length; pid++) {
            vPos = this.cageMesh.getVertex(pickedVertex[pid]).getPosition();
            geometry = new THREE.SphereGeometry(6, 6, 6);
            ball = new THREE.Mesh(geometry, material);
            ball.position.set(vPos.getX(), vPos.getY(), vPos.getZ());
            this.pickedObject.add(ball);
        }
    }
};

REAL3D.CageModeling.CageData.releaseDrawPickedObject = function () {
    "use strict";
    if (this.pickedObject !== null) {
        REAL3D.RenderManager.scene.remove(this.pickedObject);
        this.pickedObject = null;
    }
};

REAL3D.CageModeling.CageData.releaseDraw = function () {
    "use strict";
    if (this.cageModel !== null) {
        this.cageModel.remove();
        this.cageModel = null;
    }
    if (this.drawObject !== null) {
        REAL3D.RenderManager.scene.remove(this.drawObject);
        this.drawObject = null;
    }
};

REAL3D.CageModeling.CageData.loadData = function () {
    "use strict";
};

REAL3D.CageModeling.CageData.releaseData = function () {
    "use strict";
    this.releaseDraw();
    this.cageModel = null;
    this.cageMesh = null;
    this.drawObject = null;
};

REAL3D.CageModeling.CageData.saveData = function () {
    "use strict";
};

REAL3D.CageModeling.CageData.createBoxMesh = function (cenPosX, cenPosY, cenPosZ, lenX, lenY, lenZ) {
    "use strict";
    if (this.cageModel !== null) {
        this.cageModel.remove();
        this.cageModel = null;
    }
    this.cageMesh = REAL3D.MeshModel.createBoxMesh(cenPosX, cenPosY, cenPosZ, lenX, lenY, lenZ);
    this.pickTool.setMesh(this.cageMesh);
    this.draw();
};

REAL3D.CageModeling.CageData.pickVertex = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    if (this.pickTool !== null) {
        var isPicked = this.pickTool.pickVertex(worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY);
        this.drawPickedObject();
        return isPicked;
    }
    return false;
};

REAL3D.CageModeling.CageData.pickEdge = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    return false;
};

REAL3D.CageModeling.CageData.pickFace = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    return false;
};
