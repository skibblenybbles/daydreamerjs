define(
    [
        "../kernel",
        "module"
    ],
    function(kernel, module) {
        
        var
            // The overrides configuration.
            overrides = module.config(),
            
            // Imports.
            root = kernel.root,
            kernelLanguage = kernel.language,
            
            isString = kernelLanguage.isString,
            isFunction = kernelLanguage.isFunction,
            isHostType = kernelLanguage.isHostType,
            
            // The document object.
            doc = isHostType(root, "document") && root.document,
            
            // A generic <div> for element testing.
            div = doc &&
                isHostType(doc, "createElement") && 
                doc.createElement("DiV"),
            
            // The cache of has() test results.
            cache = {},
            
            // Does the environment has the given feature?
            has = function(name) {
                if (isFunction(cache[name])) {
                    cache[name] = cache[name](root, doc, div);
                }
                return cache[name];
            },
            
            // Add a test, optionally immediately evaluated.
            add = function(name, test, immediate) {
                cache[name] = name in overrides
                    ? overrides[name]
                    : immediate 
                        ? test(root, doc, div) 
                        : test;
            },
            
            // Test support for a CSS property on an optional DOM element.
            // The element defaults to the generic testing <div> element.
            prefixes = ["Webkit", "Moz", "O", "ms", "Khtml"],
            css = function(name, element) {
                var style,
                    length,
                    i;
                
                element = element || div;
                style = element.style;
                
                if (isString(style, name)) {
                    return true;
                } else {
                    // Capitalize the first letter in the name.
                    name = name.slice(0, 1).toUpperCase() + 
                        name.slice(1);
                    for (i = 0, length = prefixes.length; i < length; i ++) {
                        if (isString(style[prefixes[i] + name])) {
                            return true;
                        }
                    }
                }
                return false;
            },
            
            // Clear the optional DOM element of all children.
            // Defaults to the generic testing <div> element.
            clear = function(element) {
                element = element || div;
                while (element.lastChild) {
                    element.removeChild(element.lastChild);
                }
                return element;
            };
        
        // Exports.
        has.add = add;
        has.css = css;
        has.clear = clear;
        
        return has;
    }
);
