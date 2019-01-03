var fp = require('lodash/fp');
var object = require('lodash/fp/object');
var extend = require('lodash/fp/extend');

var print = val => {
    console.log(val);
}

print(fp.map(parseInt)(['2', '11', '02']));


// loop
print(fp.times(i=>{return i+10})(5));


// clone
var objects = [{ 'a': 1 }, { 'b': 2 }];
print(fp.clone(objects))
