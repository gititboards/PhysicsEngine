/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.World',
/* @Static */
{

},
/* @Prototype */
{

	gravity: 0,
	objects: [],
	canvasHeight: 0,
	canvasWidth: 0,
	canvas2dContext: null,
	doRender: true, //stop rendering by setting this to false
	renderInterval: 10, //interval in ms 
	
	
	/**
	 * Constructor
	 * 
	 * @return	void
	 */
	
	init: function() {

		//set height and width in pixel in case it is set in percentage
		this.canvasHeight = $(this.element).height();
		this.canvasWidth = $(this.element).width();
		$(this.element).attr('height', this.canvasHeight);
		$(this.element).attr('width', this.canvasWidth);

		//get the canvas' 2d context
		this.canvas2dContext = this.element.get(0).getContext("2d");
		
		//start renderin
		this.render();

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
		sphere.color = 'rgb(' + randomNumber(0, 255) + ', ' + randomNumber(0, 255) + ', ' + + randomNumber(0, 255) + ')';
		
		//check if the sphere collides with any other sphere
		for(var i = 0; i < this.objects.length; i++) {
			var object = this.objects[i];
			
			if(sphere.checkCollisionWithSphere(object)) {

				//display error dialog
				$('<div title="Error occured">Could not place the sphere as it collides with another one. Please choose a different location.</div>').dialog({
					buttons: {
						'Ok': function() { 
							$(this).dialog('destroy'); 
						}
					}
				});
				
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

		var speedFactor = 1000 / this.renderInterval;
		
		var ref = this;
		var loop = function() {

			//clear canvas
			ref.canvas2dContext.clearRect(0, 0, ref.canvasWidth, ref.canvasHeight);
			
			//render all objects
			for(var i = 0; i < ref.objects.length; i++) {

				var object = ref.objects[i];
				
				//check for collisions
				for(var j = 0; j < ref.objects.length; j++) {
					var otherObject = ref.objects[j];
					if(object != otherObject && object.checkCollisionWithSphere(otherObject)) {
						
						//COLLISION !!!
						
						//stop dragging
						$(ref.element).trigger('mouseup.dragging');
						
						
						
					}
				}
				
				//set new position for object according to speed and direction
				var length = object.speed / speedFactor;
				var x = length * Math.cos(object.direction);
				var y = length * Math.sin(object.direction);
				object.positionX = object.positionX + x;
				object.positionY = object.positionY - y;

				//render the sphere to the canvas
				object.renderObject(ref.canvas2dContext);
				
				
			}
			
			if(ref.doRender) {
				window.setTimeout(loop, ref.renderInterval);
			}
			
		};

		//start loop
		loop();

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
				var dragPosX = posX;
				var dragPosY = posY;
				var dragLength = 0;
				var speed = 0;
				var direction = 0;
				
				//set speed of the object to 0 as we are now dragging it
				object.speed = 0;
				
				//get dragging speed and direction
				var speedInterval = window.setInterval(function() {
					
					var posDiffX = dragPosX - posX;
					var posDiffY = posY - dragPosY;
					
					//calc speed
					dragLength = Math.sqrt(Math.pow(Math.abs(posDiffX), 2) + Math.pow(Math.abs(posDiffY), 2));
					speed = dragLength * 10;
					
					//calc direction
					direction = Math.atan2(posDiffY, posDiffX);

					posX = dragPosX;
					posY = dragPosY;
					
				}, 100);
				
				//track mouse movements
				$(this.element).bind('mousemove.dragging', $.proxy(function(ev) {

					//set new position
					object.positionX = ev.clientX;
					object.positionY = ev.clientY;

					//store mouse position so the speed interval can calculate the pixel diff
					dragPosX = ev.clientX;
					dragPosY = ev.clientY;

				}, this));
				
				//unbind all events on mouse up
				$(this.element).bind('mouseup.dragging', $.proxy(function(ev) {

					$(this.element).unbind('mousemove.dragging mouseup.dragging');
					
					//stop speed checking interval
					window.clearInterval(speedInterval);
					
					//set the new speed and direction for the object
					object.direction = direction;
					object.speed = speed;
										
				}, this));				
				
				break;
				
			}
			
		}
		
	}
	
});