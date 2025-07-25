//  Libs
import { isJsonObject, superValidator, validateTotal } from './utils/essentials.mjs';

/**
 * @typedef {Object} forPromiseIteration
 * @property {Record<string, any>|any[]|number} data - The main data source. Can be an array-like object, number (as count), or object for keys.
 * @property {string} [type] - Optional type of iteration. Currently supports "while" for while-like looping.
 * @property {*} [while] - While validator
 * @property {Function} [checker] - Used only with type: "while" to determine loop continuation.
 */

/**
 * Extra control object.
 *
 * @typedef {Object} forPromiseExtra
 * @property {boolean} complete - Whether the extra item has completed processing.
 * @property {boolean} forceBreak - Whether the extra item has triggered a forced break.
 * @property {number} count - Number of processed items.
 * @property {number|null} total - Total expected items, or null if not set.
 * @property {Array<any>} items - List of items processed.
 * @property {string} [type] - Optional type of processing (e.g., 'while').
 * @property {boolean} [error] - Is error.
 */

/**
 * @typedef {{
 *  error: boolean;
 *  forceBreak: boolean;
 *  type?: string;
 *  extra?: Array<forPromiseExtra>;
 *  count: number;
 *  total: number|null;
 *  items: Array<any>
 * }} ForPromiseStatus
 */

/**
 * Runs an asynchronous iterative operation with advanced control over flow, breaks, and nested (extra) iterations.
 * The function accepts a data object and a callback, and returns a Promise that resolves with iteration results.
 *
 * @param {forPromiseIteration} obj - The data object used to control the iteration process. It must follow a specific structure.
 * @param {Function} callback - A function that will be called on each iteration step.
 *
 * @returns {Promise<ForPromiseStatus>}
 */
export default function forPromise(obj, callback) {
  return new Promise((resolve, reject) => {
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
      /** @type {ForPromiseStatus} */
      let items = {
        error: false,
        forceBreak: false,
        count: 0,
        total: null,
        items: [],
      };

      // Error Result
      /** @param {Error} err */
      const error_result = function (err) {
        // Send Error Reject
        items.error = true;
        reject(err);
      };

      /**
       * Prepare Result
       *
       * @param {boolean} isExtra
       * @param {number} extraIndex
       * @param {*} item
       * @param {boolean|{ break: boolean; dontSendResult: boolean; forceResult: boolean;}} [forceBreak=false]
       */
      const result = function (isExtra, extraIndex, item, forceBreak = false) {
        // Prepare Edit
        let item_to_edit = null;

        // Not Extra
        if (!isExtra) {
          item_to_edit = items;
        } else {
          item_to_edit = extra.list[extraIndex];
        }

        if (typeof item_to_edit.total !== 'number')
          return reject(new Error('Invalid "item_to_edit.total" value: null or undefined.'));

        // Force Break
        /**
         * @typedef {Object} ForceBreakResult
         * @property {boolean} isObject
         * @property {boolean} [allowed]
         * @property {boolean} [dontSendResult]
         * @property {boolean} [forceResult]
         */

        /** @type {ForceBreakResult} */
        const forceBreakResult = {
          isObject: /** @type {boolean} */ (isJsonObject(forceBreak)),
        };

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
        else if (typeof forceBreak === 'object') {
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
            if (!isExtra) {
              if (!extra.enabled) resolve(items);
            }
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
                reject(new Error(`forAwait Extra Index ${extraIndex} not found.`));
              }
            }
          }
        }
      };

      /**
       * @param {Function} callback
       * @param {boolean} [isExtra=false]
       * @param {number} [index=-1]
       * @param {{data: any, type?: string, checker?: Function}|null} [new_extra=null]
       * @returns {void}
       */
      const runFor = function (callback, isExtra = false, index = -1, new_extra = null) {
        let the_item = null;

        // Normal
        if (!isExtra) the_item = obj;
        else if (typeof new_extra === 'object') the_item = new_extra;

        /**
         * @param {number|string|null} [item=null]
         * @returns {boolean}
         */
        const runFor_script = function (item = null) {
          // No Error
          if (!items.error && !items.forceBreak) {
            // Try
            try {
              // Result Function
              const result_data = /**  @param {boolean} forceBreak */ (forceBreak) =>
                result(isExtra, index, item, forceBreak);

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

        if (the_item === null) throw new Error('Invalid "the_item" value: null or undefined.');

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
              /** @returns {object|void} */
              const custom_do = function () {
                if (typeof the_item.checker !== 'function')
                  throw new Error('Invalid "checker" function in "the_item".');

                // Validate
                if (the_item.checker()) {
                  // Prepare Edit
                  let item_to_edit = null;

                  // Not Extra
                  if (!isExtra) {
                    item_to_edit = items;
                  } else item_to_edit = extra.list[index];

                  if (typeof item_to_edit.total !== 'number')
                    throw new Error('Invalid "item_to_edit.total" value: null or undefined.');

                  // Add Total
                  item_to_edit.total++;

                  // Callback and Continue
                  callback(
                    /**
                     * Increments the item count and returns the result handler.
                     *
                     * @param {boolean} forceBreak - Whether to forcefully break the loop.
                     * @returns {*} The result of the handler execution.
                     */
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

      /**
       * Represents the extra handling structure.
       *
       * @typedef {Object} Extra
       * @property {boolean} enabled - Whether extra processing is enabled.
       * @property {Array<forPromiseExtra>} list - List of extra items.
       * @property {function(forPromiseIteration): {run: function(Function): void}|null} extra_function - Function to add a new extra item.
       */

      /** @type {Extra} */
      const extra = {
        // Enabled
        enabled: false,

        // Extra List
        list: [],

        /**
         * @param {forPromiseIteration} new_extra
         * @returns {{run: function(Function): void}|null}
         */
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
                if (!items.error && !items.forceBreak) runFor(callback, true, index, new_extra);
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
