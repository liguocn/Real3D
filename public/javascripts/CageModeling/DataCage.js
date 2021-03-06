/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console, document, window, $ */

REAL3D.CageModeling.CageData = {
    cageMesh: null,
    previewMesh: null,
    cageModel: null,
    previewModel: null,
    subdivideModel: null,
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
        //console.log("  draw preview mesh");
        this.previewModel = new REAL3D.CageModel.Cage(this.previewMesh, this.drawObject);
        this.subdivideModel = new REAL3D.CageModel.SubdivideMesh(this.previewMesh, this.drawObject);
    } else if (this.cageMesh !== null) {
        //console.log("  draw cage mesh");
        this.cageModel = new REAL3D.CageModel.Cage(this.cageMesh, this.drawObject);
        this.subdivideModel = new REAL3D.CageModel.SubdivideMesh(this.cageMesh, this.drawObject);
    }
    this.drawRefObject();
};

REAL3D.CageModeling.CageData.drawRefObject = function () {
    "use strict";
    this.releaseDrawRefObject();
    this.refObject = new THREE.Object3D();
    REAL3D.RenderManager.scene.add(this.refObject);
    //draw picked objects
    var faceNormal, pickedMesh, pickedVertex, material, geometry, ball, pid, vPos, vPos0, vPos1, pEdge, edgeVector, cylinder, threeEdgeVector, threeUpVector, pickedEdge, edgeLen, rotateQ, eid, mesh, pickedFace, fid, pFace, pStartEdge, pCurEdge, edgeCount;
    if (this.pickTool !== null) {
        pickedMesh = this.pickTool.mesh;

        pickedVertex = this.pickTool.getPickedVertex();
        if (pickedVertex !== null) {
            material = new THREE.MeshBasicMaterial({color: 0xbbbb2b});
            for (pid = 0; pid < pickedVertex.length; pid++) {
                vPos = pickedMesh.getVertex(pickedVertex[pid]).getPosition();
                geometry = new THREE.SphereGeometry(6, 6, 6);
                ball = new THREE.Mesh(geometry, material);
                ball.position.set(vPos.getX(), vPos.getY(), vPos.getZ());
                this.refObject.add(ball);
            }
        }

        pickedEdge = this.pickTool.getPickedEdge();
        if (pickedEdge !== null) {
            material = new THREE.MeshPhongMaterial({color: 0x2bbbbb, specular: 0x101010, shininess: 10});
            threeUpVector = new THREE.Vector3(0, 1, 0);
            for (pid = 0; pid < pickedEdge.length; pid++) {
                pEdge = pickedMesh.getEdge(pickedEdge[pid]);
                vPos0 =  pEdge.getVertex().getPosition();
                vPos1 = pEdge.getPair().getVertex().getPosition();
                edgeVector = REAL3D.Vector3.sub(vPos1, vPos0);
                edgeLen = edgeVector.unify();
                geometry = new THREE.CylinderGeometry(2, 2, edgeLen, 4);
                cylinder = new THREE.Mesh(geometry, material);
                cylinder.translateX((vPos0.x + vPos1.x) / 2);
                cylinder.translateY((vPos0.y + vPos1.y) / 2);
                cylinder.translateZ((vPos0.z + vPos1.z) / 2);
                threeEdgeVector = new THREE.Vector3(edgeVector.x, edgeVector.y, edgeVector.z);
                rotateQ = new THREE.Quaternion();
                rotateQ.setFromUnitVectors(threeUpVector, threeEdgeVector);
                cylinder.setRotationFromQuaternion(rotateQ);
                this.refObject.add(cylinder);
            }
        }
        
        pickedFace = this.pickTool.getPickedFace();
        if (pickedFace !== null) {
            material = new THREE.MeshPhongMaterial({color: 0xbb2bbb, specular: 0x101010, shininess: 10, transparent: true, opacity: 0.5});
            for (fid = 0; fid < pickedFace.length; fid++) {
                pFace = pickedMesh.getFace(pickedFace[fid]);
                geometry = new THREE.Geometry();
                pStartEdge = pFace.getEdge();
                faceNormal = pFace.getNormal();
                faceNormal.multiply(0.5); //0.5: since our min unit is 1 (which means 1 cm), thus 0.5 is a reasonable value
                pCurEdge = pStartEdge;
                edgeCount = 0;
                do {
                    vPos = pCurEdge.getVertex().getPosition();
                    vPos.addVector(faceNormal);
                    geometry.vertices.push(new THREE.Vector3(vPos.getX(), vPos.getY(), vPos.getZ()));
                    pCurEdge = pCurEdge.getNext();
                    edgeCount++;
                } while (pCurEdge !== pStartEdge);
                for (eid = 1; eid < edgeCount - 1; eid++) {
                    geometry.faces.push(new THREE.Face3(0, eid, eid + 1));
                }
                geometry.computeFaceNormals();
                geometry.computeVertexNormals();
                mesh = new THREE.Mesh(geometry, material);
                this.refObject.add(mesh);
            }
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
    if (this.subdivideModel !== null) {
        this.subdivideModel.remove();
        this.subdivideModel = null;
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
        this.previewMesh = this.curOperation.preview(this.pickTool); //change pickMesh to previewMesh
        //console.log(" previewMesh: ", this.previewMesh);
        this.draw();
    }
};

//1. Apply
//2. Change pick element
//3. Switch UI
REAL3D.CageModeling.CageData.generateOperation = function (keepPickIndex) {
    "use strict";
    var resMesh, res;
    res = false;
    if (this.curOperation !== null) {
        this.previewMesh = null;
        var resMesh = this.curOperation.generate();
        if (resMesh !== null) {
            this.cageMesh = resMesh;
            this.operations.push(this.curOperation);
            res = true;
        } else {
            alert("不允许这个操作");
            this.pickTool.clearPickedElement(false);
            //console.log("warning: invalid operation!");
        }
        this.curOperation = null;
    }
    this.pickCageMesh(keepPickIndex);
    this.draw();
    return res;
};

REAL3D.CageModeling.CageData.pickCageMesh = function (keepPickIndex) {
    "use strict";
    if (this.pickTool === null) {
        this.pickTool = new REAL3D.PickTool.PickHMesh();
    }
    this.pickTool.setMesh(this.cageMesh, keepPickIndex);
};

REAL3D.CageModeling.CageData.pickVertex = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    if (this.pickTool !== null) {
        var isPicked = this.pickTool.pickVertex(worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY);
        if (isPicked) {
            REAL3D.CageModeling.CageData.pickTool.clearPickedEdge();
            REAL3D.CageModeling.CageData.pickTool.clearPickedFace();
            this.draw();
        }
        return isPicked;
    }
    return false;
};

REAL3D.CageModeling.CageData.pickEdge = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY, onlyBoundary) {
    "use strict";
    if (this.pickTool !== null) {
        var isPicked = this.pickTool.pickEdge(worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY, onlyBoundary);
        if (isPicked) {
            REAL3D.CageModeling.CageData.pickTool.clearPickedVertex();
            REAL3D.CageModeling.CageData.pickTool.clearPickedFace();
            this.draw();
        }
        return isPicked;
    }
    return false;
};

