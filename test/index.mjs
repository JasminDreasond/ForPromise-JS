import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

import forPromise from '../dist/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tiny_test = async function () {
  // The Test

  // Number
  await forPromise({ data: 3 }, (item, fn) => {
    // Test Value
    console.log(`Number: ${item}`);

    // Complete
    fn();
  });

  // Object
  await forPromise(
    {
      data: {
        test1: true,
        test2: true,
      },
    },
    (item, fn) => {
      // Test Value
      console.log(`Object: ${item}`);

      // Complete
      fn();
    },
  );

  // Array
  await forPromise({ data: [1, 2, 3] }, (item, fn) => {
    // Test Value
    console.log(`Array: ${item}`);

    // Complete
    fn();
  });

  // While
  const whileData = { count: 0 };
  await forPromise(
    {
      type: 'while',
      while: whileData,
      checker: function () {
        return whileData.count < 3;
      },
    },
    (fn) => {
      // Test Value
      console.log(`Do: ${whileData.count}`);

      // Count
      whileData.count++;

      fn();
    },
  );

  // The Data
  const data = [1, 2];
  const data2 = [1, 2];

  // Start For Script
  await forPromise({ data: data }, (index, fn, fn_error, extra) => {
    // Show Index
    console.group(`For (Normal): '${index}'`);

    // Add Extra For Script for the "data2"
    const extraForAwait = extra({ data: data2 });

    // Execute the extra For Script
    extraForAwait.run((index2, fn2) => {
      // Show Index
      console.log(`For (Extra): '${index2}'`);
      fn2();
    });

    console.groupEnd();

    // Complete Here
    fn();
  });

  // Force Break
  await forPromise({ data: [1, 2, 3] }, (item, fn) => {
    // Test Value
    console.log(`Array with Force Break: ${item}`);

    // Force Complete
    fn(true);
  });

  await forPromise({ data: [1, 2, 3] }, (item, fn, fn_error) => {
    // Wait Script
    fs.readdir(path.join(__dirname, '../src'), (err, files) => {
      // Success! The "fn()" will say that the execution of this script has ended.
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
  });

  // Complete
  console.log('Complete!');
  return;
};

// Start the Test
tiny_test();
