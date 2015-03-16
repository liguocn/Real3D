/*jslint plusplus: true */
/*global REAL3D, THREE, console, alert, window, document, $ */

REAL3D.GeneralDesignEdit.EditHomeUI = {
};

REAL3D.GeneralDesignEdit.EditHomeUI.enter = function () {
    "use strict";
    $('<div id="toolBar"></div>').appendTo('#leftContainer');
    $('<div class="text">工具栏</div>').appendTo('#toolBar');
    $('<hr />').appendTo('#toolBar');

    var that = this;
    $('<button id="curveBut" class="button">曲线</button>').appendTo('#toolBar');
    $('#curveBut').click(function () { that.enterEditCurve(); });
    $('<br>').appendTo('#toolBar');

    $('<button id="basicshapeBut" class="button">基本形状</button>').appendTo('#toolBar');
    $('#basicshapeBut').click(function () { that.enterEditBasicShape(); });
    $('<br>').appendTo('#toolBar');

    $('<button id="cageBut" class="button">细分</button>').appendTo('#toolBar');
    $('#cageBut').click(function () { that.enterEditCage(); });
    $('<br>').appendTo('#toolBar');

    $('<button id="extrudeBut" class="button">挤出</button>').appendTo('#toolBar');
    $('#extrudeBut').click(function () { that.enterEditExtrude(); });
    $('<br>').appendTo('#toolBar');
};

REAL3D.GeneralDesignEdit.EditHomeUI.exit = function () {
    "use strict";
    $('#toolBar').remove();
};

REAL3D.GeneralDesignEdit.EditHomeUI.enterEditCurve = function () {
    "use strict";
    this.exit();
    REAL3D.GeneralDesignEdit.enterState(REAL3D.GeneralDesignEdit.EditCurveState);
    REAL3D.GeneralDesignEdit.EditCurveUI.enter();
};

REAL3D.GeneralDesignEdit.EditHomeUI.enterEditCage = function () {
    "use strict";
    this.exit();
}

REAL3D.GeneralDesignEdit.EditHomeUI.enterEditBasicShape = function () {
    "use strict";
    this.exit();
}

REAL3D.GeneralDesignEdit.EditHomeUI.enterEditExtrude = function () {
    "use strict";
    this.exit();
    // REAL3D.InnerSpaceDesignEdit.EditRoamUI.enter();
    // REAL3D.InnerSpaceDesignEdit.enterState(REAL3D.InnerSpaceDesignEdit.EditRoamState);
};
