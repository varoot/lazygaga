// Bin module

// Bin constructor
module.exports = function() {
	// Private properties
	// var x;

	return {
		// Public properties
		items: [],

		// Methods
		addItem: function(item) {
			this.items.push(item);
			return this;
		},
		print: function() {
			console.log(this.items);
			return this;
		}
	};
}