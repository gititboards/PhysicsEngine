/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.Main',
/* @Static */
{
	onDocument: true,
	defaultGravity: 10,
	defaultSpheresCount: 5
	
},
/* @Prototype */
{
	
	world: null, // reference to the world canvas
	

	/**
	 * Initializes the PhysicsEngine
	 * 
	 * @return	void
	 */
	
	init: function() {
	
		//render user interface
		this.loadUI();
		
		//init world canvas
		this.initWorld();
		
	},
	
	
	/**
	 * Loads the user interface
	 * 
	 * @return	void
	 */
	
	loadUI: function() {

		//load the template
		$(document.body).append(this.view('interface', {
			gravity: Physicsengine.Controllers.Main.defaultGravity,
			spheres: Physicsengine.Controllers.Main.defaultSpheresCount
		}));
		
		//init settings dialog button
		$('#physicsengine-settings-button').button().click(function() {
			
			//open the settings dialog
			$('#physicsengine-settings-dialog').dialog('open');
			
		});
		
		//init settings dialog
		$('#physicsengine-settings-dialog').dialog({
			buttons: {
				'Close': function() {
					$(this).dialog('close');
				}
			},
			minWidth: 400,
			minHeight: 250,
			resizable: false,
			autoOpen: false,
			modal: true
		});
		
		//init gravity slider
		var ref = this;
		$('#physicsengine-settings-gravity-slider').slider({
			min: 0,
			max: 100,
			step: 1,
			value: Physicsengine.Controllers.Main.defaultGravity,
			slide: function(ev, ui) {
				$(this).prev().find('span').html(ui.value);
				ref.world.controller().setGravity(ui.value);
			}
		});
		
		//init number of spheres slider
		$('#physicsengine-settings-spheres-slider').slider({
			min: 1,
			max: 30,
			step: 1,
			value: Physicsengine.Controllers.Main.defaultSpheresCount,
			slide: function(ev, ui) {
				$(this).prev().find('span').html(ui.value);
				ref.world.controller().reset();
			}
		});
		
	},
	
	
	/**
	 * Init World Canvas
	 * 
	 * @return	void
	 */
	
	initWorld: function() {
		
		//attach world controller to the drawing surface
		this.world = $('#physicsengine-world').physicsengine_world();
		
		//add a sphere
		this.world.controller().addSphere(40, 100, 100);
		this.world.controller().addSphere(40, 200, 200);

		
	}
});