module.exports = function (obj) {

    // Start Module
    const objType = require('./objType');
    const result = { confirmed: false };

    // Normal
    if (

        // Main Type
        objType(obj, 'object') &&
        (

            // Object
            objType(obj.data, 'object') ||

            // Array
            Array.isArray(obj.data) ||

            // Number
            typeof obj.data === "number"

        )
    ) {
        result.confirmed = true;
    }

    // Type
    else if (typeof obj.type === "string") {

        // While
        if (

            // Confirm Type
            obj.type === "while" &&

            // Not Empty
            typeof obj.while !== "undefined" &&

            // Detect Function
            typeof obj.callback === "function"

        ) {
            result.confirmed = true;
            result.type = 'while';
        }

    }

    // Complete
    return result;

};