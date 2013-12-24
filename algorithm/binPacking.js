var fs = require('fs');

// Hong Yoon
function Location(name) {
	this.name = name;
	this.supply = 0;
	this.demand = 0;
	this.bins = [];
	this.potentialBins = new Group();
	this.groups = {};
}

Location.prototype.print = function() {
	console.log(Array(61).join("="));
	console.log(this.name, ' ('+this.demand+'/'+this.supply+')');
	console.log(Array(61).join("="));
	for (var i=0; i < this.bins.length; i++) {
		this.bins[i].print();
	}

	if (this.potentialBins.supply > 0) {
		console.log('Unused Bins');
		for (var i=0; i < this.potentialBins.items.length; i++) {
			console.log(' - '+this.potentialBins.items[i].print(true));
		}
	}
	console.log('\n');
}

// Hong Yoon - complete
Location.prototype.addBin = function(bin) {
	this.bins.push(bin);
	this.supply += bin.supply;

	return this;
}

// Hong Yoon - complete
Location.prototype.addItem = function(item) {
	var group = item.group();
	if (this.groups[group] == undefined) {
		this.groups[group] = new Group();
	}
	
	this.groups[group].addItem(item);
	this.demand += item.demand;

	return this;
}

// Hong Yoon - complete
Location.prototype.addPotentialBin = function(item) {
	this.potentialBins.addItem(item);
	this.demand += item.demand;
	this.supply += item.supply;

	return this;
}

// Hong Yoon - complete
Location.prototype.removePotentialBin = function(item) {
	if (this.potentialBins.removeItem(item)) {
		this.demand -= item.demand;
		this.supply -= item.supply;
		return item;
	} else {
		return false;
	}
}

// Hong Yoon - complete
Location.prototype.potentialBinToBin = function(item) {
	if (this.removePotentialBin(item)) {
		return this.addBin(item.makeBin());
	} else {
		return false;
	}
}

// Hong Yoon - complete
Location.prototype.potentialBinToItem = function(item) {
	if (this.removePotentialBin(item)) {
		return this.addItem(item);
	} else {
		return false;
	}
}

// Hong Yoon
Location.prototype.pullPotentialBins = function(source, requiredDemand) {
	var newBins;
	if ((newBins = source.pushPotentialBins(requiredDemand)) && newBins.length > 0) {
		for (var i=0; i < newBins.length; i++) {
			this.addPotentialBin(newBins[i]);
		}
	} else {
		return false;
	}
}

// Hong Yoon
Location.prototype.pushPotentialBins = function(requestedDemand) {
	if (this.supply <= this.demand)
		return false;

	var bins = [];
	while (requestedDemand > 0 && this.potentialBins.supply > 0) {
		var lastBin = this.potentialBins.lastItem();
		if (this.supply - lastBin.supply > this.demand - lastBin.demand) {
			bins.push(this.removePotentialBin(lastBin));
			requestedDemand -= lastBin.supply;
		} else {
			return bins;
		}
	}

	return bins;
}

// Varoot
Location.prototype.findLargestGroup = function() {
	var maxGroup;
	for (group in this.groups) {
		if (maxGroup == undefined || this.groups[group].demand > maxGroup.demand) {
			maxGroup = this.groups[group];
		}
	}

	return maxGroup;
}

// Varoot
Location.prototype.findLargestBin = function() {
	var maxBin;
	for (var i=0; i < this.bins.length; i++) {
		if (maxBin == undefined || this.bins[i].supply > maxBin.supply) {
			maxBin = this.bins[i];
		}
	}

	return maxBin;
}

Location.prototype.allocateItems = function(minBinSize) {
	if (minBinSize == undefined || minBinSize < 1) {
		minBinSize = 1;
	}

	while (true) {
		var group = this.findLargestGroup();
		var bin = this.findLargestBin();

		if (group == undefined || bin == undefined || group.demand == 0 || bin.supply < minBinSize)
			break;

		bin.addItemsFromGroup(group);
	}
}

Location.prototype.allocateItemsByGroup = function() {
	for (var i=0; i < this.bins.length; i++) {
		var bin = this.bins[i];
		if (bin.supply == 0 || !bin.owner || !bin.owner.group())
			continue;

		var group = bin.owner.group();

		if (this.groups[group]) {
			bin.addItemsFromGroup(this.groups[group]);
		}
	}
}

// Varoot
Location.prototype.packBins = function() {
	// STEP 1: Put largest group into largest bin until the largest bin is smaller than 5
	this.allocateItems(5);

	// STEP 2: Each driver pick their LG members
	this.allocateItemsByGroup();

	// STEP 3: Put largest group into largest bin until no one is left
	this.allocateItems();
}

// Varoot - complete
function Item(entry) {
	this.data = entry;
	this.demand = 1;
	this.supply = this.capacity();
	this.parent = null;
}

Item.prototype.group = function() {
	return this.data.lifegroup;
}

Item.prototype.print = function(quiet) {
	var printout = '(' + this.data.lifegroup + ') ' + this.data.name;
	
	if (quiet == undefined || ! quiet) {
		console.log(printout);
	}

	return printout;
}

