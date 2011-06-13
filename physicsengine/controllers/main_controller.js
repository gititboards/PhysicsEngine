/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.Main',
/* @Static */
{
	onDocument: !(window.QUnit), //do not load the main controller automatically when loaded by QUnit
	
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
			gravity: Physicsengine.Controllers.World.defaultGravity,
			friction: Physicsengine.Controllers.World.defaultFriction,
			calculateInterval: Physicsengine.Controllers.World.defaultCalculateInterval,
			renderInterval: Physicsengine.Controllers.World.defaultRenderInterval,
			slowMotion: Physicsengine.Controllers.World.defaultSlowMotion
		}));
		
		//init settings dialog button
		var settingsButton = $('#physicsengine-settings-button').button().click($.proxy(function() {
			this.world.controller().setPause(true);
			//open the settings dialog
			$('#physicsengine-settings-dialog').dialog('open');
			
		}, this));
		
		//init add sphere button
		var addSphereButton = $('#physicsengine-addsphere-button').button().mouseup($.proxy(function(ev) {
			
			//update/disable button
			$(ev.currentTarget).button('option', 'label', 'Click on an empty space to place the sphere').button('disable');
			
			//listen for click event on world canvas to place the sphere
			$(this.world).bind('click.newsphere', $.proxy(function(ev2) {
				
				//add the sphere
				if(this.world.controller().addSphere(40, ev2.clientX, ev2.clientY)) {

					//added successfully -> enable button again
					$(this.world).unbind('click.newsphere');
					$(ev.currentTarget).button('option', 'label', 'Add sphere').button('enable');

				} else {
				
					//display error dialog
					$('<div title="Error occured">Could not place the sphere as it collides with another one. Please choose a different location.</div>').dialog({
						buttons: {
							'Ok': function() { 
								$(this).dialog('destroy'); 
							}
						}
					});
					
				}
				
			}, this));
			
		}, this));
		
		var ref = this;
		//init settings dialog
		$('#physicsengine-settings-dialog').dialog({
			buttons: {
				'Close': function() {
					ref.world.controller().setPause(false);
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
		
		$('#physicsengine-settings-gravity-slider').slider({
			min: 0,
			max: 10000,
			step: 1,
			value: Physicsengine.Controllers.World.defaultGravity,
			slide: function(ev, ui) {
				$(this).prev().find('span').html(ui.value);
				ref.world.controller().gravity = ui.value;
			}
		});
		
		//init friction slider
		$('#physicsengine-settings-friction-slider').slider({
			min: 0,
			max: 10,
			step: .1,
			value: Physicsengine.Controllers.World.defaultFriction,
			slide: function(ev, ui) {
				$(this).prev().find('span').html(ui.value);
				ref.world.controller().friction = ui.value;
			}
		});
		
		//init calc slider
		$('#physicsengine-settings-dcalc-slider').slider({
			min: 1,
			max: 1000,
			step: 1,
			value: Physicsengine.Controllers.World.calculateInterval,
			slide: function(ev, ui) {
				$(this).prev().find('span').html(ui.value);
				ref.world.controller().calculateInterval = ui.value;
			}
		});
		//init render slider
		$('#physicsengine-settings-drender-slider').slider({
			min: 1,
			max: 1000,
			step: 1,
			value: Physicsengine.Controllers.World.renderInterval,
			slide: function(ev, ui) {
				$(this).prev().find('span').html(ui.value);
				ref.world.controller().renderInterval = ui.value;
			}
		});
		//init slowmotion slider
		$('#physicsengine-settings-slowmotion-slider').slider({
			min: 1,
			max: 100,
			step: 1,
			value: Physicsengine.Controllers.World.slowMotion,
			slide: function(ev, ui) {
				$(this).prev().find('span').html(ui.value);
				ref.world.controller().slowMotion = ui.value;
			}
		});
		
		//reset world on resize
		$(window).bind('resize', $.proxy(function() {
			this.world.controller().reset();
			this.initWorld();
		}, this));
		
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
		
	}
});