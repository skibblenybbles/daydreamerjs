define(
    [
        "./_base",
        "../kernel",
        "../has/bugs/for-in",
        "../language/for-in",
        "../function/_base",
        "../iteration/core/each"
    ],
    function(object, kernel, has, language, fn, iteration) {
        
        var 
            // Imports.
            owns = object.owns,
            
            cname = kernel.cname,
            lname = kernel.lname,
            nil = kernel.nil,
            
            shadowed = language.shadowed,
            shadowedLength = shadowed[lname],
            
            call = fn.call,
            partial = fn.partial,
            
            id = iteration.id,
            ifid = iteration.ifid,
            and = iteration.and,
            or = iteration.or,
            mkeach = iteration.mkeach,
            mkkey = iteration.mkkey,
            
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
                            if (allow(value, key, object)) {
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
            
            mkobjecteach = partial(mkeach,
                ieach, nil),
            
            mkobjecteachsafe = partial(mkeach,
                ieachsafe, nil),
            
            mkobjecteachowned = partial(mkeach,
                ieachowned, nil),
            
            mkobjecteachsafeowned = partial(mkeach,
                ieachsafeowned, nil),
            
            // Define array-like iterators.
            each = mkobjecteach(id),
            eachsafe = mkobjecteachsafe(id),
            eachowned = mkobjecteachowned(id),
            eachsafeowned = mkobjecteachsafeowned(id),
            
            find = mkobjecteach(ifid),
            findsafe = mkobjecteachsafe(ifid),
            findowned = mkobjecteachowned(ifid),
            findsafeowned = mkobjecteachsafeowned(ifid),
            
            all = mkobjecteach(and, true),
            allsafe = mkobjecteachsafe(and, true),
            allowned = mkobjecteachowned(and, true),
            allsafeowned = mkobjecteachsafeowned(and, true),
            
            any = mkobjecteach(or, false),
            anysafe = mkobjecteachsafe(or, false),
            anyowned = mkobjecteachowned(or, false),
            anysafeowned = mkobjecteachsafeowned(or, false),
            
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
