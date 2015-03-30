/*jslint plusplus: true, continue: true */
/*global REAL3D, THREE, console */

REAL3D.MeshModel.CreateBox = function (cenPosX, cenPosY, cenPosZ, lenX, lenY, lenZ) {
    "use strict";
    this.cenPosX = cenPosX;
    this.cenPosY = cenPosY;
    this.cenPosZ = cenPosZ;
    this.lenX = lenX;
    this.lenY = lenY;
    this.lenZ = lenZ;
};

REAL3D.MeshModel.CreateBox.prototype.preview = function () {
    "use strict";
    return this.generateBox();
};

REAL3D.MeshModel.CreateBox.prototype.generate = function () {
    "use strict";
    return this.generateBox();
};

REAL3D.MeshModel.CreateBox.prototype.generateBox = function () {
    "use strict";
    var mesh, xStart, xEnd, yStart, yEnd, zStart, zEnd, faceVertices;
    xStart = this.cenPosX - this.lenX / 2;
    xEnd = xStart + this.lenX;
    yStart = this.cenPosY - this.lenY / 2;
    yEnd = yStart + this.lenY;
    zStart = this.cenPosZ - this.lenZ / 2;
    zEnd = zStart + this.lenZ;
    mesh = new REAL3D.MeshModel.HMesh();
    mesh.insertVertex(new REAL3D.Vector3(xStart, yStart, zStart));
    mesh.insertVertex(new REAL3D.Vector3(xStart, yStart, zEnd));
    mesh.insertVertex(new REAL3D.Vector3(xEnd, yStart, zEnd));
    mesh.insertVertex(new REAL3D.Vector3(xEnd, yStart, zStart));
    mesh.insertVertex(new REAL3D.Vector3(xStart, yEnd, zStart));
    mesh.insertVertex(new REAL3D.Vector3(xStart, yEnd, zEnd));
    mesh.insertVertex(new REAL3D.Vector3(xEnd, yEnd, zEnd));
    mesh.insertVertex(new REAL3D.Vector3(xEnd, yEnd, zStart));
    faceVertices = [];
    faceVertices.push(mesh.getVertex(0));
    faceVertices.push(mesh.getVertex(1));
    faceVertices.push(mesh.getVertex(5));
    faceVertices.push(mesh.getVertex(4));
    mesh.insertFace(faceVertices);
    faceVertices = [];
    faceVertices.push(mesh.getVertex(1));
    faceVertices.push(mesh.getVertex(2));
    faceVertices.push(mesh.getVertex(6));
    faceVertices.push(mesh.getVertex(5));
    mesh.insertFace(faceVertices);
    faceVertices = [];
    faceVertices.push(mesh.getVertex(2));
    faceVertices.push(mesh.getVertex(3));
    faceVertices.push(mesh.getVertex(7));
    faceVertices.push(mesh.getVertex(6));
    mesh.insertFace(faceVertices);
    faceVertices = [];
    faceVertices.push(mesh.getVertex(0));
    faceVertices.push(mesh.getVertex(4));
    faceVertices.push(mesh.getVertex(7));
    faceVertices.push(mesh.getVertex(3));
    mesh.insertFace(faceVertices);
    faceVertices = [];
    faceVertices.push(mesh.getVertex(4));
    faceVertices.push(mesh.getVertex(5));
    faceVertices.push(mesh.getVertex(6));
    faceVertices.push(mesh.getVertex(7));
    mesh.insertFace(faceVertices);
    faceVertices = [];
    faceVertices.push(mesh.getVertex(0));
    faceVertices.push(mesh.getVertex(3));
    faceVertices.push(mesh.getVertex(2));
    faceVertices.push(mesh.getVertex(1));
    mesh.insertFace(faceVertices);

    mesh.updateNormal();

    return mesh;
};
