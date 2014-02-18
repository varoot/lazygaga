var fs = require('fs');
var Bin = require('./housing.bin.js');

// BinCollection module
function BinCollection() {
	this.bins = [];
}

BinCollection.prototype.importData = function(filename) {
	this.binsData = JSON.parse(fs.readFileSync(filename));
	return this;
}

BinCollection.prototype.reset = function() {
	this.bins = [];
	for (var i = 0; i < bins.length; i++) {
		this.bins.push(new Bin(bins[i].capacity, bins[i]));
	}

	return this;
}

BinCollection.prototype.placeItems = function(items) {
	// Items is an array of subgroups need to be placed

	// STEP 1: Find the first priority items
	// STEP 2: Filter the corner ones
	return this;
}

BinCollection.prototype.print = function() {
	console.log(this.bins);
	return this;
}

module.exports = BinCollection;

var binCol = new BinCollection();
binCol.importData('housing.bins.json');
binCol.reset();
binCol.print();