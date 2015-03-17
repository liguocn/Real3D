/*global REAL3D */

REAL3D.Vector3 = function (x, y, z) {
    "use strict";
    this.x = x;
    this.y = y;
    this.z = z;
};

REAL3D.Vector3.prototype = {
    set: function (x, y, z) {
        "use strict";
        this.x = x;
        this.y = y;
        this.z = z;
    },

    setX: function (x) {
        "use strict";
        this.x = x;
    },

    setY: function (y) {
        "use strict";
        this.y = y;
    },

    setZ: function (z) {
        "use strict";
        this.z = z;
    },

    getX: function () {
        "use strict";
        return this.x;
    },

    getY: function () {
        "use strict";
        return this.y;
    },

    getZ: function () {
        "use strict";
        return this.z;
    },

    copyTo: function () {
        "use strict";
        var v = new REAL3D.Vector3(this.x, this.y, this.z);
        return v;
    },

    copyFrom: function (v) {
        "use strict";
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },

    addVector: function (v) {
        "use strict";
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },

    subVector: function (v) {
        "use strict";
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },

    length: function () {
        "use strict";
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    unify: function () {
        "use strict";
        var len = this.length();
        if (!REAL3D.isZero(len)) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return len;
    },

    multiply: function (s) {
        "use strict";
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
};

REAL3D.Vector3.sub = function (vec1, vec2) {
    "use strict";
    var res = vec1.copyTo();
    res.subVector(vec2);
    return res;
};

REAL3D.Vector3.add = function (vec1, vec2) {
    "use strict";
    var res = vec1.copyTo();
    res.addVector(vec2);
    return res;
};

REAL3D.Vector3.scale = function (vec, scale) {
    "use strict";
    var res = vec.copyTo();
    res.multiply(scale);
    return res;
};

REAL3D.Vector3.dotProduct = function (vec1, vec2) {
    "use strict";
    var res = vec1.getX() * vec2.getX() + vec1.getY() * vec2.getY() + vec1.getZ() * vec2.getZ();
    return res;
};
