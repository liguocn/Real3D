Real3D = {};

Real3D.Frame = function()
{
	this.scene = null;
	this.camera1 = null;
	this.camera2 = null;
	this.renderer = null;
	this.cube = null;
	this.cameraType = 1;
}

Real3D.Frame.prototype.run = function()
{
	this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.005;
    //console.log("cameraType: " + cameraType);

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
    var that = this;
    requestAnimationFrame( function() { that.run();} );
}

Real3D.Frame.prototype.init = function()
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
	var canvContainer = document.getElementById("designspace");
	canvContainer.appendChild(this.renderer.domElement);
	console.log("i am rendering");

	var geometry = new THREE.BoxGeometry( 2, 2, 2 );
	var material = new THREE.MeshBasicMaterial( { color: 0xfefefe } );
	this.cube = new THREE.Mesh( geometry, material );
	this.scene.add( this.cube );
}
