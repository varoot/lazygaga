var fs = require('fs');

var Bin = require('./housing.bin.js');

var b = Bin();
b.addItem('A').addItem('B').addItem('C');
b.print();