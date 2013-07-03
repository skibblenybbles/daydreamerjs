define(
    [
        "module"
    ],
    function(module) {
        
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
            
            // language(). Silly.
            language = function(name) {
                return name === "JavaScript";
            };
        
        // Exports.
        language.root = root;
        language.cname = cname;
        language.pname = pname;
        language.lname = lname;
        language.undef = undef;
        language.nil = nil;
        
        return language;
    }
);
