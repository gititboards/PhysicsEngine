/**
 * @tag controllers, home
 */
Physicsengine.Controllers.Object.extend('Physicsengine.Controllers.Sphere',
/* @Static */
{

},
/* @Prototype */
{

	radius: 20,
	color: '#0073EA',
	
	
	/**
	 * Constructor
	 * 
	 * @return	void
	 */
	
	init: function() {

	
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
		
	},
	
	
	/**
	 * Is Coordinate In Object
	 * 
	 * Checks whether a coordinate is inside the sphere or not
	 * 
	 * @param	{Number} x
	 * @param	{Number} y
	 * @return	{Boolean}
	 */
	
	isCoordinateInObject: function(x, y) {
		
		var diffX = Math.abs(this.positionX - x);
		var diffY = Math.abs(this.positionY - y);

		return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) <= this.radius;
		
	},
	
	
	/**
	 * Check Collision With Sphere
	 * 
	 * Checks if a sphere collides with this one
	 * 
	 * @param	{Object} sphere
	 * @return	{Boolean}
	 */
	
	checkCollisionWithSphere: function(sphere) {
		
		var diffX = Math.abs(this.positionX - sphere.positionX);
		var diffY = Math.abs(this.positionY - sphere.positionY);

		return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) <= (this.radius + sphere.radius);
		
	}
	
});