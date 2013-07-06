define(
    [
        "./_base",
        "../kernel",
        "../array/each",
        // Mixins.
        "./reduce"
    ],
    function(object, kernel, array) {
        
        var 
            // Imports.
            lname = kernel.lname,
            nil = kernel.nil,
            
            arrayslice = array.slice,
            arrayeach = array.each,
            arrayreach = array.reach,
            
            reduce = object.reduce,
            reducesafe = object.reducesafe,
            reduceowned = object.reduceowned,
            reducesafeowned = object.reducesafeowned,
            
            mkmixin = function(reduce, step) {
                var
                    aeach = (step || 1) < 0
                        ? arrayreach
                        : arrayeach;
                
                return function(destination) {
                    aeach(arrayslice(arguments, 1),
                        function(object) {
                            destination = reduce(object,
                                function(acc, value, key) {
                                    acc[key] = value;
                                    return acc;
                                }, destination || {});
                        });
                    return destination;
                };
            },
            
            mixin = mkmixin(reduce),
            rmixin = mkmixin(reduce, -1),
            
            mixinsafe = mkmixin(reducesafe),
            rmixinsafe = mkmixin(reducesafe, -1),
            
            mixinowned = mkmixin(reduceowned),
            rmixinowned = mkmixin(reduceowned, -1),
            
            mixinsafeowned = mkmixin(reducesafeowned),
            rmixinsafeowned = mkmixin(reducesafeowned, -1);
        
        // Exports.
        object.mixin = mixin;
        object.rmixin = rmixin;
        object.mixinsafe = mixinsafe;
        object.rmixinsafe = rmixinsafe;
        object.mixinowned = mixinowned;
        object.rmixinowned = rmixinowned;
        object.mixinsafeowned = mixinsafeowned;
        object.rmixinsafeowned = rmixinsafeowned;
        
        return object;
    }
);
