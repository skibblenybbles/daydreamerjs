define(
    [
        "../kernel",
        "../function/_base"
    ],
    function(kernel, fn) {
        
        var 
            // Imports.
            root = kernel.root,
            pname = kernel.pname,
            kernelArray = kernel.array,
            
            concat = kernelArray.concat,
            slice = kernelArray.slice,
            
            // Aliases.
            Array = root.Array,
            ArrayPrototype = Array[pname],
            
            arrayJoin = ArrayPrototype.join,
            arrayPop = ArrayPrototype.pop,
            arrayPush = ArrayPrototype.push,
            arrayReverse = ArrayPrototype.reverse,
            arrayShift = ArrayPrototype.shift,
            arraySort = ArrayPrototype.sort,
            arraySplice = ArrayPrototype.splice,
            arrayUnshift = ArrayPrototype.unfshift,
            
            // "Unbind" Array's methods so they can be called
            // in functional style.
            join = fn(arrayJoin),
            pop = fn(arrayPop),
            push = fn(arrayPush),
            reverse = fn(arrayReverse),
            shift = fn(arrayShift),
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
        array.slice = slice;
        array.join = join;
        array.pop = pop;
        array.push = push;
        array.reverse = reverse;
        array.shift = shift;
        array.sort = sort;
        array.splice = splice;
        array.unshift = unshift;
        
        return array;
    }
);
