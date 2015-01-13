/*jslint plusplus: true */
/*global document, console, THREE, requestAnimationFrame */
var REAL3D = {};
/*members Publisher, Framework, RenderManager, Listener, StateManager, StateBase, HelloState*/

/*properties messageTypes */
REAL3D.Publisher = function () {
    "use strict";
    this.messageTypes = {};
};

/*members prototype, subscribe, unsubscribe, publish, findSubscriber */
/*properties push, subscriber, callback */
REAL3D.Publisher.prototype.subscribe = function (message, subscriber, callback) {
    "use strict";
    var subscribers = this.messageTypes[message];
    if (subscribers) {
        if (this.findSubscriber(subscribers, subscriber) !== -1) {
            return;
        }
    } else {
        subscribers = [];
        this.messageTypes[message] = subscribers;
    }

    subscribers.push({ subscriber : subscriber, callback : callback });
};

/*properties splice */
REAL3D.Publisher.prototype.unsubscribe = function(message, subscriber, callback) {
    "use strict";
    var subscribers, findIndex;
    if (subscriber) {
        subscribers = this.messageTypes[message];

        if (subscribers) {
            findIndex = this.findSubscriber(subscribers, subscriber, callback);
            if (findIndex !== -1) {
                this.messageTypes[message].splice(findIndex, 1);
            }
        }
    } else {
        delete this.messageTypes[message];
    }
};

/*properties length, apply */
REAL3D.Publisher.prototype.publish = function(message) {
    "use strict";
    var subscribers, ii, jj, args;
    subscribers = this.messageTypes[message];

    if (subscribers) {
        for (ii = 0; ii < subscribers.length; ii++) {
            args = [];
            for (jj = 0; jj < arguments.length - 1; jj++) {
                args.push(arguments[jj + 1]);
            }
            subscribers[ii].callback.apply(subscribers[ii].subscriber, args);
        }
    }
};

REAL3D.Publisher.prototype.findSubscriber = function (subscribers, subscriber) {
    "use strict";
    var ii;
    for (ii = 0; ii < subscribers.length; ii++) {
        if (subscribers[ii] === subscriber) {
            return ii;
        }
    }
    return -1;
};

/*properties call */
REAL3D.StateBase = function() {
    "use strict";
    REAL3D.Publisher.call(this);
};

/*properties enter, update, exit, mouseDown, mouseUp, mouseMove, keyPress */
REAL3D.StateBase.prototype = {
    enter : function() {
        "use strict";
    },

    update : function() {
        "use strict";
    },

    exit : function() {
        "use strict";
    },

    mouseDown : function(e) {
        "use strict";
    },

    mouseUp : function(e) {
        "use strict";
    },

    mouseMove : function(e) {
        "use strict";
    },

    keyPress : function(e) {
        "use strict";
    }
};

/*properties stateName, create, log, clientX, clientY, offsetX, offsetY, which */
REAL3D.HelloState = function() {
    "use strict";
    REAL3D.StateBase.call(this);
    this.stateName = "HelloState";
};

REAL3D.HelloState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.HelloState.prototype.enter = function() {
    "use strict";
    console.log("Enter HelloState");
};

REAL3D.HelloState.prototype.exit = function() {
    "use strict";
    console.log("Exit HelloState");
};

REAL3D.HelloState.prototype.mouseDown = function(e) {
    "use strict";
    console.log("HelloState MouseDown: ", e.clientX, e.clientY, e.offsetX, e.offsetY);
};

REAL3D.HelloState.prototype.keyPress = function(e) {
    "use strict";
    console.log("HelloState KeyPress: ", e.which);
};

