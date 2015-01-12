REAL3D.LayoutDesignState = function()
{
	REAL3D.StateBase.call(this);
	this.stateName = "LayoutDesignState";
	this.mousePos = new THREE.Vector2(0, 0);
	this.isMouseDown = false;
	this.canvasOffset = null;
	this.cameraOrtho = null;
	this.cameraOrthoName = "CameraOrtho";
	this.cameraPosition = new THREE.Vector3(0, 0, 1000);
	this.mouseState = REAL3D.LayoutDesignState.MouseState.None;
	this.mouseDownPos = new THREE.Vector2(0, 0);
	this.mouseMovePos = new THREE.Vector2(0, 0);
}

REAL3D.LayoutDesignState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.LayoutDesignState.prototype.Enter = function()
{
	console.log("Enter LayoutDesignState");
	if (REAL3D.RenderManager.GetCamera(this.cameraOrthoName) === undefined) 
	{
		var winW = REAL3D.RenderManager.windowWidth;
		var winH = REAL3D.RenderManager.windowHeight;
		console.log("Win size: ", winW, winH);
		var cameraOrthographic = new THREE.OrthographicCamera( winW / (-2), winW / 2, winH / 2, winH / (-2), 1, 1000);
		cameraOrthographic.position.copy(this.cameraPosition);
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
			FinishCreatingNewUsePoint();
			this.mouseState = REAL3D.LayoutDesignState.MouseState.NONE;
		}
		else 
		{
			if (isHitted)
			{
				this.AddUserPointNeighbor();
			}
			else
			{
				this.CreateNewUsePoint();
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
		this.AddUserPointNeighbor();
		this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
	} 
	else if (this.MouseState == REAL3D.LayoutDesignState.MouseState.HITCANVAS)
	{
		this.CreateNewUsePoint();
		this.mouseState = REAL3D.LayoutDesignState.MouseState.CREATINGUSERPOINT;
	}
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

}

REAL3D.LayoutDesignState.prototype.AddUserPointNeighbor = function()
{

}

REAL3D.LayoutDesignState.prototype.CreateNewUsePoint = function()
{

}

REAL3D.LayoutDesignState.prototype.FinishCreatingNewUsePoint = function()
{

}

REAL3D.LayoutDesignState.prototype.IsMouseMoved = function(mousePosX, mousePosY)
{

}

REAL3D.LayoutDesignState.prototype.DraggingUserPoint = function()
{

}

REAL3D.LayoutDesignState.prototype.DraggingCanvas = function()
{

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