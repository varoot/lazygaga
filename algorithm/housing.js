// Write OOP modules according to http://book.mixu.net/node/ch6.html

/*
 *  1. Load data (groups) into ItemCollection and create items
 *  2. Load the map into BinCollection and create bins
 *
 */
var BinCollection = require('./housing.bin.collection.js');
var ItemCollection = require('./housing.item.collection.js');
var SolutionCollection = require('./housing.solution.collection.js');

var itemCol = new ItemCollection();
itemCol.importData('housing.items.json');

var binCol = new BinCollection();
binCol.importData('housing.bins.json');

var solCol = new SolutionCollection();

var maxSolutions = 10;

for (var i=0; i < maxSolutions; i++) {
	binCol.reset();
	itemCol.reset();

	try {
		var movingItems;
		while (movingItem = itemCol.findFirstMovingItem()) {
			binCol.placeItem(movingItem);
		}
		
		solCol.add(binCol);
	} catch (err) {
		console.log(err.name+': '+err.message);
	}
}

console.log(''+solCol);