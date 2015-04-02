/*jslint plusplus: true, continue: true */
/*global REAL3D, console */

REAL3D.MeshModel.Delete = function (elemIndex, mesh, elemType) {
    "use strict";
    this.elemIndex = elemIndex;
    this.mesh = mesh;
    this.elemType = elemType;
};

REAL3D.MeshModel.Delete.prototype.generate = function () {
    "use strict";
    var res, curFace, curEdge, curVert, startEdge, isValid;
    if (this.elemType === REAL3D.MeshModel.ElementType.FACE) {
        //judge whether it is a valid operation
        curFace = this.mesh.getFace(this.elemIndex);
        startEdge = curFace.getEdge();
        curEdge = startEdge;
        isValid = true;
        do {
            curVert = curEdge.getVertex();
            if (curVert.getEdge().getFace() === null) {
                if (curEdge.getPair().getFace() !== null && curEdge.getNext().getPair().getFace() !== null) {
                    isValid = false;
                    break;
                }
            }
            curEdge = curEdge.getNext();
        } while (curEdge !== startEdge);
        if (isValid) {
            this.mesh.deleteFace(this.elemIndex);
            this.mesh.validateTopology();
            this.mesh.updateNormal();
        } else {
            this.mesh = null;
            return null;
        }
    } else {
        console.log("error: wrong delete type: ", this.elemType);
        this.mesh = null;
        return null;
    }
    res = this.mesh;
    this.mesh = null;

    return res;
};
