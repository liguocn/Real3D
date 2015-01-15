/*jslint plusplus: true */

var REAL3D = {};

/*properties Publisher, messageTypes */
REAL3D.Publisher = function () {
    "use strict";
    this.messageTypes = {};
};

/*properties prototype, subscribe, findSubscriber */
/*properties push, subscriber, callback */
REAL3D.Publisher.prototype.subscribe = function (parm_message, parm_subscriber, parm_callback) {
    "use strict";
    var subscribers = this.messageTypes[parm_message];
    if (subscribers) {
        if (this.findSubscriber(subscribers, parm_subscriber) !== -1) {
            return;
        }
    } else {
        subscribers = [];
        this.messageTypes[parm_message] = subscribers;
    }

    subscribers.push({ subscriber : parm_subscriber, callback : parm_callback });
};

/*properties unsubscribe */
/*properties splice */
REAL3D.Publisher.prototype.unsubscribe = function(parm_message, parm_subscriber) {
    "use strict";
    var subscribers, findIndex;
    if (parm_subscriber) {
        subscribers = this.messageTypes[parm_message];

        if (subscribers) {
            findIndex = this.findSubscriber(subscribers, parm_subscriber);
            if (findIndex !== -1) {
                this.messageTypes[parm_message].splice(findIndex, 1);
            }
        }
    } else {
        delete this.messageTypes[parm_message];
    }
};

/*properties publish */
/*properties length, apply */
REAL3D.Publisher.prototype.publish = function(parm_message) {
    "use strict";
    var subscribers, ii, jj, args;
    subscribers = this.messageTypes[parm_message];

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

/*properties findSubscriber */
REAL3D.Publisher.prototype.findSubscriber = function (parm_subscribers, parm_subscriber) {
    "use strict";
    var ii;
    for (ii = 0; ii < parm_subscribers.length; ii++) {
        if (parm_subscribers[ii] === parm_subscriber) {
            return ii;
        }
    }
    return -1;
};

/*properties StateBase, call */
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

/*properties HelloState, stateName, create, log, clientX, clientY, offsetX, offsetY, which */
REAL3D.HelloState = function() {
    "use strict";
    REAL3D.StateBase.call(this);
    this.stateName = "HelloState";
};

REAL3D.HelloState.prototype = Object.create(REAL3D.StateBase.prototype);

/*global console */
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

/*properties StateManager, init, update, enterState, switchCurrentState, getState, mouseDown, mouseUp, mouseMove, keyPress, currentState, stateSet, error */
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

/*properties Listener, addEventListener, setAttribute, focus, style, outline */
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

/*global THREE */
/*properties RenderManager, scene, windowWidth, windowHeight, camera, renderer, center, xNode, yNode, init, update, switchCamera, addCamera, deleteCamera, getCamera */
/*properties Scene, PerspectiveCamera, position, set, default, currentCameraName, setClearColor, setSize, BoxGeometry, MeshBasicMaterial, color, WebGLRenderer, antialias */
/*properties Mesh, name, cube2, add, domElement, render */
REAL3D.RenderManager = {
    scene : null,
    windowWidth : 1024,
    windowHeight : 768,
    camera : [],
    renderer : null,
    center : null,
    xNode : null,
    yNode : null,
    init : function() {
        "use strict";
        console.log("frame.init");
        this.scene = new THREE.Scene();
        var cameraDefault, geometryCenter, materialCenter, geometryXNode, materialXNode, geometryYNode, materialYNode;
        cameraDefault = new THREE.PerspectiveCamera(75, this.windowWidth / this.windowHeight, 0.1, 1000);
        cameraDefault.position.set(0, 0, 10);
        this.camera["default"] = cameraDefault;
        this.currentCameraName = "default";
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0xd1d1d1, 1);
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        geometryCenter = new THREE.BoxGeometry(10, 10, 10);
        materialCenter = new THREE.MeshBasicMaterial({color: 0xfcfcfc});
        this.center = new THREE.Mesh(geometryCenter, materialCenter);
        this.center.name = "center";
        this.center.position.set(0, 0, 0);
        geometryXNode = new THREE.BoxGeometry(10, 10, 10);
        materialXNode = new THREE.MeshBasicMaterial({color: 0x9efe9e});
        this.xNode = new THREE.Mesh(geometryXNode, materialXNode);
        this.xNode.position.set(250, 0, 0);
        this.xNode.name = "xNode";
        this.center.add(this.xNode);
        geometryYNode = new THREE.BoxGeometry(10, 10, 10);
        materialYNode = new THREE.MeshBasicMaterial({color: 0xae0e1e});
        this.yNode = new THREE.Mesh(geometryYNode, materialYNode);
        this.yNode.position.set(0, 250, 0);
        this.yNode.name = "yNode";
        this.center.add(this.yNode);
        this.scene.add(this.center);
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

/*global document, requestAnimationFrame */
/*properties Framework, appendChild, getElementById, init, run */
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



