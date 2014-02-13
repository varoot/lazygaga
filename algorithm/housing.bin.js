// Bin module
function Bin(size, data) {
	this.supply = size;
	this.data = data || {};
	this.items = [];
}

Bin.prototype.addItem = function(item) {
	if (this.supply >= item.demand)
	{
		this.items.push(item);
		this.supply -= item.demand;
		if (item.parent) {
			item.parent.removeItem(item);
		}
		item.parent = this;
	}
	return this;
}

Bin.prototype.removeItem = function(item) {
	var index = this.items.indexOf(item);
	if (index < 0) return null;
	item.parent = null;
	return this.items.splice(index, 1);
}

Bin.prototype.toString = function() {
	var output = '[ ';
	for (var i = 0; i < this.items.length; i++) {
		if (i > 0) {
			output += ', '
		}
		output += this.items[i];
	};
	output += ' ]'
	return output;
};

Bin.prototype.print = function() {
	console.log(this.toString());
};

module.exports = Bin;