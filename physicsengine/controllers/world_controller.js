/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.World',
/* @Static */
{

	defaultGravity: 0,
	defaultFriction: 0.1,
	defaultBorderSpeedReduction: 0.5,
	defaultRenderInterval: 20,
	defaultCalculateInterval: 10,
	defaultSlowMotion: 1,
	defaultAutoSlowMoFactor: 15	
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
	doCalculate: true, //stop calculating by setting this to false
	renderInterval: null, //interval in ms ,
	calculateInterval: null, //interval in ms ,	
	slowMotion: null,
	autoSlowMoFactor: null,
	autoSlowMoDistance: 300,
	doPauseRender : false,
	doPauseCalc : false,
	aroundCollision: false,
	useBetterNumerical: true,
	
	/**
	 * Constructor
	 * 
	 * @return	void
	 */
	
	init: function() {

		//set default values
		this.gravity = Physicsengine.Controllers.World.defaultGravity;
		this.friction = Physicsengine.Controllers.World.defaultFriction;
		this.renderInterval = Physicsengine.Controllers.World.defaultRenderInterval;
		this.calculateInterval = Physicsengine.Controllers.World.defaultCalculateInterval;
		this.slowMotion = Physicsengine.Controllers.World.defaultSlowMotion;
		this.autoSlowMoFactor = Physicsengine.Controllers.World.defaultAutoSlowMoFactor;
		this.borderSpeedReduction = Physicsengine.Controllers.World.defaultBorderSpeedReduction;
	
		//set height and width in pixel in case it is set in percentage
		this.canvasHeight = $(this.element).height();
		this.canvasWidth = $(this.element).width();
		$(this.element).attr('height', this.canvasHeight);
		$(this.element).attr('width', this.canvasWidth);

		//get the canvas' 2d context
		this.canvas2dContext = this.element.get(0).getContext("2d");
		
		//start calculating
		this.startCalculating();
		//start rendering
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
			
			if(sphere.checkCollisionWith(object).collision || sphere.checkCollisionWith(this).collision) {
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
		
		if(!this.doPauseRender){
			//clear canvas
			this.canvas2dContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			
			//render all objects
			for(var i = 0; i < this.objects.length; i++) {
				var object = this.objects[i];			
				//render the sphere to the canvas
				object.renderObject(this.canvas2dContext);			
			}
		}
		
		if(this.doRender) {
			window.setTimeout($.proxy(this.render, this), this.renderInterval);
		}
		
	},
	
	
	/**
	 * Calculate
	 * 
	 * Infinite calculating loop
	 * 
	 * @return	void
	 */
	
	calculate: function() {
		
		if(!this.doPauseCalc) {
			
			var currentSlowMoDistance = 10000000000;
			var colProb = 0;
			for(var i = 0; i < this.objects.length; i++) {

				var object = this.objects[i];
			
				//check for collisions
				for(var j = 0; j < this.objects.length; j++) {

					var otherObject = this.objects[j];
					var collisionCheck = object.checkCollisionWith(otherObject);
					
					if(object != otherObject && this.autoSlowMoFactor > 0 && collisionCheck.distance != null && collisionCheck.distance < currentSlowMoDistance){
						currentSlowMoDistance = collisionCheck.distance;
					}
					//check for collision with another object
					if(object != otherObject && collisionCheck.collision) {

						//to properly collide the objects we have to move the spheres exactly near each other
						object.placeNextTo(otherObject);
												
						//collide the objects
						object.collideWith(otherObject);
						
						//stop dragging
						$(this.element).trigger('mouseup.dragging-' + i);

						break;
					}
					
					//check for collision with the world borders
					if(object.checkCollisionWith(this).collision) {

						//to properly collide the objects we have to place the sphere exactly near the border
						object.placeNextTo(this);
						
						//collide the object with the wall
						object.collideWith(this);
						
						//stop dragging
						$(this.element).trigger('mouseup.dragging-' + i);
					
						break;
					}
					
					
				}
				if(this.autoSlowMoFactor > 0) {
					if(currentSlowMoDistance <= this.autoSlowMoDistance){
						this.slowMotion = 1 + (this.autoSlowMoFactor / this.autoSlowMoDistance) * (this.autoSlowMoDistance-currentSlowMoDistance);
					}		
					else{
						this.slowMotion = 1;
					}					
				}
				
				if(!object.dragging) {
					object = this.calculateState(this.calculateInterval / 1000, object)
				}
				
			}
			
		}
		
		if(this.doCalculate) {
			window.setTimeout($.proxy(this.calculate, this), this.calculateInterval * this.slowMotion);
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
	 * Start calculating
	 * 
	 * @return	void
	 */
	
	startCalculating: function() {
		
		this.calculate();
		
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
		
		return this.useBetterNumerical ? 
			this.calculateStateAvg(t, object, 2) : this.calculateStateNormal(t, object);
			
	},
	
	
	/**
	 * Calculate State
	 * 
	 * @param	{Number} t	time delta
	 * @param	{Object} object
	 * 
	 * @return	{Object}
	 */
	
	calculateStateNormal: function(t, object) {

		object.positionX = object.positionX + t * object.speedX;
		object.positionY = object.positionY + t * object.speedY;
		object.speedX = object.speedX - object.speedX * this.friction * t;
		object.speedY = object.speedY - object.speedY * this.friction * t + this.gravity * t;

		return object;
		
	},
	
	
	/**
	 * Calculate State Average
	 * 
	 * Use Runge-Kutta to calculate the position 
	 * 
	 * @param	{Number} t	time delta
	 * @param	{Object} object
	 * @param	{Number} n
	 */
	
	calculateStateAvg: function(t, object, n) {
		
		var temp = jQuery.extend(true, {}, object);
		for(var k=1;k<=n;k++){
			temp = this.calculateStateNormal(t, temp);
		}
		
		object.positionX = object.positionX + (temp.positionX - object.positionX)/n;
		object.positionY = object.positionY + (temp.positionY - object.positionY)/n;
		object.speedX = object.speedX - (object.speedX - temp.speedX)/n;
		object.speedY = object.speedY - (object.speedY - temp.speedY)/n;
		
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
	 * Set Pause
	 * 
	 * Pause the whole rendering and calculation process
	 * 
	 * @param	{Boolean} pause
	 * 
	 * @return	void
	 */
	
	setPause: function(pause) {
		
		this.doPauseRender = pause;
		this.doPauseCalc = pause;
		
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
				object.speedX = speedX;
				object.speedY = speedY;
				
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
				($.proxy(function() {
					var tempI = i;
					var tempObject = object;
					
					$(this.element).bind('mouseup.dragging-' + tempI, $.proxy(function(ev) {

						$(this.element).unbind('mousemove.dragging-' + tempI + ' mouseup.dragging-' + tempI);
						
						//stop speed checking interval
						window.clearInterval(speedInterval);

						//set the new speed and direction for the object
						tempObject.speedX = speedX;
						tempObject.speedY = speedY;
						
						//dragging stopped
						tempObject.dragging = false;
											
					}, this));
					
				}, this))();
				
				
				break;
				
			}
			
		}
		
	}
	
});