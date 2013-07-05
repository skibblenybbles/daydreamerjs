define(
    [
        "../kernel",
        "../function/_base"
    ],
    function(kernel, fn) {
        
        var 
            // Imports.
            root = kernel.root,
            pname = kernel.pname,
            kernelObject = kernel.object,
            
            owns = kernelObject.owns,
            string = kernelObject.string,
            
            // Aliases.
            Object = root.Object,
            ObjectPrototype = Object[pname],
            
            objectValueOf = ObjectPrototype.valueOf,
            
            // "Unbind" object's methods so they can be called
            // in functional style.
            value = fn(objectValueOf),
            
            // object()
            object = function() {
                
                // TODO: this should do something useful, like create an Object
                // from various kinds of parameters.
            };
        
        // Exports.
        object.proto = ObjectPrototype;
        object.owns = owns;
        object.string = string;
        object.value = value;
        
        return object;
    }
);
