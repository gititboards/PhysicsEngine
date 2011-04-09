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
	 * Set Gravity
	 * 
	 * @param	{Number} gravity
	 * @return	void
	 */
	
	setGravity: function(gravity) {
		this.gravity = gravity;
	},
	
	
	/**
	 * Get Gravity
	 * 
	 * @return	{Number} gravity
	 */
	
	getGravity: function() {
		return this.gravity;
	},
	
	
	/**
	 * Set sphere count
	 * 
	 * @param	{Number} count 
	 * @return	void
	 */
	
	setSpheresCount: function(count) {
		
		
	},
	
	
	/**
	 * Add sphere
	 * 
	 * Adds a sphere to the world canvas
	 * 
	 * @param	{Number} radius
	 * @return	void
	 */
	
	addSphere: function(radius) {

		//instantiate a sphere controller
		var sphere = $('<div />').physicsengine_sphere(radius);
		
		//add the sphere to the list with all objects
		this.objects.push(sphere);
		
	},
	
	
	/**
	 * Render
	 * 
	 * Infinite drawing loop
	 * 
	 * @return	void
	 */
	
	render: function() {

		var loop = $.proxy(function() {

			//clear canvas
			this.canvas2dContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			
			//render all objects
			for(var i = 0; i < this.objects.length; i++) {

				var object = this.objects[i].controller();

				//render the sphere to the canvas
				object.renderObject(this.canvas2dContext);
				
			}
			
			if(this.doRender) {
				window.setTimeout(loop, this.renderInterval);
			}
			
		}, this);

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
	 * Mousedown event for object acceleration
	 * 
	 * @param	{Object} el		element that triggered the event
	 * @param	{Object} ev		event object
	 */
	
	'mousedown': function(el, ev) {
		
		//check if the user tries to drag an object
		for(var i = 0; i < this.objects.length; i++) {
			var object = this.objects[i].controller();
			
			//is the mouse position inside the object?
			if(object.isCoordinateInObject(ev.clientX, ev.clientY)) {

				//track mouse movements
				$(this.element).bind('mousemove.dragging', $.proxy(function(ev) {
					
					//set new position
					object.setPosition(ev.clientX, ev.clientY);
					
					//TODO - add acceleration

				}, this));
				
				//unbind all events on mouse up
				$(this.element).bind('mouseup.dragging', $.proxy(function(ev) {

					$(this.element).unbind('mousemove.dragging mouseup.dragging');
					
				}, this));				
				
				
			}
			
		}
		
	}
	
});