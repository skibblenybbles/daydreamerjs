define(
    [
        "./_base"
    ],
    function(language) {
        
        var 
            // The names of known "shadowed" for...in properties for old IE.
            shadowed = [
                "constructor",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "toLocaleString",
                "toString",
                "valueOf"
            ];
        
        
        // Exports.
        language.shadowed = shadowed;
        
        return language;
    }
);
