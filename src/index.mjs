//  Libs
import { superValidator, validateTotal } from './utils/essentials.mjs';
import { objType } from './utils/lib.mjs';

/**
 * Runs an asynchronous iterative operation with advanced control over flow, breaks, and nested (extra) iterations.
 * The function accepts a data object and a callback, and returns a Promise that resolves with iteration results.
 *
 * @function
 * @param {Object} obj - The data object used to control the iteration process. It must follow a specific structure.
 * @param {Object|number} obj.data - The main data source. Can be an array-like object, number (as count), or object for keys.
 * @param {string} [obj.type] - Optional type of iteration. Currently supports `"while"` for while-like looping.
 * @param {Function} [obj.checker] - Used only with `type: "while"` to determine loop continuation.
 * @param {Function} callback - A function that will be called on each iteration step.
 * The callback receives the following parameters:
 *
 * @callback callback
 * @param {*} currentItem - The current item or index being iterated.
 * @param {Function} result - Function to call when iteration step finishes. Accepts an optional forceBreak configuration.
 * @param {Function} error - Function to call if an error is encountered.
 * @param {Function} extra - Function to call to register additional (nested) iterations.
 *
 * @returns {Promise<Object>} Resolves with an object containing the result of the iteration process.
 *
 * The returned object structure is:
 * @typedef {Object} IterationResult
 * @property {boolean} error - Whether an error occurred.
 * @property {boolean} forceBreak - Whether the iteration was forcefully broken.
 * @property {number} count - How many steps were executed.
 * @property {number} total - Total expected steps.
 * @property {Array} items - The collected results from each callback.
 * @property {Array} [extra] - If extras were used, contains an array of extra iteration results with the same structure.
 *
 * The `result()` function (inside the callback) accepts an optional argument:
 * @param {boolean|Object} [forceBreak=false] - If true, breaks the iteration early.
 * If an object is passed, it can contain:
 *   @property {boolean} [break=false] - Whether to break the loop.
 *   @property {boolean} [dontSendResult=false] - Prevents auto-resolve after completion.
 *   @property {boolean} [forceResult=false] - Forces result resolution regardless of loop status.
 *
 * The `extra()` function (inside the callback) is used to spawn additional loops within the current loop.
 * It must be passed a valid object like the main one, and returns:
 * @returns {Object} An object with a `run(callback)` method to run the extra loop.
 *
 * @throws {Error} Throws if invalid input types are provided or during execution.
 *
 * @example
 * const obj = { data: [1, 2, 3] };
 *
 * forPromise(obj, (item, result, error, extra) => {
 *   console.log(item);
 *   result(); // move to next
 * }).then(res => console.log(res));
 * 
 * @example
 * const input = {
 *   data: [1, 2, 3],
 * };
 * 
 * forPromise(input, (item, result, error, extraFn) => {
 *   if (item === 2) return result({ break: true });
 *   result();
 * }).then(console.log).catch(console.error);
 */
