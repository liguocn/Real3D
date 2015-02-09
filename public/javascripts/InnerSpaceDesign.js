/*jslint plusplus: true */
/*global window */

function getDesignItemsFromServer() {
    "use strict";
    console.log("getDesignItemsFromServer...");
    var designNames, designIds, itemLen, item, itemId;
    $.get("/innerspacedesign/getitems", function (data) {
        if (data.success) {
            designNames = data.designNames;
            designIds = data.designIds;
            itemLen = designNames.length;
            for (itemId = 0; itemId < itemLen; item++) {
                item = $('<div class="designitem" onclick="editDesignItem()"></div>');
                item.text(designNames[itemId]);
                item.attr({id: designIds[itemId]});
                item.appendTo('#designSet');
            }
            console.log("designSet: ", $('#designSet'));
        } else {
            console.log("getDesignItemsFromServer is failed");
        }
    });
}

function backToPersonalHomePage() {
    "use strict";
    window.location.href = "/personalhomepage";
}

function editDesignItem(dId) {
    "use strict";
    console.log("editDesignItem");
    var subForm, item1, item2;
    subForm = $('<form action="/innerspacedesign/edit" method="get"></form>');
    item1 = $('<input type="text" id="designId" name="designId">');
    item1.val(dId);
    item2 = $('<button type="submit">j</button>');
    item1.appendTo(subForm);
    item2.appendTo(subForm);
    //subForm.appendTo("#designSet");
    console.log("subForm: ", subForm);
    console.log("designId: ", dId);
    subForm.submit();
}

$(document).ready(function () {
    console.log("document.ready...");
    $('<div id="plink" class="menuitem" onclick="backToPersonalHomePage()">个人主页</div>').appendTo('#menu');
    $('<div id="new" class="designitem">新建</div>').appendTo('#designSet');
    $('#new').click(function () {
        var designId = $(this).prop('id');
        editDesignItem(designId);
    });
    console.log("value: ", $("#plink").prop('id'));
    getDesignItemsFromServer();
});
