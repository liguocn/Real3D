/*global REAL3D */

REAL3D.Vector2 = function (x, y) {
    "use strict";
    this.x = x;
    this.y = y;
};

REAL3D.Vector2.prototype = {
    set: function (x, y) {
        this.x = x;
        this.y = y;
    },

    setX: function (x) {
        this.x = x;
    },

    setY: function (y) {
        this.y = y;
    },

    getX: function () {
        return this.x;
    },

    getY: function () {
        return this.y;
    },

    copyTo: function () {
        var v = new REAL3D.Vector2(this.x, this.y);
        return v;
    },

    copyFrom: function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    },

    addVector: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    subVector: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    unify: function () {
        var len = this.length();
        if (!REAL3D.isZero(len)) {
            this.x /= len;
            this.y /= len;
        } else {
            this.x = 0;
            this.y = 0;
        }
        return len;
    },

    multiply: function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
};

REAL3D.Vector2.sub = function (vec1, vec2) {
    "use strict";
    var res = vec1.copyTo();
    res.subVector(vec2);
    return res;
};

REAL3D.Vector2.add = function (vec1, vec2) {
    "use strict";
    var res = vec1.copyTo();
    res.addVector(vec2);
    return res;
};

REAL3D.Vector2.scale = function (vec, scale) {
    "use strict";
    var res = vec.copyTo();
    res.multiply(scale);
    return res;
};
