function mousedown()
{
	console.log("mousedown:", event.clientX, event.clientY, window.event.offsetX, window.event.offsetY);
} 

function mouseup()
{
	console.log("mouseup:", event.clientX, event.clientY);
}