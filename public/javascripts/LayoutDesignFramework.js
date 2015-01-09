REAL3D.LayoutDesignApp = function()
{
	REAL3D.AppBase.call(this);
	this.appName = "LayoutDesignApp";
	this.mousePos = new THREE.Vector2(0, 0);
	this.isMouseDown = false;
}

REAL3D.LayoutDesignApp.prototype = Object.create(REAL3D.AppBase.prototype);

REAL3D.LayoutDesignApp.prototype.Enter = function()
{
	console.log("Enter LayoutDesignApp");
}

REAL3D.LayoutDesignApp.prototype.Exit = function()
{
	console.log("Exit LayoutDesignApp");
}

REAL3D.LayoutDesignApp.prototype.MouseDown = function(e)
{
	var offset = $(REAL3D.RenderManager.renderer.domElement).offset();	
	this.mousePos.set(e.pageX - offset.left, e.pageY - offset.top);
	this.isMouseDown = true;
	console.log("LayoutDesignApp MouseDown: ", e.pageX - offset.left, e.pageY - offset.top);
}

REAL3D.LayoutDesignApp.prototype.MouseMove = function(e)
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

REAL3D.LayoutDesignApp.prototype.MouseUp = function(e)
{
	this.isMouseDown = false;
}

function EnterDesignSpaceApp()
{
	var layoutDesignApp = new REAL3D.LayoutDesignApp();
	REAL3D.AppManager.EnterApp(layoutDesignApp);
}

function SwitchToHelloApp()
{
	REAL3D.AppManager.SwitchCurrentApp("HelloApp");
}

function SwitchToDesignSpaceApp()
{
	REAL3D.AppManager.SwitchCurrentApp("LayoutDesignApp");
}
