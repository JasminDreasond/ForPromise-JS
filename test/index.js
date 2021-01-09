const tiny_test = async function () {

    // The Module
    const forPromise = require('../index');

    // The Test
    await forPromise(10, function (item, fn) {

        // Test Value
        console.log(item);

        // Complete
        fn();

    });

    // Complete
    console.log('Complete!');
    return;

};

// Start the Test
tiny_test();