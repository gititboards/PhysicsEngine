module("physicsengine", {
	setup: function(){
	
		//create a world instance
		this.world = $('<canvas />').physicsengine_world().controller();
	
	} 
});

test("test colliding spheres", function() {
	
	//add a sphere
	this.world.addSphere(40, 100, 100);
	
	//the second one should not be added as it collides with the first one
	ok(!this.world.addSphere(40, 179, 100), 'collision detected');

});


test("test spheres next to each other", function() {
	
	//add a sphere
	this.world.addSphere(40, 100, 100);
	
	//the second one should be added without any problems
	ok(!this.world.addSphere(40, 180, 100), 'two spheres added');

});

