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
	},

	Update : function()
	{

	},

	MouseDown : function(e)
	{
		console.log("AppManager: mousedown:", e.clientX, e.clientY, e.offsetX, e.offsetY);
	},

	MouseUp :  function(e)
	{
		console.log("AppManager: mouseup:", e.clientX, e.clientY);
	},

	MouseMove : function(e)
	{

	}
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
	this.camera1 = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 0.1, 1000 );
	this.camera1.position.set(0, 0, 10);
	this.camera2 = new THREE.OrthographicCamera( -5, 5, -5, 5, 1, 1000);
	this.camera2.position.set(0, 0, 10);
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( windowWidth, windowHeight);
	var geometry = new THREE.BoxGeometry( 2, 2, 2 );
	var material = new THREE.MeshBasicMaterial( { color: 0xfefefe } );
	this.cube = new THREE.Mesh( geometry, material );
	this.scene.add( this.cube );
	return this.renderer.domElement;
}

REAL3D.RenderManager.Update = function()
{
	this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.005;

    if (this.cameraType < 250) 
    {
    	this.renderer.render(this.scene, this.camera1);
    	this.cameraType++;
    }
    else
    {
    	this.renderer.render(this.scene, this.camera2);
    	this.cameraType++;
    	if (this.cameraType == 500) 
    	{
    		this.cameraType = 1;
    	};
    }
}


REAL3D.AppBase = function()
{

}
