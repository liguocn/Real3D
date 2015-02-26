/*jslint plusplus: true */
/*global REAL3D, console, THREE */
REAL3D.RenderManager = {
    scene : null,
    windowWidth : 0,
    windowHeight : 0,
    camera : [],
    currentCameraName : "defaultCamera",
    renderer : null,
    init : function(winW, winH) {
        "use strict";
        console.log("frame.init");
        this.scene = new THREE.Scene();
        this.windowWidth = winW;
        this.windowHeight = winH;
        var cameraDefault;
        cameraDefault = new THREE.PerspectiveCamera(75, this.windowWidth / this.windowHeight, 0.1, 1000);
        cameraDefault.position.set(0, 0, 10);
        this.camera[this.currentCameraName] = cameraDefault;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0xdcdcdc, 1);
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        return this.renderer.domElement;
    },

    update : function() {
        "use strict";
        this.renderer.render(this.scene, this.camera[this.currentCameraName]);
    },

    switchCamera : function(cameraName) {
        "use strict";
        this.currentCameraName = cameraName;
    },

    addCamera : function(cameraName, camera) {
        "use strict";
        this.camera[cameraName] = camera;
    },

    deleteCamera : function(cameraName) {
        "use strict";
        if (this.camera[cameraName] !== undefined) {
            delete this.camera[cameraName];
        }
    },

    getCamera : function(cameraName) {
        "use strict";
        return this.camera[cameraName];
    }
};
