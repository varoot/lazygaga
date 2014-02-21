var fs = require('fs');
var Item = require('./housing.item.js');


// ItemCollection module
function ItemCollection() {
	this.items = [];
}

ItemCollection.prototype.importData = function(filename) {
	this.itemsData = JSON.parse(fs.readFileSync(filename));
	return this;
}

ItemCollection.prototype.reset = function() {
	this.items = [];
	for (var i = 0; i < this.itemsData.length; i++) {
		this.items.push(new Item(this.itemsData[i].count, this.itemsData[i]));
	}
	this.sortItems();
	return this;
}

// Sort Items by gender & count
ItemCollection.prototype.sortItems = function() {
	this.items.sort(function(a,b) {
		if (a.data.gender < b.data.gender){
			return -1;
		}

		else if (a.data.gender == b.data.gender){
			return compareCount(a,b);
		}

		else {
			return 1;
		}
	});
}

//compare count
function compareCount(a,b) {
	if (a.data.count == b.data.count) {
		return 0.5 - Math.random();
	}
	return b.data.count - a.data.count;
}

ItemCollection.prototype.findFirstMovingItem = function() {
	return this.items.shift();
}

//sort by gender
// function sortGender(peopleData){
// 	var femaleGroup = [];
// 	var maleGroup = [];
// 	for (var i=0;i<peopleData.length;i++){
// 		if (peopleData[i].gender == 'female') {
// 			femaleGroup.push(peopleData[i]);
// 		}

// 		else {
// 			maleGroup.push(peopleData[i]);
// 		}
// 	}
// 	return [femaleGroup, maleGroup];
// }

module.exports = ItemCollection;