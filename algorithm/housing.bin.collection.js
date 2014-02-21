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
	for (var i = 0; i < this.binsData.length; i++) {
		this.bins.push(new Bin(this.binsData[i].capacity, this.binsData[i]));
	}

	this.sortBins();
	return this;
}

// Sort bins by priority
BinCollection.prototype.sortBins = function() {
	this.bins.sort(function(a,b) {
		if (a.data.priority == b.data.priority) {
			// Add randomness to the order
			return 0.5 - Math.random();
		}
		return a.data.priority - b.data.priority;
	});
	return this;
}

BinCollection.prototype.placeGroup = function(group) {
	// Take a group and split into items
	// and place them into bins

	// STEP 1: Find the first priority bins
	
	return this;
}

BinCollection.prototype.print = function() {
	console.log(this.bins);
	return this;
}

module.exports = BinCollection;