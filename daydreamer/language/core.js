define(
    [
        "./_base",
        "../object/_base"
    ],
    function(language, object) {
        
        var
            // The global object.
            root = language.root,
            nil = language.nil,
            
            // Convenience / compression aliases.
            undefined = void 0,
            Number = root.Number,
            String = root.String,
            Boolean = root.Boolean,
            Object = root.Object,
            Array = root.Array,
            ArrayIsArray = Array.isArray,
            string = object.string,
            
            // String names of built-in types.
            // We'll use the "typeof" names for well-behaved types and 
            // the "nativeToString()" names for typeofs that don't behave similarly
            // across platforms.
            nameUndefined = typeof undefined,
            nameNumber = typeof 0,
            nameString = typeof "",
            nameBoolean = typeof true,
            nameObject = typeof {},
            nameArray = string([]),
            nameRegExp = string(/ /),
            nameFunction = string(function() {}),
            
            // Is the given object undefined?
            isUndefined = function(obj) {
                return obj === undefined;
            },
            
            // Is the given object a Number?
            isNumber = function(obj) {
                return typeof obj === nameNumber || obj instanceof Number;
            },
            
            // Is the given object a finite Number?
            isFiniteNumber = function(obj) {
                return isNumber(obj) && isFinite(obj);
            },
            
            // Is the given object a String?
            isString = function(obj) {
                return typeof obj === nameString || obj instanceof String;
            },
            
            // Is the given object a Boolean?
            isBoolean = function(obj) {
                return obj === true || 
                    obj === false || 
                    typeof obj === nameBoolean || 
                    obj instanceof Boolean;
            },
            
            // Is the given object an Object?
            isObject = function(obj) {
                return obj !== undefined && (
                    obj === nil ||
                    typeof obj === nameObject ||
                    isArray(obj) ||
                    isRegExp(obj) ||
                    isFunction(obj));
            },
            
            // Is the given object an Object literal or "new"
            // instance of Object?
            isObjectLiteral = function(obj) {
                return obj && obj.constructor === Object;
            },
            
            // Is the given object an Array?
            // (defer to the built-in, if available)
            isArray = ArrayIsArray
                ? ArrayIsArray
                : function(obj) {
                    return obj instanceof Array || 
                        string(obj) === nameArray;
                },
            
            // Is the given object "like" an Array?
            isArrayLike = function(obj) {
                var tagName;
                tagName = obj.tagName;
                return obj && 
                    obj !== undefined &&
                    !isString(obj) &&
                    !isFunction(obj) &&
                    !(tagName && tagName.toLowerCase() === "form") &&
                    (isArray(obj) || isFinite(obj.length));
            },
            
            // Is the given object a RegExp?
            isRegExp = function(obj) {
                return string(obj) === nameRegExp;
            },
            
            // Is the given object a Function?
            isFunction = function(obj) {
                return string(obj) === nameFunction;
            },
            
            // Is the given object a built-in or something else that
            // should be reported as a function? This is called an 
            // "alien" in Crockford's terminology.
            isFunctionLike = function(obj) {
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
                var value = get(obj, property),
                    type = typeof value;
                return type === nameObject ?
                    !!value
                    : !nonHostTypes[type];
            },
            
            // Safely gets a value, given an object and property.
            // This masks lookups like obj[undefined].
            get = function(obj, property) {
                return typeof property !== nameUndefined
                    ? obj !== nil && typeof obj !== nameUndefined
                        ? obj[property]
                        : undefined
                    : obj;
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