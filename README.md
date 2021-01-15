<div align="center">
<p>
    <a href="https://discord.gg/TgHdvJd"><img src="https://img.shields.io/discord/413193536188579841?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/for-promise"><img src="https://img.shields.io/npm/v/for-promise.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/for-promise"><img src="https://img.shields.io/npm/dt/for-promise.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://www.patreon.com/JasminDreasond"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
</p>
<p>
    <a href="https://nodei.co/npm/for-promise/"><img src="https://nodei.co/npm/for-promise.png?downloads=true&stars=true" alt="npm installnfo" /></a>
</p>
</div>

# ForPromise-JS
Execute all promises inside a "for" script. This module will help you to execute all the Promise methods instantly inside a single promise.

Instead of waiting for "For" to execute several promises and callbacks at a time, with this module they will all be executed instantly at one Promise.

## Simple Example

### Execute a "For Script" with "Promise" in a number variable.
```js
// For Promise
const forPromise = require('for-promise');

// The Data
const dataCount = 10;

// Start For Script
await forPromise({ data: dataCount }, function (index, fn) {

    // Show Index
    console.log(`The index value is '${index}'.`);

    // The "fn()" will say that the execution of this script has ended.
    fn();

});
```

### Execute a "For Script" with "Promise" in a object or array.
```js
// For Promise
const forPromise = require('for-promise');

// Module Example
const fs = require('fs');

// The Data
const data = [1,2,3,4,5,6,7,8,9,10];

// Start For Script
await forPromise({ data: data }, function (index, fn, fn_error) {

    // Show Index
    console.log(`The index value '${index}' is '${data[index]}'.`);

    // Wait Script
    fs.readdir(testFolder, (err, files) => {
        
        // Success! The "fn()" will say that the execution of this script has ended. 
        if(!err) {
            fn();
        }

        // Error! The execution of the promise will be interrupted here!
        else {
            fn_error(err);
        }

    });

});
```

### Execute a "For Script" with extra "For Scripts" functions.
```js
// For Promise
const forPromise = require('for-promise');

// Module Example
const fs = require('fs');

// The Data
const data = [1,2,3,4,5,6,7,8,9,10];
const data2 = [11,12,13,14,15,16,17,18,19,20];

// Start For Script
await forPromise({ data: data }, function (index, fn, fn_error, extra) {

    // Show Index
    console.log(`The index value '${index}' is '${data[index]}'.`);

    // Add Extra For Script for the "data2"
    const extraForAwait = extra({ data: data2 });

    // Execute the extra For Script
    extraForAwait.run(function (index2, fn, fn_error) {

        // Show Index
        console.log(`The index value '${index2}' is '${data2[index2]}'.`);

        // Wait Script
        fs.readdir(testFolder, (err, files) => {
        
            // Success! The "fn()" will say that the execution of this script has ended. 
            if(!err) {
                fn();
            }

            // Error! The execution of the promise will be interrupted here!
            else {
                fn_error(err);
            }

        });

    });

    // Complete Here
    fn();

});
```

### Execute a "Do While Script".
```js
// For Promise
const forPromise = require('for-promise');

// Prepare Do Whilte Data
const whileData = { count: 0 };

// Start the Promise
await forPromise({
    
    // Prepare Settings
    type: 'while',
    while: whileData,

    // The Value will be checked here
    checker: function () {
        return (whileData.count < 3);
    }

}, function (fn, fn_error) {

// Test Value
console.log(`Do: ${whileData.count}`);

// Count the Value
whileData.count++;

// Complete
fn();

});
```

### Execute a "For Script" with "Break FN". It is the same result of adding a "break" to a "For Script".
```js
// For Promise
const forPromise = require('for-promise');

// Start the Promise
await forPromise({
    data: [1, 2, 3]
}, function (item, fn) {

    // Test Value
    console.log(`Array with Force Break: ${item}`);

    // Break FN
    fn(true);

});
```

```js
    await forPromise({
        data: [1, 2, 3]
    }, function (item, fn, fn_error) {

        // Wait Script
        fs.readdir(path.join(__dirname, '../files'), (err, files) => {

        // Success! The "fn()" will say that the execution of this script has ended with a Force Final Result. 
        if (!err) {
            console.log(`Force Break used to read this data: ${item}`);
            console.log(files);
            fn({ forceResult: true });
        }

        // Error! The execution of the promise will be interrupted here!
        else {
            fn_error(err);
        }

    });

    // Force Complete
    fn({ break: true, dontSendResult: true });

});
```
