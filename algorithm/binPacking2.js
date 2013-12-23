var fs = require('fs');

function generateTestItems(arr) {
	var items = {};
	var count = 1;

	for (var i = 0; i < arr.length; i++) {
		var groups = {};

		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j] == 0)
				continue;

			var lgName = 'LG'+(j+1);
			groups[lgName] = [];

			for (var k = 0; k < arr[i][j]; k++) {
				groups[lgName].push(lgName+'-Person'+count);
				count ++;
			}
		}
		
		items['Location '+(i+1)] = groups;
	}

	return items;
}

function generateTestBins(arr) {
	var bins = {};
	var busCount = 1;
	var carCount = 1;

	for (var i = 0; i < arr.length; i++) {
		var cars = [];
		for (var j = 0; j < 2; j++) {
			for (var k = 0; k < arr[i][j]; k++) {
				var car = {
					driver: (j == 0 ? 'Bus #'+(busCount++) : 'Car #'+(carCount++)),
					capacity: (j == 0 ? 40 : 4),
					passengers: []
				};
				cars.push(car);
			}
		}
		
		bins['Location '+(i+1)] = cars;
	}

	return bins;
}

items = generateTestItems([
	[14, 3, 5, 10, 5,  5, 4, 17, 3], // 66
	[ 1, 2, 6, 10, 3,  3, 9,  5, 4], // 43
	[ 2, 9, 8,  3, 9, 10, 5,  2, 9], // 57
]);

bins = generateTestBins([
	[1, 7],
	[1, 2],
	[1, 6]
]);

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

// console.log('\n\nItems\n');
// console.log(items);

// console.log('\n\nBins\n');
// console.log(bins);

distributeAllLocations();
for (location in bins) {
	console.log('\n\n'+location+'\n');
	console.log(bins[location]);
}