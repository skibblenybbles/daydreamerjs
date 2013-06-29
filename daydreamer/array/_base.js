define(
    [
        "../language/_base",
        "../function/_base"
    ],
    function(language, fn) {
        
        var
            // Convenience / compression aliases.
            root = language.root,
            pname = language.pname,
            
            Array = root.Array,
            ArrayPrototype = Array[pname],
            
            arrayConcat = ArrayPrototype.concat,
            arrayJoin = ArrayPrototype.join,
            arrayPop = ArrayPrototype.pop,
            arrayPush = ArrayPrototype.push,
            arrayReverse = ArrayPrototype.reverse,
            arrayShift = ArrayPrototype.shift,
            arraySlice = ArrayPrototype.slice,
            arraySort = ArrayPrototype.sort,
            arraySplice = ArrayPrototype.splice,
            arrayUnshift = ArrayPrototype.unfshift,
            
            // "Unbind" Array's methods so they can be called
            // in functional style. Use better names throughout.
            concat = fn(arrayConcat),
            join = fn(arrayJoin),
            pop = fn(arrayPop),
            push = fn(arrayPush),
            reverse = fn(arrayReverse),
            shift = fn(arrayShift),
            slice = fn(arraySlice),
            sort = fn(arraySort),
            splice = fn(arraySplice),
            unshift = fn(arrayUnshift),
            
            // Convert the given arguments into an array.
            array = function() {
                return slice(arguments);
            };
        
        // Exports.
        array.proto = ArrayPrototype;
        array.concat = concat;
        array.join = join;
        array.pop = pop;
        array.push = push;
        array.reverse = reverse;
        array.shift = shift;
        array.slice = slice;
        array.sort = sort;
        array.splice = splice;
        array.unshift = unshift;
        
        return array;
    }
);
