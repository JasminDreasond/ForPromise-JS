import objType from './objType';

export default function countObj (obj) {

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