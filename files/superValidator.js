module.exports = function (obj) {

    // Start Module
    const objType = require('./objType');

    // Yep
    if (

        // Main Type
        objType(obj, 'object') &&
        (

            // Object
            objType(obj.data, 'object') ||

            // Array
            Array.isArray(obj.data) ||

            // Number
            typeof obj.data === "number" ||

            // Type
            (

                // Confirm the type is String
                typeof obj.type === "string" &&

                // While Type
                obj.type === "while"

            )

        )
    ) {
        return true;
    }

    // Nope
    else {
        return false;
    }

};