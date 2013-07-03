define(
    [
        "../kernel"
    ],
    function(kernel) {
        
        var
            // Imports.
            root = kernel.root,
            pname = kernel.pname,
            nil = kernel.nil,
            kernelArray = kernel.array,
            
            // Aliases.
            Object = root.Object,
            
            Array = root.Array,
            ArrayPrototype = Array[pname],
            arrayConcat = ArrayPrototype.concat,
            arraySlice = ArrayPrototype.slice,
            
            Function = root.Function,
            FunctionPrototype = Function[pname],
            functionApply = FunctionPrototype.apply,
            functionBind = FunctionPrototype.bind,
            functionCall = FunctionPrototype.call,
            
            // A reusable constructor for prototype hacks.
            construct = function() {},
            
            // Return the given function bound to an object with optional 
            // curried arguments. Defer to the built-in, if available.
            bind = functionBind
                ? functionCall.bind(functionBind)
                : function(fn, context) {
                    var curried,
                        bound;
                    
                    curried = arraySlice.call(arguments, 2);
                    bound = function() {
                        var args = curried.concat(arraySlice.call(arguments)),
                            self,
                            result;
                        
                        // Was "new" used to call this?
                        if (this instanceof bound) {
                            construct[pname] = fn[pname];
                            self = new construct();
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
                };
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
            
            // "Unbind" Function's other methods so they can be called
            // in functional style.
            apply = fn(functionApply),
            call = fn(functionCall),
            
            // Array utilities. We'll export these to the kernel
            // so this module's dependencies and the array module.
            concat = fn(arrayConcat),
            slice = fn(arraySlice);
        
        // Exports.
        fn.proto = FunctionPrototype;
        fn.bind = bind;
        fn.partial = partial;
        fn.apply = apply;
        fn.call = call;
        
        // Kernel exports.
        kernelArray.concat = concat;
        kernelArray.slice = slice;
        
        return fn;
    }
);
