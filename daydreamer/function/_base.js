define(
    [
        "../language/_base"
    ],
    function(language) {
        
        var
            // Convenience / compression aliases.
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
            
            Function = root.Function,
            FunctionPrototype = Function[pname],
            functionApply = FunctionPrototype.apply,
            functionBind = FunctionPrototype.bind,
            functionCall = FunctionPrototype.call,
            
            // A reusable constructor for prototype hacks.
            construct = function() {},
            
            // The identity function.
            identity = function(value) {
                return value;
            },
            
            // Return the given function bound to an object with optional 
            // curried arguments. Defer to the built-in, if available.
            bind = functionBind
                ? functionCall.bind(functionBind)
                : function(fn, context) {
                    var curried,
                        bound;
                    
                    if (!isFunction(fn)) {
                        throw new TypeError;
                    }
                    curried = arraySlice.call(arguments, 2);
                    bound = function() {
                        var args = curried.concat(arraySlice.call(arguments)),
                            self,
                            result;
                        
                        // Was "new" used to call this?
                        if (this instanceof bound) {
                            construct[pname] = fn[pname];
                            self = new construct;
                            construct[pname] = nil;
                            result = fn.apply(self, args);
                            return Object(result) === result
                                ? result
                                : self;
                        }
                        return fn.apply(context, args);
                    };
                    
                    return bound;
                },
            
            // Return the given function with curried arguments, preserving
            // the function's use of "this."
            partial = function(fn) {
                var curried = slice(arguments, 1);
                return function() {
                    return apply(fn, this, concat(curried, slice(arguments)));
                }
            },
            
            // Return the given method unbound from its prototype so
            // that the first argument to the resulting function will
            // be bound as the "this" value. In other words, make the
            // object-oriented method callable in a functional way.
            //
            // Also the export object.
            fn = function(fn) {
                return bind(functionCall, fn);
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
            
            // "Unbind" Function's other methods so they can be called
            // in functional style.
            apply = fn(functionApply),
            call = fn(functionCall),
            
            // Avoid circular imports by redefining a few utilties.
            concat = fn(arrayConcat),
            slice = fn(arraySlice),
            string = fn(objectToString),
            
            nameFunction = string(function() {}),
            isFunction = function(obj) {
                return string(obj) === nameFunction;
            };
        
        
        // Exports.
        fn.proto = FunctionPrototype,
        fn.identity = identity;
        fn.bind = bind;
        fn.partial = partial;
        fn.before = before;
        fn.after = after;
        fn.around = around;
        fn.compose = compose;
        fn.apply = apply;
        fn.call = call;
        
        return fn;
    }
);
