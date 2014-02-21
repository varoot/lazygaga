function evaluateSolution(binCollection) {
	// TODO
	// Return score for this solution
	return 0;
}

// SolutionCollection module
function SolutionCollection() {
	this.solutions = [];
}

var EvalFunctions = {};

EvalFunctions.slack = function(binCol) {
	var slacks = 0;
	for (var i=0; i < binCol.bins.length; i++) {
		if (binCol.bins[i].items.length > 0) {
			slacks += binCol.bins[i].supply;
		}
	}
	return slacks;
};

EvalFunctions.penalty = function(binCol) {
	return 0;
};

EvalFunctions.itemCount = function(binCol) {
	var itemCount = 0;
	for (var i=0; i < binCol.bins.length; i++) {
		itemCount += binCol.bins[i].items.length;
	}
	return itemCount;
};

function sortScore(a, b) {
	// TODO real equation
	return (a.score.slack + a.score.itemCount) - (b.score.slack + b.score.itemCount);
}

SolutionCollection.prototype.add = function(binCollection) {
	// TODO
	// Save and evaluate this solution

	var sol = {};
	sol.bins = binCollection.bins;

	sol.score = {};
	for (funcName in EvalFunctions) {
		sol.score[funcName] = EvalFunctions[funcName](binCollection);
	}

	this.solutions.push(sol);

	return this;
}

SolutionCollection.prototype.sort = function() {
	// TODO sort by score
	this.solutions.sort(sortScore);
	return this;
}

function solutionToString(sol) {
	// Score
	var output = '{'
	for (scoreType in sol.score) {
		output += scoreType+': '+sol.score[scoreType]+', ';
	}
	output += '}\n';

	output += sol.bins.join('');
	output += '\n\n';

	return output;
}

SolutionCollection.prototype.toString = function() {
	var output = 'Solutions:\n';

	// Top 3
	for (var i=0; i < Math.min(3, this.solutions.length); i++) {
		output += 'Solution '+(i+1)+'\n';

		output += solutionToString(this.solutions[i]);
	}

	output += 'Worst Solution\n';
	output += solutionToString(this.solutions[this.solutions.length - 1]);

	return output;
}

module.exports = SolutionCollection;