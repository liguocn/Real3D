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
        this.mesh.updateNormal();
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
};

REAL3D.MeshModel.Scale = function (elemIndex, mesh, elemType, scaleDir, scaleValue) {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.preview = function () {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.generate = function () {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.setValue = function (value) {
    "use strict";
};

REAL3D.MeshModel.Scale.prototype.addValue = function (value) {
    "use strict";
};
