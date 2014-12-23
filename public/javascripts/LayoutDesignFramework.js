var scene = new THREE.Scene();
var windowWidth = 1024;
var windowHeight = 768;
var camera = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( windowWidth, windowHeight);
var canvContainer = document.getElementById("designspace");
canvContainer.appendChild(renderer.domElement);
console.log("i am rendering");

var geometry = new THREE.BoxGeometry( 2, 2, 2 );
var material = new THREE.MeshBasicMaterial( { color: 0xd38571 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
    requestAnimationFrame( render );

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    renderer.render(scene, camera);
};

//render();