function evaluateSolution(binCollection) {
	// TODO
	// Return score for this solution
	return 0;
}

// SolutionCollection module
function SolutionCollection() {
	this.solutions = [];
}

SolutionCollection.prototype.add = function(binCollection) {
	// TODO
	// Save and evaluate this solution
	// Do insertion sort here so the solutions are sorted automatically

	var sol = {};
	sol.bins = binCollection.bins;
	this.solutions.push(sol);

	return this;
}

SolutionCollection.prototype.toString = function() {
	var output = 'Solutions:';
	for (var i=0; i < this.solutions.length; i++) {
		output += 'Solution '+(i+1)+'\n';
		output += this.solutions[i].bins;
		output += '\n\n';
	}
	return output;
}

module.exports = SolutionCollection;