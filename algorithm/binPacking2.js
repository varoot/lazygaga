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
		if (bins[location][bin].capacity > max) {
			max = bins[location][bin].capacity;
			maxBin = bin;
		}
	}

	return maxBin;
}

function moveItemsToBin(location, item, bin) {
	var count = Math.min(items[location][item].length, bins[location][bin].capacity);
	console.log('Moving '+count+' items');
	bins[location][bin].passengers = bins[location][bin].passengers.concat(items[location][item].splice(0,count));
}

// console.log('\n\nItems\n');
// console.log(items);

// console.log('\n\nBins\n');
// console.log(bins);

console.log(findLargestItem('Location 2'));
console.log(findLargestBin('Location 2'));

moveItemsToBin('Location 2', findLargestItem('Location 2'), findLargestBin('Location 2'));
console.log(bins);