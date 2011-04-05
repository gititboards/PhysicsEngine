/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.Main',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{

	/**
	 * Initializes the PhysicsEngine
	 */
	
	init: function() {
	
		//render user interface
		this.loadUI();
	},
	
	/**
	 * Loads the user interface
	 */
	
	loadUI: function() {

		//load the template
		$(document.body).append(this.view('interface'));
		
	}
	
});