REAL3D.CageModeling.CageData.pickFace = function (worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY) {
    "use strict";
    if (this.pickTool !== null) {
        var isPicked = this.pickTool.pickFace(worldMatrix, projectMatrix, mouseNormPosX, mouseNormPosY);
        if (isPicked) {
            REAL3D.CageModeling.CageData.pickTool.clearPickedVertex();
            REAL3D.CageModeling.CageData.pickTool.clearPickedEdge();
            this.draw();
        }
        return isPicked;
    }
    return false;
};

REAL3D.CageModeling.CageData.changeSmoothValue = function (smoothValue) {
    "use strict";
    if (this.pickTool !== null) {
        var currentElementType, pickedMesh, pickedIndex, startEdge, curEdge;
        currentElementType = this.pickTool.currentElementType;
        if (currentElementType === REAL3D.MeshModel.ElementType.VERTEX) {
            pickedIndex = this.pickTool.getPickedVertex()[0];
            pickedMesh = this.pickTool.getMesh();
            pickedMesh.getVertex(pickedIndex).setSmoothValue(smoothValue);
            // startEdge = pickedMesh.getVertex(pickedIndex).getEdge();
            // curEdge = startEdge;
            // do {
            //     curEdge.setSmoothValue(smoothValue);
            //     curEdge.getPair().setSmoothValue(smoothValue);
            //     if (curEdge.getPair().getFace() === null) {
            //         break;
            //     }
            //     curEdge = curEdge.getPair().getNext();
            // } while (curEdge !== startEdge);
        } else if (currentElementType === REAL3D.MeshModel.ElementType.EDGE) {
            pickedIndex = this.pickTool.getPickedEdge()[0];
            pickedMesh = this.pickTool.getMesh();
            curEdge = pickedMesh.getEdge(pickedIndex);
            curEdge.setSmoothValue(smoothValue);
            curEdge.getPair().setSmoothValue(smoothValue);
            //curEdge.getVertex().setSmoothValue(smoothValue);
        } else if (currentElementType === REAL3D.MeshModel.ElementType.FACE) {
            pickedIndex = this.pickTool.getPickedFace()[0];
            pickedMesh = this.pickTool.getMesh();
            startEdge = pickedMesh.getFace(pickedIndex).getEdge();
            curEdge = startEdge;
            do {
                curEdge.setSmoothValue(smoothValue);
                curEdge.getPair().setSmoothValue(smoothValue);
                curEdge.getVertex().setSmoothValue(smoothValue);
                curEdge = curEdge.getNext();
            } while (curEdge !== startEdge);
        }
        this.draw();
    }
};
