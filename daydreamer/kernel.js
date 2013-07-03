define(
    [],
    function() {
        
        // The DayDreamerJS kernel. Here, we define the common functionality
        // that is needed to bootstrap the has.js implementation and language
        // extensions and normalizations.
        // 
        // This is also used as an internal module to share definitions
        // amongst modules as they are defined.
        //
        // This should be considered an internal API subject to change.
        var
            // The root object.
            root = this,
            
            // Special property names for convenience / compression.
            cname = "constructor",
            pname = "prototype",
            lname = "length",
            
            // Variable names for undefined and null.
            undef = void 0,
            nil = null,
            
            // Aliases.
            Object = root.Object,
            ObjectPrototype = Object[pname],
            objectToString = ObjectPrototype.toString,
            
            Number = root.Number,
            
            // Call Object's toString() on the given object.
            string = function(obj) {
                return objectToString.call(obj);
            },
            
            // String names of built-in types.
            // We'll use the "typeof" names for well-behaved types and 
            // the "nativeToString()" names for typeofs that don't behave similarly
            // across platforms.
            nameUndefined = typeof undef,
            nameNumber = typeof 0,
            nameString = typeof "",
            nameBoolean = typeof true,
            nameObject = typeof {},
            nameFunction = string(function() {}),
            
            // Is the given object a Number?
            isNumber = function(obj) {
                return typeof obj === nameNumber || obj instanceof Number;
            },
            
            // Is the given object a String?
            isString = function(obj) {
                return typeof obj === nameString || obj instanceof String;
            },
            
            // Is the given object a Function?
            isFunction = function(obj) {
                return string(obj) === nameFunction;
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
            // This masks lookups like obj[undef].
            get = function(obj, property) {
                return typeof property !== nameUndefined
                    ? obj !== nil && typeof obj !== nameUndefined
                        ? obj[property]
                        : undef
                    : obj;
            },
            
            // The export object.
            kernel = {};
        
        // Populate the non-host types.
        nonHostTypes[nameUndefined] = true;
        nonHostTypes[nameNumber] = true;
        nonHostTypes[nameString] = true;
        nonHostTypes[nameBoolean] = true;
        
        // Exports.
        kernel.root = root;
        kernel.cname = cname;
        kernel.pname = pname;
        kernel.lname = lname;
        
        // The exported module sharing object used to avoid writing
        // redundant definitions.
        kernel.array = {};
        kernel.language = {
            isNumber: isNumber,
            isString: isString,
            isFunction: isFunction,
            isHostType: isHostType
        };
        kernel.object = {
            string: string
        };
        
        return kernel;
    }
);
