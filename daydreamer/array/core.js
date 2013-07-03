define(
    [
        "./_base",
        // Mixins.
        "./each",
        "./reduce"
    ],
    function(array) {
        
        var
            // Imports.
            slice = array.slice,
            reverse = array.reverse,
            sort = array.sort,
            
            // Make a shallow copy of an array or array-like object.
            copy = function(obj) {
                return slice(obj);
            },
            
            // Return a reversed copy of the given array or array-like object.
            reversed = function(obj) {
                obj = slice(obj);
                reverse(obj);
                return obj;
            },
            
            // Return a sorted copy of the given array or array-like object.
            sorted = function(obj, compare) {
                obj = slice(obj);
                sort(obj, compare);
                return obj;
            };
        
        // Exports.
        array.copy = copy;
        array.reversed = reversed;
        array.sorted = sorted;
        
        return array;
    }
);
