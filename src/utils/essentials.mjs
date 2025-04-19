import { countObj, objType } from 'tiny-essentials';

/**
 * Validates the total value based on the type of the input.
 *
 * - If the input is a number, subtracts 1 and returns it.
 * - If it's an object or array, returns its size using `countObj`.
 * - Otherwise, returns 0.
 *
 * @param {*} obj - The input to validate and process.
 * @returns {number} - The resulting total based on the input type.
 *
 * @example
 * validateTotal(5); // 4
 * validateTotal([1, 2, 3]); // 3
 * validateTotal({ a: 1, b: 2 }); // 2
 * validateTotal('invalid'); // 0
 */
export function validateTotal(obj) {
  // Get Total
  let newTotal = 0;
  if (typeof obj !== 'number') {
    if (objType(obj, 'object') || Array.isArray(obj)) newTotal = countObj(obj);
  } else newTotal = obj - 1;
  // Insert New Total
  return newTotal;
}

/**
 * Performs a structured validation on a given object and returns a confirmation result.
 *
 * - Confirms validity if `obj.data` is an object, array, or number.
 * - Also confirms if `obj.type` is `'while'`, and `obj.while` is defined, and `obj.checker` is a function.
 *
 * @param {*} obj - The input object to validate.
 * @returns {{ confirmed: boolean, type?: string }} - Returns an object with a `confirmed` boolean.
 *   If a "while" validation is detected, includes `type: 'while'`.
 *
 * @example
 * superValidator({ data: [1, 2, 3] }); // { confirmed: true }
 * superValidator({ type: 'while', while: true, checker: () => true }); // { confirmed: true, type: 'while' }
 * superValidator({}); // { confirmed: false }
 */
export function superValidator(obj) {
  // Start Module
  const result = { confirmed: false };
  // Normal
  if (
    // Main Type
    objType(obj, 'object') &&
    // Object
    (objType(obj.data, 'object') ||
      // Array
      Array.isArray(obj.data) ||
      // Number
      typeof obj.data === 'number')
  )
    result.confirmed = true;
  // Type
  else if (typeof obj.type === 'string') {
    // While
    if (
      // Confirm Type
      obj.type === 'while' &&
      // Not Empty
      typeof obj.while !== 'undefined' &&
      // Detect Function
      typeof obj.checker === 'function'
    ) {
      result.confirmed = true;
      result.type = 'while';
    }
  }
  // Complete
  return result;
}
