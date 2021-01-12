module.exports = function (obj) {

    // Start Module
    const countObj = require('./countObj');
    const objType = require('./objType');

    // Get Total
    let newTotal = 0;
    if (typeof obj !== "number") {
        if (objType(obj, 'object') || Array.isArray(obj)) {
            newTotal = countObj(obj);
        }
    } else {
        newTotal = obj - 1;
    }

    // Insert New Total
    return newTotal;

};