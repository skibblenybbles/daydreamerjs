define(
    [
        "./_base",
        "../kernel",
        "../has/array",
        "../function/_base"
    ],
    function(array, kernel, has, fn) {
        
        var
            // Imports.
            root = kernel.root,
            pname = kernel.pname,
            lname = kernel.lname,
            undef = kernel.undef,
            nil = kernel.nil,
            kernelLanguage = kernel.language,
            
            isNumber = kernelLanguage.isNumber,
            
            partial = fn.partial,
            call = fn.call,
            
            Math = root.Math,
            min = Math.min,
            max = Math.max,
            
            Array = root.Array,
            ArrayPrototype = Array[pname],
            
            arrayForEach = ArrayPrototype.forEach,
            arrayEvery = ArrayPrototype.every,
            arraySome = ArrayPrototype.some,
            arrayIndexOf = ArrayPrototype.indexOf,
            arrayLastIndexOf = ArrayPrototype.lastIndexOf,
            
            // Iterate over each item in an array, with optional slicing
            // and stepping, calling the given function. The callback
            // function is similar to forEach, except it will be passed a
            // function as the first parameter that can be called to stop
            // iteration.
            ieach = function(array, fn, context, start, end, step) {
                var length = array[lname],
                    looping = true,
                    stop = function(value) {
                        looping = false;
                        return value;
                    },
                    result,
                    i;
                
                context = context || root;
                step = step || 1;
                start = isNumber(start)
                    ? start >= 0
                        ? start
                        : start + length
                    : step > 0
                        ? 0
                        : length - 1;
                end = isNumber(end)
                    ? end >= 0
                        ? end
                        : end + length
                    : step > 0
                        ? length
                        : -1;
                
                if (step > 0) {
                    start = max(0, start);
                    end = min(length, end);
                } else {
                    start = min(length - 1, start);
                    end = max(-1, end);
                }
                for (i = start; 
                    looping && 
                        ((step > 0 && i < end) || 
                        (step < 0 && i > end));
                    i += step) {
                    result = call(fn, context, 
                        stop, array[i], i, array);
                }
                return result;
            },
            
            // Generate an operator that evaluates a function inside an ieach
            // loop with the given context and optionally short-circuits or
            // modifies the result.
            imkunop = function(op, fn, context) {
                return function(stop, value, i, array) {
                    return op(stop,
                        call(fn, context || root,
                            value, i, array),
                        value, i, array);
                };
            },
            
            // Identity operator which evaluates a function inside an ieach
            // loop with the given context.
            id = partial(imkunop, function(stop, result) {
                return result;
            }),
            
            // Short-circuiting identity operator which evaluates a predicate
            // in the given context to determine whether to return the value.
            ifid = partial(imkunop, function(stop, result, value) {
                if (result) {
                    return stop(value);
                }
            }),
            
            // Short-circuiting unary and operator which evaluates a predicate
            // in the given context to determine what boolean value to return.
            and = partial(imkunop, function(stop, result) {
                result = !!result;
                return !result ? stop(result) : result;
            }),
            
            // Short-circuiting unary or operator which evaluates a predicate
            // in the given context to determine what boolean value to return.
            or = partial(imkunop, function(stop, result) {
                result = !!result;
                return result ? stop(result) : result;
            }),
            
            mkeach = function(step, mkunop, defaultResult) {
                return function(array, fn, context) {
                    var result = ieach(array,
                        mkunop(fn, context || root),
                        nil, nil, nil, step);
                    
                    if (defaultResult !== undef) {
                        return result !== undef
                            ? result
                            : defaultResult;
                    }
                };
            },
            
            mkindex = function(step) {
                return function(array, item) {
                    ieach(array, function(stop, value, i) {
                        if (item === value) {
                            return stop(i);
                        }
                    }, nil, nil, nil, step);
                    return -1;
                };
            },
            
            // Polyfill array's methods and add find, rfind and sliced.
            each = has("array-foreach")
                ? fn(arrayForEach)
                : mkeach(1, id),
            
            reach = mkeach(-1, id),
            
            all = arrayEvery
                ? fn(arrayEvery)
                : mkeach(1, and, true),
            
            rall = mkeach(-1, and, true),
            
            any = arraySome
                ? fn(arraySome)
                : mkeach(1, or, false),
            
            rany = mkeach(-1, or, false),
            
            find = mkeach(1, ifid),
            
            rfind = mkeach(-1, ifid),
            
            index = arrayIndexOf
                ? fn(arrayIndexOf)
                : mkindex(1),
            
            rindex = arrayLastIndexOf
                ? fn(arrayLastIndexOf)
                : mkindex(-1),
            
            // Return a copy of the given array or array-like object sliced 
            // with positive or negative indexing and optional stepping,
            // a la Python.
            sliced = function(array, start, end, step) {
                var results = [];
                ieach(array,
                    function(stop, value, i, array) {
                        push(results, value);
                    }, nil, start, end, step);
                return results;
            };
        
        // Exports.
        array.ieach = ieach;
        array.each = each;
        array.reach = reach;
        array.all = all;
        array.rall = rall;
        array.any = any;
        array.rany = rany;
        array.find = find;
        array.rfind = rfind;
        array.index = index;
        array.rindex = rindex;
        array.sliced = sliced;
        
        return array;
    }
);
