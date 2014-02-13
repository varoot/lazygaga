// Write OOP modules according to http://book.mixu.net/node/ch6.html

/*
 *  1. Load data (groups) into ItemCollection and create items
 *  2. Load the map into BinCollection and create bins
 *
 */
var BinCollection = require('./housing.bin.collection.js');
var ItemCollection = require('./housing.item.collection.js');

var itemCol = new ItemCollection();
itemCol.importData('items.json');

var binCol = new BinCollection();
binCol.importData('bins.json');

var movingItems;
while (movingItems = itemCol.findFirstMovingItems()) {
	binCol.placeItems(movingItems);
}