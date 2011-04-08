/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.Sphere',
/* @Static */
{

},
/* @Prototype */
{

	positionX: 100,
	positionY: 100,
	directionX: 0,
	directionY: 0,
	speed: 0,
	radius: 20,
	color: '#0073EA',
	
	
	/**
	 * Constructor
	 * 
	 * @param	{Number} radius		radius in pixel
	 * @return	void
	 */
	
	init: function(el, radius) {
	
		this.radius = radius;
	
	},
	
	
	/**
	 * Set direction
	 * 
	 * @param	{Number} x
	 * @param	{Number} y
	 * @return	void
	 */
	
	setDirection: function(x, y) {
		
		this.directionX = x;
		this.directionY = y;
		
	},
	
	
	/**
	 * Set speed
	 * 
	 * @param	{Number} speed 		speed in pixels per second
	 * @return	void
	 */
	
	setSpeed: function(speed) {
	
		this.speed = speed;
		
	},
	
	
	/**
	 * Set position
	 * 
	 * @param	{Number} x
	 * @param	{Number} y
	 * @return	void
	 */
	
	setPosition: function(x, y) {
	
		this.positionX = x;
		this.positionY = y;
		
	},
	
	
	/**
	 * Render object
	 * 
	 * Creates the object to place in the world canvas
	 * 
	 * @param	{Object} context	canvas 2d context object
	 * @return	void
	 */
	
	renderObject: function(context) {

		context.beginPath();
		context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI*2, true);
		context.fillStyle = this.color;
		context.closePath();
		context.fill();
		
	}
	
});