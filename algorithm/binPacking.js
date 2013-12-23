var fs = require('fs');

items = {};
bins = {};
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
	bins[location].push(entry)
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

fs.readFile('undergrad-retreat.json', function (err, peopleData) {
	if (err) { throw err; }
	var peopleData = JSON.parse(peopleData);
	partitionData(peopleData);
	// console.log(items['Bursley']['Snapback']);
	console.log(bins['Bursley']);
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
