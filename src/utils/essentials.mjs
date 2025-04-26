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
 * @param {import("../index.mjs").forPromiseIteration} obj - The input object to validate.
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
  /**  @type {{ confirmed: boolean, type?: string }} */
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

/**
 * Checks the type of a given object or returns its type as a string.
 *
 * @param {*} obj - The object to check or identify.
 * @param {string} [type] - Optional. If provided, checks whether the object matches this type (e.g., "object", "array", "string").
 * @returns {boolean|string|null} - Returns `true` if the type matches, `false` if not,
 *                                   the type string if no type is provided, or `null` if the object is `undefined`.
 *
 * @example
 * objType([], 'array'); // true
 * objType({}, 'object'); // true
 * objType('hello'); // "string"
 * objType(undefined); // null
 */
export function objType(obj, type) {
  // Is Defined
  if (typeof obj !== 'undefined') {
    // Get Obj Type
    const result = Object.prototype.toString.call(obj).toLowerCase();
    // Check Obj Type
    if (typeof type === 'string') {
      if (result === `[object ${type}]`) return true;
      return false;
    }
    // Send Result
    return result.substring(8, result.length - 1);
  }
  // Nope
  return null;
}

/**
 * Counts the number of elements in an array or the number of properties in an object.
 *
 * @param {*} obj - The array or object to count.
 * @returns {number} - The count of items (array elements or object keys), or `0` if the input is neither an array nor an object.
 *
 * @example
 * countObj([1, 2, 3]); // 3
 * countObj({ a: 1, b: 2 }); // 2
 * countObj('not an object'); // 0
 */
export function countObj(obj) {
  // Is Array
  if (Array.isArray(obj)) return obj.length;
  // Object
  if (objType(obj, 'object')) return Object.keys(obj).length;
  // Nothing
  return 0;
}
