module.exports = function (obj, callback) {
    return new Promise(function (resolve, reject) {

        //  Super Validator
        const superValidator = require('./files/superValidator');
        const validateTotal = require('./files/validateTotal');

        // Validate Obj
        const objValidated = superValidator(obj);

        // Validator
        if (objValidated.confirmed) {

            // Prepare Count
            let items = {
                error: false,
                count: 0,
                total: null,
                items: []
            };

            // Error Result
            const error_result = function (err) {

                // Send Error Reject
                items.error = true;
                reject(err);

                // Complete
                return;

            };

            // Prepare Result
            const result = function (isExtra, extraIndex, item) {

                // Prepare Edit
                let item_to_edit = null;

                // Not Extra
                if (!isExtra) {
                    item_to_edit = items;
                } else {
                    item_to_edit = extra.list[extraIndex]
                }

                // No Error
                if (!item_to_edit.error) {

                    // Count
                    item_to_edit.count++;

                    // Normal
                    if (item !== null) {

                        // Add Item
                        item_to_edit.items.push(item);

                    }

                    // Complete
                    if ((item_to_edit.count >= item_to_edit.total) || (

                        // Type
                        typeof item_to_edit.type === "string" &&
                        (

                            // While
                            (item_to_edit.type === "while" && item_to_edit.count > 0)

                        )

                    )) {

                        // Normal Result
                        if (!isExtra) {
                            if (!extra.enabled) { resolve(items); }
                        }

                        // Extra Result
                        else {

                            // Check Extra Exist
                            if (extra.list[extraIndex]) {

                                // Complete Check
                                extra.list[extraIndex].complete = true;

                                // Check List
                                let confirmation_checked = true;

                                // Detect Progress
                                for (const item in extra.list) {
                                    if (!extra.list[item].complete) {
                                        confirmation_checked = false;
                                        break;
                                    }
                                }

                                // Complete
                                if (confirmation_checked) {

                                    // Add Extra Info
                                    items.extra = extra.list;

                                    // Resolve
                                    resolve(items);

                                }

                            }

                            // Nope
                            else {
                                items.error = true;
                                reject(new Error('forAwait Extra Index not found.'));
                            }

                        }

                    }

                }

                // Return
                return;

            };

            // Run For
            const runFor = function (callback, isExtra = false, index = null, new_extra = null) {

                // Prepare the Item
                let the_item = null;

                // Normal
                if (!isExtra) {
                    the_item = obj;
                } else {
                    the_item = new_extra;
                }

                // Run Script
                const runFor_script = function (item = null) {

                    // No Error
                    if (!items.error) {

                        // Try
                        try {

                            // Result Function
                            const result_data = function () { return result(isExtra, index, item); };

                            // Exist Item
                            if (item !== null) {
                                callback(item, result_data, error_result, extra.extra_function);
                            }

                            // Nope
                            else {
                                callback(result_data, error_result, extra.extra_function);
                            }

                        }

                        // Error
                        catch (err) {
                            items.error = true;
                            reject(err);
                            return false;
                        }

                        // Normal Return
                        return true;

                    }

                    // Error
                    else {
                        return false;
                    }

                };

                // Start the For
                if (typeof the_item.data !== "number") {

                    // For Object
                    if (!the_item.type) {
                        for (const item in the_item.data) {
                            if (!runFor_script(item)) { break; }
                        }
                    }

                    // Type
                    else {

                        // Start a While
                        if (the_item.type === "while") {

                            // Prepare
                            const custom_do = function () {

                                // Validate
                                if (the_item.checker()) {

                                    // Prepare Edit
                                    let item_to_edit = null;

                                    // Not Extra
                                    if (!isExtra) {
                                        item_to_edit = items;
                                    } else {
                                        item_to_edit = extra.list[index]
                                    }

                                    item_to_edit.total++;

                                    return callback(function () { item_to_edit.count++; return result(isExtra, index, null); }, error_result, extra.extra_function);

                                }

                                // Nope
                                else { return; }

                            };

                            // Start
                            custom_do();

                        }

                        // Nothing
                        else { items.error = true; reject(new Error('Invalid Function Type!')); }

                    }

                }

                // Number Type
                else {
                    for (let item = 0; item < the_item.data; item++) {
                        if (!runFor_script(item)) { break; }
                    }
                }

                return;

            };

            // Detect Object Module
            items.total = validateTotal(obj.data);

            // Type
            if (objValidated.type) { items.type = objValidated.type; }

            // Prepare Extra
            const extra = {

                // Enabled
                enabled: false,

                // Extra List
                list: [],

                // Functions
                extra_function: function (new_extra) {

                    // Validate Obj
                    const objValidated = superValidator(new_extra);

                    // Validator
                    if (objValidated.confirmed) {

                        // Prepare Extra
                        extra.enabled = true;
                        extra.list.push({
                            complete: false,
                            count: 0,
                            total: null,
                            items: []
                        });

                        // Index
                        const index = extra.list.length - 1;

                        // Get Total
                        extra.list[index].total = validateTotal(new_extra.data);

                        // Type
                        if (objValidated.type) { extra.list[index].type = objValidated.type; }

                        // Callback
                        return {

                            // Run Extra
                            run: function (callback) {

                                // Run For
                                if (!items.error) { runFor(callback, true, index, new_extra); }

                                // Complete
                                return;

                            }

                        };

                    }

                    // Nope
                    else {
                        const err = new Error('Invalid Object Extra Type to start the Script.');
                        items.error = true;
                        reject(err);
                        return null;
                    }

                }

            };

            // Run For
            runFor(callback);

        }

        // Nope
        else {
            reject(new Error('Invalid Object Type to start the Script.'));
        }

        // Complete
        return;

    });
};