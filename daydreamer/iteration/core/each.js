define(
    [
        "../_base",
        "../../kernel",
        "../../function/_base"
    ],
    function(iteration, kernel, fn) {
        
        var
            // Imports.
            root = kernel.root,
            lname = kernel.lname,
            undef = kernel.undef,
            nil = kernel.nil,
            kernelArray = kernel.array,
            
            concat = kernelArray.concat,
            
            apply = fn.apply,
            call = fn.call,
            partial = fn.partial,
            
            // Generate an operator that evaluates a function inside an ieach
            // loop with the given context and optionally short-circuits or
            // modifies the result.
            imkunop = function(op, fn, context) {
                return function(stop, value, key, object) {
                    return op(stop,
                        call(fn, context || this,
                            value, key, object),
                        value, key, object);
                };
            },
            
            // Identity operator generator which evaluates a function inside an
            // ieach loop with the given context and returns the result.
            id = partial(imkunop, function(stop, result) {
                return result;
            }),
            
            // Short-circuiting identity operator generator which evaluates a
            // predicate in the given context to determine whether to return
            // the value.
            ifid = partial(imkunop, function(stop, result, value) {
                if (result) {
                    return stop(value);
                }
            }),
            
            // Short-circuiting unary and operator generator which evaluates a
            // predicate in the given context to determine what boolean value
            // to return.
            and = partial(imkunop, function(stop, result) {
                result = !!result;
                return !result ? stop(result) : result;
            }),
            
            // Short-circuiting unary or operator generator which evaluates a
            // predicate in the given context to determine what boolean value
            // to return.
            or = partial(imkunop, function(stop, result) {
                result = !!result;
                return result ? stop(result) : result;
            }),
            
            // Make an iterator that calls the given ieach() function
            // with the given unary operator generator and any additional
            // arguments. The generated function may optionally return a
            // result if the default result is specified.
            mkeach = function(ieach, args, mkunop, defaultResult) {
                var 
                    hasDefaultResult = arguments[lname] > 3;
                
                args = args || [];
                return function(iterable, fn, context) {
                    var 
                        result = apply(ieach, nil, 
                            concat([iterable, mkunop(fn, context || root)],
                                args));
                    
                    if (hasDefaultResult) {
                        return result !== undef
                            ? result
                            : defaultResult;
                    }
                };
            },
            
            // Make an iterator that returns the key or index of the first
            // object found strictly equal to the given item, calling the
            // given ieach() function with any additional arguments.
            mkkey = function(ieach, args, defaultResult) {
                args = args || [];
                return function(value, item) {
                    apply(ieach, nil,
                        concat([
                            function(stop, value, key) {
                                if (item === value) {
                                    return stop(i);
                                }
                            }], args));
                    return defaultResult;
                };
            };
        
        // Exports.
        iteration.id = id;
        iteration.ifid = ifid;
        iteration.and = and;
        iteration.or = or;
        iteration.mkeach = mkeach;
        iteration.mkkey = mkkey;
        
        return iteration;
    }
);
