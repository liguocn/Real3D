var REAL3D = {};

REAL3D.Framework = {};

REAL3D.Framework.Init = function(containerId)
{
	var dom = REAL3D.RenderManager.Init();
	REAL3D.Listener.Init(dom);
	var canvContainer = document.getElementById(containerId);
	canvContainer.appendChild(dom);
	REAL3D.AppManager.Init();
	console.log("i am rendering");
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
		
		this.appSet.push(app);
		this.currentApp = app;
	},

	SwitchCurrentApp : function(appName)
	{

	},

	GetApp : function(appName)
	{

	},

	MouseDown : function(e)
	{
		console.log("AppManager: mousedown:", e.clientX, e.clientY, e.offsetX, e.offsetY);
		this.currentApp.MouseDown(e);
	},

	MouseUp :  function(e)
	{
		console.log("AppManager: mouseup:", e.clientX, e.clientY);
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
		dom.addEventListener('mousedown', function(e) { that.MouseDown(e); }, false );
		dom.addEventListener('mouseup', function(e) { that.MouseUp(e); }, false );
	},

	MouseDown : function(e)
	{
		console.log("Listener: mousedown:", e.clientX, e.clientY, e.offsetX, e.offsetY);
		REAL3D.AppManager.MouseDown(e);
	},

	MouseUp : function(e)
	{
		console.log("Listener: mouseup:", e.clientX, e.clientY);
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
	camera1 : null,
	camera2 : null,
	renderer : null,
	cube : null,
	cameraType : 1
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
	var geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
	var material2 = new THREE.MeshBasicMaterial({color: 0x9efe9e});
	this.cube2 = new THREE.Mesh(geometry2, material2);
	this.cube2.position.x = 5;
	this.cube.add(this.cube2);
	this.scene.add( this.cube );
	//this.scene.add( this.cube2);
	return this.renderer.domElement;
}

REAL3D.RenderManager.Update = function()
{
	this.cube.rotation.x += 0.001;
    this.cube.rotation.y += 0.05;

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

REAL3D.HelloApp.prototype.MouseDown = function(e)
{
	console.log("HelloApp MouseDown: ", e.clientX, e.clientY, e.offsetX, e.offsetY);
}
