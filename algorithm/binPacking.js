var fs = require('fs');

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
noItems = [];



function binPacking(people) {
	console.log(people)
	return;
}

function sortBy(attr) {
	return function(x, y) {
		return ((x[attr] == y[attr]) ? 0 : ((x[attr] > y[attr]) ? 1 : -1));
	}
}


function allocateItem(entry){
	var location = entry.transportation;
	var lifegroup = entry.lifegroup;
	if (items[location] == undefined){
		items[location] = [];
	}

	if (items[location][lifegroup] == undefined) {
		items[location][lifegroup] =[];
	}
	items[location][lifegroup].push(entry);
}

function allocateBin(entry){
	var location = entry.transportation;
	if (bins[location] == undefined){
		bins[location] = [];
	}

	var bin = createBin(entry);
	bins[location].push(bin);
}

function createBin(entry, capacityValue){
	var name = entry.name;
	if (capacityValue == undefined){
		capacityValue = 4;
	}
	var capacity = 4;
	return bin={driver:entry,capacity:capacityValue,passengers:[]};
}

function partitionData(data) {
	var length = data.length;
	for (var i=1; i<length; i++) {
		if (data[i].role == ''){
			allocateItem(data[i]);
		}
		else if (data[i].role == 'D'){
			allocateBin(data[i]);
		}
		else {
			noItems.push(data[i]);
		}
	}
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

fs.readFile('undergrad-retreat.json', function (err, peopleData) {
	if (err) { throw err; }
	var peopleData = JSON.parse(peopleData);
	partitionData(peopleData);
	// console.log(items['Bursley']['Snapback']);
	distributeAllLocations();
	for (location in bins) {
		console.log('\n\n'+location+'\n');
		for (bin in bins[location]) {
			printBin(bins[location][bin]);
		}
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
