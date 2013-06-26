define(
    [
        "../language/_base",
        "../function/_base"
    ],
    function(language, fn) {
        
        var 
            // Convenience / compression aliases.
            root = language.root,
            pname = language.pname,
            
            Object = root.Object,
            ObjectPrototype = Object[pname],
            
            objectHasOwnProperty = ObjectPrototype.hasOwnProperty,
            objectToString = ObjectPrototype.toString,
            objectValueOf = ObjectPrototype.valueOf,
            
            // "Unbind" object's methods so they can be called
            // in functional style. Use a better name for hasOwnProperty().
            owns = fn(objectHasOwnProperty),
            toString = fn(objectToString),
            valueOf = fn(objectValueOf),
            
            // object()
            object = function() {
                
                // TODO: this should do something useful, like create an Object
                // from various kinds of parameters.
            };
        
        
        // Exports.
        object.proto = ObjectPrototype;
        object.owns = owns;
        object.toString = toString;
        object.valueOf = valueOf;
        
        return object;
    }
);
