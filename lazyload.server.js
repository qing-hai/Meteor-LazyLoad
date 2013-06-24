/*

Meteor-LazyLoad, by RaiX

Credit goes to @awatson1978 and @zeroasterisk

MIT License

 */

Lazyload = function() {
	var self = this;

	// Allow code use in common code
	self.addFile = function(filePath, dependencies) {};
	self.loadFiles = function(version) {};
};