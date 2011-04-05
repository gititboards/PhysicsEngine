module("physicsengine test", { 
	setup: function(){
		S.open("//physicsengine/physicsengine.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});