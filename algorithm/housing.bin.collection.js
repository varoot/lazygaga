var fs = require('fs');
var Bin = require('./housing.bin.js');
var Config = require('./housing.config.js');

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

function repeat(value, times) {
	return times ? repeat(value, times - 1).concat(value) : [];
}

BinCollection.prototype.placeItem = function(item) {
	// Take an item (group) and split into smaller items
	// and place them into bins

	// STEP 1: Filter the bins by gender
	var gender = item.data.gender;
	var minSpace = item.demand;

	if (minSpace >= Config.minItemSize * 2) {
		minSpace = Math.min(item.demand, Config.minItemSize);
	}

	var genderBins = this.bins.filter(function(bin) {
		return ( bin.supply >= minSpace && (! bin.data.gender || bin.data.gender == item.data.gender));
	});

	// STEP 2: Find how many bins we need to fit the items
	var supply = 0;
	var binsNeeded = 0;
	while (supply < item.demand && binsNeeded < genderBins.length) {
		supply += genderBins[binsNeeded].supply;
		binsNeeded++;
	}

	if (supply < item.demand) {
		throw new Error('Cannot fit item (Supply '+supply+' < Demand '+item.demand+')');
	}

	// STEP 3: Find break points and break down items

	// These are the bins we need to fit
	var fittingBins = genderBins.splice(0, binsNeeded);

	// Sort them by size (largest first)
	fittingBins.sort(function(a, b) {
		return b.supply - a.supply;
	});

	var items;

	if (binsNeeded > 1)
	{
		var breakPoints = repeat(minSpace, binsNeeded);
		var demandLeft = item.demand - (minSpace * binsNeeded);
		var i = 0;
		while (demandLeft > 0) {
			while (i < binsNeeded && fittingBins[i].supply <= breakPoints[i]) {
				i++;
			}

			breakPoints[i]++;
			demandLeft--;
		}

		items = item.breakdown(breakPoints);
	} else {
		items = [item];
	}

	// STEP 4: Put items into bins
	for (var i=0; i < items.length; i++) {
		fittingBins[i].addItem(items[i]);
		fittingBins[i].data.gender = items[i].data.gender;
	}
	
	return this;
}

BinCollection.prototype.print = function() {
	console.log(this.bins);
	return this;
}

module.exports = BinCollection;