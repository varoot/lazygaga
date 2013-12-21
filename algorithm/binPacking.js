var fs = require('fs');


function binPacking(people) {
	console.log(people)
	return;
}

fs.readFile('undergrad-retreat.json', function (err, data) {
	if (err) { throw err; }
	var data = JSON.parse(data);
	binPacking(data);
});