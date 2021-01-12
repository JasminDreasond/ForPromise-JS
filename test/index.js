const tiny_test = async function () {

    // The Module
    const forPromise = require('../index');

    // The Test

    // Number
    await forPromise({ data: 3 }, function (item, fn) {

        // Test Value
        console.log(`Number: ${item}`);

        // Complete
        fn();

    });

    // Object
    await forPromise({
        data: {
            test1: true,
            test2: true
        }
    }, function (item, fn) {

        // Test Value
        console.log(`Object: ${item}`);

        // Complete
        fn();

    });

    // Array
    await forPromise({
        data: [1, 2, 3]
    }, function (item, fn) {

        // Test Value
        console.log(`Array: ${item}`);

        // Complete
        fn();

    });

    // While
    const whileData = { confirmed: true };
    await forPromise({
        type: 'while',
        data: whileData,
        callback: function () {
            return (whileData.confirmed === true)
        }
    }, function (fn) {

        // Test Value
        console.log(`Array: ${item}`);

        // Complete
        fn();

    });

    // Complete
    console.log('Complete!');
    return;

};

// Start the Test
tiny_test();