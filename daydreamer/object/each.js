define(
    [
        "./_base",
        "../language/_base",
        "../function/_base",
        "../has/bugs/for-in",
        // Mixins.
        "../language/core",
        "../language/for-in"
    ],
    function(object, language, fn, has) {
        
        var 
            // Convenience / compression aliases.
            owns = object.owns,
            shadowed = language.shadowed,
            shadowedLength = shadowed.length,
            
            cname = language.cname,
            lname = language.lname,
            undef = language.undef,
            nil = language.nil,
            
            call = fn.call,
            partial = fn.partial,
            
            // An empty object for reference.
            empty = {},
            
            // Is for...in buggy?
            hasBugForInSkipsShadowed = has("bug-for-in-skips-shadowed"),
            
            // Make a for...in iterator.
            // The allow parameter should be a predicate that takes a value,
            // key and the object to determine whether to include the
            // item in the iteration.
            imkeach = function(allow) {
                return function(object, fn, context) {
                    var looping = true,
                        stop = function(value) {
                            looping = false;
                            return value;
                        },
                        key,
                        value,
                        result,
                        i;
                    
                    for (key in object) {
                        if (!looping) {
                            break;
                        }
                        value = object[key];
                        if (allow(value, key, object)) {
                            result = call(fn, context || this,
                                stop, value, key, object);
                        }
                    }
                    if (hasBugForInSkipsShadowed) {
                        for (i = 0; looping && i < shadowedLength; i++) {
                            key = shadowed[i];
                            value = object[key];
                            if (allow(key, value)) {
                                result = call(fn, context || this,
                                    stop, value, key, object);
                            }
                        }
                    }
                    return result;
                };
            },
            
            // A for...in iterator that includes all owned and inherited
            // enumerable properties in the iteration.
            // The callback function will be called in the given context
            // and will be passed a function that can be called to stop
            // iteration, the value, the key name and the object that is 
            // being iterated over.
            ieach = imkeach(function(value, key) {
                return (!(key in empty) || value !== empty[key]);
            }),
            
            // A for...in iterator that includes all "safe" owned and inherited
            // enumerable properties in the iteration.
            ieachsafe = imkeach(function(value, key) {
                return (!(key in empty) || value !== empty[key]) && 
                    key !== cname;
            }),
            
            // A for...in iterator that includes all owned enumerable
            // properties in the iteration.
            ieachowned = imkeach(function(value, key, object) {
                return owns(object, key);
            }),
            
            // A for...in iterator that includes all "safe" owned enumerable
            // properties in the iteration.
            ieachsafeowned = imkeach(function(value, key, object) {
                return owns(object, key) && key !== cname;
            }),
            
            // REDUNDANT!
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
            
            // REDUNDANT!
            // Identity operator which evaluates a function inside an ieach
            // loop with the given context.
            id = partial(imkunop, function(stop, result) {
                return result;
            }),
            
            // REDUNDANT!
            // Short-circuiting identity operator which evaluates a predicate
            // in the given context to determine whether to return the value.
            ifid = partial(imkunop, function(stop, result, value) {
                if (result) {
                    return stop(value);
                }
            }),
            
            // REDUNDANT!
            // Short-circuiting unary and operator which evaluates a predicate
            // in the given context to determine what boolean value to return.
            and = partial(imkunop, function(stop, result) {
                result = !!result;
                return !result ? stop(result) : result;
            }),
            
            // REDUNDANT!
            // Short-circuiting unary or operator which evaluates a predicate
            // in the given context to determine what boolean value to return.
            or = partial(imkunop, function(stop, result) {
                result = !!result;
                return result ? stop(result) : result;
            }),
            
            // Almost REDUNDANT!
            mkeach = function(ieacher, mkunop, defaultResult) {
                return function(object, fn, context) {
                    var result = ieacher(object,
                        mkunop(fn, context || this));
                    
                    return result !== undef
                        ? result
                        : defaultResult;
                };
            },
            
            // Almost REDUNDANT!
            mkkey = function(ieacher) {
                return function(object, item) {
                    ieacher(object, function(stop, value, key) {
                        if (item === value) {
                            return stop(key);
                        }
                    });
                };
            },
            
            // Define array-like iterators.
            each = mkeach(ieach, id),
            eachsafe = mkeach(ieachsafe, id),
            eachowned = mkeach(ieachowned, id),
            eachsafeowned = mkeach(ieachsafeowned, id),
            
            all = mkeach(ieach, and, true),
            allsafe = mkeach(ieachsafe, and, true),
            allowned = mkeach(ieachowned, and, true),
            allsafeowned = mkeach(ieachsafeowned, and, true),
            
            any = mkeach(ieach, or, false),
            anysafe = mkeach(ieachsafe, or, false),
            anyowned = mkeach(ieachowned, or, false),
            anysafeowned = mkeach(ieachsafeowned, or, false),
            
            find = mkeach(ieach, ifid),
            findsafe = mkeach(ieachsafe, ifid),
            findowned = mkeach(ieachowned, ifid),
            findsafeowned = mkeach(ieachsafeowned, ifid),
            
            key = mkkey(ieach),
            keysafe = mkkey(ieachsafe),
            keyowned = mkkey(ieachowned),
            keysafeowned = mkkey(ieachsafeowned);
        
        // Exports.
        object.ieach = ieach;
        object.ieachsafe = ieachsafe;
        object.ieachowned = ieachowned;
        object.ieachsafeowend = ieachsafeowned;
        object.each = each;
        object.eachsafe = eachsafe;
        object.eachowned = eachowned;
        object.eachsafeowned = eachsafeowned;
        object.all = all;
        object.allsafe = allsafe;
        object.allowned = allowned;
        object.allsafeowned = allsafeowned;
        object.any = any;
        object.anysafe = anysafe;
        object.anyowned = anyowned;
        object.anysafeowned = anysafeowned;
        object.find = find;
        object.findsafe = findsafe;
        object.findowned = findowned;
        object.findsafeowned = findsafeowned;
        object.key = key;
        object.keysafe = keysafe;
        object.keyowned = keyowned;
        object.keysafeowned = keysafeowned;
        
        return object;
    }
);
