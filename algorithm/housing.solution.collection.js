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
	return 0;
};

function sortScore(a, b) {
	// TODO real equation
	return a.slack - b.slack;
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

SolutionCollection.prototype.toString = function() {
	var output = 'Solutions:\n';

	// Top 3
	for (var i=0; i < Math.min(3, this.solutions.length); i++) {
		output += 'Solution '+(i+1)+'\n';

		// Score
		output += '{'
		for (scoreType in this.solutions[i].score) {
			output += scoreType+': '+this.solutions[i].score[scoreType]+', ';
		}
		output += '}\n';

		output += this.solutions[i].bins.join('');
		output += '\n\n';
	}
	return output;
}

module.exports = SolutionCollection;