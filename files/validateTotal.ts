import countObj from './countObj';
import objType from './objType';

export default function validateTotal (obj) {

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