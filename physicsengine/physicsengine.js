steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/controller/view',		// lookup views with the controller's name
	'jquery/model',					// Ajax wrappers
	'jquery/dom/fixture',			// simulated Ajax requests
	'jquery/dom/form_params')		// form data helper
	
	.css('resources/css/reset-min', 'resources/css/main', 'resources/css/flick/jquery-ui-1.8.11.custom')	// loads styles

	.resources('js/jquery-ui-1.8.11.custom.min', 'js/helper.js')					// 3rd party script's (like jQueryUI), in resources folder

	.models()						// loads files in models folder 

	.controllers('world', 'sphere', 'main')					// loads files in controllers folder

	.views('main/interface', 'world/world');						// adds views to be added to build