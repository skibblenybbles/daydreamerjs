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
            lname = kernel.lname,
            
            Math = root.Math,
            min = Math.min,
            max = Math.max,
            
            String = root.String,
            StringPrototype = String[pname],
            
            stringCharAt = StringPrototype.charAt,
            stringCharCodeAt = StringPrototype.charCodeAt,
            stringConcat = StringPrototype.concat,
            stringFromCharCode = StringPrototype.fromCharCode,
            stringIndexOf = StringPrototype.indexOf,
            stringLastIndexOf = StringPrototype.lastIndexOf,
            stringMatch = StringPrototype.match,
            stringReplace = StringPrototype.replace,
            stringSearch = StringPrototype.search,
            stringSlice = StringPrototype.slice,
            stringSplit = StringPrototype.split,
            stringSubstr = StringPrototype.substr,
            stringSubstring = StringPrototype.substring,
            stringToLowerCase = StringPrototype.toLowerCase,
            stringToUpperCase = StringPrototype.toUpperCase,
            
            stringContains = StringPrototype.contains,
            stringEndsWith = StringPrototype.endsWith,
            stringLocaleCompare = StringPrototype.localeCompare,
            stringQuote = StringPrototype.quote,
            stringStartsWith = StringPrototype.startsWith,
            stringToLocaleLowerCase = StringPrototype.toLocaleLowerCase,
            stringToLocaleUpperCase = StringPrototype.toLocaleUpperCase,
            stringTrim = StringPrototype.trim,
            stringTrimLeft = StringPrototype.trimLeft,
            stringTrimRight = StringPrototype.trimRight,
            
            // "Unbind" String's methods so they can be called
            // in functional style. Use better names throughout.
            
            // TODO: research bugs in these!
            chr = fn(stringCharAt),
            code = fn(stringCharCodeAt),
            concat = fn(stringConcat),
            find = fn(stringIndexOf),
            rfind = fn(stringLastIndexOf),
            match = fn(stringMatch),
            replace = fn(stringReplace),
            search = fn(stringSearch),
            slice = fn(stringSlice),
            split = fn(stringSplit),
            range = fn(stringSubstring),
            lower = stringToLocaleLowerCase
                ? fn(stringToLocaleLowerCase)
                : fn(stringToLowerCase),
            upper = stringToLocaleUpperCase
                ? fn(stringToLocaleUpperCase)
                : fn(stringToUpperCase),
            
            contains = stringContains
                ? fn(stringContains)
                : function(string, pattern, start) {
                    return find(string, pattern, start) >= 0;
                },
            
            starts = stringStartsWith
                ? fn(stringStartsWith)
                : function(string, pattern, start) {
                    var length = string[lname],
                        plength = pattern[lname],
                        end;
                    
                    start = min(length, max(0, start || 0));
                    end = min(length, start + plength);
                    return plength > (end - start)
                        ? false
                        : contains(
                            range(string, start, end),
                            pattern);
                },
            
            ends = stringEndsWith
                ? fn(stringEndsWith)
                : function(string, pattern, end) {
                    var length = string[lname],
                        plength = pattern[lname],
                        start;
                    
                    end = min(length, max(0, end || 0));
                    start = max(0, end - plength);
                    return plength > (end - start)
                        ? false
                        : contains(
                            range(string, start, end), 
                            pattern);
                },
            
            //= stringLocaleCompare
            //= stringQuote
            //= stringTrim
            //= stringTrimLeft
            //= stringTrimRight
            
            // The export object.
            string = function(value) {
                return String(value);
            };
        
        
        // Exports.
        string.proto = StringPrototype;
        string.chr = chr;
        string.code = code;
        string.concat = concat;
        string.find = find;
        string.rfind = rfind;
        string.match = match;
        string.replace = replace;
        string.search = search;
        string.slice = slice;
        string.split = split;
        string.range = range;
        string.lower = lower;
        string.upper = upper;
        string.contains = contains;
        string.starts = starts;
        string.ends = ends;
        
        return string;
    }
);