/*properties init, update, enterState, switchCurrentState, getState, mouseDown, mouseUp, mouseMove, keyPress, currentState, stateSet, error */
REAL3D.StateManager = {
    init : function() {
        "use strict";
        var initState = new REAL3D.HelloState();
        this.enterState(initState);
    },

    update : function() {
        "use strict";
        this.currentState.update();
    },

    enterState : function(state) {
        "use strict";
        if (state === undefined || state === null) {
            console.error("State is invalid");
            return false;
        }
        if (this.currentState !== null) {
            this.currentState.exit();
        }
        this.stateSet[state.stateName] = state;
        this.currentState = state;
        this.currentState.enter();
    },

    switchCurrentState : function(stateName) {
        "use strict";
        if (this.stateSet[stateName] === undefined) {
            return false;
        }
        if (this.currentState !== null) {
            if (this.currentState.stateName === stateName) {
                console.log("Switch to the same state: ", stateName);
                return true;
            }
            this.currentState.exit();
        }
        this.currentState = this.stateSet[stateName];
        this.currentState.enter();
        return true;
    },

    getState : function(stateName) {
        "use strict";
        return this.stateSet[stateName];
    },

    mouseDown : function(e) {
        "use strict";
        this.currentState.mouseDown(e);
    },

    mouseUp :  function(e) {
        "use strict";
        this.currentState.mouseUp(e);
    },

    mouseMove : function(e) {
        "use strict";
        this.currentState.mouseMove(e);
    },

    keyPress : function(e) {
        "use strict";
        this.currentState.keyPress(e);
    },

    currentState : null,
    stateSet : []
};

/*properties addEventListener, setAttribute, focus, style, outline */
REAL3D.Listener = {
    init : function(dom) {
        "use strict";
        var that = this;
        dom.addEventListener("mousedown", function(e) { that.mouseDown(e); }, false);
        dom.addEventListener("mouseup", function(e) { that.mouseUp(e); }, false);
        dom.addEventListener("mousemove", function(e) { that.mouseMove(e); }, false);
        dom.addEventListener("keypress", function(e) { that.keyPress(e); }, false);
        dom.setAttribute("tabindex", 1);
        dom.focus();
        dom.style.outline = "none";
    },

    mouseDown : function(e) {
        "use strict";
        REAL3D.StateManager.mouseDown(e);
    },

    mouseUp : function(e) {
        "use strict";
        REAL3D.StateManager.mouseUp(e);
    },

    mouseMove : function(e) {
        "use strict";
        REAL3D.StateManager.mouseMove(e);
    },

    keyPress : function(e) {
        "use strict";
        REAL3D.StateManager.keyPress(e);
    }
};

/*properties scene, windowWidth, windowHeight, camera, renderer, cube, init, update, switchCamera, addCamera, deleteCamera, getCamera */
/*properties Scene, PerspectiveCamera, position, set, default, currentCameraName, setClearColor, setSize, BoxGeometry, MeshBasicMaterial, color, WebGLRenderer, antialias */
/*properties Mesh, name, cube2, add, domElement, render */
REAL3D.RenderManager = {
    scene : null,
    windowWidth : 1024,
    windowHeight : 768,
    camera : [],
    renderer : null,
    cube : null,
    init : function() {
        "use strict";
        console.log("frame.init");
        this.scene = new THREE.Scene();
        var cameraDefault, geometry, material, geometry2, material2;
        cameraDefault = new THREE.PerspectiveCamera(75, this.windowWidth / this.windowHeight, 0.1, 1000);
        cameraDefault.position.set(0, 0, 10);
        this.camera["default"] = cameraDefault;
        this.currentCameraName = "default";
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0xd1d1d1, 1);
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        geometry = new THREE.BoxGeometry(250, 250, 250);
        material = new THREE.MeshBasicMaterial({color: 0xfcfcfc});
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.name = "root";
        //this.cube.position.set(0, 0, 0);
        geometry2 = new THREE.BoxGeometry(125, 125, 125);
        material2 = new THREE.MeshBasicMaterial({color: 0x9efe9e});
        this.cube2 = new THREE.Mesh(geometry2, material2);
        this.cube2.position.set(250, 250, 250);
        this.cube2.name = "cube2";
        this.cube.add(this.cube2);
        this.scene.add(this.cube);
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

/*properties appendChild, getElementById, init, run */
REAL3D.Framework = {
    init : function(containerId) {
        "use strict";
        var dom, canvContainer;
        dom = REAL3D.RenderManager.init();
        REAL3D.Listener.init(dom);
        canvContainer = document.getElementById(containerId);
        canvContainer.appendChild(dom);
        REAL3D.StateManager.init();
    },

    run : function() {
        "use strict";
        REAL3D.StateManager.update();
        REAL3D.RenderManager.update();
        var that = this;
        requestAnimationFrame(function() {that.run(); });
    }
};



