module.exports = function (obj) {

    // Detect Object Module
    const objType = require('./objType');

    // Is Array
    if (Array.isArray(obj)) {
        return obj.length;
    }

    // Object
    else if (objType(obj, 'object')) {
        return Object.keys(obj).length;
    }

    // Nothing
    return null;

};