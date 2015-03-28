/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.CageModeling.CageData = {
    cageMesh: null,
    previewMesh: null,
    cageModel: null,
    previewModel: null,
    drawObject: null,
    pickTool: null,
    refObject: null,
    curOperation: null,
    operations: null
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
    this.operations = [];
    this.draw();
};

REAL3D.CageModeling.CageData.draw = function () {
    "use strict";
    this.releaseDraw();
    this.drawObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.drawObject);
    //draw
    if (this.previewMesh !== null) {
        console.log("  draw preview mesh");
        this.previewModel = new REAL3D.CageModel.Cage(this.previewMesh, this.drawObject);
    } else if (this.cageMesh !== null) {
        console.log("  draw cage mesh");
        this.cageModel = new REAL3D.CageModel.Cage(this.cageMesh, this.drawObject);
    }
    this.drawRefObject();
};

REAL3D.CageModeling.CageData.drawRefObject = function () {
    "use strict";
    this.releaseDrawRefObject();
    this.refObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refObject);
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
            this.refObject.add(ball);
        }
    }
};

REAL3D.CageModeling.CageData.releaseDrawRefObject = function () {
    "use strict";
    if (this.refObject !== null) {
        REAL3D.RenderManager.scene.remove(this.refObject);
        this.refObject = null;
    }
};

REAL3D.CageModeling.CageData.releaseDraw = function () {
    "use strict";
    if (this.previewModel !== null) {
        this.previewModel.remove();
        this.previewModel = null;
    }
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

REAL3D.CageModeling.CageData.setCurOperation = function (operation) {
    "use strict";
    this.curOperation = operation;
};

REAL3D.CageModeling.CageData.getCurOperation = function () {
    "use strict";
    return this.curOperation;
};

REAL3D.CageModeling.CageData.previewOperation = function () {
    "use strict";
    if (this.curOperation !== null) {
        this.previewMesh = this.curOperation.preview();
        console.log(" previewMesh: ", this.previewMesh);
        this.draw();
    }
};

REAL3D.CageModeling.CageData.generateOperation = function () {
    "use strict";
    if (this.curOperation !== null) {
        this.previewMesh = null;
        this.cageMesh = this.curOperation.generate();
        this.operations.push(this.curOperation);
        this.operation = null;
        this.draw();
    }
};

// REAL3D.CageModeling.CageData.previewBoxMesh = function (cenPosX, cenPosY, cenPosZ, lenX, lenY, lenZ) {
//     "use strict";
//     if (this.cageModel !== null) {
//         this.cageModel.remove();
//         this.cageModel = null;
//     }
//     var createTool = new REAL3D.MeshModel.CreateBox(cenPosX, cenPosY, cenPosZ, lenX, lenY, lenZ);
//     this.cageMesh = createTool.generate();
//     this.draw();
// };

// REAL3D.CageModeling.CageData.createBoxMesh = function (cenPosX, cenPosY, cenPosZ, lenX, lenY, lenZ) {
//     "use strict";
//     if (this.cageModel !== null) {
//         this.cageModel.remove();
//         this.cageModel = null;
//     }
//     var createTool = new REAL3D.MeshModel.CreateBox(cenPosX, cenPosY, cenPosZ, lenX, lenY, lenZ);
//     this.cageMesh = createTool.generate();
//     this.pickTool.setMesh(this.cageMesh);
//     this.operations.push(createTool);
//     this.draw();
// };

REAL3D.CageModeling.CageData.pickVertex = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    if (this.pickTool !== null) {
        var isPicked = this.pickTool.pickVertex(worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY);
        this.draw();
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
