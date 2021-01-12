module.exports = function (obj) {

    // Start Module
    const objType = require('./objType');

    // Yep
    if (
        objType(obj, 'object') &&
        (
            objType(obj.data, 'object') ||
            Array.isArray(obj.data) ||
            typeof obj.data === "number"
        )
    ) {
        return true;
    }

    // Nope
    else {
        return false;
    }

};