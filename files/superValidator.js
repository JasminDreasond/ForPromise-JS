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

                // Type List
                (

                    // While
                    (

                        // Confirm Type
                        obj.type === "while" &&

                        // Not Empty
                        typeof obj.while !== "undefined" &&

                        // Detect Function
                        typeof obj.callback === "function"

                    )

                )

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