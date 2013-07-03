define(
    [
        "./_base",
        "../kernel",
        "../array/each",
        // Mixins.
        "./each"
    ],
    function(object, kernel, array) {
        
        var 
            // Imports.
            lname = kernel.lname,
            nil = kernel.nil,
            
            arrayslice = array.slice,
            arrayeach = array.each,
            arrayreach = array.reach,
            
            each = object.each,
            eachsafe = object.eachsafe,
            eachowned = object.eachowned,
            eachsafeowned = object.eachsafeowned,
            
            mkmixin = function(step, oeach) {
                var aeach = step < 0 ? arrayreach : arrayeach;
                
                return function(destination) {
                    if (!destination) {
                        destination = {};
                    }
                    aeach(arrayslice(arguments, 1),
                        function(object) {
                            oeach(object,
                                function(value, key) {
                                    destination[key] = value;
                                });
                        });
                    return destination;
                };
            },
            
            mixin = mkmixin(1, each),
            rmixin = mkmixin(-1, each),
            
            mixinsafe = mkmixin(1, eachsafe),
            rmixinsafe = mkmixin(-1, eachsafe),
            
            mixinowned = mkmixin(1, eachowned),
            rmixinowned = mkmixin(-1, eachowned),
            
            mixinsafeowned = mkmixin(1, eachsafeowned),
            rmixinsafeowned = mkmixin(-1, eachsafeowned);
        
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
