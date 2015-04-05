
REAL3D.InspectorEdit.EditMaterialUI = {

};

REAL3D.InspectorEdit.EditMaterialUI.getMaterials = function () {
    return REAL3D.Inspector.LightDataManager.toViewTree();
}

REAL3D.InspectorEdit.EditMaterialUI.updateMaterials = function () {
    $('#tree').treeview({data: this.getMaterials()});
}

REAL3D.InspectorEdit.EditMaterialUI.nodeSelected = function (event, data) {
    console.log("Node selected: ", data, event);
}

REAL3D.InspectorEdit.EditMaterialUI.enter = function () {
    "use strict";
    var that = this;
    $('<div id="tree" class="viewtree"></div>').appendTo('#leftContainer');
    //$('#tree').treeview({data: this.getMaterials()});
    //$('#tree').on('nodeSelected', function(event, data) {that.nodeSelected(event, data);});

    //$('<button id="showMaterials" class="button">显示材质</div>').appendTo('#tree');
    $('<hr />').appendTo('#tree');
};
