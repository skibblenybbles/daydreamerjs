define(
    [
        "./_base",
        "../kernel",
        "../function/_base",
        "../iteration/core/reduce",
        // Mixins.
        "./reduce"
    ],
    function(object, kernel, fn, iteration) {
        
        var
            // Imports.
            ieach = object.ieach,
            ieachsafe = object.ieachsafe,
            ieachowned = object.ieachowend,
            ieachsafeowned = object.ieachsafeowned,
            
            lname = kernel.lname,
            kernelLanguage = kernel.language,
            
            isFunction = kernelLanguage.isFunction,
            
            partial = fn.partial,
            call = fn.call,
            
            mix = iteration.mix,
            ifmix = iteration.ifmix,
            mkreduction = iteration.mkreduction,
            mkreduce = iteration.mkreduce,
            
            // Generate an iterative object reducer.
            imkreduce = function(ieach) {
                return function(object, op, initial, context) {
                    var initialized = arguments[lname] > 2,
                        value = initialized && isFunction(initial)
                            ? initial()
                            : initial;
                    
                    context = context || this;
                    ieach(object,
                        function(stop, obj, key, object) {
                            if (initialized) {
                                value = call(op, this,
                                    stop, value, obj, key, object);
                            } else {
                                value = obj;
                                initialized = true;
                            }
                        }, context);
                    return value;
                };
            },
            
            // Iterative object reducers.
            ireduce = imkreduce(ieach),
            ireducesafe = imkreduce(ieachsafe),
            ireduceowned = imkreduce(ieachowned),
            ireducesafeowned = imkreduce(ieachsafeowned),
            
            // Make a fresh object.
            mkobject = function() {
                return {};
            },
            
            // Define array-like reducers.
            map = mkreduction(ireduce, mix, mkobject),
            mapsafe = mkreduction(ireducesafe, mix, mkobject),
            mapowned = mkreduction(ireduceowned, mix, mkobject),
            mapsafeowned = mkreduction(ireducesafeowned, mix, mkobject),
            
            filter = mkreduction(ireduce, ifmix, mkobject),
            filtersafe = mkreduction(ireducesafe, ifmix, mkobject),
            filterowned = mkreduction(ireduceowned, ifmix, mkobject),
            filtersafeowned = mkreduction(ireducesafeowned, ifmix, mkobject),
            
            reduce = mkreduce(ireduce),
            reducesafe = mkreduce(ireducesafe),
            reduceowned = mkreduce(ireduceowned),
            reducesafeowned = mkreduce(ireducesafeowned);
        
        // Exports.
        object.ireduce = ireduce;
        object.ireducesafe = reducesafe;
        object.ireduceowned = ireduceowned;
        object.ireducesafeowned = ireducesafeowned;
        object.map = map;
        object.mapsafe = mapsafe;
        object.mapowned = mapowned;
        object.mapsafeowned = mapsafeowned;
        object.filter = filter;
        object.filtersafe = filtersafe;
        object.filterowned = filterowned;
        object.filtersafeowned = filtersafeowned;
        object.reduce = reduce;
        object.reducesafe = reducesafe;
        object.reduceowned = reduceowned;
        object.reducesafeowned = reducesafeowned;
        
        return object;
    }
);