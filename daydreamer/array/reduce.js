define(
    [
        "./_base",
        "../language/core",
        "../function/_base",
        // Mixins.
        "./each"
    ],
    function(array, language, fn) {
        
        var
            // Convenience / compression aliases.
            root = language.root,
            pname = language.pname,
            lname = language.lname,
            nil = language.nil,
            isFunction = language.isFunction,
            
            partial = fn.partial,
            call = fn.call,
            
            arrayPush = array.push,
            ieach = array.ieach,
            
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
            
            // Generate an operator that evaluates a function inside an
            // ireduce loop with the given context and optionally short-circuits
            // or modifies the accumulator.
            imkbinop = function(op, fn, context) {
                return function(stop, acc, value, i, array) {
                    return op(stop, acc,
                        call(fn, context || this,
                            value, i, array),
                        value, i, array);
                };
            },
            
            // Array-accumulating binary operator which evaluates a function
            // in the given context to transform the values to accumulate.
            push = partial(imkbinop, function(stop, acc, result) {
                arrayPush(acc, result);
                return acc;
            }),
            
            // Conditional array-accumulating binary operator which evaluates 
            // a predicate in the given context to determine which of the
            // values to accumulate.
            ifpush = partial(imkbinop, function(stop, acc, result, value) {
                if (result) {
                    arrayPush(acc, value);
                }
                return acc;
            }),
            
            mkarray = function() {
                return [];
            },
            
            mkreduction = function(ireduce, mkbinop, initial) {
                return function(array, fn, context) {
                    return ireduce(array, 
                        mkbinop(fn, context || this), initial);
                };
            },
            
            mkreduce = function(ireduce) {
                return function(array, op, initial, context)  {
                    return ireduce(array,
                        function(stop, previous, next, i, array) {
                            return call(op, context || this,
                                previous, next, i, array);
                        }, initial || nil);
                };
            },
            
            // Polyfill array's methods.
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
