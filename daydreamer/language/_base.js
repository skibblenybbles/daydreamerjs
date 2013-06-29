define(
    [],
    function() {
        
        var
            // The root object.
            root = this,
            
            // Special property names for convenience / compression.
            cname = "constructor",
            pname = "prototype",
            lname = "length",
            
            // A variable name for null.
            nil = null,
            
            // language(). Silly.
            language = function(name) {
                return name === "JavaScript";
            };
        
        // Exports.
        language.root = root;
        language.cname = cname;
        language.pname = pname;
        language.lname = lname;
        language.nil = nil;
        
        return language;
    }
);
