export default function objType (obj, type) {
    if (Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`) {
        return true;
    } else {
        return false;
    }
};