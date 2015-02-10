/*jslint plusplus: true */
/*global window */
function editDesignItem(designName) {
    "use strict";
    console.log("editDesignItem: ", designName);
    var subForm, item1, item2;
    subForm = $('<form action="/innerspacedesign/edit" method="get"></form>');
    item1 = $('<input type="text" id="designName" name="designName">');
    if (designName !== null) {
        item1.val(designName);
    }
    item2 = $('<button type="submit">j</button>');
    item1.appendTo(subForm);
    item2.appendTo(subForm);
    //subForm.appendTo("#designSet");
    console.log("subForm: ", subForm);
    console.log("designName: ", designName);
    subForm.submit();
}

function getDesignItemsFromServer() {
    "use strict";
    console.log("getDesignItemsFromServer...");
    var designNames, itemLen, item, itemId;
    $.get("/innerspacedesign/getitems", function (data) {
        if (data.success) {
            console.log("data: ", data);
            designNames = data.designNames;
            itemLen = designNames.length;
            console.log("designNames: ", designNames);
            console.log("itemLen: ", itemLen);
            for (itemId = 0; itemId < itemLen; itemId++) {
                item = $('<div class="designitem"></div>');
                item.text(designNames[itemId]);
                //item.attr({id: designNames[itemId]});
                item.click(function () {
                    //var designName = $(this).prop('id');
                    var designName = $(this).text();
                    editDesignItem(designName);
                });
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

$(document).ready(function () {
    console.log("document.ready...");
    $('<div id="plink" class="menuitem" onclick="backToPersonalHomePage()">个人主页</div>').appendTo('#menu');
    $('<div id="new" class="designitem">新建</div>').appendTo('#designSet');
    $('#new').click(function () {
        editDesignItem('');
    });
    // var item = $('<div class="designitem"></div>');
    // item.text("new");
    // item.attr({id: "new"});
    // item.click(function () {
    //     var designName = $(this).prop('id');
    //     editDesignItem(designName);
    // });
    //item.appendTo('#designSet');
    console.log("value: ", $("#plink").prop('id'));
    getDesignItemsFromServer();
});
