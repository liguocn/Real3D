/*jslint plusplus: true */
/*global REAL3D, window, console, $, document */

REAL3D.GeneralDesign = {
};

REAL3D.GeneralDesign.editDesignItem = function (designName) {
    "use strict";
    console.log("editDesignItem: ", designName);
    var subForm, item1, item2;
    subForm = $('<form action="/generaldesign/edit" method="get"></form>');
    item1 = $('<input type="text" id="designName" name="designName">');
    if (designName !== null) {
        item1.val(designName);
    }
    item2 = $('<button type="submit">j</button>');
    item1.appendTo(subForm);
    item2.appendTo(subForm);
    console.log("subForm: ", subForm);
    console.log("designName: ", designName);
    subForm.submit();
};

REAL3D.GeneralDesign.backToPersonalHomePage = function () {
    "use strict";
    window.location.href = "/personalhomepage";
};

$(document).ready(function () {
    "use strict";
    console.log("document.ready...");
    $('<div id="plink" class="menuitem" onclick="REAL3D.GeneralDesign.backToPersonalHomePage()">个人主页</div>').appendTo('#menu');
    $('<div id="new" class="designitem">新建</div>').appendTo('#designSet');
    $('#new').click(function () {
        REAL3D.GeneralDesign.editDesignItem('');
    });
});
