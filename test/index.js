// The Module
const forPromise = require('../index');

// The Test
forPromise(10, function (item, fn) {

    // Test Value
    console.log(item);

    // Complete
    fn();

});