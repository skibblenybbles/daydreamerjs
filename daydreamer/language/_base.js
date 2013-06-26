define(
    [],
    function() {
        
        var
            // The root object.
            root = this,
            
            // Special property names for convenience / compression.
            cname = "constructor",
            pname = "prototype",
            
            // language(). Silly.
            language = function(name) {
                return name === "JavaScript";
            };
        
        // Exports.
        language.root = root;
        language.cname = cname;
        language.pname = pname;
        
        return language;
    }
);
