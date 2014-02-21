var fs = require('fs');
var Item = require('./housing.item.js');


// ItemCollection module
function ItemCollection() {
}

ItemCollection.prototype.importData = function(filename) {
	// TODO
	// Split groups into "items" (put them into this.groups)
	var peopleData = fs.readFileSync(filename);
	this.peopleData = JSON.parse(peopleData);
	return this;
}

//sort group
ItemCollection.prototype.sortGroup = function () {

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

ItemCollection.prototype.findFirstMovingGroup = function(filename) {
	// TODO
	// Return first group to move
}

//sort by gender
function sortGender(peopleData){
	var femaleGroup = [];
	var maleGroup = [];
	for (var i=0;i<peopleData.length;i++){
		if (peopleData[i].gender == 'female') {
			femaleGroup.push(peopleData[i]);
		}

		else {
			maleGroup.push(peopleData[i]);
		}
	}
	return [femaleGroup, maleGroup];
}

module.exports = ItemCollection;

var  itemCol = new ItemCollection();
itemCol.importData('housing.items.json');
itemCol.generateItems();