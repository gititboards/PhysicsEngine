/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.World',
/* @Static */
{

	defaultGravity: 1000,
	defaultFriction: 0.1,
	defaultBorderSpeedReduction: 0.5,
	
},
/* @Prototype */
{

	gravity: null,
	friction: null,
	borderSpeedReduction: null,
	objects: [],
	canvasHeight: 0,
	canvasWidth: 0,
	canvas2dContext: null,
	doRender: true, //stop rendering by setting this to false
	renderInterval: 10, //interval in ms ,
	
	
	
	/**
	 * Constructor
	 * 
	 * @return	void
	 */
	
	init: function() {

		//set default values
		this.gravity = Physicsengine.Controllers.World.defaultGravity;
		this.friction = Physicsengine.Controllers.World.defaultFriction;
		this.borderSpeedReduction = Physicsengine.Controllers.World.defaultBorderSpeedReduction;
	
		//set height and width in pixel in case it is set in percentage
		this.canvasHeight = $(this.element).height();
		this.canvasWidth = $(this.element).width();
		$(this.element).attr('height', this.canvasHeight);
		$(this.element).attr('width', this.canvasWidth);

		//get the canvas' 2d context
		this.canvas2dContext = this.element.get(0).getContext("2d");
		
		//start renderin
		this.startRendering();

	},
	
	
	/**
	 * Add sphere
	 * 
	 * Adds a sphere to the world canvas
	 * 
	 * @param	{Number} radius
	 * @param	{Number} positionX
	 * @param	{Number} positionY
	 * @return	{Boolean}
	 */
	
	addSphere: function(radius, positionX, positionY) {

		//instantiate a sphere controller
		var sphere = $('<div />').physicsengine_sphere().controller();
		sphere.radius = radius;
		sphere.positionX = positionX;
		sphere.positionY = positionY;
		//sphere.color = 'rgb(' + randomNumber(0, 255) + ', ' + randomNumber(0, 255) + ', ' + + randomNumber(0, 255) + ')';
		
		//check if the sphere collides with any other sphere
		for(var i = 0; i < this.objects.length; i++) {
			var object = this.objects[i];
			
			if(sphere.checkCollisionWith(object) || sphere.checkCollisionWith(this)) {

				return false;
				
			}
		}
		
		//add the sphere to the list with all objects
		this.objects.push(sphere);
		
		return true;
	},
	
	
	/**
	 * Render
	 * 
	 * Infinite drawing loop
	 * 
	 * @return	void
	 */
	
	render: function() {

		//clear canvas
		this.canvas2dContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		//render all objects
		for(var i = 0; i < this.objects.length; i++) {

			var object = this.objects[i];
			
			//check for collisions
			for(var j = 0; j < this.objects.length; j++) {

				var otherObject = this.objects[j];
					
				//check for collision with another object
				if(object != otherObject && object.checkCollisionWith(otherObject)) {
					
					//to properly collide the objects we have to reverse one step before the collision happens
					object = this.reverseCalculateState(this.renderInterval / 1000, object);
					otherObject = this.reverseCalculateState(this.renderInterval / 1000, otherObject);
					
					//collide the objects
					object.collideWith(otherObject);
					
					//step forward
					object = this.calculateState(this.renderInterval / 1000, object);
					otherObject = this.calculateState(this.renderInterval / 1000, otherObject);
					
				//check for collision with the world borders
				} else if(object.checkCollisionWith(this)) {

					//to properly collide the objects we have to reverse one step before the collision happens
					object = this.reverseCalculateState(this.renderInterval / 1000, object);
					
					//collide the object with the wall
					object.collideWith(this);
					
					//step forward
					object = this.calculateState(this.renderInterval / 1000, object);
					
				} else {
					continue;
				}
				
				
				
				//stop dragging
				$(this.element).trigger('mouseup.dragging-' + i);
				break;

			}
			
			//set new position for object according to speed and direction
			if(!object.dragging) {
				object = this.calculateState(this.renderInterval / 1000, object)
			}
			

			//render the sphere to the canvas
			object.renderObject(this.canvas2dContext);
			
			
		}
		
		if(this.doRender) {
			window.setTimeout($.proxy(this.render, this), this.renderInterval);
		}

	},
	

	/**
	 * Start rendering
	 * 
	 * @return	void
	 */
	
	startRendering: function() {
		
		this.render();
		
	},
	
	
	/**
	 * Stop rendering
	 * 
	 * @return	void
	 */
	
	stopRendering: function() {
		
		this.doRender = false;
		
	},
	
	
	/**
	 * Calculate State
	 * 
	 * @param	{Number} t	time delta
	 * @param	{Object} object
	 * 
	 * @return	{Object}
	 */
	
	calculateState: function(t, object) {

		object.positionX = object.positionX + t * object.speedX;
		object.positionY = object.positionY + t * object.speedY;
		object.speedX = object.speedX - object.speedX * this.friction * t;
		object.speedY = object.speedY - object.speedY * this.friction * t + this.gravity * t;

		return object;
		
	},
	
	
	/**
	 * Reverse Calculate State
	 * 
	 * @param	{Number} t	time delta
	 * @param	{Object} object
	 * 
	 * @return	{Object}
	 */
	
	reverseCalculateState: function(t, object) {

		object.speedX = object.speedX + object.speedX * this.friction * t;
		object.speedY = object.speedY + object.speedY * this.friction * t - this.gravity * t;
		object.positionX = object.positionX - t * object.speedX;
		object.positionY = object.positionY - t * object.speedY;

		return object;
		
	},
	
	
	/**
	 * Reset
	 * 
	 * Empty canvas
	 * 
	 * @return	void
	 */
	
	reset: function() {

		//set height and width in pixel in case it is set in percentage
		this.canvasHeight = $(this.element).height();
		this.canvasWidth = $(this.element).width();
		$(this.element).attr('height', this.canvasHeight);
		$(this.element).attr('width', this.canvasWidth);
		
		//remove objects
		this.objects = [];
		
		//clear canvas
		this.canvas2dContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	
	},
	
	
	/**
	 * Mousedown event for object acceleration
	 * 
	 * @param	{Object} el		element that triggered the event
	 * @param	{Object} ev		event object
	 */
	
	'mousedown': function(el, ev) {

		//check if the user tries to drag an object
		for(var i = 0; i < this.objects.length; i++) {
			var object = this.objects[i];

			//is the mouse position inside the object?
			if(object.isCoordinateInObject(ev.clientX, ev.clientY)) {

				var posX = ev.clientX;
				var posY = ev.clientY;
				var diffToCenterX = ev.clientX - object.positionX;
				var diffToCenterY = ev.clientY - object.positionY;
				var dragPosX = posX;
				var dragPosY = posY;
				var speedX = 0;
				var speedY = 0;
				
				//tell other parts of the application that we are now dragging this object
				object.dragging = true;
				
				//get dragging speed and direction
				var speedInterval = window.setInterval(function() {
					
					var posDiffX = dragPosX - posX;
					var posDiffY = dragPosY - posY;
					
					//calc speed
					speedX = posDiffX * 10;
					speedY = posDiffY * 10;

					//new position
					posX = dragPosX;
					posY = dragPosY;
					
				}, 100);
				
				//track mouse movements
				$(this.element).bind('mousemove.dragging-' + i, $.proxy(function(ev) {

					//set new position
					object.positionX = ev.clientX - diffToCenterX;
					object.positionY = ev.clientY - diffToCenterY;

					//store mouse position so the speed interval can calculate the pixel diff
					dragPosX = object.positionX;
					dragPosY = object.positionY;

				}, this));
				
				//unbind all events on mouse up
				$(this.element).bind('mouseup.dragging-' + i, $.proxy(function(ev) {

					$(this.element).unbind('mousemove.dragging-' + i + ' mouseup.dragging-' + i);
					
					//stop speed checking interval
					window.clearInterval(speedInterval);

					//set the new speed and direction for the object
					object.speedX = speedX;
					object.speedY = speedY;
					
					//dragging stopped
					object.dragging = false;
										
				}, this));				
				
				break;
				
			}
			
		}
		
	}
	
});