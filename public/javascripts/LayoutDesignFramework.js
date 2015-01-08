var REAL3D = {};

REAL3D.Framework = {};

REAL3D.Framework.Init = function(containerId)
{
	var dom = REAL3D.RenderManager.Init();
	REAL3D.Listener.Init(dom);
	var canvContainer = document.getElementById(containerId);
	canvContainer.appendChild(dom);
	REAL3D.AppManager.Init();
},

REAL3D.Framework.Run = function()
{
	REAL3D.AppManager.Update();
	REAL3D.RenderManager.Update();
    var that = this;
    requestAnimationFrame( function() { that.Run();} );
}

REAL3D.AppManager = 
{
	Init : function()
	{
		var initApp = new REAL3D.HelloApp();
		this.EnterApp(initApp);
	},

	Update : function()
	{
		this.currentApp.Update();
	},

	EnterApp : function(app)
	{
		if (app === undefined || app == null) 
		{
			console.error("app is invalid");
			return false;
		}
		if (this.currentApp != null)
		{
			this.currentApp.Exit();
		}
		this.appSet[app.appName] = app;
		this.currentApp = app;
		this.currentApp.Enter();
	},

	SwitchCurrentApp : function(appName)
	{
		if (this.appSet[appName] === undefined)
		{
			return false;
		}
		if (this.currentApp != null)
		{
			if (this.currentApp.appName == appName)
			{
				console.log("Switch to the same app: ", appName);
				return true;
			}
			this.currentApp.Exit();
		}
		this.currentApp = this.appSet[appName];
		this.currentApp.Enter();
		return true;
	},

	GetApp : function(appName)
	{
		return this.appSet[appName];
	},

	MouseDown : function(e)
	{
		this.currentApp.MouseDown(e);
	},

	MouseUp :  function(e)
	{
		this.currentApp.MouseUp(e);
	},

	MouseMove : function(e)
	{
		this.currentApp.MouseMove(e);
	},

	currentApp : null,
	appSet : []
}

REAL3D.Listener = 
{
	Init : function(dom)
	{
		var that = this;
		dom.addEventListener("mousedown", function(e) { that.MouseDown(e); }, false );
		dom.addEventListener("mouseup", function(e) { that.MouseUp(e); }, true );
		dom.addEventListener("mousemove", function(e) {that.MouseMove(e); }, true);
	},

	MouseDown : function(e)
	{
		REAL3D.AppManager.MouseDown(e);
	},

	MouseUp : function(e)
	{
		REAL3D.AppManager.MouseUp(e);
	},

	MouseMove : function(e)
	{
		REAL3D.AppManager.MouseMove(e);
	}
};


REAL3D.RenderManager = 
{
    scene : null,
	camera : null,
	renderer : null,
	cube : null,
};

REAL3D.RenderManager.Init = function()
{
	console.log("frame.init");
	this.scene = new THREE.Scene();
	var windowWidth = 1024;
	var windowHeight = 768;
	this.camera = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 0.1, 1000 );
	this.camera.position.set(0, 0, 10);
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( windowWidth, windowHeight);
	var geometry = new THREE.BoxGeometry( 2, 2, 2 );
	var material = new THREE.MeshBasicMaterial( { color: 0xfefefe } );
	this.cube = new THREE.Mesh( geometry, material );
	this.cube.name = "root";
	this.cube.position.set(1, 1, 1);
	var geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
	var material2 = new THREE.MeshBasicMaterial({color: 0x9efe9e});
	this.cube2 = new THREE.Mesh(geometry2, material2);
	this.cube2.position.x = 5;
	this.cube2.name = "cube2";
	this.cube.add(this.cube2);
	this.scene.add( this.cube );
	return this.renderer.domElement;
}

REAL3D.RenderManager.Update = function()
{
	//this.cube.rotation.x += 0.001;
    //this.cube.rotation.y += 0.05;

    this.renderer.render(this.scene, this.camera);
}


REAL3D.AppBase = function()
{}

REAL3D.AppBase.prototype = 
{
	Enter : function()
	{},

	Update : function()
	{},

	Exit : function()
	{},

	MouseDown : function(e)
	{},

	MouseUp : function(e)
	{},

	MouseMove : function(e)
	{}
}

REAL3D.HelloApp = function()
{
	REAL3D.AppBase.call(this);
	this.appName = "HelloApp";
}

REAL3D.HelloApp.prototype = Object.create(REAL3D.AppBase.prototype);

REAL3D.HelloApp.prototype.Enter = function()
{
	console.log("Enter HelloApp");
}

REAL3D.HelloApp.prototype.Exit = function()
{
	console.log("Exit HelloApp");
}

REAL3D.HelloApp.prototype.MouseDown = function(e)
{
	console.log("HelloApp MouseDown: ", e.clientX, e.clientY, e.offsetX, e.offsetY);
}

REAL3D.LayoutDesignApp = function()
{
	REAL3D.AppBase.call(this);
	this.appName = "LayoutDesignApp";
	this.mousePos = new THREE.Vector2(0, 0);
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
	console.log("LayoutDesignApp MouseDown: ", e.clientX, e.clientY, e.offsetX, e.offsetY);
	this.mousePos.set(e.offsetX, e.offsetY);
}

REAL3D.LayoutDesignApp.prototype.MouseMove = function(e)
{
	//console.log("Mouse move: ", e.which);
	if (e.which == 1)
	{
		console.log("Left mouse move");
		var mouseDifX = e.offsetX - this.mousePos.x;
		var mouseDifY = e.offsetY - this.mousePos.y;
		var rotateObj = REAL3D.RenderManager.scene.getObjectByName("root", true);
		rotateObj.rotateXGlobal(mouseDifY / 500);
		rotateObj.rotateYGlobal(mouseDifX / 500);
		this.mousePos.set(e.offsetX, e.offsetY);
	}
	else if (e.which == 2)
	{
		console.log("Middle mouse move");
	}
	else if (e.which == 3)
	{
		console.log("Right mouse move");
	}
}

REAL3D.LayoutDesignApp.prototype.MouseUp = function(e)
{

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
