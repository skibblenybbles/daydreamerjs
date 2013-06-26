define(
    [
        "./_base",
        "../language/for-in",
        "../has/bugs"
    ],
    function(object, language, has) {
    
        var 
            // Convenience / compression aliases.
            owns = object.owns,
            shadowed = language.shadowed,
            shadowedLength = shadowed.length,
            
            // Exclusion data for the constructor property.
            excludeConstructor = {constructor: true},
            
            // An empty object for reference.
            empty = {},
            
            // Mix all properties from the source into the destination,
            // excluding Object's built-ins and optional excludes.
            mixAllProperties = function(destination, source, exclude) {
                var name,
                    value;
                exclude = exclude || {};
                for (name in source) {
                    value = source[name];
                    if ((!(name in empty) || value !== empty[name]) && 
                        !owns(exclude, name)) {
                        destination[name] = value;
                    }
                }
                return destination;
            },
            
            // Mix all "shadowed" properties from the source into the
            // destination for buggy environments, excluding Object's
            // built-ins and optional excludes.
            mixAllShadowed = function(destination, source, exclude) {
                var name,
                    value,
                    i;
                exclude = exclude || {};
                for (i = 0; i < shadowedLength; i++) {
                    name = shadowed[i];
                    value = source[name];
                    if ((!(name in empty) || value !== empty[name]) && 
                        !owns(exclude, name)) {
                        destination[name] = value;
                    }
                }
                return destination;
            },
            
            // Mix all properties from the source into the destination,
            // excluding Object's built-ins and optional excludes,
            // even for buggy environments.
            mixAll = has("bug-for-in-skips-shadowed")
                ? function(destination, source, exclude) {
                    return mixAllShadowed(
                        mixAllProperties(destination, source, exclude),
                        source, exclude);
                }
                : mixAllProperties,
            
            // Mix all properties from several sources into a destination
            // from left to right, excluding Object's built-ins.
            // Create a destination object if none was passed.
            mixin = function(destination) {
                var i,
                    length;
                if (!destination) {
                    destination = {};
                }
                for (i = 1, length = arguments.length; i < length; i++) {
                    mixAll(destination, arguments[i]);
                }
                return destination;
            },
            
            // Mix all properties from several sources into a destination
            // from right to left, excluding Object's built-ins.
            // Create a destination object if none was passed.
            mixinReversed = function(destination) {
                var i;
                if (!destination) {
                    destination = {};
                }
                for (i = arguments.length - 1; i > 0; i--) {
                    mixAll(destination, arguments[i]);
                }
                return destination;
            },
            
            // Mix all properties from several sources into a destination
            // from left to right, excluding Object's built-ins and
            // any constrctor property. Create a destination object
            // if none was passed.
            safeMixin = function(destination) {
                var i,
                    length;
                if (!destination) {
                    destination = {};
                }
                for (i = 1, length = arguments.length; i < length; i++) {
                    mixAll(destination, arguments[i], excludeConstructor);
                }
                return destination;
            },
            
            // Mix all properties from several sources into a destination
            // from right to left, excluding Object's built-ins and
            // any constructor property. Create a destination object
            // if none was passed.
            safeMixinReversed = function(destination) {
                var i;
                if (!destination) {
                    destination = {};
                }
                for (i = arguments.length - 1; i > 0; i--) {
                    mixAll(destination, arguments[i], excludeConstructor);
                }
                return destination;
            },
            
            // Mix owned properties from the source into the destination
            // with optional exclusions.
            mixOwnProperties = function(destination, source, exclude) {
                var name;
                exclude = exclude || {};
                for (name in source) {
                    if (owns(source, name) && !owns(exclude, name)) {
                        destination[name] = source[name];
                    }
                }
                return destination;
            },
            
            // Mix owned "shadowed" properties from the source into the
            // destination with optional exclusions for buggy environments.
            mixOwnShadowed = function(destination, source, exclude) {
                var name,
                    i;
                exclude = exclude || {};
                for (i = 0; i < shadowedLength; i++) {
                    name = shadowed[i];
                    if (owns(source, name) && !owns(exclude, name)) {
                        destination[name] = source[name];
                    }
                }
                return destination;
            },
            
            // Mix owned properties from the source into the destination
            // with optional exclusions, even for buggy environments.
            mixOwn = has("bug-for-in-skips-shadowed")
                ? function(destination, source, exclude) {
                    return mixOwnShadowed(
                        mixAllProperties(destination, source, exclude), 
                        source, exclude);
                }
                : mixAllProperties,
            
            // Mix owned properties from several sources into a destination
            // from left to right. Create a destination object if none was
            // passed.
            ownedMixin = function(destination) {
                var i,
                    length;
                if (!destination) {
                    destination = {};
                }
                for (i = 1, length = arguments.length; i < length; i++) {
                    mixOwn(destination, arguments[i]);
                }
                return destination;
            },
            
            // Mix owned properties from several sources into a destination
            // from right to left. Create a destination object if none was 
            // passed.
            ownedMixinReversed = function(destination) {
                var i;
                if (!destination) {
                    destination = {};
                }
                for (i = arguments.length - 1; i > 0; i--) {
                    mixOwn(destination, arguments[i]);
                }
                return destination;
            },
            
            // Mix owned properties from several sources into a destination
            // from left to right, excluding any constrctor property.
            // Create a destination object if none was passed.
            safeOwnedMixin = function(destination) {
                var i,
                    length;
                if (!destination) {
                    destination = {};
                }
                for (i = 1, length = arguments.length; i < length; i++) {
                    mixOwn(destination, arguments[i], excludeConstructor);
                }
                return destination;
            },
            
            // Mix owned properties from several sources into a destination
            // from right to left, excluding any constrctor property.
            // Create a destination object if none was passed.
            safeOwnedMixinReversed = function(destination) {
                var i;
                if (!destination) {
                    destination = {};
                }
                for (i = arguments.length - 1; i > 0; i--) {
                    mixOwn(destination, arguments[i], excludeConstructor);
                }
                return destination;
            };
        
        
        // Exports.
        object.mixin = mixin;
        object.mixinReversed = mixinReversed;
        object.safeMixin = safeMixin;
        object.safeMixinReversed = safeMixinReversed;
        object.ownedMixin = ownedMixin;
        object.ownedMixinReversed = ownedMixinReversed;
        object.safeOwnedMixin = safeOwnedMixin;
        object.safeOwnedMixinReversed = safeOwnedMixinReversed;
        
        return object;
    }
);
