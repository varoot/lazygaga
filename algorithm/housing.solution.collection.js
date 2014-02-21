function evaluateSolution(binCollection) {
	// TODO
	// Return score for this solution
	return 0;
}

// SolutionCollection module
function SolutionCollection() {
	this.solutions = [];
}

function evaluateSlack(binCol) {
	// TODO return a number, lower is better
	return 0;
}

function evaluatePreference(binCol) {
	// TODO return a number, lower is better
	return 0;
}

function evaluateSplits(binCol) {
	// TODO return a number, lower is better
	return 0;
}

function sortScore(a, b) {
	// TODO real equation
	return (a.slack - b.slack);
}

SolutionCollection.prototype.add = function(binCollection) {
	// TODO
	// Save and evaluate this solution

	var sol = {};
	sol.bins = binCollection.bins;
	sol.score = {
		slack: evaluateSlack(binCollection),
		preference: evaluatePreference(binCollection),
		splits: evaluateSplits(binCollection)
	}
	this.solutions.push(sol);

	return this;
}

SolutionCollection.prototype.sort = function() {
	// TODO sort by score
	this.solutions.sort(sortScore);
	return this;
}

SolutionCollection.prototype.toString = function() {
	var output = 'Solutions:';

	// Top 3
	for (var i=0; i < 3; i++) {
		output += 'Solution '+(i+1)+'\n';
		output += this.solutions[i].bins.join('');
		output += '\n\n';
	}
	return output;
}

module.exports = SolutionCollection;