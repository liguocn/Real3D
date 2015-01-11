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
	REAL3D.StateManager.Init();
},

REAL3D.Framework.Run = function()
{
	REAL3D.StateManager.Update();
	REAL3D.RenderManager.Update();
    var that = this;
    requestAnimationFrame( function() { that.Run();} );
}

REAL3D.StateManager = 
{
	Init : function()
	{
		var initState = new REAL3D.HelloState();
		this.EnterState(initState);
	},

	Update : function()
	{
		this.currentState.Update();
	},

	EnterState : function(state)
	{
		if (state === undefined || state == null) 
		{
			console.error("State is invalid");
			return false;
		}
		if (this.currentState != null)
		{
			this.currentState.Exit();
		}
		this.stateSet[state.stateName] = state;
		this.currentState = state;
		this.currentState.Enter();
	},

	SwitchCurrentState : function(stateName)
	{
		if (this.stateSet[stateName] === undefined)
		{
			return false;
		}
		if (this.currentState != null)
		{
			if (this.currentState.stateName == stateName)
			{
				console.log("Switch to the same state: ", stateName);
				return true;
			}
			this.currentState.Exit();
		}
		this.currentState = this.stateSet[stateName];
		this.currentState.Enter();
		return true;
	},

	GetState : function(stateName)
	{
		return this.stateSet[stateName];
	},

	MouseDown : function(e)
	{
		this.currentState.MouseDown(e);
	},

	MouseUp :  function(e)
	{
		this.currentState.MouseUp(e);
	},

	MouseMove : function(e)
	{
		this.currentState.MouseMove(e);
	},

	KeyPress : function(e)
	{
		this.currentState.KeyPress(e);
	},

	currentState : null,
	stateSet : []
}

REAL3D.Listener = 
{
	Init : function(dom)
	{
		var that = this;
		dom.addEventListener("mousedown", function(e) { that.MouseDown(e); }, false );
		dom.addEventListener("mouseup", function(e) { that.MouseUp(e); }, false );
		dom.addEventListener("mousemove", function(e) { that.MouseMove(e); }, false);
		dom.addEventListener("keypress", function(e) { that.KeyPress(e); }, false);
		dom.setAttribute("tabindex", 1);
		dom.focus();
		dom.style.outline = "none";
	},

	MouseDown : function(e)
	{
		REAL3D.StateManager.MouseDown(e);
	},

	MouseUp : function(e)
	{
		REAL3D.StateManager.MouseUp(e);
	},

	MouseMove : function(e)
	{
		REAL3D.StateManager.MouseMove(e);
	},

	KeyPress : function(e)
	{
		REAL3D.StateManager.KeyPress(e);
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

REAL3D.Publisher = function() 
{
    this.messageTypes = {};
}

REAL3D.Publisher.prototype.subscribe = function(message, subscriber, callback) 
{
    var subscribers = this.messageTypes[message];
    if (subscribers)
    {
        if (this.findSubscriber(subscribers, subscriber) != -1)
        {
            return;
        }
    }
    else
    {
        subscribers = [];
        this.messageTypes[message] = subscribers;
    }

    subscribers.push({ subscriber : subscriber, callback : callback });
}

REAL3D.Publisher.prototype.unsubscribe = function(message, subscriber, callback) 
{
    if (subscriber)
    {
        var subscribers = this.messageTypes[message];

        if (subscribers)
        {
            var i = this.findSubscriber(subscribers, subscriber, callback);
            if (i != -1)
            {
                this.messageTypes[message].splice(i, 1);
            }
        }
    }
    else
    {
        delete this.messageTypes[message];
    }
}

REAL3D.Publisher.prototype.publish = function(message) 
{
    var subscribers = this.messageTypes[message];

    if (subscribers)
    {
        for (var i = 0; i < subscribers.length; i++)
        {
            var args = [];
            for (var j = 0; j < arguments.length - 1; j++)
            {
                args.push(arguments[j + 1]);
            }
            subscribers[i].callback.apply(subscribers[i].subscriber, args);
        }
    }
}

REAL3D.Publisher.prototype.findSubscriber = function (subscribers, subscriber) 
{
    for (var i = 0; i < subscribers.length; i++)
    {
        if (subscribers[i] == subscriber)
        {
            return i;
        }
    }
    
    return -1;
}

REAL3D.StateBase = function()
{
	REAL3D.Publisher.call(this);
}

REAL3D.StateBase.prototype = 
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
	{},

	KeyPress : function(e)
	{}
}

REAL3D.HelloState = function()
{
	REAL3D.StateBase.call(this);
	this.stateName = "HelloState";
}

REAL3D.HelloState.prototype = Object.create(REAL3D.StateBase.prototype);

REAL3D.HelloState.prototype.Enter = function()
{
	console.log("Enter HelloState");
}

REAL3D.HelloState.prototype.Exit = function()
{
	console.log("Exit HelloState");
}

REAL3D.HelloState.prototype.MouseDown = function(e)
{
	console.log("HelloState MouseDown: ", e.clientX, e.clientY, e.offsetX, e.offsetY);
}

REAL3D.HelloState.prototype.KeyPress = function(e)
{
	console.log("HelloState KeyPress: ", e.which);
}
