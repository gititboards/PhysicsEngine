//steal/js physicsengine/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('physicsengine/scripts/build.html',{to: 'physicsengine'});
});
