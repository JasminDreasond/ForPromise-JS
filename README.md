<div align="center">
<p>
    <a href="https://discord.gg/TgHdvJd"><img src="https://img.shields.io/discord/413193536188579841?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/for-promise"><img src="https://img.shields.io/npm/v/for-promise.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/for-promise"><img src="https://img.shields.io/npm/dt/for-promise.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://david-dm.org/JasminDreasond/for-promise"><img src="https://img.shields.io/david/JasminDreasond/for-promise.svg?maxAge=3600" alt="Dependencies" /></a>
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

### Execute a "For Script" with "Promise"
```js

// For Promise
const forPromise = require('for-promise');

// Module Example
const fs = require('fs');

// The Data
const data = [1,2,3,4,5,6,7,8,9,10];

// Start For Script
await forPromise(data, function (index, fn, fn_error) {

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

### Execute a "For Script" with extra "For Scripts"
```js
// For Promise
const forPromise = require('for-promise');

// Module Example
const fs = require('fs');

// The Data
const data = [1,2,3,4,5,6,7,8,9,10];
const data2 = [11,12,13,14,15,16,17,18,19,20];

// Start For Script
await forPromise(data, function (index, fn, fn_error, extra) {

    // Show Index
    console.log(`The index value '${index}' is '${data[index]}'.`);

    // Add Extra For Script for the "data"
    const extraForAwait = extra(data2);

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

});


```