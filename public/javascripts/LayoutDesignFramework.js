var REAL3D = {};

REAL3D.Framework = function()
{
	this.listener = new REAL3D.Listerner();
	this.renderManager = new REAL3D.RenderManager();
}

REAL3D.Framework.prototype =
{
	Init : function(containerId)
	{
		var dom = this.renderManager.Init();
		this.listener.Init(dom);
		var canvContainer = document.getElementById(containerId);
		canvContainer.appendChild(dom);
		console.log("i am rendering");
	},

	Run : function()
	{
		this.renderManager.Run();
	    var that = this;
	    requestAnimationFrame( function() { that.Run();} );
	}
}

REAL3D.Listerner = function()
{
	
}

REAL3D.Listerner.prototype =
{
	Init : function(dom)
	{
		var that = this;
		dom.addEventListener('mousedown', function() { that.OnMouseDown(); }, false );
		dom.addEventListener('mouseup', function() { that.OnMouseUp(); }, false );
	},

	OnMouseDown : function()
	{
		console.log("mousedown:", event.clientX, event.clientY, window.event.offsetX, window.event.offsetY);
	},

	OnMouseUp :  function()
	{
		console.log("mouseup:", event.clientX, event.clientY);
	}
}

REAL3D.AppBase = function()
{

}

REAL3D.AppManager = function()
{

}

REAL3D.RenderManager = function()
{
    this.scene = null;
	this.camera1 = null;
	this.camera2 = null;
	this.renderer = null;
	this.cube = null;
	this.cameraType = 1;
}

REAL3D.RenderManager.prototype = 
{
	Init : function()
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
	},

	Run : function()
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
}