define(
    [
        "./_base"
    ],
    function(has) {
        
        var
            // Convenience / compression aliases.
            add = has.add,
        
            // Inspect for...in behavior when we iterate over
            // the property names in a simple object that defines
            // its own "toString" property. Correct behavior
            // happens when the expected count is 1.
            inspectForIn = function(expected) {
                var count = 0,
                    property,
                    Test = function() {
                        this.toString = 1;
                    };
                for (property in new Test()) {
                    count += 1;
                }
                return count === expected;
            };
        
        
        // Test for "shadowed" properties skipped in a for...in loop.
        // Note: this is targeted to a known bug in IE6-8. It's not
        // robust, because it does not make any attempt to find shadowed
        // properties. Rather, it tests for the shadowing of "toString"
        // and is used by other features in this library to infer a
        // known set of shadowed properties.
        add("bug-for-in-skips-shadowed", function() {
            return inspectForIn(0);
        });
        
        // Test for "shadowed" properties repeated in a for...in loop.
        // Note: this is targeted to a known bug in Safari 2. It's
        // not robust, because it does not make any attempt to find all
        // repeated, shoadowed properties. This test is not used by this
        // library. The bug is avoided through other logical means.
        add("bug-for-in-repeats-shadowed", function() {
            return inspectForIn(2);
        });
        
        
        // Exports.
        return has;
    }
);