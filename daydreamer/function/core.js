define(
    [
        "./_base",
        "../language/_base"
    ],
    function(fn, language) {
        
        var
            // Convenience / compression aliases.
            apply = fn.apply,
            call = fn.call,
            
            root = language.root,
            pname = language.pname,
            lname = language.lname,
            nil = language.nil,
            
            Object = root.Object,
            ObjectPrototype = Object[pname],
            objectToString = ObjectPrototype.toString,
            
            Array = root.Array,
            ArrayPrototype = Array[pname],
            arraySlice = ArrayPrototype.slice,
            arrayConcat = ArrayPrototype.concat,
            
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
                    : fn
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
                }
            },
            
            // REDUNDANT!
            // Avoid circular imports by redefining a few utilties.
            concat = fn(arrayConcat),
            slice = fn(arraySlice),
            string = fn(objectToString),
            
            nameFunction = string(function() {}),
            isFunction = function(obj) {
                return string(obj) === nameFunction;
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
