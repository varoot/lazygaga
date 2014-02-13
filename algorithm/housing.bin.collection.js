var fs = require('fs');
var Bin = require('./housing.bin.js');

// BinCollection module
function BinCollection() {
	this.bins = [];
}

BinCollection.prototype.importData = function(filename) {
	// TODO
	// Split map into "bins"
}

BinCollection.prototype.placeItems = function(items) {

}

module.exports = BinCollection;