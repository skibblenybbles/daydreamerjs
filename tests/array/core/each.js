define(
    [
        "array/core/each"
    ],
    function(array) {
        
        var 
            // The global root.
            root = this,
            
            // Some literal values for === testing.
            literals = [
                undefined,
                null,
                0,
                1,
                Math.PI,
                {},
                [],
                function() {},
                / /
            ];
        
        ///////////////////////////////////////////////////////////////////////
        module("array/core/each | ieach()");
        
        test("basics", function() {
            var count;
            
            count = 0;
            array.ieach([], function() { count++; });
            ok(count === 0,
                "zero forward iterations for an empty array");
            
            count = 0;
            array.ieach([null], function() { count++; });
            ok(count === 1,
                "one forward iteration for an array of length 1");
            
            count = 0;
            array.ieach([null, null], function() { count++; });
            ok(count === 2,
                "two forward iterations for an array of length 2");
            
            count = 0;
            array.ieach([], function() { count++; }, null, null, null, -1);
            ok(count === 0,
                "zero reverse iterations for an empty array");
            
            count = 0;
            array.ieach([null], function() { count++; }, null, null, null, -1);
            ok(count === 1,
                "one reverse iteration for an array of length 1");
            
            count = 0;
            array.ieach([null, null], function() { count++; }, null, null, null, -1);
            ok(count === 2,
                "two reverse iterations for an array of length 2");
        });
        
        test("callback this context", function() {
            var values = [null, null],
                obj = {};
            
            array.ieach(values, function() {
                ok(this === root,
                    "global this context when unspecified in a forward iteration");
            });
            
            array.ieach(values, function() {
                ok(this === obj,
                    "given this context when specified in a forward iteration");
            }, obj);
            
            array.ieach(values, function() {
                ok(this === root,
                    "global this context when unspecified in a reverse iteration");
            }, null, null, null, -1);
            
            array.ieach(values, function() {
                ok(this === obj,
                    "given this context when specified in a reverse iteration");
            }, obj, null, null, -1);
        });
        
        test("callback stop argument", function() {
            var obj = {},
                undef = void 0,
                values = [null, null],
                count;
            
            count = 0;
            ok(undef === array.ieach(values,
                function(stop) {
                    count++;
                    return stop();
                }),
                "calling stop with no arguments yields undefined");
            ok(count === 1,
                "iteration halts after a call to stop");
            
            count = 0;
            ok(obj === array.ieach(values,
                function(stop) {
                    count++;
                    return stop(obj);
                }),
                "calling stop with an argument yields the argument");
            ok(count === 1,
                "iteration halts after a call to stop");
            
            count = 0;
            ok(undef === array.ieach(values,
                function(stop) {
                    stop();
                    count++;
                }),
                "an ieach callback with no return yields undefined");
            ok(count === 1,
                "iteration halts after a call to stop");
            
            count = 0;
            ok(obj === array.ieach(values,
                function(stop) {
                    stop();
                    count++;
                    return obj;
                }),
                "an ieach callback yields the returned object");
            ok(count === 1,
                "iteration halts after a call to stop");
        });
        
        test("callback value argument", function() {
            var count,
                i;
            
            count = 0;
            i = 0;
            array.ieach(literals, function(stop, value) {
                ok(value === literals[i],
                    "the value " + literals[i] + " is visited in a forward iteration");
                i++;
                count++;
            });
            ok(count === literals.length,
                "all values are visited by forward ieach iterations");
            
            count = 0;
            i = literals.length - 1;
            array.ieach(literals, function(stop, value) {
                ok(value === literals[i],
                    "the value " + literals[i] + " is visited in a reverse iteration");
                i--;
                count++;
            }, null, null, null, -1);
            ok(count === literals.length,
                "all values are visited by reverse ieach iterations");
        });
        
        test("callback index argument", function() {
            var values = [null, null],
                i;
            
            i = 0;
            array.ieach(values, function(stop, value, index) {
                ok(index === i,
                    "the index is correct for a forward iteration");
                i++;
            });
            
            i = values.length - 1;
            array.ieach(values, function(stop, value, index) {
                ok(index === i,
                    "the index is correct for a reverse iteration");
                i--;
            }, null, null, null, -1);
        });
        
        test("callback array argument", function() {
            var values = [null, null];
            
            array.ieach(values, function(stop, value, index, array) {
                ok(array === values,
                    "the array is correct for a forward iteration");
            });
            
            array.ieach(values, function(stop, value, index, array) {
                ok(array === values,
                    "the array is correct for a reverse iteration");
            }, null, null, null, -1);
        });
        
        test("return", function() {
            var undef = void 0,
                obj = {},
                empty = [],
                values = [null, null];
            
            ok(undef === array.ieach(empty, function() {}),
                "an ieach callback with no return over an empty array yields undefined");
            
            ok(undef === array.ieach(values, function() {}),
                "an ieach callback with no return over a non-empty array yields undefined");
            
            ok(undef === array.ieach(empty, function() { return obj; }),
                "an ieach callback with a return over an empty array yields undefined");
            
            ok(obj === array.ieach(values, function() { return obj; }),
                "an ieach callback with a return over a non-empty array yields the returned value");
        });
        
        
        ///////////////////////////////////////////////////////////////////////
        module("array/core/each | each()");
        
        test("basics", function() {
            var count;
            
            count = 0;
            array.each([], function() { count++; });
            ok(count === 0,
                "zero iterations for an empty array");
        
            count = 0;
            array.each([null], function() { count++; });
            ok(count === 1,
                "one iteration for an array of length 1");
        
            count = 0;
            array.each([null, null], function() { count++; });
            ok(count === 2,
                "two iterations for an array of length 2");
        });
        
        test("callback this context", function() {
            var obj = {},
                values = [null, null];
            
            array.each(values, function() {
                ok(this === root,
                    "global this context when unspecified");
            });
            
            array.each(values, function() {
                ok(this === obj,
                    "given this context when specified");
            }, obj);
        });
        
        test("callback value argument", function() {
            var i = 0,
                count = 0;
        
            array.each(literals, function(value) {
                ok(value === literals[i],
                    "the value " + literals[i] + " is visited in an iteration");
                i++;
                count++;
            });
            ok(count === literals.length,
                "all values are visited by each iterations")
        });
        
        test("callback index argument", function() {
            var values = [null, null],
                i;
            
            i = 0;
            array.each(values, function(value, index) {
                ok(index === i,
                    "the index is correct for an iteration");
                i++;
            });
        });
        
        test("callback array argument", function() {
            var values = [null, null];
            
            array.each(values, function(value, index, array) {
                ok(array === values,
                    "the array is correct for an iteration");
            });
        });
        
        test("return", function() {
            var undef = void 0,
                obj = {},
                empty = [],
                values = [null, null];
            
            ok(undef === array.each(empty, function() {}),
                "an each callback with no return over an empty array yields undefined");
                
            ok(undef === array.each(values, function() {}),
                "an each callback with no return over a non-empty array yields undefined");
            
            ok(undef === array.each(empty, function() { return obj; }),
                "an each callback with a return over an empty array yields undefined");
            
            ok(undef === array.each(values, function() { return obj; }),
                "an each callback with a return over a non-empty array yields undefined");
        });
        
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | reach()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | all()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | rall()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | any()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | rany()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | find()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | rfind()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | index()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | rindex()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/core/each | sliced()");
    }
);
