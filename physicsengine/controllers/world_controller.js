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
	spheres: [],
	canvas2dContext: null,
	
	
	/**
	 * Constructor
	 * 
	 * @return	void
	 */
	
	init: function() {

		//set height and width in pixel in case it is set in percentage
		$(this.element).attr('height', $(this.element).height());
		$(this.element).attr('width', $(this.element).width());
	
		//get the canvas' 2d context
		this.canvas2dContext = this.element.get(0).getContext("2d");

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
	 * @return	void
	 */
	
	addSphere: function() {

		//instantiate a sphere controller
		var sphere = $('<div />').physicsengine_sphere(20);
		
		//add the sphere to the list with all spheres
		this.spheres.push(sphere);
		
		//render the sphere to the canvas
		sphere.controller().renderObject(this.canvas2dContext);
		
	}
	
	
});