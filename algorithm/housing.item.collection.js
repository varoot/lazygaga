var fs = require('fs');
var Item = require('./housing.item.js');

// ItemCollection module
function ItemCollection() {
	this.groups = [];
}

ItemCollection.prototype.importData = function(filename) {
	// TODO
	// Split groups into "items" (put them into this.groups)
}

ItemCollection.prototype.findFirstMovingItems = function(filename) {
	// TODO
	// Return multiple items of the same group
}

module.exports = ItemCollection;