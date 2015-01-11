REAL3D.LayoutDesignState = function()
{
	REAL3D.StateBase.call(this);
	this.stateName = "LayoutDesignState";
	this.mousePos = new THREE.Vector2(0, 0);
	this.isMouseDown = false;
}

REAL3D.LayoutDesignState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.LayoutDesignState.prototype.Enter = function()
{
	console.log("Enter LayoutDesignState");
}

REAL3D.LayoutDesignState.prototype.Exit = function()
{
	console.log("Exit LayoutDesignState");
}

REAL3D.LayoutDesignState.prototype.MouseDown = function(e)
{
	var offset = $(REAL3D.RenderManager.renderer.domElement).offset();	
	this.mousePos.set(e.pageX - offset.left, e.pageY - offset.top);
	this.isMouseDown = true;
	console.log("LayoutDesignState MouseDown: ", e.pageX - offset.left, e.pageY - offset.top);
}

REAL3D.LayoutDesignState.prototype.MouseMove = function(e)
{
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
}

REAL3D.LayoutDesignState.prototype.MouseUp = function(e)
{
	this.isMouseDown = false;
}

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
