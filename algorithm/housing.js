var fs = require('fs');

var Bin = require('./housing.bin.js');
var Item = require('./housing.item.js');

var
	b1 = new Bin(4),
	b2 = new Bin(4),
	c = new Item(2, {title: 'C'});

b1.addItem(new Item()).addItem(new Item(1)).addItem(c);
c.moveTo(b2);
b1.print();
b2.print();