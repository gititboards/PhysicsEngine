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
	
	
	/**
	 * Set Gravity
	 * 
	 * @param	gravity {Number}
	 */
	
	setGravity: function(gravity) {
		this.gravity = gravity;
	},
	
	
	/**
	 * Get Gravity
	 */
	
	getGravity: function() {
		return this.gravity;
	},
	
	
	/**
	 * Set sphere count
	 * 
	 * @param	spheres {Number}
	 */
	
	setSpheresCount: function(spheres) {
		
		
	}
	
});