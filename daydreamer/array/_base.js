define(
    [
        "../language/types",
        "../function/_base"
    ],
    function(language, fn) {
        
        var
            // Convenience / compression aliases.
            undefined = void 0,
            
            root = language.root,
            pname = language.pname,
            lname = language.lname,
            nil = language.nil,
            
            Math = root.Math,
            min = Math.min,
            max = Math.max,
            
            isFunction = language.isFunction,
            isNumber = language.isNumber,
            
            partial = fn.partial,
            call = fn.call,
            
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
            
            // Iterate over each item in an array, with optional slicing
            // and steppning, calling the given function. The callback
            // function is similar to forEach, except it will be passed a
            // function as the first parameter that can be called to stop
            // iteration.
            ieach = function(array, fn, context, start, end, step) {
                var length = array[lname],
                    looping = true,
                    stop = function(value) {
                        looping = false;
                        return value;
                    },
                    result,
                    i;
                
                context = context || this;
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
                } else {
                    start = min(length - 1, start);
                    end = max(-1, end);
                }
                for (i = start; 
                    looping && 
                        ((step > 0 && i < end) || 
                        (step < 0 && i > end));
                    i += step) {
                    result = call(fn, context, 
                        stop, array[i], i, array);
                }
            },
            
            // Generate an iterative array reducer.
            imkreduce = function(step) {
                return function(array, op, initial, context) {
                    var value = isFunction(initial)
                            ? initial()
                            : initial,
                        start = step > 0
                            ? 0
                            : array[lname] - 1;
                    
                    if (arguments[lname] < 3) {
                        value = array[start];
                        start += step;
                    }
                    ieach(array,
                        function(stop, obj, i, array) {
                            value = call(op, this,
                                stop, value, obj, i, array);
                        }, context || this, start, nil, step);
                    return value;
                };
            },
            
            // Generate an operator that evaluates a function inside an ieach
            // loop with the given context and optionally short-circuits or
            // modifies the result.
            imkunop = function(op, fn, context) {
                return function(stop, value, i, array) {
                    return op(stop,
                        call(fn, context || this,
                            value, i, array),
                        value, i, array);
                };
            },
            
            // Generate an operator that evaluates a function inside an
            // ireduce loop with the given context and optionally short-circuits
            // or modifies the accumulator.
            imkbinop = function(op, fn, context) {
                return function(stop, acc, value, i, array) {
                    return op(stop, acc,
                        call(fn, context || this,
                            value, i, array),
                        value, i, array);
                };
            },
            
            // Iterative reduce.
            ireduce = imkreduce(1),
            
            // Iterative right reduce.
            irreduce = imkreduce(-1),
            
            // Identity operator which evaluates a function inside an ieach
            // loop with the  given context.
            id = partial(imkunop, function(stop, result) {
                return result;
            }),
            
            // Short-circuiting identity operator which evaluates a predicate
            // in the given context to determine whether to return the value.
            ifid = partial(imkunop, function(stop, result, value) {
                if (result) {
                    return stop(value);
                }
            }),
            
            // Short-circuiting unary and operator which evaluates a predicate
            // in the given context.
            and = partial(imkunop, function(stop, result) {
                result = !!result;
                return !result ? stop(result) : result;
            }),
            
            // Short-circuiting unary or operator which evaluates a predicate
            // in the given context.
            or = partial(imkunop, function(stop, result) {
                result = !!result;
                return result ? stop(result) : result;
            }),
            
            // Array-accumulating binary operator which evaluates a function
            // in the given context to transform the values to accumulate.
            collect = partial(imkbinop, function(stop, acc, result) {
                push(acc, result);
                return acc;
            }),
            
            // Conditional array-accumulating binary operator which evaluates 
            // a predicate in the given context to determine which of the
            // values to accumulate.
            ifcollect = partial(imkbinop, function(stop, acc, result, value) {
                if (result) {
                    push(acc, value);
                }
                return acc;
            }),
            
            mkarray = function() {
                return [];
            },
            
            mkeach = function(step, mkunop) {
                return function(array, fn, context) {
                    return ieach(array,
                        mkunop(fn, context || this),
                        nil, nil, nil, step);
                };
            },
            
            mkreduce = function(ireducer) {
                return function(array, op, initial, context)  {
                    return ireducer(array,
                        function(stop, previous, next, i, array) {
                            return call(op, context || this,
                                previous, next, i, array);
                        }, initial || nil);
                };
            },
            
            mkreduction = function(ireducer, mkbinop, initial) {
                return function(array, fn, context) {
                    return ireducer(array, 
                        mkbinop(fn, context || this), initial);
                };
            },
            
            mkwhich = function(step) {
                return function(array, item) {
                    ieach(array, function(stop, value, i) {
                        if (item === value) {
                            return stop(i);
                        }
                    }, nil, nil, nil, step);
                    return -1;
                };
            },
            
            // Make a shallow copy of an array or array-like object.
            copy = function(obj) {
                return slice(obj);
            },
            
            // Return a copy of the given array or array-like object sliced 
            // with optionally negative indices and optional stepping,
            // a la Python.
            sliced = function(array, start, end, step) {
                var results = [];
                ieach(array,
                    function(stop, value, i, array) {
                        push(results, value);
                    }, nil, start, end, step);
                return results;
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
            
            each = arrayForEach
                ? fn(arrayForEach)
                : mkeach(1, id),
            
            reach = mkeach(-1, id),
            
            all = arrayEvery
                ? fn(arrayEvery)
                : mkeach(1, and),
            
            rall = mkeach(-1, and),
            
            any = arraySome
                ? fn(arraySome)
                : mkeach(1, or),
            
            rany = mkeach(-1, or),
            
            find = mkeach(1, ifid),
            
            rfind = mkeach(-1, ifid),
            
            reduce = arrayReduce
                ? fn(arrayReduce)
                : mkreduce(ireduce),
            
            rreduce = arrayReduceRight
                ? fn(arrayReduceRight)
                : mkreduce(irreduce),
            
            map = arrayMap
                ? fn(arrayMap)
                : mkreduction(ireduce, collect, mkarray),
            
            rmap = mkreduction(irreduce, collect, mkarray),
            
            filter = arrayFilter
                ? fn(arrayFilter)
                : mkreduction(ireduce, ifcollect, mkarray),
            
            rfilter = mkreduction(irreduce, ifcollect, mkarray),
            
            which = arrayIndexOf
                ? fn(arrayIndexOf)
                : mkwhich(1),
            
            rwhich = arrayLastIndexOf
                ? fn(arrayLastIndexOf)
                : mkwhich(-1),
            
            // Convert the given arguments into an array.
            array = function() {
                return slice(arguments);
            };
            
        
        // Exports.
        array.proto = ArrayPrototype;
        array.copy = copy;
        array.sliced = sliced;
        array.reversed = reversed;
        array.sorted = sorted;
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
        array.all = all;
        array.any = any;
        array.map = map;
        array.reduce = reduce;
        array.each = each;
        array.filter = filter;
        array.which = which;
        array.rwhich = rwhich;        
        array.rreduce = rreduce;
        array.rall = rall;
        array.rfilter = rfilter;
        array.reach = reach;
        array.rmap = rmap;
        array.rany = rany;
        array.find = find;
        array.rfind = rfind;
        
        return array;
    }
);
