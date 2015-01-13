/*jslint plusplus: true */
/*global REAL3D, THREE */
REAL3D.LayoutDesignState = function() {
    REAL3D.StateBase.call(this);
    this.stateName = "LayoutDesignState";
    this.mousePos = new THREE.Vector2(0, 0);
    this.isMouseDown = false;
    this.canvasOffset = null;
    this.winW = REAL3D.RenderManager.windowWidth;
    this.winH = REAL3D.RenderManager.windowHeight;
    this.cameraOrtho = null;
    this.cameraOrthoName = "CameraOrtho";
    this.mouseState = REAL3D.LayoutDesignState.MouseState.None;
    this.mouseDownPos = new THREE.Vector2(0, 0);
    this.mouseMovePos = new THREE.Vector2(0, 0);
    //user data
    this.userUIData = new REAL3D.LayoutDesignState.UserTree();
    this.hitUserPointIndex = -1;
    this.lastCreatedPointIndex = -1;
}

REAL3D.LayoutDesignState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.LayoutDesignState.prototype.Enter = function()
{
    console.log("Enter LayoutDesignState");
    if (REAL3D.RenderManager.GetCamera(this.cameraOrthoName) === undefined) 
    {
        console.log("Win size: ", winW, winH);
        var cameraOrthographic = new THREE.OrthographicCamera( this.winW / (-2), this.winW / 2, this.winH / 2, winH / (-2), 1, 1000);
        cameraOrthographic.position.set(0, 0, 1000);
        REAL3D.RenderManager.AddCamera(this.cameraOrthoName, cameraOrthographic);
    }
    this.camera = REAL3D.RenderManager.GetCamera(this.cameraOrthoName);
    REAL3D.RenderManager.SwitchCamera(this.cameraOrthoName);
    this.canvasOffset = $(REAL3D.RenderManager.renderer.domElement).offset();
}

REAL3D.LayoutDesignState.prototype.Exit = function()
{
    console.log("Exit LayoutDesignState");
}

REAL3D.LayoutDesignState.prototype.MouseDown = function(e)
{
    //test    
    this.mousePos.set(e.pageX - this.canvasOffset.left, e.pageY - this.canvasOffset.top);
    this.isMouseDown = true;
    console.log("LayoutDesignState MouseDown: ", e.pageX - this.canvasOffset.left, e.pageY - this.canvasOffset.top);
    //
    var curPosX = e.pageX - this.canvasOffset.left;
    var curPosY = e.pageY - this.canvasOffset.top;
    var isHittingTheSamePos = (curPosX == this.mouseDownPos.x && curPosY = this.mouseDownPos.y);
    var isHitted = this.HitDetection(curPosX, curPosY); //if only isHittingTheSamePos == true
    if (this.mouseState == REAL3D.LayoutDesignState.MouseState.NONE)
    {
        if (isHitted)
        {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.HITUSERPOINT;
        }
        else
        {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.HITCANVAS;
        }
    }
    else if (this.mouseState == REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT)
    {
        if (HitTheSamePoint)
        {
            this.FinishCreatingNewUserPoint();
            this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
        }
        else
        {
            if (isHitted)
            {
                this.AddHittedUserPointNeighbor();
            }
            else
            {
                this.CreateNewUserPoint(curPosX, curPosY);
            }
        }
    }
    this.mouseDownPos.set(curPosX, curPosY);
    this.mouseMovePos.set(curPosX, curPosY);
}

REAL3D.LayoutDesignState.prototype.MouseMove = function(e)
{
    //test
    if (this.isMouseDown)
    {
        var offset = $(REAL3D.RenderManager.renderer.domElement).offset();        
        var eltx = e.pageX - offset.left;
        var elty = e.pageY - offset.top;
        var mouseDifX = eltx - this.mousePos.x;
        var mouseDifY = elty - this.mousePos.y;
        var rotateObj = REAL3D.RenderManager.scene.getObjectByName("root", true);
        rotateObj.rotateXGlobal(mouseDifY / 300);
        rotateObj.rotateYGlobal(mouseDifX / 300);
        this.mousePos.set(eltx, elty);
    }
    //

    var curPosX = e.pageX - this.canvasOffset.left;
    var curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState == REAL3D.LayoutDesignState.MouseState.HITUSERPOINT)
    {
        if (IsMouseMoved(curPosX, curPosY))
        {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT;
            this.DraggingUserPoint();
        }
    }
    else if (this.mouseState == REAL3D.LayoutDesignState.MouseState.DRAGGINGUSERPOINT)
    {
        this.DraggingUserPoint();
    }
    else if (this.mouseState == REAL3D.LayoutDesignState.MouseState.HITCANVAS)
    {
        if (IsMouseMoved(curPosX, curPosY))
        {
            this.mouseState = REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS;
            this.DraggingCanvas();
        }
    }
    else if (this.mouseState == REAL3D.LayoutDesignState.MouseState.DRAGGINGCANVAS)
    {
        DraggingCanvas();
    }

    this.mouseMovePos.set(curPosX, curPosY);
}

