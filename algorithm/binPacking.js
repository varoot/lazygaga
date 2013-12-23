var fs = require('fs');

// Hong Yoon
function Location() {
	this.supply = 0;
	this.demand = 0;
	this.bins = [];
	this.potentialBins = [];
	this.items = {};
}

// Hong Yoon
Location.prototype.addBin = function(bin) {
	this.bins.push(bin);
	this.supply += bin.supply;
	this.demand += bin.demand;
}

// Hong Yoon
Location.prototype.addItem = function(item) {
	this.demand += item.demand;
	this.supply += item.supply;
}

// Hong Yoon
Location.prototype.addPotentialBin = function(item) {

}

// Hong Yoon
Location.prototype.removePotentialBin = function(item) {

}

// Hong Yoon
Location.prototype.potentialBinToItem = function(item) {
	return this.addItem(this.removePotentialBin(item));
}

// Hong Yoon
Location.prototype.pullPotentialBin = function(source, demand) {
	if (var bins = source.pushPotentialBin(demand)) {

	} else {
		return false;
	}
}

// Hong Yoon
Location.prototype.pushPotentialBin = function(demand) {
	var bins;
	return bins;
}

// Varoot
Location.prototype.packBins = function() {
	return ;
}

function Item(entry) {
	this.data = {};
	this.demand = 1;
	this.supply = this.capacity();
}

Item.prototype.print = function() {
	console.log('(' + this.data.lifegroup + ') ' + this.data.name);
}

Item.prototype.capacity = function() {
	if (this.data.role == 'D') {
		return (this.data.capacity ? +this.data.capacity : 5);
	}
	return 0;
}

locations = {};
volunteers = new Location();
noItems = [];

function getLocation(entry) {
	var loc = entry.transportation;
	
	if (locations[loc] == undefined) {
		locations[loc] = new Location();
	}

	return locations[loc]
}

function partitionData(data) {
	var length = data.length;

	for (var i=1; i<length; i++) {
		var location = getLocation(data[i]);
		var item = new Item(data[i]);

		if (data[i].role == '') {
			location.addItem(item);
		} else if (data[i].role == 'D') {
			location.addPotentialBin(item);
		} else if (data[i].role == 'V') {
			volunteers.addPotentialBin(item);
		} else {
			noItems.push(item);
		}
	}

	return true;
}

fs.readFile('undergrad-retreat.json', function (err, peopleData) {
	if (err) { throw err; }
	var peopleData = JSON.parse(peopleData);

	// STEP 1: Separate all participants (including drivers) by location and LIFE group
	if ( ! partitionData(peopleData)) {
		console.log('No possible solution: Not enough supply.')
		return;
	}

	// STEP 2: Determine how many cars we need, make bins for each cars
	prepareBins();

	// STEP 3: Put people into cars (bins)
	distributeAllLocations();

	// STEP 4: Print out result
	for (location in bins) {
		console.log('\n\n'+location+'\n');
		for (bin in bins[location]) {
			printBin(bins[location][bin]);
		}

		printLefoverItems(items[location]);
	}
});

