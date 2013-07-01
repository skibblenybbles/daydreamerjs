define(
    [
        "./_base",
        "../language/_base",
        // Mixins.
        "./each"
    ],
    function(object, language) {
        
        var 
            // Convenience / compression aliases.
            lname = language.lname,
            
            each = object.each,
            eachsafe = object.eachsafe,
            eachowned = object.eachowned,
            eachsafeowned = object.eachsafeowned,
            
            mkmixin = function(step, each) {
                return function(destination) {
                    var args = arguments,
                        length = args[lname],
                        i = step > 0 ? 1 : length - 1;
                    
                    if (!destination) {
                        destination = {};
                    }
                    for (;
                        (step > 0 && i < length) || (step < 0 && i > 0);
                        i += step) {
                        each(args[i],
                            function(value, key) {
                                destination[key] = value;
                            });
                    }
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
