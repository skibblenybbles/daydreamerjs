define(
    [
        "./_base",
        "../kernel"
    ],
    function(has, kernel) {
        
        var
            // Imports.
            root = kernel.root,
            pname = kernel.pname,
            kernelLanguage = kernel.language,
            
            isFunction = kernelLanguage.isFunction,
            
            add = has.add,
            
            // Aliases
            Array = root.Array,
            ArrayPrototype = Array[pname];
        
        add("array-foreach", function() {
            return isFunction(ArrayPrototype.forEach);
        });
        
        // TODO: others!
        
        return has;
    }
);
