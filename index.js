module.exports = function (obj, callback) {
    return new Promise(function (resolve, reject) {

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

                // Add Item
                item_to_edit.items.push(item);

                // Complete
                if (item_to_edit.count >= item_to_edit.total) {

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
            const runFor_script = function (item) {

                // No Error
                if (!items.error) {

                    // Try
                    try {
                        callback(item, function () { return result(isExtra, index, item); }, error_result, extra.extra_function);
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
            if (typeof the_item !== "number") {
                for (const item in the_item) {
                    if (!runFor_script(item)) { break; }
                }
            }

            // Number Type
            else {
                for (let item = 0; item < the_item; item++) {
                    if (!runFor_script(item)) { break; }
                }
            }

            return;

        };

        // Detect Object Module
        const countObj = require('./files/countObj');
        if (typeof obj !== "number") {
            items.total = countObj(obj);
        } else {
            items.total = obj;
        }

        // Prepare Extra
        const extra = {

            // Enabled
            enabled: false,

            // Extra List
            list: [],

            // Functions
            extra_function: function (new_extra) {

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
                if (typeof new_extra !== "number") {
                    extra.list[index].total = countObj(new_extra);
                } else {
                    extra.list[index].total = new_extra;
                }

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

        };

        // Run For
        runFor(callback);

        // Complete
        return;

    });
};