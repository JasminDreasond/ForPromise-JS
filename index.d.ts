//  Super Validator
import superValidator from './files/superValidator';
import validateTotal from './files/validateTotal';
import objType from './files/objType';

export default function forPromise (obj, callback) {
    return new Promise(function (resolve, reject) {

        // Validate Obj
        const objValidated = superValidator(obj);

        // Validator
        if (objValidated.confirmed) {

            // Prepare Count
            let items = {
                error: false,
                forceBreak: false,
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
            const result = function (isExtra, extraIndex, item, forceBreak = false) {

                // Prepare Edit
                let item_to_edit = null;

                // Not Extra
                if (!isExtra) {
                    item_to_edit = items;
                } else {
                    item_to_edit = extra.list[extraIndex]
                }

                // Force Break
                const forceBreakResult = { isObject: (objType(forceBreak, 'object')) };

                // Is Boolean
                if (!forceBreakResult.isObject) {
                    if (!item_to_edit.forceBreak) { forceBreakResult.allowed = (typeof forceBreak === "boolean" && forceBreak); } else {
                        forceBreakResult.allowed = false;
                    }
                    forceBreakResult.dontSendResult = false;
                    forceBreakResult.forceResult = false;
                }

                // Object
                else {
                    if (!item_to_edit.forceBreak) { forceBreakResult.allowed = (typeof forceBreak.break === "boolean" && forceBreak.break); } else {
                        forceBreakResult.allowed = false;
                    }
                    forceBreakResult.dontSendResult = (typeof forceBreak.dontSendResult === "boolean" && forceBreak.dontSendResult);
                    forceBreakResult.forceResult = (typeof forceBreak.forceResult === "boolean" && forceBreak.forceResult);
                }

                // No Error
                if ((!item_to_edit.error && !item_to_edit.forceBreak) || forceBreakResult.forceResult) {

                    // Count
                    item_to_edit.count++;

                    // Normal
                    if (item !== null) {

                        // Add Item
                        item_to_edit.items.push(item);

                    }

                    // Set Force Break
                    if (!item_to_edit.forceBreak && forceBreakResult.allowed) {
                        item_to_edit.forceBreak = true;
                        item_to_edit.count = item_to_edit.total + 1;
                    }

                    // Complete
                    if (

                        // Can Send Results
                        !forceBreakResult.dontSendResult && (

                            // Count is Bigger
                            (item_to_edit.count >= item_to_edit.total) || (

                                // Type
                                typeof item_to_edit.type === "string" &&
                                (

                                    // While
                                    (item_to_edit.type === "while" && item_to_edit.count > 0)

                                )

                            )

                        )

                    ) {

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
                    if (!items.error && !items.forceBreak) {

                        // Try
                        try {

                            // Result Function
                            const result_data = function (forceBreak) { return result(isExtra, index, item, forceBreak); };

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

                        // Start For
                        let for_used = false;
                        for (const item in the_item.data) {
                            for_used = true;
                            if (!runFor_script(item)) { break; }
                        }

                        // Not Used? Confirmed
                        if (!for_used) {
                            return result(isExtra, index, null);
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

                                    // Add Total
                                    item_to_edit.total++;

                                    // Callback and Continue
                                    callback(function (forceBreak) { item_to_edit.count++; return result(isExtra, index, null, forceBreak); }, error_result, extra.extra_function);
                                    return custom_do();

                                }

                                // Nope
                                else { return result(isExtra, index, null); }

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

                    // Exist Number
                    if (the_item.data > 0) {
                        for (let item = 0; item < the_item.data; item++) {
                            if (!runFor_script(item)) { break; }
                        }
                    }

                    // Nope
                    else {
                        return result(isExtra, index, null);
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
                            forceBreak: false,
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
                                if (!items.error && !items.forceBreak) { runFor(callback, true, index, new_extra); }

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