export default function forPromise(obj, callback) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof obj !== 'object' || obj === null) throw new Error('Invalid object provided.');
      if (typeof callback !== 'function') throw new Error('Callback must be a function.');
    } catch (err) {
      return reject(err);
    }

    // Validate Obj
    const objValidated = superValidator(obj);

    // Validator
    if (objValidated.confirmed) {
      // Prepare Count
      let items = {
        error: false,
        forceBreak: false,
        count: 0,
        total: null,
        items: [],
      };

      // Error Result
      const error_result = function (err) {
        // Send Error Reject
        items.error = true;
        reject(err);
      };

      // Prepare Result
      const result = function (isExtra, extraIndex, item, forceBreak = false) {
        // Prepare Edit
        let item_to_edit = null;

        // Not Extra
        if (!isExtra) {
          item_to_edit = items;
        } else {
          item_to_edit = extra.list[extraIndex];
        }

        // Force Break
        const forceBreakResult = { isObject: objType(forceBreak, 'object') };

        // Is Boolean
        if (!forceBreakResult.isObject) {
          if (!item_to_edit.forceBreak) {
            forceBreakResult.allowed = typeof forceBreak === 'boolean' && forceBreak;
          } else {
            forceBreakResult.allowed = false;
          }
          forceBreakResult.dontSendResult = false;
          forceBreakResult.forceResult = false;
        }

        // Object
        else {
          if (!item_to_edit.forceBreak)
            forceBreakResult.allowed = typeof forceBreak.break === 'boolean' && forceBreak.break;
          else forceBreakResult.allowed = false;

          forceBreakResult.dontSendResult =
            typeof forceBreak.dontSendResult === 'boolean' && forceBreak.dontSendResult;
          forceBreakResult.forceResult =
            typeof forceBreak.forceResult === 'boolean' && forceBreak.forceResult;
        }

        // No Error
        if ((!item_to_edit.error && !item_to_edit.forceBreak) || forceBreakResult.forceResult) {
          // Count
          item_to_edit.count++;

          // Normal
          if (item !== null) {
            // Add Item
            item_to_edit.items.push(item);
          }

          // Set Force Break
          if (!item_to_edit.forceBreak && forceBreakResult.allowed) {
            item_to_edit.forceBreak = true;
            item_to_edit.count = item_to_edit.total + 1;
          }

          // Complete
          if (
            // Can Send Results
            !forceBreakResult.dontSendResult &&
            // Count is Bigger
            (item_to_edit.count >= item_to_edit.total ||
              // Type
              (typeof item_to_edit.type === 'string' &&
                // While
                item_to_edit.type === 'while' &&
                item_to_edit.count > 0))
          ) {
            // Normal Result
            if (!isExtra)
              if (!extra.enabled) resolve(items);
              // Extra Result
              else {
                // Check Extra Exist
                if (extra.list[extraIndex]) {
                  // Complete Check
                  extra.list[extraIndex].complete = true;

                  // Check List
                  let confirmation_checked = true;

                  // Detect Progress
                  for (const item in extra.list) {
                    if (!extra.list[item].complete) {
                      confirmation_checked = false;
                      break;
                    }
                  }

                  // Complete
                  if (confirmation_checked) {
                    // Add Extra Info
                    items.extra = extra.list;

                    // Resolve
                    resolve(items);
                  }
                }

                // Nope
                else {
                  items.error = true;
                  reject(new Error('forAwait Extra Index not found.'));
                }
              }
          }
        }
      };

      // Run For
      const runFor = function (callback, isExtra = false, index = null, new_extra = null) {
        // Prepare the Item
        let the_item = null;

        // Normal
        if (!isExtra) the_item = obj;
        else the_item = new_extra;

        // Run Script
        const runFor_script = function (item = null) {
          // No Error
          if (!items.error && !items.forceBreak) {
            // Try
            try {
              // Result Function
              const result_data = (forceBreak) => result(isExtra, index, item, forceBreak);

              // Exist Item
              if (item !== null) callback(item, result_data, error_result, extra.extra_function);
              // Nope
              else callback(result_data, error_result, extra.extra_function);
            } catch (err) {
              // Error
              items.error = true;
              reject(err);
              return false;
            }

            // Normal Return
            return true;
          }

          // Error
          else return false;
        };

        // Start the For
        if (typeof the_item.data !== 'number') {
          // For Object
          if (!the_item.type) {
            // Start For
            let for_used = false;
            for (const item in the_item.data) {
              for_used = true;
              if (!runFor_script(item)) {
                break;
              }
            }

            // Not Used? Confirmed
            if (!for_used) return result(isExtra, index, null);
          }

          // Type
          else {
            // Start a While
            if (the_item.type === 'while') {
              // Prepare
              const custom_do = function () {
                // Validate
                if (the_item.checker()) {
                  // Prepare Edit
                  let item_to_edit = null;

                  // Not Extra
                  if (!isExtra) {
                    item_to_edit = items;
                  } else {
                    item_to_edit = extra.list[index];
                  }

                  // Add Total
                  item_to_edit.total++;

                  // Callback and Continue
                  callback(
                    function (forceBreak) {
                      item_to_edit.count++;
                      return result(isExtra, index, null, forceBreak);
                    },
                    error_result,
                    extra.extra_function,
                  );
                  return custom_do();
                }

                // Nope
                else return result(isExtra, index, null);
              };

              // Start
              custom_do();
            }

            // Nothing
            else {
              items.error = true;
              reject(new Error('Invalid Function Type!'));
            }
          }
        }

        // Number Type
        else {
          // Exist Number
          if (the_item.data > 0) {
            for (let item = 0; item < the_item.data; item++) {
              if (!runFor_script(item)) {
                break;
              }
            }
          }

          // Nope
          else return result(isExtra, index, null);
        }
      };

      // Detect Object Module
      items.total = validateTotal(obj.data);

      // Type
      if (objValidated.type) items.type = objValidated.type;

      // Prepare Extra
      const extra = {
        // Enabled
        enabled: false,

        // Extra List
        list: [],

        // Functions
        extra_function: function (new_extra) {
          // Validate Obj
          const objValidated = superValidator(new_extra);

          // Validator
          if (objValidated.confirmed) {
            // Prepare Extra
            extra.enabled = true;
            extra.list.push({
              complete: false,
              forceBreak: false,
              count: 0,
              total: null,
              items: [],
            });

            // Index
            const index = extra.list.length - 1;

            // Get Total
            extra.list[index].total = validateTotal(new_extra.data);

            // Type
            if (objValidated.type) extra.list[index].type = objValidated.type;

            // Callback
            return {
              // Run Extra
              run: function (callback) {
                // Run For
                if (!items.error && !items.forceBreak) {
                  runFor(callback, true, index, new_extra);
                }
              },
            };
          }

          // Nope
          else {
            const err = new Error('Invalid Object Extra Type to start the Script.');
            items.error = true;
            reject(err);
            return null;
          }
        },
      };

      // Run For
      runFor(callback);
    }

    // Nope
    else reject(new Error('Invalid Object Type to start the Script.'));
  });
}