/*
items = {};
bins = {
	'Bursley': [
		{
			driver: { name: 'Bus #1' },
			capacity: 45,
			passengers: []
		}
	],
	'Cube': [
		{
			driver: { name: 'Bus #2' },
			capacity: 45,
			passengers: []
		}
	],
	'Stockwell': [
		{
			driver: { name: 'Bus #3' },
			capacity: 45,
			passengers: []
		}
	]
};
potentialBins = [];
noItems = [];

function sortBy(attr) {
	return function(x, y) {
		return ((x[attr] == y[attr]) ? 0 : ((x[attr] > y[attr]) ? 1 : -1));
	}
}

function createItemLocation(location) {
	items[location] = {
		demand: 0,
		supply: 0,
		items: [],
		potentialBins: []
	};
}

function allocateItem(entry){
	var location = entry.transportation;
	var group = entry.lifegroup;
	if (items[location] == undefined){
		createItemLocation(location);
	}

	if (items[location]['items'][group] == undefined) {
		items[location]['items'][group] = [];
	}
	items[location]['items'][group].push(entry);
}

function allocatePotentialBinItem(entry){
	var location = entry.transportation;

	if (location == '') {
		potentialBins.push(entry);
		return;
	}

	if (items[location] == undefined){
		createItemLocation(location);
	}

	if (items[location].potentialBins == undefined) {
		items[location].potentialBins = [];
	}

	items[location].potentialBins.push(entry);
}

function addPotentialBin(entry) {
	potentialBins.push(entry);
}

function partitionData(data) {
	var length = data.length;
	var totalDemand = 0;
	var totalSupply = 0;

	for (var i=1; i<length; i++) {
		if (data[i].role == '') {
			allocateItem(data[i]);
		} else if (data[i].role == 'D') {
			allocatePotentialBinItem(data[i]);
		} else if (data[i].role == 'V') {
			addPotentialBin(data[i]);
		} else {
			noItems.push(data[i]);
		}
	}

	console.log('Demand: ', totalDemand);
	console.log('Supply: ', totalSupply);
	return (supply >= demand);
}

function createBin(entry, capacityValue){
	var name = entry.name;
	if (capacityValue == undefined){
		capacityValue = 4;
	}
	var capacity = 4;
	return {
		driver: entry,
		capacity: capacityValue,
		passengers:[]
	};
}

function allocateBin(entry){
	var location = entry.transportation;
	if (bins[location] == undefined){
		bins[location] = [];
	}

	var bin = createBin(entry);
	bins[location].push(bin);
}

function prepareBins() {
		
}

function findLargestItem(location) {
	var max = 0;
	var maxGroup;
	for (group in items[location]) {
		if (items[location][group].length > max) {
			max = items[location][group].length;
			maxGroup = group;
		}
	}

	return maxGroup;
}

function findLargestBin(location) {
	var max = 0;
	var maxBin;
	for (bin in bins[location]) {
		var available = bins[location][bin].capacity - bins[location][bin].passengers.length;
		if (available > max) {
			max = available;
			maxBin = bin;
		}
	}

	return maxBin;
}

function moveItemsToBin(location, item, bin) {
	var theItem = items[location][item];
	var theBin = bins[location][bin];
	var count = Math.min(theItem.length, theBin.capacity - theBin.passengers.length);

	theBin.passengers = theBin.passengers.concat(theItem.splice(0,count));
}

function distributeItems(location) {
	while (true) {
		var item = findLargestItem(location);
		var bin = findLargestBin(location);

		if (item == undefined || bin == undefined)
			break;

		if (items[location][item].length == 0 || bins[location][bin].passengers.length >= bins[location][bin].capacity)
			break;

		moveItemsToBin(location, item, bin);
	}
}

function distributeAllLocations() {
	for (location in bins) {
		distributeItems(location);
	}
}

function printBin(bin) {
	console.log('('+bin.driver.lifegroup + ') ' + bin.driver.name);
	for (var i=0; i < bin.passengers.length; i++) {
		console.log(' - ('+bin.passengers[i].lifegroup + ') ' + bin.passengers[i].name);
	}
	console.log();
}

function printLefoverItems(items) {
	leftovers = [];
	for (group in items) {
		leftovers = leftovers.concat(items[group]);
	}

	if (leftovers.length > 0) {
		console.log(leftovers.length + ' people didn\'t make it to the retreat');
		for (var i=0; i < leftovers.length; i++) {
			console.log(' - ('+leftovers[i].lifegroup + ') ' + leftovers[i].name);
		}
		console.log();
	}
}

fs.readFile('undergrad-retreat.json', function (err, peopleData) {
	if (err) { throw err; }
	var peopleData = JSON.parse(peopleData);

	// STEP 1: Separate all participants (including drivers) by location and LIFE group
	if ( ! partitionData(peopleData)) {
		console.log('No possible solution: Not enough supply.')
		return;
	}

	// STEP 2: Determine how many cars we need, make bins for each cars
	prepareBins();

	// STEP 3: Put people into cars (bins)
	distributeAllLocations();

	// STEP 4: Print out result
	for (location in bins) {
		console.log('\n\n'+location+'\n');
		for (bin in bins[location]) {
			printBin(bins[location][bin]);
		}

		printLefoverItems(items[location]);
	}
});

// var variableDynamic = 'Test';
// window['variableName' + variableDynamic] = 'your value';

// function sliceByRole(data) {
// 	var output = new Array();
// 	var sortDataByRole = data.sort(sortBy('role'));
// 	var sliceIndexStart = 0;
// 	var sliceIndexEnd = 0;
// 	var length = data.length;
// 	for (var i=1; i<length; i++) {
// 		if ((sortDataByRole[i-1].role != sortDataByRole[i].role) || (i==(length-1))) {
// 			sliceIndexEnd = i-1;
// 			output.push(sortDataByRole.slice(sliceIndexStart,sliceIndexEnd));
// 			sliceIndexStart = i;
// 		}
// 		else{}
// 	}
// 	return output;
// }

// function sliceByLocation(data) {
// 	var output = new Array();
// 	var sortDataByLocation = data.sort(sortByLocation);
// 	var sliceIndexStart = 0;
// 	var length = data.length;
// 	for (var i=1; i<length; i++) {
// 		if ((sortDataByLocation[i-1].transportation != sortDataByLocation[i].transportation) || (i==(length-1))) {
// 			var sliceIndexEnd = i-1;
// 			output.push(data.slice(sliceIndexStart,sliceIndexEnd));
// 			sliceIndexStart = i;
// 		}
// 		else{}
// 	}
// 	return output;
// }

// function sliceByLifegroup(data) {
// 	var output = new Array();
// 	var sortDataByLifegroup = data.sort(sortByLifegroup);
// 	var sliceIndexStart = 0;
// 	var length = data.length;
// 	for (var i=1; i<length; i++) {
// 		if ((sortDataByLifegroup[i-1].lifegroup != sortDataByLifegroup[i].lifegroup) || (i==(length-1))) {
// 			var sliceIndexEnd = i-1;
// 			output.push(data.slice(sliceIndexStart,sliceIndexEnd));
// 			sliceIndexStart = i;
// 		}

// 		else{
// 		}
// 	}
// 	return output;
// }
*/