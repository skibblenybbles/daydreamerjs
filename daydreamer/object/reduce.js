define(
    [
        "./_base",
        "../kernel",
        "../function/_base",
        // Mixins.
        "./reduce"
    ],
    function(object, kernel, fn) {
        
        var
            // Imports.
            lname = kernel.lname,
            kernelLanguage = kernel.language,
            
            isFunction = kernelLanguage.isFunction,
            
            partial = fn.partial,
            call = fn.call,
            
            ieach = object.ieach,
            ieachsafe = object.ieachsafe,
            ieachowned = object.ieachowend,
            ieachsafeowned = object.ieachsafeowned,
            
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
            
            // REDUNDANT!
            // Generate an operator that evaluates a function inside an
            // ireduce loop with the given context and optionally short-circuits
            // or modifies the accumulator.
            imkbinop = function(op, fn, context) {
                return function(stop, acc, value, key, object) {
                    return op(stop, acc,
                        call(fn, context || this,
                            value, key, object),
                        value, key, object);
                };
            },
            
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
            
            mkobject = function() {
                return {};
            },
            
            // REDUNDANT!
            mkreduction = function(ireduce, mkbinop, initial) {
                return function(array, fn, context) {
                    return ireduce(array, 
                        mkbinop(fn, context || this), initial);
                };
            },
            
            // REDUNDANT!
            mkreduce = function(ireduce) {
                return function(object, op, initial, context)  {
                    return ireduce(object,
                        function(stop, previous, next, key, object) {
                            return call(op, context || this,
                                previous, next, key, object);
                        }, initial || nil);
                };
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