<div align="center">
<p>
    <a href="https://discord.gg/TgHdvJd"><img src="https://img.shields.io/discord/413193536188579841?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/for-promise"><img src="https://img.shields.io/npm/v/for-promise.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/for-promise"><img src="https://img.shields.io/npm/dt/for-promise.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://www.patreon.com/JasminDreasond"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg?logo=patreon" alt="Patreon" /></a>
    <a href="https://ko-fi.com/jasmindreasond"><img src="https://img.shields.io/badge/donate-ko%20fi-29ABE0.svg?logo=ko-fi" alt="Ko-Fi" /></a>
</p>
<p>
    <a href="https://nodei.co/npm/for-promise/"><img src="https://nodei.co/npm/for-promise.png?downloads=true&stars=true" alt="npm installnfo" /></a>
</p>
</div>

# ForPromise-JS

**ForPromise-JS** is a lightweight utility for running asynchronous scripts in sequence — like a `for`, `forEach`, or `while` loop — but fully promise-based and with complete control over each iteration.

This module helps you run multiple asynchronous operations (Promises or callbacks) **in an ordered, controlled flow** within a single `await` call.

Instead of juggling multiple `Promise` instances inside regular loop structures (which can get messy or execute out of order), **ForPromise-JS** executes them sequentially, instantly, and cleanly — all inside one master `Promise`.

---

### ✨ Key Features:
- Works with arrays, objects, numbers, and custom `while` conditions.
- Supports `fn()` and `fn_error()` callbacks.
- Allows `break`, `forceResult`, `dontSendResult`, and even nested async loops.
- Simple `await`-based usage — no need for external `async/await` handling inside the loop.

> Perfect for replacing async logic inside `for`/`forEach`/`while` scripts — but safer and smarter.


## 📘 Usage Examples

### 🔁 Basic Loop: Number as Loop Count
Execute a loop a fixed number of times (like a traditional `for` loop).

```js
// Import the module
import forPromise from 'for-promise';

// Loop will run 10 times
const dataCount = 10;

// Run the loop
await forPromise({ data: dataCount }, (index, result) => {
    
    // Display the current index
    console.log(`The index value is '${index}'.`);

    // Call result() to mark this iteration as complete
    result();

});
```

### 🧾 Looping Through Arrays or Objects
You can also loop through an array or object and handle asynchronous logic inside.

```js
// Import the module
import forPromise from 'for-promise';
import fs from 'fs';

// Sample array
const data = [1, 2, 3, 4, 5];

// Loop through each index
await forPromise({ data }, (index, result, error) => {

    // Print current index and value
    console.log(`The index '${index}' has value '${data[index]}'.`);

    // Async operation: reading a directory
    fs.readdir('/some/folder/path', (err, files) => {

        if (!err) {
            // Success: mark the iteration as completed
            result();
        } else {
            // Error: interrupt the loop and reject the promise
            error(err);
        }

    });

});
```

### ➕ Adding Extra Loops Dynamically
Use `extra()` to add another loop from inside your main loop — perfect for nested async iterations!

```js
// Import the module
import forPromise from 'for-promise';
import fs from 'fs';

// First dataset
const data1 = [1, 2, 3];
const data2 = [4, 5, 6];

// Outer loop
await forPromise({ data: data1 }, (index, result, error, extra) => {

    console.log(`Outer index '${index}' has value '${data1[index]}'.`);

    // Add a nested loop dynamically
    const extraLoop = extra({ data: data2 });

    // Run the nested loop
    extraLoop.run((index2, result2, error2) => {
        console.log(`  Inner index '${index2}' has value '${data2[index2]}'.`);

        fs.readdir('/another/folder', (err, files) => {
            if (!err) result2();
            else error2(err);
        });
    });

    // Continue outer loop
    result();

});
```

### 🔁 Execute a "Do While" Loop
Use the `type: 'while'` option to run a loop that repeats while a condition remains true — similar to a classic `do...while` structure.

```js
// Import the module
import forPromise from 'for-promise';

// Data object to track the condition
const whileData = { count: 0 };

// Run the "do while" loop
await forPromise({

    // Set the loop type
    type: 'while',
    while: whileData,

    // Condition checker (must return true or false)
    checker: () => {
        return (whileData.count < 3);
    }

}, (done, error) => {

    // Loop body: will execute at least once
    console.log(`Do: ${whileData.count}`);

    // Update value
    whileData.count++;

    // Mark iteration as complete
    done();

});
```

> 💡 This script will print:
> ```
> Do: 0  
> Do: 1  
> Do: 2  
> ```

### 🛑 Execute a "For Script" with `Break FN`
Use `fn(true)` inside the loop callback to **force a break**, just like a `break` statement in traditional `for` loops.

```js
// Import the module
import forPromise from 'for-promise';

// Start the loop
await forPromise({
    data: [1, 2, 3]
}, (item, done) => {

    // Show the current item
    console.log(`Array with Force Break: ${item}`);

    // Break the loop immediately
    done(true);

});
```

> 💡 This will only execute once and stop the entire loop.
> ```
> Array with Force Break: 1
> ```

You can use this when you need to **exit early** based on a certain condition, just like `break` in native loops.

### 🧠 Execute a "For Script" with `forceResult`, `break`, and `dontSendResult`
Use the `fn()` function with advanced options to control how the loop behaves and what result it returns.

```js
// Import the module
import forPromise from 'for-promise';

// Example: Use filesystem
import fs from 'fs';
import path from 'path';

// Start the loop
await forPromise({
    data: [1, 2, 3]
}, (item, done, fail) => {

    // Async example: read a folder
    fs.readdir(path.join(__dirname, './folder'), (err, files) => {

        if (!err) {
            console.log(`Force Break used to read this data: ${item}`);
            console.log(files);

            // ✅ Mark this result as the final result and end all execution
            done({ forceResult: true });
        } else {
            // ❌ Stop execution and return the error
            fail(err);
        }

    });

    // 🛑 Stop further execution without returning a result
    done({ break: true, dontSendResult: true });

});
```

---

### 🔍 Behavior Summary

- `forceResult: true`: Immediately ends the loop and **returns this value** as the final result.
- `break: true`: Stops the loop like a normal `break`.
- `dontSendResult: true`: Suppresses the current iteration result from being stored or returned.

> 💡 You can combine `forceResult`, `break`, and `dontSendResult` as needed to fully control the loop's execution and return behavior.

---

> 🧠 This documentation was written with the help of AI assistance (ChatGPT by OpenAI) to ensure clarity, structure, and language accuracy.
