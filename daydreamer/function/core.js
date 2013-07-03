define(
    [
        "./_base",
        "../kernel"
    ],
    function(fn, kernel) {
        
        var
            // Imports.
            root = kernel.root,
            pname = kernel.pname,
            lname = kernel.lname,
            nil = kernel.nil,
            kernelArray = kernel.array,
            kernelLanguage = kernel.language,
            
            concat = kernelArray.concat,
            slice = kernelArray.slice,
            
            isFunction = kernelLanguage.isFunction,
            
            apply = fn.apply,
            call = fn.call,
            
            // The identity function.
            identity = function(value) {
                return value;
            },
            
            // Return a function that intercepts and transforms the given
            // function's arguments.
            before = function(fn, transform) {
                return isFunction(transform)
                    ? function() {
                        return apply(fn, this, apply(transform, this, arguments));
                    }
                    : fn;
            },
            
            // Return a function that intercepts and transforms the given
            // function's return value.
            after = function(fn, transform) {
                return isFunction(transform)
                    ? function() {
                        return apply(transform, this, concat([apply(fn, this, arguments)], slice(arguments)));
                    }
                    : fn;
            },
            
            // Return a function that intercepts and transforms the given
            // function's arguments and return value.
            around = function(fn, beforeTransform, afterTransform) {
                var args = arguments;
                return (
                    isFunction(beforeTransform)
                        ? isFunction(afterTransform)
                            ? function() {
                                return (
                                    apply(afterTransform, this, 
                                        concat(
                                            [apply(fn, this,
                                                apply(beforeTransform, this,
                                                    args))],
                                            slice(args))));
                            }
                            : before(fn, beforeTransform)
                        : isFunction(afterTransform)
                            ? after(fn, afterTransform)
                            : fn);
            },
            
            // Compose functions.
            compose = function() {
                var fns = arguments;
                
                return function() {
                    var length = fns[lname],
                        i = length - 1,
                        value = arguments;
                    
                    if (length > 0) {
                        value = apply(fns[i], this, value);
                        i--;
                        for (; i >= 0; i--) {
                            value = call(fns[i], this, value);
                        }
                    }
                    return value;
                };
            };
        
        // Exports.
        fn.identity = identity;
        fn.before = before;
        fn.after = after;
        fn.around = around;
        fn.compose = compose;
        
        return fn;
    }
);
