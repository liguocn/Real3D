/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.Translate = function (elemIndex, mesh, elemType, dir, value) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.elemType = elemType;
    this.dir = dir;
    this.value = value;
    this.elementCopy = null;
};

REAL3D.MeshModel.Translate.prototype.preview = function () {
    "use strict";
    this.translateMesh();
    return this.mesh;
};

REAL3D.MeshModel.Translate.prototype.generate = function () {
    "use strict";
    var res;
    this.translateMesh();
    res = this.mesh;
    this.mesh = null;
    this.elementCopy = null;
    return res;
};

REAL3D.MeshModel.Translate.prototype.setValue = function (value) {
    "use strict";
    this.value = value;
};

REAL3D.MeshModel.Translate.prototype.addValue = function (value) {
    "use strict";
    this.value += value;
};

REAL3D.MeshModel.Translate.prototype.translateMesh = function () {
    "use strict";
    var curEdge, startEdge, curIndex;
    if (this.elementCopy === null) {
        if (this.elemType === REAL3D.MeshModel.ElementType.VERTEX) {
            this.elementCopy = this.mesh.getVertex(this.elemIndex).getPosition();
        } else if (this.elemType === REAL3D.MeshModel.ElementType.EDGE) {
            this.elementCopy = [];
            curEdge = this.mesh.getEdge(this.elemIndex);
            this.elementCopy.push(curEdge.getVertex().getPosition());
            this.elementCopy.push(curEdge.getPair().getVertex().getPosition());
        } else if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
            this.elementCopy = [];
            startEdge = this.mesh.getFace(this.elemIndex).getEdge();
            curEdge = startEdge;
            do {
                this.elementCopy.push(curEdge.getVertex().getPosition());
                curEdge = curEdge.getNext();
            } while (curEdge !== startEdge);
        }
    }
    if (this.elemType === REAL3D.MeshModel.ElementType.VERTEX) {
        this.mesh.getVertex(this.elemIndex).setPosition(REAL3D.Vector3.add(this.elementCopy, REAL3D.Vector3.scale(this.dir, this.value)));
    } else if (this.elemType === REAL3D.MeshModel.ElementType.EDGE) {
        curEdge = this.mesh.getEdge(this.elemIndex);
        curEdge.getVertex().setPosition(REAL3D.Vector3.add(this.elementCopy[0], REAL3D.Vector3.scale(this.dir, this.value)));
        curEdge.getPair().getVertex().setPosition(REAL3D.Vector3.add(this.elementCopy[1], REAL3D.Vector3.scale(this.dir, this.value)));
    } else if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
        startEdge = this.mesh.getFace(this.elemIndex).getEdge();
        curEdge = startEdge;
        curIndex = 0;
        do {
            curEdge.getVertex().setPosition(REAL3D.Vector3.add(this.elementCopy[curIndex], REAL3D.Vector3.scale(this.dir, this.value)));
            curIndex++;
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
    }
    this.mesh.updateNormal();
};

REAL3D.MeshModel.Scale = function (elemIndex, mesh, elemType, dir, value) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.elemType = elemType;
    this.dir = dir;
    this.value = value;
    this.scaleValue = this.getScaleValueFromValue(this.value);
    this.elementCopy = null;
    this.centerPos = null;
};

REAL3D.MeshModel.Scale.prototype.preview = function () {
    "use strict";
    this.scaleMesh();
    return this.mesh;
};

REAL3D.MeshModel.Scale.prototype.generate = function () {
    "use strict";
    this.scaleMesh();
    var res = this.mesh;
    this.mesh = null;
    this.elementCopy = null;
    this.centerPos = null;
    return res;
};

REAL3D.MeshModel.Scale.prototype.setScaleValue = function (scaleValue) {
    "use strict";
    if (scaleValue > 0) {
        this.scaleValue = scaleValue;
        this.value = this.getValueFromScaleValue(this.scaleValue);
    }
};

REAL3D.MeshModel.Scale.prototype.addValue = function (value) {
    "use strict";
    this.value += value;
    this.scaleValue = this.getScaleValueFromValue(this.value);
};

REAL3D.MeshModel.Scale.prototype.getValueFromScaleValue = function (scaleValue) {
    "use strict";
    var value;
    if (scaleValue >= 1) {
        value = (this.scaleValue - 1) * 50;
    } else {
        value = (this.scaleValue - 1) * 250;
    }
    return value;
};

REAL3D.MeshModel.Scale.prototype.getScaleValueFromValue = function (value) {
    "use strict";
    var scaleValue;
    if (value >= 0) {
        scaleValue = 1 + value / 50;
    } else {
        scaleValue = 1 + value / 250;
        if (scaleValue < 0.004) {
            scaleValue = 0.004;
        }
    }
    return scaleValue;
};

REAL3D.MeshModel.Scale.prototype.scaleMesh = function () {
    "use strict";
    var curEdge, startEdge, vertexCount, scaleDir, curIndex, t, curCenterPos;
    if (this.elementCopy === null) {
        if (this.elemType === REAL3D.MeshModel.ElementType.EDGE) {
            this.elementCopy = [];
            curEdge = this.mesh.getEdge(this.elemIndex);
            this.elementCopy.push(curEdge.getVertex().getPosition());
            this.elementCopy.push(curEdge.getPair().getVertex().getPosition());
            this.centerPos = REAL3D.Vector3.add(curEdge.getVertex().getPosition(), curEdge.getPair().getVertex().getPosition());
            this.centerPos.multiply(0.5);
        } else if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
            this.elementCopy = [];
            this.centerPos = new REAL3D.Vector3(0, 0, 0);
            startEdge = this.mesh.getFace(this.elemIndex).getEdge();
            curEdge = startEdge;
            vertexCount = 0;
            do {
                this.elementCopy.push(curEdge.getVertex().getPosition());
                this.centerPos.addVector(curEdge.getVertex().getPosition());
                curEdge = curEdge.getNext();
                vertexCount++;
            } while (curEdge !== startEdge);
            this.centerPos.multiply(1 / vertexCount);
        }
    }
    if (this.elemType === REAL3D.MeshModel.ElementType.EDGE) {
        curEdge = this.mesh.getEdge(this.elemIndex);
        scaleDir = REAL3D.Vector3.sub(this.elementCopy[0], this.centerPos);
        scaleDir.multiply(this.scaleValue);
        curEdge.getVertex().setPosition(REAL3D.Vector3.add(this.centerPos, scaleDir));
        scaleDir = REAL3D.Vector3.sub(this.elementCopy[1], this.centerPos);
        scaleDir.multiply(this.scaleValue);
        curEdge.getPair().getVertex().setPosition(REAL3D.Vector3.add(this.centerPos, scaleDir));
    } else if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
        startEdge = this.mesh.getFace(this.elemIndex).getEdge();
        curEdge = startEdge;
        curIndex = 0;
        do {
            t = REAL3D.Vector3.dotProduct(this.dir, REAL3D.Vector3.sub(this.centerPos, this.elementCopy[curIndex]));
            curCenterPos = REAL3D.Vector3.add(this.elementCopy[curIndex], REAL3D.Vector3.scale(this.dir, t));
            scaleDir = REAL3D.Vector3.sub(this.elementCopy[curIndex], curCenterPos);
            scaleDir.multiply(this.scaleValue);
            curEdge.getVertex().setPosition(REAL3D.Vector3.add(curCenterPos, scaleDir));
            curIndex++;
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
    }
    this.mesh.updateNormal();
};
