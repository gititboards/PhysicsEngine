/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.Object',
/* @Static */
{

},
/* @Prototype */
{
	
	positionX: 100,
	positionY: 100,
	direction: 0,
	speed: 0,
	friction: 0,
	weight: 0,
	
	
	/**
	 * Render object
	 * 
	 * Creates the object to place in the world canvas
	 * 
	 * @param	{Object} context	canvas 2d context object
	 * @return	void
	 */
	
	renderObject: function(context) {

		
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
		
		
	}
	
});