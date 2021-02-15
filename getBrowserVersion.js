module.exports = function (firstLine = 'var forPromise = ') {

    // For Promise
    let forPromise = require('./index').toString()
        .replace(`require('./files/objType')`, require('./files/objType').toString())
        .replace(
            `require('./files/superValidator')`, require('./files/superValidator').toString()
                .replace(`const objType = require('./objType');`, '')
        )
        .replace(
            `require('./files/validateTotal')`, require('./files/validateTotal').toString()
                .replace(
                    `require('./countObj')`, require('./files/countObj').toString()
                        .replace(`const objType = require('./objType');`, '')
                )
                .replace(`const objType = require('./objType');`, '')
        );

    // Send Data
    return `${firstLine}${forPromise};`;

};