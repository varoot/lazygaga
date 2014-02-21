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
	return b.data.count - a.data.count;
}

//generate subgroup
ItemCollection.prototype.generateItems = function () {
	// step 1. sortGender
	var sortedByGender = sortGender(this.peopleData);
	this.femaleGroup = sortedByGender[0];
	this.maleGroup = sortedByGender[1];
	// step 2. generate subgroup (new item)
	// step 2.1 female 
	// for (i=0;i<femaleGroup.length;i++){
	// 	var groupSiz = femaleGroup[i].count;
	// 	if (groupsSiz < 2*minPeople){
	// 		this.groups.push()
	// 	}  
	// }
	// step 3. create  


}

ItemCollection.prototype.findFirstMovingGroup = function() {
	return this.items.splice(0,1);
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

var  itemCol = new ItemCollection();
itemCol.importData('housing.items.json');
itemCol.reset();
console.log(itemCol.items);