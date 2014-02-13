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

Item.prototype.toString = function() {
	var output = 'Untitled';
	if (this.data.title) {
		output = this.data.title;
	}
	return output+'('+this.demand+')';
};

module.exports = Item;