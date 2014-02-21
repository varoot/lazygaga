// Item module
function Item(size, data) {
	if (size == undefined) {
		size = 1; // Default size is 1
	}
	this.demand = size;
	this.data = data || {};
	this.parent = null;
}

Item.prototype.moveTo = function(bin) {
	if (this.parent) {
		this.parent.removeItem(this);
	}
	bin.addItem(this);
	return this;
}

Item.prototype.breakdown = function(breakPoints) {
	var items = [];

	for (var i=0; i < breakPoints.length; i++) {
		var size = Math.min(this.demand, breakPoints[i]);

		if (size == 0) break;

		var item = new Item(size, this.data);
		items.push(item);
	}

	return items;
}

Item.prototype.toString = function() {
	var output = 'Untitled';
	if (this.data.name) {
		output = this.data.name;
	}
	return output+'('+this.demand+')';
};

module.exports = Item;