REAL3D.LayoutDesignState.prototype.MouseUp = function(e)
{
    //test
    this.isMouseDown = false;
    //

    var curPosX = e.pageX - this.canvasOffset.left;
    var curPosY = e.pageY - this.canvasOffset.top;
    if (this.mouseState == REAL3D.LayoutDesignState.MouseState.DraggingPoint)
    {
        this.DraggingUserPoint();
        this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
    }
    else if (this.mouseState == REAL3D.LayoutDesignState.MouseState.DraggingCanvas)
    {
        DraggingCanvas();
        this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
    }
    else if (this.mouseState == REAL3D.LayoutDesignState.MouseState.HITUSERPOINT)
    {
        this.AddHittedUserPointNeighbor();
        this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
    } 
    else if (this.MouseState == REAL3D.LayoutDesignState.MouseState.HITCANVAS)
    {
        this.CreateNewUserPoint(curPosX, curPosY);
        this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
    }
}

REAL3D.LayoutDesignState.prototype.UpdateUserUIDataDisplay = function()
{

}

REAL3D.LayoutDesignState.MouseState = 
{
    NONE : 0,
    CREATINGUSERPOINT : 1,
    DRAGGINGUSERPOINT : 2, 
    DRAGGINGCANVAS : 3,
    HITUSERPOINT : 4,
    HITCANVAS : 5
}

REAL3D.LayoutDesignState.prototype.HitDetection = function(mousePosX, mousePosY)
{
    mousePosY = this.winH - mousePosY;
    var cameraPos = this.cameraOrtho.position;
    var worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    var worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    this.hitUserPointIndex = this.userUIData.SelectPoint(worldPosX, worldPosY);
    if (this.hitUserPointIndex > -1)
    {
        return true;
    }
    else
    {
        return false;
    }
}

REAL3D.LayoutDesignState.prototype.AddHittedUserPointNeighbor = function()
{
    if (this.lastCreatedPointIndex > -1)
    {
        this.userUIData.ConnectPoints(this.lastCreatedPointIndex, this.hitUserPointIndex);
    }
    this.lastCreatedPointIndex = this.hitUserPointIndex;
}

REAL3D.LayoutDesignState.prototype.CreateNewUserPoint = function(mousePosX, mousePosY)
{
    mousePosY = this.winH - mousePosY;
    var cameraPos = this.cameraOrtho.position;
    var worldPosX = mousePosX - this.winW / 2 + cameraPos.x;
    var worldPosY = mousePosY - this.winH / 2 + cameraPos.y;
    var newPointId = this.userUIData.AddNewPoint(worldPosX, worldPosY);
    this.userUIData.ConnectPoints(this.lastCreatedPointIndex, newPointId);
    this.lastCreatedPointIndex = newPointId;
}

REAL3D.LayoutDesignState.prototype.FinishCreatingNewUserPoint = function()
{
    this.lastCreatedPointIndex = -1;
}

REAL3D.LayoutDesignState.prototype.IsMouseMoved = function(mousePosX, mousePosY)
{
    return false;
}

REAL3D.LayoutDesignState.prototype.DraggingUserPoint = function()
{

}

REAL3D.LayoutDesignState.prototype.DraggingCanvas = function()
{

}

REAL3D.LayoutDesignState.prototype.DISTANCETHRESHOLD = 10;

REAL3D.LayoutDesignState.UserPoint = function(posX, posY)
{
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
}

REAL3D.LayoutDesignState.UserTree = function()
{
    this.points = [];
    this.curLastId = -1;
}

REAL3D.LayoutDesignState.UserTree.prototype = 
{
    AddNewPoint : function(userPoint)
    {
        this.curLastId++;
        this.points.push(userPoint);
        return this.curLastId;
    },

    ConnectPoints : function(index1, index2)
    {
        this.points[index1].neighbors.push(this.points[index2]);
        this.points[index2].neighbors.push(this.points[index1]);
    },

    DeletePoint : function(index)
    {

    },

    DeleteEdge : function(index1, index2)
    {

    },

    SelectPoint : function(posX, posY) //if not select, return -1
    {
        for (var pid = 0; pid < this.curLastId; pid++)
        {
            var curPoint = this.points[pid];
            if (curPoint !== undefined && curPoint != null)
            {
                var dist = (posX - curPoint.posX) * (posX - curPoint.posX) + (posY - curPoint.posY) * (posY - curPoint.posY);
                if (dist < REAL3D.LayoutDesignState.DISTANCETHRESHOLD)
                {
                    return pid;
                }
            }
        }
        reutrn -1;
    }
}

///////////////////////////////////////////////////////////////////////////////
function EnterDesignSpaceState()
{
    var layoutDesignState = new REAL3D.LayoutDesignState();
    REAL3D.StateManager.EnterState(layoutDesignState);
}

function SwitchToHelloState()
{
    REAL3D.StateManager.SwitchCurrentState("HelloState");
}

function SwitchToDesignSpaceState()
{
    REAL3D.StateManager.SwitchCurrentState("LayoutDesignState");
}