Item.prototype.inspect = function() {
	return this.print(true);
}

Item.prototype.capacity = function() {
	if (this.data.role == 'D' || this.data.role == 'V') {
		return (this.data.capacity ? +this.data.capacity : 5);
	}
	return 0;
}

Item.prototype.remove = function() {
	if (this.parent) {
		this.parent.removeItem(this);
	}
	return this;
}

Item.prototype.makeBin = function() {
	this.remove();

	return new Bin({
		capacity: this.supply - 1,
		name: this.data.name,
		owner: this
	})
}

function Group() {
	this.supply = 0;
	this.demand = 0;
	this.items = [];
}

Group.prototype.addItem = function(item) {
	this.supply += item.supply;
	this.demand += item.demand;
	this.items.push(item);
	item.parent = this;

	return this;
}

Group.prototype.lastItem = function() {
	if (this.items.length == 0)
		return false;

	item = this.items[this.items.length - 1];
	return item;
}

Group.prototype.popItem = function() {
	if (this.items.length == 0)
		return false;

	item = this.items.pop();
	this.supply -= item.supply;
	this.demand -= item.demand;
	item.parent = null;
	return item;
}

Group.prototype.removeItem = function(item) {
	var index = this.items.indexOf(item);
	if (index >= 0) {
		this.supply -= item.supply;
		this.demand -= item.demand;
		this.items.splice(index, 1);
		item.parent = null;
		return item;
	} else {
		return false;
	}
}

Group.prototype.transferItemTo = function(target, item) {
	target.addItem(this.removeItem(item));

	return this;
}

function Bin(options) {
	this.name = options.name;
	this.owner = options.owner;
	
	if (this.owner && typeof this.owner == 'object' && this.owner.parent != undefined) {
		this.owner.parent = this;
	}

	this.items = [];
	this.supply = this.capacity =options.capacity;
}

Bin.prototype.print = function(quiet) {
	var printout;

	if (this.owner) {
		printout = this.owner.print(true);
	} else {
		printout = this.name;
	}

	printout += ' ('+this.items.length+'/'+this.capacity+')\n';

	for (var i=0; i < this.items.length; i++) {
		printout += ' - ';
		printout += this.items[i].print(true);
		printout += '\n';
	}

	if (!quiet) {
		console.log(printout);
	}

	return printout;
}

Bin.prototype.addItem = function(item) {
	this.items.push(item);
	this.supply--;
}

Bin.prototype.removeItem = function(item) {
	var index = this.items.indexOf(item);
	this.supply++;
	return this.items.splice(index, 1);
}

Bin.prototype.addItemsFromGroup = function(group, limit) {
	var count = Math.min(this.supply, group.demand);
	
	if (limit != undefined && count > limit) {
		count = limit;
	}

	for (var i=0; i < count; i++) {
		var item;
		if (item = group.popItem()) {
			this.addItem(item);
		}
	}

	return this;
}

locations = {};
volunteers = new Location('Volunteers');
noItems = [];

function getLocation(entry) {
	var loc = entry.transportation;
	
	if (locations[loc] == undefined) {
		locations[loc] = new Location(loc);
	}

	return locations[loc]
}

function partitionData(data) {
	var length = data.length;

	for (var i=1; i<length; i++) {
		var item = new Item(data[i]);

		if (data[i].role == '') {
			getLocation(data[i]).addItem(item);
		} else if (data[i].role == 'D') {
			getLocation(data[i]).addPotentialBin(item);
		} else if (data[i].role == 'V') {
			volunteers.addPotentialBin(item);
		} else {
			noItems.push(item);
		}
	}

	return true;
}

function prepareBins() {
	var busData = { capacity: 45, name: 'Bus' };
	locations['Bursley'].addBin(new Bin(busData));
	locations['Cube'].addBin(new Bin(busData));
	locations['Stockwell'].addBin(new Bin(busData)).addBin(new Bin(busData));

	delete locations['Late'];

	// Needs more bins
	for (loc in locations) {
		var location = locations[loc];
		if (location.supply < location.demand) {
			for (source in locations) {
				if (source == loc)
					continue;

				location.pullPotentialBins(locations[source], location.demand - location.supply);
				if (location.demand - location.supply <= 0)
					break;
			}
		}

		// Pull from volunteers if still not enough
		if (location.supply < location.demand) {
			location.pullPotentialBins(volunteers, location.demand - location.supply);
		}
	}

	// Extra bins--turn to item
	for (loc in locations) {
		var location = locations[loc];
		while (location.supply > location.demand) {
			lastItem = location.potentialBins.lastItem();
			if (location.supply - lastItem.supply >= location.demand) {
				location.potentialBinToItem(lastItem);
			} else {
				break;
			}
		}
	}

	// Turn all potential bins to real bins
	for (loc in locations) {
		var location = locations[loc];
		var item;
		while (item = location.potentialBins.lastItem()) {
			location.potentialBinToBin(item);
		}
	}	
}

function distributeAllLocations() {
	for (loc in locations) {
		var location = locations[loc];
		location.packBins();
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
	for (loc in locations) {
		locations[loc].print();
	}

	volunteers.print();
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