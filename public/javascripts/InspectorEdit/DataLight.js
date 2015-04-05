/*global REAL3D */

REAL3D.Inspector.LightDataType = {
    Undefined: -1,
    AmbientLight: 0,
    PointLight: 1,
    SpotLight: 2
};

REAL3D.Inspector.LightParamsExt = {
    angle: 0,
    exponent: 0,
    castShadow: false,
    shadowMapWidth: 0,
    shadowMapHeight: 0,
    shadowCameraNear: 0,
    shadowCameraFar: 0,
    shadowCameraFov: 0
};

REAL3D.Inspector.LightParams = {
    type: null,
    color: 0,
    intensity: 0,
    distance: 0,
    position: [],
    otherParams: null
};

REAL3D.Inspector.LightData = {
    name: '',
    parent: null,
    type: null,
    lightParam: null,
    lightThree: null
};

REAL3D.Inspector.LightDataManager = {
    lights: []
};

REAL3D.Inspector.LightParams = function(lightParam) {
    "use strict";
    var ii;
    this.type = lightParam.type;
    this.color = lightParam.color;
    this.intensity = lightParam.intensity;
    this.distance = lightParam.distance;
    for (ii in this.position) {
        this.position[ii] = lightParam.position[ii];
    }
    //Ethis.otherParams = lightParam.otherParams;
};

REAL3D.Inspector.LightParams.prototype.toJSONString = function () {
    "use strict";
    var JSONString, outputStrings, key, outputString;
    JSONString = { type: this.type, color: this.color,
    intensity: this.intensity, distance: this.distance,
    position: this.position };
    outputString = [];
    for (key in JSONString) {
        //outputString.push('{text: ' + key + ':' + JSONString[key] + '},');
        outputString += '{text: ' + key + '-' + JSONString[key] + '},';
    }
    return '[' + outputString.substring(0, outputString.length-1) + ']';
};

REAL3D.Inspector.LightData = function(name, lightParam) {
    "use strict";
    this.name = name;
    this.lightParam = new REAL3D.Inspector.LightParams(lightParam);
    this.init(lightParam);
};

REAL3D.Inspector.LightData.prototype.getColor = function() {
    if (this.lightParam === null || this.lightParam === undefined)
        return null;
    return '#' + this.lightParam.color.toString(16);
}

REAL3D.Inspector.LightData.prototype.remove = function () {
    "use strict";
    if (this.parent !== null) {
        if (this.parent !== undefined) {
            this.parent.remove(this.lightThree);
        }
    }
};

REAL3D.Inspector.LightData.prototype.init = function (lightParam) {
    "use strict";
    this.remove();
    if (lightParam.type === null) {
        this.lightThree = null;
    }else if (lightParam.type === REAL3D.Inspector.LightDataType.AmbientLight) {
        this.lightThree = new THREE.AmbientLight(lightParam.color);
    } else if (lightParam.type === REAL3D.Inspector.LightDataType.PointLight) {
        this.lightThree = new THREE.PointLight(lightParam.color, lightParam.intensity, lightParam.distance);
        this.lightThree.position.set(lightParam.position[0], lightParam.position[1], lightParam.position[2]);
    } else if (lightParam.type === REAL3D.Inspector.LightDataType.SpotLight) {
        this.lightThree = new THREE.SpotLight(lightParam.color, lightParam.intensity, 
            lightParam.distance, lightParam.angle, lightParam.exponent);
        this.lightThree.position.set(lightParan.position[0], lightParam.position[1], lightParam.position[2]);
        if (otherParams !== null) {
           this.lightThree.castShadow = lightParam.otherParams.castShadow;
           this.lightThree.shadowMapWidth   = lightParam.otherParams.shadowMapWidth;
           this.lightThree.shadowMapHeight  = lightParam.otherParams.shadowMapHeight;
           this.lightThree.shadowCameraNear = lightParam.otherParams.shadowCameraNear;
           this.lightThree.shadowCameraFar  = lightParam.otherParams.shadowCameraFar;
           this.lightThree.shadowCameraFov  = lightParam.otherParams.shadowCameraFov;
        }
    } else {
        this.lightThree = null;
    }
};

REAL3D.Inspector.LightData.prototype.addToScene = function (scene) {
    "use strict";
    if (scene === null || scene === undefined || this.parent === scene)
        return ;
    if (this.parent !== scene) {
        if (this.parent !== null && this.parent !== undefined) {
            this.parent.remove(this.lightThree);
        } 
        this.parent = scene;
        if (this.lightThree !== null) {
            scene.add(this.lightThree);
        }
    }

};

REAL3D.Inspector.LightDataManager.init = function () {
    "use strict";
    var lightParams, lightData, lightNames, ii;
    lightParams = [{
        type: REAL3D.Inspector.LightDataType.PointLight,
        color: 0xffff00,
        position: [0, 500, 500],
        otherParams: {intensity: 1, distance: 1000}
    }, {
        type: REAL3D.Inspector.LightDataType.AmbientLight,
        color: 0x2b2b2b
    }];
    lightNames = ['PointLight', 'AmbientLight'];
    for (ii = 0; ii < lightParams.length; ++ii) {
        lightData = new REAL3D.Inspector.LightData(lightNames[ii], lightParams[ii]);
        this.add(lightData);      
    }
};

REAL3D.Inspector.LightDataManager.add = function (light, scene) {
    "use strict";
    if (this.lights === null || this.lights === undefined) {
        this.lights = [];
    }
    if (light !== null && light !== undefined) {
        this.lights.push(light);
        if (scene !== null && scene !== undefined) {
            light.addToScene(scene);
        }    
    }
};

REAL3D.Inspector.LightDataManager.addAllToScene = function (scene) {
    "use strict";
    var light;
    if (scene !== null) {
        if (scene !== undefined) {
            for (light in this.lights) {
                this.lights[light].addToScene(scene);
            }
        }
    }
};

REAL3D.Inspector.LightDataManager.remove = function (oneLight) {
    "use strict";
    var ii, iFind;
    iFind = this.lights.indexof(oneLight);
    if (iFind >= 0) {
        this.lights.splice(iFind, 1);
    }
};

REAL3D.Inspector.LightDataManager.removeAll = function () {
    "use strict";
    var light;
    for (light in this.lights) {
        this.lights[light].remove();
        this.lights[light] = null;
    }
    lights = [];
};

REAL3D.Inspector.LightDataManager.toViewTree = function () {
    "use strict"; 
    var viewTree, light, viewTreeNode;
    viewTree = [];
    for (light in this.lights) {
        viewTreeNode = { 
            text: this.lights[light].name,
            color: this.lights[light].getColor()
            //,nodes: eval(this.lights[light].lightParam.toJSONString())
        };
        viewTree.push(viewTreeNode);
    }
    return viewTree;
};