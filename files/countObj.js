const objType = require('./objType');

module.exports = function (obj) {

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