/*global REAL3D */

REAL3D.Vector2 = function (x, y) {
    "use strict";
    this.x = x;
    this.y = y;
};

REAL3D.Vector2.prototype = {
    set: function (x, y) {
        "use strict";
        this.x = x;
        this.y = y;
    },

    setX: function (x) {
        "use strict";
        this.x = x;
    },

    setY: function (y) {
        "use strict";
        this.y = y;
    },

    getX: function () {
        "use strict";
        return this.x;
    },

    getY: function () {
        "use strict";
        return this.y;
    },

    copyTo: function () {
        "use strict";
        var v = new REAL3D.Vector2(this.x, this.y);
        return v;
    },

    copyFrom: function (v) {
        "use strict";
        this.x = v.x;
        this.y = v.y;
        return this;
    },

    addVector: function (v) {
        "use strict";
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    subVector: function (v) {
        "use strict";
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    length: function () {
        "use strict";
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    unify: function () {
        "use strict";
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
        "use strict";
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

REAL3D.Vector2.dotProduct = function (vec1, vec2) {
    "use strict";
    var res = vec1.getX() * vec2.getX() + vec1.getY() * vec2.getY();
    return res;
};
