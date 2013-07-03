define(
    [
        "./_base",
        "../kernel"
    ],
    function(language, kernel) {
        
        var
            // Imports.
            root = kernel.root,
            undef = kernel.undef,
            nil = kernel.nil,
            kernelLanguage = kernel.language,
            kernelObject = kernel.object,
            
            isNumber = kernelLanguage.isNumber,
            isString = kernelLanguage.isString,
            isFunction = kernelLanguage.isFunction,
            isHostType = kernelLanguage.isHostType,
            
            string = kernelObject.string,
            
            // Aliases.
            Number = root.Number,
            String = root.String,
            Boolean = root.Boolean,
            Object = root.Object,
            Array = root.Array,
            ArrayIsArray = Array.isArray,
            
            // String names of built-in types.
            // We'll use the "typeof" names for well-behaved types and 
            // the "nativeToString()" names for typeofs that don't behave similarly
            // across platforms.
            nameBoolean = typeof true,
            nameObject = typeof {},
            nameArray = string([]),
            nameRegExp = string(/ /),
            
            // Is the given object undef?
            isUndefined = function(obj) {
                return obj === undef;
            },
            
            // Is the given object a finite Number?
            isFiniteNumber = function(obj) {
                return isNumber(obj) && isFinite(obj);
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
                return obj !== undef && (
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
                    obj !== undef &&
                    !isString(obj) &&
                    !isFunction(obj) &&
                    !(tagName && tagName.toLowerCase() === "form") &&
                    (isArray(obj) || isFinite(obj.length));
            },
            
            // Is the given object a RegExp?
            isRegExp = function(obj) {
                return string(obj) === nameRegExp;
            },
            
            // Is the given object a built-in or something else that
            // should be reported as a function? This is called an 
            // "alien" in Crockford's terminology.
            isFunctionLike = function(obj) {
                return obj &&
                    !isFunction(obj) &&
                    /\{\s*\[native code]\]\s*\}/.test(String(obj));
            };
        
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