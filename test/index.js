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
    const whileData = { count: 0 };
    await forPromise({
        type: 'while',
        while: whileData,
        checker: function () {
            return (whileData.count > 3);
        }
    }, function () {

        // Test Value
        console.log(`Do: ${whileData.count}`);

        // Count
        whileData.count++;

    });

    // The Data
    const data = [1, 2];
    const data2 = [1, 2];

    // Start For Script
    await forPromise({ data: data }, function (index, fn, fn_error, extra) {

        // Show Index
        console.group(`For (Normal): '${index}'`);

        // Add Extra For Script for the "data2"
        const extraForAwait = extra({ data: data2 });

        // Execute the extra For Script
        extraForAwait.run(function (index2, fn) {

            // Show Index
            console.log(`For (Extra): '${index2}'`);
            fn();

        });

        console.groupEnd();

        // Complete Here
        fn();

    });

    // Complete
    console.log('Complete!');
    return;

};

// Start the Test
tiny_test();