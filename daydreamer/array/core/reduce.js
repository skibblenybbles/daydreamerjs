define(
    [
        "../_base",
        "../../kernel",
        "../../function/_base",
        "../../iteration/core/reduce",
        // Mixins.
        "./each"
    ],
    function(array, kernel, fn, iteration) {
        
        var
            // Imports.
            ieach = array.ieach,
            
            root = kernel.root,
            pname = kernel.pname,
            lname = kernel.lname,
            nil = kernel.nil,
            kernelLanguage = kernel.language,
            
            isFunction = kernelLanguage.isFunction,
            
            call = fn.call,
            
            push = iteration.push,
            ifpush = iteration.ifpush,
            mkreduction = iteration.mkreduction,
            mkreduce = iteration.mkreduce,
            
            // Aliases.
            Array = root.Array,
            ArrayPrototype = Array[pname],
            
            arrayReduce = ArrayPrototype.reduce,
            arrayReduceRight = ArrayPrototype.reduceRight,
            arrayMap = ArrayPrototype.map,
            arrayFilter = ArrayPrototype.filter,
            
            // Generate an iterative array reducer.
            imkreduce = function(step) {
                return function(array, op, initial, context) {
                    var value = isFunction(initial)
                            ? initial()
                            : initial,
                        start = step > 0
                            ? 0
                            : array[lname] - 1;
                    
                    context = context || this;
                    if (arguments[lname] < 3) {
                        value = array[start];
                        start += step;
                    }
                    ieach(array,
                        function(stop, obj, i, array) {
                            value = call(op, this,
                                stop, value, obj, i, array);
                        }, context, start, nil, step);
                    return value;
                };
            },
            
            // Iterative reduce.
            ireduce = imkreduce(1),
            
            // Iterative right reduce.
            irreduce = imkreduce(-1),
            
            // Make a fresh array.
            mkarray = function() {
                return [];
            },
            
            // Polyfill any missing array reduction methods and add reversed
            // versions for convenience.
            map = arrayMap
                ? fn(arrayMap)
                : mkreduction(ireduce, push, mkarray),
            
            rmap = mkreduction(irreduce, push, mkarray),
            
            filter = arrayFilter
                ? fn(arrayFilter)
                : mkreduction(ireduce, ifpush, mkarray),
            
            rfilter = mkreduction(irreduce, ifpush, mkarray),
            
            reduce = arrayReduce
                ? fn(arrayReduce)
                : mkreduce(ireduce),
            
            rreduce = arrayReduceRight
                ? fn(arrayReduceRight)
                : mkreduce(irreduce);
        
        // Exports.
        array.ireduce = ireduce;
        array.irreduce = irreduce;
        array.map = map;
        array.rmap = rmap;
        array.filter = filter;
        array.rfilter = rfilter;
        array.reduce = reduce;
        array.rreduce = rreduce;
        
        return array;
    }
);
