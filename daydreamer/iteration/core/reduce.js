define(
    [
        "../_base",
        "../../kernel",
        "../../array/_base",
        "../../function/_base"
    ],
    function(iteration, kernel, array, fn) {
        
        var
            // Imports.
            root = kernel.root,
            lname = kernel.lname,
            undef = kernel.undef,
            nil = kernel.nil,
            
            arraypush = array.push,
            
            apply = fn.apply,
            call = fn.call,
            partial = fn.partial,
            
            // Generate an operator that evaluates a function inside an
            // ireduce loop with the given context that optionally
            // short-circuits or modifies the accumulator.
            imkbinop = function(op, fn, context) {
                return function(stop, acc, value, key, object) {
                    return op(stop, acc,
                        call(fn, context || this,
                            value, key, object),
                        value, key, object);
                };
            },
            
            // Array-accumulating binary operator which evaluates a function
            // in the given context to transform the values to accumulate.
            push = partial(imkbinop, function(stop, acc, result) {
                arraypush(acc, result);
                return acc;
            }),
            
            // Conditional array-accumulating binary operator which evaluates 
            // a predicate in the given context to determine which of the
            // values to accumulate.
            ifpush = partial(imkbinop, function(stop, acc, result, value) {
                if (result) {
                    arraypush(acc, value);
                }
                return acc;
            }),
            
            // Object-accumulating binary operator which evaluates a function
            // in the given context to transform the values to accumulate.
            mix = partial(imkbinop, function(stop, acc, result, value, key) {
                acc[key] = result;
                return acc;
            }),
            
            // Conditional object-accumulating binary operator which evaluates 
            // a predicate in the given context to determine which of the
            // values to accumulate.
            ifmix = partial(imkbinop, function(stop, acc, result, value, key) {
                if (result) {
                    acc[key] = value;
                }
                return acc;
            }),
            
            // Make a reduction from the iterative reducer, the 
            // binary operator generator and the initial value.
            mkreduction = function(ireduce, mkbinop, initial) {
                return function(array, fn, context) {
                    return ireduce(array, 
                        mkbinop(fn, context || root), initial);
                };
            },
            
            // Make a reducer from the iterative reducer.
            mkreduce = function(ireduce) {
                return function(object, op, initial, context)  {
                    return ireduce(object,
                        function(stop, previous, next, key, object) {
                            return call(op, context || root,
                                previous, next, key, object);
                        }, initial || nil);
                };
            };
        
        // Exports.
        iteration.push = push;
        iteration.ifpush = ifpush;
        iteration.mix = mix;
        iteration.ifmix = ifmix;
        iteration.mkreduction = mkreduction;
        iteration.mkreduce = mkreduce;
        
        return iteration;
    }
);
