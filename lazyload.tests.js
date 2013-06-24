function equals(a, b) {
	return !!(JSON.stringify(a) == JSON.stringify(b));
}


// Rig tests
Tinytest.add('LazyLoad test addFile', function(test) {

	// Test if resourcefiles are empty
	test.equal(LazyLoad._dependencyTree, {});

	// Add ressource file
	LazyLoad.addFile('/cordova-2.6.0/android.js', 'android-2.6.0');
	test.equal(LazyLoad._dependencyTree, {
		"android-2.6.0":[
			"/cordova-2.6.0/android.js"
		]}
	);

	// And one more...
	LazyLoad.addFile('/cordova-2.6.0/android-plugin.js', 'android-2.6.0');
	test.equal(LazyLoad._dependencyTree, {
		"android-2.6.0":[
			"/cordova-2.6.0/android.js",
			"/cordova-2.6.0/android-plugin.js"
		]}
	);


	// And one more...
	LazyLoad.addFile([
		'/cordova-2.6.0/android-pluginA.js',
		'/cordova-2.6.0/android-pluginB.js'
	], 'android-2.6.0');

	test.equal(LazyLoad._dependencyTree, {
		"android-2.6.0":[
			"/cordova-2.6.0/android.js",
			"/cordova-2.6.0/android-plugin.js",
			'/cordova-2.6.0/android-pluginA.js',
			'/cordova-2.6.0/android-pluginB.js'
		]}
	);



	// And one more...
	LazyLoad.addFile([
		'/cordova-2.6.0/android-pluginC.js',
		'/cordova-2.6.0/android-pluginD.js'
	], ['android-2.6.0', 'ios-2.6.0']);

	test.equal(LazyLoad._dependencyTree, {
		"android-2.6.0":[
			"/cordova-2.6.0/android.js",
			"/cordova-2.6.0/android-plugin.js",
			'/cordova-2.6.0/android-pluginA.js',
			'/cordova-2.6.0/android-pluginB.js',
			'/cordova-2.6.0/android-pluginC.js',
			'/cordova-2.6.0/android-pluginD.js'
		],
		"ios-2.6.0":[
			'/cordova-2.6.0/android-pluginC.js',
			'/cordova-2.6.0/android-pluginD.js'
		]}
	);

});

Tinytest.add('LazyLoad test require', function(test) {

	// Check that the dom is empty
	test.equal(document.elements, {});

	// Try to load a version not configured
	LazyLoad.require('version not found');

	// Still intact dom?
	test.equal(document.elements, {});

	// Ok, load the correct version
	LazyLoad.require('android-2.6.0');

	// Check if scripts are added to head tag
	test.isTrue(equals(document.elements, {
		"head":[
			[
				{"type":"text/javascript","src":"/cordova-2.6.0/android.js"},
				{"type":"text/javascript","src":"/cordova-2.6.0/android-plugin.js"},
				{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginA.js"},
				{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginB.js"},
				{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginC.js"},
				{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginD.js"}
			]
		]
	}));




	// We should expect the resourcefiles to be empty {} ?
	test.equal(LazyLoad._dependencyTree, {
		"android-2.6.0":[],
		"ios-2.6.0":[
			"/cordova-2.6.0/android-pluginC.js",
			"/cordova-2.6.0/android-pluginD.js"]
	});

	// So that if one tries to load the files multiple times it
	// would have no effect
	LazyLoad.require('android-2.6.0');

	// Still the same dom?
	test.isTrue(equals(document.elements, {"head":[
		[
			{"type":"text/javascript","src":"/cordova-2.6.0/android.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-plugin.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginA.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginB.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginC.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginD.js"}
		]
	]}));

	LazyLoad.require('ios-2.6.0');

	// Still the same dom?
	test.isTrue(equals(document.elements, {"head":[
		[
			{"type":"text/javascript","src":"/cordova-2.6.0/android.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-plugin.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginA.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginB.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginC.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginD.js"}
		]
	]}));

	// And one more...
	LazyLoad.addFile([
		'/cordova-2.6.0/android-pluginE.js',
		'/cordova-2.6.0/android-pluginF.js'
	], ['ios-2.6.0']);

	LazyLoad.require('ios-2.6.0');

	// Still the same dom?
	test.isTrue(equals(document.elements, {"head":[
		[
			{"type":"text/javascript","src":"/cordova-2.6.0/android.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-plugin.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginA.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginB.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginC.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginD.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginE.js"},
			{"type":"text/javascript","src":"/cordova-2.6.0/android-pluginF.js"}
		]
	]}));

});

Tinytest.add('LazyLoad test onload - onReady initial', function(test) {
	var ready = false;

	// Reset test data
	LazyLoad._dependencyTree = {};
	document.elements = [];


	// And one more...
	LazyLoad.addFile([
		'/cordova-2.6.0/android-pluginG.js',
		'/cordova-2.6.0/android-pluginH.js'
	], ['ios-2.6.0']);

	LazyLoad.require('ios-2.6.0', function() {
		ready = true;
	});

	var files = document.elements['head'][0];

	test.isFalse(ready, 'Should be false, files are not loaded yet');

	test.equal(files.length, 2);

	for (var i = 0; i < files.length; i++) {
		// Simulate loading by calling back
		if (typeof files[i].onload === 'function')
			files[i].onload();
		files[i].onload = undefined;
	}

	test.isTrue(ready, 'Should be true since files are loaded');

});

Tinytest.add('LazyLoad test onload - onReady allready loaded', function(test) {
	// Make ready for new require test
	var ready = false;
	var files = document.elements['head'][0];

	test.isFalse(ready, 'Should be false, since require not called yet');

	LazyLoad.require('ios-2.6.0', function() {
		ready = true;
	});

	test.isTrue(ready, 'Should be true since files are allready loaded');


});

Tinytest.add('LazyLoad test onload - onReady one more load', function(test) {
	// Make ready for new require test
	var ready = false;
	var files = document.elements['head'][0];

	test.isFalse(ready, 'Should be false, since this file is not yet loaded..');


	// And one more...
	LazyLoad.addFile([
		'/cordova-2.6.0/android-pluginI.js'
	], ['ios-2.6.0']);

	LazyLoad.require('ios-2.6.0', function() {
		ready = true;
	});

	test.equal(files.length, 3);

	for (var i = 0; i < files.length; i++) {
		// Simulate loading by calling back
		if (typeof files[i].onload === 'function')
			files[i].onload();
		files[i].onload = undefined;
	}

	test.isTrue(ready, 'Should be true since files are loaded');

});


Tinytest.add('LazyLoad test queryString', function(test) {
	test.equal(LazyLoad.queryString, {
				'cordova-version': 'android-2.6.0', 
				'test': '3'}
	); 
});


//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equalactual, expected, message, not
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)