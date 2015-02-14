/*jslint plusplus: true */
/*global REAL3D */
REAL3D.Publisher = function () {
    "use strict";
    this.messageTypes = {};
};

//if parm_callback exists, it will overrite it.
REAL3D.Publisher.prototype.subscribe = function (parm_message, parm_subscriber, parm_callback) {
    "use strict";
    var subscribers, findId;
    subscribers = this.messageTypes[parm_message];
    if (subscribers) {
        findId = this.findSubscriber(subscribers, parm_subscriber);
        if (findId !== -1) {
            subscribers[findId].callback = parm_callback;
            return;
        }
    } else {
        subscribers = [];
        this.messageTypes[parm_message] = subscribers;
    }

    subscribers.push({ subscriber : parm_subscriber, callback : parm_callback });
};

REAL3D.Publisher.prototype.unsubscribe = function (parm_message, parm_subscriber) {
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

REAL3D.Publisher.prototype.publish = function (parm_message) {
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

REAL3D.Publisher.prototype.findSubscriber = function (parm_subscribers, parm_subscriber) {
    "use strict";
    var ii;
    for (ii = 0; ii < parm_subscribers.length; ii++) {
        if (parm_subscribers[ii].subscriber === parm_subscriber) {
            return ii;
        }
    }
    return -1;
};
