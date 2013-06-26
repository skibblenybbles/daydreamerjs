define(
    [
        "../language/types",
        "../function/_base"
    ],
    function(language, fn) {
        
        var
            // Convenience / compression aliases.
            root = language.root,
            pname = language.pname,
            
            Math = root.Math,
            min = Math.min,
            max = Math.max,
            
            isArray = language.isArray,
            isArrayLike = language.isArrayLike,
            isNumber = language.isNumber,
            isFiniteNumber = language.isFiniteNumber,
            apply = fn.apply,
            call = fn.call,
            before = fn.before,
            around = fn.around,
            
            Array = root.Array,
            ArrayPrototype = Array[pname],
            
            arrayConcat = ArrayPrototype.concat,
            arrayEvery = ArrayPrototype.every,
            arrayFilter = ArrayPrototype.filter,
            arrayForEach = ArrayPrototype.forEach,
            arrayIndexOf = ArrayPrototype.indexOf,
            arrayJoin = ArrayPrototype.join,
            arrayLastIndexOf = ArrayPrototype.lastIndexOf,
            arrayMap = ArrayPrototype.map,
            arrayPop = ArrayPrototype.pop,
            arrayPush = ArrayPrototype.push,
            arrayReduce = ArrayPrototype.reduce,
            arrayReduceRight = ArrayPrototype.reduceRight,
            arrayReverse = ArrayPrototype.reverse,
            arrayShift = ArrayPrototype.shift,
            arraySlice = ArrayPrototype.slice,
            arraySome = ArrayPrototype.some,
            arraySort = ArrayPrototype.sort,
            arraySplice = ArrayPrototype.splice,
            arrayUnshift = ArrayPrototype.unfshift,
            
            // A utility for reversing the array in the first argument.
            reverseFirstArgument = function(obj) {
                return concat(reversed(obj), slice(arguments, 1));
            },
            
            // A utility for inverting the reversing index with respect
            // to the length of the array in the first argument.
            reverseReturnIndex = function(length, obj) {
                return length < 0
                    ? length
                    : obj.length - 1 - length;
            },
            
            // Shallow copy of an array or array-like object.
            copy = function(obj) {
                return slice(obj);
            },
            
            // Return a copy of the given array or array-like object
            // sliced with negative indices and optional stepping,
            // a la Python.
            sliced = function(obj, start, end, step) {
                var array,
                    length,
                    step,
                    i;
                
                // Defer to built-in slice?
                if (!isFiniteNumber(step)) {
                    return slice(obj, start, end);
                }
                
                array = [];
                length = obj.length;
                step = step || 1;
                start = isNumber(start)
                    ? start >= 0
                        ? start
                        : start + length
                    : step > 0
                        ? 0
                        : length - 1;
                end = isNumber(end)
                    ? end >= 0
                        ? end
                        : end + length
                    : step > 0
                        ? length
                        : -1;
                
                if (step > 0) {
                    start = max(0, start);
                    end = min(length, end);
                    for (i = start; i < end; i += step) {
                        push(array, obj[i]);
                    }
                } else {
                    start = min(length - 1, start);
                    end = max(-1, end);
                    for (i = start; i > end; i += step) {
                        push(array, obj[i]);
                    }
                }
                return array;
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
            },
            
            // "Unbind" Array's methods so they can be called
            // in functional style. Use a better names for forEach(),
            // indexOf(), lastIndexOf(), reduceRight() and some().
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
            
            every = arrayEvery
                ? fn(arrayEvery)
                : function(obj, predicate, context) {
                    var result = true,
                        length = obj.length,
                        i;
                    
                    for (i = 0; i < length; i++) {
                        result = result && call(predicate, context || this,
                            obj[i], i, obj);
                        if (!result) {
                            return result;
                        }
                    }
                    return result;
                },
            
            filter = arrayFilter
                ? fn(arrayFilter)
                : function(obj, predicate, context) {
                    var results = [];
                    each(obj, function(value) {
                        if (apply(predicate, context || this, arguments)) {
                            push(results, value);
                        }
                    });
                    return results;
                },
            
            each = arrayForEach
                ? fn(arrayForEach)
                : function(obj, predicate, context) {
                    var results = [],
                        length = obj.length,
                        i;
                    
                    for (i = 0; i < length; i++) {
                        push(results,
                            call(predicate, context || this, obj[i], i, obj));
                    }
                    return results;
                },
            
            which = arrayIndexOf
                ? fn(arrayIndexOf)
                : function(obj, item) {
                    var length = obj.length,
                        i;
                    for (i = 0; i < length; i++) {
                        if (obj[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                },
            
            rwhich = arrayLastIndexOf
                ? fn(arrayLastIndexOf)
                : around(which, reverseFirstArgument, reverseReturnIndex),
            
            map = arrayMap
                ? fn(arrayMap)
                : function(obj, predicate, context) {
                    var results = [];
                    each(obj, function() {
                        push(results,
                            apply(predicate, context || this, arguments));
                    });
                    return results;
                },
            
            reduce = arrayReduce
                ? before(fn(arrayReduce),
                    function(obj, predicate, initial, context) {
                        return [
                            obj, bind(predicate, context), initial, context];
                    })
                : function(obj, predicate, initial, context) {
                    if (arguments.length < 3) {
                        return reduce(
                            slice(obj, 1), predicate, obj[0], context);
                    }
                    each(obj, function(obj, i, array) {
                        initial = call(predicate, context || this, 
                            initial, obj, i, array);
                    });
                    return initial;
                },
            
            rreduce = arrayReduceRight
                ? fn(arrayReduceRight)
                : before(reduce, reverseFirstArgument),
            
            any = arraySome
                ? fn(arraySome)
                : function(obj, predicate, context) {
                    var result = false,
                        length = obj.length,
                        i;
                    
                    for (i = 0; i < length; i++) {
                        result = result || call(predicate, context || this,
                            obj[i], i, obj);
                        if (result) {
                            return result;
                        }
                    }
                    return result;
                },
            
            // Add some other reversed "r*" methods for symmetry.
            revery = before(every, reverseFirstArgument),
            rfilter = before(filter, reverseFirstArgument),
            reach = before(each, reverseFirstArgument),
            rmap = before(map, reverseFirstArgument),
            rany = before(any, reverseFirstArgument),
            
            // Add some other flavor.
            find = function(obj, predicate, context) {
                var result;
                any(obj, function(value) {
                    if (apply(predicate, context || this, arguments)) {
                        result = value;
                        return true;
                    }
                });
                return result;
            },
            
            rfind = before(find, reverseFirstArgument),
            
            // Convert the given arguments into an array.
            array = function() {
                return slice(arguments);
            };
        
        
        // Exports.
        array.proto = ArrayPrototype;
        array.copy = copy;
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
        array.every = every;
        array.filter = filter;
        array.each = each;
        array.which = which;
        array.rwhich = rwhich;
        array.map = map;
        array.reduce = reduce;
        array.rreduce = rreduce;
        array.any = any;
        array.revery = revery;
        array.rfilter = rfilter;
        array.reach = reach;
        array.rmap = rmap;
        array.rany = rany;
        array.find = find;
        array.rfind = rfind;
        
        return array;
    }
);
