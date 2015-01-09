var REAL3D = {};

REAL3D.Framework = 
{
};

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
		dom.addEventListener("mouseup", function(e) { that.MouseUp(e); }, false );
		dom.addEventListener("mousemove", function(e) { that.MouseMove(e); }, false);
		//dom.addEventListener("keypress", function() { that.KeyPress(); }, false);
		//dom.focus();
		window.addEventListener("keypress", function() { that.KeyPress(); }, false);
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
	},

	KeyPress : function()
	{
		console.log("KeyPress");
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
	this.renderer = new THREE.WebGLRenderer({antialias:true});
	this.renderer.setClearColor(0xd1d1d1, 1);
	this.renderer.setSize( windowWidth, windowHeight);
	var geometry = new THREE.BoxGeometry( 2, 2, 2 );
	var material = new THREE.MeshBasicMaterial( { color: 0xfcfcfc } );
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
