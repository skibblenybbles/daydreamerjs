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
            var sum;
            
            sum = 0;
            array.ieach([], function() { sum++; });
            ok(sum === 0);
            
            sum = 0;
            array.ieach([null], function() { sum++; });
            ok(sum === 1);
            
            sum = 0;
            array.ieach([null, null], function() { sum++; });
            ok(sum === 2);
            
            sum = 0;
            array.ieach([], function() { sum++; }, null, null, null, -1);
            ok(sum === 0);
            
            sum = 0;
            array.ieach([null], function() { sum++; }, null, null, null, -1);
            ok(sum === 1);
            
            sum = 0;
            array.ieach([null, null], function() { sum++; }, null, null, null, -1);
            ok(sum === 2);
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
                sum;
            
            sum = 0;
            ok(obj === array.ieach([null, null], function(stop) {
                sum++;
                return stop(obj);
            }));
            ok(sum === 1);
            
            sum = 0;
            ok(undef === array.ieach([null, null], function(stop) {
                sum++;
                return stop();
            }));
            ok(sum === 1);
            
            sum = 0;
            ok(obj === array.ieach([null, null], function(stop) {
                stop();
                sum++;
                return obj;
            }));
            ok(sum === 1);
            
            sum = 0;
            ok(undef === array.ieach([null, null], function(stop) {
                stop();
                sum++;
            }));
            ok(sum === 1);
            
            sum = 0;
            ok(obj === array.ieach([null, null], function(stop) {
                return stop(obj);
                sum++;
            }));
            ok(sum === 0);
            
            sum = 0;
            ok(undef == array.ieach([null, null], function(stop) {
                return stop();
                sum++;
            }));
            ok(sum === 0);
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
            var sum;
            
            sum = 0;
            array.each([], function() { sum++; });
            ok(sum === 0);
        
            sum = 0;
            array.each([null], function() { sum++; });
            ok(sum === 1);
        
            sum = 0;
            array.each([null, null], function() { sum++; });
            ok(sum === 2);
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
