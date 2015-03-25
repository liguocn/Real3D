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
        this.currentCamera = null;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0xdcdcdc, 1);
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        return this.renderer.domElement;
    },

    update : function() {
        "use strict";
        if (this.currentCamera !== null) {
            this.renderer.render(this.scene, this.currentCamera);
        }
    },

    switchCamera : function(camera) {
        "use strict";
        this.currentCamera = camera;
    }
};
