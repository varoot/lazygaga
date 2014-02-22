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

	this.removeDominated();

	return this;
}

function dominantComp(a,b) {
	var result;
	for (attr in a.score) {
		var comp = b.score[attr] - a.score[attr];
		if (result < 0 && comp > 0 || result > 0 && comp < 0) {
			return 0;
		}
		if (result == undefined || result == 0) {
			result = comp;
		}
	}
	return result;
}

SolutionCollection.prototype.removeDominated = function() {
	var i, j;
	i = 0;
	while (i < this.solutions.length) {
		j = 0;
		while (j < this.solutions.length) {
			if (i == j) {
				j++;
				continue;
			}

			var comp = dominantComp(this.solutions[i], this.solutions[j]);
			if (comp < 0) {
				// j dominates i -> kill i
				this.solutions.splice(i,1);
				i--;
				break;
			} else if (comp > 1) {
				// i dominates j -> kill j
				this.solutions.splice(j,1);
			} else {
				j++;
			}
		}
		i++;
	}
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
	var output = 'Solutions ('+this.solutions.length+' total):\n';

	// Top 3
	for (var i=0; i < Math.min(3, this.solutions.length); i++) {
		output += 'Solution '+(i+1)+'\n';

		output += solutionToString(this.solutions[i]);
	}

	/*
	output += 'Worst Solution\n';
	output += solutionToString(this.solutions[this.solutions.length - 1]);
	*/

	return output;
}

module.exports = SolutionCollection;