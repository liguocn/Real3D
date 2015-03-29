REAL3D.InspectorEdit.InspectorView = {
    mouseState: REAL3D.InspectorEdit.MouseState.NONE,
    isMouseDown: false,
    canvasOffset: null,
    mouseMovePos: new THREE.Vector2(0, 0),
    camera: null
};

REAL3D.InspectorEdit.InspectorView.init = function (canvasOffset, winW, winH) {
    "use strict";
    if (this.camera === null) {
        this.camera = new THREE.OrthographicCamera(winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 2000);
        this.camera.position.set(0, 0, 1000);
        //first time init
        this.mouseState = REAL3D.InspectorEdit.MouseState.NONE;
        this.isMouseDown = false;
        this.canvasOffset = canvasOffset;
        this.mouseMovePos = new THREE.Vector2(0, 0);
    }
    REAL3D.RenderManager.switchCamera(this.camera);
};

REAL3D.InspectorEdit.InspectorView.update = function(timestamp) {
    "use strict";
};

REAL3D.InspectorEdit.InspectorView.mouseDown = function (e) {
    "use strict";
};

REAL3D.InspectorEdit.InspectorView.mouseUp = function (e) {
    "use strict";
};

REAL3D.InspectorEdit.InspectorView.mouseMove = function (e) {
    "use strict";
};

REAL3D.InspectorEdit.InspectorView.keyPress = function (e) {
    "use strict";
};

REAL3D.InspectorEdit.InspectorView.draggingCanvas = function (e) {
    "use strict";
};