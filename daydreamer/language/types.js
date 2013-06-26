define(
    [
        "./_base",
        "../function/_base",
        "../object/_base"
    ],
    function(language, fn, object) {
        
        var
            // The global object.
            root = language.root,
            
            // Convenience / compression aliases.
            undefined = void 0,
            Number = root.Number,
            String = root.String,
            Boolean = root.Boolean,
            Object = root.Object,
            Array = root.Array,
            ArrayIsArray = Array.isArray,
            toString = object.toString,
            
            // String names of built-in types.
            // We'll use the "typeof" names for well-behaved types and 
            // the "nativeToString()" names for typeofs that don't behave similarly
            // across platforms.
            nameUndefined = typeof undefined,
            nameNumber = typeof 0,
            nameString = typeof "",
            nameBoolean = typeof true,
            nameObject = typeof {},
            nameArray = toString([]),
            nameRegExp = toString(/ /),
            nameFunction = toString(function() {}),
            
            // Safely resolve a value, given an object and property.
            // This masks lookups like obj[undefined], but that's
            // the price we have to pay to keep this relatively cheap.
            resolve = function(obj, property) {
                return typeof property !== nameUndefined
                    ? obj !== null && typeof obj !== nameUndefined
                        ? obj[property]
                        : undefined
                    : obj;
            },
            
            // Is the given object or property undefined?
            isUndefined = function(obj, property) {
                return resolve(obj, property) === undefined;
            },
            
            // Is the given object or property a Number?
            isNumber = function(obj, property) {
                obj = resolve(obj, property);
                return typeof obj === nameNumber || obj instanceof Number;
            },
            
            // Is the given object or property a finite Number?
            isFiniteNumber = function(obj, property) {
                obj = resolve(obj, property);
                return (typeof obj === nameNumber || obj instanceof Number) &&
                    isFinite(obj);
            },
            
            // Is the given object or property a String?
            isString = function(obj, property) {
                obj = resolve(obj, property);
                return typeof obj === nameString || obj instanceof String;
            },
            
            // Is the given object or property a Boolean?
            isBoolean = function(obj, property) {
                obj = resolve(obj, property);
                return obj === true || 
                    obj === false || 
                    typeof obj === nameBoolean || 
                    obj instanceof Boolean;
            },
            
            // Is the given object or property an Object?
            isObject = function(obj, property) {
                obj = resolve(obj, property);
                return obj !== undefined && (
                    obj === null ||
                    typeof obj === nameObject ||
                    isArray(obj) ||
                    isRegExp(obj) ||
                    isFunction(obj));
            },
            
            // Is the given object or property an Object literal or "new"
            // instance of Object?
            isObjectLiteral = function(obj, property) {
                obj = resolve(obj, property);
                return obj && obj.constructor === Object;
            },
            
            // Is the given object or property an Array?
            // (defer to the built-in, if available)
            isArray = ArrayIsArray
                ? function(obj, property) {
                    return ArrayIsArray(resolve(obj, property));
                }
                : function(obj, property) {
                    obj = resolve(obj, property);
                    return obj instanceof Array || 
                        toString(obj) === nameArray;
                },
            
            // Is the given object or property "like" an Array?
            isArrayLike = function(obj, property) {
                var tagName;
                obj = resolve(obj, property);
                tagName = obj.tagName;
                return obj && 
                    obj !== undefined &&
                    !isString(obj) &&
                    !isFunction(obj) &&
                    !(tagName && tagName.toLowerCase() === "form") &&
                    (isArray(obj) || isFinite(obj.length));
            },
            
            // Is the given object or property a RegExp?
            isRegExp = function(obj, property) {
                obj = resolve(obj, property);
                return toString(obj) === nameRegExp;
            },
            
            // Is the given object or property a Function?
            isFunction = function(obj, property) {
                obj = resolve(obj, property);
                return toString(obj) === nameFunction;
            },
            
            // Is the given object or property a built-in or something
            // else that should be reported as a function?
            // This is called an "alien" in Crockford's terminology.
            isFunctionLike = function(obj, property) {
                obj = resolve(obj, property);
                return obj &&
                    !isFunction(obj) &&
                    /\{\s*\[native code]\]\s*\}/.test(String(obj));
            },
            
            // Is the given object or property a special type provided by
            // the host environment, which may vary across environments?
            // This is used by the has.js implementation. Use it at your 
            // own risk.
            nonHostTypes = {},
            isHostType = function(obj, property) {
                var value = resolve(obj, property),
                    type = typeof value;
                return type === nameObject ?
                    !!value
                    : !nonHostTypes[type];
            };
        
        // Populate the non-host types.
        nonHostTypes[nameUndefined] = true;
        nonHostTypes[nameNumber] = true;
        nonHostTypes[nameString] = true;
        nonHostTypes[nameBoolean] = true;
        
        // Exports.
        language.isUndefined = isUndefined;
        language.isNumber = isNumber;
        language.isFiniteNumber = isFiniteNumber;
        language.isString = isString;
        language.isBoolean = isBoolean;
        language.isObject = isObject;
        language.isObjectLiteral = isObjectLiteral;
        language.isArray = isArray;
        language.isArrayLike = isArrayLike;
        language.isRegExp = isRegExp;
        language.isFunction = isFunction;
        language.isFunctionLike = isFunctionLike;
        language.isHostType = isHostType;
        
        return language;
    }
);