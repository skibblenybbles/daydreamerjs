define(
    [
        "array/each"
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
        module("array/each | ieach()");
        
        test("basics", function() {
            var count;
            
            count = 0;
            array.ieach([], function() { count++; });
            ok(count === 0);
            
            count = 0;
            array.ieach([null], function() { count++; });
            ok(count === 1);
            
            count = 0;
            array.ieach([null, null], function() { count++; });
            ok(count === 2);
            
            count = 0;
            array.ieach([], function() { count++; }, null, null, null, -1);
            ok(count === 0);
            
            count = 0;
            array.ieach([null], function() { count++; }, null, null, null, -1);
            ok(count === 1);
            
            count = 0;
            array.ieach([null, null], function() { count++; }, null, null, null, -1);
            ok(count === 2);
        });
        
        test("callback this context", function() {
            var obj = {};
            
            array.ieach([null], function() {
                ok(this === root);
            });
            
            array.ieach([null], function() {
                ok(this === obj);
            }, obj);
        });
        
        test("callback stop argument", function() {
            var obj = {},
                undef = void 0,
                count;
            
            count = 0;
            ok(undef === array.ieach([null, null], function(stop) {
                count++;
                return stop();
            }));
            ok(count === 1);
            
            count = 0;
            ok(obj === array.ieach([null, null], function(stop) {
                count++;
                return stop(obj);
            }));
            ok(count === 1);
            
            count = 0;
            ok(undef === array.ieach([null, null], function(stop) {
                stop();
                count++;
            }));
            ok(count === 1);
            
            count = 0;
            ok(obj === array.ieach([null, null], function(stop) {
                stop();
                count++;
                return obj;
            }));
            ok(count === 1);
        });
        
        test("callback value argument", function() {
            var i = 0;
        
            array.ieach(literals, function(stop, value) {
                ok(value === literals[i]);
                i++;
            });
        });
        
        test("callback index argument", function() {
            var i;
        
            i = 0;
            array.ieach([null], function(stop, value, index) {
                ok(index === i);
                i++;
            });
        
            i = 0;
            array.ieach([null], function(stop, value, index) {
                ok(index === i);
                i++;
            });
        });
        
        test("callback array argument", function() {
            var values;
            
            values = [null];
            array.ieach(values, function(stop, value, index, array) {
                ok(array === values);
            });
            
            values = [null, null];
            array.ieach(values, function(stop, value, index, array) {
                ok(array === values);
            });
        });
        
        test("return", function() {
            var undef = void 0;
            
            ok(undef === array.ieach([], function() {}));
            ok(undef === array.ieach([null], function() {}));
            ok(undef === array.ieach([null, null], function() {}));
            ok(undef === array.ieach([], function() { return true; }));
            ok(true === array.ieach([null], function() { return true; }));
            ok(true === array.ieach([null, null], function() { return true; }));
        });
        
        
        ///////////////////////////////////////////////////////////////////////
        module("array/each | each()");
        
        test("basics", function() {
            var count;
            
            count = 0;
            array.each([], function() { count++; });
            ok(count === 0);
        
            count = 0;
            array.each([null], function() { count++; });
            ok(count === 1);
        
            count = 0;
            array.each([null, null], function() { count++; });
            ok(count === 2);
        });
        
        test("callback this context", function() {
            var obj = {};
            
            array.each([null], function() {
                ok(this === root);
            });
            
            array.each([null], function() {
                ok(this === obj);
            }, obj);
        });
        
        test("callback value argument", function() {
            var i = 0;
        
            array.each(literals, function(value) {
                ok(value === literals[i]);
                i++;
            });
        });
        
        test("callback index argument", function() {
            var i;
        
            i = 0;
            array.each([null], function(value, index) {
                ok(index === i);
                i++;
            });
        
            i = 0;
            array.each([null], function(value, index) {
                ok(index === i);
                i++;
            });
        });
        
        test("callback array argument", function() {
            var values;
            
            values = [null];
            array.each(values, function(value, index, array) {
                ok(array === values);
            });
            
            values = [null, null];
            array.each(values, function(value, index, array) {
                ok(array === values);
            });
        });
        
        test("return", function() {
            var undef = void 0;
            
            ok(undef === array.each([], function() {}));
            ok(undef === array.each([null], function() {}));
            ok(undef === array.each([null, null], function() {}));
            ok(undef === array.each([], function() { return true; }));
            ok(undef === array.each([null], function() { return true; }));
            ok(undef === array.each([null, null], function() { return true; }));
        });
        
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | reach()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | all()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | rall()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | any()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | rany()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | find()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | rfind()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | index()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | rindex()");
        
        ///////////////////////////////////////////////////////////////////////
        //module("array/each | sliced()");
    }
);
