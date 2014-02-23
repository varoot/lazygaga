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
	var penalties = 0;
	for (var i=0; i < binCol.bins.length; i++) {
		var bin = binCol.bins[i];
		if (bin.items.length > 0) {
			penalties += bin.data.penalties[bin.data.gender];
		}
	}
	return penalties;
};

EvalFunctions.spread = function(binCol) {
	var spread = 0.0;
	for (var i=0; i < binCol.bins.length; i++) {
		var bin = binCol.bins[i];
		for (var j=0; j < bin.items.length; j++) {
			var item = bin.items[j];
			for (var k=0; k < item.siblings.length; k++) {
				var sibling = item.siblings[k];
				if (!bin.data.group || !sibling.parent.data.group || sibling.parent.data.group != bin.data.group) {
					spread++;
				} else if (bin != sibling.parent) {
					// Calculate spread by how far it is to reach through adjacent bins
					var distance = binCol.distance(bin, sibling.parent);
					spread += distance / bin.data.groupSize;
				}
			}
		}
	}
	return spread;
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

	return this;
}

function dominantComp(a,b) {
	var result;
	for (var criteria in a.score) {
		var comp = b.score[criteria] - a.score[criteria];
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
	// Sort the solutions first
	this.solutions.sort(function(a,b) {
		for (var criteria in EvalFunctions) {
			if (a.score[criteria] == b.score[criteria])
				continue;
			return a.score[criteria] - b.score[criteria];
		}
	});
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
		output += scoreType+': '+sol.score[scoreType].toFixed(2)+', ';
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

	output += 'Worst Solution\n';
	output += solutionToString(this.solutions[this.solutions.length - 1]);

	return output;
}

module.exports = SolutionCollection;