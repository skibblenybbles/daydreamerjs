define(
    [
        "./_base",
        "../kernel",
        "../has/array",
        "../function/_base",
        "../iteration/core/each"
    ],
    function(array, kernel, has, fn, iteration) {
        
        var
            // Imports.
            root = kernel.root,
            pname = kernel.pname,
            lname = kernel.lname,
            nil = kernel.nil,
            kernelLanguage = kernel.language,
            
            isNumber = kernelLanguage.isNumber,
            
            partial = fn.partial,
            call = fn.call,
            
            id = iteration.id,
            ifid = iteration.ifid,
            and = iteration.and,
            or = iteration.or,
            mkeach = iteration.mkeach,
            mkkey = iteration.mkkey,
            
            // Aliases.
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
            
            // Arguments for a simple reverse ieach iterator.
            rev = [nil, nil, nil, -1],
            
            // Iterator generators.
            mkarrayeach = partial(mkeach, 
                ieach, nil),
                
            mkrarrayeach = partial(mkeach,
                ieach, rev),
            
            mkindex = partial(mkkey,
                ieach, nil, -1),
            
            mkrindex = partial(mkkey,
                ieach, rev, -1),
            
            // Polyfill any missing array iteration methods and add reversed
            // versions for convenience.
            each = has("array-foreach")
                ? fn(arrayForEach)
                : mkarrayeach(id),
            
            reach = mkrarrayeach(id),
            
            find = mkarrayeach(ifid),
            
            rfind = mkrarrayeach(ifid),
            
            all = arrayEvery
                ? fn(arrayEvery)
                : mkarrayeach(and, true),
            
            rall = mkrarrayeach(and, true),
            
            any = arraySome
                ? fn(arraySome)
                : mkarrayeach(or, false),
            
            rany = mkrarrayeach(or, false),
            
            index = arrayIndexOf
                ? fn(arrayIndexOf)
                : mkindex(),
            
            rindex = arrayLastIndexOf
                ? fn(arrayLastIndexOf)
                : mkrindex(),
            
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
